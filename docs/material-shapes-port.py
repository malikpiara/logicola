"""Port of androidx MaterialShapes (Apache 2.0) sufficient to draw outlines.
Regular polygons, stars, rectangles and repeated point lists, with per-vertex
corner rounding as circular arcs (smoothing flanks ignored: invisible on a grid)."""
import math
from PIL import Image, ImageDraw

def rot(p, deg, c=(0.0,0.0)):
    a=math.radians(deg); x,y=p[0]-c[0],p[1]-c[1]
    return (x*math.cos(a)-y*math.sin(a)+c[0], x*math.sin(a)+y*math.cos(a)+c[1])
def regular(n, radius=1.0, rounding=0.0, per=None):
    pts=[(radius*math.cos(2*math.pi*i/n), radius*math.sin(2*math.pi*i/n)) for i in range(n)]
    rs=per if per else [rounding]*n
    return pts, rs
def rectangle(w=2.0, h=2.0, rounding=0.0, per=None):
    l,t,r,b=-w/2,-h/2,w/2,h/2
    pts=[(r,b),(l,b),(l,t),(r,t)]; rs=per if per else [rounding]*4
    return pts, rs
def star(n, radius=1.0, inner=0.5, rounding=0.0, inner_rounding=None):
    pts=[];rs=[]
    for i in range(n):
        pts.append((radius*math.cos(2*math.pi*i/n), radius*math.sin(2*math.pi*i/n))); rs.append(rounding)
        a=math.pi/n*(2*i+1); pts.append((inner*math.cos(a), inner*math.sin(a))); rs.append(rounding if inner_rounding is None else inner_rounding)
    return pts, rs
