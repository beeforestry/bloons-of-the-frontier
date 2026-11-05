"""t72: procedural albedo maps for Dart Scout; palette sampled from public/assets/v3/dart_monkey_2.webp."""
import numpy as np
from PIL import Image, ImageFilter
import os
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spr=np.array(Image.open(os.path.join(R,'../../public/assets/v3/dart_monkey_2.webp')).convert('RGBA')).astype(float)
def samp(x0,y0,x1,y1):
    p=spr[y0:y1,x0:x1].reshape(-1,4); p=p[p[:,3]>200][:,:3]; return p.mean(0)
pal=dict(metal=samp(62,62,98,78), chest=samp(88,90,104,110), face=samp(112,30,126,50), cap=samp(88,6,118,18),
         tail=samp(4,170,30,200), gold=samp(108,88,124,100), foot=samp(60,232,80,250))
print({k:[int(c) for c in v] for k,v in pal.items()})
rng=np.random.default_rng(72); N=256
def noise(scale, octaves=4):
    out=np.zeros((N,N))
    for o in range(octaves):
        s=max(2,int(N/scale/(2**o)))
        n=rng.random((s,s)); n=np.array(Image.fromarray((n*255).astype(np.uint8)).resize((N,N),Image.BICUBIC))/255.
        out+=n/(2**o)
    return out/out.max()
def save(name,a):
    Image.fromarray(np.clip(a,0,255).astype(np.uint8)).save(os.path.join(R,'tex',name+'.png'))
def fur(base, dark, strand=0.5):
    # streaky strands: vertical motion blur noise
    n=rng.random((N,N)); im=Image.fromarray((n*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    k=ImageFilter.Kernel((5,5),[0,0,1,0,0]*5,scale=5); im=im.filter(k).filter(k)
    s=np.array(im)/255.; s=(s-s.min())/(s.max()-s.min())
    m=noise(8)*0.5+s*0.5
    c=np.array(dark)[None,None]*(1-m[...,None])+np.array(base)[None,None]*m[...,None]
    return c
save('fur_body', fur(pal['tail']*1.15, pal['tail']*0.45))
save('fur_cap', fur(pal['cap']*1.2, pal['cap']*0.5))
save('fur_foot', fur(pal['foot']*1.1, pal['foot']*0.45))
skin=pal['face']; m=noise(10,3)
save('skin', np.array(skin)[None,None]*(0.85+0.25*m[...,None]))
# plate metal: brushed + dents + grime, silver tone
b=rng.random((N,N)); bi=Image.fromarray((b*255).astype(np.uint8)).resize((N//8,N),Image.BILINEAR).resize((N,N),Image.BILINEAR)
br=np.array(bi)/255.; dents=noise(6,5); grime=noise(3,4)**2
mt=np.array([150,138,118])*(0.85+0.12*br[...,None]+0.08*dents[...,None])*(1-0.25*grime[...,None])
for _ in range(60):  # scratches
    x,y=rng.integers(0,N,2); L=rng.integers(8,40); ang=rng.random()*np.pi
    for t in range(L):
        xx=int(x+np.cos(ang)*t)%N; yy=int(y+np.sin(ang)*t)%N; mt[yy,xx]=mt[yy,xx]*1.25
save('metal', mt)
g=np.array([214,168,72])*(0.7+0.35*noise(8,4)[...,None])
save('gold', g)
lt=np.array([92,62,40])*(0.7+0.4*noise(12,4)[...,None])
save('leather', lt)
wd=np.array([120,84,50])*(0.75+0.3*np.sin(np.linspace(0,60,N))[None,:,None]*0.3+0.2*noise(16,3)[...,None])
save('wood', wd)
