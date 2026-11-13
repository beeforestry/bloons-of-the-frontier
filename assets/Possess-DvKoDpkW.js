import{a as zt,T as rn,E as an,l as Bi,s as Ft,h as jd,b as Sl,f as Er,U as Cn,o as Ar,c as Tl,M as Xd,A as Wa,P as qd,u as Yd,B as Kd,g as Jd}from"./index-C37kom_B.js";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Oc="170",Zd=0,El=1,Qd=2,Nu=1,Fu=2,Jn=3,si=0,Zt=1,Rt=2,ni=0,ds=1,gs=2,Al=3,Rl=4,$d=5,Ii=100,ef=101,tf=102,nf=103,sf=104,rf=200,af=201,of=202,cf=203,zo=204,Go=205,lf=206,hf=207,uf=208,df=209,ff=210,pf=211,mf=212,gf=213,bf=214,Ho=0,Vo=1,Wo=2,bs=3,jo=4,Xo=5,qo=6,Yo=7,Ra=0,_f=1,xf=2,_i=0,Ou=1,ku=2,Bu=3,kc=4,vf=5,zu=6,Gu=7,Cl="attached",yf="detached",Hu=300,_s=301,xs=302,Ko=303,Jo=304,Ca=306,vn=1e3,Dn=1001,Ma=1002,Qt=1003,Vu=1004,$s=1005,kt=1006,fa=1007,An=1008,ri=1009,Wu=1010,ju=1011,hr=1012,Bc=1013,Ni=1014,tn=1015,nn=1016,zc=1017,Gc=1018,vs=1020,Xu=35902,qu=1021,Yu=1022,bn=1023,Ku=1024,Ju=1025,fs=1026,ys=1027,Hc=1028,Vc=1029,Zu=1030,Wc=1031,jc=1033,pa=33776,ma=33777,ga=33778,ba=33779,Zo=35840,Qo=35841,$o=35842,ec=35843,tc=36196,nc=37492,ic=37496,sc=37808,rc=37809,ac=37810,oc=37811,cc=37812,lc=37813,hc=37814,uc=37815,dc=37816,fc=37817,pc=37818,mc=37819,gc=37820,bc=37821,_a=36492,_c=36494,xc=36495,Qu=36283,vc=36284,yc=36285,Mc=36286,ur=2300,dr=2301,ja=2302,Pl=2400,Ll=2401,Il=2402,Mf=2500,wf=0,$u=1,wc=2,Sf=3200,Tf=3201,Pa=0,Ef=1,$n="",pt="srgb",jt="srgb-linear",La="linear",ht="srgb",zi=7680,Dl=519,Af=512,Rf=513,Cf=514,ed=515,Pf=516,Lf=517,If=518,Df=519,Sc=35044,Ul="300 es",ti=2e3,wa=2001;class Ls{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const Ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Nl=1234567;const nr=Math.PI/180,Ms=180/Math.PI;function _n(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ht[s&255]+Ht[s>>8&255]+Ht[s>>16&255]+Ht[s>>24&255]+"-"+Ht[e&255]+Ht[e>>8&255]+"-"+Ht[e>>16&15|64]+Ht[e>>24&255]+"-"+Ht[t&63|128]+Ht[t>>8&255]+"-"+Ht[t>>16&255]+Ht[t>>24&255]+Ht[n&255]+Ht[n>>8&255]+Ht[n>>16&255]+Ht[n>>24&255]).toLowerCase()}function Lt(s,e,t){return Math.max(e,Math.min(t,s))}function Xc(s,e){return(s%e+e)%e}function Uf(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Nf(s,e,t){return s!==e?(t-s)/(e-s):0}function ir(s,e,t){return(1-t)*s+t*e}function Ff(s,e,t,n){return ir(s,e,1-Math.exp(-t*n))}function Of(s,e=1){return e-Math.abs(Xc(s,e*2)-e)}function kf(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Bf(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function zf(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Gf(s,e){return s+Math.random()*(e-s)}function Hf(s){return s*(.5-Math.random())}function Vf(s){s!==void 0&&(Nl=s);let e=Nl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Wf(s){return s*nr}function jf(s){return s*Ms}function Xf(s){return(s&s-1)===0&&s!==0}function qf(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Yf(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Kf(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),b=a((n-e)/2);switch(i){case"XYX":s.set(o*h,c*u,c*d,o*l);break;case"YZY":s.set(c*d,o*h,c*u,o*l);break;case"ZXZ":s.set(c*u,c*d,o*h,o*l);break;case"XZX":s.set(o*h,c*b,c*f,o*l);break;case"YXY":s.set(c*f,o*h,c*b,o*l);break;case"ZYZ":s.set(c*b,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function En(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function ut(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Jf={DEG2RAD:nr,RAD2DEG:Ms,generateUUID:_n,clamp:Lt,euclideanModulo:Xc,mapLinear:Uf,inverseLerp:Nf,lerp:ir,damp:Ff,pingpong:Of,smoothstep:kf,smootherstep:Bf,randInt:zf,randFloat:Gf,randFloatSpread:Hf,seededRandom:Vf,degToRad:Wf,radToDeg:jf,isPowerOfTwo:Xf,ceilPowerOfTwo:qf,floorPowerOfTwo:Yf,setQuaternionFromProperEuler:Kf,normalize:ut,denormalize:En};class q{constructor(e=0,t=0){q.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Lt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class qe{constructor(e,t,n,i,r,a,o,c,l){qe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,c,l)}set(e,t,n,i,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],b=n[8],v=i[0],p=i[3],m=i[6],g=i[1],_=i[4],x=i[7],E=i[2],w=i[5],A=i[8];return r[0]=a*v+o*g+c*E,r[3]=a*p+o*_+c*w,r[6]=a*m+o*x+c*A,r[1]=l*v+h*g+u*E,r[4]=l*p+h*_+u*w,r[7]=l*m+h*x+u*A,r[2]=d*v+f*g+b*E,r[5]=d*p+f*_+b*w,r[8]=d*m+f*x+b*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+i*r*l-i*a*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,b=t*u+n*d+i*f;if(b===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/b;return e[0]=u*v,e[1]=(i*l-h*n)*v,e[2]=(o*n-i*a)*v,e[3]=d*v,e[4]=(h*t-i*c)*v,e[5]=(i*r-o*t)*v,e[6]=f*v,e[7]=(n*c-l*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-i*l,i*c,-i*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Xa.makeScale(e,t)),this}rotate(e){return this.premultiply(Xa.makeRotation(-e)),this}translate(e,t){return this.premultiply(Xa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Xa=new qe;function td(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function fr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Zf(){const s=fr("canvas");return s.style.display="block",s}const Fl={};function er(s){s in Fl||(Fl[s]=!0,console.warn(s))}function Qf(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function $f(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function ep(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const $e={enabled:!0,workingColorSpace:jt,spaces:{},convert:function(s,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===ht&&(s.r=ii(s.r),s.g=ii(s.g),s.b=ii(s.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(s.applyMatrix3(this.spaces[e].toXYZ),s.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===ht&&(s.r=ps(s.r),s.g=ps(s.g),s.b=ps(s.b))),s},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===$n?La:this.spaces[s].transfer},getLuminanceCoefficients:function(s,e=this.workingColorSpace){return s.fromArray(this.spaces[e].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,e,t){return s.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function ii(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ps(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const Ol=[.64,.33,.3,.6,.15,.06],kl=[.2126,.7152,.0722],Bl=[.3127,.329],zl=new qe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Gl=new qe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);$e.define({[jt]:{primaries:Ol,whitePoint:Bl,transfer:La,toXYZ:zl,fromXYZ:Gl,luminanceCoefficients:kl,workingColorSpaceConfig:{unpackColorSpace:pt},outputColorSpaceConfig:{drawingBufferColorSpace:pt}},[pt]:{primaries:Ol,whitePoint:Bl,transfer:ht,toXYZ:zl,fromXYZ:Gl,luminanceCoefficients:kl,outputColorSpaceConfig:{drawingBufferColorSpace:pt}}});let Gi;class tp{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Gi===void 0&&(Gi=fr("canvas")),Gi.width=e.width,Gi.height=e.height;const n=Gi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Gi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=fr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=ii(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ii(t[n]/255)*255):t[n]=ii(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let np=0;class nd{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:np++}),this.uuid=_n(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(qa(i[a].image)):r.push(qa(i[a]))}else r=qa(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function qa(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?tp.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ip=0;class Dt extends Ls{constructor(e=Dt.DEFAULT_IMAGE,t=Dt.DEFAULT_MAPPING,n=Dn,i=Dn,r=kt,a=An,o=bn,c=ri,l=Dt.DEFAULT_ANISOTROPY,h=$n){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ip++}),this.uuid=_n(),this.name="",this.source=new nd(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new q(0,0),this.repeat=new q(1,1),this.center=new q(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new qe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Hu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case vn:e.x=e.x-Math.floor(e.x);break;case Dn:e.x=e.x<0?0:1;break;case Ma:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case vn:e.y=e.y-Math.floor(e.y);break;case Dn:e.y=e.y<0?0:1;break;case Ma:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Dt.DEFAULT_IMAGE=null;Dt.DEFAULT_MAPPING=Hu;Dt.DEFAULT_ANISOTROPY=1;class rt{constructor(e=0,t=0,n=0,i=1){rt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],b=c[9],v=c[2],p=c[6],m=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(b-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(b+p)<.1&&Math.abs(l+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(l+1)/2,x=(f+1)/2,E=(m+1)/2,w=(h+d)/4,A=(u+v)/4,S=(b+p)/4;return _>x&&_>E?_<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(_),i=w/n,r=A/n):x>E?x<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(x),n=w/i,r=S/i):E<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(E),n=A/r,i=S/r),this.set(n,i,r,t),this}let g=Math.sqrt((p-b)*(p-b)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(g)<.001&&(g=1),this.x=(p-b)/g,this.y=(u-v)/g,this.z=(d-h)/g,this.w=Math.acos((l+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class sp extends Ls{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new rt(0,0,e,t),this.scissorTest=!1,this.viewport=new rt(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:kt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Dt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new nd(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class xn extends sp{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class id extends Dt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Qt,this.minFilter=Qt,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class rp extends Dt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Qt,this.minFilter=Qt,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Fn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3];const d=r[a+0],f=r[a+1],b=r[a+2],v=r[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=b,e[t+3]=v;return}if(u!==v||c!==d||l!==f||h!==b){let p=1-o;const m=c*d+l*f+h*b+u*v,g=m>=0?1:-1,_=1-m*m;if(_>Number.EPSILON){const E=Math.sqrt(_),w=Math.atan2(E,m*g);p=Math.sin(p*w)/E,o=Math.sin(o*w)/E}const x=o*g;if(c=c*p+d*x,l=l*p+f*x,h=h*p+b*x,u=u*p+v*x,p===1-o){const E=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=E,l*=E,h*=E,u*=E}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[a],d=r[a+1],f=r[a+2],b=r[a+3];return e[t]=o*b+h*u+c*f-l*d,e[t+1]=c*b+h*d+l*u-o*f,e[t+2]=l*b+h*f+o*d-c*u,e[t+3]=h*b-o*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(i/2),u=o(r/2),d=c(n/2),f=c(i/2),b=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*b,this._y=l*f*u-d*h*b,this._z=l*h*b+d*f*u,this._w=l*h*u-d*f*b;break;case"YXZ":this._x=d*h*u+l*f*b,this._y=l*f*u-d*h*b,this._z=l*h*b-d*f*u,this._w=l*h*u+d*f*b;break;case"ZXY":this._x=d*h*u-l*f*b,this._y=l*f*u+d*h*b,this._z=l*h*b+d*f*u,this._w=l*h*u-d*f*b;break;case"ZYX":this._x=d*h*u-l*f*b,this._y=l*f*u+d*h*b,this._z=l*h*b-d*f*u,this._w=l*h*u+d*f*b;break;case"YZX":this._x=d*h*u+l*f*b,this._y=l*f*u+d*h*b,this._z=l*h*b-d*f*u,this._w=l*h*u-d*f*b;break;case"XZY":this._x=d*h*u-l*f*b,this._y=l*f*u-d*h*b,this._z=l*h*b+d*f*u,this._w=l*h*u+d*f*b;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-l)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Lt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+i*l-r*c,this._y=i*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-i*o,this._w=a*h-n*o-i*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-t)*h)/l,d=Math.sin(t*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Hl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Hl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*i-o*n),h=2*(o*t-r*i),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=i+c*u+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=i*c-r*o,this.y=r*a-n*c,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ya.copy(this).projectOnVector(e),this.sub(Ya)}reflect(e){return this.sub(Ya.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Lt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ya=new P,Hl=new Fn;class bt{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(wn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(wn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=wn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,wn):wn.fromBufferAttribute(r,a),wn.applyMatrix4(e.matrixWorld),this.expandByPoint(wn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Rr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Rr.copy(n.boundingBox)),Rr.applyMatrix4(e.matrixWorld),this.union(Rr)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,wn),wn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ks),Cr.subVectors(this.max,ks),Hi.subVectors(e.a,ks),Vi.subVectors(e.b,ks),Wi.subVectors(e.c,ks),ci.subVectors(Vi,Hi),li.subVectors(Wi,Vi),yi.subVectors(Hi,Wi);let t=[0,-ci.z,ci.y,0,-li.z,li.y,0,-yi.z,yi.y,ci.z,0,-ci.x,li.z,0,-li.x,yi.z,0,-yi.x,-ci.y,ci.x,0,-li.y,li.x,0,-yi.y,yi.x,0];return!Ka(t,Hi,Vi,Wi,Cr)||(t=[1,0,0,0,1,0,0,0,1],!Ka(t,Hi,Vi,Wi,Cr))?!1:(Pr.crossVectors(ci,li),t=[Pr.x,Pr.y,Pr.z],Ka(t,Hi,Vi,Wi,Cr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,wn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(wn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Vn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Vn=[new P,new P,new P,new P,new P,new P,new P,new P],wn=new P,Rr=new bt,Hi=new P,Vi=new P,Wi=new P,ci=new P,li=new P,yi=new P,ks=new P,Cr=new P,Pr=new P,Mi=new P;function Ka(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Mi.fromArray(s,r);const o=i.x*Math.abs(Mi.x)+i.y*Math.abs(Mi.y)+i.z*Math.abs(Mi.z),c=e.dot(Mi),l=t.dot(Mi),h=n.dot(Mi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const ap=new bt,Bs=new P,Ja=new P;class On{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):ap.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Bs.subVectors(e,this.center);const t=Bs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Bs,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ja.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Bs.copy(e.center).add(Ja)),this.expandByPoint(Bs.copy(e.center).sub(Ja))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Wn=new P,Za=new P,Lr=new P,hi=new P,Qa=new P,Ir=new P,$a=new P;class yr{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Wn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Wn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Wn.copy(this.origin).addScaledVector(this.direction,t),Wn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Za.copy(e).add(t).multiplyScalar(.5),Lr.copy(t).sub(e).normalize(),hi.copy(this.origin).sub(Za);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Lr),o=hi.dot(this.direction),c=-hi.dot(Lr),l=hi.lengthSq(),h=Math.abs(1-a*a);let u,d,f,b;if(h>0)if(u=a*c-o,d=a*o-c,b=r*h,u>=0)if(d>=-b)if(d<=b){const v=1/h;u*=v,d*=v,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-b?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=b?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Za).addScaledVector(Lr,d),f}intersectSphere(e,t){Wn.subVectors(e.center,this.origin);const n=Wn.dot(this.direction),i=Wn.dot(Wn)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,i=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,i=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Wn)!==null}intersectTriangle(e,t,n,i,r){Qa.subVectors(t,e),Ir.subVectors(n,e),$a.crossVectors(Qa,Ir);let a=this.direction.dot($a),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;hi.subVectors(this.origin,e);const c=o*this.direction.dot(Ir.crossVectors(hi,Ir));if(c<0)return null;const l=o*this.direction.dot(Qa.cross(hi));if(l<0||c+l>a)return null;const h=-o*hi.dot($a);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ge{constructor(e,t,n,i,r,a,o,c,l,h,u,d,f,b,v,p){Ge.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,c,l,h,u,d,f,b,v,p)}set(e,t,n,i,r,a,o,c,l,h,u,d,f,b,v,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=b,m[11]=v,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ge().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/ji.setFromMatrixColumn(e,0).length(),r=1/ji.setFromMatrixColumn(e,1).length(),a=1/ji.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,b=o*h,v=o*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=f+b*l,t[5]=d-v*l,t[9]=-o*c,t[2]=v-d*l,t[6]=b+f*l,t[10]=a*c}else if(e.order==="YXZ"){const d=c*h,f=c*u,b=l*h,v=l*u;t[0]=d+v*o,t[4]=b*o-f,t[8]=a*l,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-b,t[6]=v+d*o,t[10]=a*c}else if(e.order==="ZXY"){const d=c*h,f=c*u,b=l*h,v=l*u;t[0]=d-v*o,t[4]=-a*u,t[8]=b+f*o,t[1]=f+b*o,t[5]=a*h,t[9]=v-d*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const d=a*h,f=a*u,b=o*h,v=o*u;t[0]=c*h,t[4]=b*l-f,t[8]=d*l+v,t[1]=c*u,t[5]=v*l+d,t[9]=f*l-b,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const d=a*c,f=a*l,b=o*c,v=o*l;t[0]=c*h,t[4]=v-d*u,t[8]=b*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*u+b,t[10]=d-v*u}else if(e.order==="XZY"){const d=a*c,f=a*l,b=o*c,v=o*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+v,t[5]=a*h,t[9]=f*u-b,t[2]=b*u-f,t[6]=o*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(op,e,cp)}lookAt(e,t,n){const i=this.elements;return on.subVectors(e,t),on.lengthSq()===0&&(on.z=1),on.normalize(),ui.crossVectors(n,on),ui.lengthSq()===0&&(Math.abs(n.z)===1?on.x+=1e-4:on.z+=1e-4,on.normalize(),ui.crossVectors(n,on)),ui.normalize(),Dr.crossVectors(on,ui),i[0]=ui.x,i[4]=Dr.x,i[8]=on.x,i[1]=ui.y,i[5]=Dr.y,i[9]=on.y,i[2]=ui.z,i[6]=Dr.z,i[10]=on.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],b=n[2],v=n[6],p=n[10],m=n[14],g=n[3],_=n[7],x=n[11],E=n[15],w=i[0],A=i[4],S=i[8],y=i[12],M=i[1],C=i[5],D=i[9],U=i[13],N=i[2],G=i[6],O=i[10],Y=i[14],H=i[3],te=i[7],oe=i[11],me=i[15];return r[0]=a*w+o*M+c*N+l*H,r[4]=a*A+o*C+c*G+l*te,r[8]=a*S+o*D+c*O+l*oe,r[12]=a*y+o*U+c*Y+l*me,r[1]=h*w+u*M+d*N+f*H,r[5]=h*A+u*C+d*G+f*te,r[9]=h*S+u*D+d*O+f*oe,r[13]=h*y+u*U+d*Y+f*me,r[2]=b*w+v*M+p*N+m*H,r[6]=b*A+v*C+p*G+m*te,r[10]=b*S+v*D+p*O+m*oe,r[14]=b*y+v*U+p*Y+m*me,r[3]=g*w+_*M+x*N+E*H,r[7]=g*A+_*C+x*G+E*te,r[11]=g*S+_*D+x*O+E*oe,r[15]=g*y+_*U+x*Y+E*me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],b=e[3],v=e[7],p=e[11],m=e[15];return b*(+r*c*u-i*l*u-r*o*d+n*l*d+i*o*f-n*c*f)+v*(+t*c*f-t*l*d+r*a*d-i*a*f+i*l*h-r*c*h)+p*(+t*l*u-t*o*f-r*a*u+n*a*f+r*o*h-n*l*h)+m*(-i*o*h-t*c*u+t*o*d+i*a*u-n*a*d+n*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],b=e[12],v=e[13],p=e[14],m=e[15],g=u*p*l-v*d*l+v*c*f-o*p*f-u*c*m+o*d*m,_=b*d*l-h*p*l-b*c*f+a*p*f+h*c*m-a*d*m,x=h*v*l-b*u*l+b*o*f-a*v*f-h*o*m+a*u*m,E=b*u*c-h*v*c-b*o*d+a*v*d+h*o*p-a*u*p,w=t*g+n*_+i*x+r*E;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return e[0]=g*A,e[1]=(v*d*r-u*p*r-v*i*f+n*p*f+u*i*m-n*d*m)*A,e[2]=(o*p*r-v*c*r+v*i*l-n*p*l-o*i*m+n*c*m)*A,e[3]=(u*c*r-o*d*r-u*i*l+n*d*l+o*i*f-n*c*f)*A,e[4]=_*A,e[5]=(h*p*r-b*d*r+b*i*f-t*p*f-h*i*m+t*d*m)*A,e[6]=(b*c*r-a*p*r-b*i*l+t*p*l+a*i*m-t*c*m)*A,e[7]=(a*d*r-h*c*r+h*i*l-t*d*l-a*i*f+t*c*f)*A,e[8]=x*A,e[9]=(b*u*r-h*v*r-b*n*f+t*v*f+h*n*m-t*u*m)*A,e[10]=(a*v*r-b*o*r+b*n*l-t*v*l-a*n*m+t*o*m)*A,e[11]=(h*o*r-a*u*r-h*n*l+t*u*l+a*n*f-t*o*f)*A,e[12]=E*A,e[13]=(h*v*i-b*u*i+b*n*d-t*v*d-h*n*p+t*u*p)*A,e[14]=(b*o*i-a*v*i-b*n*c+t*v*c+a*n*p-t*o*p)*A,e[15]=(a*u*i-h*o*i+h*n*c-t*u*c-a*n*d+t*o*d)*A,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-i*c,l*c+i*o,0,l*o+i*c,h*o+n,h*c-i*a,0,l*c-i*o,h*c+i*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,b=r*u,v=a*h,p=a*u,m=o*u,g=c*l,_=c*h,x=c*u,E=n.x,w=n.y,A=n.z;return i[0]=(1-(v+m))*E,i[1]=(f+x)*E,i[2]=(b-_)*E,i[3]=0,i[4]=(f-x)*w,i[5]=(1-(d+m))*w,i[6]=(p+g)*w,i[7]=0,i[8]=(b+_)*A,i[9]=(p-g)*A,i[10]=(1-(d+v))*A,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=ji.set(i[0],i[1],i[2]).length();const a=ji.set(i[4],i[5],i[6]).length(),o=ji.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Sn.copy(this);const l=1/r,h=1/a,u=1/o;return Sn.elements[0]*=l,Sn.elements[1]*=l,Sn.elements[2]*=l,Sn.elements[4]*=h,Sn.elements[5]*=h,Sn.elements[6]*=h,Sn.elements[8]*=u,Sn.elements[9]*=u,Sn.elements[10]*=u,t.setFromRotationMatrix(Sn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,r,a,o=ti){const c=this.elements,l=2*r/(t-e),h=2*r/(n-i),u=(t+e)/(t-e),d=(n+i)/(n-i);let f,b;if(o===ti)f=-(a+r)/(a-r),b=-2*a*r/(a-r);else if(o===wa)f=-a/(a-r),b=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=b,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=ti){const c=this.elements,l=1/(t-e),h=1/(n-i),u=1/(a-r),d=(t+e)*l,f=(n+i)*h;let b,v;if(o===ti)b=(a+r)*u,v=-2*u;else if(o===wa)b=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=v,c[14]=-b,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ji=new P,Sn=new Ge,op=new P(0,0,0),cp=new P(1,1,1),ui=new P,Dr=new P,on=new P,Vl=new Ge,Wl=new Fn;class dn{constructor(e=0,t=0,n=0,i=dn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(Lt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Lt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Lt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Lt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Lt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Lt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Vl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Vl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Wl.setFromEuler(this),this.setFromQuaternion(Wl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}dn.DEFAULT_ORDER="XYZ";class qc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let lp=0;const jl=new P,Xi=new Fn,jn=new Ge,Ur=new P,zs=new P,hp=new P,up=new Fn,Xl=new P(1,0,0),ql=new P(0,1,0),Yl=new P(0,0,1),Kl={type:"added"},dp={type:"removed"},qi={type:"childadded",child:null},eo={type:"childremoved",child:null};class _t extends Ls{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lp++}),this.uuid=_n(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_t.DEFAULT_UP.clone();const e=new P,t=new dn,n=new Fn,i=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ge},normalMatrix:{value:new qe}}),this.matrix=new Ge,this.matrixWorld=new Ge,this.matrixAutoUpdate=_t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.multiply(Xi),this}rotateOnWorldAxis(e,t){return Xi.setFromAxisAngle(e,t),this.quaternion.premultiply(Xi),this}rotateX(e){return this.rotateOnAxis(Xl,e)}rotateY(e){return this.rotateOnAxis(ql,e)}rotateZ(e){return this.rotateOnAxis(Yl,e)}translateOnAxis(e,t){return jl.copy(e).applyQuaternion(this.quaternion),this.position.add(jl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Xl,e)}translateY(e){return this.translateOnAxis(ql,e)}translateZ(e){return this.translateOnAxis(Yl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(jn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ur.copy(e):Ur.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),zs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?jn.lookAt(zs,Ur,this.up):jn.lookAt(Ur,zs,this.up),this.quaternion.setFromRotationMatrix(jn),i&&(jn.extractRotation(i.matrixWorld),Xi.setFromRotationMatrix(jn),this.quaternion.premultiply(Xi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Kl),qi.child=e,this.dispatchEvent(qi),qi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(dp),eo.child=e,this.dispatchEvent(eo),eo.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),jn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),jn.multiply(e.parent.matrixWorld)),e.applyMatrix4(jn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Kl),qi.child=e,this.dispatchEvent(qi),qi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zs,e,hp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zs,up,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];i.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),b=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),b.length>0&&(n.nodes=b)}return n.object=i,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}_t.DEFAULT_UP=new P(0,1,0);_t.DEFAULT_MATRIX_AUTO_UPDATE=!0;_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Tn=new P,Xn=new P,to=new P,qn=new P,Yi=new P,Ki=new P,Jl=new P,no=new P,io=new P,so=new P,ro=new rt,ao=new rt,oo=new rt;class gn{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Tn.subVectors(e,t),i.cross(Tn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Tn.subVectors(i,t),Xn.subVectors(n,t),to.subVectors(e,t);const a=Tn.dot(Tn),o=Tn.dot(Xn),c=Tn.dot(to),l=Xn.dot(Xn),h=Xn.dot(to),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,b=(a*h-o*c)*d;return r.set(1-f-b,b,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,qn)===null?!1:qn.x>=0&&qn.y>=0&&qn.x+qn.y<=1}static getInterpolation(e,t,n,i,r,a,o,c){return this.getBarycoord(e,t,n,i,qn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,qn.x),c.addScaledVector(a,qn.y),c.addScaledVector(o,qn.z),c)}static getInterpolatedAttribute(e,t,n,i,r,a){return ro.setScalar(0),ao.setScalar(0),oo.setScalar(0),ro.fromBufferAttribute(e,t),ao.fromBufferAttribute(e,n),oo.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(ro,r.x),a.addScaledVector(ao,r.y),a.addScaledVector(oo,r.z),a}static isFrontFacing(e,t,n,i){return Tn.subVectors(n,t),Xn.subVectors(e,t),Tn.cross(Xn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Tn.subVectors(this.c,this.b),Xn.subVectors(this.a,this.b),Tn.cross(Xn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return gn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return gn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return gn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return gn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return gn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;Yi.subVectors(i,n),Ki.subVectors(r,n),no.subVectors(e,n);const c=Yi.dot(no),l=Ki.dot(no);if(c<=0&&l<=0)return t.copy(n);io.subVectors(e,i);const h=Yi.dot(io),u=Ki.dot(io);if(h>=0&&u<=h)return t.copy(i);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(Yi,a);so.subVectors(e,r);const f=Yi.dot(so),b=Ki.dot(so);if(b>=0&&f<=b)return t.copy(r);const v=f*l-c*b;if(v<=0&&l>=0&&b<=0)return o=l/(l-b),t.copy(n).addScaledVector(Ki,o);const p=h*b-f*u;if(p<=0&&u-h>=0&&f-b>=0)return Jl.subVectors(r,i),o=(u-h)/(u-h+(f-b)),t.copy(i).addScaledVector(Jl,o);const m=1/(p+v+d);return a=v*m,o=d*m,t.copy(n).addScaledVector(Yi,a).addScaledVector(Ki,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const sd={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},di={h:0,s:0,l:0},Nr={h:0,s:0,l:0};function co(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class ue{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=pt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=$e.workingColorSpace){return this.r=e,this.g=t,this.b=n,$e.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=$e.workingColorSpace){if(e=Xc(e,1),t=Lt(t,0,1),n=Lt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=co(a,r,e+1/3),this.g=co(a,r,e),this.b=co(a,r,e-1/3)}return $e.toWorkingColorSpace(this,i),this}setStyle(e,t=pt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=pt){const n=sd[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ii(e.r),this.g=ii(e.g),this.b=ii(e.b),this}copyLinearToSRGB(e){return this.r=ps(e.r),this.g=ps(e.g),this.b=ps(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=pt){return $e.fromWorkingColorSpace(Vt.copy(this),e),Math.round(Lt(Vt.r*255,0,255))*65536+Math.round(Lt(Vt.g*255,0,255))*256+Math.round(Lt(Vt.b*255,0,255))}getHexString(e=pt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.fromWorkingColorSpace(Vt.copy(this),t);const n=Vt.r,i=Vt.g,r=Vt.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=$e.workingColorSpace){return $e.fromWorkingColorSpace(Vt.copy(this),t),e.r=Vt.r,e.g=Vt.g,e.b=Vt.b,e}getStyle(e=pt){$e.fromWorkingColorSpace(Vt.copy(this),e);const t=Vt.r,n=Vt.g,i=Vt.b;return e!==pt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(di),this.setHSL(di.h+e,di.s+t,di.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(di),e.getHSL(Nr);const n=ir(di.h,Nr.h,t),i=ir(di.s,Nr.s,t),r=ir(di.l,Nr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Vt=new ue;ue.NAMES=sd;let fp=0;class un extends Ls{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:fp++}),this.uuid=_n(),this.name="",this.blending=ds,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=zo,this.blendDst=Go,this.blendEquation=Ii,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ue(0,0,0),this.blendAlpha=0,this.depthFunc=bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Dl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=zi,this.stencilZFail=zi,this.stencilZPass=zi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ds&&(n.blending=this.blending),this.side!==si&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==zo&&(n.blendSrc=this.blendSrc),this.blendDst!==Go&&(n.blendDst=this.blendDst),this.blendEquation!==Ii&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==bs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Dl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==zi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==zi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==zi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Tt extends un{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.combine=Ra,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ei=pp();function pp(){const s=new ArrayBuffer(4),e=new Float32Array(s),t=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(n[c]=0,n[c|256]=32768,i[c]=24,i[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,i[c]=-l-1,i[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,i[c]=13,i[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,i[c]=24,i[c|256]=24):(n[c]=31744,n[c|256]=64512,i[c]=13,i[c|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;!(l&8388608);)l<<=1,h-=8388608;l&=-8388609,h+=947912704,r[c]=l|h}for(let c=1024;c<2048;++c)r[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:r,exponentTable:a,offsetTable:o}}function mp(s){Math.abs(s)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),s=Lt(s,-65504,65504),ei.floatView[0]=s;const e=ei.uint32View[0],t=e>>23&511;return ei.baseTable[t]+((e&8388607)>>ei.shiftTable[t])}function gp(s){const e=s>>10;return ei.uint32View[0]=ei.mantissaTable[ei.offsetTable[e]+(s&1023)]+ei.exponentTable[e],ei.floatView[0]}const Fr={toHalfFloat:mp,fromHalfFloat:gp},Ct=new P,Or=new q;class mt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Sc,this.updateRanges=[],this.gpuType=tn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Or.fromBufferAttribute(this,t),Or.applyMatrix3(e),this.setXY(t,Or.x,Or.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=En(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=En(t,this.array)),t}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=En(t,this.array)),t}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=En(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=En(t,this.array)),t}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array),r=ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Sc&&(e.usage=this.usage),e}}class rd extends mt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ad extends mt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class We extends mt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let bp=0;const pn=new Ge,lo=new _t,Ji=new P,cn=new bt,Gs=new bt,Ot=new P;class gt extends Ls{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bp++}),this.uuid=_n(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(td(e)?ad:rd)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new qe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return pn.makeRotationFromQuaternion(e),this.applyMatrix4(pn),this}rotateX(e){return pn.makeRotationX(e),this.applyMatrix4(pn),this}rotateY(e){return pn.makeRotationY(e),this.applyMatrix4(pn),this}rotateZ(e){return pn.makeRotationZ(e),this.applyMatrix4(pn),this}translate(e,t,n){return pn.makeTranslation(e,t,n),this.applyMatrix4(pn),this}scale(e,t,n){return pn.makeScale(e,t,n),this.applyMatrix4(pn),this}lookAt(e){return lo.lookAt(e),lo.updateMatrix(),this.applyMatrix4(lo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ji).negate(),this.translate(Ji.x,Ji.y,Ji.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new We(n,3))}else{for(let n=0,i=t.count;n<i;n++){const r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new bt);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];cn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ot.addVectors(this.boundingBox.min,cn.min),this.boundingBox.expandByPoint(Ot),Ot.addVectors(this.boundingBox.max,cn.max),this.boundingBox.expandByPoint(Ot)):(this.boundingBox.expandByPoint(cn.min),this.boundingBox.expandByPoint(cn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new On);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(cn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Gs.setFromBufferAttribute(o),this.morphTargetsRelative?(Ot.addVectors(cn.min,Gs.min),cn.expandByPoint(Ot),Ot.addVectors(cn.max,Gs.max),cn.expandByPoint(Ot)):(cn.expandByPoint(Gs.min),cn.expandByPoint(Gs.max))}cn.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)Ot.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Ot));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Ot.fromBufferAttribute(o,l),c&&(Ji.fromBufferAttribute(e,l),Ot.add(Ji)),i=Math.max(i,n.distanceToSquared(Ot))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new mt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let S=0;S<n.count;S++)o[S]=new P,c[S]=new P;const l=new P,h=new P,u=new P,d=new q,f=new q,b=new q,v=new P,p=new P;function m(S,y,M){l.fromBufferAttribute(n,S),h.fromBufferAttribute(n,y),u.fromBufferAttribute(n,M),d.fromBufferAttribute(r,S),f.fromBufferAttribute(r,y),b.fromBufferAttribute(r,M),h.sub(l),u.sub(l),f.sub(d),b.sub(d);const C=1/(f.x*b.y-b.x*f.y);isFinite(C)&&(v.copy(h).multiplyScalar(b.y).addScaledVector(u,-f.y).multiplyScalar(C),p.copy(u).multiplyScalar(f.x).addScaledVector(h,-b.x).multiplyScalar(C),o[S].add(v),o[y].add(v),o[M].add(v),c[S].add(p),c[y].add(p),c[M].add(p))}let g=this.groups;g.length===0&&(g=[{start:0,count:e.count}]);for(let S=0,y=g.length;S<y;++S){const M=g[S],C=M.start,D=M.count;for(let U=C,N=C+D;U<N;U+=3)m(e.getX(U+0),e.getX(U+1),e.getX(U+2))}const _=new P,x=new P,E=new P,w=new P;function A(S){E.fromBufferAttribute(i,S),w.copy(E);const y=o[S];_.copy(y),_.sub(E.multiplyScalar(E.dot(y))).normalize(),x.crossVectors(w,y);const C=x.dot(c[S])<0?-1:1;a.setXYZW(S,_.x,_.y,_.z,C)}for(let S=0,y=g.length;S<y;++S){const M=g[S],C=M.start,D=M.count;for(let U=C,N=C+D;U<N;U+=3)A(e.getX(U+0)),A(e.getX(U+1)),A(e.getX(U+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new mt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new P,r=new P,a=new P,o=new P,c=new P,l=new P,h=new P,u=new P;if(e)for(let d=0,f=e.count;d<f;d+=3){const b=e.getX(d+0),v=e.getX(d+1),p=e.getX(d+2);i.fromBufferAttribute(t,b),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,p),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,b),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,p),o.add(h),c.add(h),l.add(h),n.setXYZ(b,o.x,o.y,o.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ot.fromBufferAttribute(e,t),Ot.normalize(),e.setXYZ(t,Ot.x,Ot.y,Ot.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,b=0;for(let v=0,p=c.length;v<p;v++){o.isInterleavedBufferAttribute?f=c[v]*o.data.stride+o.offset:f=c[v]*h;for(let m=0;m<h;m++)d[b++]=l[f++]}return new mt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new gt,n=this.index.array,i=this.attributes;for(const o in i){const c=i[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=e(d,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(i[c]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Zl=new Ge,wi=new yr,kr=new On,Ql=new P,Br=new P,zr=new P,Gr=new P,ho=new P,Hr=new P,$l=new P,Vr=new P;class j extends _t{constructor(e=new gt,t=new Tt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){Hr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&(ho.fromBufferAttribute(u,e),a?Hr.addScaledVector(ho,h):Hr.addScaledVector(ho.sub(t),h))}t.add(Hr)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),kr.copy(n.boundingSphere),kr.applyMatrix4(r),wi.copy(e.ray).recast(e.near),!(kr.containsPoint(wi.origin)===!1&&(wi.intersectSphere(kr,Ql)===null||wi.origin.distanceToSquared(Ql)>(e.far-e.near)**2))&&(Zl.copy(r).invert(),wi.copy(e.ray).applyMatrix4(Zl),!(n.boundingBox!==null&&wi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,wi)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let b=0,v=d.length;b<v;b++){const p=d[b],m=a[p.materialIndex],g=Math.max(p.start,f.start),_=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let x=g,E=_;x<E;x+=3){const w=o.getX(x),A=o.getX(x+1),S=o.getX(x+2);i=Wr(this,m,e,n,l,h,u,w,A,S),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const b=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let p=b,m=v;p<m;p+=3){const g=o.getX(p),_=o.getX(p+1),x=o.getX(p+2);i=Wr(this,a,e,n,l,h,u,g,_,x),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let b=0,v=d.length;b<v;b++){const p=d[b],m=a[p.materialIndex],g=Math.max(p.start,f.start),_=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));for(let x=g,E=_;x<E;x+=3){const w=x,A=x+1,S=x+2;i=Wr(this,m,e,n,l,h,u,w,A,S),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const b=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let p=b,m=v;p<m;p+=3){const g=p,_=p+1,x=p+2;i=Wr(this,a,e,n,l,h,u,g,_,x),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function _p(s,e,t,n,i,r,a,o){let c;if(e.side===Zt?c=n.intersectTriangle(a,r,i,!0,o):c=n.intersectTriangle(i,r,a,e.side===si,o),c===null)return null;Vr.copy(o),Vr.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(Vr);return l<t.near||l>t.far?null:{distance:l,point:Vr.clone(),object:s}}function Wr(s,e,t,n,i,r,a,o,c,l){s.getVertexPosition(o,Br),s.getVertexPosition(c,zr),s.getVertexPosition(l,Gr);const h=_p(s,e,t,n,Br,zr,Gr,$l);if(h){const u=new P;gn.getBarycoord($l,Br,zr,Gr,u),i&&(h.uv=gn.getInterpolatedAttribute(i,o,c,l,u,new q)),r&&(h.uv1=gn.getInterpolatedAttribute(r,o,c,l,u,new q)),a&&(h.normal=gn.getInterpolatedAttribute(a,o,c,l,u,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new P,materialIndex:0};gn.getNormal(Br,zr,Gr,d.normal),h.face=d,h.barycoord=u}return h}class Se extends gt{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;b("z","y","x",-1,-1,n,t,e,a,r,0),b("z","y","x",1,-1,n,t,-e,a,r,1),b("x","z","y",1,1,e,n,t,i,a,2),b("x","z","y",1,-1,e,n,-t,i,a,3),b("x","y","z",1,-1,e,t,n,i,r,4),b("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new We(l,3)),this.setAttribute("normal",new We(h,3)),this.setAttribute("uv",new We(u,2));function b(v,p,m,g,_,x,E,w,A,S,y){const M=x/A,C=E/S,D=x/2,U=E/2,N=w/2,G=A+1,O=S+1;let Y=0,H=0;const te=new P;for(let oe=0;oe<O;oe++){const me=oe*C-U;for(let De=0;De<G;De++){const Ye=De*M-D;te[v]=Ye*g,te[p]=me*_,te[m]=N,l.push(te.x,te.y,te.z),te[v]=0,te[p]=0,te[m]=w>0?1:-1,h.push(te.x,te.y,te.z),u.push(De/A),u.push(1-oe/S),Y+=1}}for(let oe=0;oe<S;oe++)for(let me=0;me<A;me++){const De=d+me+G*oe,Ye=d+me+G*(oe+1),K=d+(me+1)+G*(oe+1),re=d+(me+1)+G*oe;c.push(De,Ye,re),c.push(Ye,K,re),H+=6}o.addGroup(f,H,y),f+=H,d+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Se(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ws(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function qt(s){const e={};for(let t=0;t<s.length;t++){const n=ws(s[t]);for(const i in n)e[i]=n[i]}return e}function xp(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function od(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const pr={clone:ws,merge:qt};var vp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,yp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Jt extends un{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=vp,this.fragmentShader=yp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ws(e.uniforms),this.uniformsGroups=xp(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class cd extends _t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ge,this.projectionMatrix=new Ge,this.projectionMatrixInverse=new Ge,this.coordinateSystem=ti}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const fi=new P,eh=new q,th=new q;class Kt extends cd{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ms*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(nr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ms*2*Math.atan(Math.tan(nr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(fi.x,fi.y).multiplyScalar(-e/fi.z),fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(fi.x,fi.y).multiplyScalar(-e/fi.z)}getViewSize(e,t){return this.getViewBounds(e,eh,th),t.subVectors(th,eh)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(nr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*i/c,t-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Zi=-90,Qi=1;class Mp extends _t{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Kt(Zi,Qi,e,t);i.layers=this.layers,this.add(i);const r=new Kt(Zi,Qi,e,t);r.layers=this.layers,this.add(r);const a=new Kt(Zi,Qi,e,t);a.layers=this.layers,this.add(a);const o=new Kt(Zi,Qi,e,t);o.layers=this.layers,this.add(o);const c=new Kt(Zi,Qi,e,t);c.layers=this.layers,this.add(c);const l=new Kt(Zi,Qi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===ti)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===wa)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),b=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,c),e.setRenderTarget(n,4,i),e.render(t,l),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=b,n.texture.needsPMREMUpdate=!0}}class ld extends Dt{constructor(e,t,n,i,r,a,o,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:_s,super(e,t,n,i,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class wp extends xn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new ld(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:kt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Se(5,5,5),r=new Jt({name:"CubemapFromEquirect",uniforms:ws(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Zt,blending:ni});r.uniforms.tEquirect.value=t;const a=new j(i,r),o=t.minFilter;return t.minFilter===An&&(t.minFilter=kt),new Mp(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}const uo=new P,Sp=new P,Tp=new qe;class Ci{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=uo.subVectors(n,t).cross(Sp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(uo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Tp.getNormalMatrix(e),i=this.coplanarPoint(uo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Si=new On,jr=new P;class Yc{constructor(e=new Ci,t=new Ci,n=new Ci,i=new Ci,r=new Ci,a=new Ci){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ti){const n=this.planes,i=e.elements,r=i[0],a=i[1],o=i[2],c=i[3],l=i[4],h=i[5],u=i[6],d=i[7],f=i[8],b=i[9],v=i[10],p=i[11],m=i[12],g=i[13],_=i[14],x=i[15];if(n[0].setComponents(c-r,d-l,p-f,x-m).normalize(),n[1].setComponents(c+r,d+l,p+f,x+m).normalize(),n[2].setComponents(c+a,d+h,p+b,x+g).normalize(),n[3].setComponents(c-a,d-h,p-b,x-g).normalize(),n[4].setComponents(c-o,d-u,p-v,x-_).normalize(),t===ti)n[5].setComponents(c+o,d+u,p+v,x+_).normalize();else if(t===wa)n[5].setComponents(o,u,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Si.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Si.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Si)}intersectsSprite(e){return Si.center.set(0,0,0),Si.radius=.7071067811865476,Si.applyMatrix4(e.matrixWorld),this.intersectsSphere(Si)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(jr.x=i.normal.x>0?e.max.x:e.min.x,jr.y=i.normal.y>0?e.max.y:e.min.y,jr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(jr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function hd(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Ep(s){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=s.createBuffer();s.bindBuffer(c,d),s.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c.updateRanges;if(s.bindBuffer(l,o),u.length===0)s.bufferSubData(l,0,h);else{u.sort((f,b)=>f.start-b.start);let d=0;for(let f=1;f<u.length;f++){const b=u[d],v=u[f];v.start<=b.start+b.count+1?b.count=Math.max(b.count,v.start+v.count-b.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,b=u.length;f<b;f++){const v=u[f];s.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(s.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:i,remove:r,update:a}}class Yt extends gt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(i),l=o+1,h=c+1,u=e/o,d=t/c,f=[],b=[],v=[],p=[];for(let m=0;m<h;m++){const g=m*d-a;for(let _=0;_<l;_++){const x=_*u-r;b.push(x,-g,0),v.push(0,0,1),p.push(_/o),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let g=0;g<o;g++){const _=g+l*m,x=g+l*(m+1),E=g+1+l*(m+1),w=g+1+l*m;f.push(_,x,w),f.push(x,E,w)}this.setIndex(f),this.setAttribute("position",new We(b,3)),this.setAttribute("normal",new We(v,3)),this.setAttribute("uv",new We(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yt(e.width,e.height,e.widthSegments,e.heightSegments)}}var Ap=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Rp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Cp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Pp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Lp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ip=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Dp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Up=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Np=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Fp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Op=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,kp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Bp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,zp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Gp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Hp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Vp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Wp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,jp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Xp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,qp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Yp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Kp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Jp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Zp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Qp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,$p=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,e0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,t0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,n0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,i0="gl_FragColor = linearToOutputTexel( gl_FragColor );",s0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,r0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,a0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,o0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,c0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,l0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,h0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,u0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,d0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,f0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,p0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,m0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,g0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,b0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,_0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,x0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,v0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,y0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,M0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,w0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,S0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,T0=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,E0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,A0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,R0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,C0=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,P0=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,L0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,I0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,D0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,U0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,N0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,F0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,O0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,k0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,B0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,z0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,G0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,H0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,V0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,W0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,j0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,X0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,q0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Y0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,K0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,J0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Z0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Q0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,$0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,em=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,tm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,nm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,im=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,sm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,rm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,am=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,om=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,cm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,lm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,hm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,um=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,dm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,pm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,mm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,gm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,bm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_m=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,xm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,vm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ym=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Mm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,wm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Tm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Em=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Am=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Im=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Dm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Um=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Nm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Fm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Om=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,km=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Bm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Gm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Vm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,jm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,qm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Ym=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Km=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Zm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$m=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,eg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,tg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ng=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ig=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,sg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Je={alphahash_fragment:Ap,alphahash_pars_fragment:Rp,alphamap_fragment:Cp,alphamap_pars_fragment:Pp,alphatest_fragment:Lp,alphatest_pars_fragment:Ip,aomap_fragment:Dp,aomap_pars_fragment:Up,batching_pars_vertex:Np,batching_vertex:Fp,begin_vertex:Op,beginnormal_vertex:kp,bsdfs:Bp,iridescence_fragment:zp,bumpmap_pars_fragment:Gp,clipping_planes_fragment:Hp,clipping_planes_pars_fragment:Vp,clipping_planes_pars_vertex:Wp,clipping_planes_vertex:jp,color_fragment:Xp,color_pars_fragment:qp,color_pars_vertex:Yp,color_vertex:Kp,common:Jp,cube_uv_reflection_fragment:Zp,defaultnormal_vertex:Qp,displacementmap_pars_vertex:$p,displacementmap_vertex:e0,emissivemap_fragment:t0,emissivemap_pars_fragment:n0,colorspace_fragment:i0,colorspace_pars_fragment:s0,envmap_fragment:r0,envmap_common_pars_fragment:a0,envmap_pars_fragment:o0,envmap_pars_vertex:c0,envmap_physical_pars_fragment:x0,envmap_vertex:l0,fog_vertex:h0,fog_pars_vertex:u0,fog_fragment:d0,fog_pars_fragment:f0,gradientmap_pars_fragment:p0,lightmap_pars_fragment:m0,lights_lambert_fragment:g0,lights_lambert_pars_fragment:b0,lights_pars_begin:_0,lights_toon_fragment:v0,lights_toon_pars_fragment:y0,lights_phong_fragment:M0,lights_phong_pars_fragment:w0,lights_physical_fragment:S0,lights_physical_pars_fragment:T0,lights_fragment_begin:E0,lights_fragment_maps:A0,lights_fragment_end:R0,logdepthbuf_fragment:C0,logdepthbuf_pars_fragment:P0,logdepthbuf_pars_vertex:L0,logdepthbuf_vertex:I0,map_fragment:D0,map_pars_fragment:U0,map_particle_fragment:N0,map_particle_pars_fragment:F0,metalnessmap_fragment:O0,metalnessmap_pars_fragment:k0,morphinstance_vertex:B0,morphcolor_vertex:z0,morphnormal_vertex:G0,morphtarget_pars_vertex:H0,morphtarget_vertex:V0,normal_fragment_begin:W0,normal_fragment_maps:j0,normal_pars_fragment:X0,normal_pars_vertex:q0,normal_vertex:Y0,normalmap_pars_fragment:K0,clearcoat_normal_fragment_begin:J0,clearcoat_normal_fragment_maps:Z0,clearcoat_pars_fragment:Q0,iridescence_pars_fragment:$0,opaque_fragment:em,packing:tm,premultiplied_alpha_fragment:nm,project_vertex:im,dithering_fragment:sm,dithering_pars_fragment:rm,roughnessmap_fragment:am,roughnessmap_pars_fragment:om,shadowmap_pars_fragment:cm,shadowmap_pars_vertex:lm,shadowmap_vertex:hm,shadowmask_pars_fragment:um,skinbase_vertex:dm,skinning_pars_vertex:fm,skinning_vertex:pm,skinnormal_vertex:mm,specularmap_fragment:gm,specularmap_pars_fragment:bm,tonemapping_fragment:_m,tonemapping_pars_fragment:xm,transmission_fragment:vm,transmission_pars_fragment:ym,uv_pars_fragment:Mm,uv_pars_vertex:wm,uv_vertex:Sm,worldpos_vertex:Tm,background_vert:Em,background_frag:Am,backgroundCube_vert:Rm,backgroundCube_frag:Cm,cube_vert:Pm,cube_frag:Lm,depth_vert:Im,depth_frag:Dm,distanceRGBA_vert:Um,distanceRGBA_frag:Nm,equirect_vert:Fm,equirect_frag:Om,linedashed_vert:km,linedashed_frag:Bm,meshbasic_vert:zm,meshbasic_frag:Gm,meshlambert_vert:Hm,meshlambert_frag:Vm,meshmatcap_vert:Wm,meshmatcap_frag:jm,meshnormal_vert:Xm,meshnormal_frag:qm,meshphong_vert:Ym,meshphong_frag:Km,meshphysical_vert:Jm,meshphysical_frag:Zm,meshtoon_vert:Qm,meshtoon_frag:$m,points_vert:eg,points_frag:tg,shadow_vert:ng,shadow_frag:ig,sprite_vert:sg,sprite_frag:rg},de={common:{diffuse:{value:new ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new qe}},envmap:{envMap:{value:null},envMapRotation:{value:new qe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new qe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new qe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new qe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new qe},normalScale:{value:new q(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new qe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new qe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new qe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new qe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0},uvTransform:{value:new qe}},sprite:{diffuse:{value:new ue(16777215)},opacity:{value:1},center:{value:new q(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new qe},alphaMap:{value:null},alphaMapTransform:{value:new qe},alphaTest:{value:0}}},In={basic:{uniforms:qt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Je.meshbasic_vert,fragmentShader:Je.meshbasic_frag},lambert:{uniforms:qt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new ue(0)}}]),vertexShader:Je.meshlambert_vert,fragmentShader:Je.meshlambert_frag},phong:{uniforms:qt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new ue(0)},specular:{value:new ue(1118481)},shininess:{value:30}}]),vertexShader:Je.meshphong_vert,fragmentShader:Je.meshphong_frag},standard:{uniforms:qt([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag},toon:{uniforms:qt([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new ue(0)}}]),vertexShader:Je.meshtoon_vert,fragmentShader:Je.meshtoon_frag},matcap:{uniforms:qt([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Je.meshmatcap_vert,fragmentShader:Je.meshmatcap_frag},points:{uniforms:qt([de.points,de.fog]),vertexShader:Je.points_vert,fragmentShader:Je.points_frag},dashed:{uniforms:qt([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Je.linedashed_vert,fragmentShader:Je.linedashed_frag},depth:{uniforms:qt([de.common,de.displacementmap]),vertexShader:Je.depth_vert,fragmentShader:Je.depth_frag},normal:{uniforms:qt([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Je.meshnormal_vert,fragmentShader:Je.meshnormal_frag},sprite:{uniforms:qt([de.sprite,de.fog]),vertexShader:Je.sprite_vert,fragmentShader:Je.sprite_frag},background:{uniforms:{uvTransform:{value:new qe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Je.background_vert,fragmentShader:Je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new qe}},vertexShader:Je.backgroundCube_vert,fragmentShader:Je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Je.cube_vert,fragmentShader:Je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Je.equirect_vert,fragmentShader:Je.equirect_frag},distanceRGBA:{uniforms:qt([de.common,de.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Je.distanceRGBA_vert,fragmentShader:Je.distanceRGBA_frag},shadow:{uniforms:qt([de.lights,de.fog,{color:{value:new ue(0)},opacity:{value:1}}]),vertexShader:Je.shadow_vert,fragmentShader:Je.shadow_frag}};In.physical={uniforms:qt([In.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new qe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new qe},clearcoatNormalScale:{value:new q(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new qe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new qe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new qe},sheen:{value:0},sheenColor:{value:new ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new qe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new qe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new qe},transmissionSamplerSize:{value:new q},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new qe},attenuationDistance:{value:0},attenuationColor:{value:new ue(0)},specularColor:{value:new ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new qe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new qe},anisotropyVector:{value:new q},anisotropyMap:{value:null},anisotropyMapTransform:{value:new qe}}]),vertexShader:Je.meshphysical_vert,fragmentShader:Je.meshphysical_frag};const Xr={r:0,b:0,g:0},Ti=new dn,ag=new Ge;function og(s,e,t,n,i,r,a){const o=new ue(0);let c=r===!0?0:1,l,h,u=null,d=0,f=null;function b(g){let _=g.isScene===!0?g.background:null;return _&&_.isTexture&&(_=(g.backgroundBlurriness>0?t:e).get(_)),_}function v(g){let _=!1;const x=b(g);x===null?m(o,c):x&&x.isColor&&(m(x,1),_=!0);const E=s.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function p(g,_){const x=b(_);x&&(x.isCubeTexture||x.mapping===Ca)?(h===void 0&&(h=new j(new Se(1,1,1),new Jt({name:"BackgroundCubeMaterial",uniforms:ws(In.backgroundCube.uniforms),vertexShader:In.backgroundCube.vertexShader,fragmentShader:In.backgroundCube.fragmentShader,side:Zt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Ti.copy(_.backgroundRotation),Ti.x*=-1,Ti.y*=-1,Ti.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Ti.y*=-1,Ti.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(ag.makeRotationFromEuler(Ti)),h.material.toneMapped=$e.getTransfer(x.colorSpace)!==ht,(u!==x||d!==x.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,f=s.toneMapping),h.layers.enableAll(),g.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new j(new Yt(2,2),new Jt({name:"BackgroundMaterial",uniforms:ws(In.background.uniforms),vertexShader:In.background.vertexShader,fragmentShader:In.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=$e.getTransfer(x.colorSpace)!==ht,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||f!==s.toneMapping)&&(l.material.needsUpdate=!0,u=x,d=x.version,f=s.toneMapping),l.layers.enableAll(),g.unshift(l,l.geometry,l.material,0,0,null))}function m(g,_){g.getRGB(Xr,od(s)),n.buffers.color.setClear(Xr.r,Xr.g,Xr.b,_,a)}return{getClearColor:function(){return o},setClearColor:function(g,_=1){o.set(g),c=_,m(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(g){c=g,m(o,c)},render:v,addToRenderList:p}}function cg(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,a=!1;function o(M,C,D,U,N){let G=!1;const O=u(U,D,C);r!==O&&(r=O,l(r.object)),G=f(M,U,D,N),G&&b(M,U,D,N),N!==null&&e.update(N,s.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,x(M,C,D,U),N!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function c(){return s.createVertexArray()}function l(M){return s.bindVertexArray(M)}function h(M){return s.deleteVertexArray(M)}function u(M,C,D){const U=D.wireframe===!0;let N=n[M.id];N===void 0&&(N={},n[M.id]=N);let G=N[C.id];G===void 0&&(G={},N[C.id]=G);let O=G[U];return O===void 0&&(O=d(c()),G[U]=O),O}function d(M){const C=[],D=[],U=[];for(let N=0;N<t;N++)C[N]=0,D[N]=0,U[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:D,attributeDivisors:U,object:M,attributes:{},index:null}}function f(M,C,D,U){const N=r.attributes,G=C.attributes;let O=0;const Y=D.getAttributes();for(const H in Y)if(Y[H].location>=0){const oe=N[H];let me=G[H];if(me===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(me=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(me=M.instanceColor)),oe===void 0||oe.attribute!==me||me&&oe.data!==me.data)return!0;O++}return r.attributesNum!==O||r.index!==U}function b(M,C,D,U){const N={},G=C.attributes;let O=0;const Y=D.getAttributes();for(const H in Y)if(Y[H].location>=0){let oe=G[H];oe===void 0&&(H==="instanceMatrix"&&M.instanceMatrix&&(oe=M.instanceMatrix),H==="instanceColor"&&M.instanceColor&&(oe=M.instanceColor));const me={};me.attribute=oe,oe&&oe.data&&(me.data=oe.data),N[H]=me,O++}r.attributes=N,r.attributesNum=O,r.index=U}function v(){const M=r.newAttributes;for(let C=0,D=M.length;C<D;C++)M[C]=0}function p(M){m(M,0)}function m(M,C){const D=r.newAttributes,U=r.enabledAttributes,N=r.attributeDivisors;D[M]=1,U[M]===0&&(s.enableVertexAttribArray(M),U[M]=1),N[M]!==C&&(s.vertexAttribDivisor(M,C),N[M]=C)}function g(){const M=r.newAttributes,C=r.enabledAttributes;for(let D=0,U=C.length;D<U;D++)C[D]!==M[D]&&(s.disableVertexAttribArray(D),C[D]=0)}function _(M,C,D,U,N,G,O){O===!0?s.vertexAttribIPointer(M,C,D,N,G):s.vertexAttribPointer(M,C,D,U,N,G)}function x(M,C,D,U){v();const N=U.attributes,G=D.getAttributes(),O=C.defaultAttributeValues;for(const Y in G){const H=G[Y];if(H.location>=0){let te=N[Y];if(te===void 0&&(Y==="instanceMatrix"&&M.instanceMatrix&&(te=M.instanceMatrix),Y==="instanceColor"&&M.instanceColor&&(te=M.instanceColor)),te!==void 0){const oe=te.normalized,me=te.itemSize,De=e.get(te);if(De===void 0)continue;const Ye=De.buffer,K=De.type,re=De.bytesPerElement,Te=K===s.INT||K===s.UNSIGNED_INT||te.gpuType===Bc;if(te.isInterleavedBufferAttribute){const ce=te.data,Ue=ce.stride,He=te.offset;if(ce.isInstancedInterleavedBuffer){for(let Be=0;Be<H.locationSize;Be++)m(H.location+Be,ce.meshPerAttribute);M.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let Be=0;Be<H.locationSize;Be++)p(H.location+Be);s.bindBuffer(s.ARRAY_BUFFER,Ye);for(let Be=0;Be<H.locationSize;Be++)_(H.location+Be,me/H.locationSize,K,oe,Ue*re,(He+me/H.locationSize*Be)*re,Te)}else{if(te.isInstancedBufferAttribute){for(let ce=0;ce<H.locationSize;ce++)m(H.location+ce,te.meshPerAttribute);M.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let ce=0;ce<H.locationSize;ce++)p(H.location+ce);s.bindBuffer(s.ARRAY_BUFFER,Ye);for(let ce=0;ce<H.locationSize;ce++)_(H.location+ce,me/H.locationSize,K,oe,me*re,me/H.locationSize*ce*re,Te)}}else if(O!==void 0){const oe=O[Y];if(oe!==void 0)switch(oe.length){case 2:s.vertexAttrib2fv(H.location,oe);break;case 3:s.vertexAttrib3fv(H.location,oe);break;case 4:s.vertexAttrib4fv(H.location,oe);break;default:s.vertexAttrib1fv(H.location,oe)}}}}g()}function E(){S();for(const M in n){const C=n[M];for(const D in C){const U=C[D];for(const N in U)h(U[N].object),delete U[N];delete C[D]}delete n[M]}}function w(M){if(n[M.id]===void 0)return;const C=n[M.id];for(const D in C){const U=C[D];for(const N in U)h(U[N].object),delete U[N];delete C[D]}delete n[M.id]}function A(M){for(const C in n){const D=n[C];if(D[M.id]===void 0)continue;const U=D[M.id];for(const N in U)h(U[N].object),delete U[N];delete D[M.id]}}function S(){y(),a=!0,r!==i&&(r=i,l(r.object))}function y(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:S,resetDefaultState:y,dispose:E,releaseStatesOfGeometry:w,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:p,disableUnusedAttributes:g}}function lg(s,e,t){let n;function i(l){n=l}function r(l,h){s.drawArrays(n,l,h),t.update(h,n,1)}function a(l,h,u){u!==0&&(s.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function o(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let b=0;b<u;b++)f+=h[b];t.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let b=0;b<l.length;b++)a(l[b],h[b],d[b]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let b=0;for(let v=0;v<u;v++)b+=h[v]*d[v];t.update(b,n,1)}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function hg(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(A){return!(A!==bn&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const S=A===nn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==ri&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==tn&&!S)}function c(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),b=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),g=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),_=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=b>0,w=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:b,maxTextureSize:v,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:g,maxVaryings:_,maxFragmentUniforms:x,vertexTextures:E,maxSamples:w}}function ug(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new Ci,o=new qe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const b=u.clippingPlanes,v=u.clipIntersection,p=u.clipShadows,m=s.get(u);if(!i||b===null||b.length===0||r&&!p)r?h(null):l();else{const g=r?0:n,_=g*4;let x=m.clippingState||null;c.value=x,x=h(b,d,_,f);for(let E=0;E!==_;++E)x[E]=t[E];m.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=g}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,b){const v=u!==null?u.length:0;let p=null;if(v!==0){if(p=c.value,b!==!0||p===null){const m=f+v*4,g=d.matrixWorldInverse;o.getNormalMatrix(g),(p===null||p.length<m)&&(p=new Float32Array(m));for(let _=0,x=f;_!==v;++_,x+=4)a.copy(u[_]).applyMatrix4(g,o),a.normal.toArray(p,x),p[x+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}function dg(s){let e=new WeakMap;function t(a,o){return o===Ko?a.mapping=_s:o===Jo&&(a.mapping=xs),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ko||o===Jo)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new wp(c.height);return l.fromEquirectangularTexture(s,a),e.set(a,l),a.addEventListener("dispose",i),t(l.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class Ia extends cd{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ls=4,nh=[.125,.215,.35,.446,.526,.582],Di=20,fo=new Ia,ih=new ue;let po=null,mo=0,go=0,bo=!1;const Pi=(1+Math.sqrt(5))/2,$i=1/Pi,sh=[new P(-Pi,$i,0),new P(Pi,$i,0),new P(-$i,0,Pi),new P($i,0,Pi),new P(0,Pi,-$i),new P(0,Pi,$i),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class Tc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){po=this._renderer.getRenderTarget(),mo=this._renderer.getActiveCubeFace(),go=this._renderer.getActiveMipmapLevel(),bo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=oh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ah(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(po,mo,go),this._renderer.xr.enabled=bo,e.scissorTest=!1,qr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===_s||e.mapping===xs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),po=this._renderer.getRenderTarget(),mo=this._renderer.getActiveCubeFace(),go=this._renderer.getActiveMipmapLevel(),bo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:kt,minFilter:kt,generateMipmaps:!1,type:nn,format:bn,colorSpace:jt,depthBuffer:!1},i=rh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=rh(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=fg(r)),this._blurMaterial=pg(r,e,t)}return i}_compileMaterial(e){const t=new j(this._lodPlanes[0],e);this._renderer.compile(t,fo)}_sceneToCubeUV(e,t,n,i){const o=new Kt(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(ih),h.toneMapping=_i,h.autoClear=!1;const f=new Tt({name:"PMREM.Background",side:Zt,depthWrite:!1,depthTest:!1}),b=new j(new Se,f);let v=!1;const p=e.background;p?p.isColor&&(f.color.copy(p),e.background=null,v=!0):(f.color.copy(ih),v=!0);for(let m=0;m<6;m++){const g=m%3;g===0?(o.up.set(0,c[m],0),o.lookAt(l[m],0,0)):g===1?(o.up.set(0,0,c[m]),o.lookAt(0,l[m],0)):(o.up.set(0,c[m],0),o.lookAt(0,0,l[m]));const _=this._cubeSize;qr(i,g*_,m>2?_:0,_,_),h.setRenderTarget(i),v&&h.render(b,o),h.render(e,o)}b.geometry.dispose(),b.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===_s||e.mapping===xs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=oh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ah());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new j(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;qr(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,fo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=sh[(i-r-1)%sh.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new j(this._lodPlanes[i],l),d=l.uniforms,f=this._sizeLods[n]-1,b=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Di-1),v=r/b,p=isFinite(r)?1+Math.floor(h*v):Di;p>Di&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Di}`);const m=[];let g=0;for(let A=0;A<Di;++A){const S=A/v,y=Math.exp(-S*S/2);m.push(y),A===0?g+=y:A<p&&(g+=2*y)}for(let A=0;A<m.length;A++)m[A]=m[A]/g;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=m,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:_}=this;d.dTheta.value=b,d.mipInt.value=_-n;const x=this._sizeLods[i],E=3*x*(i>_-ls?i-_+ls:0),w=4*(this._cubeSize-x);qr(t,E,w,3*x,2*x),c.setRenderTarget(t),c.render(u,fo)}}function fg(s){const e=[],t=[],n=[];let i=s;const r=s-ls+1+nh.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);t.push(o);let c=1/o;a>s-ls?c=nh[a-s+ls-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,b=6,v=3,p=2,m=1,g=new Float32Array(v*b*f),_=new Float32Array(p*b*f),x=new Float32Array(m*b*f);for(let w=0;w<f;w++){const A=w%3*2/3-1,S=w>2?0:-1,y=[A,S,0,A+2/3,S,0,A+2/3,S+1,0,A,S,0,A+2/3,S+1,0,A,S+1,0];g.set(y,v*b*w),_.set(d,p*b*w);const M=[w,w,w,w,w,w];x.set(M,m*b*w)}const E=new gt;E.setAttribute("position",new mt(g,v)),E.setAttribute("uv",new mt(_,p)),E.setAttribute("faceIndex",new mt(x,m)),e.push(E),i>ls&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function rh(s,e,t){const n=new xn(s,e,t);return n.texture.mapping=Ca,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function qr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function pg(s,e,t){const n=new Float32Array(Di),i=new P(0,1,0);return new Jt({name:"SphericalGaussianBlur",defines:{n:Di,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Kc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function ah(){return new Jt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Kc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function oh(){return new Jt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Kc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function Kc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function mg(s){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Ko||c===Jo,h=c===_s||c===xs;if(l||h){let u=e.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new Tc(s)),u=l?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&i(f)?(t===null&&(t=new Tc(s)),u=l?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function i(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function gg(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&er("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function bg(s,e,t,n){const i={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const b in d.attributes)e.remove(d.attributes[b]);for(const b in d.morphAttributes){const v=d.morphAttributes[b];for(let p=0,m=v.length;p<m;p++)e.remove(v[p])}d.removeEventListener("dispose",a),delete i[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function c(u){const d=u.attributes;for(const b in d)e.update(d[b],s.ARRAY_BUFFER);const f=u.morphAttributes;for(const b in f){const v=f[b];for(let p=0,m=v.length;p<m;p++)e.update(v[p],s.ARRAY_BUFFER)}}function l(u){const d=[],f=u.index,b=u.attributes.position;let v=0;if(f!==null){const g=f.array;v=f.version;for(let _=0,x=g.length;_<x;_+=3){const E=g[_+0],w=g[_+1],A=g[_+2];d.push(E,w,w,A,A,E)}}else if(b!==void 0){const g=b.array;v=b.version;for(let _=0,x=g.length/3-1;_<x;_+=3){const E=_+0,w=_+1,A=_+2;d.push(E,w,w,A,A,E)}}else return;const p=new(td(d)?ad:rd)(d,1);p.version=v;const m=r.get(u);m&&e.remove(m),r.set(u,p)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function _g(s,e,t){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,f){s.drawElements(n,f,r,d*a),t.update(f,n,1)}function l(d,f,b){b!==0&&(s.drawElementsInstanced(n,f,r,d*a,b),t.update(f,n,b))}function h(d,f,b){if(b===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,b);let p=0;for(let m=0;m<b;m++)p+=f[m];t.update(p,n,1)}function u(d,f,b,v){if(b===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<d.length;m++)l(d[m]/a,f[m],v[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,v,0,b);let m=0;for(let g=0;g<b;g++)m+=f[g]*v[g];t.update(m,n,1)}}this.setMode=i,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function xg(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function vg(s,e,t){const n=new WeakMap,i=new rt;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let y=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",y)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,b=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],g=o.morphAttributes.color||[];let _=0;f===!0&&(_=1),b===!0&&(_=2),v===!0&&(_=3);let x=o.attributes.position.count*_,E=1;x>e.maxTextureSize&&(E=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);const w=new Float32Array(x*E*4*u),A=new id(w,x,E,u);A.type=tn,A.needsUpdate=!0;const S=_*4;for(let M=0;M<u;M++){const C=p[M],D=m[M],U=g[M],N=x*E*4*M;for(let G=0;G<C.count;G++){const O=G*S;f===!0&&(i.fromBufferAttribute(C,G),w[N+O+0]=i.x,w[N+O+1]=i.y,w[N+O+2]=i.z,w[N+O+3]=0),b===!0&&(i.fromBufferAttribute(D,G),w[N+O+4]=i.x,w[N+O+5]=i.y,w[N+O+6]=i.z,w[N+O+7]=0),v===!0&&(i.fromBufferAttribute(U,G),w[N+O+8]=i.x,w[N+O+9]=i.y,w[N+O+10]=i.z,w[N+O+11]=U.itemSize===4?i.w:1)}}d={count:u,texture:A,size:new q(x,E)},n.set(o,d),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let f=0;for(let v=0;v<l.length;v++)f+=l[v];const b=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(s,"morphTargetBaseInfluence",b),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function yg(s,e,t,n){let i=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=e.get(c,h);if(i.get(u)!==l&&(e.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),i.get(c)!==l&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;i.get(d)!==l&&(d.update(),i.set(d,l))}return u}function a(){i=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}class ud extends Dt{constructor(e,t,n,i,r,a,o,c,l,h=fs){if(h!==fs&&h!==ys)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===fs&&(n=Ni),n===void 0&&h===ys&&(n=vs),super(null,i,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Qt,this.minFilter=c!==void 0?c:Qt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const dd=new Dt,ch=new ud(1,1),fd=new id,pd=new rp,md=new ld,lh=[],hh=[],uh=new Float32Array(16),dh=new Float32Array(9),fh=new Float32Array(4);function Is(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=lh[i];if(r===void 0&&(r=new Float32Array(i),lh[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Ut(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Nt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Da(s,e){let t=hh[e];t===void 0&&(t=new Int32Array(e),hh[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Mg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function wg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;s.uniform2fv(this.addr,e),Nt(t,e)}}function Sg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ut(t,e))return;s.uniform3fv(this.addr,e),Nt(t,e)}}function Tg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;s.uniform4fv(this.addr,e),Nt(t,e)}}function Eg(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Nt(t,e)}else{if(Ut(t,n))return;fh.set(n),s.uniformMatrix2fv(this.addr,!1,fh),Nt(t,n)}}function Ag(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Nt(t,e)}else{if(Ut(t,n))return;dh.set(n),s.uniformMatrix3fv(this.addr,!1,dh),Nt(t,n)}}function Rg(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Ut(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Nt(t,e)}else{if(Ut(t,n))return;uh.set(n),s.uniformMatrix4fv(this.addr,!1,uh),Nt(t,n)}}function Cg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Pg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;s.uniform2iv(this.addr,e),Nt(t,e)}}function Lg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;s.uniform3iv(this.addr,e),Nt(t,e)}}function Ig(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;s.uniform4iv(this.addr,e),Nt(t,e)}}function Dg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Ug(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ut(t,e))return;s.uniform2uiv(this.addr,e),Nt(t,e)}}function Ng(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ut(t,e))return;s.uniform3uiv(this.addr,e),Nt(t,e)}}function Fg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ut(t,e))return;s.uniform4uiv(this.addr,e),Nt(t,e)}}function Og(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(ch.compareFunction=ed,r=ch):r=dd,t.setTexture2D(e||r,i)}function kg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||pd,i)}function Bg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||md,i)}function zg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||fd,i)}function Gg(s){switch(s){case 5126:return Mg;case 35664:return wg;case 35665:return Sg;case 35666:return Tg;case 35674:return Eg;case 35675:return Ag;case 35676:return Rg;case 5124:case 35670:return Cg;case 35667:case 35671:return Pg;case 35668:case 35672:return Lg;case 35669:case 35673:return Ig;case 5125:return Dg;case 36294:return Ug;case 36295:return Ng;case 36296:return Fg;case 35678:case 36198:case 36298:case 36306:case 35682:return Og;case 35679:case 36299:case 36307:return kg;case 35680:case 36300:case 36308:case 36293:return Bg;case 36289:case 36303:case 36311:case 36292:return zg}}function Hg(s,e){s.uniform1fv(this.addr,e)}function Vg(s,e){const t=Is(e,this.size,2);s.uniform2fv(this.addr,t)}function Wg(s,e){const t=Is(e,this.size,3);s.uniform3fv(this.addr,t)}function jg(s,e){const t=Is(e,this.size,4);s.uniform4fv(this.addr,t)}function Xg(s,e){const t=Is(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function qg(s,e){const t=Is(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Yg(s,e){const t=Is(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Kg(s,e){s.uniform1iv(this.addr,e)}function Jg(s,e){s.uniform2iv(this.addr,e)}function Zg(s,e){s.uniform3iv(this.addr,e)}function Qg(s,e){s.uniform4iv(this.addr,e)}function $g(s,e){s.uniform1uiv(this.addr,e)}function eb(s,e){s.uniform2uiv(this.addr,e)}function tb(s,e){s.uniform3uiv(this.addr,e)}function nb(s,e){s.uniform4uiv(this.addr,e)}function ib(s,e,t){const n=this.cache,i=e.length,r=Da(t,i);Ut(n,r)||(s.uniform1iv(this.addr,r),Nt(n,r));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||dd,r[a])}function sb(s,e,t){const n=this.cache,i=e.length,r=Da(t,i);Ut(n,r)||(s.uniform1iv(this.addr,r),Nt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||pd,r[a])}function rb(s,e,t){const n=this.cache,i=e.length,r=Da(t,i);Ut(n,r)||(s.uniform1iv(this.addr,r),Nt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||md,r[a])}function ab(s,e,t){const n=this.cache,i=e.length,r=Da(t,i);Ut(n,r)||(s.uniform1iv(this.addr,r),Nt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||fd,r[a])}function ob(s){switch(s){case 5126:return Hg;case 35664:return Vg;case 35665:return Wg;case 35666:return jg;case 35674:return Xg;case 35675:return qg;case 35676:return Yg;case 5124:case 35670:return Kg;case 35667:case 35671:return Jg;case 35668:case 35672:return Zg;case 35669:case 35673:return Qg;case 5125:return $g;case 36294:return eb;case 36295:return tb;case 36296:return nb;case 35678:case 36198:case 36298:case 36306:case 35682:return ib;case 35679:case 36299:case 36307:return sb;case 35680:case 36300:case 36308:case 36293:return rb;case 36289:case 36303:case 36311:case 36292:return ab}}class cb{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Gg(t.type)}}class lb{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ob(t.type)}}class hb{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const _o=/(\w+)(\])?(\[|\.)?/g;function ph(s,e){s.seq.push(e),s.map[e.id]=e}function ub(s,e,t){const n=s.name,i=n.length;for(_o.lastIndex=0;;){const r=_o.exec(n),a=_o.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===i){ph(t,l===void 0?new cb(o,s,e):new lb(o,s,e));break}else{let u=t.map[o];u===void 0&&(u=new hb(o),ph(t,u)),t=u}}}class xa{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),a=e.getUniformLocation(t,r.name);ub(r,a,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function mh(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const db=37297;let fb=0;function pb(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const gh=new qe;function mb(s){$e._getMatrix(gh,$e.workingColorSpace,s);const e=`mat3( ${gh.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(s)){case La:return[e,"LinearTransferOETF"];case ht:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function bh(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+pb(s.getShaderSource(e),a)}else return i}function gb(s,e){const t=mb(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function bb(s,e){let t;switch(e){case Ou:t="Linear";break;case ku:t="Reinhard";break;case Bu:t="Cineon";break;case kc:t="ACESFilmic";break;case zu:t="AgX";break;case Gu:t="Neutral";break;case vf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Yr=new P;function _b(){$e.getLuminanceCoefficients(Yr);const s=Yr.x.toFixed(4),e=Yr.y.toFixed(4),t=Yr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function xb(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(tr).join(`
`)}function vb(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function yb(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function tr(s){return s!==""}function _h(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function xh(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Mb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ec(s){return s.replace(Mb,Sb)}const wb=new Map;function Sb(s,e){let t=Je[e];if(t===void 0){const n=wb.get(e);if(n!==void 0)t=Je[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ec(t)}const Tb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vh(s){return s.replace(Tb,Eb)}function Eb(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function yh(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Ab(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Nu?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Fu?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Jn&&(e="SHADOWMAP_TYPE_VSM"),e}function Rb(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case _s:case xs:e="ENVMAP_TYPE_CUBE";break;case Ca:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Cb(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case xs:e="ENVMAP_MODE_REFRACTION";break}return e}function Pb(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Ra:e="ENVMAP_BLENDING_MULTIPLY";break;case _f:e="ENVMAP_BLENDING_MIX";break;case xf:e="ENVMAP_BLENDING_ADD";break}return e}function Lb(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Ib(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=Ab(t),l=Rb(t),h=Cb(t),u=Pb(t),d=Lb(t),f=xb(t),b=vb(r),v=i.createProgram();let p,m,g=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,b].filter(tr).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,b].filter(tr).join(`
`),m.length>0&&(m+=`
`)):(p=[yh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,b,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(tr).join(`
`),m=[yh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,b,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==_i?"#define TONE_MAPPING":"",t.toneMapping!==_i?Je.tonemapping_pars_fragment:"",t.toneMapping!==_i?bb("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Je.colorspace_pars_fragment,gb("linearToOutputTexel",t.outputColorSpace),_b(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(tr).join(`
`)),a=Ec(a),a=_h(a,t),a=xh(a,t),o=Ec(o),o=_h(o,t),o=xh(o,t),a=vh(a),o=vh(o),t.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===Ul?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ul?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const _=g+p+a,x=g+m+o,E=mh(i,i.VERTEX_SHADER,_),w=mh(i,i.FRAGMENT_SHADER,x);i.attachShader(v,E),i.attachShader(v,w),t.index0AttributeName!==void 0?i.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function A(C){if(s.debug.checkShaderErrors){const D=i.getProgramInfoLog(v).trim(),U=i.getShaderInfoLog(E).trim(),N=i.getShaderInfoLog(w).trim();let G=!0,O=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(G=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,E,w);else{const Y=bh(i,E,"vertex"),H=bh(i,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+D+`
`+Y+`
`+H)}else D!==""?console.warn("THREE.WebGLProgram: Program Info Log:",D):(U===""||N==="")&&(O=!1);O&&(C.diagnostics={runnable:G,programLog:D,vertexShader:{log:U,prefix:p},fragmentShader:{log:N,prefix:m}})}i.deleteShader(E),i.deleteShader(w),S=new xa(i,v),y=yb(i,v)}let S;this.getUniforms=function(){return S===void 0&&A(this),S};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=i.getProgramParameter(v,db)),M},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=fb++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=w,this}let Db=0;class Ub{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Nb(e),t.set(e,n)),n}}class Nb{constructor(e){this.id=Db++,this.code=e,this.usedTimes=0}}function Fb(s,e,t,n,i,r,a){const o=new qc,c=new Ub,l=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures;let f=i.precision;const b={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(y){return l.add(y),y===0?"uv":`uv${y}`}function p(y,M,C,D,U){const N=D.fog,G=U.geometry,O=y.isMeshStandardMaterial?D.environment:null,Y=(y.isMeshStandardMaterial?t:e).get(y.envMap||O),H=Y&&Y.mapping===Ca?Y.image.height:null,te=b[y.type];y.precision!==null&&(f=i.getMaxPrecision(y.precision),f!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",f,"instead."));const oe=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,me=oe!==void 0?oe.length:0;let De=0;G.morphAttributes.position!==void 0&&(De=1),G.morphAttributes.normal!==void 0&&(De=2),G.morphAttributes.color!==void 0&&(De=3);let Ye,K,re,Te;if(te){const lt=In[te];Ye=lt.vertexShader,K=lt.fragmentShader}else Ye=y.vertexShader,K=y.fragmentShader,c.update(y),re=c.getVertexShaderID(y),Te=c.getFragmentShaderID(y);const ce=s.getRenderTarget(),Ue=s.state.buffers.depth.getReversed(),He=U.isInstancedMesh===!0,Be=U.isBatchedMesh===!0,nt=!!y.map,$=!!y.matcap,se=!!Y,I=!!y.aoMap,Le=!!y.lightMap,ne=!!y.bumpMap,ye=!!y.normalMap,he=!!y.displacementMap,Oe=!!y.emissiveMap,xe=!!y.metalnessMap,L=!!y.roughnessMap,T=y.anisotropy>0,z=y.clearcoat>0,J=y.dispersion>0,ee=y.iridescence>0,Z=y.sheen>0,Ee=y.transmission>0,fe=T&&!!y.anisotropyMap,ve=z&&!!y.clearcoatMap,Qe=z&&!!y.clearcoatNormalMap,ie=z&&!!y.clearcoatRoughnessMap,Me=ee&&!!y.iridescenceMap,ke=ee&&!!y.iridescenceThicknessMap,ze=Z&&!!y.sheenColorMap,we=Z&&!!y.sheenRoughnessMap,tt=!!y.specularMap,Ke=!!y.specularColorMap,xt=!!y.specularIntensityMap,F=Ee&&!!y.transmissionMap,pe=Ee&&!!y.thicknessMap,X=!!y.gradientMap,Q=!!y.alphaMap,_e=y.alphaTest>0,ge=!!y.alphaHash,je=!!y.extensions;let At=_i;y.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(At=s.toneMapping);const Gt={shaderID:te,shaderType:y.type,shaderName:y.name,vertexShader:Ye,fragmentShader:K,defines:y.defines,customVertexShaderID:re,customFragmentShaderID:Te,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:f,batching:Be,batchingColor:Be&&U._colorsTexture!==null,instancing:He,instancingColor:He&&U.instanceColor!==null,instancingMorph:He&&U.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ce===null?s.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:jt,alphaToCoverage:!!y.alphaToCoverage,map:nt,matcap:$,envMap:se,envMapMode:se&&Y.mapping,envMapCubeUVHeight:H,aoMap:I,lightMap:Le,bumpMap:ne,normalMap:ye,displacementMap:d&&he,emissiveMap:Oe,normalMapObjectSpace:ye&&y.normalMapType===Ef,normalMapTangentSpace:ye&&y.normalMapType===Pa,metalnessMap:xe,roughnessMap:L,anisotropy:T,anisotropyMap:fe,clearcoat:z,clearcoatMap:ve,clearcoatNormalMap:Qe,clearcoatRoughnessMap:ie,dispersion:J,iridescence:ee,iridescenceMap:Me,iridescenceThicknessMap:ke,sheen:Z,sheenColorMap:ze,sheenRoughnessMap:we,specularMap:tt,specularColorMap:Ke,specularIntensityMap:xt,transmission:Ee,transmissionMap:F,thicknessMap:pe,gradientMap:X,opaque:y.transparent===!1&&y.blending===ds&&y.alphaToCoverage===!1,alphaMap:Q,alphaTest:_e,alphaHash:ge,combine:y.combine,mapUv:nt&&v(y.map.channel),aoMapUv:I&&v(y.aoMap.channel),lightMapUv:Le&&v(y.lightMap.channel),bumpMapUv:ne&&v(y.bumpMap.channel),normalMapUv:ye&&v(y.normalMap.channel),displacementMapUv:he&&v(y.displacementMap.channel),emissiveMapUv:Oe&&v(y.emissiveMap.channel),metalnessMapUv:xe&&v(y.metalnessMap.channel),roughnessMapUv:L&&v(y.roughnessMap.channel),anisotropyMapUv:fe&&v(y.anisotropyMap.channel),clearcoatMapUv:ve&&v(y.clearcoatMap.channel),clearcoatNormalMapUv:Qe&&v(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ie&&v(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Me&&v(y.iridescenceMap.channel),iridescenceThicknessMapUv:ke&&v(y.iridescenceThicknessMap.channel),sheenColorMapUv:ze&&v(y.sheenColorMap.channel),sheenRoughnessMapUv:we&&v(y.sheenRoughnessMap.channel),specularMapUv:tt&&v(y.specularMap.channel),specularColorMapUv:Ke&&v(y.specularColorMap.channel),specularIntensityMapUv:xt&&v(y.specularIntensityMap.channel),transmissionMapUv:F&&v(y.transmissionMap.channel),thicknessMapUv:pe&&v(y.thicknessMap.channel),alphaMapUv:Q&&v(y.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(ye||T),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!G.attributes.uv&&(nt||Q),fog:!!N,useFog:y.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Ue,skinning:U.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:me,morphTextureStride:De,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:s.shadowMap.enabled&&C.length>0,shadowMapType:s.shadowMap.type,toneMapping:At,decodeVideoTexture:nt&&y.map.isVideoTexture===!0&&$e.getTransfer(y.map.colorSpace)===ht,decodeVideoTextureEmissive:Oe&&y.emissiveMap.isVideoTexture===!0&&$e.getTransfer(y.emissiveMap.colorSpace)===ht,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Rt,flipSided:y.side===Zt,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:je&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(je&&y.extensions.multiDraw===!0||Be)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Gt.vertexUv1s=l.has(1),Gt.vertexUv2s=l.has(2),Gt.vertexUv3s=l.has(3),l.clear(),Gt}function m(y){const M=[];if(y.shaderID?M.push(y.shaderID):(M.push(y.customVertexShaderID),M.push(y.customFragmentShaderID)),y.defines!==void 0)for(const C in y.defines)M.push(C),M.push(y.defines[C]);return y.isRawShaderMaterial===!1&&(g(M,y),_(M,y),M.push(s.outputColorSpace)),M.push(y.customProgramCacheKey),M.join()}function g(y,M){y.push(M.precision),y.push(M.outputColorSpace),y.push(M.envMapMode),y.push(M.envMapCubeUVHeight),y.push(M.mapUv),y.push(M.alphaMapUv),y.push(M.lightMapUv),y.push(M.aoMapUv),y.push(M.bumpMapUv),y.push(M.normalMapUv),y.push(M.displacementMapUv),y.push(M.emissiveMapUv),y.push(M.metalnessMapUv),y.push(M.roughnessMapUv),y.push(M.anisotropyMapUv),y.push(M.clearcoatMapUv),y.push(M.clearcoatNormalMapUv),y.push(M.clearcoatRoughnessMapUv),y.push(M.iridescenceMapUv),y.push(M.iridescenceThicknessMapUv),y.push(M.sheenColorMapUv),y.push(M.sheenRoughnessMapUv),y.push(M.specularMapUv),y.push(M.specularColorMapUv),y.push(M.specularIntensityMapUv),y.push(M.transmissionMapUv),y.push(M.thicknessMapUv),y.push(M.combine),y.push(M.fogExp2),y.push(M.sizeAttenuation),y.push(M.morphTargetsCount),y.push(M.morphAttributeCount),y.push(M.numDirLights),y.push(M.numPointLights),y.push(M.numSpotLights),y.push(M.numSpotLightMaps),y.push(M.numHemiLights),y.push(M.numRectAreaLights),y.push(M.numDirLightShadows),y.push(M.numPointLightShadows),y.push(M.numSpotLightShadows),y.push(M.numSpotLightShadowsWithMaps),y.push(M.numLightProbes),y.push(M.shadowMapType),y.push(M.toneMapping),y.push(M.numClippingPlanes),y.push(M.numClipIntersection),y.push(M.depthPacking)}function _(y,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),y.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),y.push(o.mask)}function x(y){const M=b[y.type];let C;if(M){const D=In[M];C=pr.clone(D.uniforms)}else C=y.uniforms;return C}function E(y,M){let C;for(let D=0,U=h.length;D<U;D++){const N=h[D];if(N.cacheKey===M){C=N,++C.usedTimes;break}}return C===void 0&&(C=new Ib(s,M,y,r),h.push(C)),C}function w(y){if(--y.usedTimes===0){const M=h.indexOf(y);h[M]=h[h.length-1],h.pop(),y.destroy()}}function A(y){c.remove(y)}function S(){c.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:x,acquireProgram:E,releaseProgram:w,releaseShaderCache:A,programs:h,dispose:S}}function Ob(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,c){s.get(a)[o]=c}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function kb(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function Mh(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function wh(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(u,d,f,b,v,p){let m=s[e];return m===void 0?(m={id:u.id,object:u,geometry:d,material:f,groupOrder:b,renderOrder:u.renderOrder,z:v,group:p},s[e]=m):(m.id=u.id,m.object=u,m.geometry=d,m.material=f,m.groupOrder=b,m.renderOrder=u.renderOrder,m.z=v,m.group=p),e++,m}function o(u,d,f,b,v,p){const m=a(u,d,f,b,v,p);f.transmission>0?n.push(m):f.transparent===!0?i.push(m):t.push(m)}function c(u,d,f,b,v,p){const m=a(u,d,f,b,v,p);f.transmission>0?n.unshift(m):f.transparent===!0?i.unshift(m):t.unshift(m)}function l(u,d){t.length>1&&t.sort(u||kb),n.length>1&&n.sort(d||Mh),i.length>1&&i.sort(d||Mh)}function h(){for(let u=e,d=s.length;u<d;u++){const f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:o,unshift:c,finish:h,sort:l}}function Bb(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new wh,s.set(n,[a])):i>=r.length?(a=new wh,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function zb(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new ue};break;case"SpotLight":t={position:new P,direction:new P,color:new ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new ue,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new ue,groundColor:new ue};break;case"RectAreaLight":t={color:new ue,position:new P,halfWidth:new P,halfHeight:new P};break}return s[e.id]=t,t}}}function Gb(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new q};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new q};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new q,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Hb=0;function Vb(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Wb(s){const e=new zb,t=Gb(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new P);const i=new P,r=new Ge,a=new Ge;function o(l){let h=0,u=0,d=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let f=0,b=0,v=0,p=0,m=0,g=0,_=0,x=0,E=0,w=0,A=0;l.sort(Vb);for(let y=0,M=l.length;y<M;y++){const C=l[y],D=C.color,U=C.intensity,N=C.distance,G=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=D.r*U,u+=D.g*U,d+=D.b*U;else if(C.isLightProbe){for(let O=0;O<9;O++)n.probe[O].addScaledVector(C.sh.coefficients[O],U);A++}else if(C.isDirectionalLight){const O=e.get(C);if(O.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const Y=C.shadow,H=t.get(C);H.shadowIntensity=Y.intensity,H.shadowBias=Y.bias,H.shadowNormalBias=Y.normalBias,H.shadowRadius=Y.radius,H.shadowMapSize=Y.mapSize,n.directionalShadow[f]=H,n.directionalShadowMap[f]=G,n.directionalShadowMatrix[f]=C.shadow.matrix,g++}n.directional[f]=O,f++}else if(C.isSpotLight){const O=e.get(C);O.position.setFromMatrixPosition(C.matrixWorld),O.color.copy(D).multiplyScalar(U),O.distance=N,O.coneCos=Math.cos(C.angle),O.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),O.decay=C.decay,n.spot[v]=O;const Y=C.shadow;if(C.map&&(n.spotLightMap[E]=C.map,E++,Y.updateMatrices(C),C.castShadow&&w++),n.spotLightMatrix[v]=Y.matrix,C.castShadow){const H=t.get(C);H.shadowIntensity=Y.intensity,H.shadowBias=Y.bias,H.shadowNormalBias=Y.normalBias,H.shadowRadius=Y.radius,H.shadowMapSize=Y.mapSize,n.spotShadow[v]=H,n.spotShadowMap[v]=G,x++}v++}else if(C.isRectAreaLight){const O=e.get(C);O.color.copy(D).multiplyScalar(U),O.halfWidth.set(C.width*.5,0,0),O.halfHeight.set(0,C.height*.5,0),n.rectArea[p]=O,p++}else if(C.isPointLight){const O=e.get(C);if(O.color.copy(C.color).multiplyScalar(C.intensity),O.distance=C.distance,O.decay=C.decay,C.castShadow){const Y=C.shadow,H=t.get(C);H.shadowIntensity=Y.intensity,H.shadowBias=Y.bias,H.shadowNormalBias=Y.normalBias,H.shadowRadius=Y.radius,H.shadowMapSize=Y.mapSize,H.shadowCameraNear=Y.camera.near,H.shadowCameraFar=Y.camera.far,n.pointShadow[b]=H,n.pointShadowMap[b]=G,n.pointShadowMatrix[b]=C.shadow.matrix,_++}n.point[b]=O,b++}else if(C.isHemisphereLight){const O=e.get(C);O.skyColor.copy(C.color).multiplyScalar(U),O.groundColor.copy(C.groundColor).multiplyScalar(U),n.hemi[m]=O,m++}}p>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=de.LTC_FLOAT_1,n.rectAreaLTC2=de.LTC_FLOAT_2):(n.rectAreaLTC1=de.LTC_HALF_1,n.rectAreaLTC2=de.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const S=n.hash;(S.directionalLength!==f||S.pointLength!==b||S.spotLength!==v||S.rectAreaLength!==p||S.hemiLength!==m||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==x||S.numSpotMaps!==E||S.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=p,n.point.length=b,n.hemi.length=m,n.directionalShadow.length=g,n.directionalShadowMap.length=g,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=g,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=x+E-w,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=A,S.directionalLength=f,S.pointLength=b,S.spotLength=v,S.rectAreaLength=p,S.hemiLength=m,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=x,S.numSpotMaps=E,S.numLightProbes=A,n.version=Hb++)}function c(l,h){let u=0,d=0,f=0,b=0,v=0;const p=h.matrixWorldInverse;for(let m=0,g=l.length;m<g;m++){const _=l[m];if(_.isDirectionalLight){const x=n.directional[u];x.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(p),u++}else if(_.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(p),x.direction.setFromMatrixPosition(_.matrixWorld),i.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(p),f++}else if(_.isRectAreaLight){const x=n.rectArea[b];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(p),a.identity(),r.copy(_.matrixWorld),r.premultiply(p),a.extractRotation(r),x.halfWidth.set(_.width*.5,0,0),x.halfHeight.set(0,_.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),b++}else if(_.isPointLight){const x=n.point[d];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(p),d++}else if(_.isHemisphereLight){const x=n.hemi[v];x.direction.setFromMatrixPosition(_.matrixWorld),x.direction.transformDirection(p),v++}}}return{setup:o,setupView:c,state:n}}function Sh(s){const e=new Wb(s),t=[],n=[];function i(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function jb(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new Sh(s),e.set(i,[o])):r>=a.length?(o=new Sh(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class Xb extends un{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Sf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class qb extends un{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Yb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Kb=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Jb(s,e,t){let n=new Yc;const i=new q,r=new q,a=new rt,o=new Xb({depthPacking:Tf}),c=new qb,l={},h=t.maxTextureSize,u={[si]:Zt,[Zt]:si,[Rt]:Rt},d=new Jt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new q},radius:{value:4}},vertexShader:Yb,fragmentShader:Kb}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const b=new gt;b.setAttribute("position",new mt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new j(b,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nu;let m=this.type;this.render=function(w,A,S){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const y=s.getRenderTarget(),M=s.getActiveCubeFace(),C=s.getActiveMipmapLevel(),D=s.state;D.setBlending(ni),D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const U=m!==Jn&&this.type===Jn,N=m===Jn&&this.type!==Jn;for(let G=0,O=w.length;G<O;G++){const Y=w[G],H=Y.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const te=H.getFrameExtents();if(i.multiply(te),r.copy(H.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/te.x),i.x=r.x*te.x,H.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/te.y),i.y=r.y*te.y,H.mapSize.y=r.y)),H.map===null||U===!0||N===!0){const me=this.type!==Jn?{minFilter:Qt,magFilter:Qt}:{};H.map!==null&&H.map.dispose(),H.map=new xn(i.x,i.y,me),H.map.texture.name=Y.name+".shadowMap",H.camera.updateProjectionMatrix()}s.setRenderTarget(H.map),s.clear();const oe=H.getViewportCount();for(let me=0;me<oe;me++){const De=H.getViewport(me);a.set(r.x*De.x,r.y*De.y,r.x*De.z,r.y*De.w),D.viewport(a),H.updateMatrices(Y,me),n=H.getFrustum(),x(A,S,H.camera,Y,this.type)}H.isPointLightShadow!==!0&&this.type===Jn&&g(H,S),H.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(y,M,C)};function g(w,A){const S=e.update(v);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new xn(i.x,i.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(A,null,S,d,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(A,null,S,f,v,null)}function _(w,A,S,y){let M=null;const C=S.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(C!==void 0)M=C;else if(M=S.isPointLight===!0?c:o,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const D=M.uuid,U=A.uuid;let N=l[D];N===void 0&&(N={},l[D]=N);let G=N[U];G===void 0&&(G=M.clone(),N[U]=G,A.addEventListener("dispose",E)),M=G}if(M.visible=A.visible,M.wireframe=A.wireframe,y===Jn?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:u[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,S.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const D=s.properties.get(M);D.light=S}return M}function x(w,A,S,y,M){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===Jn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,w.matrixWorld);const U=e.update(w),N=w.material;if(Array.isArray(N)){const G=U.groups;for(let O=0,Y=G.length;O<Y;O++){const H=G[O],te=N[H.materialIndex];if(te&&te.visible){const oe=_(w,te,y,M);w.onBeforeShadow(s,w,A,S,U,oe,H),s.renderBufferDirect(S,null,U,oe,w,H),w.onAfterShadow(s,w,A,S,U,oe,H)}}}else if(N.visible){const G=_(w,N,y,M);w.onBeforeShadow(s,w,A,S,U,G,null),s.renderBufferDirect(S,null,U,G,w,null),w.onAfterShadow(s,w,A,S,U,G,null)}}const D=w.children;for(let U=0,N=D.length;U<N;U++)x(D[U],A,S,y,M)}function E(w){w.target.removeEventListener("dispose",E);for(const S in l){const y=l[S],M=w.target.uuid;M in y&&(y[M].dispose(),delete y[M])}}}const Zb={[Ho]:Vo,[Wo]:qo,[jo]:Yo,[bs]:Xo,[Vo]:Ho,[qo]:Wo,[Yo]:jo,[Xo]:bs};function Qb(s,e){function t(){let F=!1;const pe=new rt;let X=null;const Q=new rt(0,0,0,0);return{setMask:function(_e){X!==_e&&!F&&(s.colorMask(_e,_e,_e,_e),X=_e)},setLocked:function(_e){F=_e},setClear:function(_e,ge,je,At,Gt){Gt===!0&&(_e*=At,ge*=At,je*=At),pe.set(_e,ge,je,At),Q.equals(pe)===!1&&(s.clearColor(_e,ge,je,At),Q.copy(pe))},reset:function(){F=!1,X=null,Q.set(-1,0,0,0)}}}function n(){let F=!1,pe=!1,X=null,Q=null,_e=null;return{setReversed:function(ge){if(pe!==ge){const je=e.get("EXT_clip_control");pe?je.clipControlEXT(je.LOWER_LEFT_EXT,je.ZERO_TO_ONE_EXT):je.clipControlEXT(je.LOWER_LEFT_EXT,je.NEGATIVE_ONE_TO_ONE_EXT);const At=_e;_e=null,this.setClear(At)}pe=ge},getReversed:function(){return pe},setTest:function(ge){ge?ce(s.DEPTH_TEST):Ue(s.DEPTH_TEST)},setMask:function(ge){X!==ge&&!F&&(s.depthMask(ge),X=ge)},setFunc:function(ge){if(pe&&(ge=Zb[ge]),Q!==ge){switch(ge){case Ho:s.depthFunc(s.NEVER);break;case Vo:s.depthFunc(s.ALWAYS);break;case Wo:s.depthFunc(s.LESS);break;case bs:s.depthFunc(s.LEQUAL);break;case jo:s.depthFunc(s.EQUAL);break;case Xo:s.depthFunc(s.GEQUAL);break;case qo:s.depthFunc(s.GREATER);break;case Yo:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Q=ge}},setLocked:function(ge){F=ge},setClear:function(ge){_e!==ge&&(pe&&(ge=1-ge),s.clearDepth(ge),_e=ge)},reset:function(){F=!1,X=null,Q=null,_e=null,pe=!1}}}function i(){let F=!1,pe=null,X=null,Q=null,_e=null,ge=null,je=null,At=null,Gt=null;return{setTest:function(lt){F||(lt?ce(s.STENCIL_TEST):Ue(s.STENCIL_TEST))},setMask:function(lt){pe!==lt&&!F&&(s.stencilMask(lt),pe=lt)},setFunc:function(lt,yn,Gn){(X!==lt||Q!==yn||_e!==Gn)&&(s.stencilFunc(lt,yn,Gn),X=lt,Q=yn,_e=Gn)},setOp:function(lt,yn,Gn){(ge!==lt||je!==yn||At!==Gn)&&(s.stencilOp(lt,yn,Gn),ge=lt,je=yn,At=Gn)},setLocked:function(lt){F=lt},setClear:function(lt){Gt!==lt&&(s.clearStencil(lt),Gt=lt)},reset:function(){F=!1,pe=null,X=null,Q=null,_e=null,ge=null,je=null,At=null,Gt=null}}}const r=new t,a=new n,o=new i,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],b=null,v=!1,p=null,m=null,g=null,_=null,x=null,E=null,w=null,A=new ue(0,0,0),S=0,y=!1,M=null,C=null,D=null,U=null,N=null;const G=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,Y=0;const H=s.getParameter(s.VERSION);H.indexOf("WebGL")!==-1?(Y=parseFloat(/^WebGL (\d)/.exec(H)[1]),O=Y>=1):H.indexOf("OpenGL ES")!==-1&&(Y=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),O=Y>=2);let te=null,oe={};const me=s.getParameter(s.SCISSOR_BOX),De=s.getParameter(s.VIEWPORT),Ye=new rt().fromArray(me),K=new rt().fromArray(De);function re(F,pe,X,Q){const _e=new Uint8Array(4),ge=s.createTexture();s.bindTexture(F,ge),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let je=0;je<X;je++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(pe,0,s.RGBA,1,1,Q,0,s.RGBA,s.UNSIGNED_BYTE,_e):s.texImage2D(pe+je,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,_e);return ge}const Te={};Te[s.TEXTURE_2D]=re(s.TEXTURE_2D,s.TEXTURE_2D,1),Te[s.TEXTURE_CUBE_MAP]=re(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Te[s.TEXTURE_2D_ARRAY]=re(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Te[s.TEXTURE_3D]=re(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ce(s.DEPTH_TEST),a.setFunc(bs),ne(!1),ye(El),ce(s.CULL_FACE),I(ni);function ce(F){h[F]!==!0&&(s.enable(F),h[F]=!0)}function Ue(F){h[F]!==!1&&(s.disable(F),h[F]=!1)}function He(F,pe){return u[F]!==pe?(s.bindFramebuffer(F,pe),u[F]=pe,F===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=pe),F===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=pe),!0):!1}function Be(F,pe){let X=f,Q=!1;if(F){X=d.get(pe),X===void 0&&(X=[],d.set(pe,X));const _e=F.textures;if(X.length!==_e.length||X[0]!==s.COLOR_ATTACHMENT0){for(let ge=0,je=_e.length;ge<je;ge++)X[ge]=s.COLOR_ATTACHMENT0+ge;X.length=_e.length,Q=!0}}else X[0]!==s.BACK&&(X[0]=s.BACK,Q=!0);Q&&s.drawBuffers(X)}function nt(F){return b!==F?(s.useProgram(F),b=F,!0):!1}const $={[Ii]:s.FUNC_ADD,[ef]:s.FUNC_SUBTRACT,[tf]:s.FUNC_REVERSE_SUBTRACT};$[nf]=s.MIN,$[sf]=s.MAX;const se={[rf]:s.ZERO,[af]:s.ONE,[of]:s.SRC_COLOR,[zo]:s.SRC_ALPHA,[ff]:s.SRC_ALPHA_SATURATE,[uf]:s.DST_COLOR,[lf]:s.DST_ALPHA,[cf]:s.ONE_MINUS_SRC_COLOR,[Go]:s.ONE_MINUS_SRC_ALPHA,[df]:s.ONE_MINUS_DST_COLOR,[hf]:s.ONE_MINUS_DST_ALPHA,[pf]:s.CONSTANT_COLOR,[mf]:s.ONE_MINUS_CONSTANT_COLOR,[gf]:s.CONSTANT_ALPHA,[bf]:s.ONE_MINUS_CONSTANT_ALPHA};function I(F,pe,X,Q,_e,ge,je,At,Gt,lt){if(F===ni){v===!0&&(Ue(s.BLEND),v=!1);return}if(v===!1&&(ce(s.BLEND),v=!0),F!==$d){if(F!==p||lt!==y){if((m!==Ii||x!==Ii)&&(s.blendEquation(s.FUNC_ADD),m=Ii,x=Ii),lt)switch(F){case ds:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case gs:s.blendFunc(s.ONE,s.ONE);break;case Al:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Rl:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case ds:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case gs:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Al:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Rl:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}g=null,_=null,E=null,w=null,A.set(0,0,0),S=0,p=F,y=lt}return}_e=_e||pe,ge=ge||X,je=je||Q,(pe!==m||_e!==x)&&(s.blendEquationSeparate($[pe],$[_e]),m=pe,x=_e),(X!==g||Q!==_||ge!==E||je!==w)&&(s.blendFuncSeparate(se[X],se[Q],se[ge],se[je]),g=X,_=Q,E=ge,w=je),(At.equals(A)===!1||Gt!==S)&&(s.blendColor(At.r,At.g,At.b,Gt),A.copy(At),S=Gt),p=F,y=!1}function Le(F,pe){F.side===Rt?Ue(s.CULL_FACE):ce(s.CULL_FACE);let X=F.side===Zt;pe&&(X=!X),ne(X),F.blending===ds&&F.transparent===!1?I(ni):I(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const Q=F.stencilWrite;o.setTest(Q),Q&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Oe(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ce(s.SAMPLE_ALPHA_TO_COVERAGE):Ue(s.SAMPLE_ALPHA_TO_COVERAGE)}function ne(F){M!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),M=F)}function ye(F){F!==Zd?(ce(s.CULL_FACE),F!==C&&(F===El?s.cullFace(s.BACK):F===Qd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Ue(s.CULL_FACE),C=F}function he(F){F!==D&&(O&&s.lineWidth(F),D=F)}function Oe(F,pe,X){F?(ce(s.POLYGON_OFFSET_FILL),(U!==pe||N!==X)&&(s.polygonOffset(pe,X),U=pe,N=X)):Ue(s.POLYGON_OFFSET_FILL)}function xe(F){F?ce(s.SCISSOR_TEST):Ue(s.SCISSOR_TEST)}function L(F){F===void 0&&(F=s.TEXTURE0+G-1),te!==F&&(s.activeTexture(F),te=F)}function T(F,pe,X){X===void 0&&(te===null?X=s.TEXTURE0+G-1:X=te);let Q=oe[X];Q===void 0&&(Q={type:void 0,texture:void 0},oe[X]=Q),(Q.type!==F||Q.texture!==pe)&&(te!==X&&(s.activeTexture(X),te=X),s.bindTexture(F,pe||Te[F]),Q.type=F,Q.texture=pe)}function z(){const F=oe[te];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function J(){try{s.compressedTexImage2D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ee(){try{s.compressedTexImage3D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Z(){try{s.texSubImage2D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ee(){try{s.texSubImage3D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function fe(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ve(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Qe(){try{s.texStorage2D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ie(){try{s.texStorage3D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Me(){try{s.texImage2D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ke(){try{s.texImage3D.apply(s,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ze(F){Ye.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),Ye.copy(F))}function we(F){K.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),K.copy(F))}function tt(F,pe){let X=l.get(pe);X===void 0&&(X=new WeakMap,l.set(pe,X));let Q=X.get(F);Q===void 0&&(Q=s.getUniformBlockIndex(pe,F.name),X.set(F,Q))}function Ke(F,pe){const Q=l.get(pe).get(F);c.get(pe)!==Q&&(s.uniformBlockBinding(pe,Q,F.__bindingPointIndex),c.set(pe,Q))}function xt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},te=null,oe={},u={},d=new WeakMap,f=[],b=null,v=!1,p=null,m=null,g=null,_=null,x=null,E=null,w=null,A=new ue(0,0,0),S=0,y=!1,M=null,C=null,D=null,U=null,N=null,Ye.set(0,0,s.canvas.width,s.canvas.height),K.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ce,disable:Ue,bindFramebuffer:He,drawBuffers:Be,useProgram:nt,setBlending:I,setMaterial:Le,setFlipSided:ne,setCullFace:ye,setLineWidth:he,setPolygonOffset:Oe,setScissorTest:xe,activeTexture:L,bindTexture:T,unbindTexture:z,compressedTexImage2D:J,compressedTexImage3D:ee,texImage2D:Me,texImage3D:ke,updateUBOMapping:tt,uniformBlockBinding:Ke,texStorage2D:Qe,texStorage3D:ie,texSubImage2D:Z,texSubImage3D:Ee,compressedTexSubImage2D:fe,compressedTexSubImage3D:ve,scissor:ze,viewport:we,reset:xt}}function Th(s,e,t,n){const i=$b(n);switch(t){case qu:return s*e;case Ku:return s*e;case Ju:return s*e*2;case Hc:return s*e/i.components*i.byteLength;case Vc:return s*e/i.components*i.byteLength;case Zu:return s*e*2/i.components*i.byteLength;case Wc:return s*e*2/i.components*i.byteLength;case Yu:return s*e*3/i.components*i.byteLength;case bn:return s*e*4/i.components*i.byteLength;case jc:return s*e*4/i.components*i.byteLength;case pa:case ma:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ga:case ba:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Qo:case ec:return Math.max(s,16)*Math.max(e,8)/4;case Zo:case $o:return Math.max(s,8)*Math.max(e,8)/2;case tc:case nc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ic:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case sc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case rc:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case ac:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case oc:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case cc:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case lc:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case hc:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case uc:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case dc:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case fc:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case pc:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case mc:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case gc:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case bc:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case _a:case _c:case xc:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Qu:case vc:return Math.ceil(s/4)*Math.ceil(e/4)*8;case yc:case Mc:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function $b(s){switch(s){case ri:case Wu:return{byteLength:1,components:1};case hr:case ju:case nn:return{byteLength:2,components:1};case zc:case Gc:return{byteLength:2,components:4};case Ni:case Bc:case tn:return{byteLength:4,components:1};case Xu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function e_(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new q,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(L,T){return f?new OffscreenCanvas(L,T):fr("canvas")}function v(L,T,z){let J=1;const ee=xe(L);if((ee.width>z||ee.height>z)&&(J=z/Math.max(ee.width,ee.height)),J<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const Z=Math.floor(J*ee.width),Ee=Math.floor(J*ee.height);u===void 0&&(u=b(Z,Ee));const fe=T?b(Z,Ee):u;return fe.width=Z,fe.height=Ee,fe.getContext("2d").drawImage(L,0,0,Z,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+Z+"x"+Ee+")."),fe}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),L;return L}function p(L){return L.generateMipmaps}function m(L){s.generateMipmap(L)}function g(L){return L.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?s.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function _(L,T,z,J,ee=!1){if(L!==null){if(s[L]!==void 0)return s[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let Z=T;if(T===s.RED&&(z===s.FLOAT&&(Z=s.R32F),z===s.HALF_FLOAT&&(Z=s.R16F),z===s.UNSIGNED_BYTE&&(Z=s.R8)),T===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(Z=s.R8UI),z===s.UNSIGNED_SHORT&&(Z=s.R16UI),z===s.UNSIGNED_INT&&(Z=s.R32UI),z===s.BYTE&&(Z=s.R8I),z===s.SHORT&&(Z=s.R16I),z===s.INT&&(Z=s.R32I)),T===s.RG&&(z===s.FLOAT&&(Z=s.RG32F),z===s.HALF_FLOAT&&(Z=s.RG16F),z===s.UNSIGNED_BYTE&&(Z=s.RG8)),T===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(Z=s.RG8UI),z===s.UNSIGNED_SHORT&&(Z=s.RG16UI),z===s.UNSIGNED_INT&&(Z=s.RG32UI),z===s.BYTE&&(Z=s.RG8I),z===s.SHORT&&(Z=s.RG16I),z===s.INT&&(Z=s.RG32I)),T===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(Z=s.RGB8UI),z===s.UNSIGNED_SHORT&&(Z=s.RGB16UI),z===s.UNSIGNED_INT&&(Z=s.RGB32UI),z===s.BYTE&&(Z=s.RGB8I),z===s.SHORT&&(Z=s.RGB16I),z===s.INT&&(Z=s.RGB32I)),T===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(Z=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(Z=s.RGBA16UI),z===s.UNSIGNED_INT&&(Z=s.RGBA32UI),z===s.BYTE&&(Z=s.RGBA8I),z===s.SHORT&&(Z=s.RGBA16I),z===s.INT&&(Z=s.RGBA32I)),T===s.RGB&&z===s.UNSIGNED_INT_5_9_9_9_REV&&(Z=s.RGB9_E5),T===s.RGBA){const Ee=ee?La:$e.getTransfer(J);z===s.FLOAT&&(Z=s.RGBA32F),z===s.HALF_FLOAT&&(Z=s.RGBA16F),z===s.UNSIGNED_BYTE&&(Z=Ee===ht?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT_4_4_4_4&&(Z=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(Z=s.RGB5_A1)}return(Z===s.R16F||Z===s.R32F||Z===s.RG16F||Z===s.RG32F||Z===s.RGBA16F||Z===s.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function x(L,T){let z;return L?T===null||T===Ni||T===vs?z=s.DEPTH24_STENCIL8:T===tn?z=s.DEPTH32F_STENCIL8:T===hr&&(z=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Ni||T===vs?z=s.DEPTH_COMPONENT24:T===tn?z=s.DEPTH_COMPONENT32F:T===hr&&(z=s.DEPTH_COMPONENT16),z}function E(L,T){return p(L)===!0||L.isFramebufferTexture&&L.minFilter!==Qt&&L.minFilter!==kt?Math.log2(Math.max(T.width,T.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?T.mipmaps.length:1}function w(L){const T=L.target;T.removeEventListener("dispose",w),S(T),T.isVideoTexture&&h.delete(T)}function A(L){const T=L.target;T.removeEventListener("dispose",A),M(T)}function S(L){const T=n.get(L);if(T.__webglInit===void 0)return;const z=L.source,J=d.get(z);if(J){const ee=J[T.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&y(L),Object.keys(J).length===0&&d.delete(z)}n.remove(L)}function y(L){const T=n.get(L);s.deleteTexture(T.__webglTexture);const z=L.source,J=d.get(z);delete J[T.__cacheKey],a.memory.textures--}function M(L){const T=n.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),n.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(T.__webglFramebuffer[J]))for(let ee=0;ee<T.__webglFramebuffer[J].length;ee++)s.deleteFramebuffer(T.__webglFramebuffer[J][ee]);else s.deleteFramebuffer(T.__webglFramebuffer[J]);T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer[J])}else{if(Array.isArray(T.__webglFramebuffer))for(let J=0;J<T.__webglFramebuffer.length;J++)s.deleteFramebuffer(T.__webglFramebuffer[J]);else s.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&s.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let J=0;J<T.__webglColorRenderbuffer.length;J++)T.__webglColorRenderbuffer[J]&&s.deleteRenderbuffer(T.__webglColorRenderbuffer[J]);T.__webglDepthRenderbuffer&&s.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const z=L.textures;for(let J=0,ee=z.length;J<ee;J++){const Z=n.get(z[J]);Z.__webglTexture&&(s.deleteTexture(Z.__webglTexture),a.memory.textures--),n.remove(z[J])}n.remove(L)}let C=0;function D(){C=0}function U(){const L=C;return L>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+i.maxTextures),C+=1,L}function N(L){const T=[];return T.push(L.wrapS),T.push(L.wrapT),T.push(L.wrapR||0),T.push(L.magFilter),T.push(L.minFilter),T.push(L.anisotropy),T.push(L.internalFormat),T.push(L.format),T.push(L.type),T.push(L.generateMipmaps),T.push(L.premultiplyAlpha),T.push(L.flipY),T.push(L.unpackAlignment),T.push(L.colorSpace),T.join()}function G(L,T){const z=n.get(L);if(L.isVideoTexture&&he(L),L.isRenderTargetTexture===!1&&L.version>0&&z.__version!==L.version){const J=L.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(z,L,T);return}}t.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+T)}function O(L,T){const z=n.get(L);if(L.version>0&&z.__version!==L.version){K(z,L,T);return}t.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+T)}function Y(L,T){const z=n.get(L);if(L.version>0&&z.__version!==L.version){K(z,L,T);return}t.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+T)}function H(L,T){const z=n.get(L);if(L.version>0&&z.__version!==L.version){re(z,L,T);return}t.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+T)}const te={[vn]:s.REPEAT,[Dn]:s.CLAMP_TO_EDGE,[Ma]:s.MIRRORED_REPEAT},oe={[Qt]:s.NEAREST,[Vu]:s.NEAREST_MIPMAP_NEAREST,[$s]:s.NEAREST_MIPMAP_LINEAR,[kt]:s.LINEAR,[fa]:s.LINEAR_MIPMAP_NEAREST,[An]:s.LINEAR_MIPMAP_LINEAR},me={[Af]:s.NEVER,[Df]:s.ALWAYS,[Rf]:s.LESS,[ed]:s.LEQUAL,[Cf]:s.EQUAL,[If]:s.GEQUAL,[Pf]:s.GREATER,[Lf]:s.NOTEQUAL};function De(L,T){if(T.type===tn&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===kt||T.magFilter===fa||T.magFilter===$s||T.magFilter===An||T.minFilter===kt||T.minFilter===fa||T.minFilter===$s||T.minFilter===An)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(L,s.TEXTURE_WRAP_S,te[T.wrapS]),s.texParameteri(L,s.TEXTURE_WRAP_T,te[T.wrapT]),(L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY)&&s.texParameteri(L,s.TEXTURE_WRAP_R,te[T.wrapR]),s.texParameteri(L,s.TEXTURE_MAG_FILTER,oe[T.magFilter]),s.texParameteri(L,s.TEXTURE_MIN_FILTER,oe[T.minFilter]),T.compareFunction&&(s.texParameteri(L,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(L,s.TEXTURE_COMPARE_FUNC,me[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Qt||T.minFilter!==$s&&T.minFilter!==An||T.type===tn&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");s.texParameterf(L,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,i.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function Ye(L,T){let z=!1;L.__webglInit===void 0&&(L.__webglInit=!0,T.addEventListener("dispose",w));const J=T.source;let ee=d.get(J);ee===void 0&&(ee={},d.set(J,ee));const Z=N(T);if(Z!==L.__cacheKey){ee[Z]===void 0&&(ee[Z]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,z=!0),ee[Z].usedTimes++;const Ee=ee[L.__cacheKey];Ee!==void 0&&(ee[L.__cacheKey].usedTimes--,Ee.usedTimes===0&&y(T)),L.__cacheKey=Z,L.__webglTexture=ee[Z].texture}return z}function K(L,T,z){let J=s.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(J=s.TEXTURE_2D_ARRAY),T.isData3DTexture&&(J=s.TEXTURE_3D);const ee=Ye(L,T),Z=T.source;t.bindTexture(J,L.__webglTexture,s.TEXTURE0+z);const Ee=n.get(Z);if(Z.version!==Ee.__version||ee===!0){t.activeTexture(s.TEXTURE0+z);const fe=$e.getPrimaries($e.workingColorSpace),ve=T.colorSpace===$n?null:$e.getPrimaries(T.colorSpace),Qe=T.colorSpace===$n||fe===ve?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Qe);let ie=v(T.image,!1,i.maxTextureSize);ie=Oe(T,ie);const Me=r.convert(T.format,T.colorSpace),ke=r.convert(T.type);let ze=_(T.internalFormat,Me,ke,T.colorSpace,T.isVideoTexture);De(J,T);let we;const tt=T.mipmaps,Ke=T.isVideoTexture!==!0,xt=Ee.__version===void 0||ee===!0,F=Z.dataReady,pe=E(T,ie);if(T.isDepthTexture)ze=x(T.format===ys,T.type),xt&&(Ke?t.texStorage2D(s.TEXTURE_2D,1,ze,ie.width,ie.height):t.texImage2D(s.TEXTURE_2D,0,ze,ie.width,ie.height,0,Me,ke,null));else if(T.isDataTexture)if(tt.length>0){Ke&&xt&&t.texStorage2D(s.TEXTURE_2D,pe,ze,tt[0].width,tt[0].height);for(let X=0,Q=tt.length;X<Q;X++)we=tt[X],Ke?F&&t.texSubImage2D(s.TEXTURE_2D,X,0,0,we.width,we.height,Me,ke,we.data):t.texImage2D(s.TEXTURE_2D,X,ze,we.width,we.height,0,Me,ke,we.data);T.generateMipmaps=!1}else Ke?(xt&&t.texStorage2D(s.TEXTURE_2D,pe,ze,ie.width,ie.height),F&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ie.width,ie.height,Me,ke,ie.data)):t.texImage2D(s.TEXTURE_2D,0,ze,ie.width,ie.height,0,Me,ke,ie.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Ke&&xt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,pe,ze,tt[0].width,tt[0].height,ie.depth);for(let X=0,Q=tt.length;X<Q;X++)if(we=tt[X],T.format!==bn)if(Me!==null)if(Ke){if(F)if(T.layerUpdates.size>0){const _e=Th(we.width,we.height,T.format,T.type);for(const ge of T.layerUpdates){const je=we.data.subarray(ge*_e/we.data.BYTES_PER_ELEMENT,(ge+1)*_e/we.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,X,0,0,ge,we.width,we.height,1,Me,je)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,X,0,0,0,we.width,we.height,ie.depth,Me,we.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,X,ze,we.width,we.height,ie.depth,0,we.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ke?F&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,X,0,0,0,we.width,we.height,ie.depth,Me,ke,we.data):t.texImage3D(s.TEXTURE_2D_ARRAY,X,ze,we.width,we.height,ie.depth,0,Me,ke,we.data)}else{Ke&&xt&&t.texStorage2D(s.TEXTURE_2D,pe,ze,tt[0].width,tt[0].height);for(let X=0,Q=tt.length;X<Q;X++)we=tt[X],T.format!==bn?Me!==null?Ke?F&&t.compressedTexSubImage2D(s.TEXTURE_2D,X,0,0,we.width,we.height,Me,we.data):t.compressedTexImage2D(s.TEXTURE_2D,X,ze,we.width,we.height,0,we.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ke?F&&t.texSubImage2D(s.TEXTURE_2D,X,0,0,we.width,we.height,Me,ke,we.data):t.texImage2D(s.TEXTURE_2D,X,ze,we.width,we.height,0,Me,ke,we.data)}else if(T.isDataArrayTexture)if(Ke){if(xt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,pe,ze,ie.width,ie.height,ie.depth),F)if(T.layerUpdates.size>0){const X=Th(ie.width,ie.height,T.format,T.type);for(const Q of T.layerUpdates){const _e=ie.data.subarray(Q*X/ie.data.BYTES_PER_ELEMENT,(Q+1)*X/ie.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Q,ie.width,ie.height,1,Me,ke,_e)}T.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ie.width,ie.height,ie.depth,Me,ke,ie.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,ze,ie.width,ie.height,ie.depth,0,Me,ke,ie.data);else if(T.isData3DTexture)Ke?(xt&&t.texStorage3D(s.TEXTURE_3D,pe,ze,ie.width,ie.height,ie.depth),F&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ie.width,ie.height,ie.depth,Me,ke,ie.data)):t.texImage3D(s.TEXTURE_3D,0,ze,ie.width,ie.height,ie.depth,0,Me,ke,ie.data);else if(T.isFramebufferTexture){if(xt)if(Ke)t.texStorage2D(s.TEXTURE_2D,pe,ze,ie.width,ie.height);else{let X=ie.width,Q=ie.height;for(let _e=0;_e<pe;_e++)t.texImage2D(s.TEXTURE_2D,_e,ze,X,Q,0,Me,ke,null),X>>=1,Q>>=1}}else if(tt.length>0){if(Ke&&xt){const X=xe(tt[0]);t.texStorage2D(s.TEXTURE_2D,pe,ze,X.width,X.height)}for(let X=0,Q=tt.length;X<Q;X++)we=tt[X],Ke?F&&t.texSubImage2D(s.TEXTURE_2D,X,0,0,Me,ke,we):t.texImage2D(s.TEXTURE_2D,X,ze,Me,ke,we);T.generateMipmaps=!1}else if(Ke){if(xt){const X=xe(ie);t.texStorage2D(s.TEXTURE_2D,pe,ze,X.width,X.height)}F&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Me,ke,ie)}else t.texImage2D(s.TEXTURE_2D,0,ze,Me,ke,ie);p(T)&&m(J),Ee.__version=Z.version,T.onUpdate&&T.onUpdate(T)}L.__version=T.version}function re(L,T,z){if(T.image.length!==6)return;const J=Ye(L,T),ee=T.source;t.bindTexture(s.TEXTURE_CUBE_MAP,L.__webglTexture,s.TEXTURE0+z);const Z=n.get(ee);if(ee.version!==Z.__version||J===!0){t.activeTexture(s.TEXTURE0+z);const Ee=$e.getPrimaries($e.workingColorSpace),fe=T.colorSpace===$n?null:$e.getPrimaries(T.colorSpace),ve=T.colorSpace===$n||Ee===fe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);const Qe=T.isCompressedTexture||T.image[0].isCompressedTexture,ie=T.image[0]&&T.image[0].isDataTexture,Me=[];for(let Q=0;Q<6;Q++)!Qe&&!ie?Me[Q]=v(T.image[Q],!0,i.maxCubemapSize):Me[Q]=ie?T.image[Q].image:T.image[Q],Me[Q]=Oe(T,Me[Q]);const ke=Me[0],ze=r.convert(T.format,T.colorSpace),we=r.convert(T.type),tt=_(T.internalFormat,ze,we,T.colorSpace),Ke=T.isVideoTexture!==!0,xt=Z.__version===void 0||J===!0,F=ee.dataReady;let pe=E(T,ke);De(s.TEXTURE_CUBE_MAP,T);let X;if(Qe){Ke&&xt&&t.texStorage2D(s.TEXTURE_CUBE_MAP,pe,tt,ke.width,ke.height);for(let Q=0;Q<6;Q++){X=Me[Q].mipmaps;for(let _e=0;_e<X.length;_e++){const ge=X[_e];T.format!==bn?ze!==null?Ke?F&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_e,0,0,ge.width,ge.height,ze,ge.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_e,tt,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ke?F&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_e,0,0,ge.width,ge.height,ze,we,ge.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_e,tt,ge.width,ge.height,0,ze,we,ge.data)}}}else{if(X=T.mipmaps,Ke&&xt){X.length>0&&pe++;const Q=xe(Me[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,pe,tt,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(ie){Ke?F&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Me[Q].width,Me[Q].height,ze,we,Me[Q].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,tt,Me[Q].width,Me[Q].height,0,ze,we,Me[Q].data);for(let _e=0;_e<X.length;_e++){const je=X[_e].image[Q].image;Ke?F&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_e+1,0,0,je.width,je.height,ze,we,je.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_e+1,tt,je.width,je.height,0,ze,we,je.data)}}else{Ke?F&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,ze,we,Me[Q]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,tt,ze,we,Me[Q]);for(let _e=0;_e<X.length;_e++){const ge=X[_e];Ke?F&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_e+1,0,0,ze,we,ge.image[Q]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Q,_e+1,tt,ze,we,ge.image[Q])}}}p(T)&&m(s.TEXTURE_CUBE_MAP),Z.__version=ee.version,T.onUpdate&&T.onUpdate(T)}L.__version=T.version}function Te(L,T,z,J,ee,Z){const Ee=r.convert(z.format,z.colorSpace),fe=r.convert(z.type),ve=_(z.internalFormat,Ee,fe,z.colorSpace),Qe=n.get(T),ie=n.get(z);if(ie.__renderTarget=T,!Qe.__hasExternalTextures){const Me=Math.max(1,T.width>>Z),ke=Math.max(1,T.height>>Z);ee===s.TEXTURE_3D||ee===s.TEXTURE_2D_ARRAY?t.texImage3D(ee,Z,ve,Me,ke,T.depth,0,Ee,fe,null):t.texImage2D(ee,Z,ve,Me,ke,0,Ee,fe,null)}t.bindFramebuffer(s.FRAMEBUFFER,L),ye(T)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,J,ee,ie.__webglTexture,0,ne(T)):(ee===s.TEXTURE_2D||ee>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,J,ee,ie.__webglTexture,Z),t.bindFramebuffer(s.FRAMEBUFFER,null)}function ce(L,T,z){if(s.bindRenderbuffer(s.RENDERBUFFER,L),T.depthBuffer){const J=T.depthTexture,ee=J&&J.isDepthTexture?J.type:null,Z=x(T.stencilBuffer,ee),Ee=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,fe=ne(T);ye(T)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,fe,Z,T.width,T.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,fe,Z,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,Z,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ee,s.RENDERBUFFER,L)}else{const J=T.textures;for(let ee=0;ee<J.length;ee++){const Z=J[ee],Ee=r.convert(Z.format,Z.colorSpace),fe=r.convert(Z.type),ve=_(Z.internalFormat,Ee,fe,Z.colorSpace),Qe=ne(T);z&&ye(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Qe,ve,T.width,T.height):ye(T)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Qe,ve,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,ve,T.width,T.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ue(L,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,L),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const J=n.get(T.depthTexture);J.__renderTarget=T,(!J.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),G(T.depthTexture,0);const ee=J.__webglTexture,Z=ne(T);if(T.depthTexture.format===fs)ye(T)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ee,0,Z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ee,0);else if(T.depthTexture.format===ys)ye(T)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ee,0,Z):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function He(L){const T=n.get(L),z=L.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==L.depthTexture){const J=L.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),J){const ee=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,J.removeEventListener("dispose",ee)};J.addEventListener("dispose",ee),T.__depthDisposeCallback=ee}T.__boundDepthTexture=J}if(L.depthTexture&&!T.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Ue(T.__webglFramebuffer,L)}else if(z){T.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer[J]),T.__webglDepthbuffer[J]===void 0)T.__webglDepthbuffer[J]=s.createRenderbuffer(),ce(T.__webglDepthbuffer[J],L,!1);else{const ee=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Z=T.__webglDepthbuffer[J];s.bindRenderbuffer(s.RENDERBUFFER,Z),s.framebufferRenderbuffer(s.FRAMEBUFFER,ee,s.RENDERBUFFER,Z)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=s.createRenderbuffer(),ce(T.__webglDepthbuffer,L,!1);else{const J=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ee=T.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ee),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,ee)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Be(L,T,z){const J=n.get(L);T!==void 0&&Te(J.__webglFramebuffer,L,L.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&He(L)}function nt(L){const T=L.texture,z=n.get(L),J=n.get(T);L.addEventListener("dispose",A);const ee=L.textures,Z=L.isWebGLCubeRenderTarget===!0,Ee=ee.length>1;if(Ee||(J.__webglTexture===void 0&&(J.__webglTexture=s.createTexture()),J.__version=T.version,a.memory.textures++),Z){z.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(T.mipmaps&&T.mipmaps.length>0){z.__webglFramebuffer[fe]=[];for(let ve=0;ve<T.mipmaps.length;ve++)z.__webglFramebuffer[fe][ve]=s.createFramebuffer()}else z.__webglFramebuffer[fe]=s.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){z.__webglFramebuffer=[];for(let fe=0;fe<T.mipmaps.length;fe++)z.__webglFramebuffer[fe]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(Ee)for(let fe=0,ve=ee.length;fe<ve;fe++){const Qe=n.get(ee[fe]);Qe.__webglTexture===void 0&&(Qe.__webglTexture=s.createTexture(),a.memory.textures++)}if(L.samples>0&&ye(L)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let fe=0;fe<ee.length;fe++){const ve=ee[fe];z.__webglColorRenderbuffer[fe]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[fe]);const Qe=r.convert(ve.format,ve.colorSpace),ie=r.convert(ve.type),Me=_(ve.internalFormat,Qe,ie,ve.colorSpace,L.isXRRenderTarget===!0),ke=ne(L);s.renderbufferStorageMultisample(s.RENDERBUFFER,ke,Me,L.width,L.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+fe,s.RENDERBUFFER,z.__webglColorRenderbuffer[fe])}s.bindRenderbuffer(s.RENDERBUFFER,null),L.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),ce(z.__webglDepthRenderbuffer,L,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Z){t.bindTexture(s.TEXTURE_CUBE_MAP,J.__webglTexture),De(s.TEXTURE_CUBE_MAP,T);for(let fe=0;fe<6;fe++)if(T.mipmaps&&T.mipmaps.length>0)for(let ve=0;ve<T.mipmaps.length;ve++)Te(z.__webglFramebuffer[fe][ve],L,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+fe,ve);else Te(z.__webglFramebuffer[fe],L,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);p(T)&&m(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ee){for(let fe=0,ve=ee.length;fe<ve;fe++){const Qe=ee[fe],ie=n.get(Qe);t.bindTexture(s.TEXTURE_2D,ie.__webglTexture),De(s.TEXTURE_2D,Qe),Te(z.__webglFramebuffer,L,Qe,s.COLOR_ATTACHMENT0+fe,s.TEXTURE_2D,0),p(Qe)&&m(s.TEXTURE_2D)}t.unbindTexture()}else{let fe=s.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(fe=L.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(fe,J.__webglTexture),De(fe,T),T.mipmaps&&T.mipmaps.length>0)for(let ve=0;ve<T.mipmaps.length;ve++)Te(z.__webglFramebuffer[ve],L,T,s.COLOR_ATTACHMENT0,fe,ve);else Te(z.__webglFramebuffer,L,T,s.COLOR_ATTACHMENT0,fe,0);p(T)&&m(fe),t.unbindTexture()}L.depthBuffer&&He(L)}function $(L){const T=L.textures;for(let z=0,J=T.length;z<J;z++){const ee=T[z];if(p(ee)){const Z=g(L),Ee=n.get(ee).__webglTexture;t.bindTexture(Z,Ee),m(Z),t.unbindTexture()}}}const se=[],I=[];function Le(L){if(L.samples>0){if(ye(L)===!1){const T=L.textures,z=L.width,J=L.height;let ee=s.COLOR_BUFFER_BIT;const Z=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ee=n.get(L),fe=T.length>1;if(fe)for(let ve=0;ve<T.length;ve++)t.bindFramebuffer(s.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ee.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let ve=0;ve<T.length;ve++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(ee|=s.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(ee|=s.STENCIL_BUFFER_BIT)),fe){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ee.__webglColorRenderbuffer[ve]);const Qe=n.get(T[ve]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Qe,0)}s.blitFramebuffer(0,0,z,J,0,0,z,J,ee,s.NEAREST),c===!0&&(se.length=0,I.length=0,se.push(s.COLOR_ATTACHMENT0+ve),L.depthBuffer&&L.resolveDepthBuffer===!1&&(se.push(Z),I.push(Z),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,I)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,se))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),fe)for(let ve=0;ve<T.length;ve++){t.bindFramebuffer(s.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.RENDERBUFFER,Ee.__webglColorRenderbuffer[ve]);const Qe=n.get(T[ve]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ee.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ve,s.TEXTURE_2D,Qe,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){const T=L.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[T])}}}function ne(L){return Math.min(i.maxSamples,L.samples)}function ye(L){const T=n.get(L);return L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function he(L){const T=a.render.frame;h.get(L)!==T&&(h.set(L,T),L.update())}function Oe(L,T){const z=L.colorSpace,J=L.format,ee=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||z!==jt&&z!==$n&&($e.getTransfer(z)===ht?(J!==bn||ee!==ri)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),T}function xe(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(l.width=L.naturalWidth||L.width,l.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(l.width=L.displayWidth,l.height=L.displayHeight):(l.width=L.width,l.height=L.height),l}this.allocateTextureUnit=U,this.resetTextureUnits=D,this.setTexture2D=G,this.setTexture2DArray=O,this.setTexture3D=Y,this.setTextureCube=H,this.rebindTextures=Be,this.setupRenderTarget=nt,this.updateRenderTargetMipmap=$,this.updateMultisampleRenderTarget=Le,this.setupDepthRenderbuffer=He,this.setupFrameBufferTexture=Te,this.useMultisampledRTT=ye}function t_(s,e){function t(n,i=$n){let r;const a=$e.getTransfer(i);if(n===ri)return s.UNSIGNED_BYTE;if(n===zc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Gc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Xu)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Wu)return s.BYTE;if(n===ju)return s.SHORT;if(n===hr)return s.UNSIGNED_SHORT;if(n===Bc)return s.INT;if(n===Ni)return s.UNSIGNED_INT;if(n===tn)return s.FLOAT;if(n===nn)return s.HALF_FLOAT;if(n===qu)return s.ALPHA;if(n===Yu)return s.RGB;if(n===bn)return s.RGBA;if(n===Ku)return s.LUMINANCE;if(n===Ju)return s.LUMINANCE_ALPHA;if(n===fs)return s.DEPTH_COMPONENT;if(n===ys)return s.DEPTH_STENCIL;if(n===Hc)return s.RED;if(n===Vc)return s.RED_INTEGER;if(n===Zu)return s.RG;if(n===Wc)return s.RG_INTEGER;if(n===jc)return s.RGBA_INTEGER;if(n===pa||n===ma||n===ga||n===ba)if(a===ht)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===pa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ma)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ga)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ba)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===pa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ma)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ga)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ba)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Zo||n===Qo||n===$o||n===ec)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Zo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Qo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===$o)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ec)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===tc||n===nc||n===ic)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===tc||n===nc)return a===ht?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ic)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===sc||n===rc||n===ac||n===oc||n===cc||n===lc||n===hc||n===uc||n===dc||n===fc||n===pc||n===mc||n===gc||n===bc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===sc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===rc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ac)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===oc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===cc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===lc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===hc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===uc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===dc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===fc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===pc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===mc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===gc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===bc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===_a||n===_c||n===xc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===_a)return a===ht?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===_c)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===xc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Qu||n===vc||n===yc||n===Mc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===_a)return r.COMPRESSED_RED_RGTC1_EXT;if(n===vc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===yc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Mc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===vs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}class n_ extends Kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ae extends _t{constructor(){super(),this.isGroup=!0,this.type="Group"}}const i_={type:"move"};class xo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ae,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ae,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ae,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,n),m=this._getHandJoint(l,v);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,b=.005;l.inputState.pinching&&d>f+b?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-b&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(i_)))}return o!==null&&(o.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ae;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const s_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,r_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class a_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new Dt,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Jt({vertexShader:s_,fragmentShader:r_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new j(new Yt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class o_ extends Ls{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,b=null;const v=new a_,p=t.getContextAttributes();let m=null,g=null;const _=[],x=[],E=new q;let w=null;const A=new Kt;A.viewport=new rt;const S=new Kt;S.viewport=new rt;const y=[A,S],M=new n_;let C=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let re=_[K];return re===void 0&&(re=new xo,_[K]=re),re.getTargetRaySpace()},this.getControllerGrip=function(K){let re=_[K];return re===void 0&&(re=new xo,_[K]=re),re.getGripSpace()},this.getHand=function(K){let re=_[K];return re===void 0&&(re=new xo,_[K]=re),re.getHandSpace()};function U(K){const re=x.indexOf(K.inputSource);if(re===-1)return;const Te=_[re];Te!==void 0&&(Te.update(K.inputSource,K.frame,l||a),Te.dispatchEvent({type:K.type,data:K.inputSource}))}function N(){i.removeEventListener("select",U),i.removeEventListener("selectstart",U),i.removeEventListener("selectend",U),i.removeEventListener("squeeze",U),i.removeEventListener("squeezestart",U),i.removeEventListener("squeezeend",U),i.removeEventListener("end",N),i.removeEventListener("inputsourceschange",G);for(let K=0;K<_.length;K++){const re=x[K];re!==null&&(x[K]=null,_[K].disconnect(re))}C=null,D=null,v.reset(),e.setRenderTarget(m),f=null,d=null,u=null,i=null,g=null,Ye.stop(),n.isPresenting=!1,e.setPixelRatio(w),e.setSize(E.width,E.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(K){l=K},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return b},this.getSession=function(){return i},this.setSession=async function(K){if(i=K,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",U),i.addEventListener("selectstart",U),i.addEventListener("selectend",U),i.addEventListener("squeeze",U),i.addEventListener("squeezestart",U),i.addEventListener("squeezeend",U),i.addEventListener("end",N),i.addEventListener("inputsourceschange",G),p.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(E),i.renderState.layers===void 0){const re={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,re),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),g=new xn(f.framebufferWidth,f.framebufferHeight,{format:bn,type:ri,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let re=null,Te=null,ce=null;p.depth&&(ce=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=p.stencil?ys:fs,Te=p.stencil?vs:Ni);const Ue={colorFormat:t.RGBA8,depthFormat:ce,scaleFactor:r};u=new XRWebGLBinding(i,t),d=u.createProjectionLayer(Ue),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),g=new xn(d.textureWidth,d.textureHeight,{format:bn,type:ri,depthTexture:new ud(d.textureWidth,d.textureHeight,Te,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(o),Ye.setContext(i),Ye.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function G(K){for(let re=0;re<K.removed.length;re++){const Te=K.removed[re],ce=x.indexOf(Te);ce>=0&&(x[ce]=null,_[ce].disconnect(Te))}for(let re=0;re<K.added.length;re++){const Te=K.added[re];let ce=x.indexOf(Te);if(ce===-1){for(let He=0;He<_.length;He++)if(He>=x.length){x.push(Te),ce=He;break}else if(x[He]===null){x[He]=Te,ce=He;break}if(ce===-1)break}const Ue=_[ce];Ue&&Ue.connect(Te)}}const O=new P,Y=new P;function H(K,re,Te){O.setFromMatrixPosition(re.matrixWorld),Y.setFromMatrixPosition(Te.matrixWorld);const ce=O.distanceTo(Y),Ue=re.projectionMatrix.elements,He=Te.projectionMatrix.elements,Be=Ue[14]/(Ue[10]-1),nt=Ue[14]/(Ue[10]+1),$=(Ue[9]+1)/Ue[5],se=(Ue[9]-1)/Ue[5],I=(Ue[8]-1)/Ue[0],Le=(He[8]+1)/He[0],ne=Be*I,ye=Be*Le,he=ce/(-I+Le),Oe=he*-I;if(re.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Oe),K.translateZ(he),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Ue[10]===-1)K.projectionMatrix.copy(re.projectionMatrix),K.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const xe=Be+he,L=nt+he,T=ne-Oe,z=ye+(ce-Oe),J=$*nt/L*xe,ee=se*nt/L*xe;K.projectionMatrix.makePerspective(T,z,J,ee,xe,L),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function te(K,re){re===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(re.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(i===null)return;let re=K.near,Te=K.far;v.texture!==null&&(v.depthNear>0&&(re=v.depthNear),v.depthFar>0&&(Te=v.depthFar)),M.near=S.near=A.near=re,M.far=S.far=A.far=Te,(C!==M.near||D!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),C=M.near,D=M.far),A.layers.mask=K.layers.mask|2,S.layers.mask=K.layers.mask|4,M.layers.mask=A.layers.mask|S.layers.mask;const ce=K.parent,Ue=M.cameras;te(M,ce);for(let He=0;He<Ue.length;He++)te(Ue[He],ce);Ue.length===2?H(M,A,S):M.projectionMatrix.copy(A.projectionMatrix),oe(K,M,ce)};function oe(K,re,Te){Te===null?K.matrix.copy(re.matrixWorld):(K.matrix.copy(Te.matrixWorld),K.matrix.invert(),K.matrix.multiply(re.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(re.projectionMatrix),K.projectionMatrixInverse.copy(re.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Ms*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(K){c=K,d!==null&&(d.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let me=null;function De(K,re){if(h=re.getViewerPose(l||a),b=re,h!==null){const Te=h.views;f!==null&&(e.setRenderTargetFramebuffer(g,f.framebuffer),e.setRenderTarget(g));let ce=!1;Te.length!==M.cameras.length&&(M.cameras.length=0,ce=!0);for(let He=0;He<Te.length;He++){const Be=Te[He];let nt=null;if(f!==null)nt=f.getViewport(Be);else{const se=u.getViewSubImage(d,Be);nt=se.viewport,He===0&&(e.setRenderTargetTextures(g,se.colorTexture,d.ignoreDepthValues?void 0:se.depthStencilTexture),e.setRenderTarget(g))}let $=y[He];$===void 0&&($=new Kt,$.layers.enable(He),$.viewport=new rt,y[He]=$),$.matrix.fromArray(Be.transform.matrix),$.matrix.decompose($.position,$.quaternion,$.scale),$.projectionMatrix.fromArray(Be.projectionMatrix),$.projectionMatrixInverse.copy($.projectionMatrix).invert(),$.viewport.set(nt.x,nt.y,nt.width,nt.height),He===0&&(M.matrix.copy($.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ce===!0&&M.cameras.push($)}const Ue=i.enabledFeatures;if(Ue&&Ue.includes("depth-sensing")){const He=u.getDepthInformation(Te[0]);He&&He.isValid&&He.texture&&v.init(e,He,i.renderState)}}for(let Te=0;Te<_.length;Te++){const ce=x[Te],Ue=_[Te];ce!==null&&Ue!==void 0&&Ue.update(ce,re,l||a)}me&&me(K,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),b=null}const Ye=new hd;Ye.setAnimationLoop(De),this.setAnimationLoop=function(K){me=K},this.dispose=function(){}}}const Ei=new dn,c_=new Ge;function l_(s,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,od(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,g,_,x){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(p,m):m.isMeshToonMaterial?(r(p,m),u(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m)):m.isMeshStandardMaterial?(r(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,x)):m.isMeshMatcapMaterial?(r(p,m),b(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),v(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?c(p,m,g,_):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Zt&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Zt&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const g=e.get(m),_=g.envMap,x=g.envMapRotation;_&&(p.envMap.value=_,Ei.copy(x),Ei.x*=-1,Ei.y*=-1,Ei.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Ei.y*=-1,Ei.z*=-1),p.envMapRotation.value.setFromMatrix4(c_.makeRotationFromEuler(Ei)),p.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,g,_){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*g,p.scale.value=_*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,g){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Zt&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=g.texture,p.transmissionSamplerSize.value.set(g.width,g.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function b(p,m){m.matcap&&(p.matcap.value=m.matcap)}function v(p,m){const g=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(g.matrixWorld),p.nearDistance.value=g.shadow.camera.near,p.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function h_(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(g,_){const x=_.program;n.uniformBlockBinding(g,x)}function l(g,_){let x=i[g.id];x===void 0&&(b(g),x=h(g),i[g.id]=x,g.addEventListener("dispose",p));const E=_.program;n.updateUBOMapping(g,E);const w=e.render.frame;r[g.id]!==w&&(d(g),r[g.id]=w)}function h(g){const _=u();g.__bindingPointIndex=_;const x=s.createBuffer(),E=g.__size,w=g.usage;return s.bindBuffer(s.UNIFORM_BUFFER,x),s.bufferData(s.UNIFORM_BUFFER,E,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,_,x),x}function u(){for(let g=0;g<o;g++)if(a.indexOf(g)===-1)return a.push(g),g;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(g){const _=i[g.id],x=g.uniforms,E=g.__cache;s.bindBuffer(s.UNIFORM_BUFFER,_);for(let w=0,A=x.length;w<A;w++){const S=Array.isArray(x[w])?x[w]:[x[w]];for(let y=0,M=S.length;y<M;y++){const C=S[y];if(f(C,w,y,E)===!0){const D=C.__offset,U=Array.isArray(C.value)?C.value:[C.value];let N=0;for(let G=0;G<U.length;G++){const O=U[G],Y=v(O);typeof O=="number"||typeof O=="boolean"?(C.__data[0]=O,s.bufferSubData(s.UNIFORM_BUFFER,D+N,C.__data)):O.isMatrix3?(C.__data[0]=O.elements[0],C.__data[1]=O.elements[1],C.__data[2]=O.elements[2],C.__data[3]=0,C.__data[4]=O.elements[3],C.__data[5]=O.elements[4],C.__data[6]=O.elements[5],C.__data[7]=0,C.__data[8]=O.elements[6],C.__data[9]=O.elements[7],C.__data[10]=O.elements[8],C.__data[11]=0):(O.toArray(C.__data,N),N+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,D,C.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(g,_,x,E){const w=g.value,A=_+"_"+x;if(E[A]===void 0)return typeof w=="number"||typeof w=="boolean"?E[A]=w:E[A]=w.clone(),!0;{const S=E[A];if(typeof w=="number"||typeof w=="boolean"){if(S!==w)return E[A]=w,!0}else if(S.equals(w)===!1)return S.copy(w),!0}return!1}function b(g){const _=g.uniforms;let x=0;const E=16;for(let A=0,S=_.length;A<S;A++){const y=Array.isArray(_[A])?_[A]:[_[A]];for(let M=0,C=y.length;M<C;M++){const D=y[M],U=Array.isArray(D.value)?D.value:[D.value];for(let N=0,G=U.length;N<G;N++){const O=U[N],Y=v(O),H=x%E,te=H%Y.boundary,oe=H+te;x+=te,oe!==0&&E-oe<Y.storage&&(x+=E-oe),D.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=x,x+=Y.storage}}}const w=x%E;return w>0&&(x+=E-w),g.__size=x,g.__cache={},this}function v(g){const _={boundary:0,storage:0};return typeof g=="number"||typeof g=="boolean"?(_.boundary=4,_.storage=4):g.isVector2?(_.boundary=8,_.storage=8):g.isVector3||g.isColor?(_.boundary=16,_.storage=12):g.isVector4?(_.boundary=16,_.storage=16):g.isMatrix3?(_.boundary=48,_.storage=48):g.isMatrix4?(_.boundary=64,_.storage=64):g.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",g),_}function p(g){const _=g.target;_.removeEventListener("dispose",p);const x=a.indexOf(_.__bindingPointIndex);a.splice(x,1),s.deleteBuffer(i[_.id]),delete i[_.id],delete r[_.id]}function m(){for(const g in i)s.deleteBuffer(i[g]);a=[],i={},r={}}return{bind:c,update:l,dispose:m}}class u_{constructor(e={}){const{canvas:t=Zf(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const b=new Uint32Array(4),v=new Int32Array(4);let p=null,m=null;const g=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=pt,this.toneMapping=_i,this.toneMappingExposure=1;const x=this;let E=!1,w=0,A=0,S=null,y=-1,M=null;const C=new rt,D=new rt;let U=null;const N=new ue(0);let G=0,O=t.width,Y=t.height,H=1,te=null,oe=null;const me=new rt(0,0,O,Y),De=new rt(0,0,O,Y);let Ye=!1;const K=new Yc;let re=!1,Te=!1;const ce=new Ge,Ue=new Ge,He=new P,Be=new rt,nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let $=!1;function se(){return S===null?H:1}let I=n;function Le(R,k){return t.getContext(R,k)}try{const R={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Oc}`),t.addEventListener("webglcontextlost",Q,!1),t.addEventListener("webglcontextrestored",_e,!1),t.addEventListener("webglcontextcreationerror",ge,!1),I===null){const k="webgl2";if(I=Le(k,R),I===null)throw Le(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let ne,ye,he,Oe,xe,L,T,z,J,ee,Z,Ee,fe,ve,Qe,ie,Me,ke,ze,we,tt,Ke,xt,F;function pe(){ne=new gg(I),ne.init(),Ke=new t_(I,ne),ye=new hg(I,ne,e,Ke),he=new Qb(I,ne),ye.reverseDepthBuffer&&d&&he.buffers.depth.setReversed(!0),Oe=new xg(I),xe=new Ob,L=new e_(I,ne,he,xe,ye,Ke,Oe),T=new dg(x),z=new mg(x),J=new Ep(I),xt=new cg(I,J),ee=new bg(I,J,Oe,xt),Z=new yg(I,ee,J,Oe),ze=new vg(I,ye,L),ie=new ug(xe),Ee=new Fb(x,T,z,ne,ye,xt,ie),fe=new l_(x,xe),ve=new Bb,Qe=new jb(ne),ke=new og(x,T,z,he,Z,f,c),Me=new Jb(x,Z,ye),F=new h_(I,Oe,ye,he),we=new lg(I,ne,Oe),tt=new _g(I,ne,Oe),Oe.programs=Ee.programs,x.capabilities=ye,x.extensions=ne,x.properties=xe,x.renderLists=ve,x.shadowMap=Me,x.state=he,x.info=Oe}pe();const X=new o_(x,I);this.xr=X,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const R=ne.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=ne.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(R){R!==void 0&&(H=R,this.setSize(O,Y,!1))},this.getSize=function(R){return R.set(O,Y)},this.setSize=function(R,k,V=!0){if(X.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=R,Y=k,t.width=Math.floor(R*H),t.height=Math.floor(k*H),V===!0&&(t.style.width=R+"px",t.style.height=k+"px"),this.setViewport(0,0,R,k)},this.getDrawingBufferSize=function(R){return R.set(O*H,Y*H).floor()},this.setDrawingBufferSize=function(R,k,V){O=R,Y=k,H=V,t.width=Math.floor(R*V),t.height=Math.floor(k*V),this.setViewport(0,0,R,k)},this.getCurrentViewport=function(R){return R.copy(C)},this.getViewport=function(R){return R.copy(me)},this.setViewport=function(R,k,V,W){R.isVector4?me.set(R.x,R.y,R.z,R.w):me.set(R,k,V,W),he.viewport(C.copy(me).multiplyScalar(H).round())},this.getScissor=function(R){return R.copy(De)},this.setScissor=function(R,k,V,W){R.isVector4?De.set(R.x,R.y,R.z,R.w):De.set(R,k,V,W),he.scissor(D.copy(De).multiplyScalar(H).round())},this.getScissorTest=function(){return Ye},this.setScissorTest=function(R){he.setScissorTest(Ye=R)},this.setOpaqueSort=function(R){te=R},this.setTransparentSort=function(R){oe=R},this.getClearColor=function(R){return R.copy(ke.getClearColor())},this.setClearColor=function(){ke.setClearColor.apply(ke,arguments)},this.getClearAlpha=function(){return ke.getClearAlpha()},this.setClearAlpha=function(){ke.setClearAlpha.apply(ke,arguments)},this.clear=function(R=!0,k=!0,V=!0){let W=0;if(R){let B=!1;if(S!==null){const ae=S.texture.format;B=ae===jc||ae===Wc||ae===Vc}if(B){const ae=S.texture.type,be=ae===ri||ae===Ni||ae===hr||ae===vs||ae===zc||ae===Gc,Re=ke.getClearColor(),Ce=ke.getClearAlpha(),Ve=Re.r,Xe=Re.g,Pe=Re.b;be?(b[0]=Ve,b[1]=Xe,b[2]=Pe,b[3]=Ce,I.clearBufferuiv(I.COLOR,0,b)):(v[0]=Ve,v[1]=Xe,v[2]=Pe,v[3]=Ce,I.clearBufferiv(I.COLOR,0,v))}else W|=I.COLOR_BUFFER_BIT}k&&(W|=I.DEPTH_BUFFER_BIT),V&&(W|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Q,!1),t.removeEventListener("webglcontextrestored",_e,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),ve.dispose(),Qe.dispose(),xe.dispose(),T.dispose(),z.dispose(),Z.dispose(),xt.dispose(),F.dispose(),Ee.dispose(),X.dispose(),X.removeEventListener("sessionstart",gl),X.removeEventListener("sessionend",bl),vi.stop()};function Q(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function _e(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const R=Oe.autoReset,k=Me.enabled,V=Me.autoUpdate,W=Me.needsUpdate,B=Me.type;pe(),Oe.autoReset=R,Me.enabled=k,Me.autoUpdate=V,Me.needsUpdate=W,Me.type=B}function ge(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function je(R){const k=R.target;k.removeEventListener("dispose",je),At(k)}function At(R){Gt(R),xe.remove(R)}function Gt(R){const k=xe.get(R).programs;k!==void 0&&(k.forEach(function(V){Ee.releaseProgram(V)}),R.isShaderMaterial&&Ee.releaseShaderCache(R))}this.renderBufferDirect=function(R,k,V,W,B,ae){k===null&&(k=nt);const be=B.isMesh&&B.matrixWorld.determinant()<0,Re=Hd(R,k,V,W,B);he.setMaterial(W,be);let Ce=V.index,Ve=1;if(W.wireframe===!0){if(Ce=ee.getWireframeAttribute(V),Ce===void 0)return;Ve=2}const Xe=V.drawRange,Pe=V.attributes.position;let st=Xe.start*Ve,vt=(Xe.start+Xe.count)*Ve;ae!==null&&(st=Math.max(st,ae.start*Ve),vt=Math.min(vt,(ae.start+ae.count)*Ve)),Ce!==null?(st=Math.max(st,0),vt=Math.min(vt,Ce.count)):Pe!=null&&(st=Math.max(st,0),vt=Math.min(vt,Pe.count));const Mt=vt-st;if(Mt<0||Mt===1/0)return;xt.setup(B,W,Re,V,Ce);let $t,at=we;if(Ce!==null&&($t=J.get(Ce),at=tt,at.setIndex($t)),B.isMesh)W.wireframe===!0?(he.setLineWidth(W.wireframeLinewidth*se()),at.setMode(I.LINES)):at.setMode(I.TRIANGLES);else if(B.isLine){let Ie=W.linewidth;Ie===void 0&&(Ie=1),he.setLineWidth(Ie*se()),B.isLineSegments?at.setMode(I.LINES):B.isLineLoop?at.setMode(I.LINE_LOOP):at.setMode(I.LINE_STRIP)}else B.isPoints?at.setMode(I.POINTS):B.isSprite&&at.setMode(I.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)at.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(ne.get("WEBGL_multi_draw"))at.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Ie=B._multiDrawStarts,Hn=B._multiDrawCounts,ot=B._multiDrawCount,Mn=Ce?J.get(Ce).bytesPerElement:1,ki=xe.get(W).currentProgram.getUniforms();for(let sn=0;sn<ot;sn++)ki.setValue(I,"_gl_DrawID",sn),at.render(Ie[sn]/Mn,Hn[sn])}else if(B.isInstancedMesh)at.renderInstances(st,Mt,B.count);else if(V.isInstancedBufferGeometry){const Ie=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Hn=Math.min(V.instanceCount,Ie);at.renderInstances(st,Mt,Hn)}else at.render(st,Mt)};function lt(R,k,V){R.transparent===!0&&R.side===Rt&&R.forceSinglePass===!1?(R.side=Zt,R.needsUpdate=!0,Tr(R,k,V),R.side=si,R.needsUpdate=!0,Tr(R,k,V),R.side=Rt):Tr(R,k,V)}this.compile=function(R,k,V=null){V===null&&(V=R),m=Qe.get(V),m.init(k),_.push(m),V.traverseVisible(function(B){B.isLight&&B.layers.test(k.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),R!==V&&R.traverseVisible(function(B){B.isLight&&B.layers.test(k.layers)&&(m.pushLight(B),B.castShadow&&m.pushShadow(B))}),m.setupLights();const W=new Set;return R.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const ae=B.material;if(ae)if(Array.isArray(ae))for(let be=0;be<ae.length;be++){const Re=ae[be];lt(Re,V,B),W.add(Re)}else lt(ae,V,B),W.add(ae)}),_.pop(),m=null,W},this.compileAsync=function(R,k,V=null){const W=this.compile(R,k,V);return new Promise(B=>{function ae(){if(W.forEach(function(be){xe.get(be).currentProgram.isReady()&&W.delete(be)}),W.size===0){B(R);return}setTimeout(ae,10)}ne.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let yn=null;function Gn(R){yn&&yn(R)}function gl(){vi.stop()}function bl(){vi.start()}const vi=new hd;vi.setAnimationLoop(Gn),typeof self<"u"&&vi.setContext(self),this.setAnimationLoop=function(R){yn=R,X.setAnimationLoop(R),R===null?vi.stop():vi.start()},X.addEventListener("sessionstart",gl),X.addEventListener("sessionend",bl),this.render=function(R,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),X.enabled===!0&&X.isPresenting===!0&&(X.cameraAutoUpdate===!0&&X.updateCamera(k),k=X.getCamera()),R.isScene===!0&&R.onBeforeRender(x,R,k,S),m=Qe.get(R,_.length),m.init(k),_.push(m),Ue.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),K.setFromProjectionMatrix(Ue),Te=this.localClippingEnabled,re=ie.init(this.clippingPlanes,Te),p=ve.get(R,g.length),p.init(),g.push(p),X.enabled===!0&&X.isPresenting===!0){const ae=x.xr.getDepthSensingMesh();ae!==null&&Va(ae,k,-1/0,x.sortObjects)}Va(R,k,0,x.sortObjects),p.finish(),x.sortObjects===!0&&p.sort(te,oe),$=X.enabled===!1||X.isPresenting===!1||X.hasDepthSensing()===!1,$&&ke.addToRenderList(p,R),this.info.render.frame++,re===!0&&ie.beginShadows();const V=m.state.shadowsArray;Me.render(V,R,k),re===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=p.opaque,B=p.transmissive;if(m.setupLights(),k.isArrayCamera){const ae=k.cameras;if(B.length>0)for(let be=0,Re=ae.length;be<Re;be++){const Ce=ae[be];xl(W,B,R,Ce)}$&&ke.render(R);for(let be=0,Re=ae.length;be<Re;be++){const Ce=ae[be];_l(p,R,Ce,Ce.viewport)}}else B.length>0&&xl(W,B,R,k),$&&ke.render(R),_l(p,R,k);S!==null&&(L.updateMultisampleRenderTarget(S),L.updateRenderTargetMipmap(S)),R.isScene===!0&&R.onAfterRender(x,R,k),xt.resetDefaultState(),y=-1,M=null,_.pop(),_.length>0?(m=_[_.length-1],re===!0&&ie.setGlobalState(x.clippingPlanes,m.state.camera)):m=null,g.pop(),g.length>0?p=g[g.length-1]:p=null};function Va(R,k,V,W){if(R.visible===!1)return;if(R.layers.test(k.layers)){if(R.isGroup)V=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(k);else if(R.isLight)m.pushLight(R),R.castShadow&&m.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||K.intersectsSprite(R)){W&&Be.setFromMatrixPosition(R.matrixWorld).applyMatrix4(Ue);const be=Z.update(R),Re=R.material;Re.visible&&p.push(R,be,Re,V,Be.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||K.intersectsObject(R))){const be=Z.update(R),Re=R.material;if(W&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Be.copy(R.boundingSphere.center)):(be.boundingSphere===null&&be.computeBoundingSphere(),Be.copy(be.boundingSphere.center)),Be.applyMatrix4(R.matrixWorld).applyMatrix4(Ue)),Array.isArray(Re)){const Ce=be.groups;for(let Ve=0,Xe=Ce.length;Ve<Xe;Ve++){const Pe=Ce[Ve],st=Re[Pe.materialIndex];st&&st.visible&&p.push(R,be,st,V,Be.z,Pe)}}else Re.visible&&p.push(R,be,Re,V,Be.z,null)}}const ae=R.children;for(let be=0,Re=ae.length;be<Re;be++)Va(ae[be],k,V,W)}function _l(R,k,V,W){const B=R.opaque,ae=R.transmissive,be=R.transparent;m.setupLightsView(V),re===!0&&ie.setGlobalState(x.clippingPlanes,V),W&&he.viewport(C.copy(W)),B.length>0&&Sr(B,k,V),ae.length>0&&Sr(ae,k,V),be.length>0&&Sr(be,k,V),he.buffers.depth.setTest(!0),he.buffers.depth.setMask(!0),he.buffers.color.setMask(!0),he.setPolygonOffset(!1)}function xl(R,k,V,W){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[W.id]===void 0&&(m.state.transmissionRenderTarget[W.id]=new xn(1,1,{generateMipmaps:!0,type:ne.has("EXT_color_buffer_half_float")||ne.has("EXT_color_buffer_float")?nn:ri,minFilter:An,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$e.workingColorSpace}));const ae=m.state.transmissionRenderTarget[W.id],be=W.viewport||C;ae.setSize(be.z,be.w);const Re=x.getRenderTarget();x.setRenderTarget(ae),x.getClearColor(N),G=x.getClearAlpha(),G<1&&x.setClearColor(16777215,.5),x.clear(),$&&ke.render(V);const Ce=x.toneMapping;x.toneMapping=_i;const Ve=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),m.setupLightsView(W),re===!0&&ie.setGlobalState(x.clippingPlanes,W),Sr(R,V,W),L.updateMultisampleRenderTarget(ae),L.updateRenderTargetMipmap(ae),ne.has("WEBGL_multisampled_render_to_texture")===!1){let Xe=!1;for(let Pe=0,st=k.length;Pe<st;Pe++){const vt=k[Pe],Mt=vt.object,$t=vt.geometry,at=vt.material,Ie=vt.group;if(at.side===Rt&&Mt.layers.test(W.layers)){const Hn=at.side;at.side=Zt,at.needsUpdate=!0,vl(Mt,V,W,$t,at,Ie),at.side=Hn,at.needsUpdate=!0,Xe=!0}}Xe===!0&&(L.updateMultisampleRenderTarget(ae),L.updateRenderTargetMipmap(ae))}x.setRenderTarget(Re),x.setClearColor(N,G),Ve!==void 0&&(W.viewport=Ve),x.toneMapping=Ce}function Sr(R,k,V){const W=k.isScene===!0?k.overrideMaterial:null;for(let B=0,ae=R.length;B<ae;B++){const be=R[B],Re=be.object,Ce=be.geometry,Ve=W===null?be.material:W,Xe=be.group;Re.layers.test(V.layers)&&vl(Re,k,V,Ce,Ve,Xe)}}function vl(R,k,V,W,B,ae){R.onBeforeRender(x,k,V,W,B,ae),R.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),B.onBeforeRender(x,k,V,W,R,ae),B.transparent===!0&&B.side===Rt&&B.forceSinglePass===!1?(B.side=Zt,B.needsUpdate=!0,x.renderBufferDirect(V,k,W,B,R,ae),B.side=si,B.needsUpdate=!0,x.renderBufferDirect(V,k,W,B,R,ae),B.side=Rt):x.renderBufferDirect(V,k,W,B,R,ae),R.onAfterRender(x,k,V,W,B,ae)}function Tr(R,k,V){k.isScene!==!0&&(k=nt);const W=xe.get(R),B=m.state.lights,ae=m.state.shadowsArray,be=B.state.version,Re=Ee.getParameters(R,B.state,ae,k,V),Ce=Ee.getProgramCacheKey(Re);let Ve=W.programs;W.environment=R.isMeshStandardMaterial?k.environment:null,W.fog=k.fog,W.envMap=(R.isMeshStandardMaterial?z:T).get(R.envMap||W.environment),W.envMapRotation=W.environment!==null&&R.envMap===null?k.environmentRotation:R.envMapRotation,Ve===void 0&&(R.addEventListener("dispose",je),Ve=new Map,W.programs=Ve);let Xe=Ve.get(Ce);if(Xe!==void 0){if(W.currentProgram===Xe&&W.lightsStateVersion===be)return Ml(R,Re),Xe}else Re.uniforms=Ee.getUniforms(R),R.onBeforeCompile(Re,x),Xe=Ee.acquireProgram(Re,Ce),Ve.set(Ce,Xe),W.uniforms=Re.uniforms;const Pe=W.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Pe.clippingPlanes=ie.uniform),Ml(R,Re),W.needsLights=Wd(R),W.lightsStateVersion=be,W.needsLights&&(Pe.ambientLightColor.value=B.state.ambient,Pe.lightProbe.value=B.state.probe,Pe.directionalLights.value=B.state.directional,Pe.directionalLightShadows.value=B.state.directionalShadow,Pe.spotLights.value=B.state.spot,Pe.spotLightShadows.value=B.state.spotShadow,Pe.rectAreaLights.value=B.state.rectArea,Pe.ltc_1.value=B.state.rectAreaLTC1,Pe.ltc_2.value=B.state.rectAreaLTC2,Pe.pointLights.value=B.state.point,Pe.pointLightShadows.value=B.state.pointShadow,Pe.hemisphereLights.value=B.state.hemi,Pe.directionalShadowMap.value=B.state.directionalShadowMap,Pe.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Pe.spotShadowMap.value=B.state.spotShadowMap,Pe.spotLightMatrix.value=B.state.spotLightMatrix,Pe.spotLightMap.value=B.state.spotLightMap,Pe.pointShadowMap.value=B.state.pointShadowMap,Pe.pointShadowMatrix.value=B.state.pointShadowMatrix),W.currentProgram=Xe,W.uniformsList=null,Xe}function yl(R){if(R.uniformsList===null){const k=R.currentProgram.getUniforms();R.uniformsList=xa.seqWithValue(k.seq,R.uniforms)}return R.uniformsList}function Ml(R,k){const V=xe.get(R);V.outputColorSpace=k.outputColorSpace,V.batching=k.batching,V.batchingColor=k.batchingColor,V.instancing=k.instancing,V.instancingColor=k.instancingColor,V.instancingMorph=k.instancingMorph,V.skinning=k.skinning,V.morphTargets=k.morphTargets,V.morphNormals=k.morphNormals,V.morphColors=k.morphColors,V.morphTargetsCount=k.morphTargetsCount,V.numClippingPlanes=k.numClippingPlanes,V.numIntersection=k.numClipIntersection,V.vertexAlphas=k.vertexAlphas,V.vertexTangents=k.vertexTangents,V.toneMapping=k.toneMapping}function Hd(R,k,V,W,B){k.isScene!==!0&&(k=nt),L.resetTextureUnits();const ae=k.fog,be=W.isMeshStandardMaterial?k.environment:null,Re=S===null?x.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:jt,Ce=(W.isMeshStandardMaterial?z:T).get(W.envMap||be),Ve=W.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,Xe=!!V.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Pe=!!V.morphAttributes.position,st=!!V.morphAttributes.normal,vt=!!V.morphAttributes.color;let Mt=_i;W.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(Mt=x.toneMapping);const $t=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,at=$t!==void 0?$t.length:0,Ie=xe.get(W),Hn=m.state.lights;if(re===!0&&(Te===!0||R!==M)){const fn=R===M&&W.id===y;ie.setState(W,R,fn)}let ot=!1;W.version===Ie.__version?(Ie.needsLights&&Ie.lightsStateVersion!==Hn.state.version||Ie.outputColorSpace!==Re||B.isBatchedMesh&&Ie.batching===!1||!B.isBatchedMesh&&Ie.batching===!0||B.isBatchedMesh&&Ie.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Ie.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Ie.instancing===!1||!B.isInstancedMesh&&Ie.instancing===!0||B.isSkinnedMesh&&Ie.skinning===!1||!B.isSkinnedMesh&&Ie.skinning===!0||B.isInstancedMesh&&Ie.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Ie.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Ie.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Ie.instancingMorph===!1&&B.morphTexture!==null||Ie.envMap!==Ce||W.fog===!0&&Ie.fog!==ae||Ie.numClippingPlanes!==void 0&&(Ie.numClippingPlanes!==ie.numPlanes||Ie.numIntersection!==ie.numIntersection)||Ie.vertexAlphas!==Ve||Ie.vertexTangents!==Xe||Ie.morphTargets!==Pe||Ie.morphNormals!==st||Ie.morphColors!==vt||Ie.toneMapping!==Mt||Ie.morphTargetsCount!==at)&&(ot=!0):(ot=!0,Ie.__version=W.version);let Mn=Ie.currentProgram;ot===!0&&(Mn=Tr(W,k,B));let ki=!1,sn=!1,Fs=!1;const wt=Mn.getUniforms(),Rn=Ie.uniforms;if(he.useProgram(Mn.program)&&(ki=!0,sn=!0,Fs=!0),W.id!==y&&(y=W.id,sn=!0),ki||M!==R){he.buffers.depth.getReversed()?(ce.copy(R.projectionMatrix),$f(ce),ep(ce),wt.setValue(I,"projectionMatrix",ce)):wt.setValue(I,"projectionMatrix",R.projectionMatrix),wt.setValue(I,"viewMatrix",R.matrixWorldInverse);const ai=wt.map.cameraPosition;ai!==void 0&&ai.setValue(I,He.setFromMatrixPosition(R.matrixWorld)),ye.logarithmicDepthBuffer&&wt.setValue(I,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&wt.setValue(I,"isOrthographic",R.isOrthographicCamera===!0),M!==R&&(M=R,sn=!0,Fs=!0)}if(B.isSkinnedMesh){wt.setOptional(I,B,"bindMatrix"),wt.setOptional(I,B,"bindMatrixInverse");const fn=B.skeleton;fn&&(fn.boneTexture===null&&fn.computeBoneTexture(),wt.setValue(I,"boneTexture",fn.boneTexture,L))}B.isBatchedMesh&&(wt.setOptional(I,B,"batchingTexture"),wt.setValue(I,"batchingTexture",B._matricesTexture,L),wt.setOptional(I,B,"batchingIdTexture"),wt.setValue(I,"batchingIdTexture",B._indirectTexture,L),wt.setOptional(I,B,"batchingColorTexture"),B._colorsTexture!==null&&wt.setValue(I,"batchingColorTexture",B._colorsTexture,L));const Os=V.morphAttributes;if((Os.position!==void 0||Os.normal!==void 0||Os.color!==void 0)&&ze.update(B,V,Mn),(sn||Ie.receiveShadow!==B.receiveShadow)&&(Ie.receiveShadow=B.receiveShadow,wt.setValue(I,"receiveShadow",B.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Rn.envMap.value=Ce,Rn.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&k.environment!==null&&(Rn.envMapIntensity.value=k.environmentIntensity),sn&&(wt.setValue(I,"toneMappingExposure",x.toneMappingExposure),Ie.needsLights&&Vd(Rn,Fs),ae&&W.fog===!0&&fe.refreshFogUniforms(Rn,ae),fe.refreshMaterialUniforms(Rn,W,H,Y,m.state.transmissionRenderTarget[R.id]),xa.upload(I,yl(Ie),Rn,L)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(xa.upload(I,yl(Ie),Rn,L),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&wt.setValue(I,"center",B.center),wt.setValue(I,"modelViewMatrix",B.modelViewMatrix),wt.setValue(I,"normalMatrix",B.normalMatrix),wt.setValue(I,"modelMatrix",B.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const fn=W.uniformsGroups;for(let ai=0,oi=fn.length;ai<oi;ai++){const wl=fn[ai];F.update(wl,Mn),F.bind(wl,Mn)}}return Mn}function Vd(R,k){R.ambientLightColor.needsUpdate=k,R.lightProbe.needsUpdate=k,R.directionalLights.needsUpdate=k,R.directionalLightShadows.needsUpdate=k,R.pointLights.needsUpdate=k,R.pointLightShadows.needsUpdate=k,R.spotLights.needsUpdate=k,R.spotLightShadows.needsUpdate=k,R.rectAreaLights.needsUpdate=k,R.hemisphereLights.needsUpdate=k}function Wd(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(R,k,V){xe.get(R.texture).__webglTexture=k,xe.get(R.depthTexture).__webglTexture=V;const W=xe.get(R);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=V===void 0,W.__autoAllocateDepthBuffer||ne.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(R,k){const V=xe.get(R);V.__webglFramebuffer=k,V.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(R,k=0,V=0){S=R,w=k,A=V;let W=!0,B=null,ae=!1,be=!1;if(R){const Ce=xe.get(R);if(Ce.__useDefaultFramebuffer!==void 0)he.bindFramebuffer(I.FRAMEBUFFER,null),W=!1;else if(Ce.__webglFramebuffer===void 0)L.setupRenderTarget(R);else if(Ce.__hasExternalTextures)L.rebindTextures(R,xe.get(R.texture).__webglTexture,xe.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Pe=R.depthTexture;if(Ce.__boundDepthTexture!==Pe){if(Pe!==null&&xe.has(Pe)&&(R.width!==Pe.image.width||R.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");L.setupDepthRenderbuffer(R)}}const Ve=R.texture;(Ve.isData3DTexture||Ve.isDataArrayTexture||Ve.isCompressedArrayTexture)&&(be=!0);const Xe=xe.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Xe[k])?B=Xe[k][V]:B=Xe[k],ae=!0):R.samples>0&&L.useMultisampledRTT(R)===!1?B=xe.get(R).__webglMultisampledFramebuffer:Array.isArray(Xe)?B=Xe[V]:B=Xe,C.copy(R.viewport),D.copy(R.scissor),U=R.scissorTest}else C.copy(me).multiplyScalar(H).floor(),D.copy(De).multiplyScalar(H).floor(),U=Ye;if(he.bindFramebuffer(I.FRAMEBUFFER,B)&&W&&he.drawBuffers(R,B),he.viewport(C),he.scissor(D),he.setScissorTest(U),ae){const Ce=xe.get(R.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+k,Ce.__webglTexture,V)}else if(be){const Ce=xe.get(R.texture),Ve=k||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ce.__webglTexture,V||0,Ve)}y=-1},this.readRenderTargetPixels=function(R,k,V,W,B,ae,be){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=xe.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&be!==void 0&&(Re=Re[be]),Re){he.bindFramebuffer(I.FRAMEBUFFER,Re);try{const Ce=R.texture,Ve=Ce.format,Xe=Ce.type;if(!ye.textureFormatReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ye.textureTypeReadable(Xe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=R.width-W&&V>=0&&V<=R.height-B&&I.readPixels(k,V,W,B,Ke.convert(Ve),Ke.convert(Xe),ae)}finally{const Ce=S!==null?xe.get(S).__webglFramebuffer:null;he.bindFramebuffer(I.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(R,k,V,W,B,ae,be){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=xe.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&be!==void 0&&(Re=Re[be]),Re){const Ce=R.texture,Ve=Ce.format,Xe=Ce.type;if(!ye.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ye.textureTypeReadable(Xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=R.width-W&&V>=0&&V<=R.height-B){he.bindFramebuffer(I.FRAMEBUFFER,Re);const Pe=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Pe),I.bufferData(I.PIXEL_PACK_BUFFER,ae.byteLength,I.STREAM_READ),I.readPixels(k,V,W,B,Ke.convert(Ve),Ke.convert(Xe),0);const st=S!==null?xe.get(S).__webglFramebuffer:null;he.bindFramebuffer(I.FRAMEBUFFER,st);const vt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Qf(I,vt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Pe),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ae),I.deleteBuffer(Pe),I.deleteSync(vt),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(R,k=null,V=0){R.isTexture!==!0&&(er("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,R=arguments[1]);const W=Math.pow(2,-V),B=Math.floor(R.image.width*W),ae=Math.floor(R.image.height*W),be=k!==null?k.x:0,Re=k!==null?k.y:0;L.setTexture2D(R,0),I.copyTexSubImage2D(I.TEXTURE_2D,V,0,0,be,Re,B,ae),he.unbindTexture()},this.copyTextureToTexture=function(R,k,V=null,W=null,B=0){R.isTexture!==!0&&(er("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,R=arguments[1],k=arguments[2],B=arguments[3]||0,V=null);let ae,be,Re,Ce,Ve,Xe,Pe,st,vt;const Mt=R.isCompressedTexture?R.mipmaps[B]:R.image;V!==null?(ae=V.max.x-V.min.x,be=V.max.y-V.min.y,Re=V.isBox3?V.max.z-V.min.z:1,Ce=V.min.x,Ve=V.min.y,Xe=V.isBox3?V.min.z:0):(ae=Mt.width,be=Mt.height,Re=Mt.depth||1,Ce=0,Ve=0,Xe=0),W!==null?(Pe=W.x,st=W.y,vt=W.z):(Pe=0,st=0,vt=0);const $t=Ke.convert(k.format),at=Ke.convert(k.type);let Ie;k.isData3DTexture?(L.setTexture3D(k,0),Ie=I.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(L.setTexture2DArray(k,0),Ie=I.TEXTURE_2D_ARRAY):(L.setTexture2D(k,0),Ie=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,k.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,k.unpackAlignment);const Hn=I.getParameter(I.UNPACK_ROW_LENGTH),ot=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Mn=I.getParameter(I.UNPACK_SKIP_PIXELS),ki=I.getParameter(I.UNPACK_SKIP_ROWS),sn=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,Mt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Mt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ce),I.pixelStorei(I.UNPACK_SKIP_ROWS,Ve),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Xe);const Fs=R.isDataArrayTexture||R.isData3DTexture,wt=k.isDataArrayTexture||k.isData3DTexture;if(R.isRenderTargetTexture||R.isDepthTexture){const Rn=xe.get(R),Os=xe.get(k),fn=xe.get(Rn.__renderTarget),ai=xe.get(Os.__renderTarget);he.bindFramebuffer(I.READ_FRAMEBUFFER,fn.__webglFramebuffer),he.bindFramebuffer(I.DRAW_FRAMEBUFFER,ai.__webglFramebuffer);for(let oi=0;oi<Re;oi++)Fs&&I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,xe.get(R).__webglTexture,B,Xe+oi),R.isDepthTexture?(wt&&I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,xe.get(k).__webglTexture,B,vt+oi),I.blitFramebuffer(Ce,Ve,ae,be,Pe,st,ae,be,I.DEPTH_BUFFER_BIT,I.NEAREST)):wt?I.copyTexSubImage3D(Ie,B,Pe,st,vt+oi,Ce,Ve,ae,be):I.copyTexSubImage2D(Ie,B,Pe,st,vt+oi,Ce,Ve,ae,be);he.bindFramebuffer(I.READ_FRAMEBUFFER,null),he.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else wt?R.isDataTexture||R.isData3DTexture?I.texSubImage3D(Ie,B,Pe,st,vt,ae,be,Re,$t,at,Mt.data):k.isCompressedArrayTexture?I.compressedTexSubImage3D(Ie,B,Pe,st,vt,ae,be,Re,$t,Mt.data):I.texSubImage3D(Ie,B,Pe,st,vt,ae,be,Re,$t,at,Mt):R.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,B,Pe,st,ae,be,$t,at,Mt.data):R.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,B,Pe,st,Mt.width,Mt.height,$t,Mt.data):I.texSubImage2D(I.TEXTURE_2D,B,Pe,st,ae,be,$t,at,Mt);I.pixelStorei(I.UNPACK_ROW_LENGTH,Hn),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ot),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Mn),I.pixelStorei(I.UNPACK_SKIP_ROWS,ki),I.pixelStorei(I.UNPACK_SKIP_IMAGES,sn),B===0&&k.generateMipmaps&&I.generateMipmap(Ie),he.unbindTexture()},this.copyTextureToTexture3D=function(R,k,V=null,W=null,B=0){return R.isTexture!==!0&&(er("WebGLRenderer: copyTextureToTexture3D function signature has changed."),V=arguments[0]||null,W=arguments[1]||null,R=arguments[2],k=arguments[3],B=arguments[4]||0),er('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(R,k,V,W,B)},this.initRenderTarget=function(R){xe.get(R).__webglFramebuffer===void 0&&L.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?L.setTextureCube(R,0):R.isData3DTexture?L.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?L.setTexture2DArray(R,0):L.setTexture2D(R,0),he.unbindTexture()},this.resetState=function(){w=0,A=0,S=null,he.reset(),xt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ti}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}}class sr{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ue(e),this.near=t,this.far=n}clone(){return new sr(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class d_ extends _t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new dn,this.environmentIntensity=1,this.environmentRotation=new dn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class gd{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Sc,this.updateRanges=[],this.version=0,this.uuid=_n()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_n()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=_n()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Xt=new P;class mr{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Xt.fromBufferAttribute(this,t),Xt.applyMatrix4(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Xt.fromBufferAttribute(this,t),Xt.applyNormalMatrix(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Xt.fromBufferAttribute(this,t),Xt.transformDirection(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=En(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=En(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=En(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=En(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=En(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array),r=ut(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new mt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new mr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class gr extends un{static get type(){return"SpriteMaterial"}constructor(e){super(),this.isSpriteMaterial=!0,this.color=new ue(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let es;const Hs=new P,ts=new P,ns=new P,is=new q,Vs=new q,bd=new Ge,Kr=new P,Ws=new P,Jr=new P,Eh=new q,vo=new q,Ah=new q;class Sa extends _t{constructor(e=new gr){if(super(),this.isSprite=!0,this.type="Sprite",es===void 0){es=new gt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new gd(t,5);es.setIndex([0,1,2,0,2,3]),es.setAttribute("position",new mr(n,3,0,!1)),es.setAttribute("uv",new mr(n,2,3,!1))}this.geometry=es,this.material=e,this.center=new q(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ts.setFromMatrixScale(this.matrixWorld),bd.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ns.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ts.multiplyScalar(-ns.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const a=this.center;Zr(Kr.set(-.5,-.5,0),ns,a,ts,i,r),Zr(Ws.set(.5,-.5,0),ns,a,ts,i,r),Zr(Jr.set(.5,.5,0),ns,a,ts,i,r),Eh.set(0,0),vo.set(1,0),Ah.set(1,1);let o=e.ray.intersectTriangle(Kr,Ws,Jr,!1,Hs);if(o===null&&(Zr(Ws.set(-.5,.5,0),ns,a,ts,i,r),vo.set(0,1),o=e.ray.intersectTriangle(Kr,Jr,Ws,!1,Hs),o===null))return;const c=e.ray.origin.distanceTo(Hs);c<e.near||c>e.far||t.push({distance:c,point:Hs.clone(),uv:gn.getInterpolation(Hs,Kr,Ws,Jr,Eh,vo,Ah,new q),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Zr(s,e,t,n,i,r){is.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(Vs.x=r*is.x-i*is.y,Vs.y=i*is.x+r*is.y):Vs.copy(is),s.copy(e),s.x+=Vs.x,s.y+=Vs.y,s.applyMatrix4(bd)}const Rh=new P,Ch=new rt,Ph=new rt,f_=new P,Lh=new Ge,Qr=new P,yo=new On,Ih=new Ge,Mo=new yr;class p_ extends j{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Cl,this.bindMatrix=new Ge,this.bindMatrixInverse=new Ge,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new bt),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Qr),this.boundingBox.expandByPoint(Qr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new On),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Qr),this.boundingSphere.expandByPoint(Qr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),yo.copy(this.boundingSphere),yo.applyMatrix4(i),e.ray.intersectsSphere(yo)!==!1&&(Ih.copy(i).invert(),Mo.copy(e.ray).applyMatrix4(Ih),!(this.boundingBox!==null&&Mo.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Mo)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new rt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Cl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===yf?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Ch.fromBufferAttribute(i.attributes.skinIndex,e),Ph.fromBufferAttribute(i.attributes.skinWeight,e),Rh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=Ph.getComponent(r);if(a!==0){const o=Ch.getComponent(r);Lh.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(f_.copy(Rh).applyMatrix4(Lh),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class _d extends _t{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Jc extends Dt{constructor(e=null,t=1,n=1,i,r,a,o,c,l=Qt,h=Qt,u,d){super(null,a,o,c,l,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Dh=new Ge,m_=new Ge;class Zc{constructor(e=[],t=[]){this.uuid=_n(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Ge)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Ge;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:m_;Dh.multiplyMatrices(o,t[r]),Dh.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Zc(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Jc(t,e,e,bn,tn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let a=t[r];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),a=new _d),this.bones.push(a),this.boneInverses.push(new Ge().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class Ui extends mt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const ss=new Ge,Uh=new Ge,$r=[],Nh=new bt,g_=new Ge,js=new j,Xs=new On;class en extends j{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ui(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,g_)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new bt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ss),Nh.copy(e.boundingBox).applyMatrix4(ss),this.boundingBox.union(Nh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new On),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,ss),Xs.copy(e.boundingSphere).applyMatrix4(ss),this.boundingSphere.union(Xs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(js.geometry=this.geometry,js.material=this.material,js.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Xs.copy(this.boundingSphere),Xs.applyMatrix4(n),e.ray.intersectsSphere(Xs)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,ss),Uh.multiplyMatrices(n,ss),js.matrixWorld=Uh,js.raycast(e,$r);for(let a=0,o=$r.length;a<o;a++){const c=$r[a];c.instanceId=r,c.object=this,t.push(c)}$r.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ui(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Jc(new Float32Array(i*this.count),i,this.count,Hc,tn));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=i*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Qc extends un{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new ue(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ta=new P,Ea=new P,Fh=new Ge,qs=new yr,ea=new On,wo=new P,Oh=new P;class Ua extends _t{constructor(e=new gt,t=new Qc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Ta.fromBufferAttribute(t,i-1),Ea.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Ta.distanceTo(Ea);e.setAttribute("lineDistance",new We(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ea.copy(n.boundingSphere),ea.applyMatrix4(i),ea.radius+=r,e.ray.intersectsSphere(ea)===!1)return;Fh.copy(i).invert(),qs.copy(e.ray).applyMatrix4(Fh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),b=Math.min(h.count,a.start+a.count);for(let v=f,p=b-1;v<p;v+=l){const m=h.getX(v),g=h.getX(v+1),_=ta(this,e,qs,c,m,g);_&&t.push(_)}if(this.isLineLoop){const v=h.getX(b-1),p=h.getX(f),m=ta(this,e,qs,c,v,p);m&&t.push(m)}}else{const f=Math.max(0,a.start),b=Math.min(d.count,a.start+a.count);for(let v=f,p=b-1;v<p;v+=l){const m=ta(this,e,qs,c,v,v+1);m&&t.push(m)}if(this.isLineLoop){const v=ta(this,e,qs,c,b-1,f);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function ta(s,e,t,n,i,r){const a=s.geometry.attributes.position;if(Ta.fromBufferAttribute(a,i),Ea.fromBufferAttribute(a,r),t.distanceSqToSegment(Ta,Ea,wo,Oh)>n)return;wo.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(wo);if(!(c<e.near||c>e.far))return{distance:c,point:Oh.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:s}}const kh=new P,Bh=new P;class b_ extends Ua{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)kh.fromBufferAttribute(t,i),Bh.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+kh.distanceTo(Bh);e.setAttribute("lineDistance",new We(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class __ extends Ua{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class $c extends un{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new ue(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const zh=new Ge,Ac=new yr,na=new On,ia=new P;class xd extends _t{constructor(e=new gt,t=new $c){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),na.copy(n.boundingSphere),na.applyMatrix4(i),na.radius+=r,e.ray.intersectsSphere(na)===!1)return;zh.copy(i).invert(),Ac.copy(e.ray).applyMatrix4(zh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let b=d,v=f;b<v;b++){const p=l.getX(b);ia.fromBufferAttribute(u,p),Gh(ia,p,c,i,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let b=d,v=f;b<v;b++)ia.fromBufferAttribute(u,b),Gh(ia,b,c,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Gh(s,e,t,n,i,r,a){const o=Ac.distanceSqToPoint(s);if(o<t){const c=new P;Ac.closestPointToPoint(s,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class el extends Dt{constructor(e,t,n,i,r,a,o,c,l){super(e,t,n,i,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class kn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let i=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(i=Math.floor(o+(c-o)/2),l=n[i]-a,l<0)o=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===a)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),c=t||(a.isVector2?new q:new P);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new P,i=[],r=[],a=[],o=new P,c=new Ge;for(let f=0;f<=e;f++){const b=f/e;i[f]=this.getTangentAt(b,new P)}r[0]=new P,a[0]=new P;let l=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const b=Math.acos(Lt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,b))}a[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(Lt(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let b=1;b<=e;b++)r[b].applyMatrix4(c.makeRotationAxis(i[b],f*b)),a[b].crossVectors(i[b],r[b])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class tl extends kn{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new q){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class x_ extends tl{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function nl(){let s=0,e=0,t=0,n=0;function i(r,a,o,c){s=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){i(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let d=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,i(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+n*o}}}const sa=new P,So=new nl,To=new nl,Eo=new nl;class vd extends kn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new P){const n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=i[(o-1)%r]:(sa.subVectors(i[0],i[1]).add(i[0]),l=sa);const u=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(sa.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=sa),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let b=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),p=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),b<1e-4&&(b=v),p<1e-4&&(p=v),So.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,b,v,p),To.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,b,v,p),Eo.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,b,v,p)}else this.curveType==="catmullrom"&&(So.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),To.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Eo.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(So.calc(c),To.calc(c),Eo.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new P().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Hh(s,e,t,n,i){const r=(n-e)*.5,a=(i-t)*.5,o=s*s,c=s*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*s+t}function v_(s,e){const t=1-s;return t*t*e}function y_(s,e){return 2*(1-s)*s*e}function M_(s,e){return s*s*e}function rr(s,e,t,n){return v_(s,e)+y_(s,t)+M_(s,n)}function w_(s,e){const t=1-s;return t*t*t*e}function S_(s,e){const t=1-s;return 3*t*t*s*e}function T_(s,e){return 3*(1-s)*s*s*e}function E_(s,e){return s*s*s*e}function ar(s,e,t,n,i){return w_(s,e)+S_(s,t)+T_(s,n)+E_(s,i)}class yd extends kn{constructor(e=new q,t=new q,n=new q,i=new q){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new q){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ar(e,i.x,r.x,a.x,o.x),ar(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class A_ extends kn{constructor(e=new P,t=new P,n=new P,i=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new P){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ar(e,i.x,r.x,a.x,o.x),ar(e,i.y,r.y,a.y,o.y),ar(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Md extends kn{constructor(e=new q,t=new q){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new q){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new q){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class R_ extends kn{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class wd extends kn{constructor(e=new q,t=new q,n=new q){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new q){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(rr(e,i.x,r.x,a.x),rr(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Sd extends kn{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(rr(e,i.x,r.x,a.x),rr(e,i.y,r.y,a.y),rr(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Td extends kn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new q){const n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,c=i[a===0?a:a-1],l=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(Hh(o,c.x,l.x,h.x,u.x),Hh(o,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new q().fromArray(i))}return this}}var Aa=Object.freeze({__proto__:null,ArcCurve:x_,CatmullRomCurve3:vd,CubicBezierCurve:yd,CubicBezierCurve3:A_,EllipseCurve:tl,LineCurve:Md,LineCurve3:R_,QuadraticBezierCurve:wd,QuadraticBezierCurve3:Sd,SplineCurve:Td});class C_ extends kn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Aa[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new Aa[i.type]().fromJSON(i))}return this}}class Rc extends C_{constructor(e){super(),this.type="Path",this.currentPoint=new q,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Md(this.currentPoint.clone(),new q(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new wd(this.currentPoint.clone(),new q(e,t),new q(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){const o=new yd(this.currentPoint.clone(),new q(e,t),new q(n,i),new q(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Td(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,i,r,a,o,c),this}absellipse(e,t,n,i,r,a,o,c){const l=new tl(e,t,n,i,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Na extends gt{constructor(e=[new q(0,-.5),new q(.5,0),new q(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=Lt(i,0,Math.PI*2);const r=[],a=[],o=[],c=[],l=[],h=1/t,u=new P,d=new q,f=new P,b=new P,v=new P;let p=0,m=0;for(let g=0;g<=e.length-1;g++)switch(g){case 0:p=e[g+1].x-e[g].x,m=e[g+1].y-e[g].y,f.x=m*1,f.y=-p,f.z=m*0,v.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case e.length-1:c.push(v.x,v.y,v.z);break;default:p=e[g+1].x-e[g].x,m=e[g+1].y-e[g].y,f.x=m*1,f.y=-p,f.z=m*0,b.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),c.push(f.x,f.y,f.z),v.copy(b)}for(let g=0;g<=t;g++){const _=n+g*h*i,x=Math.sin(_),E=Math.cos(_);for(let w=0;w<=e.length-1;w++){u.x=e[w].x*x,u.y=e[w].y,u.z=e[w].x*E,a.push(u.x,u.y,u.z),d.x=g/t,d.y=w/(e.length-1),o.push(d.x,d.y);const A=c[3*w+0]*x,S=c[3*w+1],y=c[3*w+0]*E;l.push(A,S,y)}}for(let g=0;g<t;g++)for(let _=0;_<e.length-1;_++){const x=_+g*e.length,E=x,w=x+e.length,A=x+e.length+1,S=x+1;r.push(E,w,S),r.push(A,S,w)}this.setIndex(r),this.setAttribute("position",new We(a,3)),this.setAttribute("uv",new We(o,2)),this.setAttribute("normal",new We(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Na(e.points,e.segments,e.phiStart,e.phiLength)}}class Ss extends Na{constructor(e=1,t=1,n=4,i=8){const r=new Rc;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:i}}static fromJSON(e){return new Ss(e.radius,e.length,e.capSegments,e.radialSegments)}}class Fa extends gt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new P,h=new q;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){const f=n+u/t*i;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new We(a,3)),this.setAttribute("normal",new We(o,3)),this.setAttribute("uv",new We(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fa(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Fe extends gt{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let b=0;const v=[],p=n/2;let m=0;g(),a===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new We(u,3)),this.setAttribute("normal",new We(d,3)),this.setAttribute("uv",new We(f,2));function g(){const x=new P,E=new P;let w=0;const A=(t-e)/n;for(let S=0;S<=r;S++){const y=[],M=S/r,C=M*(t-e)+e;for(let D=0;D<=i;D++){const U=D/i,N=U*c+o,G=Math.sin(N),O=Math.cos(N);E.x=C*G,E.y=-M*n+p,E.z=C*O,u.push(E.x,E.y,E.z),x.set(G,A,O).normalize(),d.push(x.x,x.y,x.z),f.push(U,1-M),y.push(b++)}v.push(y)}for(let S=0;S<i;S++)for(let y=0;y<r;y++){const M=v[y][S],C=v[y+1][S],D=v[y+1][S+1],U=v[y][S+1];(e>0||y!==0)&&(h.push(M,C,U),w+=3),(t>0||y!==r-1)&&(h.push(C,D,U),w+=3)}l.addGroup(m,w,0),m+=w}function _(x){const E=b,w=new q,A=new P;let S=0;const y=x===!0?e:t,M=x===!0?1:-1;for(let D=1;D<=i;D++)u.push(0,p*M,0),d.push(0,M,0),f.push(.5,.5),b++;const C=b;for(let D=0;D<=i;D++){const N=D/i*c+o,G=Math.cos(N),O=Math.sin(N);A.x=y*O,A.y=p*M,A.z=y*G,u.push(A.x,A.y,A.z),d.push(0,M,0),w.x=G*.5+.5,w.y=O*.5*M+.5,f.push(w.x,w.y),b++}for(let D=0;D<i;D++){const U=E+D,N=C+D;x===!0?h.push(N,N+1,U):h.push(N+1,N,U),S+=3}l.addGroup(m,S,x===!0?1:2),m+=S}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fe(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Un extends Fe{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Un(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Oa extends gt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),l(n),h(),this.setAttribute("position",new We(r,3)),this.setAttribute("normal",new We(r.slice(),3)),this.setAttribute("uv",new We(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(g){const _=new P,x=new P,E=new P;for(let w=0;w<t.length;w+=3)f(t[w+0],_),f(t[w+1],x),f(t[w+2],E),c(_,x,E,g)}function c(g,_,x,E){const w=E+1,A=[];for(let S=0;S<=w;S++){A[S]=[];const y=g.clone().lerp(x,S/w),M=_.clone().lerp(x,S/w),C=w-S;for(let D=0;D<=C;D++)D===0&&S===w?A[S][D]=y:A[S][D]=y.clone().lerp(M,D/C)}for(let S=0;S<w;S++)for(let y=0;y<2*(w-S)-1;y++){const M=Math.floor(y/2);y%2===0?(d(A[S][M+1]),d(A[S+1][M]),d(A[S][M])):(d(A[S][M+1]),d(A[S+1][M+1]),d(A[S+1][M]))}}function l(g){const _=new P;for(let x=0;x<r.length;x+=3)_.x=r[x+0],_.y=r[x+1],_.z=r[x+2],_.normalize().multiplyScalar(g),r[x+0]=_.x,r[x+1]=_.y,r[x+2]=_.z}function h(){const g=new P;for(let _=0;_<r.length;_+=3){g.x=r[_+0],g.y=r[_+1],g.z=r[_+2];const x=p(g)/2/Math.PI+.5,E=m(g)/Math.PI+.5;a.push(x,1-E)}b(),u()}function u(){for(let g=0;g<a.length;g+=6){const _=a[g+0],x=a[g+2],E=a[g+4],w=Math.max(_,x,E),A=Math.min(_,x,E);w>.9&&A<.1&&(_<.2&&(a[g+0]+=1),x<.2&&(a[g+2]+=1),E<.2&&(a[g+4]+=1))}}function d(g){r.push(g.x,g.y,g.z)}function f(g,_){const x=g*3;_.x=e[x+0],_.y=e[x+1],_.z=e[x+2]}function b(){const g=new P,_=new P,x=new P,E=new P,w=new q,A=new q,S=new q;for(let y=0,M=0;y<r.length;y+=9,M+=6){g.set(r[y+0],r[y+1],r[y+2]),_.set(r[y+3],r[y+4],r[y+5]),x.set(r[y+6],r[y+7],r[y+8]),w.set(a[M+0],a[M+1]),A.set(a[M+2],a[M+3]),S.set(a[M+4],a[M+5]),E.copy(g).add(_).add(x).divideScalar(3);const C=p(E);v(w,M+0,g,C),v(A,M+2,_,C),v(S,M+4,x,C)}}function v(g,_,x,E){E<0&&g.x===1&&(a[_]=g.x-1),x.x===0&&x.z===0&&(a[_]=E/2/Math.PI+.5)}function p(g){return Math.atan2(g.z,-g.x)}function m(g){return Math.atan2(-g.y,Math.sqrt(g.x*g.x+g.z*g.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Oa(e.vertices,e.indices,e.radius,e.details)}}class ka extends Oa{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ka(e.radius,e.detail)}}class Ba extends Rc{constructor(e){super(e),this.uuid=_n(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new Rc().fromJSON(i))}return this}}const P_={triangulate:function(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=Ed(s,0,i,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l,h,u,d,f;if(n&&(r=N_(s,e,r,t)),s.length>80*t){o=l=s[0],c=h=s[1];for(let b=t;b<i;b+=t)u=s[b],d=s[b+1],u<o&&(o=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);f=Math.max(l-o,h-c),f=f!==0?32767/f:0}return br(r,a,t,o,c,f,0),a}};function Ed(s,e,t,n,i){let r,a;if(i===X_(s,e,t,n)>0)for(r=e;r<t;r+=n)a=Vh(r,s[r],s[r+1],a);else for(r=t-n;r>=e;r-=n)a=Vh(r,s[r],s[r+1],a);return a&&za(a,a.next)&&(xr(a),a=a.next),a}function Fi(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(za(t,t.next)||Et(t.prev,t,t.next)===0)){if(xr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function br(s,e,t,n,i,r,a){if(!s)return;!a&&r&&z_(s,n,i,r);let o=s,c,l;for(;s.prev!==s.next;){if(c=s.prev,l=s.next,r?I_(s,n,i,r):L_(s)){e.push(c.i/t|0),e.push(s.i/t|0),e.push(l.i/t|0),xr(s),s=l.next,o=l.next;continue}if(s=l,s===o){a?a===1?(s=D_(Fi(s),e,t),br(s,e,t,n,i,r,2)):a===2&&U_(s,e,t,n,i,r):br(Fi(s),e,t,n,i,r,1);break}}}function L_(s){const e=s.prev,t=s,n=s.next;if(Et(e,t,n)>=0)return!1;const i=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,h=i<r?i<a?i:a:r<a?r:a,u=o<c?o<l?o:l:c<l?c:l,d=i>r?i>a?i:a:r>a?r:a,f=o>c?o>l?o:l:c>l?c:l;let b=n.next;for(;b!==e;){if(b.x>=h&&b.x<=d&&b.y>=u&&b.y<=f&&hs(i,o,r,c,a,l,b.x,b.y)&&Et(b.prev,b,b.next)>=0)return!1;b=b.next}return!0}function I_(s,e,t,n){const i=s.prev,r=s,a=s.next;if(Et(i,r,a)>=0)return!1;const o=i.x,c=r.x,l=a.x,h=i.y,u=r.y,d=a.y,f=o<c?o<l?o:l:c<l?c:l,b=h<u?h<d?h:d:u<d?u:d,v=o>c?o>l?o:l:c>l?c:l,p=h>u?h>d?h:d:u>d?u:d,m=Cc(f,b,e,t,n),g=Cc(v,p,e,t,n);let _=s.prevZ,x=s.nextZ;for(;_&&_.z>=m&&x&&x.z<=g;){if(_.x>=f&&_.x<=v&&_.y>=b&&_.y<=p&&_!==i&&_!==a&&hs(o,h,c,u,l,d,_.x,_.y)&&Et(_.prev,_,_.next)>=0||(_=_.prevZ,x.x>=f&&x.x<=v&&x.y>=b&&x.y<=p&&x!==i&&x!==a&&hs(o,h,c,u,l,d,x.x,x.y)&&Et(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;_&&_.z>=m;){if(_.x>=f&&_.x<=v&&_.y>=b&&_.y<=p&&_!==i&&_!==a&&hs(o,h,c,u,l,d,_.x,_.y)&&Et(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;x&&x.z<=g;){if(x.x>=f&&x.x<=v&&x.y>=b&&x.y<=p&&x!==i&&x!==a&&hs(o,h,c,u,l,d,x.x,x.y)&&Et(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function D_(s,e,t){let n=s;do{const i=n.prev,r=n.next.next;!za(i,r)&&Ad(i,n,n.next,r)&&_r(i,r)&&_r(r,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),xr(n),xr(n.next),n=s=r),n=n.next}while(n!==s);return Fi(n)}function U_(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&V_(a,o)){let c=Rd(a,o);a=Fi(a,a.next),c=Fi(c,c.next),br(a,e,t,n,i,r,0),br(c,e,t,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function N_(s,e,t,n){const i=[];let r,a,o,c,l;for(r=0,a=e.length;r<a;r++)o=e[r]*n,c=r<a-1?e[r+1]*n:s.length,l=Ed(s,o,c,n,!1),l===l.next&&(l.steiner=!0),i.push(H_(l));for(i.sort(F_),r=0;r<i.length;r++)t=O_(i[r],t);return t}function F_(s,e){return s.x-e.x}function O_(s,e){const t=k_(s,e);if(!t)return e;const n=Rd(t,s);return Fi(n,n.next),Fi(t,t.next)}function k_(s,e){let t=e,n=-1/0,i;const r=s.x,a=s.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){const d=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,i=t.x<t.next.x?t:t.next,d===r))return i}t=t.next}while(t!==e);if(!i)return null;const o=i,c=i.x,l=i.y;let h=1/0,u;t=i;do r>=t.x&&t.x>=c&&r!==t.x&&hs(a<l?r:n,a,c,l,a<l?n:r,a,t.x,t.y)&&(u=Math.abs(a-t.y)/(r-t.x),_r(t,s)&&(u<h||u===h&&(t.x>i.x||t.x===i.x&&B_(i,t)))&&(i=t,h=u)),t=t.next;while(t!==o);return i}function B_(s,e){return Et(s.prev,s,e.prev)<0&&Et(e.next,s,s.next)<0}function z_(s,e,t,n){let i=s;do i.z===0&&(i.z=Cc(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,G_(i)}function G_(s){let e,t,n,i,r,a,o,c,l=1;do{for(t=s,s=null,r=null,a=0;t;){for(a++,n=t,o=0,e=0;e<l&&(o++,n=n.nextZ,!!n);e++);for(c=l;o>0||c>0&&n;)o!==0&&(c===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,o--):(i=n,n=n.nextZ,c--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;t=n}r.nextZ=null,l*=2}while(a>1);return s}function Cc(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function H_(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function hs(s,e,t,n,i,r,a,o){return(i-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(i-a)*(n-o)}function V_(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!W_(s,e)&&(_r(s,e)&&_r(e,s)&&j_(s,e)&&(Et(s.prev,s,e.prev)||Et(s,e.prev,e))||za(s,e)&&Et(s.prev,s,s.next)>0&&Et(e.prev,e,e.next)>0)}function Et(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function za(s,e){return s.x===e.x&&s.y===e.y}function Ad(s,e,t,n){const i=aa(Et(s,e,t)),r=aa(Et(s,e,n)),a=aa(Et(t,n,s)),o=aa(Et(t,n,e));return!!(i!==r&&a!==o||i===0&&ra(s,t,e)||r===0&&ra(s,n,e)||a===0&&ra(t,s,n)||o===0&&ra(t,e,n))}function ra(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function aa(s){return s>0?1:s<0?-1:0}function W_(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&Ad(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function _r(s,e){return Et(s.prev,s,s.next)<0?Et(s,e,s.next)>=0&&Et(s,s.prev,e)>=0:Et(s,e,s.prev)<0||Et(s,s.next,e)<0}function j_(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function Rd(s,e){const t=new Pc(s.i,s.x,s.y),n=new Pc(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Vh(s,e,t,n){const i=new Pc(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function xr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Pc(s,e,t){this.i=s,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function X_(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class xi{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return xi.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];Wh(e),jh(n,e);let a=e.length;t.forEach(Wh);for(let c=0;c<t.length;c++)i.push(a),a+=t[c].length,jh(n,t[c]);const o=P_.triangulate(n,i);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function Wh(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function jh(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class il extends gt{constructor(e=new Ba([new q(.5,.5),new q(-.5,.5),new q(-.5,-.5),new q(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],r=[];for(let o=0,c=e.length;o<c;o++){const l=e[o];a(l)}this.setAttribute("position",new We(i,3)),this.setAttribute("uv",new We(r,2)),this.computeVertexNormals();function a(o){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,b=t.bevelSize!==void 0?t.bevelSize:f-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,g=t.UVGenerator!==void 0?t.UVGenerator:q_;let _,x=!1,E,w,A,S;m&&(_=m.getSpacedPoints(h),x=!0,d=!1,E=m.computeFrenetFrames(h,!1),w=new P,A=new P,S=new P),d||(p=0,f=0,b=0,v=0);const y=o.extractPoints(l);let M=y.shape;const C=y.holes;if(!xi.isClockWise(M)){M=M.reverse();for(let $=0,se=C.length;$<se;$++){const I=C[$];xi.isClockWise(I)&&(C[$]=I.reverse())}}const U=xi.triangulateShape(M,C),N=M;for(let $=0,se=C.length;$<se;$++){const I=C[$];M=M.concat(I)}function G($,se,I){return se||console.error("THREE.ExtrudeGeometry: vec does not exist"),$.clone().addScaledVector(se,I)}const O=M.length,Y=U.length;function H($,se,I){let Le,ne,ye;const he=$.x-se.x,Oe=$.y-se.y,xe=I.x-$.x,L=I.y-$.y,T=he*he+Oe*Oe,z=he*L-Oe*xe;if(Math.abs(z)>Number.EPSILON){const J=Math.sqrt(T),ee=Math.sqrt(xe*xe+L*L),Z=se.x-Oe/J,Ee=se.y+he/J,fe=I.x-L/ee,ve=I.y+xe/ee,Qe=((fe-Z)*L-(ve-Ee)*xe)/(he*L-Oe*xe);Le=Z+he*Qe-$.x,ne=Ee+Oe*Qe-$.y;const ie=Le*Le+ne*ne;if(ie<=2)return new q(Le,ne);ye=Math.sqrt(ie/2)}else{let J=!1;he>Number.EPSILON?xe>Number.EPSILON&&(J=!0):he<-Number.EPSILON?xe<-Number.EPSILON&&(J=!0):Math.sign(Oe)===Math.sign(L)&&(J=!0),J?(Le=-Oe,ne=he,ye=Math.sqrt(T)):(Le=he,ne=Oe,ye=Math.sqrt(T/2))}return new q(Le/ye,ne/ye)}const te=[];for(let $=0,se=N.length,I=se-1,Le=$+1;$<se;$++,I++,Le++)I===se&&(I=0),Le===se&&(Le=0),te[$]=H(N[$],N[I],N[Le]);const oe=[];let me,De=te.concat();for(let $=0,se=C.length;$<se;$++){const I=C[$];me=[];for(let Le=0,ne=I.length,ye=ne-1,he=Le+1;Le<ne;Le++,ye++,he++)ye===ne&&(ye=0),he===ne&&(he=0),me[Le]=H(I[Le],I[ye],I[he]);oe.push(me),De=De.concat(me)}for(let $=0;$<p;$++){const se=$/p,I=f*Math.cos(se*Math.PI/2),Le=b*Math.sin(se*Math.PI/2)+v;for(let ne=0,ye=N.length;ne<ye;ne++){const he=G(N[ne],te[ne],Le);ce(he.x,he.y,-I)}for(let ne=0,ye=C.length;ne<ye;ne++){const he=C[ne];me=oe[ne];for(let Oe=0,xe=he.length;Oe<xe;Oe++){const L=G(he[Oe],me[Oe],Le);ce(L.x,L.y,-I)}}}const Ye=b+v;for(let $=0;$<O;$++){const se=d?G(M[$],De[$],Ye):M[$];x?(A.copy(E.normals[0]).multiplyScalar(se.x),w.copy(E.binormals[0]).multiplyScalar(se.y),S.copy(_[0]).add(A).add(w),ce(S.x,S.y,S.z)):ce(se.x,se.y,0)}for(let $=1;$<=h;$++)for(let se=0;se<O;se++){const I=d?G(M[se],De[se],Ye):M[se];x?(A.copy(E.normals[$]).multiplyScalar(I.x),w.copy(E.binormals[$]).multiplyScalar(I.y),S.copy(_[$]).add(A).add(w),ce(S.x,S.y,S.z)):ce(I.x,I.y,u/h*$)}for(let $=p-1;$>=0;$--){const se=$/p,I=f*Math.cos(se*Math.PI/2),Le=b*Math.sin(se*Math.PI/2)+v;for(let ne=0,ye=N.length;ne<ye;ne++){const he=G(N[ne],te[ne],Le);ce(he.x,he.y,u+I)}for(let ne=0,ye=C.length;ne<ye;ne++){const he=C[ne];me=oe[ne];for(let Oe=0,xe=he.length;Oe<xe;Oe++){const L=G(he[Oe],me[Oe],Le);x?ce(L.x,L.y+_[h-1].y,_[h-1].x+I):ce(L.x,L.y,u+I)}}}K(),re();function K(){const $=i.length/3;if(d){let se=0,I=O*se;for(let Le=0;Le<Y;Le++){const ne=U[Le];Ue(ne[2]+I,ne[1]+I,ne[0]+I)}se=h+p*2,I=O*se;for(let Le=0;Le<Y;Le++){const ne=U[Le];Ue(ne[0]+I,ne[1]+I,ne[2]+I)}}else{for(let se=0;se<Y;se++){const I=U[se];Ue(I[2],I[1],I[0])}for(let se=0;se<Y;se++){const I=U[se];Ue(I[0]+O*h,I[1]+O*h,I[2]+O*h)}}n.addGroup($,i.length/3-$,0)}function re(){const $=i.length/3;let se=0;Te(N,se),se+=N.length;for(let I=0,Le=C.length;I<Le;I++){const ne=C[I];Te(ne,se),se+=ne.length}n.addGroup($,i.length/3-$,1)}function Te($,se){let I=$.length;for(;--I>=0;){const Le=I;let ne=I-1;ne<0&&(ne=$.length-1);for(let ye=0,he=h+p*2;ye<he;ye++){const Oe=O*ye,xe=O*(ye+1),L=se+Le+Oe,T=se+ne+Oe,z=se+ne+xe,J=se+Le+xe;He(L,T,z,J)}}}function ce($,se,I){c.push($),c.push(se),c.push(I)}function Ue($,se,I){Be($),Be(se),Be(I);const Le=i.length/3,ne=g.generateTopUV(n,i,Le-3,Le-2,Le-1);nt(ne[0]),nt(ne[1]),nt(ne[2])}function He($,se,I,Le){Be($),Be(se),Be(Le),Be(se),Be(I),Be(Le);const ne=i.length/3,ye=g.generateSideWallUV(n,i,ne-6,ne-3,ne-2,ne-1);nt(ye[0]),nt(ye[1]),nt(ye[3]),nt(ye[1]),nt(ye[2]),nt(ye[3])}function Be($){i.push(c[$*3+0]),i.push(c[$*3+1]),i.push(c[$*3+2])}function nt($){r.push($.x),r.push($.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Y_(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new Aa[i.type]().fromJSON(i)),new il(n,e.options)}}const q_={generateTopUV:function(s,e,t,n,i){const r=e[t*3],a=e[t*3+1],o=e[n*3],c=e[n*3+1],l=e[i*3],h=e[i*3+1];return[new q(r,a),new q(o,c),new q(l,h)]},generateSideWallUV:function(s,e,t,n,i,r){const a=e[t*3],o=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[i*3],f=e[i*3+1],b=e[i*3+2],v=e[r*3],p=e[r*3+1],m=e[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new q(a,1-c),new q(l,1-u),new q(d,1-b),new q(v,1-m)]:[new q(o,1-c),new q(h,1-u),new q(f,1-b),new q(p,1-m)]}};function Y_(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class sl extends gt{constructor(e=.5,t=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],c=[],l=[],h=[];let u=e;const d=(t-e)/i,f=new P,b=new q;for(let v=0;v<=i;v++){for(let p=0;p<=n;p++){const m=r+p/n*a;f.x=u*Math.cos(m),f.y=u*Math.sin(m),c.push(f.x,f.y,f.z),l.push(0,0,1),b.x=(f.x/t+1)/2,b.y=(f.y/t+1)/2,h.push(b.x,b.y)}u+=d}for(let v=0;v<i;v++){const p=v*(n+1);for(let m=0;m<n;m++){const g=m+p,_=g,x=g+n+1,E=g+n+2,w=g+1;o.push(_,x,w),o.push(x,E,w)}}this.setIndex(o),this.setAttribute("position",new We(c,3)),this.setAttribute("normal",new We(l,3)),this.setAttribute("uv",new We(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new sl(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class rl extends gt{constructor(e=new Ba([new q(0,.5),new q(-.5,-.5),new q(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],r=[],a=[];let o=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(o,c,h),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new We(i,3)),this.setAttribute("normal",new We(r,3)),this.setAttribute("uv",new We(a,2));function l(h){const u=i.length/3,d=h.extractPoints(t);let f=d.shape;const b=d.holes;xi.isClockWise(f)===!1&&(f=f.reverse());for(let p=0,m=b.length;p<m;p++){const g=b[p];xi.isClockWise(g)===!0&&(b[p]=g.reverse())}const v=xi.triangulateShape(f,b);for(let p=0,m=b.length;p<m;p++){const g=b[p];f=f.concat(g)}for(let p=0,m=f.length;p<m;p++){const g=f[p];i.push(g.x,g.y,0),r.push(0,0,1),a.push(g.x,g.y)}for(let p=0,m=v.length;p<m;p++){const g=v[p],_=g[0]+u,x=g[1]+u,E=g[2]+u;n.push(_,x,E),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return K_(t,e)}static fromJSON(e,t){const n=[];for(let i=0,r=e.shapes.length;i<r;i++){const a=t[e.shapes[i]];n.push(a)}return new rl(n,e.curveSegments)}}function K_(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,n=s.length;t<n;t++){const i=s[t];e.shapes.push(i.uuid)}else e.shapes.push(s.uuid);return e}class St extends gt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new P,d=new P,f=[],b=[],v=[],p=[];for(let m=0;m<=n;m++){const g=[],_=m/n;let x=0;m===0&&a===0?x=.5/t:m===n&&c===Math.PI&&(x=-.5/t);for(let E=0;E<=t;E++){const w=E/t;u.x=-e*Math.cos(i+w*r)*Math.sin(a+_*o),u.y=e*Math.cos(a+_*o),u.z=e*Math.sin(i+w*r)*Math.sin(a+_*o),b.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),p.push(w+x,1-_),g.push(l++)}h.push(g)}for(let m=0;m<n;m++)for(let g=0;g<t;g++){const _=h[m][g+1],x=h[m][g],E=h[m+1][g],w=h[m+1][g+1];(m!==0||a>0)&&f.push(_,x,w),(m!==n-1||c<Math.PI)&&f.push(x,E,w)}this.setIndex(f),this.setAttribute("position",new We(b,3)),this.setAttribute("normal",new We(v,3)),this.setAttribute("uv",new We(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new St(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class al extends Oa{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new al(e.radius,e.detail)}}class Ts extends gt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const a=[],o=[],c=[],l=[],h=new P,u=new P,d=new P;for(let f=0;f<=n;f++)for(let b=0;b<=i;b++){const v=b/i*r,p=f/n*Math.PI*2;u.x=(e+t*Math.cos(p))*Math.cos(v),u.y=(e+t*Math.cos(p))*Math.sin(v),u.z=t*Math.sin(p),o.push(u.x,u.y,u.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(b/i),l.push(f/n)}for(let f=1;f<=n;f++)for(let b=1;b<=i;b++){const v=(i+1)*f+b-1,p=(i+1)*(f-1)+b-1,m=(i+1)*(f-1)+b,g=(i+1)*f+b;a.push(v,p,g),a.push(p,m,g)}this.setIndex(a),this.setAttribute("position",new We(o,3)),this.setAttribute("normal",new We(c,3)),this.setAttribute("uv",new We(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ts(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class ol extends gt{constructor(e=new Sd(new P(-1,-1,0),new P(-1,1,0),new P(1,1,0)),t=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:r};const a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new P,c=new P,l=new q;let h=new P;const u=[],d=[],f=[],b=[];v(),this.setIndex(b),this.setAttribute("position",new We(u,3)),this.setAttribute("normal",new We(d,3)),this.setAttribute("uv",new We(f,2));function v(){for(let _=0;_<t;_++)p(_);p(r===!1?t:0),g(),m()}function p(_){h=e.getPointAt(_/t,h);const x=a.normals[_],E=a.binormals[_];for(let w=0;w<=i;w++){const A=w/i*Math.PI*2,S=Math.sin(A),y=-Math.cos(A);c.x=y*x.x+S*E.x,c.y=y*x.y+S*E.y,c.z=y*x.z+S*E.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+n*c.x,o.y=h.y+n*c.y,o.z=h.z+n*c.z,u.push(o.x,o.y,o.z)}}function m(){for(let _=1;_<=t;_++)for(let x=1;x<=i;x++){const E=(i+1)*(_-1)+(x-1),w=(i+1)*_+(x-1),A=(i+1)*_+x,S=(i+1)*(_-1)+x;b.push(E,w,S),b.push(w,A,S)}}function g(){for(let _=0;_<=t;_++)for(let x=0;x<=i;x++)l.x=_/t,l.y=x/i,f.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new ol(new Aa[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class J_ extends Jt{static get type(){return"RawShaderMaterial"}constructor(e){super(e),this.isRawShaderMaterial=!0}}class yt extends un{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Pa,this.normalScale=new q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Bn extends yt{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new q(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Lt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ue(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ue(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ue(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Z_ extends un{static get type(){return"MeshPhongMaterial"}constructor(e){super(),this.isMeshPhongMaterial=!0,this.color=new ue(16777215),this.specular=new ue(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Pa,this.normalScale=new q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.combine=Ra,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class It extends un{static get type(){return"MeshLambertMaterial"}constructor(e){super(),this.isMeshLambertMaterial=!0,this.color=new ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Pa,this.normalScale=new q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new dn,this.combine=Ra,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}function oa(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Q_(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function $_(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Xh(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let c=0;c!==e;++c)i[a++]=s[o+c]}return i}function Cd(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push.apply(t,a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)}class Mr{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class ex extends Mr{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Pl,endingEnd:Pl}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,a=e+1,o=i[r],c=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ll:r=e,o=2*t-n;break;case Il:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Ll:a=e,c=2*n-t;break;case Il:a=1,c=n+i[1]-i[0];break;default:a=e-1,c=t}const l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,b=(n-t)/(i-t),v=b*b,p=v*b,m=-d*p+2*d*v-d*b,g=(1+d)*p+(-1.5-2*d)*v+(-.5+d)*b+1,_=(-1-f)*p+(1.5+f)*v+.5*b,x=f*p-f*v;for(let E=0;E!==o;++E)r[E]=m*a[h+E]+g*a[l+E]+_*a[c+E]+x*a[u+E];return r}}class tx extends Mr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[l+d]*u+a[c+d]*h;return r}}class nx extends Mr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class zn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=oa(t,this.TimeBufferType),this.values=oa(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:oa(e.times,Array),values:oa(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new nx(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new tx(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ex(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ur:t=this.InterpolantFactoryMethodDiscrete;break;case dr:t=this.InterpolantFactoryMethodLinear;break;case ja:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ur;case this.InterpolantFactoryMethodLinear:return dr;case this.InterpolantFactoryMethodSmooth:return ja}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(i!==void 0&&Q_(i))for(let o=0,c=i.length;o!==c;++o){const l=i[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===ja,r=e.length-1;let a=1;for(let o=1;o<r;++o){let c=!1;const l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(i)c=!0;else{const u=o*n,d=u-n,f=u+n;for(let b=0;b!==n;++b){const v=t[u+b];if(v!==t[d+b]||v!==t[f+b]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];const u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}zn.prototype.TimeBufferType=Float32Array;zn.prototype.ValueBufferType=Float32Array;zn.prototype.DefaultInterpolation=dr;class Ds extends zn{constructor(e,t,n){super(e,t,n)}}Ds.prototype.ValueTypeName="bool";Ds.prototype.ValueBufferType=Array;Ds.prototype.DefaultInterpolation=ur;Ds.prototype.InterpolantFactoryMethodLinear=void 0;Ds.prototype.InterpolantFactoryMethodSmooth=void 0;class Pd extends zn{}Pd.prototype.ValueTypeName="color";class Es extends zn{}Es.prototype.ValueTypeName="number";class ix extends Mr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(i-t);let l=e*o;for(let h=l+o;l!==h;l+=4)Fn.slerpFlat(r,0,a,l-o,a,l,c);return r}}class As extends zn{InterpolantFactoryMethodLinear(e){return new ix(this.times,this.values,this.getValueSize(),e)}}As.prototype.ValueTypeName="quaternion";As.prototype.InterpolantFactoryMethodSmooth=void 0;class Us extends zn{constructor(e,t,n){super(e,t,n)}}Us.prototype.ValueTypeName="string";Us.prototype.ValueBufferType=Array;Us.prototype.DefaultInterpolation=ur;Us.prototype.InterpolantFactoryMethodLinear=void 0;Us.prototype.InterpolantFactoryMethodSmooth=void 0;class Rs extends zn{}Rs.prototype.ValueTypeName="vector";class sx{constructor(e="",t=-1,n=[],i=Mf){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=_n(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(ax(n[a]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,a=n.length;r!==a;++r)t.push(zn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,a=[];for(let o=0;o<r;o++){let c=[],l=[];c.push((o+r-1)%r,o,(o+1)%r),l.push(0,1,0);const h=$_(c);c=Xh(c,1,h),l=Xh(l,1,h),!i&&c[0]===0&&(c.push(r),l.push(l[0])),a.push(new Es(".morphTargetInfluences["+t[o].name+"]",c,l).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,c=e.length;o<c;o++){const l=e[o],h=l.name.match(r);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(l)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,f,b,v){if(f.length!==0){const p=[],m=[];Cd(f,p,m,b),p.length!==0&&v.push(new u(d,p,m))}},i=[],r=e.name||"default",a=e.fps||30,o=e.blendMode;let c=e.length||-1;const l=e.hierarchy||[];for(let u=0;u<l.length;u++){const d=l[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let b;for(b=0;b<d.length;b++)if(d[b].morphTargets)for(let v=0;v<d[b].morphTargets.length;v++)f[d[b].morphTargets[v]]=-1;for(const v in f){const p=[],m=[];for(let g=0;g!==d[b].morphTargets.length;++g){const _=d[b];p.push(_.time),m.push(_.morphTarget===v?1:0)}i.push(new Es(".morphTargetInfluence["+v+"]",p,m))}c=f.length*a}else{const f=".bones["+t[u].name+"]";n(Rs,f+".position",d,"pos",i),n(As,f+".quaternion",d,"rot",i),n(Rs,f+".scale",d,"scl",i)}}return i.length===0?null:new this(r,c,i,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function rx(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Es;case"vector":case"vector2":case"vector3":case"vector4":return Rs;case"color":return Pd;case"quaternion":return As;case"bool":case"boolean":return Ds;case"string":return Us}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function ax(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=rx(s.type);if(s.times===void 0){const t=[],n=[];Cd(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const gi={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class ox{constructor(e,t,n){const i=this;let r=!1,a=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){const u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){const f=l[u],b=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return b}return null}}}const cx=new ox;class Oi{constructor(e){this.manager=e!==void 0?e:cx,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Oi.DEFAULT_MATERIAL_NAME="__DEFAULT";const Yn={};class lx extends Error{constructor(e,t){super(e),this.response=t}}class cl extends Oi{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=gi.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Yn[e]!==void 0){Yn[e].push({onLoad:t,onProgress:n,onError:i});return}Yn[e]=[],Yn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,c=this.responseType;fetch(a).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=Yn[e],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=d?parseInt(d):0,b=f!==0;let v=0;const p=new ReadableStream({start(m){g();function g(){u.read().then(({done:_,value:x})=>{if(_)m.close();else{v+=x.byteLength;const E=new ProgressEvent("progress",{lengthComputable:b,loaded:v,total:f});for(let w=0,A=h.length;w<A;w++){const S=h[w];S.onProgress&&S.onProgress(E)}m.enqueue(x),g()}},_=>{m.error(_)})}}});return new Response(p)}else throw new lx(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return l.json();default:if(o===void 0)return l.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return l.arrayBuffer().then(b=>f.decode(b))}}}).then(l=>{gi.add(e,l);const h=Yn[e];delete Yn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(l)}}).catch(l=>{const h=Yn[e];if(h===void 0)throw this.manager.itemError(e),l;delete Yn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class hx extends Oi{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=gi.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;const o=fr("img");function c(){h(),gi.add(e,this),t&&t(this),r.manager.itemEnd(e)}function l(u){h(),i&&i(u),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}}class ux extends Oi{constructor(e){super(e)}load(e,t,n,i){const r=this,a=new Jc,o=new cl(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(c){let l;try{l=r.parse(c)}catch(h){if(i!==void 0)i(h);else{console.error(h);return}}l.image!==void 0?a.image=l.image:l.data!==void 0&&(a.image.width=l.width,a.image.height=l.height,a.image.data=l.data),a.wrapS=l.wrapS!==void 0?l.wrapS:Dn,a.wrapT=l.wrapT!==void 0?l.wrapT:Dn,a.magFilter=l.magFilter!==void 0?l.magFilter:kt,a.minFilter=l.minFilter!==void 0?l.minFilter:kt,a.anisotropy=l.anisotropy!==void 0?l.anisotropy:1,l.colorSpace!==void 0&&(a.colorSpace=l.colorSpace),l.flipY!==void 0&&(a.flipY=l.flipY),l.format!==void 0&&(a.format=l.format),l.type!==void 0&&(a.type=l.type),l.mipmaps!==void 0&&(a.mipmaps=l.mipmaps,a.minFilter=An),l.mipmapCount===1&&(a.minFilter=kt),l.generateMipmaps!==void 0&&(a.generateMipmaps=l.generateMipmaps),a.needsUpdate=!0,t&&t(a,l)},n,i),a}}class Nn extends Oi{constructor(e){super(e)}load(e,t,n,i){const r=new Dt,a=new hx(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class Ga extends _t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ue(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class qh extends Ga{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ue(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ao=new Ge,Yh=new P,Kh=new P;class ll{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new q(512,512),this.map=null,this.mapPass=null,this.matrix=new Ge,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Yc,this._frameExtents=new q(1,1),this._viewportCount=1,this._viewports=[new rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Yh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Yh),Kh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Kh),t.updateMatrixWorld(),Ao.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ao),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ao)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class dx extends ll{constructor(){super(new Kt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=Ms*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class fx extends Ga{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new dx}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Jh=new Ge,Ys=new P,Ro=new P;class px extends ll{constructor(){super(new Kt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new q(4,2),this._viewportCount=6,this._viewports=[new rt(2,1,1,1),new rt(0,1,1,1),new rt(3,1,1,1),new rt(1,1,1,1),new rt(3,0,1,1),new rt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ys.setFromMatrixPosition(e.matrixWorld),n.position.copy(Ys),Ro.copy(n.position),Ro.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Ro),n.updateMatrixWorld(),i.makeTranslation(-Ys.x,-Ys.y,-Ys.z),Jh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jh)}}class mx extends Ga{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new px}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class gx extends ll{constructor(){super(new Ia(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ld extends Ga{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(_t.DEFAULT_UP),this.updateMatrix(),this.target=new _t,this.shadow=new gx}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class or{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class bx extends Oi{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=gi.get(e);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(l=>{t&&t(l),r.manager.itemEnd(e)}).catch(l=>{i&&i(l)});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader;const c=fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return gi.add(e,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){i&&i(l),gi.remove(e),r.manager.itemError(e),r.manager.itemEnd(e)});gi.add(e,c),r.manager.itemStart(e)}}class _x{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Zh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Zh();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Zh(){return performance.now()}const hl="\\[\\]\\.:\\/",xx=new RegExp("["+hl+"]","g"),ul="[^"+hl+"]",vx="[^"+hl.replace("\\.","")+"]",yx=/((?:WC+[\/:])*)/.source.replace("WC",ul),Mx=/(WCOD+)?/.source.replace("WCOD",vx),wx=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",ul),Sx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",ul),Tx=new RegExp("^"+yx+Mx+wx+Sx+"$"),Ex=["material","materials","bones","map"];class Ax{constructor(e,t,n){const i=n||dt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class dt{constructor(e,t,n){this.path=t,this.parsedPath=n||dt.parseTrackName(t),this.node=dt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new dt.Composite(e,t,n):new dt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(xx,"")}static parseTrackName(e){const t=Tx.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);Ex.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const c=n(o.children);if(c)return c}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=dt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const a=e[i];if(a===void 0){const l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}dt.Composite=Ax;dt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};dt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};dt.prototype.GetterByBindingType=[dt.prototype._getValue_direct,dt.prototype._getValue_array,dt.prototype._getValue_arrayElement,dt.prototype._getValue_toArray];dt.prototype.SetterByBindingTypeAndVersioning=[[dt.prototype._setValue_direct,dt.prototype._setValue_direct_setNeedsUpdate,dt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_array,dt.prototype._setValue_array_setNeedsUpdate,dt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_arrayElement,dt.prototype._setValue_arrayElement_setNeedsUpdate,dt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_fromArray,dt.prototype._setValue_fromArray_setNeedsUpdate,dt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const Qh=new Ge;class Rx{constructor(e,t,n=0,i=1/0){this.ray=new yr(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new qc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Qh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Qh),this}intersectObject(e,t=!0,n=[]){return Lc(e,this,n,t),n.sort($h),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Lc(e[i],this,n,t);return n.sort($h),n}}function $h(s,e){return s.distance-e.distance}function Lc(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)Lc(r[a],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Oc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Oc);function cr(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,c=new gt;let l=0;for(let h=0;h<s.length;++h){const u=s[h];let d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(t){let h=0;const u=[];for(let d=0;d<s.length;++d){const f=s[d].index;for(let b=0;b<f.count;++b)u.push(f.getX(b)+h);h+=s[d].attributes.position.count}c.setIndex(u)}for(const h in r){const u=eu(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let v=0;v<a[h].length;++v)f.push(a[h][v][d]);const b=eu(f);if(!b)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(b)}}return c}function eu(s){let e,t,n,i=-1,r=0;for(let l=0;l<s.length;++l){const h=s[l];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}const a=new e(r),o=new mt(a,t,n);let c=0;for(let l=0;l<s.length;++l){const h=s[l];if(h.isInterleavedBufferAttribute){const u=c/t;for(let d=0,f=h.count;d<f;d++)for(let b=0;b<t;b++){const v=h.getComponent(d,b);o.setComponent(d+u,b,v)}}else a.set(h.array,c);c+=h.count*t}return i!==void 0&&(o.gpuType=i),o}function tu(s,e){if(e===wf)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===wc||e===$u){let t=s.getIndex();if(t===null){const a=[],o=s.getAttribute("position");if(o!==void 0){for(let c=0;c<o.count;c++)a.push(c);s.setIndex(a),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const n=t.count-2,i=[];if(e===wc)for(let a=1;a<=n;a++)i.push(t.getX(0)),i.push(t.getX(a)),i.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(i.push(t.getX(a)),i.push(t.getX(a+1)),i.push(t.getX(a+2))):(i.push(t.getX(a+2)),i.push(t.getX(a+1)),i.push(t.getX(a)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}const ft={x0:1682,y0:642,step:4,cols:540,rows:500,off:-5},Kn=[[2477,1305],[2520,1300],[2560,1420],[2655,1560],[2560,1915],[2477,1905]],Cx=[[2292,2428],[3655,1700],[2700,1150]],ca=[2300,1980],Px=[[2425,1360,"us"],[2425,1420,"pr"],[2425,1480,"burgundy"]];let Lx=null;function Ix(){return Lx??(Lx=fetch(zt("assets/maps/morro/fort3d.dat")).then(s=>{if(!s.ok)throw new Error("fort3d "+s.status);return s.arrayBuffer()}).then(async s=>{const e=new Uint8Array(s),n=e[0]===31&&e[1]===139?await new Response(new Blob([s]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer():s,i=ft.cols*ft.rows,r=new Uint16Array(n,0,i),a=new Float32Array(i);for(let o=0;o<i;o++)a[o]=r[o]/100+ft.off;return{h:a,cls:new Uint8Array(n,i*2,i)}}))}function us(s,e,t){const n=(e-ft.x0)/ft.step,i=(t-ft.y0)/ft.step;if(n<0||i<0||n>ft.cols-1.001||i>ft.rows-1.001)return null;const r=n|0,a=i|0,o=n-r,c=i-a,l=ft.cols,h=s.h;return(h[a*l+r]*(1-o)+h[a*l+r+1]*o)*(1-c)+(h[(a+1)*l+r]*(1-o)+h[(a+1)*l+r+1]*o)*c}function Co(s,e,t,n){let i=-99,r=e,a=t;for(let o=-n;o<=n;o+=2)for(let c=-n;c<=n;c+=2){const l=us(s,e+c,t+o);l!=null&&l>i&&(i=l,r=e+c,a=t+o)}return{h:i,x:r,y:a}}function dl(s,e,t,n=!0){const i=document.createElement("canvas");i.width=s,i.height=e,t(i.getContext("2d"));const r=new el(i);return r.colorSpace=pt,r.anisotropy=4,n&&(r.wrapS=r.wrapT=vn),r}function Dx(){return dl(256,256,s=>{const e=s.createImageData(256,256),t=e.data;let n=9;const i=()=>(n=n*16807%2147483647)/2147483647,r=Array.from({length:256},()=>0);for(let o=0;o<46;o++){const c=Math.floor(i()*256),l=1+Math.floor(i()*7),h=.25+i()*.75;for(let u=-l;u<=l;u++)r[(c+u+256)%256]=Math.max(r[(c+u+256)%256],h*(1-Math.abs(u)/(l+1)))}const a=Array.from({length:22},()=>[i()*256,i()*256,10+i()*34]);for(let o=0;o<256;o++)for(let c=0;c<256;c++){const l=(o*256+c)*4,h=.55+.45*Math.sin(o/256*Math.PI*2+r[c]*3);let u=0;for(const[d,f,b]of a){const v=Math.min(Math.abs(c-d),256-Math.abs(c-d)),p=Math.min(Math.abs(o-f),256-Math.abs(o-f));u=Math.max(u,1-Math.hypot(v,p*1.4)/b)}t[l]=Math.min(255,r[c]*h*255),t[l+1]=Math.min(255,Math.max(0,u*2-.35)*255),t[l+2]=128+(i()-.5)*60,t[l+3]=255}s.putImageData(e,0,0)})}function Ux(){return dl(256,400,s=>{s.fillStyle="#e2ad3e",s.fillRect(0,0,256,400);const e=s.createLinearGradient(0,0,0,400);e.addColorStop(0,"rgba(255,240,200,0.12)"),e.addColorStop(1,"rgba(80,50,10,0.18)"),s.fillStyle=e,s.fillRect(0,0,256,400),s.fillStyle="#f4efe2",s.fillRect(0,18,256,16),s.fillRect(0,0,256,6),s.fillRect(0,34,26,366),s.fillRect(230,34,26,366),s.fillRect(0,384,256,16);const t=128,n=150,i=78;s.beginPath(),s.moveTo(t-i-14,400),s.lineTo(t-i-14,n),s.arc(t,n,i+14,Math.PI,0),s.lineTo(t+i+14,400),s.closePath(),s.fill();const r=s.createLinearGradient(0,n-i,0,400);r.addColorStop(0,"#1d1814"),r.addColorStop(.5,"#2c241d"),r.addColorStop(1,"#3a3027"),s.fillStyle=r,s.beginPath(),s.moveTo(t-i,400),s.lineTo(t-i,n),s.arc(t,n,i,Math.PI,0),s.lineTo(t+i,400),s.closePath(),s.fill(),s.fillStyle="rgba(240,235,220,0.18)",s.beginPath(),s.arc(t,n+40,i*.8,Math.PI,0),s.fill(),s.fillStyle="#5a3a22",s.fillRect(t-34,250,68,134),s.fillStyle="#3d2716";for(let a=0;a<5;a++)s.fillRect(t-32+a*14,252,3,130)})}function Nx(s){return dl(192,120,e=>{if(s==="pr"){for(let t=0;t<5;t++)e.fillStyle=t%2?"#ffffff":"#e8262f",e.fillRect(0,t*24,192,24);e.fillStyle="#2a64b4",e.beginPath(),e.moveTo(0,0),e.lineTo(104,60),e.lineTo(0,120),e.closePath(),e.fill(),e.fillStyle="#fff",Fx(e,34,60,16)}else if(s==="us"){for(let t=0;t<13;t++)e.fillStyle=t%2?"#ffffff":"#c8242f",e.fillRect(0,t*120/13,192,120/13+1);e.fillStyle="#25336e",e.fillRect(0,0,80,65),e.fillStyle="#fff";for(let t=0;t<5;t++)for(let n=0;n<6;n++)e.fillRect(6+n*12+t%2*6,6+t*12,3,3)}else e.fillStyle="#f6f2e6",e.fillRect(0,0,192,120),e.strokeStyle="#c0242c",e.lineWidth=16,e.lineCap="round",e.beginPath(),e.moveTo(30,12),e.lineTo(162,108),e.moveTo(162,12),e.lineTo(30,108),e.stroke()},!1)}function Fx(s,e,t,n){s.beginPath();for(let i=0;i<10;i++){const r=-Math.PI/2+i*Math.PI/5,a=i%2?n*.42:n;s.lineTo(e+Math.cos(r)*a,t+Math.sin(r)*a)}s.closePath(),s.fill()}function Ox(s,e,t,n,i,r,a){const o=Math.floor((ft.cols-1)/r)+1,c=Math.floor((ft.rows-1)/r)+1,l=new Float32Array(o*c*3),h=new Float32Array(o*c*2),u=new Float32Array(o*c);for(let g=0;g<c;g++)for(let _=0;_<o;_++){const x=Math.min(ft.cols-1,_*r),E=Math.min(ft.rows-1,g*r),w=g*o+_,A=E*ft.cols+x,S=ft.x0+x*ft.step,y=ft.y0+E*ft.step,M=g===0||_===0||g===c-1||_===o-1;l[w*3]=S*t,l[w*3+1]=s.h[A]-(M?1.5:0),l[w*3+2]=y*t,h[w*2]=S/n,h[w*2+1]=1-y/i,u[w]=s.cls[A]}const d=new Float32Array(o*c*3),f=ft.step*r*t;for(let g=0;g<c;g++)for(let _=0;_<o;_++){const x=(y,M)=>l[(Math.max(0,Math.min(c-1,M))*o+Math.max(0,Math.min(o-1,y)))*3+1],E=(x(_-1,g)-x(_+1,g))/(2*f),w=(x(_,g-1)-x(_,g+1))/(2*f),A=Math.hypot(E,1,w),S=(g*o+_)*3;d[S]=E/A,d[S+1]=1/A,d[S+2]=w/A}const b=kx(a,e),v=64,p=new Ae;p.name="fort3d";let m=0;for(let g=0;g<c-1;g+=v-1)for(let _=0;_<o-1;_+=v-1){const x=Math.min(v,c-g),E=Math.min(v,o-_),w=new Float32Array(x*E*3),A=new Float32Array(x*E*3),S=new Float32Array(x*E*2),y=new Float32Array(x*E);for(let N=0;N<x;N++)for(let G=0;G<E;G++){const O=(g+N)*o+(_+G),Y=N*E+G;w.set(l.subarray(O*3,O*3+3),Y*3),A.set(d.subarray(O*3,O*3+3),Y*3),S.set(h.subarray(O*2,O*2+2),Y*2),y[Y]=u[O]}const M=new Uint16Array((x-1)*(E-1)*6);let C=0;for(let N=0;N<x-1;N++)for(let G=0;G<E-1;G++){const O=N*E+G,Y=O+1,H=O+E,te=H+1;Math.abs(w[O*3+1]-w[te*3+1])<=Math.abs(w[Y*3+1]-w[H*3+1])?M.set([O,H,te,O,te,Y],C):M.set([O,H,Y,Y,H,te],C),C+=6}const D=new gt;D.setAttribute("position",new mt(w,3)),D.setAttribute("normal",new mt(A,3)),D.setAttribute("uv",new mt(S,2)),D.setAttribute("aCls",new mt(y,1)),D.setIndex(new mt(M,1)),D.computeBoundingSphere(),D.computeBoundingBox();const U=new j(D,b);U.receiveShadow=!0,U.castShadow=!0,U.name="fort3d_chunk",p.add(U),m+=M.length/3}return p.userData.verts=o*c,p.userData.tris=m,p.userData.chunks=p.children.length,p}function kx(s,e){s.map=e;const t=new Nn,n=t.load(zt("assets/tex/plaster.webp")),i=t.load(zt("assets/tex/lh_rock.webp"));for(const c of[n,i])c.wrapS=c.wrapT=vn,c.colorSpace=pt,c.anisotropy=4;const r=Dx();r.colorSpace=$n;const a=s.onBeforeCompile.bind(s),o=s.customProgramCacheKey.bind(s);return s.onBeforeCompile=(c,l)=>{a(c,l),c.uniforms.t_pl={value:n},c.uniforms.t_st={value:i},c.uniforms.t_gr={value:r},c.vertexShader=c.vertexShader.replace("#include <common>",`#include <common>
attribute float aCls; varying float vCls; varying vec3 vFN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vCls = aCls; vFN = normalize(mat3(modelMatrix) * objectNormal);`),c.fragmentShader=c.fragmentShader.replace("#include <common>",`#include <common>
varying float vCls; varying vec3 vFN; uniform sampler2D t_pl; uniform sampler2D t_st; uniform sampler2D t_gr;
`+Bx).replace(`diffuseColor.rgb *= mix(vec3(1.0), det, 0.9);
}`,`diffuseColor.rgb *= mix(vec3(1.0), det, 0.9);
}
{
  // t80: wall faces of the fort -> weathered ochre plaster / rubble stone with black mould streaks (El Morro ground photos)
  float wall = smoothstep(0.66, 0.36, vFN.y) * smoothstep(0.2, 0.8, vCls);
  if (wall > 0.001) {
    vec3 n = normalize(vFN); vec2 w = abs(n.xz) + 0.001; w /= (w.x + w.y);
    vec3 c = wallCol(vec2(vGW.z, vGW.y)) * w.x + wallCol(vec2(vGW.x, vGW.y)) * w.y;
    c *= 0.8 + 0.2 * smoothstep(-2.0, 6.0, vGW.y);           // damp, darker foot of the wall
    diffuseColor.rgb = mix(diffuseColor.rgb, c, wall);
  }
}`)},s.customProgramCacheKey=()=>o()+"|fort80",s.needsUpdate=!0,s}const Bx=`
vec3 wallCol(vec2 p) {
  vec3 pl = texture2D(t_pl, p / 2.4).rgb, st = texture2D(t_st, p / 2.8).rgb;
  vec4 gm = texture2D(t_gr, p / vec2(7.0, 9.0)); float big = texture2D(t_gr, p / 31.0 + 0.37).b;
  float pll = dot(pl, vec3(0.2126, 0.7152, 0.0722)), stl = dot(st, vec3(0.2126, 0.7152, 0.0722));
  vec3 ochre = vec3(0.46, 0.34, 0.18) * (0.7 + pll * 1.2) * (0.8 + big * 0.35);           // lime plaster, ochre wash
  float course = smoothstep(0.0, 0.07, fract(p.y / 0.46)) * smoothstep(1.0, 0.93, fract(p.y / 0.46));
  float joint = smoothstep(0.0, 0.05, fract(p.x / 0.9 + floor(p.y / 0.46) * 0.5));
  vec3 stone = vec3(0.34, 0.31, 0.26) * (0.55 + stl * 2.2) * mix(0.62, 1.0, course * joint); // rubble / ashlar where plaster fell off
  float bare = clamp(gm.g * 1.3 + (0.55 - big) * 0.9, 0.0, 1.0);
  vec3 c = mix(ochre, stone, clamp(bare * 0.95 + 0.12, 0.0, 1.0));
  return c * (1.0 - gm.r * 0.82) * (0.86 + 0.14 * big);                                                           // vertical black mould streaks
}`,zx=()=>new yt({color:14262858,roughness:.95,metalness:0});function Gx(){const s=new Ae,e=zx(),t=new Tt({color:1512206}),n=new yt({color:15326400,roughness:.9}),i=new Na([new q(.05,-1.7),new q(.35,-1.55),new q(.62,-1.15),new q(.82,-.6),new q(.98,-.1),new q(1.02,0)],18),r=new Fe(.9,.95,2.3,18),a=new Fe(1.05,1.05,.14,18),o=new St(.98,18,8,0,Math.PI*2,0,Math.PI/2),c=(h,u,d,f=1)=>{const b=new j(h,u);return b.position.y=d,b.scale.y=f,b.castShadow=!0,b.receiveShadow=!0,s.add(b),b};c(i,e,0),c(a,n,.05),c(r,e,1.2),c(a,n,2.38),c(o,e,2.42,.8),c(new Fe(.06,.12,.45,8),n,3.4),c(new St(.11,8,6),n,3.66);for(const h of[-1.2,0,1.2]){const u=new j(new Se(.1,.55,.06),t);u.position.set(Math.sin(h)*.93,1.6,Math.cos(h)*.93),u.rotation.y=h,s.add(u)}const l=new j(new Yt(.6,1.5),t);return l.position.set(0,.85,-.955),l.rotation.y=Math.PI,s.add(l),s.userData.garita=!0,s}function Hx(){const s=new Ae,e=new yt({color:13223354,roughness:.9}),t=new yt({color:15855334,roughness:.85}),n=new yt({color:1776927,roughness:.5,metalness:.4}),i=new yt({color:16773560,emissive:16766842,emissiveIntensity:.6,roughness:.2}),r=(a,o,c,l,h)=>{const u=new j(a,o);return u.position.set(c,l,h),u.castShadow=u.receiveShadow=!0,s.add(u),u};r(new Se(5.6,3.2,5.6),e,0,1.6,0),r(new Se(5.9,.3,5.9),t,0,3.3,0),r(new Fe(1.75,2.25,10,4,1).rotateY(Math.PI/4),e,0,8.4,0);for(const[a,o]of[[1,1],[1,-1],[-1,1],[-1,-1]])r(new Se(.35,10,.35),t,a*1.45,8.4,o*1.45);for(let a=0;a<3;a++)r(new Se(.45,.9,.08),n,0,5.5+a*2.8,2.02-a*.1);r(new Se(4.2,.35,4.2),t,0,13.55,0),r(new Fe(2.2,2.2,.18,16),n,0,13.85,0),r(new Fe(2.15,2.15,.9,16,1,!0),new yt({color:1776927,wireframe:!0}),0,14.4,0),r(new Fe(1,1,1.7,8),i,0,14.8,0);for(let a=0;a<8;a++){const o=a/8*Math.PI*2;r(new Se(.07,1.7,.07),n,Math.cos(o)*1.02,14.8,Math.sin(o)*1.02)}return r(new Un(1.2,.9,8),n,0,16.1,0),r(new St(.16,8,6),n,0,16.6,0),s.userData.lighthouse=!0,s}function Vx(s,e){const t=new Ae,n=new j(new Fe(.05,.08,11,8),new yt({color:14605267,roughness:.6,metalness:.3}));n.position.y=5.5,n.castShadow=!0,t.add(n);const i=new Yt(2.4,1.5,12,1);i.translate(1.2,0,0);const r=new j(i,new yt({map:Nx(s),side:Rt,roughness:.9}));return r.position.y=10.1,r.userData.wave=e,t.add(r),t.userData.flag=r,t}function Wx(s,e,t){const n=new Ae;n.name="morro_set";const i=[...t,...Cx];let r=0;for(const[b,v]of i){const p=Co(s,b,v,90);if(p.h<-50)continue;let m=0,g=0;for(let M=0;M<24;M++){const C=Math.cos(M/24*Math.PI*2),D=Math.sin(M/24*Math.PI*2),U=us(s,p.x+C*80,p.y+D*80);U!=null&&(m-=C*(U-p.h),g-=D*(U-p.h))}const _=Math.atan2(g,m),x=Math.cos(_),E=Math.sin(_);let w=p.x,A=p.y,S=p.h;for(let M=0;M<120;M+=2){const C=us(s,p.x+x*M,p.y+E*M);if(C==null||C<p.h-2.5)break;w=p.x+x*M,A=p.y+E*M,S=Math.max(S-.05,C)}const y=Gx();y.position.set((w+x*4)*e,S+.1,(A+E*4)*e),y.rotation.y=Math.atan2(x,E),n.add(y),r++}{const b=Co(s,ca[0],ca[1],12),v=Hx();v.position.set(ca[0]*e,b.h-.3,ca[1]*e),v.rotation.y=.21,n.add(v)}const a=Ux();let o=0;const c=Kn.reduce((b,v)=>b+v[0],0)/Kn.length,l=Kn.reduce((b,v)=>b+v[1],0)/Kn.length,h=us(s,c,l)??0;for(let b=0;b<Kn.length;b++){const[v,p]=Kn[b],[m,g]=Kn[(b+1)%Kn.length],_=Math.hypot(m-v,g-p)*e;if(_<3)continue;const x=g-p,E=-(m-v),w=Math.hypot(x,E),A=x/w,S=E/w,y=(c-v)*A+(l-p)*S>0?-1:1,M=[];for(let Y=1;Y<6;Y++){const H=Y/6,te=us(s,v+(m-v)*H+A*y*40,p+(g-p)*H+S*y*40);te!=null&&M.push(te)}M.sort((Y,H)=>Y-H);const C=M.length?M[M.length>>1]:h+6,D=Math.max(4.5,Math.min(11,C-h+.4)),U=a.clone();U.needsUpdate=!0,U.repeat.set(Math.max(1,Math.round(_/4.5)),1);const N=new j(new Yt(_,D),new yt({map:U,roughness:.92})),G=(v+m)/2+A*y*-5,O=(p+g)/2+S*y*-5;N.position.set(G*e,h-.2+D/2,O*e),N.rotation.y=Math.atan2(-(A*-y),-(S*-y))+Math.PI,N.receiveShadow=!0,N.userData.arcade=!0,n.add(N),o++}{const b=new Ba(Kn.map(([g,_])=>new q(g*e,_*e))),v=new rl(b).rotateX(Math.PI/2),p=new j(v,new yt({color:10259314,roughness:1,side:Rt}));p.position.y=h+.05,p.receiveShadow=!0,p.name="plaza_floor",n.add(p);const m=new j(new Fe(1.1,1.2,.9,16),new yt({color:15129803,roughness:.9}));m.position.set(2508*e,h+.45,1645*e),m.castShadow=!0,n.add(m)}const u=[];Px.forEach(([b,v,p],m)=>{const g=Co(s,b,v,10),_=Vx(p,m*1.3);_.position.set(g.x*e,g.h,g.y*e),n.add(_),u.push(_.userData.flag)});let d=0;return{group:n,garitas:r,arcades:o,update:b=>{d+=b;for(const v of u){const p=v.geometry.attributes.position;for(let m=0;m<p.count;m++){const g=p.getX(m);p.setZ(m,Math.sin(g*2.2-d*5+v.userData.wave)*.12*(g/2.4))}p.needsUpdate=!0}}}}class Ha extends Oi{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Kx(t)}),this.register(function(t){return new Jx(t)}),this.register(function(t){return new rv(t)}),this.register(function(t){return new av(t)}),this.register(function(t){return new ov(t)}),this.register(function(t){return new Qx(t)}),this.register(function(t){return new $x(t)}),this.register(function(t){return new ev(t)}),this.register(function(t){return new tv(t)}),this.register(function(t){return new Yx(t)}),this.register(function(t){return new nv(t)}),this.register(function(t){return new Zx(t)}),this.register(function(t){return new sv(t)}),this.register(function(t){return new iv(t)}),this.register(function(t){return new Xx(t)}),this.register(function(t){return new cv(t)}),this.register(function(t){return new lv(t)})}load(e,t,n,i){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const l=or.extractUrlBase(e);a=or.resolveURL(l,this.path)}else a=or.extractUrlBase(e);this.manager.itemStart(e);const o=function(l){i?i(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new cl(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r;const a={},o={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===Id){try{a[Ze.KHR_BINARY_GLTF]=new hv(e)}catch(u){i&&i(u);return}r=JSON.parse(a[Ze.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new wv(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case Ze.KHR_MATERIALS_UNLIT:a[u]=new qx;break;case Ze.KHR_DRACO_MESH_COMPRESSION:a[u]=new uv(r,this.dracoLoader);break;case Ze.KHR_TEXTURE_TRANSFORM:a[u]=new dv;break;case Ze.KHR_MESH_QUANTIZATION:a[u]=new fv;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(a),l.setPlugins(o),l.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}}function jx(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}const Ze={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Xx{constructor(e){this.parser=e,this.name=Ze.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let l;const h=new ue(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],jt);const u=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new Ld(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new mx(h),l.distance=u;break;case"spot":l=new fx(h),l.distance=u,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),l.decay=2,Zn(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),i=Promise.resolve(l),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(c){return n._getNodeRef(t.cache,o,c)})}}class qx{constructor(){this.name=Ze.KHR_MATERIALS_UNLIT}getMaterialType(){return Tt}extendParams(e,t,n){const i=[];e.color=new ue(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],jt),e.opacity=a[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,pt))}return Promise.all(i)}}class Yx{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}}class Kx{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){const o=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new q(o,o)}return Promise.all(r)}}class Jx{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bn}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}}class Zx{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",a.iridescenceThicknessTexture)),Promise.all(r)}}class Qx{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[];t.sheenColor=new ue(0,0,0),t.sheenRoughness=0,t.sheen=1;const a=i.extensions[this.name];if(a.sheenColorFactor!==void 0){const o=a.sheenColorFactor;t.sheenColor.setRGB(o[0],o[1],o[2],jt)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",a.sheenColorTexture,pt)),a.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",a.sheenRoughnessTexture)),Promise.all(r)}}class $x{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",a.transmissionTexture)),Promise.all(r)}}class ev{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];t.thickness=a.thicknessFactor!==void 0?a.thicknessFactor:0,a.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;const o=a.attenuationColor||[1,1,1];return t.attenuationColor=new ue().setRGB(o[0],o[1],o[2],jt),Promise.all(r)}}class tv{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bn}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}}class nv{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];t.specularIntensity=a.specularFactor!==void 0?a.specularFactor:1,a.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",a.specularTexture));const o=a.specularColorFactor||[1,1,1];return t.specularColor=new ue().setRGB(o[0],o[1],o[2],jt),a.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",a.specularColorTexture,pt)),Promise.all(r)}}class iv{constructor(e){this.parser=e,this.name=Ze.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return t.bumpScale=a.bumpFactor!==void 0?a.bumpFactor:1,a.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",a.bumpTexture)),Promise.all(r)}}class sv{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Bn}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",a.anisotropyTexture)),Promise.all(r)}}class rv{constructor(e){this.parser=e,this.name=Ze.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const r=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class av{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(e,a.source,c);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class ov{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(e,a.source,c);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class cv{constructor(e){this.name=Ze.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const c=i.byteOffset||0,l=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(o,c,l);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}}class lv{constructor(e){this.name=Ze.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const l of i.primitives)if(l.mode!==mn.TRIANGLES&&l.mode!==mn.TRIANGLE_STRIP&&l.mode!==mn.TRIANGLE_FAN&&l.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],c={};for(const l in a)o.push(this.parser.getDependency("accessor",a[l]).then(h=>(c[l]=h,c[l])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(l=>{const h=l.pop(),u=h.isGroup?h.children:[h],d=l[0].count,f=[];for(const b of u){const v=new Ge,p=new P,m=new Fn,g=new P(1,1,1),_=new en(b.geometry,b.material,d);for(let x=0;x<d;x++)c.TRANSLATION&&p.fromBufferAttribute(c.TRANSLATION,x),c.ROTATION&&m.fromBufferAttribute(c.ROTATION,x),c.SCALE&&g.fromBufferAttribute(c.SCALE,x),_.setMatrixAt(x,v.compose(p,m,g));for(const x in c)if(x==="_COLOR_0"){const E=c[x];_.instanceColor=new Ui(E.array,E.itemSize,E.normalized)}else x!=="TRANSLATION"&&x!=="ROTATION"&&x!=="SCALE"&&b.geometry.setAttribute(x,c[x]);_t.prototype.copy.call(_,b),this.parser.assignFinalMaterial(_),f.push(_)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const Id="glTF",Ks=12,nu={JSON:1313821514,BIN:5130562};class hv{constructor(e){this.name=Ze.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,Ks),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Id)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-Ks,r=new DataView(e,Ks);let a=0;for(;a<i;){const o=r.getUint32(a,!0);a+=4;const c=r.getUint32(a,!0);if(a+=4,c===nu.JSON){const l=new Uint8Array(e,Ks+a,o);this.content=n.decode(l)}else if(c===nu.BIN){const l=Ks+a;this.body=e.slice(l,l+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class uv{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ze.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},c={},l={};for(const h in a){const u=Ic[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=Ic[h]||h.toLowerCase();if(a[h]!==void 0){const d=n.accessors[e.attributes[h]],f=ms[d.componentType];l[u]=f.name,c[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(const b in f.attributes){const v=f.attributes[b],p=c[b];p!==void 0&&(v.normalized=p)}u(f)},o,l,jt,d)})})}}class dv{constructor(){this.name=Ze.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class fv{constructor(){this.name=Ze.KHR_MESH_QUANTIZATION}}class Dd extends Mr{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=o*2,l=o*3,h=i-t,u=(n-t)/h,d=u*u,f=d*u,b=e*l,v=b-l,p=-2*f+3*d,m=f-d,g=1-p,_=m-d+u;for(let x=0;x!==o;x++){const E=a[v+x+o],w=a[v+x+c]*h,A=a[b+x+o],S=a[b+x]*h;r[x]=g*E+_*w+p*A+m*S}return r}}const pv=new Fn;class mv extends Dd{interpolate_(e,t,n,i){const r=super.interpolate_(e,t,n,i);return pv.fromArray(r).normalize().toArray(r),r}}const mn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},ms={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},iu={9728:Qt,9729:kt,9984:Vu,9985:fa,9986:$s,9987:An},su={33071:Dn,33648:Ma,10497:vn},Po={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Ic={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},pi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},gv={CUBICSPLINE:void 0,LINEAR:dr,STEP:ur},Lo={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function bv(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new yt({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:si})),s.DefaultMaterial}function Ai(s,e,t){for(const n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Zn(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function _v(s,e,t){let n=!1,i=!1,r=!1;for(let l=0,h=e.length;l<h;l++){const u=e[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);const a=[],o=[],c=[];for(let l=0,h=e.length;l<h;l++){const u=e[l];if(n){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):s.attributes.position;a.push(d)}if(i){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):s.attributes.normal;o.push(d)}if(r){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):s.attributes.color;c.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c)]).then(function(l){const h=l[0],u=l[1],d=l[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=d),s.morphTargetsRelative=!0,s})}function xv(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function vv(s){let e;const t=s.extensions&&s.extensions[Ze.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Io(t.attributes):e=s.indices+":"+Io(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+Io(s.targets[n]);return e}function Io(s){let e="";const t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function Dc(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function yv(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const Mv=new Ge;class wv{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new jx,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,a=-1;if(typeof navigator<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const c=o.match(/Version\/(\d+)/);i=n&&c?parseInt(c[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&a<98?this.textureLoader=new Nn(this.options.manager):this.textureLoader=new bx(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new cl(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return Ai(r,o,i),Zn(o,i),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(o)})).then(function(){for(const c of o.scenes)c.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){const a=t[i].joints;for(let o=0,c=a.length;o<c;o++)e[a[o]].isBone=!0}for(let i=0,r=e.length;i<r;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),r=(a,o)=>{const c=this.associations.get(a);c!=null&&this.associations.set(o,c);for(const[l,h]of a.children.entries())r(h,o.children[l])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ze.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(r,a){n.load(or.resolveURL(t.uri,i.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=Po[i.type],o=ms[i.componentType],c=i.normalized===!0,l=new o(i.count*a);return Promise.resolve(new mt(l,a,c))}const r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],c=Po[i.type],l=ms[i.componentType],h=l.BYTES_PER_ELEMENT,u=h*c,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,b=i.normalized===!0;let v,p;if(f&&f!==u){const m=Math.floor(d/f),g="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+m+":"+i.count;let _=t.cache.get(g);_||(v=new l(o,m*f,i.count*f/h),_=new gd(v,f/h),t.cache.add(g,_)),p=new mr(_,c,d%f/h,b)}else o===null?v=new l(i.count*c):v=new l(o,d,i.count*c),p=new mt(v,c,b);if(i.sparse!==void 0){const m=Po.SCALAR,g=ms[i.sparse.indices.componentType],_=i.sparse.indices.byteOffset||0,x=i.sparse.values.byteOffset||0,E=new g(a[1],_,i.sparse.count*m),w=new l(a[2],x,i.sparse.count*c);o!==null&&(p=new mt(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let A=0,S=E.length;A<S;A++){const y=E[A];if(p.setX(y,w[A*c]),c>=2&&p.setY(y,w[A*c+1]),c>=3&&p.setZ(y,w[A*c+2]),c>=4&&p.setW(y,w[A*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=b}return p})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const c=n.manager.getHandler(a.uri);c!==null&&(o=c)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const i=this,r=this.json,a=r.textures[e],o=r.images[t],c=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const d=(r.samplers||{})[a.sampler]||{};return h.magFilter=iu[d.magFilter]||kt,h.minFilter=iu[d.minFilter]||An,h.wrapS=su[d.wrapS]||vn,h.wrapT=su[d.wrapT]||vn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Qt&&h.minFilter!==kt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const a=i.images[e],o=self.URL||self.webkitURL;let c=a.uri||"",l=!1;if(a.bufferView!==void 0)c=n.getDependency("bufferView",a.bufferView).then(function(u){l=!0;const d=new Blob([u],{type:a.mimeType});return c=o.createObjectURL(d),c});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(c).then(function(u){return new Promise(function(d,f){let b=d;t.isImageBitmapLoader===!0&&(b=function(v){const p=new Dt(v);p.needsUpdate=!0,d(p)}),t.load(or.resolveURL(u,r.path),b,void 0,f)})}).then(function(u){return l===!0&&o.revokeObjectURL(c),Zn(u,a),u.userData.mimeType=a.mimeType||yv(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[Ze.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[Ze.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const c=r.associations.get(a);a=r.extensions[Ze.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,c)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new $c,un.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(o,c)),n=c}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new Qc,un.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(o,c)),n=c}if(i||r||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let c=this.cache.get(o);c||(c=n.clone(),r&&(c.vertexColors=!0),a&&(c.flatShading=!0),i&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(o,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return yt}loadMaterial(e){const t=this,n=this.json,i=this.extensions,r=n.materials[e];let a;const o={},c=r.extensions||{},l=[];if(c[Ze.KHR_MATERIALS_UNLIT]){const u=i[Ze.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),l.push(u.extendParams(o,r,t))}else{const u=r.pbrMetallicRoughness||{};if(o.color=new ue(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],jt),o.opacity=d[3]}u.baseColorTexture!==void 0&&l.push(t.assignTexture(o,"map",u.baseColorTexture,pt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),l.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Rt);const h=r.alphaMode||Lo.OPAQUE;if(h===Lo.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===Lo.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==Tt&&(l.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new q(1,1),r.normalTexture.scale!==void 0)){const u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==Tt&&(l.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==Tt){const u=r.emissiveFactor;o.emissive=new ue().setRGB(u[0],u[1],u[2],jt)}return r.emissiveTexture!==void 0&&a!==Tt&&l.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,pt)),Promise.all(l).then(function(){const u=new a(o);return r.name&&(u.name=r.name),Zn(u,r),t.associations.set(u,{materials:e}),r.extensions&&Ai(i,u,r),u})}createUniqueName(e){const t=dt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function r(o){return n[Ze.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(c){return ru(c,o,t)})}const a=[];for(let o=0,c=e.length;o<c;o++){const l=e[o],h=vv(l),u=i[h];if(u)a.push(u.promise);else{let d;l.extensions&&l.extensions[Ze.KHR_DRACO_MESH_COMPRESSION]?d=r(l):d=ru(new gt,l,t),i[h]={primitive:l,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let c=0,l=a.length;c<l;c++){const h=a[c].material===void 0?bv(this.cache):this.getDependency("material",a[c].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(c){const l=c.slice(0,c.length-1),h=c[c.length-1],u=[];for(let f=0,b=h.length;f<b;f++){const v=h[f],p=a[f];let m;const g=l[f];if(p.mode===mn.TRIANGLES||p.mode===mn.TRIANGLE_STRIP||p.mode===mn.TRIANGLE_FAN||p.mode===void 0)m=r.isSkinnedMesh===!0?new p_(v,g):new j(v,g),m.isSkinnedMesh===!0&&m.normalizeSkinWeights(),p.mode===mn.TRIANGLE_STRIP?m.geometry=tu(m.geometry,$u):p.mode===mn.TRIANGLE_FAN&&(m.geometry=tu(m.geometry,wc));else if(p.mode===mn.LINES)m=new b_(v,g);else if(p.mode===mn.LINE_STRIP)m=new Ua(v,g);else if(p.mode===mn.LINE_LOOP)m=new __(v,g);else if(p.mode===mn.POINTS)m=new xd(v,g);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(m.geometry.morphAttributes).length>0&&xv(m,r),m.name=t.createUniqueName(r.name||"mesh_"+e),Zn(m,r),p.extensions&&Ai(i,m,p),t.assignFinalMaterial(m),u.push(m)}for(let f=0,b=u.length;f<b;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&Ai(i,u[0],r),u[0];const d=new Ae;r.extensions&&Ai(i,d,r),t.associations.set(d,{meshes:e});for(let f=0,b=u.length;f<b;f++)d.add(u[f]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Kt(Jf.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Ia(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Zn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const r=i.pop(),a=i,o=[],c=[];for(let l=0,h=a.length;l<h;l++){const u=a[l];if(u){o.push(u);const d=new Ge;r!==null&&d.fromArray(r.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new Zc(o,c)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,a=[],o=[],c=[],l=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){const f=i.channels[u],b=i.samplers[f.sampler],v=f.target,p=v.node,m=i.parameters!==void 0?i.parameters[b.input]:b.input,g=i.parameters!==void 0?i.parameters[b.output]:b.output;v.node!==void 0&&(a.push(this.getDependency("node",p)),o.push(this.getDependency("accessor",m)),c.push(this.getDependency("accessor",g)),l.push(b),h.push(v))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(u){const d=u[0],f=u[1],b=u[2],v=u[3],p=u[4],m=[];for(let g=0,_=d.length;g<_;g++){const x=d[g],E=f[g],w=b[g],A=v[g],S=p[g];if(x===void 0)continue;x.updateMatrix&&x.updateMatrix();const y=n._createAnimationTracks(x,E,w,A,S);if(y)for(let M=0;M<y.length;M++)m.push(y[M])}return new sx(r,void 0,m)})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let c=0,l=i.weights.length;c<l;c++)o.morphTargetInfluences[c]=i.weights[c]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=i.children||[];for(let l=0,h=o.length;l<h;l++)a.push(n.getDependency("node",o[l]));const c=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(a),c]).then(function(l){const h=l[0],u=l[1],d=l[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Mv)});for(let f=0,b=u.length;f<b;f++)h.add(u[f]);return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?i.createUniqueName(r.name):"",o=[],c=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&o.push(c),r.camera!==void 0&&o.push(i.getDependency("camera",r.camera).then(function(l){return i._getNodeRef(i.cameraCache,r.camera,l)})),i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){o.push(l)}),this.nodeCache[e]=Promise.all(o).then(function(l){let h;if(r.isBone===!0?h=new _d:l.length>1?h=new Ae:l.length===1?h=l[0]:h=new _t,h!==l[0])for(let u=0,d=l.length;u<d;u++)h.add(l[u]);if(r.name&&(h.userData.name=r.name,h.name=a),Zn(h,r),r.extensions&&Ai(n,h,r),r.matrix!==void 0){const u=new Ge;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);return i.associations.has(h)||i.associations.set(h,{}),i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,r=new Ae;n.name&&(r.name=i.createUniqueName(n.name)),Zn(r,n),n.extensions&&Ai(t,r,n);const a=n.nodes||[],o=[];for(let c=0,l=a.length;c<l;c++)o.push(i.getDependency("node",a[c]));return Promise.all(o).then(function(c){for(let h=0,u=c.length;h<u;h++)r.add(c[h]);const l=h=>{const u=new Map;for(const[d,f]of i.associations)(d instanceof un||d instanceof Dt)&&u.set(d,f);return h.traverse(d=>{const f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=l(r),r})}_createAnimationTracks(e,t,n,i,r){const a=[],o=e.name?e.name:e.uuid,c=[];pi[r.path]===pi.weights?e.traverse(function(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}):c.push(o);let l;switch(pi[r.path]){case pi.weights:l=Es;break;case pi.rotation:l=As;break;case pi.position:case pi.scale:l=Rs;break;default:switch(n.itemSize){case 1:l=Es;break;case 2:case 3:default:l=Rs;break}break}const h=i.interpolation!==void 0?gv[i.interpolation]:dr,u=this._getArrayFromAccessor(n);for(let d=0,f=c.length;d<f;d++){const b=new l(c[d]+"."+pi[r.path],t.array,u,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(b),a.push(b)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Dc(t.constructor),i=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof As?mv:Dd;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function Sv(s,e,t){const n=e.attributes,i=new bt;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],c=o.min,l=o.max;if(c!==void 0&&l!==void 0){if(i.set(new P(c[0],c[1],c[2]),new P(l[0],l[1],l[2])),o.normalized){const h=Dc(ms[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new P,c=new P;for(let l=0,h=r.length;l<h;l++){const u=r[l];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],f=d.min,b=d.max;if(f!==void 0&&b!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(b[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(b[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(b[2]))),d.normalized){const v=Dc(ms[d.componentType]);c.multiplyScalar(v)}o.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}s.boundingBox=i;const a=new On;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=a}function ru(s,e,t){const n=e.attributes,i=[];function r(a,o){return t.getDependency("accessor",a).then(function(c){s.setAttribute(o,c)})}for(const a in n){const o=Ic[a]||a.toLowerCase();o in s.attributes||i.push(r(n[a],o))}if(e.indices!==void 0&&!s.index){const a=t.getDependency("accessor",e.indices).then(function(o){s.setIndex(o)});i.push(a)}return $e.workingColorSpace!==jt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${$e.workingColorSpace}" not supported.`),Zn(s,e),Sv(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?_v(s,e.targets,t):s})}var Ud=function(){var s="b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q;iekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq:P8Yqdbk;3sezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhDcbhqinaqae9pmeaDaeaq9RaqaDfae6Egkcsfgocl4cifcd4hxdndndndnaoc9WGgmTmbcbhPcehsawcjdfhzalhHinaraH9Rax6midnaraHaxfgl9RcK6mbczhoinawcj;cbfaogifgoc9WfhOdndndndndnaHaic9WfgAco4fRbbaAci4coG4ciGPlbedibkaO9cb83ibaOcwf9cb83ibxikaOalRblalRbbgAco4gCaCciSgCE86bbaocGfalclfaCfgORbbaAcl4ciGgCaCciSgCE86bbaocVfaOaCfgORbbaAcd4ciGgCaCciSgCE86bbaoc7faOaCfgORbbaAciGgAaAciSgAE86bbaoctfaOaAfgARbbalRbegOco4gCaCciSgCE86bbaoc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc93faAaCfgARbbaOciGgOaOciSgOE86bbaoc94faAaOfgARbbalRbdgOco4gCaCciSgCE86bbaoc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc97faAaCfgARbbaOciGgOaOciSgOE86bbaoc98faAaOfgORbbalRbiglco4gAaAciSgAE86bbaoc99faOaAfgORbbalcl4ciGgAaAciSgAE86bbaoc9:faOaAfgORbbalcd4ciGgAaAciSgAE86bbaocufaOaAfgoRbbalciGglalciSglE86bbaoalfhlxdkaOalRbwalRbbgAcl4gCaCcsSgCE86bbaocGfalcwfaCfgORbbaAcsGgAaAcsSgAE86bbaocVfaOaAfgORbbalRbegAcl4gCaCcsSgCE86bbaoc7faOaCfgORbbaAcsGgAaAcsSgAE86bbaoctfaOaAfgORbbalRbdgAcl4gCaCcsSgCE86bbaoc91faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc4faOaAfgORbbalRbigAcl4gCaCcsSgCE86bbaoc93faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc94faOaAfgORbbalRblgAcl4gCaCcsSgCE86bbaoc95faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc96faOaAfgORbbalRbvgAcl4gCaCcsSgCE86bbaoc97faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc98faOaAfgORbbalRbogAcl4gCaCcsSgCE86bbaoc99faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc9:faOaAfgORbbalRbrglcl4gAaAcsSgAE86bbaocufaOaAfgoRbbalcsGglalcsSglE86bbaoalfhlxekaOal8Pbb83bbaOcwfalcwf8Pbb83bbalczfhlkdnaiam9pmbaiczfhoaral9RcL0mekkaiam6mialTmidnakTmbawaPfRbbhOcbhoazhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkkazcefhzaPcefgPad6hsalhHaPad9hmexvkkcbhlasceGmdxikalaxad2fhCdnakTmbcbhHcehsawcjdfhminaral9Rax6mialTmdalaxfhlawaHfRbbhOcbhoamhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkamcefhmaHcefgHad6hsaHad9hmbkaChlxikcbhocehsinaral9Rax6mdalTmealaxfhlaocefgoad6hsadao9hmbkaChlxdkcbhlasceGTmekc9:hoxikabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqalmbkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;ebf8Kjjjjbaok;yzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;siliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabavcefciGaiVcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:Ohkxekcjjjj94hkkabavcdfciGaiVcetfak87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:Ohqxekcjjjj94hqkabavcufciGaiVcetfaq87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohqxekcjjjj94hqkabavciGaiVcetfaq87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2geTmbinababydbgdcwtcw91:Yadce91cjjj;8ifcjjj98G::NUdbabclfhbaecufgembkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaiczfhiaeczfheadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklz9Kbb",e="b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q;Aekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq;t9tqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk;h8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhwcbhDinaDae9pmeawaeaD9RaDawfae6Egqcsfgoc9WGgkci2hxakcethmaocl4cifcd4hPabaDad2fhscbhzdnincehHalhOcbhAdninaraO9RaP6miavcj;cbfaAak2fhCaOaPfhlcbhidnakc;ab6mbaral9Rc;Gb6mbcbhoinaCaofhidndndndndnaOaoco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklbalczfhlkdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklzalczfhlkdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklaalczfhlkdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalclfaYpQbfaXc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalcwfaYpQbfaXc:q:yjjbfRbbfhlxekaialpbbbpkl8Walczfhlkaoc;abfhiaocjefak0meaihoaral9Rc;Fb0mbkkdndnaiak9pmbaici4hoinaral9RcK6mdaCaifhXdndndndndnaOaico4fRbbaocoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpklbxikaXalpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaXalpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaXalpbbbpklbalczfhlkaocdfhoaiczfgiak6mbkkalTmbaAci6hHalhOaAcefgohAaoclSmdxekkcbhlaHceGmdkdnakTmbavcjdfazfhiavazfpbdbhYcbhXinaiavcj;cbfaXfgopblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLaoakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEaoamfpblbg3cep9Ta3aQp9op9Hp9rg3aoaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfhiaXczfgXak6mbkkazclfgzad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfhDc9:hoalmexikkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk;uzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:EPliuo97eue978Jjjjjbca9Rhidndnadcl9hmbdnaec98GglTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalae9pmeaiaeciGgvcdtgdVcbczad9R;8kbaiabalcdtfglad;8qbbdnavTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkalaiad;8qbbskdnaec98GgxTmbcbhvabhdinadczfglalpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oawaopmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgvax6mbkkaxae9pmbaiaeciGgvcitgdfcbcaad9R;8kbaiabaxcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oawaopmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalae9pmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbhdabheinaeaepbbbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepkbbaeczfheadclfgdav6mbkkdnaval9pmbaialciGgdcdtgeVcbc;abae9R;8kbaiabavcdtfgvae;8qbbdnadTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepklbkavaiae;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz9Tbb",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),n=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var i=WebAssembly.validate(t)?e:s,r,a=WebAssembly.instantiate(o(i),{}).then(function(m){r=m.instance,r.exports.__wasm_call_ctors()});function o(m){for(var g=new Uint8Array(m.length),_=0;_<m.length;++_){var x=m.charCodeAt(_);g[_]=x>96?x-97:x>64?x-39:x+4}for(var E=0,_=0;_<m.length;++_)g[E++]=g[_]<60?n[g[_]]:(g[_]-60)*64+g[++_];return g.buffer.slice(0,E)}function c(m,g,_,x,E,w){var A=r.exports.sbrk,S=_+3&-4,y=A(S*x),M=A(E.length),C=new Uint8Array(r.exports.memory.buffer);C.set(E,M);var D=m(y,_,x,M,E.length);if(D==0&&w&&w(y,S,x),g.set(C.subarray(y,y+_*x)),A(y-A(0)),D!=0)throw new Error("Malformed buffer data: "+D)}var l={NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp"},h={ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"},u=[],d=0;function f(m){var g={object:new Worker(m),pending:0,requests:{}};return g.object.onmessage=function(_){var x=_.data;g.pending-=x.count,g.requests[x.id][x.action](x.value),delete g.requests[x.id]},g}function b(m){for(var g="var instance; var ready = WebAssembly.instantiate(new Uint8Array(["+new Uint8Array(o(i))+"]), {}).then(function(result) { instance = result.instance; instance.exports.__wasm_call_ctors(); });self.onmessage = workerProcess;"+c.toString()+p.toString(),_=new Blob([g],{type:"text/javascript"}),x=URL.createObjectURL(_),E=0;E<m;++E)u[E]=f(x);URL.revokeObjectURL(x)}function v(m,g,_,x,E){for(var w=u[0],A=1;A<u.length;++A)u[A].pending<w.pending&&(w=u[A]);return new Promise(function(S,y){var M=new Uint8Array(_),C=d++;w.pending+=m,w.requests[C]={resolve:S,reject:y},w.object.postMessage({id:C,count:m,size:g,source:M,mode:x,filter:E},[M.buffer])})}function p(m){a.then(function(){var g=m.data;try{var _=new Uint8Array(g.count*g.size);c(r.exports[g.mode],_,g.count,g.size,g.source,r.exports[g.filter]),self.postMessage({id:g.id,count:g.count,action:"resolve",value:_},[_.buffer])}catch(x){self.postMessage({id:g.id,count:g.count,action:"reject",value:x})}})}return{ready:a,supported:!0,useWorkers:function(m){b(m)},decodeVertexBuffer:function(m,g,_,x,E){c(r.exports.meshopt_decodeVertexBuffer,m,g,_,x,r.exports[l[E]])},decodeIndexBuffer:function(m,g,_,x){c(r.exports.meshopt_decodeIndexBuffer,m,g,_,x)},decodeIndexSequence:function(m,g,_,x){c(r.exports.meshopt_decodeIndexSequence,m,g,_,x)},decodeGltfBuffer:function(m,g,_,x,E,w){c(r.exports[h[E]],m,g,_,x,r.exports[l[w]])},decodeGltfBufferAsync:function(m,g,_,x,E){return u.length>0?v(m,g,_,h[x],l[E]):a.then(function(){var w=new Uint8Array(m*g);return c(r.exports[h[x]],w,m,g,_,r.exports[l[E]]),w})}}}();const Tv={fur:{map:"fur",nor:"fur_n",rep:2.2,metal:0,rough:.92},skin:{map:"skin",nor:void 0,rep:1.4,metal:0,rough:.78},cloth:{map:"cloth",nor:"cloth_n",rep:2.8,metal:0,rough:.95},leather:{map:"leather",nor:"leather_n",rep:2,metal:0,rough:.7},metal:{map:"metal",nor:"metal_n",rep:1.6,metal:.72,rough:.42},gold:{map:"metal",nor:"metal_n",rep:1.8,metal:.85,rough:.35},rust:{map:"rust",nor:"rust_n",rep:1.8,metal:.35,rough:.78},iron:{map:"iron",nor:"iron_n",rep:1.4,metal:.65,rough:.55},wood:{map:"wood",nor:"wood_n",rep:1.6,metal:0,rough:.88},bark:{map:"bark",nor:"bark_n",rep:1.5,metal:0,rough:.95},leaf:{map:"leaf",nor:"leaf_n",rep:2.4,metal:0,rough:.9},stone:{map:"concrete",nor:"concrete_n",rep:1.8,metal:0,rough:.92},paint:{map:"plaster",nor:"plaster_n",rep:2,metal:.05,rough:.7},concrete:{map:"concrete",nor:"concrete_n",rep:1.5,metal:0,rough:.9}},au=new Map;function ou(s,e,t){const n=s+":"+t+(e?":s":"");let i=au.get(n);return i||(i=new Nn().load(zt(`assets/tex/${s}.webp`)),i.wrapS=i.wrapT=vn,i.repeat.set(t,t),i.anisotropy=4,e&&(i.colorSpace=pt),au.set(n,i),i)}const Uc=new Map,Ev=new Tt({vertexColors:!0,toneMapped:!1});let Li=2;function Do(s){Li=s,Uc.clear()}function bi(s){if(s==="glow")return Ev;const e=s+":"+Li;let t=Uc.get(e);if(t)return t;const n=Tv[s];if(Li<=0)t=new It({vertexColors:!0,flatShading:!0});else{const i=ou(n.map,!0,n.rep),r=Li>=2&&n.nor?ou(n.nor,!1,n.rep):null,a=Li>=2?n.metal:Math.min(n.metal,s==="gold"?.55:.28);t=new yt({map:i,normalMap:r,vertexColors:!0,metalness:a,roughness:Math.max(n.rough,Li<2?.55:n.rough),envMapIntensity:s==="metal"||s==="gold"||s==="iron"?Li>=2?1.1:.85:.55,flatShading:!!n.flat})}return t.name="fp_"+s,Uc.set(e,t),t}function Av(s,e=!1){if(e)return"glow";const t=s>>16&255,n=s>>8&255,i=s&255;if(t>170&&n>120&&i<110&&t>=n&&n>i+20)return"gold";if(n>t+15&&n>i+10&&n>70)return"leaf";if(t>170&&n>130&&i>90&&t>n&&n>i&&t-i<140)return"skin";if(t>55&&t<170&&n>30&&n<120&&i<90&&t>n&&n>=i-10)return"fur";if(t>70&&n>35&&i<70&&t>n*1.15&&n>i)return"wood";if(t>40&&t<100&&n>25&&n<70&&i<55&&t>=n)return"bark";if(i>t+40&&i>n)return"paint";if(t>150&&n<90&&i<90)return"leather";const r=Math.max(t,n,i),a=Math.min(t,n,i);return r-a<35?r<55?"iron":r<130?"metal":"paint":n>60&&n<140&&t>40&&t<130&&i<90&&Math.abs(t-n)<40?"cloth":"paint"}const Rv=new Ha().setMeshoptDecoder(Ud),cu=new Map;function Cs(s){let e=cu.get(s);return e||(e=Rv.loadAsync(zt(`assets/military/${s}.glb`)).then(t=>t.scene),cu.set(s,e)),e}const hn=(s,e="paint")=>{const t=bi(e).clone();return t.vertexColors=!1,"color"in t&&(t.color.setHex(s),.2126*t.color.r+.7152*t.color.g+.0722*t.color.b<.08&&(t.color.offsetHSL(0,0,.14),"metalness"in t&&(t.metalness=Math.min(t.metalness,.28)),"roughness"in t&&(t.roughness=Math.max(t.roughness,.62)))),t},Ne=(s,e,t,n)=>(s.position.set(e,t,n),s),lu=new Map;function va(s,e,t=2){const n=s+":"+t+(e?":s":"");let i=lu.get(n);return i||(i=new Nn().load(zt(`assets/tex/${s}.webp`)),i.wrapS=i.wrapT=vn,i.repeat.set(t,t),i.anisotropy=4,e&&(i.colorSpace=pt),lu.set(n,i),i)}function Wt(s){const e=s.rep??2.2,t=new yt({map:va(s.map,!0,e),normalMap:s.nor?va(s.nor,!1,e):null,roughnessMap:s.roughMap?va(s.roughMap,!1,e):null,color:s.color??16777215,metalness:s.metal??.1,roughness:s.rough??.7,envMapIntensity:.85,flatShading:!!s.flat,vertexColors:!1});return t.metalness=Math.min(t.metalness,.22),t.roughness=Math.max(t.roughness,.55),t.emissive=new ue(1711124),t.emissiveIntensity=.35,t}const Bt={tank:[7.6,8.6,9.6],heli:[11,12,13.2],barrel:.95,crate:.8,crate_large:1.25,tent:4.2,barrier:2.6,sandbags:2.6,gun_rifle:.86,gun_rocket:1.15,gun_sniper:1.18,gun_shotgun:.98,gun_pistol:.21,gun_smg:.52},fl={tank_1:Math.PI,tank_2:Math.PI,tank_3:Math.PI,heli:Math.PI/2};function wr(s,e,t=0,n){const i=s.clone(!0);i.rotation.y=t,i.updateMatrixWorld(!0);const r=new bt().setFromObject(i),a=r.getSize(new P),o=e/Math.max(a.x,a.z),c=new Ae,l=new Ae;return l.add(i),i.position.set(-(r.min.x+r.max.x)/2,-r.min.y,-(r.min.z+r.max.z)/2),l.scale.setScalar(o),c.add(l),c}function vr(s,e,t=!1,n="metal"){const i=bi(n);s.traverse(r=>{const a=r;if(!a.isMesh)return;const o=Array.isArray(a.material)?a.material:[a.material];a.material=o.map(c=>{const l=e(c.name,c.color??new ue(1,1,1)),h=i.clone();return h.color.set(l??c.color??16777215),!t&&c.map&&(h.map=c.map,h.color.set(16777215)),h.name=c.name,h.vertexColors=!!a.geometry.attributes.color,h}),a.material.length===1&&(a.material=a.material[0]),a.castShadow=!0})}async function hu(s){const e=`tank_${Math.min(2,s)+1}`,t=await Cs(e),n=wr(t,Bt.tank[Math.min(2,s)],fl[e]),i=s>=2?"tank_olive":"tank_tan",r=Wt({map:i,nor:"tank_n",roughMap:"tank_rough",rep:2.4,color:16777215,metal:.08,rough:.72}),a=Wt({map:i,nor:"tank_n",roughMap:"tank_rough",rep:2.8,color:14212296,metal:.1,rough:.75}),o=Wt({map:"tank_track",nor:"tank_track_n",rep:3.2,color:6973536,metal:.05,rough:.92}),c=Wt({map:"tank_iron",nor:"tank_iron_n",rep:1.8,color:13158592,metal:.22,rough:.55});n.traverse(v=>{var x;const p=v;if(!p.isMesh)return;const g=((x=(Array.isArray(p.material)?p.material:[p.material])[0])==null?void 0:x.name)??"";let _=r;/Wheel/i.test(g)||/Wheel/i.test(p.name)?_=o:/Gun/i.test(g)||/Gun/i.test(p.name)?_=c:/Dark|Detail/i.test(g)?_=a:s===2&&/Main_Light/i.test(g)&&(_=Wt({map:i,nor:"tank_n",roughMap:"tank_rough",rep:2,color:13686976,metal:.18,rough:.55})),p.material=_,p.castShadow=!0});const l=n.children[0].children[0];l.updateMatrixWorld(!0),n.updateMatrixWorld(!0);const h=[];l.traverse(v=>{/Turret|Gun/i.test(v.name)&&v.isMesh&&h.push(v)});const u=h.find(v=>/Turret/i.test(v.name)),d=new Ae;if(u){const v=new bt().setFromObject(u).getCenter(new P);d.position.set(v.x,0,v.z),n.add(d),d.updateMatrixWorld(!0);for(const p of h)d.attach(p)}n.userData.turret=d;const f=c,b=r;if(s>=1){const v=new bt().setFromObject(n);for(const p of[-1,1])for(let m=0;m<4;m++)n.add(Ne(new j(new Se(.85,.28,.1),b),v.min.x+1.4+m*1.05,v.max.y*.38,p*(v.max.z+.02)))}if(s>=2){const v=new bt().setFromObject(n);for(const S of[-1,1])for(let y=0;y<5;y++)n.add(Ne(new j(new Se(.9,.42,.14),b),v.min.x+1.3+y*1.05,v.max.y*.42,S*(v.max.z+.02)));d.updateMatrixWorld(!0);let p=null,m=-1;d.traverse(S=>{const y=S;if(!y.isMesh||!/Turret/i.test(y.name))return;const M=new bt().setFromObject(y),C=M.getSize(new P),D=C.x*C.z;D>m&&(m=D,p=y)});const g=p?new bt().setFromObject(p):new bt().setFromObject(d),_=g.max.y,x=(g.min.x+g.max.x)/2-d.position.x,E=Ne(new j(new Fe(.02,.03,2.6,4),f),-1.2,_+1.2,-.7);d.add(E);const w=new Ae;w.add(Ne(new j(new Fe(.38,.4,.12,10),b),0,.04,0)),w.add(Ne(new j(new Fe(.28,.32,.32,8),b),0,.26,0)),w.add(Ne(new j(new St(.17,8,6),Wt({map:"tank_track",nor:"tank_track_n",rep:1.5,color:9080936,metal:.05,rough:.85})),0,.48,0));const A=new Ae;A.add(Ne(new j(new Se(.55,.18,.2),f),0,0,0)),A.add(Ne(new j(new Fe(.045,.045,1.15,6).rotateZ(Math.PI/2),f),.7,.02,0)),Ne(A,.12,.48,.28),w.add(A),Ne(w,x-.35,_-.08,.35),d.add(w),n.userData.gunner=w}return n.userData.kind="tank",n.userData.textured=!0,n}function Nd(s,e){s.updateMatrixWorld(!0);const t=new P;s.traverse(n=>{const i=n;if(!i.isMesh)return;const r=i.geometry.index?i.geometry.toNonIndexed():i.geometry.clone(),a=r.attributes.position,o=a.count,c=new Float32Array(o*3);for(let d=0;d<o;d++)c[d*3]=a.getX(d),c[d*3+1]=a.getY(d),c[d*3+2]=a.getZ(d);const l=[];for(let d=0;d<o;d+=3){let f=!1;for(let b=0;b<3;b++)t.set(c[(d+b)*3],c[(d+b)*3+1],c[(d+b)*3+2]).applyMatrix4(i.matrixWorld),t.y>e&&(f=!0);f||l.push(d,d+1,d+2)}if(l.length===0){i.visible=!1;return}const h=new gt,u=new Float32Array(l.length*3);l.forEach((d,f)=>{u[f*3]=c[d*3],u[f*3+1]=c[d*3+1],u[f*3+2]=c[d*3+2]}),h.setAttribute("position",new mt(u,3));for(const d of Object.keys(r.attributes)){if(d==="position")continue;const f=r.attributes[d],b=new Float32Array(l.length*f.itemSize);for(let v=0;v<l.length;v++)for(let p=0;p<f.itemSize;p++)b[v*f.itemSize+p]=f.getComponent(l[v],p);h.setAttribute(d,new mt(b,f.itemSize))}h.computeVertexNormals(),i.geometry=h})}async function Cv(s){const e=await Cs("heli"),t=Bt.heli[Math.min(2,s)],n=wr(e,t,fl.heli);n.updateMatrixWorld(!0);const i=new bt().setFromObject(n),r=i.min.y+(i.max.y-i.min.y)*.78,a=i.min.x+(i.max.x-i.min.x)*.55;Nd(n,r+.05);const o=[16777215,15266008,13687992][Math.min(2,s)],c=Wt({map:"tank_olive",nor:"tank_n",roughMap:"tank_rough",rep:2.6,color:o,metal:.08,rough:.7}),l=Wt({map:"tank_olive",nor:"tank_n",roughMap:"tank_rough",rep:3,color:13160624,metal:.1,rough:.72});n.traverse(w=>{var y;const A=w;if(!A.isMesh)return;const S=((y=Array.isArray(A.material)?A.material[0]:A.material)==null?void 0:y.name)??"";A.material=/003|004/.test(S)?l:c,A.castShadow=!0});const h=new bt().setFromObject(n),u=h.max.y,d=h.max.x-h.min.x,f=Wt({map:"tank_iron",nor:"tank_iron_n",rep:2.5,color:6975592,metal:.35,rough:.5}),b=new Ae;b.add(Ne(new j(new Fe(.1,.14,Math.max(.35,r+.32-u),8),f),0,-(r+.32-u)/2,0));const v=s>=2?5:4;for(let w=0;w<v;w++){const A=new j(new Se(t*.47,.05,.32).translate(t*.235,0,0),f);A.rotation.y=w/v*Math.PI*2,b.add(A)}b.add(new j(new Fe(.22,.28,.28,8),f));const p=new j(new Fa(t*.47,32).rotateX(-Math.PI/2),new Tt({color:2236962,transparent:!0,opacity:.16,depthWrite:!1,side:Rt}));b.add(p),b.position.set(a,r+.32,0),n.add(b);const m=new Ae;for(let w=0;w<2;w++){const A=new j(new Se(.16,t*.16,.04),f);A.rotation.z=w*Math.PI/2,m.add(A)}m.position.set(h.min.x+.35,Math.min(u*.92,r*.88),.42),n.add(m),n.userData.rotor=b,n.userData.tail=m;const g=hn(2237983,"iron"),_=hn(3817776,"metal"),x=h.max.x-d*.12,E=new Ae;E.add(new j(new St(.28,8,6),g));for(const w of[-.07,.07])E.add(Ne(new j(new Fe(.04,.04,1.3,6).rotateZ(Math.PI/2),g),.65,0,w));if(Ne(E,x,u*.18,0),n.add(E),s>=1){const w=h.min.x+d*.55;n.add(Ne(new j(new Se(.9,.08,3.4),g),w,u*.38,0));for(const A of[-1,1])if(n.add(Ne(new j(new Fe(.24,.24,1.5,10).rotateZ(Math.PI/2),_),w,u*.3,A*1.2)),s>=2){n.add(Ne(new j(new Fe(.24,.24,1.5,10).rotateZ(Math.PI/2),_),w,u*.3,A*1.65));for(const S of[0,1])n.add(Ne(new j(new Fe(.09,.09,1.6,6).rotateZ(Math.PI/2),hn(6975328)),w+.1,u*.22-S*.22,A*.75))}}return n.userData.kind="heli",n.userData.textured=!0,n}function Pv(s){const e=new Ae,t=[12,14,16][Math.min(2,s)],n=hn(2764856,"iron"),i=hn(5925496,"metal"),r=hn(6977672,"metal"),a=hn(14212320,"paint"),o=hn(6965818,"rust"),c=hn(16757594,"gold");e.add(Ne(new j(new Se(t,1.4,3.2+s*.3),i),0,.7,0)),e.add(Ne(new j(new Se(t*.98,.18,3.25+s*.3),o),0,.12,0)),e.add(Ne(new j(new Se(t*.92,.35,3+s*.25),r),0,1.5,0)),e.add(Ne(new j(new Un(1.7+s*.1,2.8,4).rotateZ(-Math.PI/2),i),t/2+.4,.85,0));for(let u=0;u<3+s;u++)e.add(Ne(new j(new Se(1.2,.04,1.4),n),-t*.25+u*1.5,1.7,0));e.add(Ne(new j(new Se(2.8,1.6+s*.3,2.2),a),-.5,2.4,0)),e.add(Ne(new j(new Se(1.2,1.2,1.4),n),-.3,3.5+s*.15,0)),e.add(Ne(new j(new Se(2.4,.35,.08),hn(8048895,"paint")),-.5,2.9,1.12)),e.add(Ne(new j(new Fe(.06,.08,3.2+s*.4,6),n),.4,4.5+s*.2,0)),s>=1&&e.add(Ne(new j(new Se(1.4,.15,.6),hn(9412784,"metal")),.4,5.6,0)),s>=2&&e.add(Ne(new j(new St(.25,8,6),c),.4,6.2,0));const l=new Ae,h=1+s;for(let u=0;u<h;u++){const d=t*.22-u*2.4,f=new Ae;f.add(new j(new Fe(.55,.65,.5,10),n)),f.add(Ne(new j(new Fe(.1,.12,2.2+s*.3,8).rotateZ(Math.PI/2),n),1.2,.1,0)),s>=2&&f.add(Ne(new j(new Se(.35,.12,.35),c),0,.32,0)),Ne(f,d,1.85,0),l.add(f)}return e.add(l),e.userData.turret=l,e.userData.kind="destroyer",e.userData.textured=!0,e.traverse(u=>{const d=u;d.isMesh&&(d.castShadow=!0)}),e}function Lv(s){const e=new Ae,t=8+s*1.5,n=Wt({map:"lh_cream",nor:"lh_paint_n",rep:1.6,color:16775920,metal:0,rough:.82}),i=Wt({map:"lh_red",nor:"lh_red_n",rep:1.8,color:16769248,metal:0,rough:.78}),r=Wt({map:"lh_brick",nor:"lh_brick_n",rep:2.4,metal:0,rough:.9}),a=Wt({map:"lh_rock",nor:"lh_rock_n",rep:1.8,metal:0,rough:.95}),o=Wt({map:"lh_slate",nor:"tank_iron_n",rep:2,metal:.25,rough:.55}),c=Wt({map:"tank_iron",nor:"tank_iron_n",rep:3,color:13686492,metal:.35,rough:.4}),l=new yt({color:13166847,metalness:.05,roughness:.12,transparent:!0,opacity:.42,envMapIntensity:1,vertexColors:!1,side:Rt});e.add(Ne(new j(new Fe(1.65,1.95,.55,14),a),0,.28,0));for(let v=0;v<8;v++){const p=v/8*Math.PI*2;e.add(Ne(new j(new St(.35+v%3*.08,8,6),a),Math.cos(p)*1.75,.22,Math.sin(p)*1.75))}e.add(Ne(new j(new Fe(1.15,1.35,.45,14),r),0,.7,0)),e.add(Ne(new j(new Se(.55,.9,.12),hn(5913128,"wood")),0,1.15,1.05));const h=4+s,u=t*.68;for(let v=0;v<h;v++){const p=u/h,m=.95+v*p,g=.95-v*.035,_=.9-v*.035;e.add(Ne(new j(new Fe(_,g,p,16),v%2?i:n),0,m+p/2,0))}const d=.95+u;e.add(Ne(new j(new Fe(1.25,1.25,.12,16),o),0,d,0)),e.add(Ne(new j(new Ts(1.2,.045,6,24),c),0,d+.35,0));for(let v=0;v<12;v++){const p=v/12*Math.PI*2;e.add(Ne(new j(new Fe(.03,.03,.35,5),c),Math.cos(p)*1.2,d+.18,Math.sin(p)*1.2))}const f=d+.7+s*.05;e.add(Ne(new j(new Fe(.78,.78,1.15+s*.12,14),l),0,f,0));for(let v=0;v<6;v++){const p=v/6*Math.PI*2;e.add(Ne(new j(new Se(.07,1.1+s*.12,.07),o),Math.cos(p)*.78,f,Math.sin(p)*.78))}const b=new j(new St(.42+s*.06,12,10),new Tt({color:16765514}));return Ne(b,0,f,0),e.add(b),e.add(Ne(new j(new Fe(.95,.95,.1,14),o),0,f+.65+s*.06,0)),e.add(Ne(new j(new Un(.95,.7+s*.05,14),o),0,f+1.05+s*.08,0)),e.add(Ne(new j(new St(.08,6,6),c),0,f+1.45+s*.1,0)),s>=1&&e.add(Ne(new j(new Se(.35,.45,.08),n),.55,.95+u*.45,.7)),s>=2&&e.add(Ne(new j(new Fe(.04,.04,1.2,5),o),.9,d-.5,0)),e.userData.lamp=b,e.userData.kind="beacon",e.userData.textured=!0,e.traverse(v=>{const p=v;p.isMesh&&p!==b&&(p.castShadow=!0)}),e}function lr(){const s=new Ae,e=new St(.55,10,7).scale(.72,.3,.4);let t;try{const r=va("sandbag",!0,1.4);t=new yt({map:r,color:15260080,roughness:.92,metalness:0,envMapIntensity:.5,vertexColors:!1}),t.emissive=new ue(1710096),t.emissiveIntensity=.2}catch{t=hn(11771764,"cloth")}const n=Bt.sandbags;for(let r=0;r<4;r++){const a=5-r%2;for(let o=0;o<a;o++)for(let c=0;c<2;c++){const l=new j(e,t);l.castShadow=!0,l.receiveShadow=!0;const h=-n/2+.28+o*.52+r%2*.26,u=.14+r*.22,d=(c-.5)*.32+r%2*.06;l.position.set(h,u,d),l.rotation.set(((o+r)%5-2)*.05,((o*7+r)%5-2)*.08,((o+c)%3-1)*.06),s.add(l)}}const i=new j(new Se(n*.95,.35,.85),t);return i.position.set(0,.18,0),i.castShadow=!0,s.add(i),s}function Iv(){const s=new Ae,e=lr();e.position.z=-.95,s.add(e);const t=lr();t.rotation.y=Math.PI/2.5,t.position.set(-1.35,0,.15),s.add(t);const n=lr();n.rotation.y=-Math.PI/2.5,n.position.set(1.35,0,.15),s.add(n);const i=Wt({map:"sandbag",nor:"sandbag_n",rep:1.2,color:14733480,metal:0,rough:.95});for(const[r,a]of[[-1.1,-.7],[1.1,-.7]]){const o=new j(new St(.55,8,6).scale(1.1,.7,1),i);o.position.set(r,.35,a),o.castShadow=!0,s.add(o)}return s}async function Pn(s,e,t,n,i=0,r=0,a){const o=wr(await Cs(s),e);return o.position.set(t,r,n),o.rotation.y=i,a!==void 0?vr(o,()=>a,s==="barrel"):vr(o,()=>null),o}async function Dv(s){if(s==="sandbags")return Iv();const e=new Ae;if(s==="supply")e.add(await Pn("crate_large",Bt.crate_large,-.7,-.3,.1,0,9075278),await Pn("crate_large",Bt.crate_large,.62,-.42,-.08,0,8220744)),e.add(await Pn("crate",Bt.crate,-.55,-.25,.3,Bt.crate_large*.98,10127962),await Pn("crate",Bt.crate,.4,.75,.6,0,9075278)),e.add(await Pn("barrel",Bt.barrel,1.45,.55,0,0,5201722),await Pn("barrel",Bt.barrel,-1.35,.8,0,0,5201722));else if(s==="fuel")for(const[t,n]of[[-.5,-.5],[.5,-.5],[-.5,.5],[.5,.5],[1.4,.1]])e.add(await Pn("barrel",Bt.barrel,t,n,t*2,0,t>1?9055778:5201722));else if(s==="tent"){const t=await Pn("tent",Bt.tent,0,0,0);vr(t,()=>7304528,!0),e.add(t)}else s==="barrier"&&e.add(await Pn("barrier",Bt.barrier,-1.25,0,.15,0,9075290),await Pn("barrier",Bt.barrier,1.25,0,-.15,0,9075290));return e}const Uv={Gray8:2764079,Gray6:4343626,Gray5:7038032,FrontColor:5001558},Nv={rifle:"gun_rifle_ph",sniper:"gun_rifle_ph",shotgun:"gun_rifle_ph",smg:"gun_rifle_ph",pistol:"gun_pistol_ph"};async function Uo(s){const e="gun_"+s,t=Nv[s];let n;if(t){n=(await Cs(t)).clone(!0);const d=[];n.traverse(f=>{s!=="sniper"&&/scope/i.test(f.name)&&d.push(f)});for(const f of d)f.removeFromParent();n.traverse(f=>{const b=f;if(!b.isMesh)return;const v=b.material.clone();v.envMapIntensity=.9,b.material=v,b.castShadow=!0})}else n=await Cs(e);const i=wr(n,Bt[e]);t||(vr(i,d=>Uv[d]??null),i.traverse(d=>{const f=d,b=f.material;if(!b||!b.color)return;const v=b.color.getHSL({h:0,s:0,l:0}).l<.12?new ue(3883075):b.color;f.material=new yt({color:v,metalness:.55,roughness:.45,vertexColors:b.vertexColors})})),i.updateMatrixWorld(!0);const r=new bt().setFromObject(i),a=r.max.z-r.min.z,o=new P,c={lo:[1/0,-1/0],hi:[1/0,-1/0]};i.traverse(d=>{const f=d;if(!f.isMesh)return;const b=f.geometry.attributes.position;for(let v=0;v<b.count;v++){o.fromBufferAttribute(b,v).applyMatrix4(f.matrixWorld);const p=o.z<r.min.z+a*.15?c.lo:o.z>r.max.z-a*.15?c.hi:null;p&&(p[0]=Math.min(p[0],o.y),p[1]=Math.max(p[1],o.y))}});const l=c.lo[1]-c.lo[0]<c.hi[1]-c.hi[0],h=new Ae;h.add(i),l||(i.rotation.y=Math.PI);const u=l?(c.lo[0]+c.lo[1])/2:(c.hi[0]+c.hi[1])/2;return h.userData={len:a,h:r.max.y,muzzle:new P(0,u,-a/2-.02),gunKind:s,textured:!!t},h}let Js=null;function la(s,e,t){const n=new Nn().load(zt(`assets/tex/${s}.webp`));return n.wrapS=n.wrapT=vn,n.repeat.set(t,t),e&&(n.colorSpace=pt),n}function uu(s=5200700,e=5917242){Js??(Js={glove:la("glove",!0,1),gloveN:la("glove_n",!1,1),fab:la("fabric",!0,2),fabN:la("fabric_n",!1,2)});const t=new Ae,n=new yt({color:e,map:Js.glove,normalMap:Js.gloveN,roughness:.62,metalness:0,envMapIntensity:.7}),i=new yt({color:new ue(s).multiplyScalar(1.6),map:Js.fab,normalMap:Js.fabN,roughness:.95,metalness:0});n.name="glove_leather",i.name="sleeve_fabric",t.add(new j(new Se(.09,.1,.085),n));for(let a=0;a<4;a++)t.add(Ne(new j(new Ss(.014,.05,2,6).rotateZ(Math.PI/2),n),.02,.06-a*.026,-.05));t.add(Ne(new j(new Ss(.016,.05,2,6).rotateX(Math.PI/2.4),n),-.045,.04,-.035)),t.add(Ne(new j(new Fe(.05,.045,.06,10).rotateZ(Math.PI/2),new yt({color:1776411,roughness:.7})),0,-.065,.02));const r=Ne(new j(new Fe(.06,.07,.42,10),i),.02,-.28,.06);return t.add(r),t.userData.glove=!0,t}function Fv(s,e){return e?"rifle":{odst:"rifle",marine:"rifle",spartan:"rocket",line_watch:"shotgun",paladin:"pistol",ranger:"sniper",monkey_soldier:"smg"}[s]??"rifle"}async function Ov(s,e=0){const t=s==="heli"?"heli":s==="tank2"?"tank_2":"tank_1",n=wr(await Cs(t),s==="heli"?Bt.heli[1]:Bt.tank[1],fl[t]);if(s==="heli"){n.updateMatrixWorld(!0);const o=new bt().setFromObject(n);Nd(n,o.min.y+(o.max.y-o.min.y)*.78)}const i=[2828067,3485738,2236188,4862756,5913382];let r=e;vr(n,()=>i[(r++*7+e)%i.length],!0);const a=n.children[0];return s==="heli"?(a.rotation.z=.42,a.rotation.x=.12,a.position.y=-.35):(a.rotation.z=.05+e%3*.03,a.position.y=-.18,a.traverse(o=>{/Turret|Gun/i.test(o.name)&&o.isMesh&&(o.rotation.y+=.6+e*.2,o.rotation.z+=.12)})),n.userData.kind="wreck",n}const kv=new Ha,du=new Map;function Fd(s){let e=du.get(s);return e||(e=kv.loadAsync(zt(`assets/glb/${s}.glb`)).then(t=>{const n=t.scene;return n.traverse(i=>{const r=i;if(!r.isMesh)return;r.castShadow=!0,r.receiveShadow=!0;const a=r.material;a&&"envMapIntensity"in a&&(a.envMapIntensity=.85)}),n}),du.set(s,e)),e}const fu=new Map;function pu(s){let e=fu.get(s);return e||(e=Fd(s).then(t=>{t.updateMatrixWorld(!0);const n=[];return t.traverse(i=>{const r=i;if(!r.isMesh||!r.geometry)return;const a=r.geometry.clone();a.applyMatrix4(r.matrixWorld),n.push({geometry:a,material:Array.isArray(r.material)?r.material[0]:r.material})}),n}),fu.set(s,e)),e}function rs(s){return Fd(s).then(e=>e.clone(!0))}const Bv={dart_monkey:"tower_dart",ninja_monkey:"tower_ninja",wizard_monkey:"tower_wizard",sniper_monkey:"tower_sniper",super_monkey:"tower_apex",glue_slinger:"tower_glue"},mu={dart:"gun_dart",shuriken:"gun_shuriken",magic:"gun_staff",laser:"gun_laser",rail:"gun_sniper",glue:"gun_glue",bullet:"gun_sniper"},zv=["marine","odst","spartan","warthog","scorpion"];function No(s,e){return zv.includes(s)?`unit_${s}_${Math.max(0,Math.min(2,e))}`:void 0}const Gv={gun_vg_rifle:{tip:.9,barrel:.022},gun_vg_rifle_scope:{tip:.9,barrel:.022},gun_vg_smg:{tip:.67,barrel:.02},gun_vg_br:{tip:.96,barrel:.022},gun_aegis_beam:{tip:.98,barrel:.02},gun_raider_mg:{tip:2.05,barrel:.1},gun_raider_rotary:{tip:1.16,barrel:0},gun_raider_rotary_cyan:{tip:1.16,barrel:0},gun_scorpion_cannon:{tip:4.73,barrel:0},gun_scorpion_cannon_blue:{tip:4.62,barrel:0}};function Hv(s,e){const t=Math.max(0,Math.min(2,e));switch(s){case"marine":return t?"gun_vg_rifle_scope":"gun_vg_rifle";case"odst":return t?"gun_vg_br":"gun_vg_smg";case"spartan":return t===2?"gun_aegis_beam":"gun_vg_rifle_scope";case"warthog":return["gun_raider_mg","gun_raider_rotary","gun_raider_rotary_cyan"][t];case"scorpion":return t===2?"gun_scorpion_cannon_blue":"gun_scorpion_cannon";default:return}}const gu=new Map,Vv=new Nn;function Fo(s){const e=s;let t=gu.get(e);if(t)return t;const n=s.startsWith("boss_")||s.startsWith("bug_")||s.startsWith("bloon_")?s:s==="bile_titan"?"bug_titan":s==="gargoyle"?"bug_gargoyle":["red","blue","green","yellow","pink","lead","ceramic","moab"].includes(s)?`bloon_${s}`:`bug_${s}`;return t=Vv.load(zt(`assets/v3/${n}.webp`)),t.colorSpace=pt,t.anisotropy=4,gu.set(e,t),t}const Oo={red:"bloon_red",blue:"bloon_blue",green:"bloon_green",yellow:"bloon_yellow",pink:"bloon_pink",lead:"bloon_lead",ceramic:"bloon_ceramic",moab:"bloon_moab",scavenger:"bug_scavenger",hunter:"bug_hunter",charger:"bug_charger",brood:"bug_brood",ironback:"bug_ironback",warden:"bug_warden",gargoyle:"bug_gargoyle",bile_titan:"bug_titan",boss_scarab:"boss_scarab",boss_zeppelin:"boss_zeppelin",boss_dreadnought:"boss_dreadnought",boss_leviathan:"boss_leviathan"},Wv=new Set(["bloon_moab","boss_zeppelin","bug_gargoyle"]),bu=new Map;function Ri(s,e){let t=bu.get(s);if(!t){const n=e();if(t=n.index?n.toNonIndexed():n,!t.getAttribute("uv")){const i=t.getAttribute("position"),r=new Float32Array(i.count*2);for(let a=0;a<i.count;a++)r[a*2]=i.getX(a),r[a*2+1]=i.getZ(a);t.setAttribute("uv",new mt(r,2))}bu.set(s,t)}return t}const jv=()=>{const s=new Ba;for(let e=0;e<10;e++){const t=Math.PI/2+e*Math.PI/5,n=e%2?.45:1;s[e?"lineTo":"moveTo"](Math.cos(t)*n,Math.sin(t)*n)}return new il(s,{depth:1,bevelEnabled:!1}).translate(0,0,-.5)},Xv=new P(0,1,0);class qv{constructor(){this.parts=[],this.head=!1,this.off=[0,0,0],this.pivot=[0,0,0],this.seed=7}rnd(){return this.seed=this.seed*16807%2147483647,this.seed/2147483647}add(e,t,n,i,r={},a){const o=a??new Fn().setFromEuler(new dn(...r.r??[0,0,0],"YZX")),c=new Ge().compose(new P(t[0]+this.off[0],t[1]+this.off[1],t[2]+this.off[2]),o,new P(...n)),l=!!r.glow;this.parts.push({g:e,m:c,c:i,glow:l,head:r.head??this.head,mat:r.mat??Av(i,l)})}box(e,t,n,i,r,a){this.add(Ri("box",()=>new Se(1,1,1)),i,[e,t,n],r,a)}cyl(e,t,n,i,r,a={}){const o=Math.max(e,t,1e-4),c=+(e/o).toFixed(2),l=+(t/o).toFixed(2),h=a.seg??10;this.add(Ri(`c${c}/${l}/${h}`,()=>new Fe(c,l,1,h)),i,[o,n,o],r,a)}sph(e,t,n,i,r,a){this.add(Ri("s",()=>new St(1,12,8)),i,[e,t,n],r,a)}hemi(e,t,n,i,r,a){this.add(Ri("h",()=>new St(1,12,5,0,Math.PI*2,0,Math.PI/2)),i,[e,t,n],r,a)}tor(e,t,n,i,r){const a=+(t/e).toFixed(2);this.add(Ri("t"+a,()=>new Ts(1,a,5,14)),n,[e,e,e],i,r)}star(e,t,n,i,r){this.add(Ri("star",jv),n,[e,e,t],i,r)}limb(e,t,n,i,r={}){const a=new P(...e),o=new P(...t).sub(a),c=o.length(),l=new Fn().setFromUnitVectors(Xv,o.clone().normalize()),h=a.addScaledVector(o,.5),u=r.r2??n,d=Math.max(n,u),f=`c${+(u/d).toFixed(2)}/${+(n/d).toFixed(2)}/${r.seg??7}`;this.add(Ri(f,()=>new Fe(u/d,n/d,1,r.seg??7)),[h.x,h.y,h.z],[d,c,d],i,r,l)}chain(e,t,n,i={}){for(let r=0;r<e.length-1;r++){const a=i.taper??1,o=t*Math.pow(a,r),c=t*Math.pow(a,r+1);this.limb(e[r],e[r+1],o,n,{...i,r2:c}),this.sph(c,c,c,e[r+1],n,i)}}barrel(e,t,n,i,r){this.limb(e,[e[0]+t,e[1],e[2]],n,i,{seg:8,...r})}leaf(e,t,n,i,r=.35,a=.42){const o=Math.cos(t),c=-Math.sin(t);this.sph(n,.035,n*a,[e[0]+o*n*.85,e[1]+Math.sin(r)*n*.6,e[2]+c*n*.85],i,{r:[0,t,r]})}ring(e,t,n,i,r=0){for(let a=0;a<e;a++){const o=r+a/e*Math.PI*2;i(Math.cos(o)*t,Math.sin(o)*t,o,a)}}}const ct={fur:7031343,face:14267530,dirt:4862755,grass:5212716,leaf:4161322,wood:8016434,gold:14725168};function Ln(s,e=1,t=ct.dirt){s.cyl(e*.85,e,.3,[0,.15,0],t,{seg:12});for(let n=0;n<7;n++){const i=n*.9+.3,r=e*(.55+.4*s.rnd());s.cyl(0,.06,.25,[Math.cos(i)*r,.38,Math.sin(i)*r],ct.grass,{seg:4})}}function Zs(s,e=7169370){s.cyl(.85,.95,.18,[0,.09,0],e,{seg:12})}function mi(s,e){const t=e.fur??ct.fur,n=e.face??ct.face,i=e.legs??e.torso,r=e.arms??e.torso,a=e.boots??2826777,o=e.crouch?-.38:0;if(e.robe)s.cyl(.34,.6,1.15,[0,.58,0],e.torso,{seg:10}),e.trim&&s.tor(.59,.035,[0,.04,0],e.trim,{r:[Math.PI/2,0,0]});else for(const f of[1,-1]){const b=e.crouch?f>0?[[-.05,.6,.18],[.38,.55,.22],[.25,.08,.22]]:[[-.05,.6,-.18],[.05,.12,-.2],[-.42,.1,-.2]]:[[0,.95,.17*f],[.12,.5,.2*f],[0,.1,.2*f]];s.chain(b,.12,i,{taper:.85});const v=b[2];s.box(.36,.15,.18,[v[0]+.08,.075,v[2]],a)}if(s.sph(.34,.47,.38,[0,1.36+o,0],e.torso),s.sph(.2,.26,.26,[.17,1.28+o,0],e.armor??n),e.armor){s.sph(.3,.37,.35,[.07,1.42+o,0],e.armor);for(const f of[1,-1])s.sph(.17,.13,.19,[0,1.73+o,.42*f],e.armor)}e.belt&&s.tor(.33,.05,[0,1.05+o,0],e.belt,{r:[Math.PI/2,0,0]}),e.scarf&&(s.tor(.23,.07,[0,1.76+o,0],e.scarf,{r:[Math.PI/2,0,0]}),s.chain([[-.15,1.75+o,.08],[-.4,1.55+o,.18],[-.55,1.3+o,.12]],.06,e.scarf)),e.gem&&s.sph(.08,.08,.08,[.36,1.48+o,0],e.gem,{glow:!0}),e.pack&&s.box(.3,.55,.48,[-.38,1.4+o,0],e.pack),e.cape&&s.box(.06,1.35,.85,[-.42,1.15+o,0],e.cape,{r:[0,0,-.22]});const c=1.68+o,l=e.punch?[.78,c-.05,.3]:[.52,1.42+o,.32],h=e.punch?[.3,1.25+o,-.45]:[.48,1.4+o,-.22];s.chain([[0,c,.4],e.punch?[.4,c-.02,.38]:[.2,1.36+o,.47],l],.1,r,{taper:.85}),s.chain([[0,c,-.4],e.punch?[.05,1.35+o,-.5]:[.22,1.33+o,-.47],h],.1,r,{taper:.85}),s.sph(.1,.1,.1,l,n),s.sph(.1,.1,.1,h,n);const u=2.06+o;s.sph(.31,.31,.31,[0,u,0],t),s.sph(.16,.21,.24,[.19,u-.03,0],n),s.sph(.12,.1,.16,[.3,u-.1,0],n);for(const f of[1,-1])s.sph(.045,.045,.045,[.33,u+.05,.09*f],1118481),s.sph(.05,.11,.1,[0,u+.02,.31*f],n);s.box(.06,.04,.3,[.32,u+.11,0],t),s.chain([[-.28,1+o,0],[-.62,.78+o,.06],[-.88,1.02+o,.1],[-.85,1.4+o,.1]],.055,t);const d=e.hatC??e.torso;switch(e.hat){case"wizard":s.cyl(.5,.5,.05,[0,u+.2,0],d,{seg:12}),s.cyl(0,.33,.8,[-.04,u+.6,0],d,{r:[0,0,.22]});break;case"cowboy":s.cyl(.52,.52,.04,[0,u+.22,0],d,{seg:12}),s.cyl(.24,.29,.26,[0,u+.36,0],d);break;case"hood":s.sph(.34,.35,.35,[-.07,u+.03,0],d);break;case"ninja":s.sph(.34,.35,.35,[-.07,u+.03,0],d),s.box(.12,.12,.42,[.26,u-.08,0],d),s.chain([[-.3,u+.05,0],[-.6,u-.1,.1],[-.75,u-.3,.05]],.04,d);break;case"helmet":s.hemi(.36,.3,.36,[-.02,u+.04,0],d);break;case"hazmat":s.sph(.4,.4,.4,[0,u,0],d),s.sph(.12,.2,.28,[.3,u,0],10148095,{glow:!0});break}if(e.ghillie)for(let f=0;f<26;f++){const b=s.rnd()*6.28,v=.9+s.rnd()*1.3+o,p=.32+s.rnd()*.12;s.sph(.11,.09,.11,[Math.cos(b)*p*.8-.05,v,Math.sin(b)*p],f%3?e.ghillie:6978106)}return{rh:l,lh:h}}const it=(s,e,t,n)=>[s[0]+e,s[1]+t,s[2]+n];function ko(s,e){s.head=!1,s.cyl(1.15,1.28,.75,[0,.38,0],[5462605,5001800,4672322][e],{seg:8}),s.cyl(.72,.8,.14,[0,.82,0],3356719,{seg:8}),s.box(.1,.22,.6,[1.17,.38,0],e?5929664:3828432,{glow:e===0}),e>=1&&s.ring(4,1.12,0,(t,n,i)=>s.box(.35,.5,.06,[t,.4,n],4080185,{r:[0,-i+Math.PI/2,0]}),Math.PI/4),e>=2&&s.ring(16,1.22,0,(t,n,i,r)=>s.box(.08,.12,.42,[t,.6,n],r%2?14196768:2236962,{r:[0,-i,0]})),s.pivot=[0,1.15,0],s.head=!0}const Yv={dart_monkey(s,e){Zs(s),s.head=!0,s.off=[0,.18,0];const{rh:t,lh:n}=mi(s,{torso:[5913120,5190688,9080728][e],legs:4864554,armor:e===2?12172998:void 0,scarf:e===1?2771594:void 0,belt:e>=1?3811866:void 0,gem:e===2?16762954:void 0,pack:e>=1?4861976:void 0}),i=e+1;for(let r=0;r<i;r++){const a=(r-(i-1)/2)*.07;s.barrel(it(t,-.1,.04,a),.5,.022,9071168),s.cyl(0,.045,.14,it(t,.47,.04,a),e===2?ct.gold:10133672,{r:[0,0,-Math.PI/2]}),s.box(.08,.08,.01,it(t,-.08,.04,a),12595248)}s.sph(.06,.06,.06,n,9071168)},ninja_monkey(s,e){Zs(s,4868690),s.head=!0,s.off=[0,.18,0];const t=[1842466,1977436,8133917][e],{rh:n,lh:i}=mi(s,{torso:t,legs:t,hat:"ninja",hatC:e===2?5903380:1579036,belt:e>=1?11545130:3355443,armor:e===2?3806485:void 0,scarf:e===2?13934624:void 0}),r=e===2?16762944:10528430;s.star(.17,.03,it(n,.12,.05,0),r,{r:[0,Math.PI/2,0],glow:e===2}),e>=1&&s.star(.15,.03,it(i,.1,.06,0),r,{r:[0,Math.PI/2,.4],glow:e===2}),e>=1&&s.limb([-.4,1.3,-.15],[-.25,2.2,.2],.035,2763306)},wizard_monkey(s,e){Zs(s,5919848),s.head=!0,s.off=[0,.18,0];const t=[3100559,5910410,14275302][e],n=[10137824,ct.gold,6961824][e],{rh:i,lh:r}=mi(s,{torso:t,robe:!0,trim:n,hat:"wizard",hatC:e===2?9071304:t,belt:n});s.limb(it(r,0,-1.25,0),it(r,0,.75+e*.12,0),.04,6965802);const a=it(r,0,.9+e*.12,0),o=.1+e*.03;s.cyl(0,o,o*1.6,it(a,0,o*.8,0),11563263,{glow:!0,seg:6}),s.cyl(o,0,o*1.2,it(a,0,-o*.6,0),9457888,{glow:!0,seg:6}),e>=1&&s.tor(o*1.3,.02,a,ct.gold,{r:[Math.PI/2,0,0]}),e>=1&&(s.box(.26,.07,.34,it(i,.08,0,0),5909018),s.box(.22,.02,.3,it(i,.08,.045,0),15786160,{glow:!0})),e===2&&s.ring(3,.75,0,(c,l)=>s.sph(.08,.08,.08,[c,2.4,l],13672703,{glow:!0}))},super_monkey(s,e){s.cyl(.9,.9,.04,[0,.03,0],[12593706,3832528,14725168][e],{glow:!0,seg:16}),s.cyl(.7,.7,.05,[0,.04,0],3158064,{seg:16}),s.head=!0,s.off=[0,.55,0];const t=[12593706,2047903,14200896][e],n=[2767514,1714794,13146672][e];mi(s,{torso:t,legs:n,arms:t,cape:[11542046,1714794,14198832][e],armor:e>=1?[0,3828432,15782e3][e]:void 0,gem:e>=1?[0,7000319,16777215][e]:16764992,punch:!0,boots:[11542046,1384522,11567136][e],hat:e===1?"helmet":"none",hatC:2771632})},money_monkey(s,e){s.box(1,.09,1.9,[.15,.86,0],6963238);for(const i of[1,-1])s.box(.9,.8,.45,[.15,.4,.68*i],5911584);if(s.box(.45,.9,.6,[-.95,.75,0],2763306),s.off=[-.7,-.4,0],mi(s,{torso:[8018490,15658734,2237738][e],arms:[8018490,15658734,2237738][e],legs:3355443}),e>=1&&s.box(.03,.4,.08,[.36,1.33,0],e===2?9050650:2771594),s.off=[0,0,0],e===0)s.box(.4,.03,.5,[.05,.92,0],3355443),s.box(.03,.32,.5,[.25,1.08,0],3355443,{r:[0,0,.25]}),s.box(.02,.27,.44,[.235,1.08,0],8040703,{r:[0,0,.25],glow:!0});else for(const i of e===2?[-.5,0,.5]:[-.3,.3])s.box(.06,.42,.5,[.35,1.22,i],2236962),s.box(.02,.36,.44,[.31,1.22,i],2787914,{glow:!0}),s.box(.06,.25,.06,[.38,.98,i],2236962);const n=e===0?2:e===1?3:5;for(let i=0;i<n;i++)s.cyl(.11,.11,.1+i*.05,[.45,.95+i*.025,-.75+i*.12],ct.gold,{seg:10});if(e>=1&&s.sph(.2,.24,.2,[.4,1.12,.78],11569744),e===2){s.box(.7,2,.75,[-.6,1,-1.3],1842980);for(let i=0;i<6;i++)s.box(.02,.05,.5,[-.24,.35+i*.28,-1.3],i%2?4259712:4235519,{glow:!0});s.ring(7,.5,0,(i,r)=>s.cyl(0,.32,.4+s.rnd()*.25,[.9+i,.2,1.2+r],ct.gold,{seg:7})),s.box(.6,.6,.6,[.9,.3,-1.2],9075280),s.cyl(.08,.08,.05,[1.21,.35,-1.2],3355443,{r:[0,0,Math.PI/2]})}},solar_pea_fusion(s,e){Ln(s);for(let r=0;r<6;r++)s.leaf([0,.35,0],r*1.05+.3,.55+.1*e,ct.leaf,.25);s.chain([[0,.3,0],[-.08,.9,0],[.02,1.5,0]],.1,4885034),s.leaf([0,1,0],2,.4,ct.leaf,.5),s.leaf([0,1,0],-1.1,.4,ct.leaf,.5),s.pivot=[.02,1.75,0],s.head=!0;const t=1.75;if(e===0){s.sph(.45,.42,.42,[0,t,0],5933610);for(const r of[-.18,0,.18])s.tor(.4,.02,[r,t,0],3828250,{r:[0,Math.PI/2,0]})}else s.sph(.4,.4,.4,[-.1,t,0],6967328),s.ring(12,.55+e*.08,0,(r,a,o)=>s.sph(.05,.12,.26,[-.12,t+r,a],16106776,{r:[o,0,0]}));const n=e+1,i=n===1?[0]:n===2?[-.24,.24]:[-.38,0,.38];for(const r of i)s.barrel([.15,t,r],.45,.19,14266416,{seg:12}),s.cyl(.16,.16,.04,[.61,t,r],16773232,{r:[0,0,Math.PI/2],glow:!0})},gatling_cherry_bomber(s,e){Ln(s);const t=[4880938,6965802,5913120][e];e===0?s.chain([[0,.3,0],[-.1,.7,.05],[0,1.05,0]],.08,t):s.cyl(.2+e*.06,.42+e*.12,.9+e*.1,[0,.7,0],t,{seg:7});for(let a=0;a<5;a++)s.leaf([0,.35,0],a*1.3,.5,ct.leaf,.3);s.pivot=[0,1.25+e*.15,0],s.head=!0;const n=s.pivot[1],i=[5933626,5933626,3820074][e];s.ring(6,.2+e*.03,0,(a,o)=>s.barrel([-.35,n+a,o],1.15+e*.15,.1+e*.015,i,{seg:7}));for(const a of[-.15,.3,.65])s.tor(.33+e*.05,.05,[a,n,0],6965802,{r:[0,Math.PI/2,0]});const r=2+e*3;for(let a=0;a<r;a++){const o=(a%2?1:-1)*(.32+(a>>1)*.12),c=-.3+(a>>1)*.18,l=n-.35-a%3*.08;s.sph(.14,.14,.14,[c,l,o],12588060),s.limb([c,l+.12,o],[c-.05,n+.15,o*.6],.015,3828250)}},flame_melon_mortar(s,e){Ln(s,1,e===2?2759960:ct.dirt),e===2&&s.ring(6,.6,0,(c,l,h)=>s.box(.5,.03,.06,[c,.31,l],16732176,{r:[0,-h,0],glow:!0})),s.head=!0;const t=[5917226,4864548,3811872][e],n=.2+e*.06,i=[.45,2.05+e*.1,0];s.chain([[0,.25,0],[-.25,.9,0],[.05,1.6,0],i],n,t,{taper:.85}),e>=1&&s.chain([[.02,.25,.1],[-.2,1,.12]],.05,16738848,{glow:!0}),s.cyl(.45,.2,.3,it(i,.05,.1,0),4876842);const r=e===2?2779786:3111471;s.sph(.3,.28,.3,it(i,.05,.32,0),r);for(const c of[-.6,0,.6])s.tor(.29,.02,it(i,.05,.32,0),1722906,{r:[0,c,0]});const a=e===2?6342911:16747040,o=3+e*2;for(let c=0;c<o;c++){const l=c/o*6.28;s.cyl(0,.08+.02*e,.25+.1*e+s.rnd()*.15,it(i,.05+Math.cos(l)*.15,.62+.1*e,Math.sin(l)*.15),c%2?a:16764992,{glow:!0,seg:5})}},star_emperor(s,e){Ln(s);const t=[4160042,2775706,3811962][e],n=[5937722,4881088,5913248][e];for(let i=0;i<4;i++)s.ring(7,.15,0,(r,a,o)=>s.leaf([0,.4+i*.42,0],o+i*.4,.75-i*.14,i%2?t:n,.7-i*.05,.35));s.cyl(.08,.14,1.9,[0,1.1,0],3824170),s.pivot=[0,2.35,0],s.head=!0,s.star(.42,.14,[0,2.35,0],16764976,{r:[0,Math.PI/2,0]}),s.sph(.12,.12,.12,[.06,2.35,0],16774816,{glow:!0}),e===2&&(s.cyl(.2,.16,.16,[0,2.86,0],ct.gold),s.ring(5,.18,0,(i,r)=>s.cyl(0,.04,.16,[i,3,r],ct.gold,{seg:4})),s.ring(6,.9,0,(i,r)=>s.sph(.05,.05,.05,[i,1.6+Math.abs(i),r],16773280,{glow:!0})))},frost_wallnut_bastion(s,e){Ln(s,1.2,e?3814448:ct.dirt),s.head=!0;const t=e===0?1:.82;s.sph(t,t*.95,t,[0,t*.95,0],9068608);for(const n of[0,.9,1.8,2.6])s.tor(t*.98,.05,[0,t*.95,0],5913124,{r:[Math.PI/2+.3,n,0]});if(e===0)for(let n=0;n<6;n++)s.cyl(0,.08,.35,[Math.cos(n)*.5,1.8,Math.sin(n)*.5],14217471,{seg:4,r:[.3,n,0]});else{const n=e===1?9:14;for(let i=0;i<n;i++){const r=i/n*6.28+i%2*.2,a=.95+s.rnd()*.3,o=(e===1?1.2:1.8)+s.rnd()*(e===1?.6:1.1);s.cyl(0,.18+s.rnd()*.1,o,[Math.cos(r)*a,o/2+.2,Math.sin(r)*a],i%3?9097471:13167871,{seg:5,r:[0,0,0],glow:e===2&&i%4===0})}e===2&&s.sph(.35,.35,.35,[0,2.1,0],6340863,{glow:!0})}},unsc_autoturret(s,e){ko(s,e);const t=1.15,n=[5922896,5593420,5001286][e];s.sph(.6+e*.06,.48,.6+e*.06,[0,t,0],n),s.box(.5,.35,.9,[-.1,t+.15,0],4606784);const i=e===2?[-.18,.18]:[0];for(const r of i)s.barrel([.4,t,r],1.1+e*.2,.09,2764078),s.cyl(.13,.13,.22,[1.5+e*.2,t,r],1974306,{r:[0,0,Math.PI/2],seg:8});if(e>=1)for(const r of[1,-1])s.box(.6,.35,.08,[.1,t,.62*r],4080185);e===2&&(s.cyl(.08,.08,.35,[.1,t+.5,0],2236962,{r:[0,0,Math.PI/2]}),s.cyl(.06,.06,.02,[.28,t+.5,0],16732240,{r:[0,0,Math.PI/2],glow:!0}))},unsc_flak(s,e){ko(s,e);const t=1.15;s.sph(.6,.52,.65,[0,t,0],[5791311,5462089,5001286][e]),s.box(.4,.3,.5,[-.25,t+.3,0],4606784);const n=e===0?[0]:e===1?[-.32,.32]:[-.36,-.18,.18,.36],i=e===2?.07:.1;for(const r of n)s.barrel([.3,t,r],1.05+e*.1,i,2764078),s.cyl(i*1.5,i*1.5,.25,[1.3+e*.1,t,r],1974306,{r:[0,0,Math.PI/2],seg:8});if(e>=1)for(const r of[1,-1])s.sph(.3,.3,.2,[0,t,.62*r],4212028);e===2&&(s.box(.25,.14,.2,[-.2,t+.55,0],3828479,{glow:!0}),s.tor(.62,.03,[0,t-.1,0],14196768,{r:[Math.PI/2,0,0]}))},unsc_rail(s,e){ko(s,e);const t=1.2;s.sph(.95,.42,.5,[-.1,t,0],[5922920,5593954,4869973][e]),s.box(.9,.2,.6,[-.3,t+.3,0],4212043);for(const i of[1,-1])s.box(1.7+e*.2,.1,.07,[1.35+e*.1,t,.13*i],2764080);const n=6+e*2;for(let i=0;i<n;i++)s.tor(.13,.035,[.65+i*.22,t,0],4251903,{r:[0,Math.PI/2,0],glow:!0});if(s.barrel([.5,t,0],1.7+e*.2,.05,10155263,{glow:!0}),e>=1)for(const i of[1,-1])s.sph(.45,.15,.15,[-.1,t,.62*i],5264732),s.limb([-.1,t,.5*i],[-.1,t,.3*i],.05,3355443);if(e===2){s.sph(.2,.2,.2,[.45,t,0],8454143,{glow:!0});for(const i of[1,-1])s.box(1.2,.04,.04,[-.1,t+.2,.5*i],14196768)}},unsc_firebase(s,e){const t=[5988181,5198668,4606532][e];s.ring(16,1.45,0,(n,i,r)=>s.sph(.32,.18,.2,[n,.17,i],11049584,{r:[0,-r+Math.PI/2,0]})),s.ring(14,1.42,0,(n,i,r)=>s.sph(.32,.17,.2,[n,.45,i],10128484,{r:[0,-r+Math.PI/2,0]}),.2),s.box(2.1,1,1.9,[0,.5,0],t),s.box(2.3,.14,2.1,[0,1.06,0],4080187),s.box(.06,.16,1.2,[1.06,.72,0],1118481),e===0&&(s.limb([-.8,1.1,-.7],[-.8,2.6,-.7],.03,8947848),s.box(.04,.45,.7,[-.8,2.35,-.35],2775728),s.sph(.1,.1,.02,[-.78,2.35,-.35],16777215)),e===2&&(s.box(.9,1,.9,[-.3,1.6,0],4080187),s.box(.92,.1,.92,[-.3,2.13,0],2764072),s.limb([-.3,2.1,0],[-.3,3.4,0],.03,10066329),s.sph(.06,.06,.06,[-.3,3.42,0],16724016,{glow:!0}),s.box(.05,.5,.5,[1.06,.3,.6],16752704,{glow:!0}),s.ring(4,1,0,(n,i)=>s.sph(.05,.05,.05,[n*1.05,1.17,i*.95],16764992,{glow:!0}),Math.PI/4)),e>=1&&(s.pivot=[.5,1.2,.5],s.head=!0,s.cyl(.05,.05,.35,[.5,1.3,.5],6710886),s.hemi(.45,.18,.45,[.62,1.55,.5],11580592,{r:[0,0,-1.2]}),s.limb([.62,1.55,.5],[.95,1.65,.5],.02,3355443))},unsc_depot(s,e){s.box(2.4,.22,2.4,[0,.11,0],5592910),s.ring(4,1.2,0,(n,i,r)=>s.box(.08,.04,1.6,[n,.23,i],14196768,{r:[0,-r,0]}));const t=5922880;if(s.box(.7,.55,.7,[-.6,.5,-.55],t),s.box(.7,.55,.7,[-.6,.5,.25],t),s.box(.6,.45,.6,[-.6,1,-.15],5133368),s.cyl(.22,.22,.6,[.75,.52,-.75],3820074),s.cyl(.22,.22,.6,[.75,.52,-.25],3820074),e>=1){s.box(.9,.85,1.6,[.55,.65,.4],4876938);for(let n=0;n<6;n++)s.box(.92,.8,.03,[.55,.65,-.35+n*.25],3824250);s.limb([-.95,.2,.95],[-.95,2.4,.95],.08,14196768),s.limb([-.95,2.35,.95],[.4,2.1,.2],.06,14196768),s.limb([.4,2.1,.2],[.4,1.4,.2],.01,2236962)}e===2&&(s.sph(.5,.85,.5,[.1,1.95,-.2],9079418),s.cyl(.35,.5,.3,[.1,1.15,-.2],4473924),s.limb([1,.2,-1],[1,2.8,-1],.035,10066329),s.sph(.07,.07,.07,[1,2.85,-1],16752688,{glow:!0}),s.ring(4,1.55,0,(n,i)=>s.sph(.06,.06,.06,[n*.75,.26,i*.75],16752688,{glow:!0}),Math.PI/4))},sniper_monkey(s,e){s.head=!0;for(let r=0;r<3;r++)for(let a=0;a<2;a++)s.sph(.3,.16,.22,[.95,.16+a*.3,(r-1)*.42+a*.2],11049584);const t=[4872746,5200442,2369066][e],{rh:n}=mi(s,{torso:t,legs:t,crouch:!0,ghillie:e===0?5925418:void 0,hat:e===0?"hood":"helmet",hatC:[5596458,4870709,1579292][e],pack:e>=1?3817258:void 0,belt:e>=1?2763290:void 0}),i=[.15,n[1]+.08,.1];s.box(.75,.13,.08,[i[0]+.25,i[1],i[2]],2763306),s.barrel([i[0]+.6,i[1]+.02,i[2]],.9+e*.15,.03,1710618),s.cyl(.05,.05,.35,[i[0]+.35,i[1]+.12,i[2]],1118481,{r:[0,0,Math.PI/2]}),s.box(.3,.12,.07,[i[0]-.2,i[1]-.04,i[2]],e?3355443:6965802),s.limb([i[0]+1.2,i[1]-.02,i[2]],[i[0]+1.25,i[1]-.35,i[2]+.12],.012,2236962),s.limb([i[0]+1.2,i[1]-.02,i[2]],[i[0]+1.25,i[1]-.35,i[2]-.12],.012,2236962),e===2&&s.barrel([i[0]+1.5,i[1]-.05,i[2]],1.6,.012,16724016,{glow:!0})},glue_slinger(s,e){Zs(s,5921354),s.head=!0,s.off=[0,.18,0];const{rh:t,lh:n}=mi(s,{torso:[7031343,5913124,14729248][e],legs:e===2?14729248:4864554,arms:e===2?14729248:void 0,hat:e===2?"hazmat":"none",hatC:14729248,pack:e===2?13150232:void 0,boots:e===2?2236962:void 0});if(e===1&&s.box(.08,.8,.5,[.37,1.25,0],3811872),e===0)s.limb(t,it(t,.15,.2,.08),.025,6965802),s.limb(t,it(t,.15,.2,-.08),.025,6965802),s.limb(it(t,-.05,-.15,0),t,.03,6965802),s.cyl(.18,.15,.3,[.2,.33,-.55],7829367),s.cyl(.16,.16,.02,[.2,.49,-.55],9109312,{glow:!0});else{const i=e===1?.45:.8,r=e===1?.07:.12;s.barrel(it(t,-.15,0,-.05),i,r,e===1?3824170:3355443),s.sph(r*1.6,r*1.6,r*1.6,it(t,0,.12,-.05),7000112),s.cyl(r*.8,r*.8,.04,it(t,i-.15,0,-.05),9109312,{r:[0,0,Math.PI/2],glow:!0}),s.sph(.06,.06,.06,n,9109312)}},banana_drop(s,e){const t=n=>{for(let i=0;i<4;i++)s.tor(.13,.035,[n[0]+(i-1.5)*.08,n[1],n[2]],15781920,{r:[0,Math.PI/2,i*.3]})};if(e===0){s.box(2,.15,2,[0,.08,0],8018490);for(const[n,i]of[[-.45,-.45],[.45,-.45],[-.45,.45],[.45,.45]])s.box(.8,.55,.8,[n,.43,i],ct.wood),t([n,.75,i]);s.limb([-.8,.2,-.8],[-.8,2.6,-.8],.03,6965802),s.box(.04,.6,.8,[-.8,2.25,-.4],15657176),t([-.76,2.25,-.4])}else if(e===1){s.box(1.8,.08,1.4,[0,1,0],ct.wood);for(const n of[-.8,.8])for(const i of[-.6,.6])s.limb([n,0,i],[n,1,i],.05,5913120);s.box(.7,.45,.6,[-.3,1.27,0],ct.wood),t([-.3,1.55,0]),t([.4,1.12,.2]),s.limb([.6,1,-.4],[.6,2.7,-.4],.03,14540253),s.ring(8,0,0,(n,i,r,a)=>s.cyl(0,.9,.45,[.6,2.55,-.4],a%2?15781952:4889146,{seg:8,r:[0,r,0]}))}else{s.cyl(1.25,1.35,.3,[0,.15,0],3816768,{seg:8}),s.ring(8,1.2,0,(n,i,r,a)=>s.box(.06,.06,.5,[n,.32,i],a%2?14196768:2236962,{r:[0,-r,0]}));for(const[n,i]of[[-.5,.5],[.5,.6],[.2,-.6]])s.box(.6,.5,.6,[n,.55,i],14196768),t([n,.85,i]);s.limb([-.8,.3,-.6],[-.8,2.6,-.6],.08,5592405),s.limb([-.8,2.55,-.6],[.4,2.3,0],.06,5592405),s.sph(.08,.08,.08,[-.8,2.7,-.6],16752688,{glow:!0}),s.ring(4,1,0,(n,i)=>s.sph(.06,.06,.06,[n,.36,i],4259712,{glow:!0}),Math.PI/4)}},sunflower(s,e){Ln(s);for(let n=0;n<6;n++)s.leaf([0,.35,0],n*1.05,.5,ct.leaf,.3);const t=(n,i)=>{s.cyl(.32*i,.32*i,.14*i,n,6963232,{r:[0,0,Math.PI/2],seg:14}),s.ring(14,.42*i,0,(r,a,o)=>s.sph(.05*i,.24*i,.11*i,[n[0]-.02,n[1]+r,n[2]+a],e===2?16764992:16106776,{r:[o-Math.PI/2,0,0]}));for(const r of[-.1,.1])s.sph(.04*i,.06*i,.04*i,[n[0]+.08*i,n[1]+.06*i,n[2]+r*i],1118481);s.tor(.1*i,.02,[n[0]+.08*i,n[1]-.08*i,n[2]],1118481,{r:[0,Math.PI/2,0]}),e===2&&s.sph(.12*i,.3*i,.3*i,[n[0]+.02,n[1],n[2]],16770688,{glow:!0})};s.chain([[0,.3,0],[-.05,1,0],[.05,1.7,0]],.07,4885034),s.leaf([0,.95,0],1.6,.4,ct.leaf,.4),s.leaf([0,1.2,0],-1.5,.35,ct.leaf,.4),e===1&&(s.chain([[0,.3,.1],[.05,.9,.35],[.1,1.15,.45]],.05,4885034),t([.15,1.2,.45],.75)),s.pivot=[.05,1.95,0],s.head=!0,t([.08,1.95,0],e===2?1.35:1.05)},repeater_gatling(s,e){Ln(s);for(let i=0;i<7;i++)s.leaf([0,.35,0],i*.9,.55,ct.leaf,.3);if(e===0){for(const i of[-.33,.33])s.chain([[0,.3,i*.5],[-.05,.9,i],[0,1.25,i]],.07,4885034),s.leaf([0,.9,i],i>0?-1.4:1.4,.3,ct.leaf);s.pivot=[0,1.4,0],s.head=!0;for(const i of[-.33,.33]){s.sph(.3,.3,.3,[0,1.4,i],6991914),s.barrel([.15,1.4,i],.4,.13,6991914),s.cyl(.11,.11,.02,[.56,1.4,i],1718794,{r:[0,0,Math.PI/2]});for(const r of[-.08,.08])s.sph(.04,.06,.04,[.24,1.5,i+r],1118481)}return}const t=e===1?6965802:11569728;s.cyl(.3,.5,.9,[0,.75,0],5913120,{seg:7}),s.pivot=[0,1.45,0],s.head=!0;const n=1.45;s.barrel([-.55,n,0],.9,.36,t,{seg:10}),s.tor(.37,.05,[-.1,n,0],3811860,{r:[0,Math.PI/2,0]}),s.ring(6,.17,0,(i,r)=>s.barrel([.3,n+i,r],.75,.07,3355443,{seg:6})),s.cyl(.28,.28,.06,[1.05,n,0],e===2?9109312:3355443,{r:[0,0,Math.PI/2],glow:e===2});for(let i=0;i<8;i++){const r=i*.45;s.sph(.09,.09,.09,[-.25+Math.sin(r)*.1,n-.4-Math.sin(r)*.25,.42+Math.cos(r)*.05-i*.04],8048688)}if(e===2)for(const i of[1,-1])s.leaf([-.4,n+.2,.2*i],i>0?-2.3:2.3,.6,13148224,.6)},wallnut_barrier(s){Ln(s,1);for(let e=0;e<6;e++)s.chain([[0,.5,0],[Math.cos(e)*.6,.25,Math.sin(e)*.6],[Math.cos(e)*.9,.05,Math.sin(e)*.9]],.06,6965802);s.head=!0,s.sph(.72,.95,.68,[0,1.1,0],10119738),s.tor(.69,.03,[0,1.1,0],6964262,{r:[Math.PI/2,0,.2]});for(const e of[-.2,.2])s.sph(.1,.12,.08,[.63,1.25,e],16050896),s.sph(.05,.06,.05,[.72,1.24,e],1118481),s.box(.04,.05,.22,[.68,1.42,e*1.1],3810836,{r:[e>0?-.4:.4,0,0]});s.box(.04,.04,.24,[.7,.92,0],3810836);for(let e=0;e<5;e++)s.leaf([0,2,0],e*1.25,.45,ct.leaf,.5)},cherry_pod(s){s.hemi(.95,.4,.75,[0,.4,0],8018490,{r:[Math.PI,0,0]}),s.tor(.9,.06,[0,.4,0],6965802,{r:[Math.PI/2,0,0]}),s.head=!0;for(const e of[-.38,.38]){s.sph(.45,.43,.45,[0,.75,e],12588060),s.sph(.12,.08,.12,[-.15,1.05,e-.1],16744576);for(const t of[-.1,.1])s.sph(.06,.06,.04,[.41,.85,e+t],1118481);s.box(.04,.04,.16,[.42,.97,e],2755082,{r:[e>0?-.5:.5,0,0]}),s.box(.04,.04,.2,[.43,.6,e],2755082),s.chain([[0,1.15,e*.9],[.05,1.6,e*.3],[.1,1.85,0]],.03,3832346)}s.sph(.14,.14,.14,[.1,1.95,0],16764992,{glow:!0}),s.ring(6,.18,0,(e,t)=>s.cyl(0,.03,.2,[.1+e,1.95,t],16744480,{glow:!0,seg:4,r:[t*5,0,-e*5]}))},stone_wall(s,e){const t=[6973024,6183509,4868165][e],n=.9+e*.25;if(s.ring(12,1.35,0,(i,r,a)=>s.sph(.32,.17,.2,[i*1.05,.17,r*.95],11049584,{r:[0,-a+Math.PI/2,0]})),s.box(2.2,n,.32,[0,n/2,.8],t),s.box(2.2,n,.32,[0,n/2,-.8],t),s.box(.32,n,1.9,[.95,n/2,0],t),s.box(.32,n,1.9,[-.95,n/2,0],t),s.box(1.7,.1,1.3,[0,.12,0],4866102),e>=1){for(let i=0;i<5;i++)s.box(.28,.25,.36,[-.88+i*.44,n+.12,.8],t),s.box(.28,.25,.36,[-.88+i*.44,n+.12,-.8],t);s.box(.05,.6,.45,[1.12,.3,0],2760728)}e===2&&(s.box(.9,1.9,.9,[-.2,.95,0],4078650),s.box(.92,.06,.92,[-.2,1.4,0],4235519,{glow:!0}),s.box(1,.12,1,[-.2,1.95,0],2763306),s.limb([-.2,2,0],[-.2,3.1,0],.03,10066329),s.sph(.06,.06,.06,[-.2,3.12,0],16724016,{glow:!0}))},boomerang_monkey(s,e){Zs(s),s.head=!0,s.off=[0,.18,0];const{rh:t}=mi(s,{torso:[6965802,4863008,10119728][e],legs:4864554,hat:e===1?"cowboy":"none",hatC:5913120,belt:e===1?2759184:void 0,armor:e===2?11567168:void 0,scarf:e===1?9054762:void 0}),n=e===2?16762944:9067050;s.box(.42,.04,.1,it(t,.12,.12,.08),n,{r:[0,0,.6],glow:e===2}),s.box(.42,.04,.1,it(t,.12,-.08,.08),n,{r:[0,0,-.6],glow:e===2}),e>=1&&s.limb([-.3,1,-.3],[-.3,1.9,-.25],.025,6965802)},hypno_shroom(s,e){Ln(s,1,4864570),s.cyl(.38,.55,1.2,[0,.75,0],15784160,{seg:10});for(const t of[-.15,.15])s.sph(.05,.07,.05,[.45,1.05,t],2759210),s.box(.02,.02,.1,[.46,1.13,t],2759210,{r:[t>0?.3:-.3,0,0]});s.hemi(1.15,.8,1.15,[0,1.25,0],[14704816,15231168,15757504][e]),s.cyl(1.1,1.15,.06,[0,1.24,0],13127834,{seg:12});for(let t=0;t<4;t++){const n=.2+t*.22;s.tor(n,.04,[0,1.27+.8*Math.sqrt(Math.max(0,1-(n/1.15)**2)),0],9054896,{r:[Math.PI/2,0,0]})}if(e>=1&&s.ring(e===1?3:6,.95,0,(t,n,i,r)=>{const a=.3+r%3*.08;s.cyl(.06,.08,a,[t,.3+a/2,n],15784160),s.hemi(a*.7,a*.5,a*.7,[t,.3+a,n],13652160)},.5),e===2)for(let t=0;t<8;t++)s.sph(.05,.05,.05,[Math.cos(t)*1.2,1.5+t%3*.4,Math.sin(t)*1.2],16744703,{glow:!0})},chomper(s,e){Ln(s);for(let i=0;i<6;i++)s.leaf([0,.35,0],i*1.05,.6,3832362,.3);const t=[8006266,5904986,4856394][e];if(e===2){s.sph(.45,.6,.45,[0,1,0],3811898),s.tor(.42,.05,[0,1.15,0],ct.gold,{r:[Math.PI/2,0,0]});for(const i of[1,-1])s.chain([[0,1,.25*i],[.1,.5,.3*i],[0,.1,.3*i]],.12,3811898)}else s.chain([[0,.3,0],[-.15,.9,0],[0,1.45,0]],.1,3832362);if(e>=1)for(const i of[1,-1])s.chain([[0,1,.1*i],[-.3,.8,.45*i],[-.5,.95,.6*i]],.05,t);s.pivot=[.1,1.75,0],s.head=!0;const n=[.15,1.75,0];s.hemi(.55,.42,.48,it(n,0,.04,0),t,{r:[0,0,-.35]}),s.hemi(.5,.3,.44,it(n,0,-.04,0),t,{r:[Math.PI,0,.3]}),s.sph(.4,.05,.36,it(n,.12,-.02,0),11546688);for(let i=0;i<7;i++){const r=-1.2+i*.4;s.cyl(0,.045,.16,it(n,.3+Math.cos(r)*.15,.07,Math.sin(r)*.38),16052448,{seg:4,r:[0,0,Math.PI]}),s.cyl(0,.045,.14,it(n,.3+Math.cos(r)*.15,-.08,Math.sin(r)*.36),16052448,{seg:4})}for(let i=0;i<5;i++)s.sph(.07,.07,.07,it(n,-.1+i*.1,.36-Math.abs(i-2)*.04,0),10111642);e===2&&(s.cyl(.24,.2,.14,it(n,-.1,.48,0),ct.gold),s.ring(5,.22,0,(i,r)=>s.cyl(0,.05,.18,it(n,-.1+i,.62,r),ct.gold,{seg:4})),s.sph(.05,.05,.05,it(n,.12,.5,0),16728224,{glow:!0}))},tesla_coil(s,e){const n=e===2?14198848:12614202,i=1+e*.12;s.cyl(.95,1.05,.5,[0,.25,0],6965818,{seg:8}),s.cyl(.65,.8,.75*i,[0,.5+.37*i,0],8018504,{seg:8}),s.cyl(.42,.55,.85*i,[0,.5+.75*i+.42*i,0],5917248,{seg:8});const r=.5+1.6*i;for(const a of[.5,.5+.75*i,r-.1])s.tor(a>1.5?.45:a>1?.62:.8,.06,[0,a,0],n,{r:[Math.PI/2,0,0]});for(let a=0;a<6;a++)s.tor(.3-a*.025,.035,[0,r+.1+a*.12,0],n,{r:[Math.PI/2,0,0]});if(s.limb([0,r,0],[0,r+.85,0],.08,3815994),s.sph(.3,.3,.3,[0,r+1,0],e?8444159:n,{glow:e>0}),e>=1)for(let a=0;a<3+e*2;a++){const o=a*2.1;s.limb([0,r+1,0],[Math.cos(o)*.7,r+.6+a%2*.4,Math.sin(o)*.7],.015,10545407,{glow:!0})}e===2&&(s.ring(6,.5,0,(a,o)=>s.limb([a,r+.2,o],[a*.6,r+1.25,o*.6],.025,ct.gold)),s.ring(8,.85,0,(a,o)=>s.sph(.05,.05,.05,[a,.55,o],6342911,{glow:!0})))},arcane_obelisk(s,e){s.box(1.3,.3,1.3,[0,.15,0],7828588),s.box(1,.2,1,[0,.4,0],6973536);const n=2.6+e*.3;s.cyl(.24,.5,n,[0,.5+n/2,0],6446952,{seg:4,r:[0,Math.PI/4,0]}),s.cyl(0,.24,.4,[0,.7+n,0],6446952,{seg:4,r:[0,Math.PI/4,0]});for(let i=0;i<4;i++){const r=i*Math.PI/2;for(let a=0;a<4;a++){const o=.9+a*n*.2,c=.5-(o-.5)/n*.26;s.box(.02,.18,.12,[Math.cos(r)*c*.72,o,Math.sin(r)*c*.72],10510591,{r:[0,-r,0],glow:!0})}}if(e>=1){const i=1.15+n;s.cyl(0,.2,.35,[0,i+.17,0],11567359,{glow:!0,seg:4}),s.cyl(.2,0,.3,[0,i-.15,0],9461984,{glow:!0,seg:4})}e===2&&s.ring(4,.85,0,(i,r)=>{s.cyl(0,.1,.22,[i,2.4,r],13672703,{glow:!0,seg:4}),s.cyl(.1,0,.18,[i,2.2,r],10514687,{glow:!0,seg:4})})}},_u=new Map;function Kv(s,e){if(!s.length)return null;const t=new ue,n=s.map(r=>{const a=r.g.clone();a.applyMatrix4(r.m),e&&a.translate(-e[0],-e[1],-e[2]);const o=a.attributes.position.count,c=new Float32Array(o*3);t.setHex(r.c);const l=r.mat==="gold"||r.mat==="metal"||r.mat==="iron"?1.15:1.05;for(let h=0;h<o;h++)c.set([Math.min(1,t.r*l),Math.min(1,t.g*l),Math.min(1,t.b*l)],h*3);return a.setAttribute("color",new mt(c,3)),a}),i=cr(n,!1);return n.forEach(r=>r.dispose()),i}function xu(s,e){const t=new Map;for(const i of s){const r=i.mat,a=t.get(r);a?a.push(i):t.set(r,[i])}const n=[];for(const[i,r]of t){const a=Kv(r,e);a&&n.push({g:a,mat:i})}return n}function Jv(s,e){const t=s+":"+e;let n=_u.get(t);if(n)return n;const i=Yv[s];if(!i)return null;const r=new qv;i(r,e);const a=r.pivot,o=xu(r.parts.filter(h=>!h.head),void 0),c=xu(r.parts.filter(h=>h.head),a),l=new bt;for(const h of r.parts){const u=h.g;u.boundingBox||u.computeBoundingBox(),l.union(u.boundingBox.clone().applyMatrix4(h.m))}return n={base:o,head:c,pivot:a,height:l.max.y},_u.set(t,n),n}const vu={dart_monkey:1.2,ninja_monkey:1.2,wizard_monkey:1.2,super_monkey:1.2,boomerang_monkey:1.2,glue_slinger:1.2,sniper_monkey:1.2,cherry_pod:1.3};function Zv(s,e){const t=Jv(s,e);if(!t)return null;const n=new Ae,i=new Ae;i.position.set(...t.pivot),n.add(i),n.scale.setScalar(vu[s]??1);for(const r of t.base){const a=new j(r.g,bi(r.mat));a.castShadow=r.mat!=="glow",n.add(a)}for(const r of t.head){const a=new j(r.g,bi(r.mat));a.castShadow=r.mat!=="glow",i.add(a)}return n.userData.tower3d=s+":"+e,n.userData.textured=!0,{root:n,head:i,height:t.height*(vu[s]??1)}}const Nc=["grass","sand","dirt","cobble","rock"],Qv={grass:"burned",sand:"dryground",dirt:"burned",cobble:"mud",rock:"rock"},$v={grass:[.3187,.236,.1057],sand:[.2268,.1742,.1096],dirt:[.1255,.0859,.049],cobble:[.3016,.276,.2305],rock:[.1719,.1232,.0515],burned:[.1567,.1166,.0834],mud:[.1152,.0963,.074],dryground:[.2392,.2004,.1477]};let Qs=null;const Od={value:0};function pl(s=!1){if(Qs&&(!s||Qs.burned))return Qs;const e=new Nn,t=Qs??{};for(const n of[...Nc,"water_n",...s?["burned","mud","dryground"]:[]]){if(t[n])continue;const i=e.load(zt(`assets/tex/${n}.webp`));i.wrapS=i.wrapT=vn,i.anisotropy=4,i.generateMipmaps=!0,i.minFilter=An,n!=="water_n"&&(i.colorSpace=pt),t[n]=i}return Qs=t}function e1(){return pl().water_n}function ha(s,e={}){const t=pl(!!e.war);return s.userData.detail=!0,s.onBeforeCompile=n=>{for(const r of Nc){const a=e.war?Qv[r]:r;n.uniforms["t_"+r]={value:t[a]},n.uniforms["m_"+r]={value:new P(...$v[a])}}n.uniforms.t_wn={value:t.water_n},n.uniforms.uTime=Od,n.uniforms.uStone={value:e.stone??.6},n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vGW; varying float vGNy;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vGW = (modelMatrix * vec4(transformed, 1.0)).xyz; vGNy = normalize(mat3(modelMatrix) * objectNormal).y;`);const i=Nc.map(r=>`uniform sampler2D t_${r}; uniform vec3 m_${r};`).join(`
`);n.fragmentShader=n.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vGW; varying float vGNy; ${i}
uniform sampler2D t_wn; uniform float uTime; uniform float uStone;
vec3 gdet(sampler2D t, vec3 m, vec2 uv) { vec3 c = texture2D(t, uv).rgb; vec3 r = c / m; float l = dot(c, vec3(.2126,.7152,.0722)) / dot(m, vec3(.2126,.7152,.0722)); return clamp(mix(vec3(l), r, 0.35), 0.25, 2.2); }`).replace("#include <map_fragment>",`#include <map_fragment>
{
  vec3 s = sqrt(max(diffuseColor.rgb, 0.0));
  float mx = max(s.r, max(s.g, s.b)), mn = min(s.r, min(s.g, s.b)), sat = (mx - mn) / (mx + 1e-3);
  float wG = smoothstep(0.0, 0.05, s.g - s.r) * smoothstep(-0.02, 0.05, s.g - s.b);
  float wW = smoothstep(0.02, 0.10, s.b - max(s.r, s.g) + 0.04) * (1.0 - wG);
  float wS = (1.0 - smoothstep(0.10, 0.24, sat)) * uStone * (1.0 - wW);
  float warm = (1.0 - wG) * (1.0 - wW) * (1.0 - wS);
  float bright = smoothstep(0.55, 0.72, mx);
  float wSa = warm * bright, wD = warm * (1.0 - bright);
  float wR = ${e.slope?"smoothstep(0.86, 0.62, vGNy) * (1.0 - wW)":"0.0"};
  vec2 uv = vGW.xz;
  vec3 det = (gdet(t_grass, m_grass, uv / 2.6) * wG + gdet(t_sand, m_sand, uv / 3.2) * wSa + gdet(t_dirt, m_dirt, uv / 2.8) * wD
            + gdet(t_cobble, m_cobble, uv / 2.4) * wS) / max(wG + wSa + wD + wS, 1e-3);
  det = mix(det, gdet(t_rock, m_rock, uv / 4.0), wR);
  vec2 wn = texture2D(t_wn, uv / 7.0 + vec2(uTime * 0.018, uTime * 0.011)).xy * 2.0 - 1.0;
  det = mix(det, vec3(1.0 + 0.22 * (wn.x + wn.y)), wW);
  diffuseColor.rgb *= mix(vec3(1.0), det, 0.9);
}`)},s.customProgramCacheKey=()=>"gdet"+(e.slope?"s":"")+(e.war?"w":"")+(e.stone??.6),s.needsUpdate=!0,s}function ua(s){return pl()[s]}const t1={palm:"palm",palm_bend:"palm",palm_tall:"palm",oak:"oak",tree:"oak",tree_detailed:"jungle",pine:"pine",pine_round:"pine",bush:"bush",bush_big:"bush",fern:"fern",grass:"grass",dead:"dead"},n1={palm:22,oak:20,jungle:20,pine:20,dead:20,bush:10,fern:9,grass:7},i1=34,s1=new Ha().setMeshoptDecoder(Ud),yu=new Map,Mu=new WeakMap;function r1(s){return s.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
 diffuseColor.rgb = vec3(dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11))) * vec3(0.62, 0.47, 0.36);`)},s.customProgramCacheKey=()=>"charred",s}function wu(s,e,t=!1){var i;let n=Mu.get(s);return n||Mu.set(s,n=[]),t?n[i=3+e]??(n[i]=r1(e===0?new It({map:s.mat.map,side:Rt}):new yt({map:s.mat.map,normalMap:e>=2?s.mat.normalMap:null,roughness:.95,metalness:0,side:Rt,envMapIntensity:.4}))):e>=2?s.mat:n[e]??(n[e]=e===1?new yt({map:s.mat.map,roughness:.9,metalness:0,side:Rt,envMapIntensity:.6}):new It({map:s.mat.map,side:Rt}))}function a1(s){let e=yu.get(s);return e||(e=s1.loadAsync(zt(`assets/flora_tex/${s}.glb`)).then(t=>{t.scene.updateMatrixWorld(!0);const n=u=>{const d=u.clone();for(const f of["position","normal","uv"]){const b=d.getAttribute(f);if(!b||b.array instanceof Float32Array)continue;const v=new Float32Array(b.count*b.itemSize);for(let p=0;p<b.count;p++)for(let m=0;m<b.itemSize;m++)v[p*b.itemSize+m]=b.getComponent(p,m);d.setAttribute(f,new mt(v,b.itemSize))}return d},i=u=>{const d=t.scene.getObjectByName(u);return{m:d,g:n(d.geometry).applyMatrix4(d.matrixWorld)}},r=i("lod0"),a=i("lod1");r.g.computeBoundingBox();const o=r.g.boundingBox,c=1/Math.max(.001,o.max.y-o.min.y);for(const u of[r.g,a.g])u.translate(0,-o.min.y,0),u.scale(c,c,c);const l=r.m.material,h=new yt({map:l.map,normalMap:l.normalMap,roughness:.88,metalness:0,side:Rt,envMapIntensity:.6});return h.normalMap&&h.normalScale.set(.8,.8),h.name="flora_tex_"+s,{lod:[r.g,a.g],mat:h}}),yu.set(s,e)),e}const o1={palm:"tree_palmTall",palm_bend:"tree_palmBend",palm_tall:"tree_palmDetailedTall",oak:"tree_oak",tree:"tree_default",tree_detailed:"tree_detailed",pine:"tree_pineTallA_detailed",pine_round:"tree_pineRoundC",bush:"plant_bushDetailed",bush_big:"plant_bushLarge",rock:"rock_largeC",rock_big:"rock_largeA",rock_tall:"rock_tallB",rock_small:"rock_smallC",stump:"stump_old",stump_round:"stump_roundDetailed",log:"log_large"},kd=/leaf|grass/i,ya=/palm/,Su={leafsGreen:[5208620,2827292],leafsDark:[3103280,2498843],grass:[4616236,3024928],woodBark:[7230008,2235415],woodBarkDark:[5652526,2038294],woodInner:[12098162,3812900],dirt:[9078140,5196614],_defaultMat:[8022608,2761760]},Bd=/^rock/,c1=new Ha,Tu=new Map;function l1(s,e){const t=s+(e?"#b":"");let n=Tu.get(t);return n||(n=c1.loadAsync(zt(`assets/flora/${o1[s]}.glb`)).then(i=>{const r=i.scene;r.updateMatrixWorld(!0);const a=new Map;r.traverse(u=>{const d=u;if(!d.isMesh)return;let f=d.geometry.clone().applyMatrix4(d.matrixWorld);for(const v of Object.keys(f.attributes))v!=="position"&&v!=="normal"&&f.deleteAttribute(v);f.index&&(f=f.toNonIndexed());const b=d.material.name||"_defaultMat";(a.get(b)??a.set(b,[]).get(b)).push(f)});const o=[...a.values()].flat(),c=new bt;for(const u of o)u.computeBoundingBox(),c.union(u.boundingBox);const l=1/Math.max(.001,c.max.y-c.min.y),h=[];for(const[u,d]of a){const f=cr(d);if(f.translate(0,-c.min.y,0),f.scale(l,l,l),e&&kd.test(u)&&!Bd.test(s)){f.computeBoundingBox();const b=f.boundingBox.getCenter(new P),v=ya.test(s)?.78:.68;f.translate(-b.x,-b.y,-b.z),f.scale(v,v*(ya.test(s)?.7:.85),v),f.translate(b.x,b.y-(ya.test(s)?.03:.06),b.z)}f.computeVertexNormals(),h.push({geo:f,mat:u})}return h}),Tu.set(t,n)),n}const Eu=new Map;function h1(s,e,t){const n=Bd.test(e),i=s+(t?"b":"")+(n?"r":"");let r=Eu.get(i);if(!r){const a=n&&s==="grass"?[6122302,3814444]:Su[s]??Su._defaultMat;r=new It({color:a[t?1:0],flatShading:!0}),t&&kd.test(s)&&ya.test(e)&&r.color.setHex(5127207),Eu.set(i,r)}return r}async function u1(s,e,t=2){const n=new Ae;n.name="flora";const i=new Map,r=new Map;for(const b of s){b.burnt&&(b.k==="tree"||b.k==="oak"||b.k==="tree_detailed")&&(b.k="dead");const v=t1[b.k];if(v){const m=v+(b.burnt?"#b":"");(r.get(m)??r.set(m,[]).get(m)).push(b);continue}const p=b.k+(b.burnt?"#b":"");(i.get(p)??i.set(p,[]).get(p)).push(b)}const a=new _t,o=new ue,c=[];await Promise.all([...r].map(async([b,v])=>{const[p,m]=b.split("#"),g=!!m,_=await a1(p),x=wu(_,t,g),E=new en(_.lod[0],x,v.length),w=new en(_.lod[1],x,v.length);E.userData.texModel=w.userData.texModel=_,E.userData.burnt=w.userData.burnt=g;const A={file:p,near:E,far:w,mats:[],cols:[],pos:[]};v.forEach((S,y)=>{a.position.set(S.x,S.y,S.z),a.rotation.set(S.tilt??0,S.rot,(S.tilt??0)*.6),a.scale.setScalar(S.h),a.updateMatrix();const M=.88+(y*2654435761>>>0)%1e3/1e3*.24;A.mats.push(a.matrix.clone()),A.cols.push(new ue(M,M,M)),A.pos.push(new P(S.x,S.y+S.h*.4,S.z))});for(const S of[E,w])S.instanceColor=new Ui(new Float32Array(v.length*3),3),S.castShadow=e,S.receiveShadow=e,S.userData.flora=p,S.userData.tex=!0,S.frustumCulled=!1,n.add(S);w.castShadow=!1,w.userData.lod=1,c.push(A)}));const l=new P(1e9,0,0),h=new P,u=new P,d=new P,f=new P;return n.userData.updateLod=(b,v=!1)=>{if(b.getWorldPosition(u),b.getWorldDirection(d),d.y=0,d.normalize(),!v&&l.distanceToSquared(u)<2.25&&h.dot(d)>.97)return;l.copy(u),h.copy(d);let p=0;for(const m of c){let g=0,_=0;const x=n1[m.file]??26;for(let E=0;E<m.mats.length;E++){f.subVectors(m.pos[E],u),f.y=0;const w=f.length();if(w>9&&f.dot(d)<-.3*w||m.file==="grass"&&w>i1)continue;const A=w>x,S=A?m.far:m.near,y=A?_++:g++;S.setMatrixAt(y,m.mats[E]),S.setColorAt(y,m.cols[E])}m.near.count=g,m.far.count=_,p+=_;for(const E of[m.near,m.far])E.instanceMatrix.needsUpdate=!0,E.instanceColor&&(E.instanceColor.needsUpdate=!0)}n.userData.far=p},n.userData.texKinds=c.length,n.userData.setDetail=b=>n.traverse(v=>{const p=v;p.userData.texModel&&(p.material=wu(p.userData.texModel,b,!!p.userData.burnt),b===0&&(p.castShadow=p.receiveShadow=!1))}),await Promise.all([...i].map(async([b,v])=>{const p=b.split("#")[0],m=b.endsWith("#b");for(const g of await l1(p,m)){const _=new en(g.geo,h1(g.mat,p,m),v.length);v.forEach((x,E)=>{a.position.set(x.x,x.y,x.z),a.rotation.set(x.tilt??0,x.rot,(x.tilt??0)*.6),a.scale.setScalar(x.h),a.updateMatrix(),_.setMatrixAt(E,a.matrix);const w=.86+(E*2654435761>>>0)%1e3/1e3*.28;_.setColorAt(E,o.setScalar(w))}),_.castShadow=e,_.receiveShadow=e,_.userData.flora=p,_.frustumCulled=!1,n.add(_)}})),n}function Au(s,e){const t=e*.05;if(s.startsWith("mr_")){const n=e/10;return s==="mr_tree"?{k:"tree",h:n}:s==="mr_bush"?{k:"bush",h:n}:s==="mr_fern"?{k:"fern",h:n}:s==="mr_grass"?{k:"grass",h:n}:null}switch(s){case"oak":return{k:"oak",h:t*1.15};case"pine":return{k:"pine",h:t*1.5};case"rtree":return{k:"tree_detailed",h:t*1.2};case"palm":return{k:"palm",h:t*1.2};case"palm2":return{k:"palm_tall",h:t*1.25};case"bpalm":return{k:"palm",h:t*1.2,burnt:!0};case"bpalm2":return{k:"palm_bend",h:t*1.1,burnt:!0};case"deadtree":case"deadtree2":return{k:"tree",h:t*1.2,burnt:!0};case"hedge":case"bamboo":return{k:"bush_big",h:t*.32};case"monstera":case"fern":case"tbush":return{k:"fern",h:t*.22};case"rose":case"redflower":return{k:"bush",h:t*.24};case"boulders":case"vinerock":case"searocks":case"trock":return{k:e*7%3<1.5?"rock_big":"rock",h:t*.22};case"mossrock":return{k:"rock",h:t*.24};case"rubble":return{k:"rock_small",h:t*.16};case"stump":return{k:"stump",h:t*.16};case"log":return{k:"log",h:t*.12};default:return null}}const Fc=s=>new It({color:s});let da=null;function Ru(){if(da)return da;const s=document.createElement("canvas");s.width=s.height=64;const e=s.getContext("2d");for(let t=0;t<7;t++){const n=32+Math.cos(t*2.4)*9,i=32+Math.sin(t*2.4)*9,r=e.createRadialGradient(n,i,0,n,i,22);r.addColorStop(0,"rgba(255,255,255,0.55)"),r.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=r,e.fillRect(0,0,64,64)}return da=new el(s),da}let as=null;function zd(s){!as&&s&&(as=s.clone(),as.repeat.set(3,.8),as.needsUpdate=!0);const e=new Ae,t=new It({color:12104360,map:as}),n=Fc(1184016),i=new It({color:5591114,map:as}),r=(a,o,c,l,h,u=0,d=0)=>{const f=new j(a,o);return f.position.set(c,l,h),f.rotation.set(0,u,d),f.castShadow=f.receiveShadow=!0,e.add(f),f};r(new Fe(2.5,2.8,2,8),t,0,1,0,Math.PI/8),r(new Fe(2.9,2.9,.42,8),i,.15,2.2,.1,Math.PI/8+.05,.06);for(let a=0;a<3;a++){const o=-.6+a*.6;r(new Se(.12,.28,1.3),n,Math.cos(o)*2.62,1.45,Math.sin(o)*2.62,-o)}r(new Se(1.8,1.1,1.5),i,-2.4,.4,-1.9,.5,.35);for(let a=0;a<7;a++)r(new ka(.3+a%3*.16,0),a%2?t:i,-2.2+a*.75,.18,2.9+a%2*.6);return e}function d1(s){const e=new Ae,t=Fc(3812384),n=Fc(4868678);for(let a=0;a<=2;a++){const o=new j(new Fe(.05,.06,1.3,5),t);o.position.set(-s/2+a*s/2,.65,0),e.add(o)}const i=[],r=Math.round(s*2.2);for(let a=0;a<=r*12;a++){const o=a/(r*12),c=o*r*Math.PI*2;i.push(new P(-s/2+o*s,.48+Math.sin(c)*.45,Math.cos(c)*.45))}return e.add(new j(new ol(new vd(i),r*12,.012,3),n)),e}function f1(s,e,t,n,i,r){const a={wrecks:0,smoke:0,props:0},o=[];let c=0;for(const[x,E,w,A]of e){const S=E*n,y=w*n,M=t(E,w),C=(E*13+w*7)%628/100;if(x==="wtank"||x==="wtank2"||x==="wheli"){const D=c++;Ov(x==="wheli"?"heli":x==="wtank2"?"tank2":"tank",D).then(U=>{U.position.set(S,M,y),U.rotation.y=C,U.traverse(N=>{N.castShadow=!i,N.receiveShadow=!i}),U.userData.war=x,s.add(U),a.wrecks++}),o.push(new P(S,M+1.2,y))}else if(x==="bunker"){const D=zd(r);D.position.set(S,M-.1,y),D.rotation.y=C,D.userData.war=x,s.add(D),a.props++}else if(x==="sandbags"){const D=new Ae,U=lr();U.rotation.y=.35,U.position.x=-1.2;const N=lr();N.rotation.y=-.35,N.position.x=1.2,D.add(U,N),D.position.set(S,M,y),D.rotation.y=C,D.traverse(G=>{G.castShadow=!i}),D.userData.war=x,s.add(D),a.props++}else if(x==="wire"){const D=d1(A*n*.9);D.position.set(S,M,y),D.rotation.y=C,D.userData.war=x,s.add(D),a.props++}}const l=new gr({map:Ru(),color:3881012,transparent:!0,depthWrite:!1,opacity:.6,fog:!0}),h=[],u=i?8:13;for(const x of o)for(let E=0;E<u;E++){const w=new Sa(l.clone());w.renderOrder=2,s.add(w),h.push({s:w,base:x,t:E/u*9,life:9})}a.smoke=o.length;const d=new gr({map:Ru(),color:16742954,transparent:!0,depthWrite:!1,blending:gs}),f=o.map(x=>{const E=new Sa(d.clone());return E.position.copy(x),E.position.y-=.4,E.scale.setScalar(2.4),s.add(E),E}),b=i?220:500,v=28,p=new Float32Array(b*3);for(let x=0;x<b;x++)p.set([(Math.random()-.5)*2*v,Math.random()*16,(Math.random()-.5)*2*v],x*3);const m=new gt;m.setAttribute("position",new mt(p,3));const g=new xd(m,new $c({color:10130572,size:.06,transparent:!0,opacity:.8,depthWrite:!1}));g.frustumCulled=!1,g.name="ash",s.add(g);let _=0;return{count:a,update(x,E){_+=x;for(const S of h){S.t+=x,S.t>S.life&&(S.t-=S.life);const y=S.t/S.life,M=2.6+y*13;S.s.position.set(S.base.x+y*y*10+Math.sin(_*.5+S.base.x)*.6,S.base.y+y*24,S.base.z+y*y*4),S.s.scale.set(M,M,1),S.s.material.opacity=Math.min(1,y*8)*(1-y)*.95,S.s.material.color.setScalar(.16+y*.3)}f.forEach((S,y)=>{const M=.75+.25*Math.sin(_*9+y*2.1)*Math.sin(_*5.3+y);S.scale.setScalar(2.2*M+.6),S.material.opacity=.55+.35*M});const w=m.attributes.position,A=E.position;g.position.set(A.x,0,A.z);for(let S=0;S<b;S++){let y=w.getY(S)-x*.7;y<A.y-4&&(y+=16),w.setXYZ(S,w.getX(S)+Math.sin(_+S)*x*.15,y,w.getZ(S))}w.needsUpdate=!0}}}function Cu(s,e){if(s==="bunker"){const o=zd(e);return o.userData.env=s,o}const t=new Ae;t.userData.env=s;const n=new It({color:13615784,map:e??null}),i=new It({color:7032627}),r=new It({color:5134906}),a=(o,c,l,h,u,d=0)=>{const f=new j(o,c);return f.position.set(l,h,u),f.rotation.y=d,f.castShadow=f.receiveShadow=!0,t.add(f),f};if(s==="watchtower"){for(const[o,c]of[[-1,-1],[1,-1],[-1,1],[1,1]])a(new Fe(.1,.13,4.6,6),i,o,2.3,c);a(new Se(2.6,.16,2.6),i,0,4,0);for(const[o,c,l,h]of[[0,-1.25,2.6,.08],[0,1.25,2.6,.08],[-1.25,0,.08,2.6],[1.25,0,.08,2.6]])a(new Se(l,.9,h),i,o,4.5,c);a(new Un(2.1,1.1,4).rotateY(Math.PI/4),r,0,6,0);for(const[o,c]of[[-1,-1],[1,-1],[-1,1],[1,1]])a(new Fe(.05,.05,1.5,4),i,o,5.2,c)}else if(s==="garita"){a(new Fe(1,1.15,2.6,14),n,0,1.3,0),a(new St(1.05,14,8,0,Math.PI*2,0,Math.PI/2),n,0,2.6,0),a(new Un(.16,.5,8),n,0,3.85,0);const o=new Tt({color:1381135});for(let c=0;c<4;c++){const l=c*Math.PI/2;a(new Se(.12,.55,.1),o,Math.sin(l)*1.03,1.9,Math.cos(l)*1.03,l)}}else{a(new Se(3.4,2.2,.5),n,0,1.1,-1.4),a(new Se(.5,1.4,2.6),n,-1.5,.7,-.1),a(new Se(1.4,1,.5),n,1,.5,1.2,.2);for(let o=0;o<7;o++)a(new ka(.22+o%3*.1,0),n,Math.sin(o*2.3)*1.6,.15,Math.cos(o*1.7)*1.4)}return t}class p1 extends ux{constructor(e){super(e),this.type=nn}parse(e){const a=function(S,y){switch(S){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(y||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(y||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(y||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(y||""))}},h=`
`,u=function(S,y,M){y=y||1024;let D=S.pos,U=-1,N=0,G="",O=String.fromCharCode.apply(null,new Uint16Array(S.subarray(D,D+128)));for(;0>(U=O.indexOf(h))&&N<y&&D<S.byteLength;)G+=O,N+=O.length,D+=128,O+=String.fromCharCode.apply(null,new Uint16Array(S.subarray(D,D+128)));return-1<U?(S.pos+=N+U+1,G+O.slice(0,U)):!1},d=function(S){const y=/^#\?(\S+)/,M=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,C=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,D=/^\s*FORMAT=(\S+)\s*$/,U=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,N={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};let G,O;for((S.pos>=S.byteLength||!(G=u(S)))&&a(1,"no header found"),(O=G.match(y))||a(3,"bad initial token"),N.valid|=1,N.programtype=O[1],N.string+=G+`
`;G=u(S),G!==!1;){if(N.string+=G+`
`,G.charAt(0)==="#"){N.comments+=G+`
`;continue}if((O=G.match(M))&&(N.gamma=parseFloat(O[1])),(O=G.match(C))&&(N.exposure=parseFloat(O[1])),(O=G.match(D))&&(N.valid|=2,N.format=O[1]),(O=G.match(U))&&(N.valid|=4,N.height=parseInt(O[1],10),N.width=parseInt(O[2],10)),N.valid&2&&N.valid&4)break}return N.valid&2||a(3,"missing format specifier"),N.valid&4||a(3,"missing image size specifier"),N},f=function(S,y,M){const C=y;if(C<8||C>32767||S[0]!==2||S[1]!==2||S[2]&128)return new Uint8Array(S);C!==(S[2]<<8|S[3])&&a(3,"wrong scanline width");const D=new Uint8Array(4*y*M);D.length||a(4,"unable to allocate buffer space");let U=0,N=0;const G=4*C,O=new Uint8Array(4),Y=new Uint8Array(G);let H=M;for(;H>0&&N<S.byteLength;){N+4>S.byteLength&&a(1),O[0]=S[N++],O[1]=S[N++],O[2]=S[N++],O[3]=S[N++],(O[0]!=2||O[1]!=2||(O[2]<<8|O[3])!=C)&&a(3,"bad rgbe scanline format");let te=0,oe;for(;te<G&&N<S.byteLength;){oe=S[N++];const De=oe>128;if(De&&(oe-=128),(oe===0||te+oe>G)&&a(3,"bad scanline data"),De){const Ye=S[N++];for(let K=0;K<oe;K++)Y[te++]=Ye}else Y.set(S.subarray(N,N+oe),te),te+=oe,N+=oe}const me=C;for(let De=0;De<me;De++){let Ye=0;D[U]=Y[De+Ye],Ye+=C,D[U+1]=Y[De+Ye],Ye+=C,D[U+2]=Y[De+Ye],Ye+=C,D[U+3]=Y[De+Ye],U+=4}H--}return D},b=function(S,y,M,C){const D=S[y+3],U=Math.pow(2,D-128)/255;M[C+0]=S[y+0]*U,M[C+1]=S[y+1]*U,M[C+2]=S[y+2]*U,M[C+3]=1},v=function(S,y,M,C){const D=S[y+3],U=Math.pow(2,D-128)/255;M[C+0]=Fr.toHalfFloat(Math.min(S[y+0]*U,65504)),M[C+1]=Fr.toHalfFloat(Math.min(S[y+1]*U,65504)),M[C+2]=Fr.toHalfFloat(Math.min(S[y+2]*U,65504)),M[C+3]=Fr.toHalfFloat(1)},p=new Uint8Array(e);p.pos=0;const m=d(p),g=m.width,_=m.height,x=f(p.subarray(p.pos),g,_);let E,w,A;switch(this.type){case tn:A=x.length/4;const S=new Float32Array(A*4);for(let M=0;M<A;M++)b(x,M*4,S,M*4);E=S,w=tn;break;case nn:A=x.length/4;const y=new Uint16Array(A*4);for(let M=0;M<A;M++)v(x,M*4,y,M*4);E=y,w=nn;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:g,height:_,data:E,header:m.string,gamma:m.gamma,exposure:m.exposure,type:w}}setDataType(e){return this.type=e,this}load(e,t,n,i){function r(a,o){switch(a.type){case tn:case nn:a.colorSpace=jt,a.minFilter=kt,a.magFilter=kt,a.generateMipmaps=!1,a.flipY=!0;break}t&&t(a,o)}return super.load(e,r,n,i)}}const Gd={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class Ns{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const m1=new Ia(-1,1,1,-1,0,1);class g1 extends gt{constructor(){super(),this.setAttribute("position",new We([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new We([0,2,0,0,2,0],2))}}const b1=new g1;class ml{constructor(e){this._mesh=new j(b1,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,m1)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class _1 extends Ns{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Jt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=pr.clone(e.uniforms),this.material=new Jt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new ml(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Pu extends Ns{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class x1 extends Ns{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class v1{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new q);this._width=n.width,this._height=n.height,t=new xn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:nn}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new _1(Gd),this.copyPass.material.blending=ni,this.clock=new _x}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}Pu!==void 0&&(a instanceof Pu?n=!0:a instanceof x1&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new q);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Lu extends Ns{constructor(e,t,n=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new ue}render(e,t,n){const i=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=i}}const y1={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ue(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Ps extends Ns{constructor(e,t,n,i){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new q(e.x,e.y):new q(256,256),this.clearColor=new ue(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new xn(r,a,{type:nn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const d=new xn(r,a,{type:nn});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const f=new xn(r,a,{type:nn});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=y1;this.highPassUniforms=pr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Jt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new q(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Gd;this.copyUniforms=pr.clone(h.uniforms),this.blendMaterial=new Jt({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:gs,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new ue,this.oldClearAlpha=1,this.basic=new Tt,this.fsQuad=new ml(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new q(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=Ps.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=Ps.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Jt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new q(.5,.5)},direction:{value:new q(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new Jt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Ps.BlurDirectionX=new q(1,0);Ps.BlurDirectionY=new q(0,1);const M1={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class w1 extends Ns{constructor(){super();const e=M1;this.uniforms=pr.clone(e.uniforms),this.material=new J_({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new ml(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},$e.getTransfer(this._outputColorSpace)===ht&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ou?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ku?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Bu?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===kc?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===zu?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Gu&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const os=22;let le=.05;const Qn=.05,S1=14,T1={red:16724787,blue:3377407,green:3394611,yellow:16763904,pink:16737996,lead:5988976,ceramic:15328476,moab:5939432},E1={scavenger:14252331,hunter:12867115,charger:9067051,brood:11766318,bile_titan:6978858,ironback:7305088,warden:4638440,gargoyle:10120145};function cs(s){const e=s.data.color;return e&&/^#?[0-9a-fA-F]{6}$/.test(e.replace("#",""))?parseInt(e.replace("#",""),16):(s.data.family==="bloon"?T1:E1)[s.data.id]??15217967}const Iu={dart:14271626,pea:5955402,gpea:16734810,shuriken:12633808,magic:13073919,melon:16747066,star:16769126,bullet:16769162,laser:16732240,rail:9425151,ice:11069695,glue:10944333,acid_vial:10944333,acid_spray:10944333,acid_can:10288954,flak:16752704,seed:11990927,boomerang:14132058,tesla:10479615,arrow:14278114,shell:6975608},Du={moab:3108824,boss_zeppelin:9060312,boss_leviathan:2071178,boss_scarab:12092971,boss_dreadnought:3817288,gargoyle:7368816},A1=()=>matchMedia("(pointer: coarse)").matches||"ontouchstart"in window,et=(s,e,t,n)=>(s.position.set(e,t,n),s),R1=s=>s==="pistol",Pt=s=>new It({color:s});function Uu(s){return s.data.air?6.5:s.data.family==="bloon"?s.data.boss||s.data.id==="moab"?2.6:1.3:Math.max(.5,s.data.radius*Qn*.8)}function Bo(s){return Math.max(.45,s.data.radius*Qn*1.15)}class C1{constructor(e,t,n={}){this.host=e,this.abN=0,this.sentAb=0,this.bugEye=.9,this.scene=new d_,this.touch=A1(),this.yaw=0,this.pitch=-.12,this.keys=new Set,this.firing=!1,this.locked=!1,this.joy={id:-1,ox:0,oy:0,x:0,y:0},this.lookId=-1,this.lookX=0,this.lookY=0,this.ctl={aim:0,fire:!1,target:null,mx:0,my:0},this.fps=60,this.fpsAcc=0,this.fpsN=0,this.slow=0,this.pr=1,this.hits=0,this.shots=0,this.lastShot=-1,this.hitT=0,this.sendT=0,this.sentFire=!1,this.bloonMeshes=new Map,this.enemySets=new Map,this.bossTpl=new Map,this.bossModels=new Map,this.towerModels=new Map,this.unitVeh=new Map,this.troopSets=new Map,this.vehTpl=new Map,this.unitGlbReq=new Set,this.sunDir=new P(-.5,.36,-.79).normalize(),this.gunBase=new P(.22,-.22,-.45),this.gunRoll=0,this.bob=0,this.vm={fortChunks:0,fort:null,parked:0,parkedGlb:0,boards:0,kind:"box",hands:0,props:0,vehicles:0,flora:0,quality:"high",tex:{flora:0,lod:0,gun:0,glove:0},size:{},towers3d:{},enemyGlb:{},unitGlb:{},unitGlbLoaded:[]},this.seaN=null,this.fort=null,this.morro=null,this.floorGeo=null,this.groundPhoto=null,this.parkedObjs=new Map,this.vehId="",this.war=null,this.ctxLost=!1,this.bits=[],this.seen=new Map,this.gun=new Ae,this.flashT=0,this.kick=0,this.tracers=[],this.dummy=new _t,this.tmpC=new ue,this.raf=0,this.last=0,this.alive=!0,this.el={},this.miniImg=new Image,this.miniT=0,this.ray=new Rx,this.v=new P,this.v2=new P,this.fortFailed=!1,this.onUp=o=>{if(o&&o.button===2){this.setAds(!1);return}this.firing=!1},this.ads=!1,this.adsK=0,this.onLock=()=>{this.locked=document.pointerLockElement===this.renderer.domElement,this.locked||(this.firing=!1,this.setAds(!1))},this.onMouse=o=>{this.locked&&!this.g.paused&&this.look(o.movementX,o.movementY)},this.onKey=o=>{var l,h;if((h=(l=o.target)==null?void 0:l.closest)!=null&&h.call(l,"input,textarea,#bug-report,.br-overlay"))return;const c=o.key.toLowerCase();if(c==="shift"&&this.canScope&&this.setAds(!0),o.stopImmediatePropagation(),c==="escape"||c==="e"||this.ovr&&c==="tab"){c==="tab"&&o.preventDefault(),o.repeat||this.exit();return}if(c==="p"){this.setPause(!this.g.paused);return}if(c==="f"&&!o.repeat){this.toggleVehicle();return}if(this.keys.add(c),c===" "&&o.preventDefault(),this.isBug)(c==="q"||c===" ")&&!o.repeat&&this.bugAbility();else if(!this.isTower){const u=this.g.squadAbilities(this.obj.squad),d=c==="q"?0:/^[1-9]$/.test(c)?+c-1:-1;d>=0&&u[d]&&this.ability(u[d])}},this.onKeyUp=o=>{o.key==="Shift"&&this.setAds(!1),this.keys.delete(o.key.toLowerCase()),o.stopImmediatePropagation()},this.resize=()=>{var l,h;const o=innerWidth,c=innerHeight;this.renderer.setSize(o,c,!1),(l=this.composer)==null||l.setPixelRatio(this.pr),(h=this.composer)==null||h.setSize(o,c),this.camera.aspect=o/c,this.camera.updateProjectionMatrix()},this.last0=performance.now(),this.composer=null,this.bloom=null,this.envRT=null,this.floraGrp=null,this.lodT=0,this.pinQ=!1,this.loop=o=>{var u;if(!this.alive)return;const c=Math.min(.1,(o-this.last)/1e3);if(this.last=o,Od.value+=c,(u=this.war)==null||u.update(c,this.camera),this.seaN&&(this.seaN.offset.x+=c*.0026,this.seaN.offset.y+=c*.0017),this.fpsAcc+=Math.min(1,(o-this.last0)/1e3),this.last0=o,this.fpsN++,this.fpsAcc>=.5&&(this.fps=this.fpsN/this.fpsAcc,this.fpsAcc=0,this.fpsN=0,this.governor()),!this.tick(c))return;if(this.ctxLost){this.raf=requestAnimationFrame(this.loop);return}this.lodT-=c,this.lodT<=0&&this.floraGrp&&(this.lodT=.12,this.floraGrp.userData.updateLod(this.camera));const l=this.renderer,h=this.camera;if(this.composer&&this.bloom)this.bloom.enabled=!this.g.reduceFlash,this.composer.render(c);else{h.layers.set(0),l.autoClear=!0,l.render(this.scene,h);const d=this.scene.background;this.scene.background=null,h.layers.set(1),l.autoClear=!1,l.clearDepth(),l.render(this.scene,h),h.layers.set(0),this.scene.background=d}this.raf=requestAnimationFrame(this.loop)},this.g=e.g,this.obj=t,this.isTower=t instanceof rn,this.isBug=t instanceof an,this.ovr=!!n.overrun,le=this.g.map.mpp??.05,this.root=document.createElement("div"),this.root.id="possess-root",document.body.appendChild(this.root),document.body.classList.add("possess-on"),document.body.classList.toggle("ps-touch-on",this.touch),this.renderer=new u_({antialias:!this.touch,powerPreference:"high-performance",preserveDrawingBuffer:!0}),this.pr=Math.min(devicePixelRatio,this.touch?1.25:1.75),this.renderer.setPixelRatio(this.pr),this.renderer.outputColorSpace=pt,this.renderer.domElement.className="p3d",this.renderer.toneMapping=kc,this.renderer.toneMappingExposure=1.15;const i=new URLSearchParams(location.search).get("fpq");this.vm.quality=i==="low"||i==="medium"||i==="high"?i:this.touch?"medium":"high",this.pinQ=!!i,Do({high:2,medium:1,low:0}[this.vm.quality]),this.root.appendChild(this.renderer.domElement),this.renderer.domElement.addEventListener("webglcontextlost",o=>{o.preventDefault(),this.ctxLost=!0,console.warn("[possess] WebGL context lost")}),this.renderer.domElement.addEventListener("webglcontextrestored",()=>{this.ctxLost=!1,this.composer&&this.composer.setSize(innerWidth,innerHeight)}),this.camera=new Kt(70,1,.03,this.real?1100:420),this.camera.rotation.order="YXZ",this.buildWorld(),this.buildPost(),this.buildGun(),this.buildPools(),this.buildHud(),this.bindInput();const a=(this.isBug?this.g.units:this.g.enemies).filter(o=>o.alive).sort((o,c)=>(o.x-t.x)**2+(o.y-t.y)**2-((c.x-t.x)**2+(c.y-t.y)**2))[0]??{x:this.g.map.width/2,y:this.g.map.height/2};this.yaw=Math.atan2(-(a.x-t.x),-(a.y-t.y)),this.ctl.aim=Math.atan2(a.y-t.y,a.x-t.x),this.g.possessCtl(t,this.ctl),this.g.speed=1,this.resize(),addEventListener("resize",this.resize),Bi(`possess: ${this.isTower?"tower ":this.isBug?"monster ":"unit "}${t.data.id}`),this.last=performance.now(),this.raf=requestAnimationFrame(this.loop)}get isWar(){return this.g.map.id==="tropical"}get real(){return(this.g.map.mpp??.05)>.051}groundAt(e,t){return Ft(this.g.map,e,t)}buildWorld(){const{scene:e,g:t}=this,n=t.map.width*le,i=t.map.height*le,r=this.isWar,a=r?new qh(14208960,3814444,1.05):new qh(16773336,5660730,1.25);a.layers.enableAll(),e.add(a);const o=new Ld(r?16758904:16767400,r?2:2.4);o.position.copy(this.sunDir).multiplyScalar(80),e.add(o,o.target),this.sun=o,o.layers.enableAll(),!this.touch&&this.vm.quality!=="low"&&(this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Fu,o.castShadow=!0,o.shadow.mapSize.set(2048,2048),o.shadow.bias=-4e-4,o.shadow.normalBias=.025,o.shadow.radius=2,Object.assign(o.shadow.camera,{left:-os,right:os,top:os,bottom:-os,near:1,far:200})),this.vm.quality!=="low"&&new p1().load(zt("assets/tex/sky_env.hdr"),g=>{if(!this.alive){g.dispose();return}const _=new Tc(this.renderer),x=_.fromEquirectangular(g);g.dispose(),_.dispose(),e.environment=x.texture,e.environmentIntensity=r?.45:.6,this.envRT=x},void 0,g=>console.warn("hdri",g));const c=t.map.terrain,l=[];if(c)this.buildTerrain(n,i,l);else{const g=new Nn().load(zt(t.map.image));g.colorSpace=pt,g.anisotropy=8;const _=new j(new Yt(n,i).rotateX(-Math.PI/2).translate(n/2,0,i/2),ha(new It({map:g}),{stone:t.map.id==="morro"||t.map.id==="fortress"?1:.5}));_.name="floor",_.userData.detail=!0,e.add(_);const x=new j(new Yt(900,900).rotateX(-Math.PI/2),ha(Pt(6262586)));x.position.set(n/2,-.05,i/2),e.add(x);const E=Pt(7035460),w=t.map.id==="morro"||t.map.id==="fortress",A=D=>{if(!w)return E;const U=ua("cobble").clone();return U.repeat.set(D/2.4,.46),U.needsUpdate=!0,new It({map:U,color:14207924})};for(const[D,U,N,G]of[[n/2,-.4,n+1.6,.8],[n/2,i+.4,n+1.6,.8],[-.4,i/2,.8,i],[n+.4,i/2,.8,i]])e.add(et(new j(new Se(N,1.1,G),A(Math.max(N,G))),D,.55,U));let S=7;const y=()=>(S=S*16807%2147483647)/2147483647,M={garden:["oak","tree","pine","oak","tree_detailed"],jungle:["palm","palm_bend","tree_detailed","palm_tall"],fortress:["pine","pine_round","pine","tree"],morro:["palm","palm_bend","palm_tall"]},C=M[t.map.id]??M.garden;for(let D=0;D<110;D++){const U=D/110*Math.PI*2,N=1.04+y()*.32,G=C[Math.floor(y()*C.length)];l.push({k:G,x:n/2+Math.cos(U)*n*.6*N,y:0,z:i/2+Math.sin(U)*i*.66*N,h:(G.startsWith("pine")?12:G.startsWith("palm")?10:9)*(.8+y()*.5),rot:y()*6.28,burnt:t.map.id==="fortress"&&y()<.3})}}this.buildSky(n,i);const h=e.getObjectByName("floor");h&&(h.receiveShadow=!0);const u=t.map.id==="morro"&&!!c,d=u?Ix().then(g=>this.addFort(g)).catch(g=>{console.warn("fort3d",g),this.fortFailed=!0}):Promise.resolve(),f=(g,_)=>Ft(t.map,g,_);for(const g of t.props)d.then(()=>Dv(g.kind)).then(_=>{this.alive&&(_.position.set(g.x*le,f(g.x,g.y),g.y*le),_.rotation.y=(g.kind==="tent"?.5:.25)+(g.flip?Math.PI:0),_.userData.mil=g.kind,_.traverse(x=>{x.castShadow=!0,x.receiveShadow=!0}),e.add(_),this.vm.props++)}).catch(_=>console.warn("prop load",_));let b=11;const v=()=>(b=b*16807%2147483647)/2147483647;for(const[g,_,x,E]of t.map.deco??[]){const w=Au(g,E);if(w&&(l.push({k:w.k,h:w.h*(.9+v()*.2),burnt:w.burnt,x:_*le,y:f(_,x)-.05,z:x*le,rot:v()*6.28}),!c&&!w.burnt&&/^(oak|tree|pine|palm|bush|fern)/.test(w.k)))for(let A=0;A<2;A++){const S=v()*6.28,y=.6+v()*1.6;l.push({k:"grass",h:.35+v()*.3,x:_*le+Math.cos(S)*y,y:f(_,x)-.02,z:x*le+Math.sin(S)*y,rot:v()*6.28})}}for(const g of t.obstacles)g.alive&&l.push(g.kind==="rock"?{k:"rock_big",h:1.5,x:g.x*le,y:f(g.x,g.y)-.1,z:g.y*le,rot:-g.ang}:{k:"log",h:.55,x:g.x*le,y:f(g.x,g.y),z:g.y*le,rot:-g.ang+Math.PI/2});d.then(()=>{if(u)for(const g of l)g.y=Ft(t.map,g.x/le,g.z/le)-.05;return u1(l,!this.touch&&this.vm.quality!=="low",{high:2,medium:1,low:0}[this.vm.quality])}).then(g=>{this.alive&&(e.add(g),this.vm.flora=l.length,this.floraGrp=g,g.userData.updateLod(this.camera,!0),this.vm.tex.flora=g.userData.texKinds,this.vm.tex.lod=g.children.filter(_=>_.userData.lod===1).length)}).catch(g=>console.warn("flora",g));for(const g of t.envs){if(u&&g.kind==="garita"){d.then(()=>{if(!this.fortFailed||!this.alive)return;const _=Cu(g.kind,ua("cobble"));et(_,g.x*le,f(g.x,g.y)-.05,g.y*le),e.add(_)});continue}d.then(()=>{if(!this.alive)return;const _=Cu(g.kind,ua("cobble"));et(_,g.x*le,f(g.x,g.y)-.05,g.y*le),_.rotation.y=(g.x*13+g.y*7)%628/100,e.add(_)})}const p=Pt(t.map.id==="morro"?13214818:9146265),m=Pt(t.map.id==="morro"?9062958:3829712);for(const g of t.buildings)if(g.alive){const _=new Ae;g.isHQ?(_.add(et(new j(new Se(6,4,6),p),0,2,0)),_.add(et(new j(new Fe(1.3,1.5,7,8),p),0,5.5,0)),_.add(et(new j(new Un(2,2.5,8),m),0,10.2,0)),_.add(et(new j(new Yt(2,1.2),new It({color:16767050,side:Rt})),1,12,0))):(_.add(et(new j(new Se(3.4,2.4,3.4),p),0,1.2,0)),_.add(et(new j(new Un(2.6,1.4,4).rotateY(Math.PI/4),m),0,3.1,0))),et(_,g.x*le,f(g.x,g.y),g.y*le),e.add(_)}this.ring=new j(new sl(.96,1,64).rotateX(-Math.PI/2),new Tt({color:8382719,transparent:!0,opacity:.55,depthWrite:!1})),this.ring.position.y=.04,e.add(this.ring)}buildSky(e,t){const n=this.isWar,{scene:i}=this,r=new ue(n?10195847:14542047),a=new ue(n?6186092:6264783),o=new ue(n?14721120:16769720),c=new ue(n?6972506:11122086);i.background=r.clone(),i.fog=this.real?new sr(r.getHex(),180,1e3):new sr(r.getHex(),n?28:40,n?150:185);const l=new Ae;l.name="sky";const h=new St(360,32,16),u=h.attributes.position,d=new Float32Array(u.count*3),f=new ue,b=new P;for(let w=0;w<u.count;w++)b.fromBufferAttribute(u,w).normalize(),b.y<0?f.copy(r).lerp(c,Math.min(1,-b.y*4)):f.copy(r).lerp(a,Math.pow(b.y,.55)),f.lerp(o,Math.pow(Math.max(0,b.dot(this.sunDir)),5)*.75),d.set([f.r,f.g,f.b],w*3);h.setAttribute("color",new mt(d,3));const v=new j(h,new Tt({vertexColors:!0,side:Zt,fog:!1,depthWrite:!1}));v.renderOrder=-2,l.add(v);const p=document.createElement("canvas");p.width=p.height=128;const m=p.getContext("2d"),g=m.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,"rgba(255,255,250,1)"),g.addColorStop(.07,"rgba(255,252,236,1)"),g.addColorStop(.22,"rgba(255,224,170,0.5)"),g.addColorStop(1,"rgba(255,205,150,0)"),m.fillStyle=g,m.fillRect(0,0,128,128);const _=new Sa(new gr({map:new el(p),blending:gs,depthWrite:!1,fog:!1,transparent:!0}));_.position.copy(this.sunDir).multiplyScalar(330),_.scale.setScalar(150),_.name="sunglow",l.add(_),i.add(l),this.sky=l;const x=new Ae;x.name="hills";const E=Math.max(e,t)*.5+85;for(let w=0;w<2;w++){const S=E+w*70,y=[],M=[],C=[],D=new ue(n?w?8157038:5130819:w?10991798:8230272).lerp(r,w?.35:.15),U=D.clone().lerp(r,.55);for(let O=0;O<=72;O++){const Y=O/72*Math.PI*2,H=(12+9*Math.sin(Y*3+w*2)+6*Math.sin(Y*7+1.3)+3.5*Math.sin(Y*17))*(w?1.7:1)+4,te=e/2+Math.cos(Y)*S,oe=t/2+Math.sin(Y)*S*.92;if(y.push(te,-3,oe,te,H,oe),M.push(U.r,U.g,U.b,D.r,D.g,D.b),O<72){const me=O*2;C.push(me,me+1,me+2,me+1,me+3,me+2)}}const N=new gt;N.setAttribute("position",new We(y,3)),N.setAttribute("color",new We(M,3)),N.setIndex(C);const G=new j(N,new Tt({vertexColors:!0,fog:!1,side:Rt}));G.renderOrder=-1+w*-.5,x.add(G)}this.real||i.add(x)}buildTerrain(e,t,n){const{scene:i,g:r}=this,a=r.map.terrain,o=jd(a);i.background=new ue(9425138),i.fog=new sr(9425138,70,200);const c=new Yt(e,t,a.cols-1,a.rows-1).rotateX(-Math.PI/2).translate(e/2,0,t/2),l=c.attributes.position;for(let p=0;p<l.count;p++)l.setY(p,o[p]);c.computeVertexNormals();const h=new Nn().load(zt(a.ground));h.colorSpace=pt,h.anisotropy=8;const u=new j(c,ha(new It({map:h}),{slope:!0,stone:this.real?.25:.4,war:this.isWar}));u.name="floor",u.userData.detail=!0,i.add(u),this.floorGeo=c,this.groundPhoto=h;const d=this.real?3200:900,f=new j(new Yt(d,d).rotateX(-Math.PI/2),(()=>{const p=e1().clone();return p.repeat.set(d/7,d/7),p.needsUpdate=!0,this.seaN=p,new Z_({color:this.real?2906718:3494223,transparent:!0,opacity:this.real?.8:.86,normalMap:p,normalScale:new q(.6,.6),shininess:70,specular:7307136})})());f.position.set(e/2,a.water,t/2),f.name="sea",i.add(f);const b=new j(new Yt(d,d).rotateX(-Math.PI/2),Pt(1846318));b.position.set(e/2,this.real?a.off-.3:-1.7,t/2),i.add(b);const v=(p,m)=>Jd(r.map,p,m);for(const[p,m,g,_]of a.props){const x=Au(p,_);if(x){n.push({k:x.k,h:x.h,burnt:x.burnt,x:m*le,y:v(m,g)-.08,z:g*le,rot:(m*7+g*3)%628/100,tilt:x.burnt?((m+g)%9-4)*.02:0});continue}if(p!=="prflag")continue;const E=new Nn().load(zt(`assets/maps/tropical/${p}.png`));E.colorSpace=pt;const w=new Sa(new gr({map:E,alphaTest:.4})),A=_*Qn*.9;w.center.set(.5,.04),w.scale.set(A,A,1),w.position.set(m*le,v(m,g)-.1,g*le),w.userData.prop=p,i.add(w)}this.isWar&&(this.war=f1(i,a.props,v,le,this.touch,ua("cobble")))}addFort(e){if(!this.alive)return;const t=this.g,n=t.map.width,i=t.map.height;this.fort=e,Sl(t.map.id,(d,f)=>us(e,d,f));const r=this.vm.quality==="high"?1:2,a=ha(new It({map:this.groundPhoto}),{slope:!0,stone:.25}),o=Ox(e,this.groundPhoto,le,n,i,r,a);this.scene.add(o),o.userData.chunks&&(this.vm.fortChunks=o.userData.chunks);const c=this.floorGeo,l=t.map.terrain;if(c){const d=c.attributes.position,f=ft.x0*le,b=ft.y0*le,v=(ft.x0+(ft.cols-1)*ft.step)*le,p=(ft.y0+(ft.rows-1)*ft.step)*le,m=n*le/(l.cols-1)*1.05;for(let g=0;g<d.count;g++){const _=d.getX(g),x=d.getZ(g);_>f+m&&_<v-m&&x>b+m&&x<p-m&&d.setY(g,d.getY(g)-9)}d.needsUpdate=!0,c.computeVertexNormals()}const h=Wx(e,le,t.envs.filter(d=>d.kind==="garita").map(d=>[d.x,d.y]));h.group.traverse(d=>{d.isMesh&&!d.userData.arcade&&(d.castShadow=!0)}),this.scene.add(h.group),this.morro=h;let u=0;for(let d=0;d<e.cls.length;d++)e.cls[d]&&u++;this.vm.fort={verts:o.userData.verts,tris:o.userData.tris,garitas:h.garitas,arcades:h.arcades,lighthouse:1,masonry:+(u/e.cls.length).toFixed(3)},Bi(`possess: El Morro fort ${this.vm.fort.tris} tris, ${h.garitas} garitas`)}buildGun(){const e=Pt(2896680),t=Pt(5596735),n=new Tt({color:16758074}),i=(r,a,o,c,l,h,u)=>{const d=new j(new Se(r,a,o),c);return d.position.set(l,h,u),this.gun.add(d),d};if(this.isTower){const r=new ue(Er(this.obj.data.faction).color).getHex(),a=Pt(r);i(.5,.2,.55,a,0,-.08,.05);for(const o of[-.1,.1])i(.06,.06,.7,e,o,0,-.45);i(.2,.03,.04,n,0,.04,-.2),this.gun.position.set(0,-.32,-.5)}else this.isBug?this.gun.position.set(0,-.5,-.4):(i(.11,.13,.62,t,0,0,-.1),i(.05,.05,.38,e,0,.02,-.55),i(.07,.17,.09,e,0,-.13,.02),i(.06,.05,.14,e,0,.1,-.05),i(.03,.02,.06,n,0,.13,-.05),i(.15,.13,.5,Pt(5204794),.06,-.2,.12).rotation.x=.35,this.gun.scale.setScalar(.85),this.gun.position.set(.22,-.22,-.45));this.flash=new j(new Yt(.34,.34),new Tt({color:16762976,transparent:!0,blending:gs,depthWrite:!1})),this.flash.position.set(0,.02,this.isTower?-.85:-.78),this.flash.visible=!1,this.gun.add(this.flash),this.gunBase.copy(this.gun.position),this.gun.traverse(r=>r.layers.set(1)),this.camera.add(this.gun),this.scene.add(this.camera),this.loadViewmodel().catch(r=>console.warn("viewmodel",r))}async loadViewmodel(){const e=this.obj,t=(i,r,a,o,c=1)=>{if(this.alive){for(const l of[...this.gun.children])this.gun.remove(l);this.gun.add(i),i.add(this.flash),this.flash.position.copy(r),this.flash.scale.setScalar(c),this.gun.position.copy(a),this.gunBase.copy(a),this.vm.kind=o,this.gun.traverse(l=>l.layers.set(1))}},n=Pt(2303775);if(e instanceof an){const i=Oo[e.data.id];if(!i)return;const r=await rs(i);if(!this.alive)return;const a=Math.max(.6,e.data.radius*Qn*1.6);r.scale.setScalar(a),r.rotation.y=Math.PI/2,r.updateMatrixWorld(!0);const o=new bt().setFromObject(r),c=o.max.y-o.min.y,l=o.max.z-o.min.z;this.bugEye=Math.max(.55,c*.95),r.position.set(-(o.min.x+o.max.x)/2,-o.min.y-this.bugEye-c*.14,-o.min.z-l*.4),r.traverse(u=>{u.castShadow=!1});const h=new Ae;return h.add(r),t(h,new P(0,-this.bugEye*.6,-l*.4),new P(0,0,0),"bug_"+i,.01)}if(e instanceof rn&&e.data.id==="unsc_tank"){const i=new Ae,r=Pt([11902060,6122309,5662015][Math.min(2,e.tier)]);return i.add(et(new j(new Se(2.6,.14,1.6),r),0,-.98,-.45)),i.add(et(new j(new Se(1,.55,.7),r),0,-.88,-1.15)),i.add(et(new j(new Fe(.08,.1,3.6,12).rotateX(Math.PI/2),n),0,-.78,-2.9)),i.add(et(new j(new Fe(.13,.13,.5,12).rotateX(Math.PI/2),n),0,-.78,-3.3)),i.add(et(new j(new Ts(.42,.06,6,16).rotateX(Math.PI/2),n),0,-.9,.05)),this.vm.vehicles++,t(i,new P(0,-.78,-4.8),new P(0,0,0),"tank_cannon",4)}if(e instanceof rn&&e.data.id==="unsc_heli"){const i=new Ae,r=Pt(2830630),a=new Tt({color:9240474});i.add(et(new j(new Se(1.9,.3,.55),r),0,-.62,-.75));for(let c=0;c<3;c++)i.add(et(new j(new Yt(.28,.16),a),-.45+c*.45,-.46,-.47));for(const c of[-1,1]){const l=et(new j(new Se(.07,1.8,.07),r),c*.95,.05,-.75);l.rotation.z=c*.28,l.rotation.x=-.35,i.add(l)}i.add(et(new j(new Se(2.3,.07,.07),r),0,.82,-.55));const o=new Ae;o.add(new j(new St(.22,10,8),n));for(const c of[-.06,.06])o.add(et(new j(new Fe(.035,.035,1.3,6).rotateX(Math.PI/2),n),c,0,-.65));return et(o,0,-1.25,-1.5),i.add(o),this.vm.vehicles++,t(i,new P(0,-1.25,-2.25),new P(0,0,0),"heli_chingun",1.6)}if(e instanceof rn&&(e.data.id==="unsc_autoturret"||e.data.id==="unsc_flak")){const i=await Uo("rifle"),r=new Ae;if(i.scale.setScalar(1.25),r.add(i),i.userData.textured&&this.vm.tex.gun++,e.data.id==="unsc_flak"){const o=await Uo("rifle");o.scale.setScalar(1.25),o.position.x=-.32,r.add(o)}const a=i.userData.muzzle.clone().multiplyScalar(1.25);return t(r,a,new P(.12,-.3,-.42),"mounted_mg")}if(e instanceof rn&&e.t.combat){const i=e.data.projectile??"dart",r=mu[i]??mu[e.data.id==="unsc_rail"?"rail":""]??null;if(r)try{const a=await rs(r);a.rotation.y=-Math.PI/2,a.updateMatrixWorld(!0);const c=new bt().setFromObject(a).getSize(new P),l=Math.max(c.x,c.z,.4),h=new Ae;h.add(a);const u=new P(0,.02,-l*.55);return this.vm.tex.gun++,t(h,u,new P(.15,-.22,-.35),"glb_"+r,i==="laser"||i==="rail"?1.4:.9)}catch(a){console.warn("glb gun",r,a)}}if(e instanceof Cn){const i=!!e.data.vehicle,r=Fv(e.data.id,i);this.vm.hands=0;const a=Hv(e.data.id,this.g.unitTier(e.data.id)),o=a?Gv[a]:void 0;let c=null;if(a&&o)try{const p=await rs(a);if(!this.alive)return;if(p.rotation.y=Math.PI/2,p.updateMatrixWorld(!0),p.traverse(_=>{_.castShadow=!0}),i){const _=new Ae;_.add(p);const x=e.data.id==="scorpion",E=x?new P(0,-1,-.8):new P(.05,-.78,-1.15);return this.vm.vehicles++,this.vm.tex.gun++,t(_,new P(0,o.barrel,-o.tip-.05),E,a,x?4:1.6)}const m=new bt().setFromObject(p);p.position.set(-(m.min.x+m.max.x)/2,-m.min.y,-(m.min.z+m.max.z)/2);const g=m.max.z-m.min.z;c=new Ae,c.add(p),c.userData={len:g,h:m.max.y-m.min.y,muzzle:new P(0,o.barrel-m.min.y,-g/2-.02),gunKind:r,textured:!0}}catch(p){console.warn("glb unit gun",a,p)}const l=c??await Uo(r),h=l.userData.textured?1:.78;l.scale.set(1,h,1);const u=l.userData.len,d=l.userData.muzzle.clone();d.y*=h,l.userData.textured&&this.vm.tex.gun++;const f=new Ae;if(f.add(l),!i){const p=new ue(Er(e.data.faction).color).lerp(new ue(4870710),.7).getHex(),m=r==="pistol",g=uu(p);if(g.scale.setScalar(.9),et(g,.035,d.y-.1,m?.02:u*.17),g.rotation.set(-1,.15,.3),f.add(g),this.vm.tex.glove++,m)this.vm.hands=1;else{const _=uu(p);_.scale.setScalar(.9),et(_,l.userData.textured?-.012:-.035,d.y-.095,-u*.2),_.rotation.set(-.55,-.25,-.45),f.add(_),this.vm.hands=2}f.rotation.set(.02,.07,.03)}const b=a==="gun_aegis_beam"&&!!c,v=i?new P(0,-.45-d.y*1.4,-.75):new P(R1(r)?.1:b?.24:.17,(b?-.2:-.1)-d.y,-(u*.5)-(b?.22:.12));return i&&l.scale.multiplyScalar(1.4),t(f,d.multiplyScalar(i?1.4:1),v,c&&a?a:"gun_"+r,a==="gun_aegis_beam"||r==="rocket"?2:.7)}}buildPools(){const e=new St(.62,12,9);e.scale(1,1.18,1);const t=new Un(.12,.2,6).translate(0,-.78,0).rotateX(Math.PI),n=cr([e,t]),i=["red","blue","green","yellow","pink","lead","ceramic"];for(const p of i){const m=new It({color:16777215,map:Fo(p)}),g=new en(n,m,200);g.instanceColor=new Ui(new Float32Array(200*3),3),g.count=0,g.frustumCulled=!1,this.scene.add(g),this.bloonMeshes.set(p,g)}const r=new It({color:16777215,map:Fo("red")});this.bloonMesh=new en(n.clone(),r,200);const a=new St(.55,10,8).scale(1.3,.7,1).translate(0,.55,0),o=new St(.32,8,6).translate(.75,.62,0),c=[];for(let p=0;p<6;p++){const m=-.4+p%3*.4,g=p<3?1:-1;c.push(new Se(.08,.08,.7).translate(m,.25,g*.55).rotateX(g*.3))}const l=new It({color:16777215,map:Fo("scavenger")});this.bugMesh=new en(cr([a,o,...c].map(p=>p.index?p.toNonIndexed():p)),l,300);const h=new Ss(.32,.9,4,10).translate(0,.78,0),u=new Se(.34,.14,.22).translate(.2,1.4,0),d=new Se(.7,.18,.35).translate(0,1.25,0),f=bi("cloth").clone();f.vertexColors=!0,this.unitMesh=new en(cr([h.toNonIndexed(),u.toNonIndexed(),d.toNonIndexed()]),f,300);const b=new Ss(.08,.55,3,6);b.rotateZ(Math.PI/2),this.shotMesh=new en(b,new Tt({vertexColors:!0}),500),this.shotMesh.instanceColor=new Ui(new Float32Array(500*3),3),this.bitMesh=new en(new al(.16),new Tt,500);for(const p of[this.bloonMesh,this.bugMesh,this.unitMesh,this.bitMesh])p.instanceColor=new Ui(new Float32Array(p.instanceMatrix.count*3),3);this.acidMesh=new en(new Fe(.5,.5,1,8),new Tt({color:9240378}),200),this.poolMesh=new en(new Fa(1,20).rotateX(-Math.PI/2),new Tt({color:8314924,transparent:!0,opacity:.6,depthWrite:!1}),48);for(const p of[this.acidMesh,this.poolMesh])p.count=0,p.frustumCulled=!1,this.scene.add(p);for(const p of[this.bloonMesh,this.bugMesh,this.unitMesh,this.shotMesh,this.bitMesh])p.count=0,p.frustumCulled=!1,this.scene.add(p);this.upgradeEnemyGlbs();const v=new Qc({color:16773280,transparent:!0,depthWrite:!1});for(let p=0;p<48;p++){const m=new Ua(new gt().setFromPoints([new P,new P]),v.clone());m.visible=!1,m.frustumCulled=!1,this.scene.add(m),this.tracers.push({line:m,life:0})}}async upgradeEnemyGlbs(){const e=t=>t==="moab"||t==="gargoyle"||t==="bile_titan"||t.startsWith("boss_");await Promise.all(Object.entries(Oo).map(async([t,n])=>{try{if(e(t)){const i=await rs(n);if(!this.alive)return;this.bossTpl.set(t,i)}else{const i=await pu(n);if(!this.alive||!i.length)return;const r=n.startsWith("bloon_")?200:300,a=i.map(o=>{const c=new en(o.geometry,o.material,r);return c.count=0,c.frustumCulled=!1,this.scene.add(c),c});this.enemySets.set(t,{parts:a,n:0,cap:r,glb:n})}this.vm.towers3d["glb_"+n]=1}catch(i){console.warn("glb enemy",n,i)}}))}requestUnitGlb(e,t){this.unitGlbReq.has(e)||(this.unitGlbReq.add(e),(async()=>{try{if(t){const n=await rs(e);if(!this.alive)return;n.traverse(i=>{i.castShadow=!0}),this.vehTpl.set(e,n)}else{const n=await pu(e);if(!this.alive||!n.length)return;const i=300,r=n.map(a=>{const o=new en(a.geometry,a.material,i);return o.count=0,o.frustumCulled=!1,o.castShadow=!0,this.scene.add(o),o});this.troopSets.set(e,{parts:r,n:0,cap:i})}this.vm.unitGlbLoaded.push(e),this.vm.towers3d["glb_"+e]=1}catch(n){console.warn("glb unit",e,n)}})())}bossModel(e){let t=this.bossModels.get(e);const n=this.bossTpl.get(e.data.id);if(t&&(t.userData.glb||!n))return t;if(t&&(this.scene.remove(t),this.bossModels.delete(e)),n){t=new Ae;const r=n.clone(!0);return t.add(r),t.userData.glb=Oo[e.data.id],this.scene.add(t),this.bossModels.set(e,t),t}t=new Ae;const i=cs(e)||(Du[e.data.id]??9060312);if(e.data.family==="bloon"||e.data.air){t.add(new j(new St(1,16,10).scale(1.9,.85,.85),Pt(i)));for(const r of[-1,1])t.add(et(new j(new Se(.5,.06,.9),Pt(2238520)),-1.6,0,r*.6));t.add(et(new j(new Se(.5,.9,.06),Pt(2238520)),-1.6,.4,0))}else{t.add(new j(new St(1,14,10).scale(1.5,.75,1.1),Pt(i))),t.add(et(new j(new St(.5,10,8),Pt(2763306)),1.4,.15,0));for(let r=0;r<6;r++){const a=-.7+r%3*.7,o=r<3?1:-1;t.add(et(new j(new Se(.15,.15,1.3),Pt(2236962)),a,-.45,o*1))}}return this.scene.add(t),this.bossModels.set(e,t),t}towerModel(e){let t=this.towerModels.get(e);if(t&&t.tier!==e.tier&&(this.scene.remove(t.root),this.towerModels.delete(e),t=void 0),t)return t;if(e.data.id==="unsc_tank"||e.data.id==="unsc_heli"||e.data.id==="unsc_destroyer"||e.data.id==="unsc_beacon"){const o=new Ae,c=new Ae;o.add(c);const l=e.data.id==="unsc_tank"?"tank":e.data.id==="unsc_heli"?"heli":e.data.id==="unsc_destroyer"?"destroyer":"beacon",h={root:o,head:c,veh:l,tier:e.tier,model:void 0};return(l==="tank"?hu(e.tier):l==="heli"?Cv(e.tier):Promise.resolve(l==="destroyer"?Pv(e.tier):Lv(e.tier))).then(d=>{if(!this.alive)return;d.traverse(b=>{b.castShadow=!0}),c.add(d),h.model=d,this.vm.vehicles++;const f=new bt().setFromObject(d).getSize(new P);this.vm.size[l]=[f.x,f.y,f.z].map(b=>+b.toFixed(2))}),o.userData.veh=l,this.scene.add(o),this.towerModels.set(e,h),h}const n=Bv[e.data.id];if(n){const o=new Ae,c=new Ae;o.add(c);const l={root:o,head:c,tier:e.tier,base:1,model:void 0};return rs(n).then(h=>{if(!this.alive||!this.towerModels.get(e))return;h.scale.setScalar(1.15),c.add(h),l.model=h,this.vm.towers3d["glb_"+n]=(this.vm.towers3d["glb_"+n]??0)+1;const u=new bt().setFromObject(h).getSize(new P);this.vm.size[n]=[u.x,u.y,u.z].map(d=>+d.toFixed(2))}),this.scene.add(o),this.towerModels.set(e,l),l}const i=Zv(e.data.id,e.tier);if(i)return this.vm.towers3d[i.root.userData.tower3d]=(this.vm.towers3d[i.root.userData.tower3d]??0)+1,this.scene.add(i.root),t={root:i.root,head:i.head,tier:e.tier,base:i.root.scale.x},this.towerModels.set(e,t),t;const r=new Ae,a=new Ae;return r.add(et(new j(new Fe(1.1,1.3,.5,10),Pt(7166532)),0,.25,0)),a.add(new j(new Se(1,.6,.9),Pt(new ue(Er(e.data.faction).color).getHex()))),a.position.y=2,r.add(a),this.scene.add(r),t={root:r,head:a,tier:e.tier},this.towerModels.set(e,t),t}buildHud(){const e=this.obj,t=e instanceof rn?e.t.name:e instanceof an?Ar(e.data.id).name:this.ovr?Tl(e.data.id).name:e.squad.data.tiers[this.g.unitTier(e.squad.data.id)].name,n=e instanceof Cn?this.g.squadAbilities(e.squad):[],i=e instanceof an?Ar(e.data.id):null;this.root.insertAdjacentHTML("beforeend",`
      <div class="ps-hud">
        <div class="ps-cross" id="ps-cross"><i></i></div>
        ${this.canScope?'<div class="ps-scope" id="ps-scope" hidden><div class="lens"><i class="h"></i><i class="v"></i><b></b></div><span>SCOPED · ×5</span></div>':""}
        <div class="ps-top"><span class="ps-tag">${this.ovr?"🪲 OVERRUN":"👁 POSSESSED"}</span><span class="ps-chip">🌊 Wave <b id="ps-wave"></b></span>
          <span class="ps-chip">🏰 HQ <b id="ps-hq"></b><span class="ps-bar"><b id="ps-hqb"></b></span></span><span class="ps-chip">💰 <b id="ps-cash"></b></span><span class="ps-chip">🎯 <b id="ps-hits">0</b> hits</span></div>
        <div class="ps-btns"><button id="ps-pause" title="Pause">⏸</button><button class="ps-exit" id="ps-exit">${this.ovr?"🗺 Tactical map (E/Tab)":"⏏ Exit (Esc/E)"}</button></div>
        <div class="ps-me"><div class="nm">${t}</div><div class="hp"><b id="ps-hp"></b></div><div class="cd"><b id="ps-cd"></b></div>
          <small>${i?`${i.blurb} · bite ${i.bite}`:`${this.isTower?"Stationary turret":this.ovr?"WASD move":"WASD move · squad follows"} · direct hits +${Math.round((Xd-1)*100)}% dmg · ammo ∞`}</small></div>
        <div class="ps-abil" id="ps-abil">${n.map((r,a)=>`<button data-ab="${r}">${Wa[r].icon} ${Wa[r].name}<br><small>${a===0?"Q / 1":String(a+1)}</small><i></i></button>`).join("")}${i?`<button data-bug="1">🦷 ${i.ability}<br><small>Q / Space</small><i></i></button>`:""}</div>
        <div class="ps-help">${i?"Mouse look · click/hold: bite · WASD prowl · Q/Space: "+i.ability:`Mouse aim · click/hold fire${this.canScope?" · <b>hold Right-click / Shift: aim down scope</b>":""}${this.isTower?"":" · WASD move · Q/1-2 abilities · F: enter/exit parked vehicle"}`}<br>${this.ovr?"E / Tab: tactical map (place towers)":"Esc or E: back to the 2D map"} · P pause</div>
        <div class="ps-msg" id="ps-msg" hidden></div>
        <div class="ps-veh" id="ps-veh" hidden></div>
      </div>
      <canvas class="ps-mini" id="ps-mini" width="180" height="${Math.round(180*this.g.map.height/this.g.map.width)}"></canvas>
      <div class="ps-touch" id="ps-touch" ${this.touch?"":"hidden"}>${this.isTower?"":'<div class="ps-joy home" id="ps-joy"><i></i></div>'}<button class="ps-fire" id="ps-fire">FIRE</button></div>
      <div class="ps-pause" id="ps-pause-ov" hidden><div class="panel"><h2>⏸ Paused</h2><div class="row"><button class="btn primary" id="ps-resume">▶ Resume</button><button class="btn" id="ps-pexit">${this.ovr?"🗺 Tactical map":"⏏ Exit first-person"}</button></div></div></div>`);for(const r of["cross","wave","hq","hqb","cash","hits","hp","cd","abil","msg","pause-ov","joy","fire","veh"])this.el[r]=this.root.querySelector("#ps-"+r);this.mini=this.root.querySelector("#ps-mini"),this.miniImg.src=zt(this.g.map.image)}setPause(e){const t=this.g;t.netPause?t.netPause(e):t.paused=e}bindInput(){const e=this.renderer.domElement,t=a=>this.root.querySelector("#ps-"+a);t("exit").onclick=t("pexit").onclick=()=>this.exit(),t("pause").onclick=()=>this.setPause(!0),t("resume").onclick=()=>{var a;this.setPause(!1),this.touch||(a=e.requestPointerLock)==null||a.call(e)};for(const a of["exit","pause"])t(a).onpointerdown=o=>o.stopPropagation();this.el.abil.querySelectorAll("button").forEach(a=>{a.onpointerdown=o=>o.stopPropagation(),a.onclick=()=>a.dataset.bug?this.bugAbility():this.ability(a.dataset.ab)}),e.addEventListener("mousedown",a=>{var o;if(!this.touch&&a.button===2){this.setAds(!0);return}this.touch||a.button!==0||(this.locked||(o=e.requestPointerLock)==null||o.call(e),this.firing=!0)}),addEventListener("mouseup",this.onUp),e.addEventListener("contextmenu",a=>a.preventDefault()),document.addEventListener("pointerlockchange",this.onLock),addEventListener("mousemove",this.onMouse),addEventListener("keydown",this.onKey,!0),addEventListener("keyup",this.onKeyUp,!0);const n=t("touch");n.addEventListener("pointerdown",a=>{!this.isTower&&a.clientX<innerWidth*.4&&this.joy.id<0&&this.el.joy?(this.joy={id:a.pointerId,ox:a.clientX,oy:a.clientY,x:0,y:0},this.el.joy.classList.remove("home"),Object.assign(this.el.joy.style,{display:"block",left:a.clientX-60+"px",top:a.clientY-60+"px"})):this.lookId<0&&(this.lookId=a.pointerId,this.lookX=a.clientX,this.lookY=a.clientY)}),n.addEventListener("pointermove",a=>{if(a.pointerId===this.joy.id){let o=a.clientX-this.joy.ox,c=a.clientY-this.joy.oy;const l=Math.hypot(o,c);l>50&&(o*=50/l,c*=50/l),this.joy.x=o/50,this.joy.y=c/50,this.el.joy.firstElementChild.style.transform=`translate(${o}px,${c}px)`}else a.pointerId===this.lookId&&(this.look((a.clientX-this.lookX)*2.2,(a.clientY-this.lookY)*2.2),this.lookX=a.clientX,this.lookY=a.clientY)});const i=a=>{a.pointerId===this.joy.id&&(this.joy.id=-1,this.joy.x=this.joy.y=0,this.el.joy.removeAttribute("style"),this.el.joy.classList.add("home"),this.el.joy.firstElementChild.style.transform=""),a.pointerId===this.lookId&&(this.lookId=-1)};n.addEventListener("pointerup",i),n.addEventListener("pointercancel",i);const r=this.el.fire;r.addEventListener("pointerdown",a=>{a.stopPropagation(),this.firing=!0}),r.addEventListener("pointerup",()=>{this.firing=!1}),r.addEventListener("pointercancel",()=>{this.firing=!1})}get canScope(){return this.obj instanceof rn&&this.obj.data.id==="sniper_monkey"}setAds(e){this.ads=e&&this.canScope&&this.alive}updateAds(e){const t=Math.max(0,Math.min(1,this.adsK+(this.ads?1:-1)*e*7));if(t===this.adsK)return;this.adsK=t,this.camera.fov=70+(S1-70)*t,this.camera.updateProjectionMatrix(),this.gun.visible=t<.55;const n=this.root.querySelector("#ps-scope");n&&(n.hidden=t<.55),this.el.cross.style.display=t>=.55?"none":""}look(e,t){const n=1-.78*this.adsK;e*=n,t*=n,this.yaw-=e*.0022;const[i,r]=this.isTower?[-.85,.45]:[-1.2,1.2];this.pitch=Math.max(i,Math.min(r,this.pitch-t*.0022))}bugAbility(){this.isBug&&(this.abN++,Bi("possess: monster ability"))}toggleVehicle(){const e=this.obj;if(!(e instanceof Cn)||!e.alive)return!1;const t=this.g.toggleVehicle(e);return Bi("possess: vehicle "+(e.data.vehicle?"enter ":"exit ")+e.data.id),t!==!1}ability(e){this.obj instanceof Cn&&this.g.useAbility(this.obj.squad,e)&&Bi("possess: ability "+e)}buildPost(){if(this.vm.quality!=="high")return;const e=this.camera,t=this.scene,n=new Lu(t,e),i=new Lu(t,e);i.clear=!1,i.clearDepth=!0;const r=n.render.bind(n),a=i.render.bind(i);n.render=(...c)=>{e.layers.set(0),r(...c)},i.render=(...c)=>{const l=t.background;t.background=null,e.layers.set(1),a(...c),e.layers.set(0),t.background=l};const o=new v1(this.renderer,new xn(1,1,{type:nn,samples:this.touch?0:4}));this.bloom=new Ps(new q(256,256),.22,.35,.92),o.addPass(n),o.addPass(i),o.addPass(this.bloom),o.addPass(new w1),this.composer=o}dropToLow(){var e,t,n;this.vm.quality="low",Do(0),this.scene.environment=null,this.sun.castShadow=!1,this.renderer.shadowMap.enabled=!1,(n=(e=this.floraGrp)==null?void 0:(t=e.userData).setDetail)==null||n.call(t,0),this.scene.traverse(i=>{const r=i.material;r&&(r.needsUpdate=!0)}),console.info("[possess] slow frames: low quality")}dropPost(){this.composer&&(this.composer.dispose(),this.composer=null,this.bloom=null,this.vm.quality="medium",Do(1),console.info("[possess] slow frames: bloom off"))}placeSun(e){const t=this.v2.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw)).multiplyScalar(os*.4).add(e),n=os*2/2048;t.x=Math.round(t.x/n)*n,t.z=Math.round(t.z/n)*n,this.sun.position.copy(t).addScaledVector(this.sunDir,80),this.sun.target.position.copy(t),this.sun.target.updateMatrixWorld()}governor(){if(this.fps<45?this.slow++:this.slow=Math.max(0,this.slow-1),!this.pinQ&&this.slow>=3&&this.fps<24&&this.vm.quality!=="low"){this.composer?this.dropPost():this.dropToLow(),this.slow=0;return}this.slow>=3&&this.pr>.6&&(this.pr=Math.max(.6,this.pr-.25),this.renderer.setPixelRatio(this.pr),this.resize(),this.slow=0)}eye(){const e=this.obj,t=Ft(this.g.map,e.x,e.y);return e instanceof an?this.v.set(e.x*le,t+this.bugEye,e.y*le):e instanceof rn?this.v.set(e.x*le,t+(e.data.id==="unsc_tank"?3.4:e.data.id==="unsc_heli"?7.6+Math.sin(performance.now()/640)*.15:e.data.id==="unsc_destroyer"?4.2:e.data.id==="unsc_beacon"?9.5+e.tier*.4:2.7+e.tier*.15),e.y*le):this.v.set(e.x*le,t+(e.data.id==="scorpion"?3.3:e.data.vehicle?2.4:1.65),e.y*le)}tick(e){var E,w,A,S,y,M;const t=this.g,n=this.obj;if(!n.alive||t.state!=="playing"||n.possessedBy>=0&&n.possessedBy!==t.localPid&&t.net!=="solo")return this.exit(n.alive||this.ovr?void 0:`${this.isTower?"Tower":"Troop"} lost — back to the map`),!1;t.speed!==1&&(t.speed=1);const i=this.eye();this.camera.position.copy(i),this.camera.rotation.set(this.pitch,this.yaw,0),this.sky.position.copy(i),this.placeSun(i),this.ray.setFromCamera(new q(0,0),this.camera);let r=null,a=1/0;const o=this.rangePx()*le*1.3;for(const C of this.isBug?[]:t.enemies){if(!C.alive||C===n)continue;const D=this.v2.set(C.x*le,this.ey(C),C.y*le),U=Bo(C)*(C.data.boss||C.data.id==="moab"?2.2:1.25),N=D.clone().sub(this.ray.ray.origin).dot(this.ray.ray.direction);N<=0||N>o+U||N>=a||this.ray.ray.distanceSqToPoint(D)<U*U&&(a=N,r=C)}const c=this.ray.ray.direction;let l=Math.atan2(c.z,c.x);if(r)l=Math.atan2(r.y-n.y,r.x-n.x);else if(c.y<-.02){const C=-(i.y-Ft(t.map,n.x,n.y))/c.y;l=Math.atan2(i.z+c.z*C-n.y*le,i.x+c.x*C-n.x*le)}this.el.cross.classList.toggle("on",!!r||n instanceof an&&!!((w=(E=this.g.overrun)==null?void 0:E.prey)!=null&&w.call(E,n,l)));let h=0,u=0;this.isTower||((this.keys.has("w")||this.keys.has("arrowup"))&&(h+=1),(this.keys.has("s")||this.keys.has("arrowdown"))&&(h-=1),(this.keys.has("d")||this.keys.has("arrowright"))&&(u+=1),(this.keys.has("a")||this.keys.has("arrowleft"))&&(u-=1),h-=this.joy.y,u+=this.joy.x);const d=-Math.sin(this.yaw),f=-Math.cos(this.yaw),b=Math.cos(this.yaw),v=-Math.sin(this.yaw),p={aim:l,fire:this.firing&&!t.paused,target:r,mx:d*h+b*u,my:f*h+v*u,...this.isBug?{ab:this.abN}:{}};this.sendT-=e,t.net!=="client"||this.sendT<=0||p.fire!==this.sentFire||this.abN!==this.sentAb?(this.sendT=1/15,this.sentFire=p.fire,this.sentAb=this.abN,this.ctl=p,t.possessCtl(n,p)):n.manual&&(n.manual.aim=l,n.manual.mx=p.mx,n.manual.my=p.my,n.manual.target=r);const m=n instanceof rn?((A=n.combat)==null?void 0:A.shotCount)??0:n instanceof an?n.ov.bites:t.stats.manualShots;if(this.lastShot<0&&(this.lastShot=m),m!==this.lastShot)if(this.lastShot=m,this.shots++,this.flashT=this.isBug?0:.06,this.kick=1,n instanceof an)(y=(S=this.g.overrun)==null?void 0:S.prey)!=null&&y.call(S,n,l)&&(this.hits++,this.hitT=.15);else{const C=r?new P(r.x*le,this.ey(r),r.y*le):i.clone().addScaledVector(c,Math.min(o,40)),D=this.obj instanceof rn?this.obj.data.projectile??"bullet":"bullet",U=D==="rail"||D==="laser";this.tracer(this.flash.getWorldPosition(new P),C,Iu[D]??16773280,U?.22:.1),this.gunRoll=(Math.random()-.5)*.05,r&&(this.hits++,this.hitT=.15)}this.hitT-=e,this.el.cross.classList.toggle("hit",this.hitT>0),this.flashT-=e,this.flash.visible=this.flashT>0,this.flash.visible&&(this.flash.rotation.z=Math.random()*3);const g=!this.isTower&&Math.abs(p.mx)+Math.abs(p.my)>.1;this.bob+=e*(g?9:1.5);const _=g?.012:.003;this.kick=Math.max(0,this.kick-e*9);const x=this.vm.kind==="tank_cannon"?2.5:1;if(this.gun.position.set(this.gunBase.x+Math.cos(this.bob)*_,this.gunBase.y+Math.abs(Math.sin(this.bob))*_-this.kick*.01,this.gunBase.z+this.kick*.06*x),this.gun.rotation.set(this.kick*.09,0,this.gunRoll*this.kick),this.updateAds(e),n instanceof Cn&&n.data.id!==this.vehId){const C=!this.vehId;if(this.vehId=n.data.id,!C){this.vm.boards++,this.loadViewmodel().catch(U=>console.warn("viewmodel",U));const D=this.root.querySelector(".ps-me .nm");D&&(D.textContent=this.ovr?Tl(n.data.id).name:n.data.tiers[t.unitTier(n.data.id)].name)}}return(M=this.morro)==null||M.update(e),this.syncParked(),this.syncEntities(e),this.hud(e),!0}rangePx(){const e=this.obj;return e instanceof rn?e.t.combat?e.range(e.t.combat.range):200:e instanceof an?4/le:e.range(this.g)}tracer(e,t,n=16773280,i=.12){const r=this.tracers.find(a=>a.life<=0)??this.tracers[0];r.line.geometry.setFromPoints([e,t]),r.line.material.color.setHex(n),r.line.material.opacity=1,r.life=i,r.line.visible=!0}syncBeams(e){var i,r,a;const t=this.g,n=(o,c)=>Ft(t.map,o,c);for(const o of t.towers){const c=(i=o.combat)==null?void 0:i.beamTo;if(!c||!c.alive||o.data.id!=="unsc_beacon")continue;const l=o.combat.lockT,h=((r=o.t.combat)==null?void 0:r.lockRampMax)??2,u=Math.min(1,l*(((a=o.t.combat)==null?void 0:a.lockRamp)??.25)/Math.max(.01,h)),d=new P(o.x*le,n(o.x,o.y)+9.2+o.tier*.35,o.y*le),f=new P(c.x*le,this.ey(c),c.y*le),b=u>.6?16763e3:u>.25?16771248:16774880;this.tracer(d,f,b,.08)}for(const o of t.effects){if(o.kind!=="beam"||(o.t??0)>.05)continue;const c=new P(o.x*le,n(o.x,o.y)+2.2,o.y*le),l=new P((o.x2??o.x)*le,n(o.x2??o.x,o.y2??o.y)+1.8,(o.y2??o.y)*le);let h=16773280;const u=o.color??"";u.includes("8fd0")||u.includes("c8f0")||u.includes("7ec8")||u.includes("9adf")?h=10149887:u.includes("ffd2")||u.includes("ffe9")||u.includes("fff6")?h=16771488:u.includes("ff4")||u.includes("ff60")||u.includes("ff50")?h=16736352:u.includes("9fe7")&&(h=10479615),this.tracer(c,l,h,Math.max(.12,o.dur??.1))}}syncEntities(e){var p,m;const t=this.g,n=this.dummy,i=this.obj;let r=0;const a=new Set;for(const g of this.bloonMeshes.values())g.userData._n=0;this.bloonMesh.userData._n=0;const o={};for(const g of t.enemies){if(!g.alive||(a.add(g),g===i))continue;const _=Ft(t.map,g.x,g.y),x=g.x*le,E=g.y*le,w=Uu(g)+_,A=g.data.id;if(g.data.boss||A==="moab"||g.data.air){const y=this.bossModel(g),M=Math.max(1,g.data.radius*Qn*.9),C=y.userData.glb,D=C?Wv.has(C)?Math.max(w,_+1.25*M):_:w;y.position.set(x,D,E),y.rotation.set(0,-g.ang,0),y.scale.setScalar(M),C&&(o[A]=C),this.seen.set(g,{x,y:w,z:E,c:Du[A]??9060312});continue}const S=this.enemySets.get(A);if(S){if(S.n>=S.cap)continue;if(g.data.family==="bloon"){const y=Bo(g)/.62*.95,M=performance.now()/300+g.uid,C=Math.sin(M)*.12;n.position.set(x,w+C,E),n.rotation.set(Math.sin(M*.7)*.06,g.uid*1.7,Math.cos(M*.6)*.06),n.scale.setScalar(y),this.seen.set(g,{x,y:w,z:E,c:cs(g)})}else{const y=Math.max(.6,g.data.radius*Qn*1.6);n.position.set(x,_,E),n.rotation.set(0,-g.ang,0),n.scale.setScalar(y),this.seen.set(g,{x,y:_+.5,z:E,c:cs(g)})}n.updateMatrix();for(const y of S.parts)y.setMatrixAt(S.n,n.matrix);S.n++,o[A]=S.glb;continue}if(g.data.family==="bloon"){const y=this.bloonMeshes.get(A)??this.bloonMesh,M=y.userData._n||0;if(M>=y.instanceMatrix.count)continue;const C=Bo(g)/.62*.95,D=Math.sin(performance.now()/300+g.uid)*.12;n.position.set(x,w+D,E),n.rotation.set(0,0,0),n.scale.setScalar(C),n.updateMatrix(),y.setMatrixAt(M,n.matrix),y.setColorAt(M,this.tmpC.setHex(16777215)),y.userData._n=M+1,this.seen.set(g,{x,y:w,z:E,c:cs(g)})}else{if(r>=300)continue;const y=Math.max(.6,g.data.radius*Qn*1.6);n.position.set(x,_,E),n.rotation.set(0,-g.ang,0),n.scale.setScalar(y),n.updateMatrix(),this.bugMesh.setMatrixAt(r,n.matrix),this.bugMesh.setColorAt(r++,this.tmpC.setHex(cs(g))),this.seen.set(g,{x,y:_+.5,z:E,c:cs(g)})}}for(const[g,_]of this.seen)a.has(g)||(this.seen.delete(g),this.burst(_.x,_.y,_.z,_.c,g.data.boss?30:8));for(const[g,_]of this.bossModels)a.has(g)||(this.scene.remove(_),this.bossModels.delete(g));for(const g of this.bloonMeshes.values())g.count=g.userData._n||0,g.userData._n=0,g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0);this.bloonMesh.count=this.bloonMesh.userData._n||0,this.bloonMesh.userData._n=0,this.bloonMesh.instanceMatrix.needsUpdate=!0,this.bloonMesh.instanceColor&&(this.bloonMesh.instanceColor.needsUpdate=!0),this.bugMesh.count=r;for(const g of this.enemySets.values()){for(const _ of g.parts)_.count=g.n,_.visible=g.n>0,_.instanceMatrix.needsUpdate=!0;g.n=0}this.vm.enemyGlb=o,this.bugMesh.instanceMatrix.needsUpdate=!0,this.bugMesh.instanceColor&&(this.bugMesh.instanceColor.needsUpdate=!0);const c=new Set;for(const g of t.towers){if(!g.alive)continue;c.add(g);const _=this.towerModel(g);if(_.root.visible=g!==i,_.root.position.set(g.x*le,Ft(t.map,g.x,g.y),g.y*le),_.head.rotation.y=-g.aim,_.veh==="heli"){_.root.position.y+=6+Math.sin(performance.now()/640+g.uid)*.3;const x=(p=_.model)==null?void 0:p.userData;x&&(x.rotor.rotation.y+=e*24,x.tail.rotation.z+=e*40)}else _.veh||_.root.scale.setScalar((_.base??1)*(g.t.visual.scale??1))}for(const[g,_]of this.towerModels)c.has(g)||(this.scene.remove(_.root),this.towerModels.delete(g));let l=0;const h={};for(const g of t.units){if(!g.alive||g.garrison||g===i||l>=300||!this.isBug&&(g.x-i.x)**2+(g.y-i.y)**2<26*26)continue;const _=g.squad.data.id,x=No(_,t.unitTier(_));if(g.squad.data.vehicle){this.vehicleUnit(g,e);const w=(m=this.unitVeh.get(g))==null?void 0:m.glb;w&&((h[_]??(h[_]=[])).includes(w)||h[_].push(w));continue}if(n.position.set(g.x*le,Ft(t.map,g.x,g.y),g.y*le),n.rotation.set(0,g.facing>0?0:Math.PI,0),n.scale.setScalar(1),n.updateMatrix(),x){const w=this.troopSets.get(x);if(!w)this.requestUnitGlb(x,!1);else if(w.n<w.cap){for(const A of w.parts)A.setMatrixAt(w.n,n.matrix);w.n++,(h[_]??(h[_]=[])).includes(x)||h[_].push(x);continue}}this.unitMesh.setMatrixAt(l,n.matrix);const E=t.net!=="solo"&&t.mode==="coop"?qd[g.squad.owner]??"#fff":Er(g.squad.data.faction).color;this.unitMesh.setColorAt(l++,this.tmpC.set(E))}for(const[g,_]of this.unitVeh)(!g.alive||g.garrison||g===i)&&(g.alive?_.g.visible=!1:(this.scene.remove(_.g),this.unitVeh.delete(g)));this.unitMesh.count=l,this.unitMesh.instanceMatrix.needsUpdate=!0,this.unitMesh.instanceColor&&(this.unitMesh.instanceColor.needsUpdate=!0);for(const g of this.troopSets.values()){for(const _ of g.parts)_.count=g.n,_.visible=g.n>0,_.instanceMatrix.needsUpdate=!0;g.n=0}this.vm.unitGlb=h;let u=0,d=0;for(const g of t.projectiles){const _=g.o.kind;!g.alive||!_.startsWith("acid")||d>=200||(n.position.set(g.x*le,Ft(t.map,g.x,g.y)+1.6+g.height*Qn,g.y*le),_==="acid_spray"?(n.rotation.set(0,-Math.atan2(g.vy,g.vx),Math.PI/2),n.scale.set(.16,.9,.16)):(n.rotation.set(g.spin*.8,0,g.spin*.5),_==="acid_vial"?n.scale.set(.2,.42,.2):n.scale.set(.38,.75,.38)),n.updateMatrix(),this.acidMesh.setMatrixAt(d++,n.matrix))}this.acidMesh.count=d,this.acidMesh.instanceMatrix.needsUpdate=!0;let f=0;for(const g of t.acidPools){if(f>=48)break;const _=Math.min(1,(g.dur-g.t)/.6);n.position.set(g.x*le,Ft(t.map,g.x,g.y)+.06,g.y*le),n.rotation.set(0,0,0),n.scale.set(g.r*le*_,1,g.r*le*_),n.updateMatrix(),this.poolMesh.setMatrixAt(f++,n.matrix)}this.poolMesh.count=f,this.poolMesh.instanceMatrix.needsUpdate=!0;for(const g of t.projectiles){if(!g.alive||u>=500||g.o.kind.startsWith("acid"))continue;const _=g.o.kind,x=Math.atan2(g.vy,g.vx),E=g.o.scale??1,w=Ft(t.map,g.x,g.y)+1.5+g.height*Qn;n.position.set(g.x*le,w,g.y*le),n.rotation.set(0,-x,0);const A=_==="shell"||_==="melon"?2.4*E:_==="boomerang"||_==="star"?1.8*E:_==="dart"||_==="arrow"?1.6*E:_==="bullet"?1.1*E:1.35*E,S=_==="shell"?1.6:_==="pea"||_==="gpea"||_==="seed"?1.5:1;n.scale.set(A,S,S),n.updateMatrix(),this.shotMesh.setMatrixAt(u,n.matrix),this.shotMesh.setColorAt(u++,this.tmpC.setHex(Iu[_]??16769162))}this.shotMesh.count=u,this.shotMesh.instanceMatrix.needsUpdate=!0,this.shotMesh.instanceColor&&(this.shotMesh.instanceColor.needsUpdate=!0),this.syncBeams(e);let b=0;for(const g of this.bits)g.life<=0||(g.life-=e,g.vy-=14*e,g.x+=g.vx*e,g.y=Math.max(g.floor,g.y+g.vy*e),g.z+=g.vz*e,n.position.set(g.x,g.y,g.z),n.rotation.set(g.life*9,g.life*7,0),n.scale.setScalar(Math.max(.1,g.life*2)),n.updateMatrix(),this.bitMesh.setMatrixAt(b,n.matrix),this.bitMesh.setColorAt(b++,g.c));this.bits.length>400&&(this.bits=this.bits.filter(g=>g.life>0)),this.bitMesh.count=b,this.bitMesh.instanceMatrix.needsUpdate=!0,this.bitMesh.instanceColor&&(this.bitMesh.instanceColor.needsUpdate=!0);for(const g of this.tracers)g.life>0&&(g.life-=e,g.life<=0&&(g.line.visible=!1));const v=this.rangePx()*le;this.ring.visible=v<60,this.ring.position.set(i.x*le,Ft(t.map,i.x,i.y)+.06,i.y*le),this.ring.scale.set(v,1,v)}vehicleUnit(e,t){let n=this.unitVeh.get(e);const i=e.squad.data.id,r=No(i,this.g.unitTier(i));if(!n){const c=new Ae;n={g:c,ang:e.facing>0?0:Math.PI,x:e.x,y:e.y},this.unitVeh.set(e,n),this.scene.add(c)}if(r&&n.glb!==r){const c=this.vehTpl.get(r);c?(n.g.clear(),n.g.add(c.clone(!0)),n.glb=r,n.g.userData.textured=!0,this.vm.vehicles++):this.requestUnitGlb(r,!0)}if(!n.glb&&!n.g.userData.ph){const c=n.g,l=n;if(c.userData.ph=!0,i==="scorpion")hu(Math.min(2,this.g.unitTier(i))).then(h=>{l.glb||!this.alive||(h.traverse(u=>{u.castShadow=!0}),c.add(h),this.vm.vehicles++)});else{const h=(()=>{const f=bi("metal").clone();return f.color.setHex(6978130),f})(),u=(()=>{const f=bi("iron").clone();return f.color.setHex(2237983),f})(),d=(()=>{const f=bi("rust").clone();return f.color.setHex(6965808),f})();c.add(et(new j(new Se(4.4,.9,2),h),0,1,0),et(new j(new Se(1.4,.5,1.9),h),1.5,1.6,0)),c.add(et(new j(new Se(4.2,.12,2.1),d),0,.55,0));for(const[f,b]of[[1.4,1],[1.4,-1],[-1.4,1],[-1.4,-1]])c.add(et(new j(new Fe(.48,.48,.4,12).rotateX(Math.PI/2),u),f,.48,b));c.add(et(new j(new Se(.1,1,1.9),u),.2,2,0),et(new j(new Fe(.05,.05,1.3,6).rotateZ(Math.PI/2),u),-.6,2.2,0)),c.add(et(new j(new Ts(.55,.05,6,14),u),-2,1.3,0)),c.traverse(f=>{f.castShadow=!0})}}const a=e.x-n.x,o=e.y-n.y;if(a*a+o*o>.2){const c=Math.atan2(o,a);n.ang+=Math.atan2(Math.sin(c-n.ang),Math.cos(c-n.ang))*Math.min(1,t*5)}n.x=e.x,n.y=e.y,n.g.visible=!0,n.g.position.set(e.x*le,Ft(this.g.map,e.x,e.y),e.y*le),n.g.rotation.y=-n.ang}syncParked(){const e=this.g,t=new Set;let n=0;for(const i of e.parked){t.add(i.id);let r=this.parkedObjs.get(i.id);r||(r={g:new Ae},r.g.userData.parked=i.kind,this.parkedObjs.set(i.id,r),this.scene.add(r.g));const a=No(i.kind,e.unitTier(i.kind));if(a&&r.glb!==a){const o=this.vehTpl.get(a);if(o){r.g.clear();const c=o.clone(!0);c.traverse(l=>{l.castShadow=!0}),r.g.add(c),r.glb=a}else this.requestUnitGlb(a,!0)}r.glb&&n++,r.g.position.set(i.x*le,Ft(e.map,i.x,i.y),i.y*le),r.g.rotation.y=-i.ang}for(const[i,r]of this.parkedObjs)t.has(i)||(this.scene.remove(r.g),this.parkedObjs.delete(i));this.vm.parked=e.parked.length,this.vm.parkedGlb=n}burst(e,t,n,i,r){for(let a=0;a<r&&!(this.bits.length>480);a++){const o=Math.random()*6.283,c=2+Math.random()*4;this.bits.push({floor:Ft(this.g.map,e/le,n/le)+.05,x:e,y:t,z:n,vx:Math.cos(o)*c,vy:2+Math.random()*4,vz:Math.sin(o)*c,life:.5+Math.random()*.3,c:new ue(i)})}}hud(e){const t=this.g,n=this.obj,i=t.waves;this.el.wave.textContent=i.freeplay?`${i.index} (free)`:`${i.index}/${i.total}`,this.el.hq.textContent=String(Math.ceil(t.hq.health.hp)),this.el.hqb.style.width=`${Math.max(0,t.hq.health.frac)*100}%`,this.el.cash.textContent=String(Math.floor(t.res.credits)),this.el.hits.textContent=String(this.hits),this.el.hp.style.width=`${Math.max(0,n instanceof an?n.hp/Math.max(1,n.maxHp):n.health.frac)*100}%`;const r=n instanceof an?1-Math.max(0,n.ov.biteCd)/Ar(n.data.id).every:n instanceof rn?n.combat?1-Math.max(0,n.combat.cooldown)/Math.max(.01,n.combat.period):1:(()=>{const a=t.unitTier(n.squad.data.id),o=1/(n.squad.data.tiers[a].stats.attackRate*n.rateMul);return 1-Math.max(0,n.cooldown)/o})();if(this.el.cd.style.width=`${Math.max(0,Math.min(1,r))*100}%`,this.el["pause-ov"].hidden=!t.paused,t.paused&&document.pointerLockElement&&document.exitPointerLock(),n instanceof an&&this.el.abil.querySelectorAll("button").forEach(a=>{const o=Math.max(0,n.ov.abilCd),c=Ar(n.data.id).abilCd;a.disabled=o>0,a.querySelector("i").style.width=`${(1-Math.min(1,o/c))*100}%`}),n instanceof Cn&&this.el.abil.querySelectorAll("button").forEach(a=>{const o=a.dataset.ab,c=n.squad.abilityCd[o]??0,l=Wa[o].cooldown??1;a.disabled=c>0,a.querySelector("i").style.width=`${(1-Math.min(1,c/l))*100}%`}),this.el.msg.hidden=this.locked||this.touch||t.paused,this.el.msg.hidden||(this.el.msg.textContent=this.isBug?"Click to look & bite · E/Tab: tactical map":this.ovr?"Click to aim & fire · E/Tab: tactical map":"Click to aim & fire · Esc/E to exit"),this.el.veh){let a="";if(n instanceof Cn&&!n.isWorker){if(n.data.vehicle&&(n.onFoot||t.net==="client"))a="<b>F</b> exit "+n.data.tiers[t.unitTier(n.data.id)].name;else if(!n.data.vehicle){const o=t.nearParked(n);if(o){const c=Yd(o.kind);a="<b>F</b> enter "+((c==null?void 0:c.tiers[t.unitTier(o.kind)].name)??o.kind)}}}this.el.veh.hidden=!a,a&&this.el.veh.innerHTML!==a&&(this.el.veh.innerHTML=a)}this.miniT-=e,this.miniT<=0&&(this.miniT=.1,this.drawMini())}drawMini(){const e=this.mini.getContext("2d");if(!e)return;const t=this.g,n=this.mini.width/t.map.width;this.miniImg.complete&&this.miniImg.naturalWidth?e.drawImage(this.miniImg,0,0,this.mini.width,this.mini.height):(e.fillStyle="#3d5a2a",e.fillRect(0,0,this.mini.width,this.mini.height)),e.fillStyle="#fff";for(const c of t.towers)c.alive&&e.fillRect(c.x*n-1.5,c.y*n-1.5,3,3);e.fillStyle="#7fd3ff";for(const c of t.units)c.alive&&!c.garrison&&e.fillRect(c.x*n-1,c.y*n-1,2,2);for(const c of t.enemies)c.alive&&(e.fillStyle=c.data.boss?"#c070ff":"#ff4a3a",e.fillRect(c.x*n-1.5,c.y*n-1.5,c.data.boss?5:3,c.data.boss?5:3));const i=this.obj,r=i.x*n,a=i.y*n,o=this.ctl.aim;e.fillStyle="#ffe14a33",e.beginPath(),e.moveTo(r,a),e.arc(r,a,26,o-.6,o+.6),e.closePath(),e.fill(),e.fillStyle="#ffe14a",e.strokeStyle="#000",e.beginPath(),e.arc(r,a,4,0,6.283),e.fill(),e.stroke()}aimAt(e,t,n=1.3){const i=this.eye().clone(),r=e*le-i.x,a=t*le-i.z;this.yaw=Math.atan2(-r,-a),this.pitch=0,this.look(0,-Math.atan2(n-i.y,Math.hypot(r,a))/.0022)}aimNearest(){const e=this.obj,t=this.rangePx()*1.2;if(this.isBug){const i=this.g.units.concat(this.g.towers).filter(r=>r.alive).sort((r,a)=>(r.x-e.x)**2+(r.y-e.y)**2-((a.x-e.x)**2+(a.y-e.y)**2))[0];return i?(this.aimAt(i.x,i.y,Ft(this.g.map,i.x,i.y)+1),!0):!1}const n=this.g.enemies.filter(i=>i.alive&&(i.x-e.x)**2+(i.y-e.y)**2<t*t).sort((i,r)=>(i.x-e.x)**2+(i.y-e.y)**2-((r.x-e.x)**2+(r.y-e.y)**2))[0];return n?(this.aimAt(n.x,n.y,this.ey(n)),!0):!1}ey(e){return Uu(e)+Ft(this.g.map,e.x,e.y)}setFire(e){this.firing=e}setMove(e,t){this.joy.x=t,this.joy.y=-e}state(){var t;const e=this.obj;return{kind:this.isTower?"tower":this.isBug?"bug":"unit",ovr:this.ovr,abN:this.abN,hp:e instanceof an?e.hp:e.health.hp,id:(e instanceof rn,e.data.id),x:e.x,y:e.y,hits:this.hits,shots:this.shots,fps:Math.round(this.fps),locked:this.locked,target:!!this.ctl.target,manual:!!e.manual,possessedBy:e.possessedBy,touch:this.touch,adsActive:this.ads,adsK:+this.adsK.toFixed(2),fov:+this.camera.fov.toFixed(1),canScope:this.canScope,veh:e instanceof Cn?!!e.data.vehicle:!1,unitId:e instanceof Cn?e.data.id:"",nearParked:e instanceof Cn?((t=this.g.nearParked(e))==null?void 0:t.kind)??"":"",boardM:Kd,fort:!!this.fort}}exit(e){var t,n,i,r;this.alive&&(this.ads=!1,this.alive=!1,Sl(null),cancelAnimationFrame(this.raf),removeEventListener("resize",this.resize),removeEventListener("keydown",this.onKey,!0),removeEventListener("keyup",this.onKeyUp,!0),removeEventListener("mousemove",this.onMouse),removeEventListener("mouseup",this.onUp),document.removeEventListener("pointerlockchange",this.onLock),document.pointerLockElement&&document.exitPointerLock(),this.obj.alive&&this.g.possessCtl(this.obj,null),this.scene.traverse(a=>{var l,h,u;const o=a;(h=(l=o.geometry)==null?void 0:l.dispose)==null||h.call(l);const c=o.material;Array.isArray(c)?c.forEach(d=>d.dispose()):(u=c==null?void 0:c.dispose)==null||u.call(c)}),(t=this.composer)==null||t.dispose(),(n=this.envRT)==null||n.dispose(),this.renderer.dispose(),(r=(i=this.renderer).forceContextLoss)==null||r.call(i),this.root.remove(),document.body.classList.remove("possess-on","ps-touch-on"),ln===this&&(ln=null),Bi("possess: exit"+(e?" ("+e+")":"")),e&&this.g.toast(e,"#ffd84a"),this.host.onExit())}}let ln=null;function L1(s,e,t={}){var n;ln==null||ln.exit();try{ln=new C1(s,e,t)}catch(i){console.error("possess failed",i),(n=document.getElementById("possess-root"))==null||n.remove(),document.body.classList.remove("possess-on","ps-touch-on"),s.g.possessCtl(e,null),s.g.toast("3D view unavailable on this device","#ff8a6a"),ln=null}return window.__possess={get cur(){return ln},exit:()=>ln==null?void 0:ln.exit()},ln}function I1(){return ln}export{C1 as Possess,le as S,I1 as current,L1 as possess};
