"""Find scale/offset of each separated asset inside the reference composition."""
import numpy as np, cv2, json
from PIL import Image
ref=np.array(Image.open('tools/source/main-reference.webp').convert('RGB')).astype(np.float32)
def load(p, white_bg=False):
    im=np.array(Image.open(p).convert('RGBA'))
    a=im[...,3]
    ys,xs=np.where(a>20); y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    return im[y0:y1,x0:x1]
assets={'baby':'tools/source/layers/baby.webp','balloon':'tools/source/layers/balloon-cut.png',
        'bear':'tools/source/layers/bear-cut.png','cupcake':'tools/source/layers/cupcake-cut.png'}
# expected object height in reference (rough) to bound the scale search
exp={'baby':(700,900),'balloon':(380,760),'bear':(300,480),'cupcake':(250,420)}
D=0.5
refs=cv2.resize(ref,None,fx=D,fy=D,interpolation=cv2.INTER_AREA)
res={}
for n,p in assets.items():
    im=load(p); h=im.shape[0]
    best=None
    for th in np.linspace(exp[n][0],exp[n][1],41):
        s=th/h*D
        t=cv2.resize(im,None,fx=s,fy=s,interpolation=cv2.INTER_AREA).astype(np.float32)
        if t.shape[0]>=refs.shape[0] or t.shape[1]>=refs.shape[1]: continue
        m=(t[...,3:4]>200).astype(np.float32); m=np.repeat(m,3,2)
        r=cv2.matchTemplate(refs,t[...,:3],cv2.TM_SQDIFF,mask=m)
        r=r/m.sum()
        mn,_,loc,_=cv2.minMaxLoc(r)
        if best is None or mn<best[0]: best=(mn,s/D,loc[0]/D,loc[1]/D)
    res[n]=dict(err=float(best[0]),scale=float(best[1]),x=float(best[2]),y=float(best[3]),w=im.shape[1]*best[1],h=im.shape[0]*best[1])
    print(n,{k:round(v,3) for k,v in res[n].items()})
json.dump(res,open('tools/source/layers/match.json','w'),indent=1)
