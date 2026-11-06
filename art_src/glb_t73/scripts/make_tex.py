"""t73: Marksman Scout albedo maps; palette sampled from public/assets/v3/sniper_monkey_2.webp.
fur/skin/leather maps reuse t72 (copied)."""
import numpy as np, os
from PIL import Image
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spr=np.array(Image.open(os.path.join(R,'../../public/assets/v3/sniper_monkey_2.webp')).convert('RGBA')).astype(float)
def samp(x0,y0,x1,y1):
    p=spr[y0:y1,x0:x1].reshape(-1,4); p=p[p[:,3]>200][:,:3]; return p.mean(0)
pal=dict(suit=samp(70,100,110,130), plate=samp(50,50,75,70), trim=samp(58,52,72,64), boot=samp(50,215,75,240), tail=samp(5,160,30,190))
print({k:[int(c) for c in v] for k,v in pal.items()})
rng=np.random.default_rng(73); N=256
def noise(scale, octaves=4):
    out=np.zeros((N,N))
    for o in range(octaves):
        s=max(2,int(N/scale/(2**o))); n=rng.random((s,s))
        out+=np.array(Image.fromarray((n*255).astype(np.uint8)).resize((N,N),Image.BICUBIC))/255./(2**o)
    return out/out.max()
def save(n,a): Image.fromarray(np.clip(a,0,255).astype(np.uint8)).save(os.path.join(R,'tex',n+'.png'))
# quilted padded suit: dark olive-charcoal with stitched diamond grid + wear
yy,xx=np.mgrid[0:N,0:N]; g=((xx+yy)%32<2)|((xx-yy)%32<2)
base=np.array([46,44,37])*(0.8+0.35*noise(10,4)[...,None])
base[g]*=0.75; pil=((xx+yy)%32-16)**2+((xx-yy)%32-16)**2; base*= (1.04-0.08*(pil/512.0))[...,None]
save('suit', base)
pl=np.array([66,64,58])*(0.8+0.3*noise(6,5)[...,None])
for _ in range(50):
    x,y=rng.integers(0,N,2); L=rng.integers(8,30); a=rng.random()*np.pi
    for t in range(L): pl[int(y+np.sin(a)*t)%N,int(x+np.cos(a)*t)%N]*=1.5
save('plate', pl)
save('bronze', np.array([168,124,66])*(0.7+0.4*noise(8,4)[...,None]))
save('gunmetal', np.array([34,34,36])*(0.85+0.3*noise(12,4)[...,None]))
