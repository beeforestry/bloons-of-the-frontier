"""t101b: Old San Juan backdrop for El Morro first person.
Data: USGS 3DEP 1 m DEM PR_PRVI_E_2018 tile x80y205 (public domain) + NOAA NGS 2017-09-24 aerial 20170924b-rgb z18 (public domain / CC0).
Frame: morro_real.py FRAME (game px at 0.125 m/px). Window x -9500..1000, y -2500..8000 px; 3 m grid; texture 1536 px.
Run in a venv with rasterio, pyproj, numpy, scipy, pillow:  python oldsj_backdrop.py   (work dir /tmp/osj)
Outputs public/assets/maps/morro/oldsj.dat (gzip: uint8 (h+2)*4 rows x cols, then uint8 built mask) and oldsj.jpg."""
import os; os.makedirs("/tmp/osj", exist_ok=True); os.chdir("/tmp/osj")
# ---------------- step: dem
exec(compile(r'''
import rasterio, numpy as np, math
from rasterio.windows import from_bounds
URL='/vsicurl/https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/1m/Projects/PR_PRVI_E_2018/TIFF/USGS_1m_x80y205_PR_PRVI_E_2018.tif'
cE,cN,a=803757.0,2044655.0,math.radians(142.8);dx,dy=math.cos(a),math.sin(a)
def utm(x,y):
    U=(x-2208)*0.125;V=(y-1488)*0.125;return cE+U*dx+V*dy, cN+U*dy-V*dx
cs=[utm(x,y) for x in (-9500,1000) for y in (-2500,8000)]
Es=[c[0] for c in cs];Ns=[c[1] for c in cs]
print(min(Es),max(Es),min(Ns),max(Ns))
with rasterio.open(URL) as d:
    print(d.bounds, d.res, d.crs, d.nodata)
    w=from_bounds(min(Es),min(Ns),max(Es),max(Ns),d.transform)
    arr=d.read(1,window=w); tr=d.window_transform(w)
    print(arr.shape, np.nanmin(arr), np.nanmax(arr))
    np.save('dem.npy',arr); open('tr.txt','w').write(repr(tuple(tr)[:6]))
''', 'dem', 'exec'))
# ---------------- step: aer
exec(compile(r'''
import math, io, urllib.request, numpy as np, pyproj
from PIL import Image
t=pyproj.Transformer.from_crs(26919,4326,always_xy=True)
cE,cN,a=803757.0,2044655.0,math.radians(142.8);dx,dy=math.cos(a),math.sin(a)
def utm(x,y):
    U=(x-2208)*0.125;V=(y-1488)*0.125;return cE+U*dx+V*dy, cN+U*dy-V*dx
cs=[t.transform(*utm(x,y)) for x in (-9500,1000) for y in (-2500,8000)]
lons=[c[0] for c in cs]; lats=[c[1] for c in cs]
Z=18
def tile(lon,lat): n=2**Z; x=(lon+180)/360*n; y=(1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*n; return x,y
x0,y0=tile(min(lons),max(lats)); x1,y1=tile(max(lons),min(lats))
X0,Y0,X1,Y1=int(x0),int(y0),int(x1),int(y1)
print(X1-X0+1,Y1-Y0+1)
im=Image.new('RGB',((X1-X0+1)*256,(Y1-Y0+1)*256))
for X in range(X0,X1+1):
  for Y in range(Y0,Y1+1):
    u=f'https://stormscdn.ngs.noaa.gov/20170924b-rgb/{Z}/{X}/{Y}'
    try:
      d=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read(); im.paste(Image.open(io.BytesIO(d)).convert('RGB'),((X-X0)*256,(Y-Y0)*256))
    except Exception as e: print('fail',X,Y,e)
im.save('mosaic.png'); open('mos.txt','w').write(repr((Z,X0,Y0)))
''', 'aer', 'exec'))
# ---------------- step: build
exec(compile(r'''
import math, numpy as np, pyproj, gzip
from PIL import Image, ImageFilter
from scipy import ndimage as nd
t=pyproj.Transformer.from_crs(26919,4326,always_xy=True)
cE,cN,a=803757.0,2044655.0,math.radians(142.8);dx,dy=math.cos(a),math.sin(a)
X0,X1,Y0,Y1=-9500,1000,-2500,8000; STEP=24
def utm(x,y):
    U=(x-2208)*0.125;V=(y-1488)*0.125;return cE+U*dx+V*dy, cN+U*dy-V*dx
dem=np.load('dem.npy'); dem=np.where(dem<-100,0,dem).astype(np.float32); tr=eval(open('tr.txt').read())
def bil(A,x,y):
    H,W=A.shape; x=np.clip(x,0,W-1.001); y=np.clip(y,0,H-1.001); i=x.astype(int); j=y.astype(int); u=x-i; v=y-j
    return (A[j,i]*(1-u)+A[j,i+1]*u)*(1-v)+(A[j+1,i]*(1-u)+A[j+1,i+1]*u)*v
Z,TX0,TY0=eval(open('mos.txt').read()); mos=np.asarray(Image.open('mosaic.png')).astype(np.float32)
def aer(XX,YY):
    E,Nn=utm(XX,YY); lon,lat=t.transform(E,Nn); n=2**Z
    px=((lon+180)/360*n-TX0)*256; py=((1-np.arcsinh(np.tan(np.radians(lat)))/math.pi)/2*n-TY0)*256
    return np.stack([bil(mos[...,c],px,py) for c in range(3)],-1)
# fine mask grid at 8 px (1 m)
F=8; fx=np.arange(X0,X1+1,F); fy=np.arange(Y0,Y1+1,F); FX,FY=np.meshgrid(fx,fy)
E,Nn=utm(FX,FY); h=bil(dem,(E-tr[2])/tr[0],(Nn-tr[5])/tr[4])
A=aer(FX,FY); r,g,b=A[...,0],A[...,1],A[...,2]; lum=0.3*r+0.59*g+0.11*b
veg=(g>r*1.04)&(g>b*1.02)&(lum<170)
loc=nd.uniform_filter(lum,25)
built=(lum>loc*0.97)&(lum>95)&~veg&(h>3.0)
built=nd.binary_opening(built,iterations=1); built=nd.binary_closing(built,iterations=3); built=nd.binary_opening(built,iterations=3)
# not on the El Morro esplanade / fort (inside or right next to the game map) and not the cemetery tombs (x>-1500 & y>2600 low)
inmap=(FX>-120)&(FY>-120)&(FY<2976+120)
built&=~inmap
lab,nl=nd.label(built); sizes=nd.sum(built,lab,range(1,nl+1))
keep=np.zeros(nl+1,bool); keep[1:]=sizes>=30; built=keep[lab]
# storey heights: per 14 m block hash, 2..4 storeys of 3.7 m; very large footprints (Ballaja, Asilo, school) 3 storeys tall ones
bx=(FX//112).astype(np.int64); by=(FY//112).astype(np.int64); hs=((bx*73856093)^(by*19349663))&1023
st=2+(hs%3); big=keep[lab]&(np.take(np.r_[0,sizes],lab)>2500); st=np.where(big,3,st)
add=np.where(built,st*3.7+0.6,0.0)
# soften the hard extrusion edge just a bit so walls are near-vertical at the 3 m mesh
H=h+add
print('built frac',built.mean(), 'max',H.max())
# resample to STEP grid by max-pool (keeps rooftops) / min for gaps
k=STEP//F; Hc=H[:(H.shape[0]//k)*k,:(H.shape[1]//k)*k]
Hs=H[::k,::k]
print(Hs.shape)
q=np.clip(np.round((Hs+2)*4),0,255).astype(np.uint8)
open('/workspace/bloons-frontier/public/assets/maps/morro/oldsj.dat','wb').write(gzip.compress(q.tobytes()+built[::k,::k].astype(np.uint8).tobytes(),9))
# texture
R=1536; xs=np.linspace(X0,X1,R); ys=np.linspace(Y0,Y1,R); XX,YY=np.meshgrid(xs,ys)
img=aer(XX,YY); Image.fromarray(np.clip(img,0,255).astype(np.uint8)).save('/workspace/bloons-frontier/public/assets/maps/morro/oldsj.jpg',quality=80)
Image.fromarray((built*255).astype(np.uint8)).resize((800,800)).save('mask.png')
print(Hs.shape, 'cols rows')
''', 'build', 'exec'))