def custom(pnr, reps, center=(0.5,0.5), mirroring=False):
    if mirroring:
        angles=[math.degrees(math.atan2(p[1]-center[1], p[0]-center[0])) for p,_ in pnr]
        dists=[math.hypot(p[0]-center[0], p[1]-center[1]) for p,_ in pnr]
        actual=reps*2; section=360.0/actual; out=[]
        for it in range(actual):
            for index in range(len(pnr)):
                i = index if it%2==0 else len(pnr)-1-index
                if i>0 or it%2==0:
                    a = section*it + (angles[i] if it%2==0 else section-angles[i]+2*angles[0])
                    a=math.radians(a)
                    out.append(((math.cos(a)*dists[i]+center[0], math.sin(a)*dists[i]+center[1]), pnr[i][1]))
    else:
        out=[]
        for k in range(len(pnr)*reps):
            p,r=pnr[k%len(pnr)]; out.append((rot(p,(k//len(pnr))*360.0/reps,center), r))
    return [p for p,_ in out],[r for _,r in out]
def transform(pts, fn): return [fn(p) for p in pts]
def scale(sx,sy): return lambda p:(p[0]*sx,p[1]*sy)

def outline(pts, rs, samples=12):
    """Replace each rounded vertex with a circular arc; returns a dense polygon."""
    n=len(pts)
    def norm(v):
        l=math.hypot(*v); return (v[0]/l, v[1]/l) if l else (0,0)
    cuts=[]; angles=[]
    for i in range(n):
        V=pts[i]; P=pts[i-1]; Nx=pts[(i+1)%n]
        d1=norm((P[0]-V[0],P[1]-V[1])); d2=norm((Nx[0]-V[0],Nx[1]-V[1]))
        cos=max(-1,min(1,d1[0]*d2[0]+d1[1]*d2[1])); sin=math.sqrt(max(0,1-cos*cos))
        r=rs[i]; cut = r*(cos+1)/sin if (sin>1e-3 and r>0) else 0.0
        cuts.append(cut); angles.append((d1,d2,cos,sin))
    allowed=cuts[:]
    for i in range(n):
        j=(i+1)%n; L=math.dist(pts[i],pts[j]); tot=cuts[i]+cuts[j]
        if tot>L and tot>0:
            f=L/tot; allowed[i]=min(allowed[i],cuts[i]*f); allowed[j]=min(allowed[j],cuts[j]*f)
    out=[]
    for i in range(n):
        V=pts[i]; d1,d2,cos,sin=angles[i]; c=allowed[i]
        if c<=1e-6: out.append(V); continue
        P1=(V[0]+d1[0]*c, V[1]+d1[1]*c); P2=(V[0]+d2[0]*c, V[1]+d2[1]*c)
        half=math.acos(cos)/2; rr=c*math.tan(half)
        bis=norm((d1[0]+d2[0], d1[1]+d2[1])); C=(V[0]+bis[0]*rr/math.sin(half), V[1]+bis[1]*rr/math.sin(half))
        a1=math.atan2(P1[1]-C[1],P1[0]-C[0]); a2=math.atan2(P2[1]-C[1],P2[0]-C[0])
        da=(a2-a1)
        while da>math.pi: da-=2*math.pi
        while da<-math.pi: da+=2*math.pi
        for k in range(samples+1):
            a=a1+da*k/samples; out.append((C[0]+rr*math.cos(a), C[1]+rr*math.sin(a)))
    return out

R15,R20,R30,R50,R100=.15,.2,.3,.5,1.0
def CR(r,s=0): return r
SHAPES={}
def define(name, fn): SHAPES[name]=fn
define('Circle', lambda: regular(10, rounding=1.0))
define('Square', lambda: rectangle(1,1,R30))
define('Slanted', lambda: custom([((0.926,0.970),.189),((-0.021,0.967),.187)],2))
def _arch():
    pts,rs=regular(4, per=[R100,R100,R20,R20]); return transform(pts,lambda p:rot(p,-135)), rs
define('Arch',_arch)
define('Fan', lambda: custom([((1.004,1.0),.148),((0.0,1.0),.151),((0.0,-0.003),.148),((0.978,0.020),.803)],1))
define('Arrow', lambda: custom([((0.5,0.892),.313),((-0.216,1.050),.207),((0.499,-0.160),.215),((1.225,1.060),.211)],1))
define('Semicircle', lambda: rectangle(1.6,1.0,per=[R20,R20,R100,R100]))
def _oval():
    pts,rs=regular(8, rounding=1.0); pts=transform(pts,scale(1,0.64)); return transform(pts,lambda p:rot(p,-45)), rs
define('Oval',_oval)
define('Pill', lambda: custom([((0.961,0.039),.426),((1.001,0.428),0),((1.0,0.609),1.0)],2,mirroring=True))
def _tri():
    pts,rs=regular(3, rounding=R20); return transform(pts,lambda p:rot(p,-90)), rs
define('Triangle',_tri)
define('Diamond', lambda: custom([((0.5,1.096),.151),((0.040,0.5),.159)],2))
define('Clamshell', lambda: custom([((0.171,0.841),.159),((-0.020,0.5),.140),((0.170,0.159),.159)],2))
define('Pentagon', lambda: custom([((0.5,-0.009),.172),((1.030,0.365),.164),((0.828,0.970),.169)],1,mirroring=True))
define('Gem', lambda: custom([((0.499,1.023),.241),((-0.005,0.792),.208),((0.073,0.258),.228),((0.433,-0.0),.491)],1,mirroring=True))
define('Sunny', lambda: star(8, inner=.8, rounding=R15))
define('Very sunny', lambda: custom([((0.5,1.080),.085),((0.358,0.843),.085)],8))
define('4-sided cookie', lambda: custom([((1.237,1.236),.258),((0.5,0.918),.233)],4))
define('6-sided cookie', lambda: custom([((0.723,0.884),.394),((0.5,1.099),.398)],6))
def _cookie(n,inner):
    def f():
        pts,rs=star(n, inner=inner, rounding=R50); return transform(pts,lambda p:rot(p,-90)), rs
    return f
define('7-sided cookie',_cookie(7,.75)); define('9-sided cookie',_cookie(9,.8)); define('12-sided cookie',_cookie(12,.8))
define('Ghost-ish', lambda: custom([((0.5,0.0),1.0),((1.0,0.0),1.0),((1.0,1.140),.254),((0.575,0.906),.253)],1,mirroring=True))
define('4-leaf clover', lambda: custom([((0.5,0.074),0),((0.725,-0.099),.476)],4,mirroring=True))
define('8-leaf clover', lambda: custom([((0.5,0.036),0),((0.758,-0.101),.209)],8))
define('Burst', lambda: custom([((0.5,-0.006),.006),((0.592,0.158),.006)],12))
define('Soft burst', lambda: custom([((0.193,0.277),.053),((0.176,0.055),.053)],10))
define('Boom', lambda: custom([((0.457,0.296),.007),((0.5,-0.051),.007)],15))
define('Soft boom', lambda: custom([((0.733,0.454),0),((0.839,0.437),.532),((0.949,0.449),.439),((0.998,0.478),.174)],16,mirroring=True))
define('Flower', lambda: custom([((0.370,0.187),0),((0.416,0.049),.381),((0.479,0.001),.095)],8,mirroring=True))
def _puffy():
    pts,rs=custom([((0.5,0.053),0),((0.545,-0.040),.405),((0.670,-0.035),.426),((0.717,0.066),.574),((0.722,0.128),0),((0.777,0.002),.360),((0.914,0.149),.660),((0.926,0.289),.660),((0.881,0.346),0),((0.940,0.344),.126),((1.003,0.437),.255)],2,mirroring=True)
    return transform(pts,scale(1,0.742)), rs
define('Puffy',_puffy)
define('Puffy diamond', lambda: custom([((0.870,0.130),.146),((0.818,0.357),0),((1.0,0.332),.853)],4,mirroring=True))
define('Pixel circle', lambda: custom([((0.5,0.0),0),((0.704,0.0),0),((0.704,0.065),0),((0.843,0.065),0),((0.843,0.148),0),((0.926,0.148),0),((0.926,0.296),0),((1.0,0.296),0)],2,mirroring=True))
define('Pixel triangle', lambda: custom([((0.110,0.5),0),((0.113,0.0),0),((0.287,0.0),0),((0.287,0.087),0),((0.421,0.087),0),((0.421,0.170),0),((0.560,0.170),0),((0.560,0.265),0),((0.674,0.265),0),((0.675,0.344),0),((0.789,0.344),0),((0.789,0.439),0),((0.888,0.439),0)],1,mirroring=True))
define('Bun', lambda: custom([((0.796,0.5),0),((0.853,0.518),1.0),((0.992,0.631),1.0),((0.968,1.0),1.0)],2,mirroring=True))
define('Heart', lambda: custom([((0.5,0.268),.016),((0.792,-0.066),.958),((1.064,0.276),1.0),((0.501,0.946),.129)],1,mirroring=True))

def mask(name, px=960):
    pts,rs=SHAPES[name](); poly=outline(pts,rs)
    xs=[p[0] for p in poly]; ys=[p[1] for p in poly]
    w=max(xs)-min(xs); h=max(ys)-min(ys); s=(px*0.96)/max(w,h)
    ox=(px-w*s)/2-min(xs)*s; oy=(px-h*s)/2-min(ys)*s
    im=Image.new('L',(px,px),0); ImageDraw.Draw(im).polygon([(x*s+ox,y*s+oy) for x,y in poly], fill=255)
    return im
ORDER=[["Circle","Square","Slanted","Arch","Semicircle","Oval","Pill"],["Triangle","Arrow","Fan","Diamond","Clamshell","Pentagon","Gem"],["Sunny","Very sunny","4-sided cookie","6-sided cookie","7-sided cookie","9-sided cookie","12-sided cookie"],["4-leaf clover","8-leaf clover","Burst","Soft burst","Boom","Soft boom","Flower"],["Puffy","Puffy diamond","Ghost-ish","Pixel circle","Pixel triangle","Bun","Heart"]]
