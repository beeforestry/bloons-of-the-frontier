import{a as Jt,T as xn,l as La,s as Ht,h as Ld,f as _r,U as Ia,M as Id,A as Da,P as Dd,g as Ud}from"./index-Cj30GwRP.js";/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const wc="170",Nd=0,ll=1,Fd=2,_u=1,xu=2,Wn=3,Qn=0,qt=1,Ct=2,Yn=0,is=1,os=2,hl=3,ul=4,Od=5,Ti=100,kd=101,Bd=102,zd=103,Gd=104,Hd=200,Vd=201,Wd=202,jd=203,Ao=204,Ro=205,Xd=206,qd=207,Yd=208,Kd=209,Jd=210,Zd=211,Qd=212,$d=213,ef=214,Co=0,Po=1,Lo=2,cs=3,Io=4,Do=5,Uo=6,No=7,ba=0,tf=1,nf=2,fi=0,vu=1,yu=2,Mu=3,Ec=4,sf=5,Su=6,wu=7,dl="attached",rf="detached",Eu=300,ls=301,hs=302,Fo=303,Oo=304,_a=306,Pn=1e3,Cn=1001,ua=1002,Yt=1003,Tu=1004,Ws=1005,Nt=1006,na=1007,wn=1008,$n=1009,Au=1010,Ru=1011,nr=1012,Tc=1013,Pi=1014,Zt=1015,Qt=1016,Ac=1017,Rc=1018,us=1020,Cu=35902,Pu=1021,Lu=1022,pn=1023,Iu=1024,Du=1025,ss=1026,ds=1027,Cc=1028,Pc=1029,Uu=1030,Lc=1031,Ic=1033,ia=33776,sa=33777,ra=33778,aa=33779,ko=35840,Bo=35841,zo=35842,Go=35843,Ho=36196,Vo=37492,Wo=37496,jo=37808,Xo=37809,qo=37810,Yo=37811,Ko=37812,Jo=37813,Zo=37814,Qo=37815,$o=37816,ec=37817,tc=37818,nc=37819,ic=37820,sc=37821,oa=36492,rc=36494,ac=36495,Nu=36283,oc=36284,cc=36285,lc=36286,ir=2300,sr=2301,Ua=2302,fl=2400,pl=2401,ml=2402,af=2500,of=0,Fu=1,hc=2,cf=3200,lf=3201,xa=0,hf=1,hi="",gt="srgb",Gt="srgb-linear",va="linear",ht="srgb",Ui=7680,gl=519,uf=512,df=513,ff=514,Ou=515,pf=516,mf=517,gf=518,bf=519,uc=35044,bl="300 es",qn=2e3,da=2001;class Ms{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const kt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let _l=1234567;const qs=Math.PI/180,fs=180/Math.PI;function mn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(kt[s&255]+kt[s>>8&255]+kt[s>>16&255]+kt[s>>24&255]+"-"+kt[e&255]+kt[e>>8&255]+"-"+kt[e>>16&15|64]+kt[e>>24&255]+"-"+kt[t&63|128]+kt[t>>8&255]+"-"+kt[t>>16&255]+kt[t>>24&255]+kt[n&255]+kt[n>>8&255]+kt[n>>16&255]+kt[n>>24&255]).toLowerCase()}function Rt(s,e,t){return Math.max(e,Math.min(t,s))}function Dc(s,e){return(s%e+e)%e}function _f(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function xf(s,e,t){return s!==e?(t-s)/(e-s):0}function Ys(s,e,t){return(1-t)*s+t*e}function vf(s,e,t,n){return Ys(s,e,1-Math.exp(-t*n))}function yf(s,e=1){return e-Math.abs(Dc(s,e*2)-e)}function Mf(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Sf(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function wf(s,e){return s+Math.floor(Math.random()*(e-s+1))}function Ef(s,e){return s+Math.random()*(e-s)}function Tf(s){return s*(.5-Math.random())}function Af(s){s!==void 0&&(_l=s);let e=_l+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Rf(s){return s*qs}function Cf(s){return s*fs}function Pf(s){return(s&s-1)===0&&s!==0}function Lf(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function If(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Df(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),b=a((n-e)/2);switch(i){case"XYX":s.set(o*h,c*u,c*d,o*l);break;case"YZY":s.set(c*d,o*h,c*u,o*l);break;case"ZXZ":s.set(c*u,c*d,o*h,o*l);break;case"XZX":s.set(o*h,c*b,c*f,o*l);break;case"YXY":s.set(c*f,o*h,c*b,o*l);break;case"ZYZ":s.set(c*b,c*f,o*h,o*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Sn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function ut(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Uf={DEG2RAD:qs,RAD2DEG:fs,generateUUID:mn,clamp:Rt,euclideanModulo:Dc,mapLinear:_f,inverseLerp:xf,lerp:Ys,damp:vf,pingpong:yf,smoothstep:Mf,smootherstep:Sf,randInt:wf,randFloat:Ef,randFloatSpread:Tf,seededRandom:Af,degToRad:Rf,radToDeg:Cf,isPowerOfTwo:Pf,ceilPowerOfTwo:Lf,floorPowerOfTwo:If,setQuaternionFromProperEuler:Df,normalize:ut,denormalize:Sn};class J{constructor(e=0,t=0){J.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Rt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Xe{constructor(e,t,n,i,r,a,o,c,l){Xe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,c,l)}set(e,t,n,i,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],b=n[8],g=i[0],p=i[3],m=i[6],x=i[1],v=i[4],_=i[7],R=i[2],S=i[5],A=i[8];return r[0]=a*g+o*x+c*R,r[3]=a*p+o*v+c*S,r[6]=a*m+o*_+c*A,r[1]=l*g+h*x+u*R,r[4]=l*p+h*v+u*S,r[7]=l*m+h*_+u*A,r[2]=d*g+f*x+b*R,r[5]=d*p+f*v+b*S,r[8]=d*m+f*_+b*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+i*r*l-i*a*c}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=h*a-o*l,d=o*c-h*r,f=l*r-a*c,b=t*u+n*d+i*f;if(b===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/b;return e[0]=u*g,e[1]=(i*l-h*n)*g,e[2]=(o*n-i*a)*g,e[3]=d*g,e[4]=(h*t-i*c)*g,e[5]=(i*r-o*t)*g,e[6]=f*g,e[7]=(n*c-l*t)*g,e[8]=(a*t-n*r)*g,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-i*l,i*c,-i*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Na.makeScale(e,t)),this}rotate(e){return this.premultiply(Na.makeRotation(-e)),this}translate(e,t){return this.premultiply(Na.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Na=new Xe;function ku(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function rr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Nf(){const s=rr("canvas");return s.style.display="block",s}const xl={};function js(s){s in xl||(xl[s]=!0,console.warn(s))}function Ff(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Of(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function kf(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const $e={enabled:!0,workingColorSpace:Gt,spaces:{},convert:function(s,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===ht&&(s.r=Kn(s.r),s.g=Kn(s.g),s.b=Kn(s.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(s.applyMatrix3(this.spaces[e].toXYZ),s.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===ht&&(s.r=rs(s.r),s.g=rs(s.g),s.b=rs(s.b))),s},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===hi?va:this.spaces[s].transfer},getLuminanceCoefficients:function(s,e=this.workingColorSpace){return s.fromArray(this.spaces[e].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,e,t){return s.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function Kn(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function rs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const vl=[.64,.33,.3,.6,.15,.06],yl=[.2126,.7152,.0722],Ml=[.3127,.329],Sl=new Xe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),wl=new Xe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);$e.define({[Gt]:{primaries:vl,whitePoint:Ml,transfer:va,toXYZ:Sl,fromXYZ:wl,luminanceCoefficients:yl,workingColorSpaceConfig:{unpackColorSpace:gt},outputColorSpaceConfig:{drawingBufferColorSpace:gt}},[gt]:{primaries:vl,whitePoint:Ml,transfer:ht,toXYZ:Sl,fromXYZ:wl,luminanceCoefficients:yl,outputColorSpaceConfig:{drawingBufferColorSpace:gt}}});let Ni;class Bf{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ni===void 0&&(Ni=rr("canvas")),Ni.width=e.width,Ni.height=e.height;const n=Ni.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Ni}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=rr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=Kn(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Kn(t[n]/255)*255):t[n]=Kn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let zf=0;class Bu{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:zf++}),this.uuid=mn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Fa(i[a].image)):r.push(Fa(i[a]))}else r=Fa(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Fa(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Bf.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Gf=0;class Pt extends Ms{constructor(e=Pt.DEFAULT_IMAGE,t=Pt.DEFAULT_MAPPING,n=Cn,i=Cn,r=Nt,a=wn,o=pn,c=$n,l=Pt.DEFAULT_ANISOTROPY,h=hi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Gf++}),this.uuid=mn(),this.name="",this.source=new Bu(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new J(0,0),this.repeat=new J(1,1),this.center=new J(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Eu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Pn:e.x=e.x-Math.floor(e.x);break;case Cn:e.x=e.x<0?0:1;break;case ua:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Pn:e.y=e.y-Math.floor(e.y);break;case Cn:e.y=e.y<0?0:1;break;case ua:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Pt.DEFAULT_IMAGE=null;Pt.DEFAULT_MAPPING=Eu;Pt.DEFAULT_ANISOTROPY=1;class rt{constructor(e=0,t=0,n=0,i=1){rt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const c=e.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],b=c[9],g=c[2],p=c[6],m=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-g)<.01&&Math.abs(b-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+g)<.1&&Math.abs(b+p)<.1&&Math.abs(l+f+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(l+1)/2,_=(f+1)/2,R=(m+1)/2,S=(h+d)/4,A=(u+g)/4,E=(b+p)/4;return v>_&&v>R?v<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(v),i=S/n,r=A/n):_>R?_<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(_),n=S/i,r=E/i):R<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(R),n=A/r,i=E/r),this.set(n,i,r,t),this}let x=Math.sqrt((p-b)*(p-b)+(u-g)*(u-g)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(p-b)/x,this.y=(u-g)/x,this.z=(d-h)/x,this.w=Math.acos((l+f+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Hf extends Ms{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new rt(0,0,e,t),this.scissorTest=!1,this.viewport=new rt(0,0,e,t);const i={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Nt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Pt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Bu(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class gn extends Hf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class zu extends Pt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Yt,this.minFilter=Yt,this.wrapR=Cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Vf extends Pt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Yt,this.minFilter=Yt,this.wrapR=Cn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ln{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3];const d=r[a+0],f=r[a+1],b=r[a+2],g=r[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=d,e[t+1]=f,e[t+2]=b,e[t+3]=g;return}if(u!==g||c!==d||l!==f||h!==b){let p=1-o;const m=c*d+l*f+h*b+u*g,x=m>=0?1:-1,v=1-m*m;if(v>Number.EPSILON){const R=Math.sqrt(v),S=Math.atan2(R,m*x);p=Math.sin(p*S)/R,o=Math.sin(o*S)/R}const _=o*x;if(c=c*p+d*_,l=l*p+f*_,h=h*p+b*_,u=u*p+g*_,p===1-o){const R=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=R,l*=R,h*=R,u*=R}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[a],d=r[a+1],f=r[a+2],b=r[a+3];return e[t]=o*b+h*u+c*f-l*d,e[t+1]=c*b+h*d+l*u-o*f,e[t+2]=l*b+h*f+o*d-c*u,e[t+3]=h*b-o*u-c*d-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(i/2),u=o(r/2),d=c(n/2),f=c(i/2),b=c(r/2);switch(a){case"XYZ":this._x=d*h*u+l*f*b,this._y=l*f*u-d*h*b,this._z=l*h*b+d*f*u,this._w=l*h*u-d*f*b;break;case"YXZ":this._x=d*h*u+l*f*b,this._y=l*f*u-d*h*b,this._z=l*h*b-d*f*u,this._w=l*h*u+d*f*b;break;case"ZXY":this._x=d*h*u-l*f*b,this._y=l*f*u+d*h*b,this._z=l*h*b+d*f*u,this._w=l*h*u-d*f*b;break;case"ZYX":this._x=d*h*u-l*f*b,this._y=l*f*u+d*h*b,this._z=l*h*b-d*f*u,this._w=l*h*u+d*f*b;break;case"YZX":this._x=d*h*u+l*f*b,this._y=l*f*u+d*h*b,this._z=l*h*b-d*f*u,this._w=l*h*u-d*f*b;break;case"XZY":this._x=d*h*u-l*f*b,this._y=l*f*u-d*h*b,this._z=l*h*b+d*f*u,this._w=l*h*u+d*f*b;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-c)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+l)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-l)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Rt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+i*l-r*c,this._y=i*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-i*o,this._w=a*h-n*o-i*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*e._w+n*e._x+i*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const c=1-o*o;if(c<=Number.EPSILON){const f=1-t;return this._w=f*a+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,o),u=Math.sin((1-t)*h)/l,d=Math.sin(t*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(e=0,t=0,n=0){C.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(El.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(El.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*i-o*n),h=2*(o*t-r*i),u=2*(r*n-a*t);return this.x=t+c*l+a*u-o*h,this.y=n+c*h+o*l-r*u,this.z=i+c*u+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=i*c-r*o,this.y=r*a-n*c,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Oa.copy(this).projectOnVector(e),this.sub(Oa)}reflect(e){return this.sub(Oa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Rt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Oa=new C,El=new Ln;class vt{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(vn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(vn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=vn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,vn):vn.fromBufferAttribute(r,a),vn.applyMatrix4(e.matrixWorld),this.expandByPoint(vn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),xr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xr.copy(n.boundingBox)),xr.applyMatrix4(e.matrixWorld),this.union(xr)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,vn),vn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Cs),vr.subVectors(this.max,Cs),Fi.subVectors(e.a,Cs),Oi.subVectors(e.b,Cs),ki.subVectors(e.c,Cs),ni.subVectors(Oi,Fi),ii.subVectors(ki,Oi),mi.subVectors(Fi,ki);let t=[0,-ni.z,ni.y,0,-ii.z,ii.y,0,-mi.z,mi.y,ni.z,0,-ni.x,ii.z,0,-ii.x,mi.z,0,-mi.x,-ni.y,ni.x,0,-ii.y,ii.x,0,-mi.y,mi.x,0];return!ka(t,Fi,Oi,ki,vr)||(t=[1,0,0,0,1,0,0,0,1],!ka(t,Fi,Oi,ki,vr))?!1:(yr.crossVectors(ni,ii),t=[yr.x,yr.y,yr.z],ka(t,Fi,Oi,ki,vr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,vn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(vn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(kn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),kn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),kn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),kn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),kn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),kn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),kn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),kn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(kn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const kn=[new C,new C,new C,new C,new C,new C,new C,new C],vn=new C,xr=new vt,Fi=new C,Oi=new C,ki=new C,ni=new C,ii=new C,mi=new C,Cs=new C,vr=new C,yr=new C,gi=new C;function ka(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){gi.fromArray(s,r);const o=i.x*Math.abs(gi.x)+i.y*Math.abs(gi.y)+i.z*Math.abs(gi.z),c=e.dot(gi),l=t.dot(gi),h=n.dot(gi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const Wf=new vt,Ps=new C,Ba=new C;class In{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Wf.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ps.subVectors(e,this.center);const t=Ps.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Ps,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ba.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ps.copy(e.center).add(Ba)),this.expandByPoint(Ps.copy(e.center).sub(Ba))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Bn=new C,za=new C,Mr=new C,si=new C,Ga=new C,Sr=new C,Ha=new C;class fr{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Bn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Bn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Bn.copy(this.origin).addScaledVector(this.direction,t),Bn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){za.copy(e).add(t).multiplyScalar(.5),Mr.copy(t).sub(e).normalize(),si.copy(this.origin).sub(za);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Mr),o=si.dot(this.direction),c=-si.dot(Mr),l=si.lengthSq(),h=Math.abs(1-a*a);let u,d,f,b;if(h>0)if(u=a*c-o,d=a*o-c,b=r*h,u>=0)if(d>=-b)if(d<=b){const g=1/h;u*=g,d*=g,f=u*(u+a*d+2*o)+d*(a*u+d+2*c)+l}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;else d<=-b?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=b?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(za).addScaledVector(Mr,d),f}intersectSphere(e,t){Bn.subVectors(e.center,this.origin);const n=Bn.dot(this.direction),i=Bn.dot(Bn)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(e.min.x-d.x)*l,i=(e.max.x-d.x)*l):(n=(e.max.x-d.x)*l,i=(e.min.x-d.x)*l),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-d.z)*u,c=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,c=(e.min.z-d.z)*u),n>c||o>i)||((o>n||n!==n)&&(n=o),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Bn)!==null}intersectTriangle(e,t,n,i,r){Ga.subVectors(t,e),Sr.subVectors(n,e),Ha.crossVectors(Ga,Sr);let a=this.direction.dot(Ha),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;si.subVectors(this.origin,e);const c=o*this.direction.dot(Sr.crossVectors(si,Sr));if(c<0)return null;const l=o*this.direction.dot(Ga.cross(si));if(l<0||c+l>a)return null;const h=-o*si.dot(Ha);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ze{constructor(e,t,n,i,r,a,o,c,l,h,u,d,f,b,g,p){ze.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,c,l,h,u,d,f,b,g,p)}set(e,t,n,i,r,a,o,c,l,h,u,d,f,b,g,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=b,m[11]=g,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ze().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/Bi.setFromMatrixColumn(e,0).length(),r=1/Bi.setFromMatrixColumn(e,1).length(),a=1/Bi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,b=o*h,g=o*u;t[0]=c*h,t[4]=-c*u,t[8]=l,t[1]=f+b*l,t[5]=d-g*l,t[9]=-o*c,t[2]=g-d*l,t[6]=b+f*l,t[10]=a*c}else if(e.order==="YXZ"){const d=c*h,f=c*u,b=l*h,g=l*u;t[0]=d+g*o,t[4]=b*o-f,t[8]=a*l,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-b,t[6]=g+d*o,t[10]=a*c}else if(e.order==="ZXY"){const d=c*h,f=c*u,b=l*h,g=l*u;t[0]=d-g*o,t[4]=-a*u,t[8]=b+f*o,t[1]=f+b*o,t[5]=a*h,t[9]=g-d*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const d=a*h,f=a*u,b=o*h,g=o*u;t[0]=c*h,t[4]=b*l-f,t[8]=d*l+g,t[1]=c*u,t[5]=g*l+d,t[9]=f*l-b,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const d=a*c,f=a*l,b=o*c,g=o*l;t[0]=c*h,t[4]=g-d*u,t[8]=b*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=f*u+b,t[10]=d-g*u}else if(e.order==="XZY"){const d=a*c,f=a*l,b=o*c,g=o*l;t[0]=c*h,t[4]=-u,t[8]=l*h,t[1]=d*u+g,t[5]=a*h,t[9]=f*u-b,t[2]=b*u-f,t[6]=o*h,t[10]=g*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(jf,e,Xf)}lookAt(e,t,n){const i=this.elements;return tn.subVectors(e,t),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),ri.crossVectors(n,tn),ri.lengthSq()===0&&(Math.abs(n.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),ri.crossVectors(n,tn)),ri.normalize(),wr.crossVectors(tn,ri),i[0]=ri.x,i[4]=wr.x,i[8]=tn.x,i[1]=ri.y,i[5]=wr.y,i[9]=tn.y,i[2]=ri.z,i[6]=wr.z,i[10]=tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],b=n[2],g=n[6],p=n[10],m=n[14],x=n[3],v=n[7],_=n[11],R=n[15],S=i[0],A=i[4],E=i[8],M=i[12],y=i[1],L=i[5],D=i[9],U=i[13],F=i[2],W=i[6],B=i[10],$=i[14],V=i[3],se=i[7],oe=i[11],pe=i[15];return r[0]=a*S+o*y+c*F+l*V,r[4]=a*A+o*L+c*W+l*se,r[8]=a*E+o*D+c*B+l*oe,r[12]=a*M+o*U+c*$+l*pe,r[1]=h*S+u*y+d*F+f*V,r[5]=h*A+u*L+d*W+f*se,r[9]=h*E+u*D+d*B+f*oe,r[13]=h*M+u*U+d*$+f*pe,r[2]=b*S+g*y+p*F+m*V,r[6]=b*A+g*L+p*W+m*se,r[10]=b*E+g*D+p*B+m*oe,r[14]=b*M+g*U+p*$+m*pe,r[3]=x*S+v*y+_*F+R*V,r[7]=x*A+v*L+_*W+R*se,r[11]=x*E+v*D+_*B+R*oe,r[15]=x*M+v*U+_*$+R*pe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],u=e[6],d=e[10],f=e[14],b=e[3],g=e[7],p=e[11],m=e[15];return b*(+r*c*u-i*l*u-r*o*d+n*l*d+i*o*f-n*c*f)+g*(+t*c*f-t*l*d+r*a*d-i*a*f+i*l*h-r*c*h)+p*(+t*l*u-t*o*f-r*a*u+n*a*f+r*o*h-n*l*h)+m*(-i*o*h-t*c*u+t*o*d+i*a*u-n*a*d+n*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],u=e[9],d=e[10],f=e[11],b=e[12],g=e[13],p=e[14],m=e[15],x=u*p*l-g*d*l+g*c*f-o*p*f-u*c*m+o*d*m,v=b*d*l-h*p*l-b*c*f+a*p*f+h*c*m-a*d*m,_=h*g*l-b*u*l+b*o*f-a*g*f-h*o*m+a*u*m,R=b*u*c-h*g*c-b*o*d+a*g*d+h*o*p-a*u*p,S=t*x+n*v+i*_+r*R;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/S;return e[0]=x*A,e[1]=(g*d*r-u*p*r-g*i*f+n*p*f+u*i*m-n*d*m)*A,e[2]=(o*p*r-g*c*r+g*i*l-n*p*l-o*i*m+n*c*m)*A,e[3]=(u*c*r-o*d*r-u*i*l+n*d*l+o*i*f-n*c*f)*A,e[4]=v*A,e[5]=(h*p*r-b*d*r+b*i*f-t*p*f-h*i*m+t*d*m)*A,e[6]=(b*c*r-a*p*r-b*i*l+t*p*l+a*i*m-t*c*m)*A,e[7]=(a*d*r-h*c*r+h*i*l-t*d*l-a*i*f+t*c*f)*A,e[8]=_*A,e[9]=(b*u*r-h*g*r-b*n*f+t*g*f+h*n*m-t*u*m)*A,e[10]=(a*g*r-b*o*r+b*n*l-t*g*l-a*n*m+t*o*m)*A,e[11]=(h*o*r-a*u*r-h*n*l+t*u*l+a*n*f-t*o*f)*A,e[12]=R*A,e[13]=(h*g*i-b*u*i+b*n*d-t*g*d-h*n*p+t*u*p)*A,e[14]=(b*o*i-a*g*i-b*n*c+t*g*c+a*n*p-t*o*p)*A,e[15]=(a*u*i-h*o*i+h*n*c-t*u*c-a*n*d+t*o*d)*A,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-i*c,l*c+i*o,0,l*o+i*c,h*o+n,h*c-i*a,0,l*c-i*o,h*c+i*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,u=o+o,d=r*l,f=r*h,b=r*u,g=a*h,p=a*u,m=o*u,x=c*l,v=c*h,_=c*u,R=n.x,S=n.y,A=n.z;return i[0]=(1-(g+m))*R,i[1]=(f+_)*R,i[2]=(b-v)*R,i[3]=0,i[4]=(f-_)*S,i[5]=(1-(d+m))*S,i[6]=(p+x)*S,i[7]=0,i[8]=(b+v)*A,i[9]=(p-x)*A,i[10]=(1-(d+g))*A,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let r=Bi.set(i[0],i[1],i[2]).length();const a=Bi.set(i[4],i[5],i[6]).length(),o=Bi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],yn.copy(this);const l=1/r,h=1/a,u=1/o;return yn.elements[0]*=l,yn.elements[1]*=l,yn.elements[2]*=l,yn.elements[4]*=h,yn.elements[5]*=h,yn.elements[6]*=h,yn.elements[8]*=u,yn.elements[9]*=u,yn.elements[10]*=u,t.setFromRotationMatrix(yn),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,r,a,o=qn){const c=this.elements,l=2*r/(t-e),h=2*r/(n-i),u=(t+e)/(t-e),d=(n+i)/(n-i);let f,b;if(o===qn)f=-(a+r)/(a-r),b=-2*a*r/(a-r);else if(o===da)f=-a/(a-r),b=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=f,c[14]=b,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=qn){const c=this.elements,l=1/(t-e),h=1/(n-i),u=1/(a-r),d=(t+e)*l,f=(n+i)*h;let b,g;if(o===qn)b=(a+r)*u,g=-2*u;else if(o===da)b=r*u,g=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-f,c[2]=0,c[6]=0,c[10]=g,c[14]=-b,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const Bi=new C,yn=new ze,jf=new C(0,0,0),Xf=new C(1,1,1),ri=new C,wr=new C,tn=new C,Tl=new ze,Al=new Ln;class on{constructor(e=0,t=0,n=0,i=on.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(Rt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Rt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Rt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Rt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Rt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Rt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Tl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Tl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Al.setFromEuler(this),this.setFromQuaternion(Al,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}on.DEFAULT_ORDER="XYZ";class Uc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let qf=0;const Rl=new C,zi=new Ln,zn=new ze,Er=new C,Ls=new C,Yf=new C,Kf=new Ln,Cl=new C(1,0,0),Pl=new C(0,1,0),Ll=new C(0,0,1),Il={type:"added"},Jf={type:"removed"},Gi={type:"childadded",child:null},Va={type:"childremoved",child:null};class ft extends Ms{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qf++}),this.uuid=mn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ft.DEFAULT_UP.clone();const e=new C,t=new on,n=new Ln,i=new C(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ze},normalMatrix:{value:new Xe}}),this.matrix=new ze,this.matrixWorld=new ze,this.matrixAutoUpdate=ft.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Uc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return zi.setFromAxisAngle(e,t),this.quaternion.multiply(zi),this}rotateOnWorldAxis(e,t){return zi.setFromAxisAngle(e,t),this.quaternion.premultiply(zi),this}rotateX(e){return this.rotateOnAxis(Cl,e)}rotateY(e){return this.rotateOnAxis(Pl,e)}rotateZ(e){return this.rotateOnAxis(Ll,e)}translateOnAxis(e,t){return Rl.copy(e).applyQuaternion(this.quaternion),this.position.add(Rl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Cl,e)}translateY(e){return this.translateOnAxis(Pl,e)}translateZ(e){return this.translateOnAxis(Ll,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(zn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Er.copy(e):Er.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Ls.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?zn.lookAt(Ls,Er,this.up):zn.lookAt(Er,Ls,this.up),this.quaternion.setFromRotationMatrix(zn),i&&(zn.extractRotation(i.matrixWorld),zi.setFromRotationMatrix(zn),this.quaternion.premultiply(zi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Il),Gi.child=e,this.dispatchEvent(Gi),Gi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Jf),Va.child=e,this.dispatchEvent(Va),Va.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),zn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),zn.multiply(e.parent.matrixWorld)),e.applyMatrix4(zn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Il),Gi.child=e,this.dispatchEvent(Gi),Gi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ls,e,Yf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ls,Kf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(e.shapes,u)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];i.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),b=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),b.length>0&&(n.nodes=b)}return n.object=i,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}ft.DEFAULT_UP=new C(0,1,0);ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Mn=new C,Gn=new C,Wa=new C,Hn=new C,Hi=new C,Vi=new C,Dl=new C,ja=new C,Xa=new C,qa=new C,Ya=new rt,Ka=new rt,Ja=new rt;class fn{constructor(e=new C,t=new C,n=new C){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Mn.subVectors(e,t),i.cross(Mn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Mn.subVectors(i,t),Gn.subVectors(n,t),Wa.subVectors(e,t);const a=Mn.dot(Mn),o=Mn.dot(Gn),c=Mn.dot(Wa),l=Gn.dot(Gn),h=Gn.dot(Wa),u=a*l-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-o*h)*d,b=(a*h-o*c)*d;return r.set(1-f-b,b,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Hn)===null?!1:Hn.x>=0&&Hn.y>=0&&Hn.x+Hn.y<=1}static getInterpolation(e,t,n,i,r,a,o,c){return this.getBarycoord(e,t,n,i,Hn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Hn.x),c.addScaledVector(a,Hn.y),c.addScaledVector(o,Hn.z),c)}static getInterpolatedAttribute(e,t,n,i,r,a){return Ya.setScalar(0),Ka.setScalar(0),Ja.setScalar(0),Ya.fromBufferAttribute(e,t),Ka.fromBufferAttribute(e,n),Ja.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(Ya,r.x),a.addScaledVector(Ka,r.y),a.addScaledVector(Ja,r.z),a}static isFrontFacing(e,t,n,i){return Mn.subVectors(n,t),Gn.subVectors(e,t),Mn.cross(Gn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Mn.subVectors(this.c,this.b),Gn.subVectors(this.a,this.b),Mn.cross(Gn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return fn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return fn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return fn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return fn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return fn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;Hi.subVectors(i,n),Vi.subVectors(r,n),ja.subVectors(e,n);const c=Hi.dot(ja),l=Vi.dot(ja);if(c<=0&&l<=0)return t.copy(n);Xa.subVectors(e,i);const h=Hi.dot(Xa),u=Vi.dot(Xa);if(h>=0&&u<=h)return t.copy(i);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(Hi,a);qa.subVectors(e,r);const f=Hi.dot(qa),b=Vi.dot(qa);if(b>=0&&f<=b)return t.copy(r);const g=f*l-c*b;if(g<=0&&l>=0&&b<=0)return o=l/(l-b),t.copy(n).addScaledVector(Vi,o);const p=h*b-f*u;if(p<=0&&u-h>=0&&f-b>=0)return Dl.subVectors(r,i),o=(u-h)/(u-h+(f-b)),t.copy(i).addScaledVector(Dl,o);const m=1/(p+g+d);return a=g*m,o=d*m,t.copy(n).addScaledVector(Hi,a).addScaledVector(Vi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Gu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ai={h:0,s:0,l:0},Tr={h:0,s:0,l:0};function Za(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class he{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=gt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=$e.workingColorSpace){return this.r=e,this.g=t,this.b=n,$e.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=$e.workingColorSpace){if(e=Dc(e,1),t=Rt(t,0,1),n=Rt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Za(a,r,e+1/3),this.g=Za(a,r,e),this.b=Za(a,r,e-1/3)}return $e.toWorkingColorSpace(this,i),this}setStyle(e,t=gt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=gt){const n=Gu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Kn(e.r),this.g=Kn(e.g),this.b=Kn(e.b),this}copyLinearToSRGB(e){return this.r=rs(e.r),this.g=rs(e.g),this.b=rs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=gt){return $e.fromWorkingColorSpace(Bt.copy(this),e),Math.round(Rt(Bt.r*255,0,255))*65536+Math.round(Rt(Bt.g*255,0,255))*256+Math.round(Rt(Bt.b*255,0,255))}getHexString(e=gt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.fromWorkingColorSpace(Bt.copy(this),t);const n=Bt.r,i=Bt.g,r=Bt.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const u=a-o;switch(l=h<=.5?u/(a+o):u/(2-a-o),a){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=$e.workingColorSpace){return $e.fromWorkingColorSpace(Bt.copy(this),t),e.r=Bt.r,e.g=Bt.g,e.b=Bt.b,e}getStyle(e=gt){$e.fromWorkingColorSpace(Bt.copy(this),e);const t=Bt.r,n=Bt.g,i=Bt.b;return e!==gt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(ai),this.setHSL(ai.h+e,ai.s+t,ai.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ai),e.getHSL(Tr);const n=Ys(ai.h,Tr.h,t),i=Ys(ai.s,Tr.s,t),r=Ys(ai.l,Tr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Bt=new he;he.NAMES=Gu;let Zf=0;class an extends Ms{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Zf++}),this.uuid=mn(),this.name="",this.blending=is,this.side=Qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ao,this.blendDst=Ro,this.blendEquation=Ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new he(0,0,0),this.blendAlpha=0,this.depthFunc=cs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=gl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ui,this.stencilZFail=Ui,this.stencilZPass=Ui,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==is&&(n.blending=this.blending),this.side!==Qn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ao&&(n.blendSrc=this.blendSrc),this.blendDst!==Ro&&(n.blendDst=this.blendDst),this.blendEquation!==Ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==cs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==gl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ui&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ui&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ui&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class wt extends an{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new he(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=ba,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Xn=Qf();function Qf(){const s=new ArrayBuffer(4),e=new Float32Array(s),t=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let c=0;c<256;++c){const l=c-127;l<-27?(n[c]=0,n[c|256]=32768,i[c]=24,i[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,i[c]=-l-1,i[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,i[c]=13,i[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,i[c]=24,i[c|256]=24):(n[c]=31744,n[c|256]=64512,i[c]=13,i[c|256]=13)}const r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;!(l&8388608);)l<<=1,h-=8388608;l&=-8388609,h+=947912704,r[c]=l|h}for(let c=1024;c<2048;++c)r[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)a[c]=c<<23;a[31]=1199570944,a[32]=2147483648;for(let c=33;c<63;++c)a[c]=2147483648+(c-32<<23);a[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(o[c]=1024);return{floatView:e,uint32View:t,baseTable:n,shiftTable:i,mantissaTable:r,exponentTable:a,offsetTable:o}}function $f(s){Math.abs(s)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),s=Rt(s,-65504,65504),Xn.floatView[0]=s;const e=Xn.uint32View[0],t=e>>23&511;return Xn.baseTable[t]+((e&8388607)>>Xn.shiftTable[t])}function ep(s){const e=s>>10;return Xn.uint32View[0]=Xn.mantissaTable[Xn.offsetTable[e]+(s&1023)]+Xn.exponentTable[e],Xn.floatView[0]}const Ar={toHalfFloat:$f,fromHalfFloat:ep},Tt=new C,Rr=new J;class Mt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=uc,this.updateRanges=[],this.gpuType=Zt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Rr.fromBufferAttribute(this,t),Rr.applyMatrix3(e),this.setXY(t,Rr.x,Rr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix3(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyMatrix4(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.applyNormalMatrix(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Tt.fromBufferAttribute(this,t),Tt.transformDirection(e),this.setXYZ(t,Tt.x,Tt.y,Tt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Sn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Sn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Sn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Sn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Sn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array),r=ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==uc&&(e.usage=this.usage),e}}class Hu extends Mt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Vu extends Mt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Je extends Mt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let tp=0;const ln=new ze,Qa=new ft,Wi=new C,nn=new vt,Is=new vt,Dt=new C;class bt extends Ms{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tp++}),this.uuid=mn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ku(e)?Vu:Hu)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Xe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ln.makeRotationFromQuaternion(e),this.applyMatrix4(ln),this}rotateX(e){return ln.makeRotationX(e),this.applyMatrix4(ln),this}rotateY(e){return ln.makeRotationY(e),this.applyMatrix4(ln),this}rotateZ(e){return ln.makeRotationZ(e),this.applyMatrix4(ln),this}translate(e,t,n){return ln.makeTranslation(e,t,n),this.applyMatrix4(ln),this}scale(e,t,n){return ln.makeScale(e,t,n),this.applyMatrix4(ln),this}lookAt(e){return Qa.lookAt(e),Qa.updateMatrix(),this.applyMatrix4(Qa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Wi).negate(),this.translate(Wi.x,Wi.y,Wi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Je(n,3))}else{for(let n=0,i=t.count;n<i;n++){const r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new vt);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];nn.setFromBufferAttribute(r),this.morphTargetsRelative?(Dt.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(Dt),Dt.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(Dt)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new In);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){const n=this.boundingSphere.center;if(nn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Is.setFromBufferAttribute(o),this.morphTargetsRelative?(Dt.addVectors(nn.min,Is.min),nn.expandByPoint(Dt),Dt.addVectors(nn.max,Is.max),nn.expandByPoint(Dt)):(nn.expandByPoint(Is.min),nn.expandByPoint(Is.max))}nn.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)Dt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Dt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)Dt.fromBufferAttribute(o,l),c&&(Wi.fromBufferAttribute(e,l),Dt.add(Wi)),i=Math.max(i,n.distanceToSquared(Dt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Mt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let E=0;E<n.count;E++)o[E]=new C,c[E]=new C;const l=new C,h=new C,u=new C,d=new J,f=new J,b=new J,g=new C,p=new C;function m(E,M,y){l.fromBufferAttribute(n,E),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,y),d.fromBufferAttribute(r,E),f.fromBufferAttribute(r,M),b.fromBufferAttribute(r,y),h.sub(l),u.sub(l),f.sub(d),b.sub(d);const L=1/(f.x*b.y-b.x*f.y);isFinite(L)&&(g.copy(h).multiplyScalar(b.y).addScaledVector(u,-f.y).multiplyScalar(L),p.copy(u).multiplyScalar(f.x).addScaledVector(h,-b.x).multiplyScalar(L),o[E].add(g),o[M].add(g),o[y].add(g),c[E].add(p),c[M].add(p),c[y].add(p))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let E=0,M=x.length;E<M;++E){const y=x[E],L=y.start,D=y.count;for(let U=L,F=L+D;U<F;U+=3)m(e.getX(U+0),e.getX(U+1),e.getX(U+2))}const v=new C,_=new C,R=new C,S=new C;function A(E){R.fromBufferAttribute(i,E),S.copy(R);const M=o[E];v.copy(M),v.sub(R.multiplyScalar(R.dot(M))).normalize(),_.crossVectors(S,M);const L=_.dot(c[E])<0?-1:1;a.setXYZW(E,v.x,v.y,v.z,L)}for(let E=0,M=x.length;E<M;++E){const y=x[E],L=y.start,D=y.count;for(let U=L,F=L+D;U<F;U+=3)A(e.getX(U+0)),A(e.getX(U+1)),A(e.getX(U+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Mt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new C,r=new C,a=new C,o=new C,c=new C,l=new C,h=new C,u=new C;if(e)for(let d=0,f=e.count;d<f;d+=3){const b=e.getX(d+0),g=e.getX(d+1),p=e.getX(d+2);i.fromBufferAttribute(t,b),r.fromBufferAttribute(t,g),a.fromBufferAttribute(t,p),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,b),c.fromBufferAttribute(n,g),l.fromBufferAttribute(n,p),o.add(h),c.add(h),l.add(h),n.setXYZ(b,o.x,o.y,o.z),n.setXYZ(g,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Dt.fromBufferAttribute(e,t),Dt.normalize(),e.setXYZ(t,Dt.x,Dt.y,Dt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,u=o.normalized,d=new l.constructor(c.length*h);let f=0,b=0;for(let g=0,p=c.length;g<p;g++){o.isInterleavedBufferAttribute?f=c[g]*o.data.stride+o.offset:f=c[g]*h;for(let m=0;m<h;m++)d[b++]=l[f++]}return new Mt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new bt,n=this.index.array,i=this.attributes;for(const o in i){const c=i[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=e(d,n);c.push(f)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(e.data))}h.length>0&&(i[c]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ul=new ze,bi=new fr,Cr=new In,Nl=new C,Pr=new C,Lr=new C,Ir=new C,$a=new C,Dr=new C,Fl=new C,Ur=new C;class X extends ft{constructor(e=new bt,t=new wt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){Dr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],u=r[c];h!==0&&($a.fromBufferAttribute(u,e),a?Dr.addScaledVector($a,h):Dr.addScaledVector($a.sub(t),h))}t.add(Dr)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Cr.copy(n.boundingSphere),Cr.applyMatrix4(r),bi.copy(e.ray).recast(e.near),!(Cr.containsPoint(bi.origin)===!1&&(bi.intersectSphere(Cr,Nl)===null||bi.origin.distanceToSquared(Nl)>(e.far-e.near)**2))&&(Ul.copy(r).invert(),bi.copy(e.ray).applyMatrix4(Ul),!(n.boundingBox!==null&&bi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,bi)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let b=0,g=d.length;b<g;b++){const p=d[b],m=a[p.materialIndex],x=Math.max(p.start,f.start),v=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let _=x,R=v;_<R;_+=3){const S=o.getX(_),A=o.getX(_+1),E=o.getX(_+2);i=Nr(this,m,e,n,l,h,u,S,A,E),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const b=Math.max(0,f.start),g=Math.min(o.count,f.start+f.count);for(let p=b,m=g;p<m;p+=3){const x=o.getX(p),v=o.getX(p+1),_=o.getX(p+2);i=Nr(this,a,e,n,l,h,u,x,v,_),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}else if(c!==void 0)if(Array.isArray(a))for(let b=0,g=d.length;b<g;b++){const p=d[b],m=a[p.materialIndex],x=Math.max(p.start,f.start),v=Math.min(c.count,Math.min(p.start+p.count,f.start+f.count));for(let _=x,R=v;_<R;_+=3){const S=_,A=_+1,E=_+2;i=Nr(this,m,e,n,l,h,u,S,A,E),i&&(i.faceIndex=Math.floor(_/3),i.face.materialIndex=p.materialIndex,t.push(i))}}else{const b=Math.max(0,f.start),g=Math.min(c.count,f.start+f.count);for(let p=b,m=g;p<m;p+=3){const x=p,v=p+1,_=p+2;i=Nr(this,a,e,n,l,h,u,x,v,_),i&&(i.faceIndex=Math.floor(p/3),t.push(i))}}}}function np(s,e,t,n,i,r,a,o){let c;if(e.side===qt?c=n.intersectTriangle(a,r,i,!0,o):c=n.intersectTriangle(i,r,a,e.side===Qn,o),c===null)return null;Ur.copy(o),Ur.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(Ur);return l<t.near||l>t.far?null:{distance:l,point:Ur.clone(),object:s}}function Nr(s,e,t,n,i,r,a,o,c,l){s.getVertexPosition(o,Pr),s.getVertexPosition(c,Lr),s.getVertexPosition(l,Ir);const h=np(s,e,t,n,Pr,Lr,Ir,Fl);if(h){const u=new C;fn.getBarycoord(Fl,Pr,Lr,Ir,u),i&&(h.uv=fn.getInterpolatedAttribute(i,o,c,l,u,new J)),r&&(h.uv1=fn.getInterpolatedAttribute(r,o,c,l,u,new J)),a&&(h.normal=fn.getInterpolatedAttribute(a,o,c,l,u,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:c,c:l,normal:new C,materialIndex:0};fn.getNormal(Pr,Lr,Ir,d.normal),h.face=d,h.barycoord=u}return h}class Le extends bt{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;b("z","y","x",-1,-1,n,t,e,a,r,0),b("z","y","x",1,-1,n,t,-e,a,r,1),b("x","z","y",1,1,e,n,t,i,a,2),b("x","z","y",1,-1,e,n,-t,i,a,3),b("x","y","z",1,-1,e,t,n,i,r,4),b("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new Je(l,3)),this.setAttribute("normal",new Je(h,3)),this.setAttribute("uv",new Je(u,2));function b(g,p,m,x,v,_,R,S,A,E,M){const y=_/A,L=R/E,D=_/2,U=R/2,F=S/2,W=A+1,B=E+1;let $=0,V=0;const se=new C;for(let oe=0;oe<B;oe++){const pe=oe*L-U;for(let Ie=0;Ie<W;Ie++){const qe=Ie*y-D;se[g]=qe*x,se[p]=pe*v,se[m]=F,l.push(se.x,se.y,se.z),se[g]=0,se[p]=0,se[m]=S>0?1:-1,h.push(se.x,se.y,se.z),u.push(Ie/A),u.push(1-oe/E),$+=1}}for(let oe=0;oe<E;oe++)for(let pe=0;pe<A;pe++){const Ie=d+pe+W*oe,qe=d+pe+W*(oe+1),q=d+(pe+1)+W*(oe+1),re=d+(pe+1)+W*oe;c.push(Ie,qe,re),c.push(qe,q,re),V+=6}o.addGroup(f,V,M),f+=V,d+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Le(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ps(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Wt(s){const e={};for(let t=0;t<s.length;t++){const n=ps(s[t]);for(const i in n)e[i]=n[i]}return e}function ip(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Wu(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const ar={clone:ps,merge:Wt};var sp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,rp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Xt extends an{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sp,this.fragmentShader=rp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ps(e.uniforms),this.uniformsGroups=ip(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class ju extends ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ze,this.projectionMatrix=new ze,this.projectionMatrixInverse=new ze,this.coordinateSystem=qn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const oi=new C,Ol=new J,kl=new J;class jt extends ju{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=fs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(qs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return fs*2*Math.atan(Math.tan(qs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(oi.x,oi.y).multiplyScalar(-e/oi.z),oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(oi.x,oi.y).multiplyScalar(-e/oi.z)}getViewSize(e,t){return this.getViewBounds(e,Ol,kl),t.subVectors(kl,Ol)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(qs*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*i/c,t-=a.offsetY*n/l,i*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ji=-90,Xi=1;class ap extends ft{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new jt(ji,Xi,e,t);i.layers=this.layers,this.add(i);const r=new jt(ji,Xi,e,t);r.layers=this.layers,this.add(r);const a=new jt(ji,Xi,e,t);a.layers=this.layers,this.add(a);const o=new jt(ji,Xi,e,t);o.layers=this.layers,this.add(o);const c=new jt(ji,Xi,e,t);c.layers=this.layers,this.add(c);const l=new jt(ji,Xi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===qn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===da)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),b=e.xr.enabled;e.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,a),e.setRenderTarget(n,2,i),e.render(t,o),e.setRenderTarget(n,3,i),e.render(t,c),e.setRenderTarget(n,4,i),e.render(t,l),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=b,n.texture.needsPMREMUpdate=!0}}class Xu extends Pt{constructor(e,t,n,i,r,a,o,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:ls,super(e,t,n,i,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class op extends gn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Xu(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Nt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Le(5,5,5),r=new Xt({name:"CubemapFromEquirect",uniforms:ps(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qt,blending:Yn});r.uniforms.tEquirect.value=t;const a=new X(i,r),o=t.minFilter;return t.minFilter===wn&&(t.minFilter=Nt),new ap(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,i){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}const eo=new C,cp=new C,lp=new Xe;class Si{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=eo.subVectors(n,t).cross(cp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(eo),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||lp.getNormalMatrix(e),i=this.coplanarPoint(eo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const _i=new In,Fr=new C;class Nc{constructor(e=new Si,t=new Si,n=new Si,i=new Si,r=new Si,a=new Si){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=qn){const n=this.planes,i=e.elements,r=i[0],a=i[1],o=i[2],c=i[3],l=i[4],h=i[5],u=i[6],d=i[7],f=i[8],b=i[9],g=i[10],p=i[11],m=i[12],x=i[13],v=i[14],_=i[15];if(n[0].setComponents(c-r,d-l,p-f,_-m).normalize(),n[1].setComponents(c+r,d+l,p+f,_+m).normalize(),n[2].setComponents(c+a,d+h,p+b,_+x).normalize(),n[3].setComponents(c-a,d-h,p-b,_-x).normalize(),n[4].setComponents(c-o,d-u,p-g,_-v).normalize(),t===qn)n[5].setComponents(c+o,d+u,p+g,_+v).normalize();else if(t===da)n[5].setComponents(o,u,g,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),_i.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),_i.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(_i)}intersectsSprite(e){return _i.center.set(0,0,0),_i.radius=.7071067811865476,_i.applyMatrix4(e.matrixWorld),this.intersectsSphere(_i)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Fr.x=i.normal.x>0?e.max.x:e.min.x,Fr.y=i.normal.y>0?e.max.y:e.min.y,Fr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Fr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function qu(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function hp(s){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,u=l.byteLength,d=s.createBuffer();s.bindBuffer(c,d),s.bufferData(c,l,h),o.onUploadCallback();let f;if(l instanceof Float32Array)f=s.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=s.SHORT;else if(l instanceof Uint32Array)f=s.UNSIGNED_INT;else if(l instanceof Int32Array)f=s.INT;else if(l instanceof Int8Array)f=s.BYTE;else if(l instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,c,l){const h=c.array,u=c.updateRanges;if(s.bindBuffer(l,o),u.length===0)s.bufferSubData(l,0,h);else{u.sort((f,b)=>f.start-b.start);let d=0;for(let f=1;f<u.length;f++){const b=u[d],g=u[f];g.start<=b.start+b.count+1?b.count=Math.max(b.count,g.start+g.count-b.start):(++d,u[d]=g)}u.length=d+1;for(let f=0,b=u.length;f<b;f++){const g=u[f];s.bufferSubData(l,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}c.clearUpdateRanges()}c.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(s.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:i,remove:r,update:a}}class un extends bt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(i),l=o+1,h=c+1,u=e/o,d=t/c,f=[],b=[],g=[],p=[];for(let m=0;m<h;m++){const x=m*d-a;for(let v=0;v<l;v++){const _=v*u-r;b.push(_,-x,0),g.push(0,0,1),p.push(v/o),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let x=0;x<o;x++){const v=x+l*m,_=x+l*(m+1),R=x+1+l*(m+1),S=x+1+l*m;f.push(v,_,S),f.push(_,R,S)}this.setIndex(f),this.setAttribute("position",new Je(b,3)),this.setAttribute("normal",new Je(g,3)),this.setAttribute("uv",new Je(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new un(e.width,e.height,e.widthSegments,e.heightSegments)}}var up=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,dp=`#ifdef USE_ALPHAHASH
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
#endif`,fp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,pp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,gp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,bp=`#ifdef USE_AOMAP
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
#endif`,_p=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xp=`#ifdef USE_BATCHING
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
#endif`,vp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Mp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,wp=`#ifdef USE_IRIDESCENCE
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
#endif`,Ep=`#ifdef USE_BUMPMAP
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
#endif`,Tp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ap=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Rp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Pp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Lp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ip=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Dp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Up=`#define PI 3.141592653589793
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
} // validated`,Np=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Fp=`vec3 transformedNormal = objectNormal;
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
#endif`,Op=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,kp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,zp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Vp=`#ifdef USE_ENVMAP
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
#endif`,Wp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,jp=`#ifdef USE_ENVMAP
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
#endif`,Xp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,qp=`#ifdef USE_ENVMAP
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
#endif`,Yp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Kp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Jp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Qp=`#ifdef USE_GRADIENTMAP
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
}`,$p=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,em=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,nm=`uniform bool receiveShadow;
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
#endif`,im=`#ifdef USE_ENVMAP
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
#endif`,sm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,am=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,om=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cm=`PhysicalMaterial material;
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
#endif`,lm=`struct PhysicalMaterial {
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
}`,hm=`
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
#endif`,um=`#if defined( RE_IndirectDiffuse )
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
#endif`,dm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,fm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mm=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gm=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,bm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_m=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,vm=`#if defined( USE_POINTS_UV )
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
#endif`,ym=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Sm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,wm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Em=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tm=`#ifdef USE_MORPHTARGETS
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
#endif`,Am=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Cm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Pm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Im=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Dm=`#ifdef USE_NORMALMAP
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
#endif`,Um=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Nm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Om=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,km=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,zm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,jm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,qm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ym=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Km=`float getShadowMask() {
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
}`,Jm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zm=`#ifdef USE_SKINNING
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
#endif`,Qm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$m=`#ifdef USE_SKINNING
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
#endif`,e0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,t0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,n0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,i0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,s0=`#ifdef USE_TRANSMISSION
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
#endif`,r0=`#ifdef USE_TRANSMISSION
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
#endif`,a0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,o0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,c0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,l0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const h0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,u0=`uniform sampler2D t2D;
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
}`,d0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,f0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,p0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,m0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,g0=`#include <common>
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
}`,b0=`#if DEPTH_PACKING == 3200
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
}`,_0=`#define DISTANCE
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
}`,x0=`#define DISTANCE
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
}`,v0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,y0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,M0=`uniform float scale;
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
}`,S0=`uniform vec3 diffuse;
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
}`,w0=`#include <common>
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
}`,E0=`uniform vec3 diffuse;
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
}`,T0=`#define LAMBERT
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
}`,A0=`#define LAMBERT
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
}`,R0=`#define MATCAP
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
}`,C0=`#define MATCAP
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
}`,P0=`#define NORMAL
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
}`,L0=`#define NORMAL
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
}`,I0=`#define PHONG
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
}`,D0=`#define PHONG
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
}`,U0=`#define STANDARD
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
}`,N0=`#define STANDARD
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
}`,F0=`#define TOON
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
}`,O0=`#define TOON
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
}`,k0=`uniform float size;
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
}`,B0=`uniform vec3 diffuse;
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
}`,z0=`#include <common>
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
}`,G0=`uniform vec3 color;
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
}`,H0=`uniform float rotation;
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
}`,V0=`uniform vec3 diffuse;
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
}`,Ke={alphahash_fragment:up,alphahash_pars_fragment:dp,alphamap_fragment:fp,alphamap_pars_fragment:pp,alphatest_fragment:mp,alphatest_pars_fragment:gp,aomap_fragment:bp,aomap_pars_fragment:_p,batching_pars_vertex:xp,batching_vertex:vp,begin_vertex:yp,beginnormal_vertex:Mp,bsdfs:Sp,iridescence_fragment:wp,bumpmap_pars_fragment:Ep,clipping_planes_fragment:Tp,clipping_planes_pars_fragment:Ap,clipping_planes_pars_vertex:Rp,clipping_planes_vertex:Cp,color_fragment:Pp,color_pars_fragment:Lp,color_pars_vertex:Ip,color_vertex:Dp,common:Up,cube_uv_reflection_fragment:Np,defaultnormal_vertex:Fp,displacementmap_pars_vertex:Op,displacementmap_vertex:kp,emissivemap_fragment:Bp,emissivemap_pars_fragment:zp,colorspace_fragment:Gp,colorspace_pars_fragment:Hp,envmap_fragment:Vp,envmap_common_pars_fragment:Wp,envmap_pars_fragment:jp,envmap_pars_vertex:Xp,envmap_physical_pars_fragment:im,envmap_vertex:qp,fog_vertex:Yp,fog_pars_vertex:Kp,fog_fragment:Jp,fog_pars_fragment:Zp,gradientmap_pars_fragment:Qp,lightmap_pars_fragment:$p,lights_lambert_fragment:em,lights_lambert_pars_fragment:tm,lights_pars_begin:nm,lights_toon_fragment:sm,lights_toon_pars_fragment:rm,lights_phong_fragment:am,lights_phong_pars_fragment:om,lights_physical_fragment:cm,lights_physical_pars_fragment:lm,lights_fragment_begin:hm,lights_fragment_maps:um,lights_fragment_end:dm,logdepthbuf_fragment:fm,logdepthbuf_pars_fragment:pm,logdepthbuf_pars_vertex:mm,logdepthbuf_vertex:gm,map_fragment:bm,map_pars_fragment:_m,map_particle_fragment:xm,map_particle_pars_fragment:vm,metalnessmap_fragment:ym,metalnessmap_pars_fragment:Mm,morphinstance_vertex:Sm,morphcolor_vertex:wm,morphnormal_vertex:Em,morphtarget_pars_vertex:Tm,morphtarget_vertex:Am,normal_fragment_begin:Rm,normal_fragment_maps:Cm,normal_pars_fragment:Pm,normal_pars_vertex:Lm,normal_vertex:Im,normalmap_pars_fragment:Dm,clearcoat_normal_fragment_begin:Um,clearcoat_normal_fragment_maps:Nm,clearcoat_pars_fragment:Fm,iridescence_pars_fragment:Om,opaque_fragment:km,packing:Bm,premultiplied_alpha_fragment:zm,project_vertex:Gm,dithering_fragment:Hm,dithering_pars_fragment:Vm,roughnessmap_fragment:Wm,roughnessmap_pars_fragment:jm,shadowmap_pars_fragment:Xm,shadowmap_pars_vertex:qm,shadowmap_vertex:Ym,shadowmask_pars_fragment:Km,skinbase_vertex:Jm,skinning_pars_vertex:Zm,skinning_vertex:Qm,skinnormal_vertex:$m,specularmap_fragment:e0,specularmap_pars_fragment:t0,tonemapping_fragment:n0,tonemapping_pars_fragment:i0,transmission_fragment:s0,transmission_pars_fragment:r0,uv_pars_fragment:a0,uv_pars_vertex:o0,uv_vertex:c0,worldpos_vertex:l0,background_vert:h0,background_frag:u0,backgroundCube_vert:d0,backgroundCube_frag:f0,cube_vert:p0,cube_frag:m0,depth_vert:g0,depth_frag:b0,distanceRGBA_vert:_0,distanceRGBA_frag:x0,equirect_vert:v0,equirect_frag:y0,linedashed_vert:M0,linedashed_frag:S0,meshbasic_vert:w0,meshbasic_frag:E0,meshlambert_vert:T0,meshlambert_frag:A0,meshmatcap_vert:R0,meshmatcap_frag:C0,meshnormal_vert:P0,meshnormal_frag:L0,meshphong_vert:I0,meshphong_frag:D0,meshphysical_vert:U0,meshphysical_frag:N0,meshtoon_vert:F0,meshtoon_frag:O0,points_vert:k0,points_frag:B0,shadow_vert:z0,shadow_frag:G0,sprite_vert:H0,sprite_frag:V0},ue={common:{diffuse:{value:new he(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xe}},envmap:{envMap:{value:null},envMapRotation:{value:new Xe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xe},normalScale:{value:new J(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new he(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new he(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0},uvTransform:{value:new Xe}},sprite:{diffuse:{value:new he(16777215)},opacity:{value:1},center:{value:new J(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}}},Rn={basic:{uniforms:Wt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:Wt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new he(0)}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:Wt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new he(0)},specular:{value:new he(1118481)},shininess:{value:30}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:Wt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new he(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:Wt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new he(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:Wt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:Wt([ue.points,ue.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:Wt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:Wt([ue.common,ue.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:Wt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:Wt([ue.sprite,ue.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Xe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xe}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distanceRGBA:{uniforms:Wt([ue.common,ue.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distanceRGBA_vert,fragmentShader:Ke.distanceRGBA_frag},shadow:{uniforms:Wt([ue.lights,ue.fog,{color:{value:new he(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};Rn.physical={uniforms:Wt([Rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xe},clearcoatNormalScale:{value:new J(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xe},sheen:{value:0},sheenColor:{value:new he(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xe},transmissionSamplerSize:{value:new J},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xe},attenuationDistance:{value:0},attenuationColor:{value:new he(0)},specularColor:{value:new he(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xe},anisotropyVector:{value:new J},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xe}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};const Or={r:0,b:0,g:0},xi=new on,W0=new ze;function j0(s,e,t,n,i,r,a){const o=new he(0);let c=r===!0?0:1,l,h,u=null,d=0,f=null;function b(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?t:e).get(v)),v}function g(x){let v=!1;const _=b(x);_===null?m(o,c):_&&_.isColor&&(m(_,1),v=!0);const R=s.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function p(x,v){const _=b(v);_&&(_.isCubeTexture||_.mapping===_a)?(h===void 0&&(h=new X(new Le(1,1,1),new Xt({name:"BackgroundCubeMaterial",uniforms:ps(Rn.backgroundCube.uniforms),vertexShader:Rn.backgroundCube.vertexShader,fragmentShader:Rn.backgroundCube.fragmentShader,side:qt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,S,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),xi.copy(v.backgroundRotation),xi.x*=-1,xi.y*=-1,xi.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(xi.y*=-1,xi.z*=-1),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(W0.makeRotationFromEuler(xi)),h.material.toneMapped=$e.getTransfer(_.colorSpace)!==ht,(u!==_||d!==_.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=_,d=_.version,f=s.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new X(new un(2,2),new Xt({name:"BackgroundMaterial",uniforms:ps(Rn.background.uniforms),vertexShader:Rn.background.vertexShader,fragmentShader:Rn.background.fragmentShader,side:Qn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=$e.getTransfer(_.colorSpace)!==ht,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||d!==_.version||f!==s.toneMapping)&&(l.material.needsUpdate=!0,u=_,d=_.version,f=s.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function m(x,v){x.getRGB(Or,Wu(s)),n.buffers.color.setClear(Or.r,Or.g,Or.b,v,a)}return{getClearColor:function(){return o},setClearColor:function(x,v=1){o.set(x),c=v,m(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,m(o,c)},render:g,addToRenderList:p}}function X0(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,a=!1;function o(y,L,D,U,F){let W=!1;const B=u(U,D,L);r!==B&&(r=B,l(r.object)),W=f(y,U,D,F),W&&b(y,U,D,F),F!==null&&e.update(F,s.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,_(y,L,D,U),F!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function c(){return s.createVertexArray()}function l(y){return s.bindVertexArray(y)}function h(y){return s.deleteVertexArray(y)}function u(y,L,D){const U=D.wireframe===!0;let F=n[y.id];F===void 0&&(F={},n[y.id]=F);let W=F[L.id];W===void 0&&(W={},F[L.id]=W);let B=W[U];return B===void 0&&(B=d(c()),W[U]=B),B}function d(y){const L=[],D=[],U=[];for(let F=0;F<t;F++)L[F]=0,D[F]=0,U[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:D,attributeDivisors:U,object:y,attributes:{},index:null}}function f(y,L,D,U){const F=r.attributes,W=L.attributes;let B=0;const $=D.getAttributes();for(const V in $)if($[V].location>=0){const oe=F[V];let pe=W[V];if(pe===void 0&&(V==="instanceMatrix"&&y.instanceMatrix&&(pe=y.instanceMatrix),V==="instanceColor"&&y.instanceColor&&(pe=y.instanceColor)),oe===void 0||oe.attribute!==pe||pe&&oe.data!==pe.data)return!0;B++}return r.attributesNum!==B||r.index!==U}function b(y,L,D,U){const F={},W=L.attributes;let B=0;const $=D.getAttributes();for(const V in $)if($[V].location>=0){let oe=W[V];oe===void 0&&(V==="instanceMatrix"&&y.instanceMatrix&&(oe=y.instanceMatrix),V==="instanceColor"&&y.instanceColor&&(oe=y.instanceColor));const pe={};pe.attribute=oe,oe&&oe.data&&(pe.data=oe.data),F[V]=pe,B++}r.attributes=F,r.attributesNum=B,r.index=U}function g(){const y=r.newAttributes;for(let L=0,D=y.length;L<D;L++)y[L]=0}function p(y){m(y,0)}function m(y,L){const D=r.newAttributes,U=r.enabledAttributes,F=r.attributeDivisors;D[y]=1,U[y]===0&&(s.enableVertexAttribArray(y),U[y]=1),F[y]!==L&&(s.vertexAttribDivisor(y,L),F[y]=L)}function x(){const y=r.newAttributes,L=r.enabledAttributes;for(let D=0,U=L.length;D<U;D++)L[D]!==y[D]&&(s.disableVertexAttribArray(D),L[D]=0)}function v(y,L,D,U,F,W,B){B===!0?s.vertexAttribIPointer(y,L,D,F,W):s.vertexAttribPointer(y,L,D,U,F,W)}function _(y,L,D,U){g();const F=U.attributes,W=D.getAttributes(),B=L.defaultAttributeValues;for(const $ in W){const V=W[$];if(V.location>=0){let se=F[$];if(se===void 0&&($==="instanceMatrix"&&y.instanceMatrix&&(se=y.instanceMatrix),$==="instanceColor"&&y.instanceColor&&(se=y.instanceColor)),se!==void 0){const oe=se.normalized,pe=se.itemSize,Ie=e.get(se);if(Ie===void 0)continue;const qe=Ie.buffer,q=Ie.type,re=Ie.bytesPerElement,we=q===s.INT||q===s.UNSIGNED_INT||se.gpuType===Tc;if(se.isInterleavedBufferAttribute){const ce=se.data,De=ce.stride,Ge=se.offset;if(ce.isInstancedInterleavedBuffer){for(let ke=0;ke<V.locationSize;ke++)m(V.location+ke,ce.meshPerAttribute);y.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let ke=0;ke<V.locationSize;ke++)p(V.location+ke);s.bindBuffer(s.ARRAY_BUFFER,qe);for(let ke=0;ke<V.locationSize;ke++)v(V.location+ke,pe/V.locationSize,q,oe,De*re,(Ge+pe/V.locationSize*ke)*re,we)}else{if(se.isInstancedBufferAttribute){for(let ce=0;ce<V.locationSize;ce++)m(V.location+ce,se.meshPerAttribute);y.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let ce=0;ce<V.locationSize;ce++)p(V.location+ce);s.bindBuffer(s.ARRAY_BUFFER,qe);for(let ce=0;ce<V.locationSize;ce++)v(V.location+ce,pe/V.locationSize,q,oe,pe*re,pe/V.locationSize*ce*re,we)}}else if(B!==void 0){const oe=B[$];if(oe!==void 0)switch(oe.length){case 2:s.vertexAttrib2fv(V.location,oe);break;case 3:s.vertexAttrib3fv(V.location,oe);break;case 4:s.vertexAttrib4fv(V.location,oe);break;default:s.vertexAttrib1fv(V.location,oe)}}}}x()}function R(){E();for(const y in n){const L=n[y];for(const D in L){const U=L[D];for(const F in U)h(U[F].object),delete U[F];delete L[D]}delete n[y]}}function S(y){if(n[y.id]===void 0)return;const L=n[y.id];for(const D in L){const U=L[D];for(const F in U)h(U[F].object),delete U[F];delete L[D]}delete n[y.id]}function A(y){for(const L in n){const D=n[L];if(D[y.id]===void 0)continue;const U=D[y.id];for(const F in U)h(U[F].object),delete U[F];delete D[y.id]}}function E(){M(),a=!0,r!==i&&(r=i,l(r.object))}function M(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:E,resetDefaultState:M,dispose:R,releaseStatesOfGeometry:S,releaseStatesOfProgram:A,initAttributes:g,enableAttribute:p,disableUnusedAttributes:x}}function q0(s,e,t){let n;function i(l){n=l}function r(l,h){s.drawArrays(n,l,h),t.update(h,n,1)}function a(l,h,u){u!==0&&(s.drawArraysInstanced(n,l,h,u),t.update(h,n,u))}function o(l,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let b=0;b<u;b++)f+=h[b];t.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let b=0;b<l.length;b++)a(l[b],h[b],d[b]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let b=0;for(let g=0;g<u;g++)b+=h[g]*d[g];t.update(b,n,1)}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Y0(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(A){return!(A!==pn&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const E=A===Qt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==$n&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Zt&&!E)}function c(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),b=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),v=s.getParameter(s.MAX_VARYING_VECTORS),_=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),R=b>0,S=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:b,maxTextureSize:g,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:x,maxVaryings:v,maxFragmentUniforms:_,vertexTextures:R,maxSamples:S}}function K0(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new Si,o=new Xe,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const b=u.clippingPlanes,g=u.clipIntersection,p=u.clipShadows,m=s.get(u);if(!i||b===null||b.length===0||r&&!p)r?h(null):l();else{const x=r?0:n,v=x*4;let _=m.clippingState||null;c.value=_,_=h(b,d,v,f);for(let R=0;R!==v;++R)_[R]=t[R];m.clippingState=_,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,b){const g=u!==null?u.length:0;let p=null;if(g!==0){if(p=c.value,b!==!0||p===null){const m=f+g*4,x=d.matrixWorldInverse;o.getNormalMatrix(x),(p===null||p.length<m)&&(p=new Float32Array(m));for(let v=0,_=f;v!==g;++v,_+=4)a.copy(u[v]).applyMatrix4(x,o),a.normal.toArray(p,_),p[_+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,p}}function J0(s){let e=new WeakMap;function t(a,o){return o===Fo?a.mapping=ls:o===Oo&&(a.mapping=hs),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Fo||o===Oo)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new op(c.height);return l.fromEquirectangularTexture(s,a),e.set(a,l),a.addEventListener("dispose",i),t(l.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class ya extends ju{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,c=i-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ts=4,Bl=[.125,.215,.35,.446,.526,.582],Ai=20,to=new ya,zl=new he;let no=null,io=0,so=0,ro=!1;const wi=(1+Math.sqrt(5))/2,qi=1/wi,Gl=[new C(-wi,qi,0),new C(wi,qi,0),new C(-qi,0,wi),new C(qi,0,wi),new C(0,wi,-qi),new C(0,wi,qi),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)];class dc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){no=this._renderer.getRenderTarget(),io=this._renderer.getActiveCubeFace(),so=this._renderer.getActiveMipmapLevel(),ro=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,i,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Wl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(no,io,so),this._renderer.xr.enabled=ro,e.scissorTest=!1,kr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ls||e.mapping===hs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),no=this._renderer.getRenderTarget(),io=this._renderer.getActiveCubeFace(),so=this._renderer.getActiveMipmapLevel(),ro=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Nt,minFilter:Nt,generateMipmaps:!1,type:Qt,format:pn,colorSpace:Gt,depthBuffer:!1},i=Hl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hl(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Z0(r)),this._blurMaterial=Q0(r,e,t)}return i}_compileMaterial(e){const t=new X(this._lodPlanes[0],e);this._renderer.compile(t,to)}_sceneToCubeUV(e,t,n,i){const o=new jt(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(zl),h.toneMapping=fi,h.autoClear=!1;const f=new wt({name:"PMREM.Background",side:qt,depthWrite:!1,depthTest:!1}),b=new X(new Le,f);let g=!1;const p=e.background;p?p.isColor&&(f.color.copy(p),e.background=null,g=!0):(f.color.copy(zl),g=!0);for(let m=0;m<6;m++){const x=m%3;x===0?(o.up.set(0,c[m],0),o.lookAt(l[m],0,0)):x===1?(o.up.set(0,0,c[m]),o.lookAt(0,l[m],0)):(o.up.set(0,c[m],0),o.lookAt(0,0,l[m]));const v=this._cubeSize;kr(i,x*v,m>2?v:0,v,v),h.setRenderTarget(i),g&&h.render(b,o),h.render(e,o)}b.geometry.dispose(),b.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===ls||e.mapping===hs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Wl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vl());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new X(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;kr(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,to)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Gl[(i-r-1)%Gl.length];this._blur(e,r-1,r,a,o)}t.autoClear=n}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new X(this._lodPlanes[i],l),d=l.uniforms,f=this._sizeLods[n]-1,b=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Ai-1),g=r/b,p=isFinite(r)?1+Math.floor(h*g):Ai;p>Ai&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Ai}`);const m=[];let x=0;for(let A=0;A<Ai;++A){const E=A/g,M=Math.exp(-E*E/2);m.push(M),A===0?x+=M:A<p&&(x+=2*M)}for(let A=0;A<m.length;A++)m[A]=m[A]/x;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=m,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:v}=this;d.dTheta.value=b,d.mipInt.value=v-n;const _=this._sizeLods[i],R=3*_*(i>v-ts?i-v+ts:0),S=4*(this._cubeSize-_);kr(t,R,S,3*_,2*_),c.setRenderTarget(t),c.render(u,to)}}function Z0(s){const e=[],t=[],n=[];let i=s;const r=s-ts+1+Bl.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);t.push(o);let c=1/o;a>s-ts?c=Bl[a-s+ts-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,b=6,g=3,p=2,m=1,x=new Float32Array(g*b*f),v=new Float32Array(p*b*f),_=new Float32Array(m*b*f);for(let S=0;S<f;S++){const A=S%3*2/3-1,E=S>2?0:-1,M=[A,E,0,A+2/3,E,0,A+2/3,E+1,0,A,E,0,A+2/3,E+1,0,A,E+1,0];x.set(M,g*b*S),v.set(d,p*b*S);const y=[S,S,S,S,S,S];_.set(y,m*b*S)}const R=new bt;R.setAttribute("position",new Mt(x,g)),R.setAttribute("uv",new Mt(v,p)),R.setAttribute("faceIndex",new Mt(_,m)),e.push(R),i>ts&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Hl(s,e,t){const n=new gn(s,e,t);return n.texture.mapping=_a,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function kr(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function Q0(s,e,t){const n=new Float32Array(Ai),i=new C(0,1,0);return new Xt({name:"SphericalGaussianBlur",defines:{n:Ai,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Fc(),fragmentShader:`

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
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function Vl(){return new Xt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fc(),fragmentShader:`

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
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function Wl(){return new Xt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function Fc(){return`

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
	`}function $0(s){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Fo||c===Oo,h=c===ls||c===hs;if(l||h){let u=e.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new dc(s)),u=l?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return l&&f&&f.height>0||h&&f&&i(f)?(t===null&&(t=new dc(s)),u=l?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function i(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function eg(s){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&js("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function tg(s,e,t,n){const i={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const b in d.attributes)e.remove(d.attributes[b]);for(const b in d.morphAttributes){const g=d.morphAttributes[b];for(let p=0,m=g.length;p<m;p++)e.remove(g[p])}d.removeEventListener("dispose",a),delete i[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function c(u){const d=u.attributes;for(const b in d)e.update(d[b],s.ARRAY_BUFFER);const f=u.morphAttributes;for(const b in f){const g=f[b];for(let p=0,m=g.length;p<m;p++)e.update(g[p],s.ARRAY_BUFFER)}}function l(u){const d=[],f=u.index,b=u.attributes.position;let g=0;if(f!==null){const x=f.array;g=f.version;for(let v=0,_=x.length;v<_;v+=3){const R=x[v+0],S=x[v+1],A=x[v+2];d.push(R,S,S,A,A,R)}}else if(b!==void 0){const x=b.array;g=b.version;for(let v=0,_=x.length/3-1;v<_;v+=3){const R=v+0,S=v+1,A=v+2;d.push(R,S,S,A,A,R)}}else return;const p=new(ku(d)?Vu:Hu)(d,1);p.version=g;const m=r.get(u);m&&e.remove(m),r.set(u,p)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:o,update:c,getWireframeAttribute:h}}function ng(s,e,t){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function c(d,f){s.drawElements(n,f,r,d*a),t.update(f,n,1)}function l(d,f,b){b!==0&&(s.drawElementsInstanced(n,f,r,d*a,b),t.update(f,n,b))}function h(d,f,b){if(b===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,b);let p=0;for(let m=0;m<b;m++)p+=f[m];t.update(p,n,1)}function u(d,f,b,g){if(b===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<d.length;m++)l(d[m]/a,f[m],g[m]);else{p.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,g,0,b);let m=0;for(let x=0;x<b;x++)m+=f[x]*g[x];t.update(m,n,1)}}this.setMode=i,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function ig(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function sg(s,e,t){const n=new WeakMap,i=new rt;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let M=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,b=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],x=o.morphAttributes.color||[];let v=0;f===!0&&(v=1),b===!0&&(v=2),g===!0&&(v=3);let _=o.attributes.position.count*v,R=1;_>e.maxTextureSize&&(R=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);const S=new Float32Array(_*R*4*u),A=new zu(S,_,R,u);A.type=Zt,A.needsUpdate=!0;const E=v*4;for(let y=0;y<u;y++){const L=p[y],D=m[y],U=x[y],F=_*R*4*y;for(let W=0;W<L.count;W++){const B=W*E;f===!0&&(i.fromBufferAttribute(L,W),S[F+B+0]=i.x,S[F+B+1]=i.y,S[F+B+2]=i.z,S[F+B+3]=0),b===!0&&(i.fromBufferAttribute(D,W),S[F+B+4]=i.x,S[F+B+5]=i.y,S[F+B+6]=i.z,S[F+B+7]=0),g===!0&&(i.fromBufferAttribute(U,W),S[F+B+8]=i.x,S[F+B+9]=i.y,S[F+B+10]=i.z,S[F+B+11]=U.itemSize===4?i.w:1)}}d={count:u,texture:A,size:new J(_,R)},n.set(o,d),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let f=0;for(let g=0;g<l.length;g++)f+=l[g];const b=o.morphTargetsRelative?1:1-f;c.getUniforms().setValue(s,"morphTargetBaseInfluence",b),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),c.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function rg(s,e,t,n){let i=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=e.get(c,h);if(i.get(u)!==l&&(e.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),i.get(c)!==l&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;i.get(d)!==l&&(d.update(),i.set(d,l))}return u}function a(){i=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}class Yu extends Pt{constructor(e,t,n,i,r,a,o,c,l,h=ss){if(h!==ss&&h!==ds)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ss&&(n=Pi),n===void 0&&h===ds&&(n=us),super(null,i,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Yt,this.minFilter=c!==void 0?c:Yt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Ku=new Pt,jl=new Yu(1,1),Ju=new zu,Zu=new Vf,Qu=new Xu,Xl=[],ql=[],Yl=new Float32Array(16),Kl=new Float32Array(9),Jl=new Float32Array(4);function Ss(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Xl[i];if(r===void 0&&(r=new Float32Array(i),Xl[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Lt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function It(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Ma(s,e){let t=ql[e];t===void 0&&(t=new Int32Array(e),ql[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function ag(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function og(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;s.uniform2fv(this.addr,e),It(t,e)}}function cg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;s.uniform3fv(this.addr,e),It(t,e)}}function lg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;s.uniform4fv(this.addr,e),It(t,e)}}function hg(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),It(t,e)}else{if(Lt(t,n))return;Jl.set(n),s.uniformMatrix2fv(this.addr,!1,Jl),It(t,n)}}function ug(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),It(t,e)}else{if(Lt(t,n))return;Kl.set(n),s.uniformMatrix3fv(this.addr,!1,Kl),It(t,n)}}function dg(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Lt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),It(t,e)}else{if(Lt(t,n))return;Yl.set(n),s.uniformMatrix4fv(this.addr,!1,Yl),It(t,n)}}function fg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function pg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;s.uniform2iv(this.addr,e),It(t,e)}}function mg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;s.uniform3iv(this.addr,e),It(t,e)}}function gg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;s.uniform4iv(this.addr,e),It(t,e)}}function bg(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function _g(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;s.uniform2uiv(this.addr,e),It(t,e)}}function xg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;s.uniform3uiv(this.addr,e),It(t,e)}}function vg(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;s.uniform4uiv(this.addr,e),It(t,e)}}function yg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(jl.compareFunction=Ou,r=jl):r=Ku,t.setTexture2D(e||r,i)}function Mg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Zu,i)}function Sg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Qu,i)}function wg(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Ju,i)}function Eg(s){switch(s){case 5126:return ag;case 35664:return og;case 35665:return cg;case 35666:return lg;case 35674:return hg;case 35675:return ug;case 35676:return dg;case 5124:case 35670:return fg;case 35667:case 35671:return pg;case 35668:case 35672:return mg;case 35669:case 35673:return gg;case 5125:return bg;case 36294:return _g;case 36295:return xg;case 36296:return vg;case 35678:case 36198:case 36298:case 36306:case 35682:return yg;case 35679:case 36299:case 36307:return Mg;case 35680:case 36300:case 36308:case 36293:return Sg;case 36289:case 36303:case 36311:case 36292:return wg}}function Tg(s,e){s.uniform1fv(this.addr,e)}function Ag(s,e){const t=Ss(e,this.size,2);s.uniform2fv(this.addr,t)}function Rg(s,e){const t=Ss(e,this.size,3);s.uniform3fv(this.addr,t)}function Cg(s,e){const t=Ss(e,this.size,4);s.uniform4fv(this.addr,t)}function Pg(s,e){const t=Ss(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Lg(s,e){const t=Ss(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Ig(s,e){const t=Ss(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Dg(s,e){s.uniform1iv(this.addr,e)}function Ug(s,e){s.uniform2iv(this.addr,e)}function Ng(s,e){s.uniform3iv(this.addr,e)}function Fg(s,e){s.uniform4iv(this.addr,e)}function Og(s,e){s.uniform1uiv(this.addr,e)}function kg(s,e){s.uniform2uiv(this.addr,e)}function Bg(s,e){s.uniform3uiv(this.addr,e)}function zg(s,e){s.uniform4uiv(this.addr,e)}function Gg(s,e,t){const n=this.cache,i=e.length,r=Ma(t,i);Lt(n,r)||(s.uniform1iv(this.addr,r),It(n,r));for(let a=0;a!==i;++a)t.setTexture2D(e[a]||Ku,r[a])}function Hg(s,e,t){const n=this.cache,i=e.length,r=Ma(t,i);Lt(n,r)||(s.uniform1iv(this.addr,r),It(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Zu,r[a])}function Vg(s,e,t){const n=this.cache,i=e.length,r=Ma(t,i);Lt(n,r)||(s.uniform1iv(this.addr,r),It(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Qu,r[a])}function Wg(s,e,t){const n=this.cache,i=e.length,r=Ma(t,i);Lt(n,r)||(s.uniform1iv(this.addr,r),It(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||Ju,r[a])}function jg(s){switch(s){case 5126:return Tg;case 35664:return Ag;case 35665:return Rg;case 35666:return Cg;case 35674:return Pg;case 35675:return Lg;case 35676:return Ig;case 5124:case 35670:return Dg;case 35667:case 35671:return Ug;case 35668:case 35672:return Ng;case 35669:case 35673:return Fg;case 5125:return Og;case 36294:return kg;case 36295:return Bg;case 36296:return zg;case 35678:case 36198:case 36298:case 36306:case 35682:return Gg;case 35679:case 36299:case 36307:return Hg;case 35680:case 36300:case 36308:case 36293:return Vg;case 36289:case 36303:case 36311:case 36292:return Wg}}class Xg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Eg(t.type)}}class qg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=jg(t.type)}}class Yg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const ao=/(\w+)(\])?(\[|\.)?/g;function Zl(s,e){s.seq.push(e),s.map[e.id]=e}function Kg(s,e,t){const n=s.name,i=n.length;for(ao.lastIndex=0;;){const r=ao.exec(n),a=ao.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===i){Zl(t,l===void 0?new Xg(o,s,e):new qg(o,s,e));break}else{let u=t.map[o];u===void 0&&(u=new Yg(o),Zl(t,u)),t=u}}}class ca{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=e.getActiveUniform(t,i),a=e.getUniformLocation(t,r.name);Kg(r,a,this)}}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function Ql(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const Jg=37297;let Zg=0;function Qg(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const $l=new Xe;function $g(s){$e._getMatrix($l,$e.workingColorSpace,s);const e=`mat3( ${$l.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(s)){case va:return[e,"LinearTransferOETF"];case ht:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function eh(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),i=s.getShaderInfoLog(e).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const a=parseInt(r[1]);return t.toUpperCase()+`

`+i+`

`+Qg(s.getShaderSource(e),a)}else return i}function eb(s,e){const t=$g(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function tb(s,e){let t;switch(e){case vu:t="Linear";break;case yu:t="Reinhard";break;case Mu:t="Cineon";break;case Ec:t="ACESFilmic";break;case Su:t="AgX";break;case wu:t="Neutral";break;case sf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Br=new C;function nb(){$e.getLuminanceCoefficients(Br);const s=Br.x.toFixed(4),e=Br.y.toFixed(4),t=Br.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function ib(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Xs).join(`
`)}function sb(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function rb(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function Xs(s){return s!==""}function th(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function nh(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const ab=/^[ \t]*#include +<([\w\d./]+)>/gm;function fc(s){return s.replace(ab,cb)}const ob=new Map;function cb(s,e){let t=Ke[e];if(t===void 0){const n=ob.get(e);if(n!==void 0)t=Ke[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return fc(t)}const lb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ih(s){return s.replace(lb,hb)}function hb(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function sh(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}function ub(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===_u?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===xu?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Wn&&(e="SHADOWMAP_TYPE_VSM"),e}function db(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case ls:case hs:e="ENVMAP_TYPE_CUBE";break;case _a:e="ENVMAP_TYPE_CUBE_UV";break}return e}function fb(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case hs:e="ENVMAP_MODE_REFRACTION";break}return e}function pb(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case ba:e="ENVMAP_BLENDING_MULTIPLY";break;case tf:e="ENVMAP_BLENDING_MIX";break;case nf:e="ENVMAP_BLENDING_ADD";break}return e}function mb(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function gb(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=ub(t),l=db(t),h=fb(t),u=pb(t),d=mb(t),f=ib(t),b=sb(r),g=i.createProgram();let p,m,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,b].filter(Xs).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,b].filter(Xs).join(`
`),m.length>0&&(m+=`
`)):(p=[sh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,b,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Xs).join(`
`),m=[sh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,b,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==fi?"#define TONE_MAPPING":"",t.toneMapping!==fi?Ke.tonemapping_pars_fragment:"",t.toneMapping!==fi?tb("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,eb("linearToOutputTexel",t.outputColorSpace),nb(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Xs).join(`
`)),a=fc(a),a=th(a,t),a=nh(a,t),o=fc(o),o=th(o,t),o=nh(o,t),a=ih(a),o=ih(o),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===bl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===bl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const v=x+p+a,_=x+m+o,R=Ql(i,i.VERTEX_SHADER,v),S=Ql(i,i.FRAGMENT_SHADER,_);i.attachShader(g,R),i.attachShader(g,S),t.index0AttributeName!==void 0?i.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function A(L){if(s.debug.checkShaderErrors){const D=i.getProgramInfoLog(g).trim(),U=i.getShaderInfoLog(R).trim(),F=i.getShaderInfoLog(S).trim();let W=!0,B=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(W=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,g,R,S);else{const $=eh(i,R,"vertex"),V=eh(i,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+D+`
`+$+`
`+V)}else D!==""?console.warn("THREE.WebGLProgram: Program Info Log:",D):(U===""||F==="")&&(B=!1);B&&(L.diagnostics={runnable:W,programLog:D,vertexShader:{log:U,prefix:p},fragmentShader:{log:F,prefix:m}})}i.deleteShader(R),i.deleteShader(S),E=new ca(i,g),M=rb(i,g)}let E;this.getUniforms=function(){return E===void 0&&A(this),E};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=i.getProgramParameter(g,Jg)),y},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Zg++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=R,this.fragmentShader=S,this}let bb=0;class _b{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new xb(e),t.set(e,n)),n}}class xb{constructor(e){this.id=bb++,this.code=e,this.usedTimes=0}}function vb(s,e,t,n,i,r,a){const o=new Uc,c=new _b,l=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures;let f=i.precision;const b={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(M){return l.add(M),M===0?"uv":`uv${M}`}function p(M,y,L,D,U){const F=D.fog,W=U.geometry,B=M.isMeshStandardMaterial?D.environment:null,$=(M.isMeshStandardMaterial?t:e).get(M.envMap||B),V=$&&$.mapping===_a?$.image.height:null,se=b[M.type];M.precision!==null&&(f=i.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const oe=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,pe=oe!==void 0?oe.length:0;let Ie=0;W.morphAttributes.position!==void 0&&(Ie=1),W.morphAttributes.normal!==void 0&&(Ie=2),W.morphAttributes.color!==void 0&&(Ie=3);let qe,q,re,we;if(se){const lt=Rn[se];qe=lt.vertexShader,q=lt.fragmentShader}else qe=M.vertexShader,q=M.fragmentShader,c.update(M),re=c.getVertexShaderID(M),we=c.getFragmentShaderID(M);const ce=s.getRenderTarget(),De=s.state.buffers.depth.getReversed(),Ge=U.isInstancedMesh===!0,ke=U.isBatchedMesh===!0,nt=!!M.map,Q=!!M.matcap,ie=!!$,I=!!M.aoMap,Ce=!!M.lightMap,te=!!M.bumpMap,ve=!!M.normalMap,le=!!M.displacementMap,Fe=!!M.emissiveMap,_e=!!M.metalnessMap,P=!!M.roughnessMap,w=M.anisotropy>0,z=M.clearcoat>0,Y=M.dispersion>0,ee=M.iridescence>0,K=M.sheen>0,Ee=M.transmission>0,de=w&&!!M.anisotropyMap,xe=z&&!!M.clearcoatMap,Qe=z&&!!M.clearcoatNormalMap,ne=z&&!!M.clearcoatRoughnessMap,Me=ee&&!!M.iridescenceMap,Oe=ee&&!!M.iridescenceThicknessMap,Be=K&&!!M.sheenColorMap,Se=K&&!!M.sheenRoughnessMap,et=!!M.specularMap,Ye=!!M.specularColorMap,pt=!!M.specularIntensityMap,N=Ee&&!!M.transmissionMap,fe=Ee&&!!M.thicknessMap,j=!!M.gradientMap,Z=!!M.alphaMap,be=M.alphaTest>0,me=!!M.alphaHash,We=!!M.extensions;let St=fi;M.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(St=s.toneMapping);const Ot={shaderID:se,shaderType:M.type,shaderName:M.name,vertexShader:qe,fragmentShader:q,defines:M.defines,customVertexShaderID:re,customFragmentShaderID:we,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:ke,batchingColor:ke&&U._colorsTexture!==null,instancing:Ge,instancingColor:Ge&&U.instanceColor!==null,instancingMorph:Ge&&U.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ce===null?s.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:Gt,alphaToCoverage:!!M.alphaToCoverage,map:nt,matcap:Q,envMap:ie,envMapMode:ie&&$.mapping,envMapCubeUVHeight:V,aoMap:I,lightMap:Ce,bumpMap:te,normalMap:ve,displacementMap:d&&le,emissiveMap:Fe,normalMapObjectSpace:ve&&M.normalMapType===hf,normalMapTangentSpace:ve&&M.normalMapType===xa,metalnessMap:_e,roughnessMap:P,anisotropy:w,anisotropyMap:de,clearcoat:z,clearcoatMap:xe,clearcoatNormalMap:Qe,clearcoatRoughnessMap:ne,dispersion:Y,iridescence:ee,iridescenceMap:Me,iridescenceThicknessMap:Oe,sheen:K,sheenColorMap:Be,sheenRoughnessMap:Se,specularMap:et,specularColorMap:Ye,specularIntensityMap:pt,transmission:Ee,transmissionMap:N,thicknessMap:fe,gradientMap:j,opaque:M.transparent===!1&&M.blending===is&&M.alphaToCoverage===!1,alphaMap:Z,alphaTest:be,alphaHash:me,combine:M.combine,mapUv:nt&&g(M.map.channel),aoMapUv:I&&g(M.aoMap.channel),lightMapUv:Ce&&g(M.lightMap.channel),bumpMapUv:te&&g(M.bumpMap.channel),normalMapUv:ve&&g(M.normalMap.channel),displacementMapUv:le&&g(M.displacementMap.channel),emissiveMapUv:Fe&&g(M.emissiveMap.channel),metalnessMapUv:_e&&g(M.metalnessMap.channel),roughnessMapUv:P&&g(M.roughnessMap.channel),anisotropyMapUv:de&&g(M.anisotropyMap.channel),clearcoatMapUv:xe&&g(M.clearcoatMap.channel),clearcoatNormalMapUv:Qe&&g(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ne&&g(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Me&&g(M.iridescenceMap.channel),iridescenceThicknessMapUv:Oe&&g(M.iridescenceThicknessMap.channel),sheenColorMapUv:Be&&g(M.sheenColorMap.channel),sheenRoughnessMapUv:Se&&g(M.sheenRoughnessMap.channel),specularMapUv:et&&g(M.specularMap.channel),specularColorMapUv:Ye&&g(M.specularColorMap.channel),specularIntensityMapUv:pt&&g(M.specularIntensityMap.channel),transmissionMapUv:N&&g(M.transmissionMap.channel),thicknessMapUv:fe&&g(M.thicknessMap.channel),alphaMapUv:Z&&g(M.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(ve||w),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!W.attributes.uv&&(nt||Z),fog:!!F,useFog:M.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:De,skinning:U.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:pe,morphTextureStride:Ie,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:St,decodeVideoTexture:nt&&M.map.isVideoTexture===!0&&$e.getTransfer(M.map.colorSpace)===ht,decodeVideoTextureEmissive:Fe&&M.emissiveMap.isVideoTexture===!0&&$e.getTransfer(M.emissiveMap.colorSpace)===ht,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Ct,flipSided:M.side===qt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:We&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(We&&M.extensions.multiDraw===!0||ke)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Ot.vertexUv1s=l.has(1),Ot.vertexUv2s=l.has(2),Ot.vertexUv3s=l.has(3),l.clear(),Ot}function m(M){const y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(const L in M.defines)y.push(L),y.push(M.defines[L]);return M.isRawShaderMaterial===!1&&(x(y,M),v(y,M),y.push(s.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function x(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function v(M,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),M.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reverseDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),M.push(o.mask)}function _(M){const y=b[M.type];let L;if(y){const D=Rn[y];L=ar.clone(D.uniforms)}else L=M.uniforms;return L}function R(M,y){let L;for(let D=0,U=h.length;D<U;D++){const F=h[D];if(F.cacheKey===y){L=F,++L.usedTimes;break}}return L===void 0&&(L=new gb(s,y,M,r),h.push(L)),L}function S(M){if(--M.usedTimes===0){const y=h.indexOf(M);h[y]=h[h.length-1],h.pop(),M.destroy()}}function A(M){c.remove(M)}function E(){c.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:_,acquireProgram:R,releaseProgram:S,releaseShaderCache:A,programs:h,dispose:E}}function yb(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,c){s.get(a)[o]=c}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function Mb(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function rh(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function ah(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(u,d,f,b,g,p){let m=s[e];return m===void 0?(m={id:u.id,object:u,geometry:d,material:f,groupOrder:b,renderOrder:u.renderOrder,z:g,group:p},s[e]=m):(m.id=u.id,m.object=u,m.geometry=d,m.material=f,m.groupOrder=b,m.renderOrder=u.renderOrder,m.z=g,m.group=p),e++,m}function o(u,d,f,b,g,p){const m=a(u,d,f,b,g,p);f.transmission>0?n.push(m):f.transparent===!0?i.push(m):t.push(m)}function c(u,d,f,b,g,p){const m=a(u,d,f,b,g,p);f.transmission>0?n.unshift(m):f.transparent===!0?i.unshift(m):t.unshift(m)}function l(u,d){t.length>1&&t.sort(u||Mb),n.length>1&&n.sort(d||rh),i.length>1&&i.sort(d||rh)}function h(){for(let u=e,d=s.length;u<d;u++){const f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:o,unshift:c,finish:h,sort:l}}function Sb(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new ah,s.set(n,[a])):i>=r.length?(a=new ah,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function wb(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new he};break;case"SpotLight":t={position:new C,direction:new C,color:new he,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new he,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new he,groundColor:new he};break;case"RectAreaLight":t={color:new he,position:new C,halfWidth:new C,halfHeight:new C};break}return s[e.id]=t,t}}}function Eb(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Tb=0;function Ab(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Rb(s){const e=new wb,t=Eb(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new C);const i=new C,r=new ze,a=new ze;function o(l){let h=0,u=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let f=0,b=0,g=0,p=0,m=0,x=0,v=0,_=0,R=0,S=0,A=0;l.sort(Ab);for(let M=0,y=l.length;M<y;M++){const L=l[M],D=L.color,U=L.intensity,F=L.distance,W=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=D.r*U,u+=D.g*U,d+=D.b*U;else if(L.isLightProbe){for(let B=0;B<9;B++)n.probe[B].addScaledVector(L.sh.coefficients[B],U);A++}else if(L.isDirectionalLight){const B=e.get(L);if(B.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const $=L.shadow,V=t.get(L);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.directionalShadow[f]=V,n.directionalShadowMap[f]=W,n.directionalShadowMatrix[f]=L.shadow.matrix,x++}n.directional[f]=B,f++}else if(L.isSpotLight){const B=e.get(L);B.position.setFromMatrixPosition(L.matrixWorld),B.color.copy(D).multiplyScalar(U),B.distance=F,B.coneCos=Math.cos(L.angle),B.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),B.decay=L.decay,n.spot[g]=B;const $=L.shadow;if(L.map&&(n.spotLightMap[R]=L.map,R++,$.updateMatrices(L),L.castShadow&&S++),n.spotLightMatrix[g]=$.matrix,L.castShadow){const V=t.get(L);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,n.spotShadow[g]=V,n.spotShadowMap[g]=W,_++}g++}else if(L.isRectAreaLight){const B=e.get(L);B.color.copy(D).multiplyScalar(U),B.halfWidth.set(L.width*.5,0,0),B.halfHeight.set(0,L.height*.5,0),n.rectArea[p]=B,p++}else if(L.isPointLight){const B=e.get(L);if(B.color.copy(L.color).multiplyScalar(L.intensity),B.distance=L.distance,B.decay=L.decay,L.castShadow){const $=L.shadow,V=t.get(L);V.shadowIntensity=$.intensity,V.shadowBias=$.bias,V.shadowNormalBias=$.normalBias,V.shadowRadius=$.radius,V.shadowMapSize=$.mapSize,V.shadowCameraNear=$.camera.near,V.shadowCameraFar=$.camera.far,n.pointShadow[b]=V,n.pointShadowMap[b]=W,n.pointShadowMatrix[b]=L.shadow.matrix,v++}n.point[b]=B,b++}else if(L.isHemisphereLight){const B=e.get(L);B.skyColor.copy(L.color).multiplyScalar(U),B.groundColor.copy(L.groundColor).multiplyScalar(U),n.hemi[m]=B,m++}}p>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ue.LTC_FLOAT_1,n.rectAreaLTC2=ue.LTC_FLOAT_2):(n.rectAreaLTC1=ue.LTC_HALF_1,n.rectAreaLTC2=ue.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const E=n.hash;(E.directionalLength!==f||E.pointLength!==b||E.spotLength!==g||E.rectAreaLength!==p||E.hemiLength!==m||E.numDirectionalShadows!==x||E.numPointShadows!==v||E.numSpotShadows!==_||E.numSpotMaps!==R||E.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=g,n.rectArea.length=p,n.point.length=b,n.hemi.length=m,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=_+R-S,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=A,E.directionalLength=f,E.pointLength=b,E.spotLength=g,E.rectAreaLength=p,E.hemiLength=m,E.numDirectionalShadows=x,E.numPointShadows=v,E.numSpotShadows=_,E.numSpotMaps=R,E.numLightProbes=A,n.version=Tb++)}function c(l,h){let u=0,d=0,f=0,b=0,g=0;const p=h.matrixWorldInverse;for(let m=0,x=l.length;m<x;m++){const v=l[m];if(v.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(p),u++}else if(v.isSpotLight){const _=n.spot[f];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(p),_.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),_.direction.sub(i),_.direction.transformDirection(p),f++}else if(v.isRectAreaLight){const _=n.rectArea[b];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(p),a.identity(),r.copy(v.matrixWorld),r.premultiply(p),a.extractRotation(r),_.halfWidth.set(v.width*.5,0,0),_.halfHeight.set(0,v.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),b++}else if(v.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(v.matrixWorld),_.position.applyMatrix4(p),d++}else if(v.isHemisphereLight){const _=n.hemi[g];_.direction.setFromMatrixPosition(v.matrixWorld),_.direction.transformDirection(p),g++}}}return{setup:o,setupView:c,state:n}}function oh(s){const e=new Rb(s),t=[],n=[];function i(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Cb(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new oh(s),e.set(i,[o])):r>=a.length?(o=new oh(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class Pb extends an{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=cf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Lb extends an{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Ib=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Db=`uniform sampler2D shadow_pass;
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
}`;function Ub(s,e,t){let n=new Nc;const i=new J,r=new J,a=new rt,o=new Pb({depthPacking:lf}),c=new Lb,l={},h=t.maxTextureSize,u={[Qn]:qt,[qt]:Qn,[Ct]:Ct},d=new Xt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new J},radius:{value:4}},vertexShader:Ib,fragmentShader:Db}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const b=new bt;b.setAttribute("position",new Mt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new X(b,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=_u;let m=this.type;this.render=function(S,A,E){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||S.length===0)return;const M=s.getRenderTarget(),y=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),D=s.state;D.setBlending(Yn),D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const U=m!==Wn&&this.type===Wn,F=m===Wn&&this.type!==Wn;for(let W=0,B=S.length;W<B;W++){const $=S[W],V=$.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;i.copy(V.mapSize);const se=V.getFrameExtents();if(i.multiply(se),r.copy(V.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/se.x),i.x=r.x*se.x,V.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/se.y),i.y=r.y*se.y,V.mapSize.y=r.y)),V.map===null||U===!0||F===!0){const pe=this.type!==Wn?{minFilter:Yt,magFilter:Yt}:{};V.map!==null&&V.map.dispose(),V.map=new gn(i.x,i.y,pe),V.map.texture.name=$.name+".shadowMap",V.camera.updateProjectionMatrix()}s.setRenderTarget(V.map),s.clear();const oe=V.getViewportCount();for(let pe=0;pe<oe;pe++){const Ie=V.getViewport(pe);a.set(r.x*Ie.x,r.y*Ie.y,r.x*Ie.z,r.y*Ie.w),D.viewport(a),V.updateMatrices($,pe),n=V.getFrustum(),_(A,E,V.camera,$,this.type)}V.isPointLightShadow!==!0&&this.type===Wn&&x(V,E),V.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(M,y,L)};function x(S,A){const E=e.update(g);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new gn(i.x,i.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,s.setRenderTarget(S.mapPass),s.clear(),s.renderBufferDirect(A,null,E,d,g,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,s.setRenderTarget(S.map),s.clear(),s.renderBufferDirect(A,null,E,f,g,null)}function v(S,A,E,M){let y=null;const L=E.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(L!==void 0)y=L;else if(y=E.isPointLight===!0?c:o,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const D=y.uuid,U=A.uuid;let F=l[D];F===void 0&&(F={},l[D]=F);let W=F[U];W===void 0&&(W=y.clone(),F[U]=W,A.addEventListener("dispose",R)),y=W}if(y.visible=A.visible,y.wireframe=A.wireframe,M===Wn?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:u[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,E.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const D=s.properties.get(y);D.light=E}return y}function _(S,A,E,M,y){if(S.visible===!1)return;if(S.layers.test(A.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&y===Wn)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,S.matrixWorld);const U=e.update(S),F=S.material;if(Array.isArray(F)){const W=U.groups;for(let B=0,$=W.length;B<$;B++){const V=W[B],se=F[V.materialIndex];if(se&&se.visible){const oe=v(S,se,M,y);S.onBeforeShadow(s,S,A,E,U,oe,V),s.renderBufferDirect(E,null,U,oe,S,V),S.onAfterShadow(s,S,A,E,U,oe,V)}}}else if(F.visible){const W=v(S,F,M,y);S.onBeforeShadow(s,S,A,E,U,W,null),s.renderBufferDirect(E,null,U,W,S,null),S.onAfterShadow(s,S,A,E,U,W,null)}}const D=S.children;for(let U=0,F=D.length;U<F;U++)_(D[U],A,E,M,y)}function R(S){S.target.removeEventListener("dispose",R);for(const E in l){const M=l[E],y=S.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}const Nb={[Co]:Po,[Lo]:Uo,[Io]:No,[cs]:Do,[Po]:Co,[Uo]:Lo,[No]:Io,[Do]:cs};function Fb(s,e){function t(){let N=!1;const fe=new rt;let j=null;const Z=new rt(0,0,0,0);return{setMask:function(be){j!==be&&!N&&(s.colorMask(be,be,be,be),j=be)},setLocked:function(be){N=be},setClear:function(be,me,We,St,Ot){Ot===!0&&(be*=St,me*=St,We*=St),fe.set(be,me,We,St),Z.equals(fe)===!1&&(s.clearColor(be,me,We,St),Z.copy(fe))},reset:function(){N=!1,j=null,Z.set(-1,0,0,0)}}}function n(){let N=!1,fe=!1,j=null,Z=null,be=null;return{setReversed:function(me){if(fe!==me){const We=e.get("EXT_clip_control");fe?We.clipControlEXT(We.LOWER_LEFT_EXT,We.ZERO_TO_ONE_EXT):We.clipControlEXT(We.LOWER_LEFT_EXT,We.NEGATIVE_ONE_TO_ONE_EXT);const St=be;be=null,this.setClear(St)}fe=me},getReversed:function(){return fe},setTest:function(me){me?ce(s.DEPTH_TEST):De(s.DEPTH_TEST)},setMask:function(me){j!==me&&!N&&(s.depthMask(me),j=me)},setFunc:function(me){if(fe&&(me=Nb[me]),Z!==me){switch(me){case Co:s.depthFunc(s.NEVER);break;case Po:s.depthFunc(s.ALWAYS);break;case Lo:s.depthFunc(s.LESS);break;case cs:s.depthFunc(s.LEQUAL);break;case Io:s.depthFunc(s.EQUAL);break;case Do:s.depthFunc(s.GEQUAL);break;case Uo:s.depthFunc(s.GREATER);break;case No:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}Z=me}},setLocked:function(me){N=me},setClear:function(me){be!==me&&(fe&&(me=1-me),s.clearDepth(me),be=me)},reset:function(){N=!1,j=null,Z=null,be=null,fe=!1}}}function i(){let N=!1,fe=null,j=null,Z=null,be=null,me=null,We=null,St=null,Ot=null;return{setTest:function(lt){N||(lt?ce(s.STENCIL_TEST):De(s.STENCIL_TEST))},setMask:function(lt){fe!==lt&&!N&&(s.stencilMask(lt),fe=lt)},setFunc:function(lt,bn,Fn){(j!==lt||Z!==bn||be!==Fn)&&(s.stencilFunc(lt,bn,Fn),j=lt,Z=bn,be=Fn)},setOp:function(lt,bn,Fn){(me!==lt||We!==bn||St!==Fn)&&(s.stencilOp(lt,bn,Fn),me=lt,We=bn,St=Fn)},setLocked:function(lt){N=lt},setClear:function(lt){Ot!==lt&&(s.clearStencil(lt),Ot=lt)},reset:function(){N=!1,fe=null,j=null,Z=null,be=null,me=null,We=null,St=null,Ot=null}}}const r=new t,a=new n,o=new i,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],b=null,g=!1,p=null,m=null,x=null,v=null,_=null,R=null,S=null,A=new he(0,0,0),E=0,M=!1,y=null,L=null,D=null,U=null,F=null;const W=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,$=0;const V=s.getParameter(s.VERSION);V.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(V)[1]),B=$>=1):V.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),B=$>=2);let se=null,oe={};const pe=s.getParameter(s.SCISSOR_BOX),Ie=s.getParameter(s.VIEWPORT),qe=new rt().fromArray(pe),q=new rt().fromArray(Ie);function re(N,fe,j,Z){const be=new Uint8Array(4),me=s.createTexture();s.bindTexture(N,me),s.texParameteri(N,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(N,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let We=0;We<j;We++)N===s.TEXTURE_3D||N===s.TEXTURE_2D_ARRAY?s.texImage3D(fe,0,s.RGBA,1,1,Z,0,s.RGBA,s.UNSIGNED_BYTE,be):s.texImage2D(fe+We,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,be);return me}const we={};we[s.TEXTURE_2D]=re(s.TEXTURE_2D,s.TEXTURE_2D,1),we[s.TEXTURE_CUBE_MAP]=re(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),we[s.TEXTURE_2D_ARRAY]=re(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),we[s.TEXTURE_3D]=re(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ce(s.DEPTH_TEST),a.setFunc(cs),te(!1),ve(ll),ce(s.CULL_FACE),I(Yn);function ce(N){h[N]!==!0&&(s.enable(N),h[N]=!0)}function De(N){h[N]!==!1&&(s.disable(N),h[N]=!1)}function Ge(N,fe){return u[N]!==fe?(s.bindFramebuffer(N,fe),u[N]=fe,N===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=fe),N===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=fe),!0):!1}function ke(N,fe){let j=f,Z=!1;if(N){j=d.get(fe),j===void 0&&(j=[],d.set(fe,j));const be=N.textures;if(j.length!==be.length||j[0]!==s.COLOR_ATTACHMENT0){for(let me=0,We=be.length;me<We;me++)j[me]=s.COLOR_ATTACHMENT0+me;j.length=be.length,Z=!0}}else j[0]!==s.BACK&&(j[0]=s.BACK,Z=!0);Z&&s.drawBuffers(j)}function nt(N){return b!==N?(s.useProgram(N),b=N,!0):!1}const Q={[Ti]:s.FUNC_ADD,[kd]:s.FUNC_SUBTRACT,[Bd]:s.FUNC_REVERSE_SUBTRACT};Q[zd]=s.MIN,Q[Gd]=s.MAX;const ie={[Hd]:s.ZERO,[Vd]:s.ONE,[Wd]:s.SRC_COLOR,[Ao]:s.SRC_ALPHA,[Jd]:s.SRC_ALPHA_SATURATE,[Yd]:s.DST_COLOR,[Xd]:s.DST_ALPHA,[jd]:s.ONE_MINUS_SRC_COLOR,[Ro]:s.ONE_MINUS_SRC_ALPHA,[Kd]:s.ONE_MINUS_DST_COLOR,[qd]:s.ONE_MINUS_DST_ALPHA,[Zd]:s.CONSTANT_COLOR,[Qd]:s.ONE_MINUS_CONSTANT_COLOR,[$d]:s.CONSTANT_ALPHA,[ef]:s.ONE_MINUS_CONSTANT_ALPHA};function I(N,fe,j,Z,be,me,We,St,Ot,lt){if(N===Yn){g===!0&&(De(s.BLEND),g=!1);return}if(g===!1&&(ce(s.BLEND),g=!0),N!==Od){if(N!==p||lt!==M){if((m!==Ti||_!==Ti)&&(s.blendEquation(s.FUNC_ADD),m=Ti,_=Ti),lt)switch(N){case is:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case os:s.blendFunc(s.ONE,s.ONE);break;case hl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ul:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case is:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case os:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case hl:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ul:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}x=null,v=null,R=null,S=null,A.set(0,0,0),E=0,p=N,M=lt}return}be=be||fe,me=me||j,We=We||Z,(fe!==m||be!==_)&&(s.blendEquationSeparate(Q[fe],Q[be]),m=fe,_=be),(j!==x||Z!==v||me!==R||We!==S)&&(s.blendFuncSeparate(ie[j],ie[Z],ie[me],ie[We]),x=j,v=Z,R=me,S=We),(St.equals(A)===!1||Ot!==E)&&(s.blendColor(St.r,St.g,St.b,Ot),A.copy(St),E=Ot),p=N,M=!1}function Ce(N,fe){N.side===Ct?De(s.CULL_FACE):ce(s.CULL_FACE);let j=N.side===qt;fe&&(j=!j),te(j),N.blending===is&&N.transparent===!1?I(Yn):I(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);const Z=N.stencilWrite;o.setTest(Z),Z&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Fe(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ce(s.SAMPLE_ALPHA_TO_COVERAGE):De(s.SAMPLE_ALPHA_TO_COVERAGE)}function te(N){y!==N&&(N?s.frontFace(s.CW):s.frontFace(s.CCW),y=N)}function ve(N){N!==Nd?(ce(s.CULL_FACE),N!==L&&(N===ll?s.cullFace(s.BACK):N===Fd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):De(s.CULL_FACE),L=N}function le(N){N!==D&&(B&&s.lineWidth(N),D=N)}function Fe(N,fe,j){N?(ce(s.POLYGON_OFFSET_FILL),(U!==fe||F!==j)&&(s.polygonOffset(fe,j),U=fe,F=j)):De(s.POLYGON_OFFSET_FILL)}function _e(N){N?ce(s.SCISSOR_TEST):De(s.SCISSOR_TEST)}function P(N){N===void 0&&(N=s.TEXTURE0+W-1),se!==N&&(s.activeTexture(N),se=N)}function w(N,fe,j){j===void 0&&(se===null?j=s.TEXTURE0+W-1:j=se);let Z=oe[j];Z===void 0&&(Z={type:void 0,texture:void 0},oe[j]=Z),(Z.type!==N||Z.texture!==fe)&&(se!==j&&(s.activeTexture(j),se=j),s.bindTexture(N,fe||we[N]),Z.type=N,Z.texture=fe)}function z(){const N=oe[se];N!==void 0&&N.type!==void 0&&(s.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Y(){try{s.compressedTexImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ee(){try{s.compressedTexImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function K(){try{s.texSubImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ee(){try{s.texSubImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function de(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function xe(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Qe(){try{s.texStorage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ne(){try{s.texStorage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Me(){try{s.texImage2D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Oe(){try{s.texImage3D.apply(s,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Be(N){qe.equals(N)===!1&&(s.scissor(N.x,N.y,N.z,N.w),qe.copy(N))}function Se(N){q.equals(N)===!1&&(s.viewport(N.x,N.y,N.z,N.w),q.copy(N))}function et(N,fe){let j=l.get(fe);j===void 0&&(j=new WeakMap,l.set(fe,j));let Z=j.get(N);Z===void 0&&(Z=s.getUniformBlockIndex(fe,N.name),j.set(N,Z))}function Ye(N,fe){const Z=l.get(fe).get(N);c.get(fe)!==Z&&(s.uniformBlockBinding(fe,Z,N.__bindingPointIndex),c.set(fe,Z))}function pt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},se=null,oe={},u={},d=new WeakMap,f=[],b=null,g=!1,p=null,m=null,x=null,v=null,_=null,R=null,S=null,A=new he(0,0,0),E=0,M=!1,y=null,L=null,D=null,U=null,F=null,qe.set(0,0,s.canvas.width,s.canvas.height),q.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ce,disable:De,bindFramebuffer:Ge,drawBuffers:ke,useProgram:nt,setBlending:I,setMaterial:Ce,setFlipSided:te,setCullFace:ve,setLineWidth:le,setPolygonOffset:Fe,setScissorTest:_e,activeTexture:P,bindTexture:w,unbindTexture:z,compressedTexImage2D:Y,compressedTexImage3D:ee,texImage2D:Me,texImage3D:Oe,updateUBOMapping:et,uniformBlockBinding:Ye,texStorage2D:Qe,texStorage3D:ne,texSubImage2D:K,texSubImage3D:Ee,compressedTexSubImage2D:de,compressedTexSubImage3D:xe,scissor:Be,viewport:Se,reset:pt}}function ch(s,e,t,n){const i=Ob(n);switch(t){case Pu:return s*e;case Iu:return s*e;case Du:return s*e*2;case Cc:return s*e/i.components*i.byteLength;case Pc:return s*e/i.components*i.byteLength;case Uu:return s*e*2/i.components*i.byteLength;case Lc:return s*e*2/i.components*i.byteLength;case Lu:return s*e*3/i.components*i.byteLength;case pn:return s*e*4/i.components*i.byteLength;case Ic:return s*e*4/i.components*i.byteLength;case ia:case sa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ra:case aa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Bo:case Go:return Math.max(s,16)*Math.max(e,8)/4;case ko:case zo:return Math.max(s,8)*Math.max(e,8)/2;case Ho:case Vo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Wo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case jo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Xo:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case qo:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Yo:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Ko:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Jo:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Zo:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Qo:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case $o:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case ec:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case tc:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case nc:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case ic:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case sc:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case oa:case rc:case ac:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Nu:case oc:return Math.ceil(s/4)*Math.ceil(e/4)*8;case cc:case lc:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Ob(s){switch(s){case $n:case Au:return{byteLength:1,components:1};case nr:case Ru:case Qt:return{byteLength:2,components:1};case Ac:case Rc:return{byteLength:2,components:4};case Pi:case Tc:case Zt:return{byteLength:4,components:1};case Cu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function kb(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new J,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(P,w){return f?new OffscreenCanvas(P,w):rr("canvas")}function g(P,w,z){let Y=1;const ee=_e(P);if((ee.width>z||ee.height>z)&&(Y=z/Math.max(ee.width,ee.height)),Y<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const K=Math.floor(Y*ee.width),Ee=Math.floor(Y*ee.height);u===void 0&&(u=b(K,Ee));const de=w?b(K,Ee):u;return de.width=K,de.height=Ee,de.getContext("2d").drawImage(P,0,0,K,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+K+"x"+Ee+")."),de}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),P;return P}function p(P){return P.generateMipmaps}function m(P){s.generateMipmap(P)}function x(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function v(P,w,z,Y,ee=!1){if(P!==null){if(s[P]!==void 0)return s[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let K=w;if(w===s.RED&&(z===s.FLOAT&&(K=s.R32F),z===s.HALF_FLOAT&&(K=s.R16F),z===s.UNSIGNED_BYTE&&(K=s.R8)),w===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(K=s.R8UI),z===s.UNSIGNED_SHORT&&(K=s.R16UI),z===s.UNSIGNED_INT&&(K=s.R32UI),z===s.BYTE&&(K=s.R8I),z===s.SHORT&&(K=s.R16I),z===s.INT&&(K=s.R32I)),w===s.RG&&(z===s.FLOAT&&(K=s.RG32F),z===s.HALF_FLOAT&&(K=s.RG16F),z===s.UNSIGNED_BYTE&&(K=s.RG8)),w===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(K=s.RG8UI),z===s.UNSIGNED_SHORT&&(K=s.RG16UI),z===s.UNSIGNED_INT&&(K=s.RG32UI),z===s.BYTE&&(K=s.RG8I),z===s.SHORT&&(K=s.RG16I),z===s.INT&&(K=s.RG32I)),w===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(K=s.RGB8UI),z===s.UNSIGNED_SHORT&&(K=s.RGB16UI),z===s.UNSIGNED_INT&&(K=s.RGB32UI),z===s.BYTE&&(K=s.RGB8I),z===s.SHORT&&(K=s.RGB16I),z===s.INT&&(K=s.RGB32I)),w===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(K=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(K=s.RGBA16UI),z===s.UNSIGNED_INT&&(K=s.RGBA32UI),z===s.BYTE&&(K=s.RGBA8I),z===s.SHORT&&(K=s.RGBA16I),z===s.INT&&(K=s.RGBA32I)),w===s.RGB&&z===s.UNSIGNED_INT_5_9_9_9_REV&&(K=s.RGB9_E5),w===s.RGBA){const Ee=ee?va:$e.getTransfer(Y);z===s.FLOAT&&(K=s.RGBA32F),z===s.HALF_FLOAT&&(K=s.RGBA16F),z===s.UNSIGNED_BYTE&&(K=Ee===ht?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT_4_4_4_4&&(K=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(K=s.RGB5_A1)}return(K===s.R16F||K===s.R32F||K===s.RG16F||K===s.RG32F||K===s.RGBA16F||K===s.RGBA32F)&&e.get("EXT_color_buffer_float"),K}function _(P,w){let z;return P?w===null||w===Pi||w===us?z=s.DEPTH24_STENCIL8:w===Zt?z=s.DEPTH32F_STENCIL8:w===nr&&(z=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Pi||w===us?z=s.DEPTH_COMPONENT24:w===Zt?z=s.DEPTH_COMPONENT32F:w===nr&&(z=s.DEPTH_COMPONENT16),z}function R(P,w){return p(P)===!0||P.isFramebufferTexture&&P.minFilter!==Yt&&P.minFilter!==Nt?Math.log2(Math.max(w.width,w.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?w.mipmaps.length:1}function S(P){const w=P.target;w.removeEventListener("dispose",S),E(w),w.isVideoTexture&&h.delete(w)}function A(P){const w=P.target;w.removeEventListener("dispose",A),y(w)}function E(P){const w=n.get(P);if(w.__webglInit===void 0)return;const z=P.source,Y=d.get(z);if(Y){const ee=Y[w.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&M(P),Object.keys(Y).length===0&&d.delete(z)}n.remove(P)}function M(P){const w=n.get(P);s.deleteTexture(w.__webglTexture);const z=P.source,Y=d.get(z);delete Y[w.__cacheKey],a.memory.textures--}function y(P){const w=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(w.__webglFramebuffer[Y]))for(let ee=0;ee<w.__webglFramebuffer[Y].length;ee++)s.deleteFramebuffer(w.__webglFramebuffer[Y][ee]);else s.deleteFramebuffer(w.__webglFramebuffer[Y]);w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer[Y])}else{if(Array.isArray(w.__webglFramebuffer))for(let Y=0;Y<w.__webglFramebuffer.length;Y++)s.deleteFramebuffer(w.__webglFramebuffer[Y]);else s.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&s.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let Y=0;Y<w.__webglColorRenderbuffer.length;Y++)w.__webglColorRenderbuffer[Y]&&s.deleteRenderbuffer(w.__webglColorRenderbuffer[Y]);w.__webglDepthRenderbuffer&&s.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const z=P.textures;for(let Y=0,ee=z.length;Y<ee;Y++){const K=n.get(z[Y]);K.__webglTexture&&(s.deleteTexture(K.__webglTexture),a.memory.textures--),n.remove(z[Y])}n.remove(P)}let L=0;function D(){L=0}function U(){const P=L;return P>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+i.maxTextures),L+=1,P}function F(P){const w=[];return w.push(P.wrapS),w.push(P.wrapT),w.push(P.wrapR||0),w.push(P.magFilter),w.push(P.minFilter),w.push(P.anisotropy),w.push(P.internalFormat),w.push(P.format),w.push(P.type),w.push(P.generateMipmaps),w.push(P.premultiplyAlpha),w.push(P.flipY),w.push(P.unpackAlignment),w.push(P.colorSpace),w.join()}function W(P,w){const z=n.get(P);if(P.isVideoTexture&&le(P),P.isRenderTargetTexture===!1&&P.version>0&&z.__version!==P.version){const Y=P.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(z,P,w);return}}t.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+w)}function B(P,w){const z=n.get(P);if(P.version>0&&z.__version!==P.version){q(z,P,w);return}t.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+w)}function $(P,w){const z=n.get(P);if(P.version>0&&z.__version!==P.version){q(z,P,w);return}t.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+w)}function V(P,w){const z=n.get(P);if(P.version>0&&z.__version!==P.version){re(z,P,w);return}t.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+w)}const se={[Pn]:s.REPEAT,[Cn]:s.CLAMP_TO_EDGE,[ua]:s.MIRRORED_REPEAT},oe={[Yt]:s.NEAREST,[Tu]:s.NEAREST_MIPMAP_NEAREST,[Ws]:s.NEAREST_MIPMAP_LINEAR,[Nt]:s.LINEAR,[na]:s.LINEAR_MIPMAP_NEAREST,[wn]:s.LINEAR_MIPMAP_LINEAR},pe={[uf]:s.NEVER,[bf]:s.ALWAYS,[df]:s.LESS,[Ou]:s.LEQUAL,[ff]:s.EQUAL,[gf]:s.GEQUAL,[pf]:s.GREATER,[mf]:s.NOTEQUAL};function Ie(P,w){if(w.type===Zt&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===Nt||w.magFilter===na||w.magFilter===Ws||w.magFilter===wn||w.minFilter===Nt||w.minFilter===na||w.minFilter===Ws||w.minFilter===wn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,se[w.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,se[w.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,se[w.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,oe[w.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,oe[w.minFilter]),w.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,pe[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Yt||w.minFilter!==Ws&&w.minFilter!==wn||w.type===Zt&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");s.texParameterf(P,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,i.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function qe(P,w){let z=!1;P.__webglInit===void 0&&(P.__webglInit=!0,w.addEventListener("dispose",S));const Y=w.source;let ee=d.get(Y);ee===void 0&&(ee={},d.set(Y,ee));const K=F(w);if(K!==P.__cacheKey){ee[K]===void 0&&(ee[K]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,z=!0),ee[K].usedTimes++;const Ee=ee[P.__cacheKey];Ee!==void 0&&(ee[P.__cacheKey].usedTimes--,Ee.usedTimes===0&&M(w)),P.__cacheKey=K,P.__webglTexture=ee[K].texture}return z}function q(P,w,z){let Y=s.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(Y=s.TEXTURE_2D_ARRAY),w.isData3DTexture&&(Y=s.TEXTURE_3D);const ee=qe(P,w),K=w.source;t.bindTexture(Y,P.__webglTexture,s.TEXTURE0+z);const Ee=n.get(K);if(K.version!==Ee.__version||ee===!0){t.activeTexture(s.TEXTURE0+z);const de=$e.getPrimaries($e.workingColorSpace),xe=w.colorSpace===hi?null:$e.getPrimaries(w.colorSpace),Qe=w.colorSpace===hi||de===xe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Qe);let ne=g(w.image,!1,i.maxTextureSize);ne=Fe(w,ne);const Me=r.convert(w.format,w.colorSpace),Oe=r.convert(w.type);let Be=v(w.internalFormat,Me,Oe,w.colorSpace,w.isVideoTexture);Ie(Y,w);let Se;const et=w.mipmaps,Ye=w.isVideoTexture!==!0,pt=Ee.__version===void 0||ee===!0,N=K.dataReady,fe=R(w,ne);if(w.isDepthTexture)Be=_(w.format===ds,w.type),pt&&(Ye?t.texStorage2D(s.TEXTURE_2D,1,Be,ne.width,ne.height):t.texImage2D(s.TEXTURE_2D,0,Be,ne.width,ne.height,0,Me,Oe,null));else if(w.isDataTexture)if(et.length>0){Ye&&pt&&t.texStorage2D(s.TEXTURE_2D,fe,Be,et[0].width,et[0].height);for(let j=0,Z=et.length;j<Z;j++)Se=et[j],Ye?N&&t.texSubImage2D(s.TEXTURE_2D,j,0,0,Se.width,Se.height,Me,Oe,Se.data):t.texImage2D(s.TEXTURE_2D,j,Be,Se.width,Se.height,0,Me,Oe,Se.data);w.generateMipmaps=!1}else Ye?(pt&&t.texStorage2D(s.TEXTURE_2D,fe,Be,ne.width,ne.height),N&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ne.width,ne.height,Me,Oe,ne.data)):t.texImage2D(s.TEXTURE_2D,0,Be,ne.width,ne.height,0,Me,Oe,ne.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Ye&&pt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,fe,Be,et[0].width,et[0].height,ne.depth);for(let j=0,Z=et.length;j<Z;j++)if(Se=et[j],w.format!==pn)if(Me!==null)if(Ye){if(N)if(w.layerUpdates.size>0){const be=ch(Se.width,Se.height,w.format,w.type);for(const me of w.layerUpdates){const We=Se.data.subarray(me*be/Se.data.BYTES_PER_ELEMENT,(me+1)*be/Se.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,j,0,0,me,Se.width,Se.height,1,Me,We)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,j,0,0,0,Se.width,Se.height,ne.depth,Me,Se.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,j,Be,Se.width,Se.height,ne.depth,0,Se.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ye?N&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,j,0,0,0,Se.width,Se.height,ne.depth,Me,Oe,Se.data):t.texImage3D(s.TEXTURE_2D_ARRAY,j,Be,Se.width,Se.height,ne.depth,0,Me,Oe,Se.data)}else{Ye&&pt&&t.texStorage2D(s.TEXTURE_2D,fe,Be,et[0].width,et[0].height);for(let j=0,Z=et.length;j<Z;j++)Se=et[j],w.format!==pn?Me!==null?Ye?N&&t.compressedTexSubImage2D(s.TEXTURE_2D,j,0,0,Se.width,Se.height,Me,Se.data):t.compressedTexImage2D(s.TEXTURE_2D,j,Be,Se.width,Se.height,0,Se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ye?N&&t.texSubImage2D(s.TEXTURE_2D,j,0,0,Se.width,Se.height,Me,Oe,Se.data):t.texImage2D(s.TEXTURE_2D,j,Be,Se.width,Se.height,0,Me,Oe,Se.data)}else if(w.isDataArrayTexture)if(Ye){if(pt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,fe,Be,ne.width,ne.height,ne.depth),N)if(w.layerUpdates.size>0){const j=ch(ne.width,ne.height,w.format,w.type);for(const Z of w.layerUpdates){const be=ne.data.subarray(Z*j/ne.data.BYTES_PER_ELEMENT,(Z+1)*j/ne.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Z,ne.width,ne.height,1,Me,Oe,be)}w.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,Me,Oe,ne.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Be,ne.width,ne.height,ne.depth,0,Me,Oe,ne.data);else if(w.isData3DTexture)Ye?(pt&&t.texStorage3D(s.TEXTURE_3D,fe,Be,ne.width,ne.height,ne.depth),N&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,Me,Oe,ne.data)):t.texImage3D(s.TEXTURE_3D,0,Be,ne.width,ne.height,ne.depth,0,Me,Oe,ne.data);else if(w.isFramebufferTexture){if(pt)if(Ye)t.texStorage2D(s.TEXTURE_2D,fe,Be,ne.width,ne.height);else{let j=ne.width,Z=ne.height;for(let be=0;be<fe;be++)t.texImage2D(s.TEXTURE_2D,be,Be,j,Z,0,Me,Oe,null),j>>=1,Z>>=1}}else if(et.length>0){if(Ye&&pt){const j=_e(et[0]);t.texStorage2D(s.TEXTURE_2D,fe,Be,j.width,j.height)}for(let j=0,Z=et.length;j<Z;j++)Se=et[j],Ye?N&&t.texSubImage2D(s.TEXTURE_2D,j,0,0,Me,Oe,Se):t.texImage2D(s.TEXTURE_2D,j,Be,Me,Oe,Se);w.generateMipmaps=!1}else if(Ye){if(pt){const j=_e(ne);t.texStorage2D(s.TEXTURE_2D,fe,Be,j.width,j.height)}N&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Me,Oe,ne)}else t.texImage2D(s.TEXTURE_2D,0,Be,Me,Oe,ne);p(w)&&m(Y),Ee.__version=K.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function re(P,w,z){if(w.image.length!==6)return;const Y=qe(P,w),ee=w.source;t.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+z);const K=n.get(ee);if(ee.version!==K.__version||Y===!0){t.activeTexture(s.TEXTURE0+z);const Ee=$e.getPrimaries($e.workingColorSpace),de=w.colorSpace===hi?null:$e.getPrimaries(w.colorSpace),xe=w.colorSpace===hi||Ee===de?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);const Qe=w.isCompressedTexture||w.image[0].isCompressedTexture,ne=w.image[0]&&w.image[0].isDataTexture,Me=[];for(let Z=0;Z<6;Z++)!Qe&&!ne?Me[Z]=g(w.image[Z],!0,i.maxCubemapSize):Me[Z]=ne?w.image[Z].image:w.image[Z],Me[Z]=Fe(w,Me[Z]);const Oe=Me[0],Be=r.convert(w.format,w.colorSpace),Se=r.convert(w.type),et=v(w.internalFormat,Be,Se,w.colorSpace),Ye=w.isVideoTexture!==!0,pt=K.__version===void 0||Y===!0,N=ee.dataReady;let fe=R(w,Oe);Ie(s.TEXTURE_CUBE_MAP,w);let j;if(Qe){Ye&&pt&&t.texStorage2D(s.TEXTURE_CUBE_MAP,fe,et,Oe.width,Oe.height);for(let Z=0;Z<6;Z++){j=Me[Z].mipmaps;for(let be=0;be<j.length;be++){const me=j[be];w.format!==pn?Be!==null?Ye?N&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,be,0,0,me.width,me.height,Be,me.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,be,et,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ye?N&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,be,0,0,me.width,me.height,Be,Se,me.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,be,et,me.width,me.height,0,Be,Se,me.data)}}}else{if(j=w.mipmaps,Ye&&pt){j.length>0&&fe++;const Z=_e(Me[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,fe,et,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(ne){Ye?N&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Me[Z].width,Me[Z].height,Be,Se,Me[Z].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,et,Me[Z].width,Me[Z].height,0,Be,Se,Me[Z].data);for(let be=0;be<j.length;be++){const We=j[be].image[Z].image;Ye?N&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,be+1,0,0,We.width,We.height,Be,Se,We.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,be+1,et,We.width,We.height,0,Be,Se,We.data)}}else{Ye?N&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,Be,Se,Me[Z]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,et,Be,Se,Me[Z]);for(let be=0;be<j.length;be++){const me=j[be];Ye?N&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,be+1,0,0,Be,Se,me.image[Z]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Z,be+1,et,Be,Se,me.image[Z])}}}p(w)&&m(s.TEXTURE_CUBE_MAP),K.__version=ee.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function we(P,w,z,Y,ee,K){const Ee=r.convert(z.format,z.colorSpace),de=r.convert(z.type),xe=v(z.internalFormat,Ee,de,z.colorSpace),Qe=n.get(w),ne=n.get(z);if(ne.__renderTarget=w,!Qe.__hasExternalTextures){const Me=Math.max(1,w.width>>K),Oe=Math.max(1,w.height>>K);ee===s.TEXTURE_3D||ee===s.TEXTURE_2D_ARRAY?t.texImage3D(ee,K,xe,Me,Oe,w.depth,0,Ee,de,null):t.texImage2D(ee,K,xe,Me,Oe,0,Ee,de,null)}t.bindFramebuffer(s.FRAMEBUFFER,P),ve(w)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Y,ee,ne.__webglTexture,0,te(w)):(ee===s.TEXTURE_2D||ee>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Y,ee,ne.__webglTexture,K),t.bindFramebuffer(s.FRAMEBUFFER,null)}function ce(P,w,z){if(s.bindRenderbuffer(s.RENDERBUFFER,P),w.depthBuffer){const Y=w.depthTexture,ee=Y&&Y.isDepthTexture?Y.type:null,K=_(w.stencilBuffer,ee),Ee=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,de=te(w);ve(w)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,de,K,w.width,w.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,de,K,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,K,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ee,s.RENDERBUFFER,P)}else{const Y=w.textures;for(let ee=0;ee<Y.length;ee++){const K=Y[ee],Ee=r.convert(K.format,K.colorSpace),de=r.convert(K.type),xe=v(K.internalFormat,Ee,de,K.colorSpace),Qe=te(w);z&&ve(w)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Qe,xe,w.width,w.height):ve(w)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Qe,xe,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,xe,w.width,w.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function De(P,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,P),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=n.get(w.depthTexture);Y.__renderTarget=w,(!Y.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),W(w.depthTexture,0);const ee=Y.__webglTexture,K=te(w);if(w.depthTexture.format===ss)ve(w)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ee,0,K):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ee,0);else if(w.depthTexture.format===ds)ve(w)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ee,0,K):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function Ge(P){const w=n.get(P),z=P.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==P.depthTexture){const Y=P.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),Y){const ee=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,Y.removeEventListener("dispose",ee)};Y.addEventListener("dispose",ee),w.__depthDisposeCallback=ee}w.__boundDepthTexture=Y}if(P.depthTexture&&!w.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");De(w.__webglFramebuffer,P)}else if(z){w.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[Y]),w.__webglDepthbuffer[Y]===void 0)w.__webglDepthbuffer[Y]=s.createRenderbuffer(),ce(w.__webglDepthbuffer[Y],P,!1);else{const ee=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,K=w.__webglDepthbuffer[Y];s.bindRenderbuffer(s.RENDERBUFFER,K),s.framebufferRenderbuffer(s.FRAMEBUFFER,ee,s.RENDERBUFFER,K)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=s.createRenderbuffer(),ce(w.__webglDepthbuffer,P,!1);else{const Y=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ee=w.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ee),s.framebufferRenderbuffer(s.FRAMEBUFFER,Y,s.RENDERBUFFER,ee)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function ke(P,w,z){const Y=n.get(P);w!==void 0&&we(Y.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&Ge(P)}function nt(P){const w=P.texture,z=n.get(P),Y=n.get(w);P.addEventListener("dispose",A);const ee=P.textures,K=P.isWebGLCubeRenderTarget===!0,Ee=ee.length>1;if(Ee||(Y.__webglTexture===void 0&&(Y.__webglTexture=s.createTexture()),Y.__version=w.version,a.memory.textures++),K){z.__webglFramebuffer=[];for(let de=0;de<6;de++)if(w.mipmaps&&w.mipmaps.length>0){z.__webglFramebuffer[de]=[];for(let xe=0;xe<w.mipmaps.length;xe++)z.__webglFramebuffer[de][xe]=s.createFramebuffer()}else z.__webglFramebuffer[de]=s.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){z.__webglFramebuffer=[];for(let de=0;de<w.mipmaps.length;de++)z.__webglFramebuffer[de]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(Ee)for(let de=0,xe=ee.length;de<xe;de++){const Qe=n.get(ee[de]);Qe.__webglTexture===void 0&&(Qe.__webglTexture=s.createTexture(),a.memory.textures++)}if(P.samples>0&&ve(P)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let de=0;de<ee.length;de++){const xe=ee[de];z.__webglColorRenderbuffer[de]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[de]);const Qe=r.convert(xe.format,xe.colorSpace),ne=r.convert(xe.type),Me=v(xe.internalFormat,Qe,ne,xe.colorSpace,P.isXRRenderTarget===!0),Oe=te(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,Oe,Me,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+de,s.RENDERBUFFER,z.__webglColorRenderbuffer[de])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),ce(z.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(K){t.bindTexture(s.TEXTURE_CUBE_MAP,Y.__webglTexture),Ie(s.TEXTURE_CUBE_MAP,w);for(let de=0;de<6;de++)if(w.mipmaps&&w.mipmaps.length>0)for(let xe=0;xe<w.mipmaps.length;xe++)we(z.__webglFramebuffer[de][xe],P,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+de,xe);else we(z.__webglFramebuffer[de],P,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);p(w)&&m(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ee){for(let de=0,xe=ee.length;de<xe;de++){const Qe=ee[de],ne=n.get(Qe);t.bindTexture(s.TEXTURE_2D,ne.__webglTexture),Ie(s.TEXTURE_2D,Qe),we(z.__webglFramebuffer,P,Qe,s.COLOR_ATTACHMENT0+de,s.TEXTURE_2D,0),p(Qe)&&m(s.TEXTURE_2D)}t.unbindTexture()}else{let de=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(de=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(de,Y.__webglTexture),Ie(de,w),w.mipmaps&&w.mipmaps.length>0)for(let xe=0;xe<w.mipmaps.length;xe++)we(z.__webglFramebuffer[xe],P,w,s.COLOR_ATTACHMENT0,de,xe);else we(z.__webglFramebuffer,P,w,s.COLOR_ATTACHMENT0,de,0);p(w)&&m(de),t.unbindTexture()}P.depthBuffer&&Ge(P)}function Q(P){const w=P.textures;for(let z=0,Y=w.length;z<Y;z++){const ee=w[z];if(p(ee)){const K=x(P),Ee=n.get(ee).__webglTexture;t.bindTexture(K,Ee),m(K),t.unbindTexture()}}}const ie=[],I=[];function Ce(P){if(P.samples>0){if(ve(P)===!1){const w=P.textures,z=P.width,Y=P.height;let ee=s.COLOR_BUFFER_BIT;const K=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ee=n.get(P),de=w.length>1;if(de)for(let xe=0;xe<w.length;xe++)t.bindFramebuffer(s.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ee.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let xe=0;xe<w.length;xe++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(ee|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(ee|=s.STENCIL_BUFFER_BIT)),de){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ee.__webglColorRenderbuffer[xe]);const Qe=n.get(w[xe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Qe,0)}s.blitFramebuffer(0,0,z,Y,0,0,z,Y,ee,s.NEAREST),c===!0&&(ie.length=0,I.length=0,ie.push(s.COLOR_ATTACHMENT0+xe),P.depthBuffer&&P.resolveDepthBuffer===!1&&(ie.push(K),I.push(K),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,I)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ie))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),de)for(let xe=0;xe<w.length;xe++){t.bindFramebuffer(s.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.RENDERBUFFER,Ee.__webglColorRenderbuffer[xe]);const Qe=n.get(w[xe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ee.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+xe,s.TEXTURE_2D,Qe,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&c){const w=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[w])}}}function te(P){return Math.min(i.maxSamples,P.samples)}function ve(P){const w=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function le(P){const w=a.render.frame;h.get(P)!==w&&(h.set(P,w),P.update())}function Fe(P,w){const z=P.colorSpace,Y=P.format,ee=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||z!==Gt&&z!==hi&&($e.getTransfer(z)===ht?(Y!==pn||ee!==$n)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),w}function _e(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(l.width=P.naturalWidth||P.width,l.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(l.width=P.displayWidth,l.height=P.displayHeight):(l.width=P.width,l.height=P.height),l}this.allocateTextureUnit=U,this.resetTextureUnits=D,this.setTexture2D=W,this.setTexture2DArray=B,this.setTexture3D=$,this.setTextureCube=V,this.rebindTextures=ke,this.setupRenderTarget=nt,this.updateRenderTargetMipmap=Q,this.updateMultisampleRenderTarget=Ce,this.setupDepthRenderbuffer=Ge,this.setupFrameBufferTexture=we,this.useMultisampledRTT=ve}function Bb(s,e){function t(n,i=hi){let r;const a=$e.getTransfer(i);if(n===$n)return s.UNSIGNED_BYTE;if(n===Ac)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Rc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Cu)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Au)return s.BYTE;if(n===Ru)return s.SHORT;if(n===nr)return s.UNSIGNED_SHORT;if(n===Tc)return s.INT;if(n===Pi)return s.UNSIGNED_INT;if(n===Zt)return s.FLOAT;if(n===Qt)return s.HALF_FLOAT;if(n===Pu)return s.ALPHA;if(n===Lu)return s.RGB;if(n===pn)return s.RGBA;if(n===Iu)return s.LUMINANCE;if(n===Du)return s.LUMINANCE_ALPHA;if(n===ss)return s.DEPTH_COMPONENT;if(n===ds)return s.DEPTH_STENCIL;if(n===Cc)return s.RED;if(n===Pc)return s.RED_INTEGER;if(n===Uu)return s.RG;if(n===Lc)return s.RG_INTEGER;if(n===Ic)return s.RGBA_INTEGER;if(n===ia||n===sa||n===ra||n===aa)if(a===ht)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ia)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===sa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ra)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===aa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ia)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===sa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ra)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===aa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ko||n===Bo||n===zo||n===Go)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ko)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Bo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===zo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Go)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ho||n===Vo||n===Wo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ho||n===Vo)return a===ht?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Wo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===jo||n===Xo||n===qo||n===Yo||n===Ko||n===Jo||n===Zo||n===Qo||n===$o||n===ec||n===tc||n===nc||n===ic||n===sc)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===jo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Xo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===qo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Yo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ko)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Jo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Zo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Qo)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===$o)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ec)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===tc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===nc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ic)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===sc)return a===ht?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===oa||n===rc||n===ac)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===oa)return a===ht?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===rc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ac)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Nu||n===oc||n===cc||n===lc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===oa)return r.COMPRESSED_RED_RGTC1_EXT;if(n===oc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===cc)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===lc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===us?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}class zb extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ne extends ft{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Gb={type:"move"};class oo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ne,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ne,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ne,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const g of e.hand.values()){const p=t.getJointPose(g,n),m=this._getHandJoint(l,g);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,b=.005;l.inputState.pinching&&d>f+b?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&d<=f-b&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Gb)))}return o!==null&&(o.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ne;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Hb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Vb=`
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

}`;class Wb{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const i=new Pt,r=e.properties.get(i);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Xt({vertexShader:Hb,fragmentShader:Vb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new X(new un(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class jb extends Ms{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,b=null;const g=new Wb,p=t.getContextAttributes();let m=null,x=null;const v=[],_=[],R=new J;let S=null;const A=new jt;A.viewport=new rt;const E=new jt;E.viewport=new rt;const M=[A,E],y=new zb;let L=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let re=v[q];return re===void 0&&(re=new oo,v[q]=re),re.getTargetRaySpace()},this.getControllerGrip=function(q){let re=v[q];return re===void 0&&(re=new oo,v[q]=re),re.getGripSpace()},this.getHand=function(q){let re=v[q];return re===void 0&&(re=new oo,v[q]=re),re.getHandSpace()};function U(q){const re=_.indexOf(q.inputSource);if(re===-1)return;const we=v[re];we!==void 0&&(we.update(q.inputSource,q.frame,l||a),we.dispatchEvent({type:q.type,data:q.inputSource}))}function F(){i.removeEventListener("select",U),i.removeEventListener("selectstart",U),i.removeEventListener("selectend",U),i.removeEventListener("squeeze",U),i.removeEventListener("squeezestart",U),i.removeEventListener("squeezeend",U),i.removeEventListener("end",F),i.removeEventListener("inputsourceschange",W);for(let q=0;q<v.length;q++){const re=_[q];re!==null&&(_[q]=null,v[q].disconnect(re))}L=null,D=null,g.reset(),e.setRenderTarget(m),f=null,d=null,u=null,i=null,x=null,qe.stop(),n.isPresenting=!1,e.setPixelRatio(S),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return b},this.getSession=function(){return i},this.setSession=async function(q){if(i=q,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",U),i.addEventListener("selectstart",U),i.addEventListener("selectend",U),i.addEventListener("squeeze",U),i.addEventListener("squeezestart",U),i.addEventListener("squeezeend",U),i.addEventListener("end",F),i.addEventListener("inputsourceschange",W),p.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(R),i.renderState.layers===void 0){const re={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,re),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new gn(f.framebufferWidth,f.framebufferHeight,{format:pn,type:$n,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let re=null,we=null,ce=null;p.depth&&(ce=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=p.stencil?ds:ss,we=p.stencil?us:Pi);const De={colorFormat:t.RGBA8,depthFormat:ce,scaleFactor:r};u=new XRWebGLBinding(i,t),d=u.createProjectionLayer(De),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new gn(d.textureWidth,d.textureHeight,{format:pn,type:$n,depthTexture:new Yu(d.textureWidth,d.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await i.requestReferenceSpace(o),qe.setContext(i),qe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function W(q){for(let re=0;re<q.removed.length;re++){const we=q.removed[re],ce=_.indexOf(we);ce>=0&&(_[ce]=null,v[ce].disconnect(we))}for(let re=0;re<q.added.length;re++){const we=q.added[re];let ce=_.indexOf(we);if(ce===-1){for(let Ge=0;Ge<v.length;Ge++)if(Ge>=_.length){_.push(we),ce=Ge;break}else if(_[Ge]===null){_[Ge]=we,ce=Ge;break}if(ce===-1)break}const De=v[ce];De&&De.connect(we)}}const B=new C,$=new C;function V(q,re,we){B.setFromMatrixPosition(re.matrixWorld),$.setFromMatrixPosition(we.matrixWorld);const ce=B.distanceTo($),De=re.projectionMatrix.elements,Ge=we.projectionMatrix.elements,ke=De[14]/(De[10]-1),nt=De[14]/(De[10]+1),Q=(De[9]+1)/De[5],ie=(De[9]-1)/De[5],I=(De[8]-1)/De[0],Ce=(Ge[8]+1)/Ge[0],te=ke*I,ve=ke*Ce,le=ce/(-I+Ce),Fe=le*-I;if(re.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Fe),q.translateZ(le),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),De[10]===-1)q.projectionMatrix.copy(re.projectionMatrix),q.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const _e=ke+le,P=nt+le,w=te-Fe,z=ve+(ce-Fe),Y=Q*nt/P*_e,ee=ie*nt/P*_e;q.projectionMatrix.makePerspective(w,z,Y,ee,_e,P),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function se(q,re){re===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(re.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(i===null)return;let re=q.near,we=q.far;g.texture!==null&&(g.depthNear>0&&(re=g.depthNear),g.depthFar>0&&(we=g.depthFar)),y.near=E.near=A.near=re,y.far=E.far=A.far=we,(L!==y.near||D!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),L=y.near,D=y.far),A.layers.mask=q.layers.mask|2,E.layers.mask=q.layers.mask|4,y.layers.mask=A.layers.mask|E.layers.mask;const ce=q.parent,De=y.cameras;se(y,ce);for(let Ge=0;Ge<De.length;Ge++)se(De[Ge],ce);De.length===2?V(y,A,E):y.projectionMatrix.copy(A.projectionMatrix),oe(q,y,ce)};function oe(q,re,we){we===null?q.matrix.copy(re.matrixWorld):(q.matrix.copy(we.matrixWorld),q.matrix.invert(),q.matrix.multiply(re.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(re.projectionMatrix),q.projectionMatrixInverse.copy(re.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=fs*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(q){c=q,d!==null&&(d.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(y)};let pe=null;function Ie(q,re){if(h=re.getViewerPose(l||a),b=re,h!==null){const we=h.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let ce=!1;we.length!==y.cameras.length&&(y.cameras.length=0,ce=!0);for(let Ge=0;Ge<we.length;Ge++){const ke=we[Ge];let nt=null;if(f!==null)nt=f.getViewport(ke);else{const ie=u.getViewSubImage(d,ke);nt=ie.viewport,Ge===0&&(e.setRenderTargetTextures(x,ie.colorTexture,d.ignoreDepthValues?void 0:ie.depthStencilTexture),e.setRenderTarget(x))}let Q=M[Ge];Q===void 0&&(Q=new jt,Q.layers.enable(Ge),Q.viewport=new rt,M[Ge]=Q),Q.matrix.fromArray(ke.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(ke.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(nt.x,nt.y,nt.width,nt.height),Ge===0&&(y.matrix.copy(Q.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),ce===!0&&y.cameras.push(Q)}const De=i.enabledFeatures;if(De&&De.includes("depth-sensing")){const Ge=u.getDepthInformation(we[0]);Ge&&Ge.isValid&&Ge.texture&&g.init(e,Ge,i.renderState)}}for(let we=0;we<v.length;we++){const ce=_[we],De=v[we];ce!==null&&De!==void 0&&De.update(ce,re,l||a)}pe&&pe(q,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),b=null}const qe=new qu;qe.setAnimationLoop(Ie),this.setAnimationLoop=function(q){pe=q},this.dispose=function(){}}}const vi=new on,Xb=new ze;function qb(s,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Wu(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,x,v,_){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(p,m):m.isMeshToonMaterial?(r(p,m),u(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m)):m.isMeshStandardMaterial?(r(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,_)):m.isMeshMatcapMaterial?(r(p,m),b(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),g(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?c(p,m,x,v):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===qt&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===qt&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const x=e.get(m),v=x.envMap,_=x.envMapRotation;v&&(p.envMap.value=v,vi.copy(_),vi.x*=-1,vi.y*=-1,vi.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(vi.y*=-1,vi.z*=-1),p.envMapRotation.value.setFromMatrix4(Xb.makeRotationFromEuler(vi)),p.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,x,v){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*x,p.scale.value=v*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,x){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===qt&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function b(p,m){m.matcap&&(p.matcap.value=m.matcap)}function g(p,m){const x=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Yb(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,v){const _=v.program;n.uniformBlockBinding(x,_)}function l(x,v){let _=i[x.id];_===void 0&&(b(x),_=h(x),i[x.id]=_,x.addEventListener("dispose",p));const R=v.program;n.updateUBOMapping(x,R);const S=e.render.frame;r[x.id]!==S&&(d(x),r[x.id]=S)}function h(x){const v=u();x.__bindingPointIndex=v;const _=s.createBuffer(),R=x.__size,S=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,_),s.bufferData(s.UNIFORM_BUFFER,R,S),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,v,_),_}function u(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const v=i[x.id],_=x.uniforms,R=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,v);for(let S=0,A=_.length;S<A;S++){const E=Array.isArray(_[S])?_[S]:[_[S]];for(let M=0,y=E.length;M<y;M++){const L=E[M];if(f(L,S,M,R)===!0){const D=L.__offset,U=Array.isArray(L.value)?L.value:[L.value];let F=0;for(let W=0;W<U.length;W++){const B=U[W],$=g(B);typeof B=="number"||typeof B=="boolean"?(L.__data[0]=B,s.bufferSubData(s.UNIFORM_BUFFER,D+F,L.__data)):B.isMatrix3?(L.__data[0]=B.elements[0],L.__data[1]=B.elements[1],L.__data[2]=B.elements[2],L.__data[3]=0,L.__data[4]=B.elements[3],L.__data[5]=B.elements[4],L.__data[6]=B.elements[5],L.__data[7]=0,L.__data[8]=B.elements[6],L.__data[9]=B.elements[7],L.__data[10]=B.elements[8],L.__data[11]=0):(B.toArray(L.__data,F),F+=$.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,D,L.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(x,v,_,R){const S=x.value,A=v+"_"+_;if(R[A]===void 0)return typeof S=="number"||typeof S=="boolean"?R[A]=S:R[A]=S.clone(),!0;{const E=R[A];if(typeof S=="number"||typeof S=="boolean"){if(E!==S)return R[A]=S,!0}else if(E.equals(S)===!1)return E.copy(S),!0}return!1}function b(x){const v=x.uniforms;let _=0;const R=16;for(let A=0,E=v.length;A<E;A++){const M=Array.isArray(v[A])?v[A]:[v[A]];for(let y=0,L=M.length;y<L;y++){const D=M[y],U=Array.isArray(D.value)?D.value:[D.value];for(let F=0,W=U.length;F<W;F++){const B=U[F],$=g(B),V=_%R,se=V%$.boundary,oe=V+se;_+=se,oe!==0&&R-oe<$.storage&&(_+=R-oe),D.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=_,_+=$.storage}}}const S=_%R;return S>0&&(_+=R-S),x.__size=_,x.__cache={},this}function g(x){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function p(x){const v=x.target;v.removeEventListener("dispose",p);const _=a.indexOf(v.__bindingPointIndex);a.splice(_,1),s.deleteBuffer(i[v.id]),delete i[v.id],delete r[v.id]}function m(){for(const x in i)s.deleteBuffer(i[x]);a=[],i={},r={}}return{bind:c,update:l,dispose:m}}class Kb{constructor(e={}){const{canvas:t=Nf(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const b=new Uint32Array(4),g=new Int32Array(4);let p=null,m=null;const x=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=gt,this.toneMapping=fi,this.toneMappingExposure=1;const _=this;let R=!1,S=0,A=0,E=null,M=-1,y=null;const L=new rt,D=new rt;let U=null;const F=new he(0);let W=0,B=t.width,$=t.height,V=1,se=null,oe=null;const pe=new rt(0,0,B,$),Ie=new rt(0,0,B,$);let qe=!1;const q=new Nc;let re=!1,we=!1;const ce=new ze,De=new ze,Ge=new C,ke=new rt,nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Q=!1;function ie(){return E===null?V:1}let I=n;function Ce(T,O){return t.getContext(T,O)}try{const T={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${wc}`),t.addEventListener("webglcontextlost",Z,!1),t.addEventListener("webglcontextrestored",be,!1),t.addEventListener("webglcontextcreationerror",me,!1),I===null){const O="webgl2";if(I=Ce(O,T),I===null)throw Ce(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let te,ve,le,Fe,_e,P,w,z,Y,ee,K,Ee,de,xe,Qe,ne,Me,Oe,Be,Se,et,Ye,pt,N;function fe(){te=new eg(I),te.init(),Ye=new Bb(I,te),ve=new Y0(I,te,e,Ye),le=new Fb(I,te),ve.reverseDepthBuffer&&d&&le.buffers.depth.setReversed(!0),Fe=new ig(I),_e=new yb,P=new kb(I,te,le,_e,ve,Ye,Fe),w=new J0(_),z=new $0(_),Y=new hp(I),pt=new X0(I,Y),ee=new tg(I,Y,Fe,pt),K=new rg(I,ee,Y,Fe),Be=new sg(I,ve,P),ne=new K0(_e),Ee=new vb(_,w,z,te,ve,pt,ne),de=new qb(_,_e),xe=new Sb,Qe=new Cb(te),Oe=new j0(_,w,z,le,K,f,c),Me=new Ub(_,K,ve),N=new Yb(I,Fe,ve,le),Se=new q0(I,te,Fe),et=new ng(I,te,Fe),Fe.programs=Ee.programs,_.capabilities=ve,_.extensions=te,_.properties=_e,_.renderLists=xe,_.shadowMap=Me,_.state=le,_.info=Fe}fe();const j=new jb(_,I);this.xr=j,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const T=te.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=te.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(T){T!==void 0&&(V=T,this.setSize(B,$,!1))},this.getSize=function(T){return T.set(B,$)},this.setSize=function(T,O,G=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=T,$=O,t.width=Math.floor(T*V),t.height=Math.floor(O*V),G===!0&&(t.style.width=T+"px",t.style.height=O+"px"),this.setViewport(0,0,T,O)},this.getDrawingBufferSize=function(T){return T.set(B*V,$*V).floor()},this.setDrawingBufferSize=function(T,O,G){B=T,$=O,V=G,t.width=Math.floor(T*G),t.height=Math.floor(O*G),this.setViewport(0,0,T,O)},this.getCurrentViewport=function(T){return T.copy(L)},this.getViewport=function(T){return T.copy(pe)},this.setViewport=function(T,O,G,H){T.isVector4?pe.set(T.x,T.y,T.z,T.w):pe.set(T,O,G,H),le.viewport(L.copy(pe).multiplyScalar(V).round())},this.getScissor=function(T){return T.copy(Ie)},this.setScissor=function(T,O,G,H){T.isVector4?Ie.set(T.x,T.y,T.z,T.w):Ie.set(T,O,G,H),le.scissor(D.copy(Ie).multiplyScalar(V).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(T){le.setScissorTest(qe=T)},this.setOpaqueSort=function(T){se=T},this.setTransparentSort=function(T){oe=T},this.getClearColor=function(T){return T.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor.apply(Oe,arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha.apply(Oe,arguments)},this.clear=function(T=!0,O=!0,G=!0){let H=0;if(T){let k=!1;if(E!==null){const ae=E.texture.format;k=ae===Ic||ae===Lc||ae===Pc}if(k){const ae=E.texture.type,ge=ae===$n||ae===Pi||ae===nr||ae===us||ae===Ac||ae===Rc,Te=Oe.getClearColor(),Ae=Oe.getClearAlpha(),He=Te.r,je=Te.g,Re=Te.b;ge?(b[0]=He,b[1]=je,b[2]=Re,b[3]=Ae,I.clearBufferuiv(I.COLOR,0,b)):(g[0]=He,g[1]=je,g[2]=Re,g[3]=Ae,I.clearBufferiv(I.COLOR,0,g))}else H|=I.COLOR_BUFFER_BIT}O&&(H|=I.DEPTH_BUFFER_BIT),G&&(H|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Z,!1),t.removeEventListener("webglcontextrestored",be,!1),t.removeEventListener("webglcontextcreationerror",me,!1),xe.dispose(),Qe.dispose(),_e.dispose(),w.dispose(),z.dispose(),K.dispose(),pt.dispose(),N.dispose(),Ee.dispose(),j.dispose(),j.removeEventListener("sessionstart",tl),j.removeEventListener("sessionend",nl),pi.stop()};function Z(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function be(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const T=Fe.autoReset,O=Me.enabled,G=Me.autoUpdate,H=Me.needsUpdate,k=Me.type;fe(),Fe.autoReset=T,Me.enabled=O,Me.autoUpdate=G,Me.needsUpdate=H,Me.type=k}function me(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function We(T){const O=T.target;O.removeEventListener("dispose",We),St(O)}function St(T){Ot(T),_e.remove(T)}function Ot(T){const O=_e.get(T).programs;O!==void 0&&(O.forEach(function(G){Ee.releaseProgram(G)}),T.isShaderMaterial&&Ee.releaseShaderCache(T))}this.renderBufferDirect=function(T,O,G,H,k,ae){O===null&&(O=nt);const ge=k.isMesh&&k.matrixWorld.determinant()<0,Te=Rd(T,O,G,H,k);le.setMaterial(H,ge);let Ae=G.index,He=1;if(H.wireframe===!0){if(Ae=ee.getWireframeAttribute(G),Ae===void 0)return;He=2}const je=G.drawRange,Re=G.attributes.position;let st=je.start*He,mt=(je.start+je.count)*He;ae!==null&&(st=Math.max(st,ae.start*He),mt=Math.min(mt,(ae.start+ae.count)*He)),Ae!==null?(st=Math.max(st,0),mt=Math.min(mt,Ae.count)):Re!=null&&(st=Math.max(st,0),mt=Math.min(mt,Re.count));const _t=mt-st;if(_t<0||_t===1/0)return;pt.setup(k,H,Te,G,Ae);let Kt,at=Se;if(Ae!==null&&(Kt=Y.get(Ae),at=et,at.setIndex(Kt)),k.isMesh)H.wireframe===!0?(le.setLineWidth(H.wireframeLinewidth*ie()),at.setMode(I.LINES)):at.setMode(I.TRIANGLES);else if(k.isLine){let Pe=H.linewidth;Pe===void 0&&(Pe=1),le.setLineWidth(Pe*ie()),k.isLineSegments?at.setMode(I.LINES):k.isLineLoop?at.setMode(I.LINE_LOOP):at.setMode(I.LINE_STRIP)}else k.isPoints?at.setMode(I.POINTS):k.isSprite&&at.setMode(I.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)at.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(te.get("WEBGL_multi_draw"))at.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Pe=k._multiDrawStarts,On=k._multiDrawCounts,ot=k._multiDrawCount,_n=Ae?Y.get(Ae).bytesPerElement:1,Di=_e.get(H).currentProgram.getUniforms();for(let en=0;en<ot;en++)Di.setValue(I,"_gl_DrawID",en),at.render(Pe[en]/_n,On[en])}else if(k.isInstancedMesh)at.renderInstances(st,_t,k.count);else if(G.isInstancedBufferGeometry){const Pe=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,On=Math.min(G.instanceCount,Pe);at.renderInstances(st,_t,On)}else at.render(st,_t)};function lt(T,O,G){T.transparent===!0&&T.side===Ct&&T.forceSinglePass===!1?(T.side=qt,T.needsUpdate=!0,br(T,O,G),T.side=Qn,T.needsUpdate=!0,br(T,O,G),T.side=Ct):br(T,O,G)}this.compile=function(T,O,G=null){G===null&&(G=T),m=Qe.get(G),m.init(O),v.push(m),G.traverseVisible(function(k){k.isLight&&k.layers.test(O.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),T!==G&&T.traverseVisible(function(k){k.isLight&&k.layers.test(O.layers)&&(m.pushLight(k),k.castShadow&&m.pushShadow(k))}),m.setupLights();const H=new Set;return T.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const ae=k.material;if(ae)if(Array.isArray(ae))for(let ge=0;ge<ae.length;ge++){const Te=ae[ge];lt(Te,G,k),H.add(Te)}else lt(ae,G,k),H.add(ae)}),v.pop(),m=null,H},this.compileAsync=function(T,O,G=null){const H=this.compile(T,O,G);return new Promise(k=>{function ae(){if(H.forEach(function(ge){_e.get(ge).currentProgram.isReady()&&H.delete(ge)}),H.size===0){k(T);return}setTimeout(ae,10)}te.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let bn=null;function Fn(T){bn&&bn(T)}function tl(){pi.stop()}function nl(){pi.start()}const pi=new qu;pi.setAnimationLoop(Fn),typeof self<"u"&&pi.setContext(self),this.setAnimationLoop=function(T){bn=T,j.setAnimationLoop(T),T===null?pi.stop():pi.start()},j.addEventListener("sessionstart",tl),j.addEventListener("sessionend",nl),this.render=function(T,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(O),O=j.getCamera()),T.isScene===!0&&T.onBeforeRender(_,T,O,E),m=Qe.get(T,v.length),m.init(O),v.push(m),De.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),q.setFromProjectionMatrix(De),we=this.localClippingEnabled,re=ne.init(this.clippingPlanes,we),p=xe.get(T,x.length),p.init(),x.push(p),j.enabled===!0&&j.isPresenting===!0){const ae=_.xr.getDepthSensingMesh();ae!==null&&Pa(ae,O,-1/0,_.sortObjects)}Pa(T,O,0,_.sortObjects),p.finish(),_.sortObjects===!0&&p.sort(se,oe),Q=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,Q&&Oe.addToRenderList(p,T),this.info.render.frame++,re===!0&&ne.beginShadows();const G=m.state.shadowsArray;Me.render(G,T,O),re===!0&&ne.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=p.opaque,k=p.transmissive;if(m.setupLights(),O.isArrayCamera){const ae=O.cameras;if(k.length>0)for(let ge=0,Te=ae.length;ge<Te;ge++){const Ae=ae[ge];sl(H,k,T,Ae)}Q&&Oe.render(T);for(let ge=0,Te=ae.length;ge<Te;ge++){const Ae=ae[ge];il(p,T,Ae,Ae.viewport)}}else k.length>0&&sl(H,k,T,O),Q&&Oe.render(T),il(p,T,O);E!==null&&(P.updateMultisampleRenderTarget(E),P.updateRenderTargetMipmap(E)),T.isScene===!0&&T.onAfterRender(_,T,O),pt.resetDefaultState(),M=-1,y=null,v.pop(),v.length>0?(m=v[v.length-1],re===!0&&ne.setGlobalState(_.clippingPlanes,m.state.camera)):m=null,x.pop(),x.length>0?p=x[x.length-1]:p=null};function Pa(T,O,G,H){if(T.visible===!1)return;if(T.layers.test(O.layers)){if(T.isGroup)G=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(O);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||q.intersectsSprite(T)){H&&ke.setFromMatrixPosition(T.matrixWorld).applyMatrix4(De);const ge=K.update(T),Te=T.material;Te.visible&&p.push(T,ge,Te,G,ke.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||q.intersectsObject(T))){const ge=K.update(T),Te=T.material;if(H&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),ke.copy(T.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),ke.copy(ge.boundingSphere.center)),ke.applyMatrix4(T.matrixWorld).applyMatrix4(De)),Array.isArray(Te)){const Ae=ge.groups;for(let He=0,je=Ae.length;He<je;He++){const Re=Ae[He],st=Te[Re.materialIndex];st&&st.visible&&p.push(T,ge,st,G,ke.z,Re)}}else Te.visible&&p.push(T,ge,Te,G,ke.z,null)}}const ae=T.children;for(let ge=0,Te=ae.length;ge<Te;ge++)Pa(ae[ge],O,G,H)}function il(T,O,G,H){const k=T.opaque,ae=T.transmissive,ge=T.transparent;m.setupLightsView(G),re===!0&&ne.setGlobalState(_.clippingPlanes,G),H&&le.viewport(L.copy(H)),k.length>0&&gr(k,O,G),ae.length>0&&gr(ae,O,G),ge.length>0&&gr(ge,O,G),le.buffers.depth.setTest(!0),le.buffers.depth.setMask(!0),le.buffers.color.setMask(!0),le.setPolygonOffset(!1)}function sl(T,O,G,H){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[H.id]===void 0&&(m.state.transmissionRenderTarget[H.id]=new gn(1,1,{generateMipmaps:!0,type:te.has("EXT_color_buffer_half_float")||te.has("EXT_color_buffer_float")?Qt:$n,minFilter:wn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$e.workingColorSpace}));const ae=m.state.transmissionRenderTarget[H.id],ge=H.viewport||L;ae.setSize(ge.z,ge.w);const Te=_.getRenderTarget();_.setRenderTarget(ae),_.getClearColor(F),W=_.getClearAlpha(),W<1&&_.setClearColor(16777215,.5),_.clear(),Q&&Oe.render(G);const Ae=_.toneMapping;_.toneMapping=fi;const He=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),m.setupLightsView(H),re===!0&&ne.setGlobalState(_.clippingPlanes,H),gr(T,G,H),P.updateMultisampleRenderTarget(ae),P.updateRenderTargetMipmap(ae),te.has("WEBGL_multisampled_render_to_texture")===!1){let je=!1;for(let Re=0,st=O.length;Re<st;Re++){const mt=O[Re],_t=mt.object,Kt=mt.geometry,at=mt.material,Pe=mt.group;if(at.side===Ct&&_t.layers.test(H.layers)){const On=at.side;at.side=qt,at.needsUpdate=!0,rl(_t,G,H,Kt,at,Pe),at.side=On,at.needsUpdate=!0,je=!0}}je===!0&&(P.updateMultisampleRenderTarget(ae),P.updateRenderTargetMipmap(ae))}_.setRenderTarget(Te),_.setClearColor(F,W),He!==void 0&&(H.viewport=He),_.toneMapping=Ae}function gr(T,O,G){const H=O.isScene===!0?O.overrideMaterial:null;for(let k=0,ae=T.length;k<ae;k++){const ge=T[k],Te=ge.object,Ae=ge.geometry,He=H===null?ge.material:H,je=ge.group;Te.layers.test(G.layers)&&rl(Te,O,G,Ae,He,je)}}function rl(T,O,G,H,k,ae){T.onBeforeRender(_,O,G,H,k,ae),T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),k.onBeforeRender(_,O,G,H,T,ae),k.transparent===!0&&k.side===Ct&&k.forceSinglePass===!1?(k.side=qt,k.needsUpdate=!0,_.renderBufferDirect(G,O,H,k,T,ae),k.side=Qn,k.needsUpdate=!0,_.renderBufferDirect(G,O,H,k,T,ae),k.side=Ct):_.renderBufferDirect(G,O,H,k,T,ae),T.onAfterRender(_,O,G,H,k,ae)}function br(T,O,G){O.isScene!==!0&&(O=nt);const H=_e.get(T),k=m.state.lights,ae=m.state.shadowsArray,ge=k.state.version,Te=Ee.getParameters(T,k.state,ae,O,G),Ae=Ee.getProgramCacheKey(Te);let He=H.programs;H.environment=T.isMeshStandardMaterial?O.environment:null,H.fog=O.fog,H.envMap=(T.isMeshStandardMaterial?z:w).get(T.envMap||H.environment),H.envMapRotation=H.environment!==null&&T.envMap===null?O.environmentRotation:T.envMapRotation,He===void 0&&(T.addEventListener("dispose",We),He=new Map,H.programs=He);let je=He.get(Ae);if(je!==void 0){if(H.currentProgram===je&&H.lightsStateVersion===ge)return ol(T,Te),je}else Te.uniforms=Ee.getUniforms(T),T.onBeforeCompile(Te,_),je=Ee.acquireProgram(Te,Ae),He.set(Ae,je),H.uniforms=Te.uniforms;const Re=H.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Re.clippingPlanes=ne.uniform),ol(T,Te),H.needsLights=Pd(T),H.lightsStateVersion=ge,H.needsLights&&(Re.ambientLightColor.value=k.state.ambient,Re.lightProbe.value=k.state.probe,Re.directionalLights.value=k.state.directional,Re.directionalLightShadows.value=k.state.directionalShadow,Re.spotLights.value=k.state.spot,Re.spotLightShadows.value=k.state.spotShadow,Re.rectAreaLights.value=k.state.rectArea,Re.ltc_1.value=k.state.rectAreaLTC1,Re.ltc_2.value=k.state.rectAreaLTC2,Re.pointLights.value=k.state.point,Re.pointLightShadows.value=k.state.pointShadow,Re.hemisphereLights.value=k.state.hemi,Re.directionalShadowMap.value=k.state.directionalShadowMap,Re.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Re.spotShadowMap.value=k.state.spotShadowMap,Re.spotLightMatrix.value=k.state.spotLightMatrix,Re.spotLightMap.value=k.state.spotLightMap,Re.pointShadowMap.value=k.state.pointShadowMap,Re.pointShadowMatrix.value=k.state.pointShadowMatrix),H.currentProgram=je,H.uniformsList=null,je}function al(T){if(T.uniformsList===null){const O=T.currentProgram.getUniforms();T.uniformsList=ca.seqWithValue(O.seq,T.uniforms)}return T.uniformsList}function ol(T,O){const G=_e.get(T);G.outputColorSpace=O.outputColorSpace,G.batching=O.batching,G.batchingColor=O.batchingColor,G.instancing=O.instancing,G.instancingColor=O.instancingColor,G.instancingMorph=O.instancingMorph,G.skinning=O.skinning,G.morphTargets=O.morphTargets,G.morphNormals=O.morphNormals,G.morphColors=O.morphColors,G.morphTargetsCount=O.morphTargetsCount,G.numClippingPlanes=O.numClippingPlanes,G.numIntersection=O.numClipIntersection,G.vertexAlphas=O.vertexAlphas,G.vertexTangents=O.vertexTangents,G.toneMapping=O.toneMapping}function Rd(T,O,G,H,k){O.isScene!==!0&&(O=nt),P.resetTextureUnits();const ae=O.fog,ge=H.isMeshStandardMaterial?O.environment:null,Te=E===null?_.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Gt,Ae=(H.isMeshStandardMaterial?z:w).get(H.envMap||ge),He=H.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,je=!!G.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Re=!!G.morphAttributes.position,st=!!G.morphAttributes.normal,mt=!!G.morphAttributes.color;let _t=fi;H.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(_t=_.toneMapping);const Kt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,at=Kt!==void 0?Kt.length:0,Pe=_e.get(H),On=m.state.lights;if(re===!0&&(we===!0||T!==y)){const cn=T===y&&H.id===M;ne.setState(H,T,cn)}let ot=!1;H.version===Pe.__version?(Pe.needsLights&&Pe.lightsStateVersion!==On.state.version||Pe.outputColorSpace!==Te||k.isBatchedMesh&&Pe.batching===!1||!k.isBatchedMesh&&Pe.batching===!0||k.isBatchedMesh&&Pe.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Pe.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Pe.instancing===!1||!k.isInstancedMesh&&Pe.instancing===!0||k.isSkinnedMesh&&Pe.skinning===!1||!k.isSkinnedMesh&&Pe.skinning===!0||k.isInstancedMesh&&Pe.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Pe.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Pe.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Pe.instancingMorph===!1&&k.morphTexture!==null||Pe.envMap!==Ae||H.fog===!0&&Pe.fog!==ae||Pe.numClippingPlanes!==void 0&&(Pe.numClippingPlanes!==ne.numPlanes||Pe.numIntersection!==ne.numIntersection)||Pe.vertexAlphas!==He||Pe.vertexTangents!==je||Pe.morphTargets!==Re||Pe.morphNormals!==st||Pe.morphColors!==mt||Pe.toneMapping!==_t||Pe.morphTargetsCount!==at)&&(ot=!0):(ot=!0,Pe.__version=H.version);let _n=Pe.currentProgram;ot===!0&&(_n=br(H,O,k));let Di=!1,en=!1,As=!1;const xt=_n.getUniforms(),En=Pe.uniforms;if(le.useProgram(_n.program)&&(Di=!0,en=!0,As=!0),H.id!==M&&(M=H.id,en=!0),Di||y!==T){le.buffers.depth.getReversed()?(ce.copy(T.projectionMatrix),Of(ce),kf(ce),xt.setValue(I,"projectionMatrix",ce)):xt.setValue(I,"projectionMatrix",T.projectionMatrix),xt.setValue(I,"viewMatrix",T.matrixWorldInverse);const ei=xt.map.cameraPosition;ei!==void 0&&ei.setValue(I,Ge.setFromMatrixPosition(T.matrixWorld)),ve.logarithmicDepthBuffer&&xt.setValue(I,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&xt.setValue(I,"isOrthographic",T.isOrthographicCamera===!0),y!==T&&(y=T,en=!0,As=!0)}if(k.isSkinnedMesh){xt.setOptional(I,k,"bindMatrix"),xt.setOptional(I,k,"bindMatrixInverse");const cn=k.skeleton;cn&&(cn.boneTexture===null&&cn.computeBoneTexture(),xt.setValue(I,"boneTexture",cn.boneTexture,P))}k.isBatchedMesh&&(xt.setOptional(I,k,"batchingTexture"),xt.setValue(I,"batchingTexture",k._matricesTexture,P),xt.setOptional(I,k,"batchingIdTexture"),xt.setValue(I,"batchingIdTexture",k._indirectTexture,P),xt.setOptional(I,k,"batchingColorTexture"),k._colorsTexture!==null&&xt.setValue(I,"batchingColorTexture",k._colorsTexture,P));const Rs=G.morphAttributes;if((Rs.position!==void 0||Rs.normal!==void 0||Rs.color!==void 0)&&Be.update(k,G,_n),(en||Pe.receiveShadow!==k.receiveShadow)&&(Pe.receiveShadow=k.receiveShadow,xt.setValue(I,"receiveShadow",k.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(En.envMap.value=Ae,En.flipEnvMap.value=Ae.isCubeTexture&&Ae.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&O.environment!==null&&(En.envMapIntensity.value=O.environmentIntensity),en&&(xt.setValue(I,"toneMappingExposure",_.toneMappingExposure),Pe.needsLights&&Cd(En,As),ae&&H.fog===!0&&de.refreshFogUniforms(En,ae),de.refreshMaterialUniforms(En,H,V,$,m.state.transmissionRenderTarget[T.id]),ca.upload(I,al(Pe),En,P)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(ca.upload(I,al(Pe),En,P),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&xt.setValue(I,"center",k.center),xt.setValue(I,"modelViewMatrix",k.modelViewMatrix),xt.setValue(I,"normalMatrix",k.normalMatrix),xt.setValue(I,"modelMatrix",k.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const cn=H.uniformsGroups;for(let ei=0,ti=cn.length;ei<ti;ei++){const cl=cn[ei];N.update(cl,_n),N.bind(cl,_n)}}return _n}function Cd(T,O){T.ambientLightColor.needsUpdate=O,T.lightProbe.needsUpdate=O,T.directionalLights.needsUpdate=O,T.directionalLightShadows.needsUpdate=O,T.pointLights.needsUpdate=O,T.pointLightShadows.needsUpdate=O,T.spotLights.needsUpdate=O,T.spotLightShadows.needsUpdate=O,T.rectAreaLights.needsUpdate=O,T.hemisphereLights.needsUpdate=O}function Pd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(T,O,G){_e.get(T.texture).__webglTexture=O,_e.get(T.depthTexture).__webglTexture=G;const H=_e.get(T);H.__hasExternalTextures=!0,H.__autoAllocateDepthBuffer=G===void 0,H.__autoAllocateDepthBuffer||te.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,O){const G=_e.get(T);G.__webglFramebuffer=O,G.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(T,O=0,G=0){E=T,S=O,A=G;let H=!0,k=null,ae=!1,ge=!1;if(T){const Ae=_e.get(T);if(Ae.__useDefaultFramebuffer!==void 0)le.bindFramebuffer(I.FRAMEBUFFER,null),H=!1;else if(Ae.__webglFramebuffer===void 0)P.setupRenderTarget(T);else if(Ae.__hasExternalTextures)P.rebindTextures(T,_e.get(T.texture).__webglTexture,_e.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Re=T.depthTexture;if(Ae.__boundDepthTexture!==Re){if(Re!==null&&_e.has(Re)&&(T.width!==Re.image.width||T.height!==Re.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(T)}}const He=T.texture;(He.isData3DTexture||He.isDataArrayTexture||He.isCompressedArrayTexture)&&(ge=!0);const je=_e.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(je[O])?k=je[O][G]:k=je[O],ae=!0):T.samples>0&&P.useMultisampledRTT(T)===!1?k=_e.get(T).__webglMultisampledFramebuffer:Array.isArray(je)?k=je[G]:k=je,L.copy(T.viewport),D.copy(T.scissor),U=T.scissorTest}else L.copy(pe).multiplyScalar(V).floor(),D.copy(Ie).multiplyScalar(V).floor(),U=qe;if(le.bindFramebuffer(I.FRAMEBUFFER,k)&&H&&le.drawBuffers(T,k),le.viewport(L),le.scissor(D),le.setScissorTest(U),ae){const Ae=_e.get(T.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+O,Ae.__webglTexture,G)}else if(ge){const Ae=_e.get(T.texture),He=O||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ae.__webglTexture,G||0,He)}M=-1},this.readRenderTargetPixels=function(T,O,G,H,k,ae,ge){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=_e.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ge!==void 0&&(Te=Te[ge]),Te){le.bindFramebuffer(I.FRAMEBUFFER,Te);try{const Ae=T.texture,He=Ae.format,je=Ae.type;if(!ve.textureFormatReadable(He)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ve.textureTypeReadable(je)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=T.width-H&&G>=0&&G<=T.height-k&&I.readPixels(O,G,H,k,Ye.convert(He),Ye.convert(je),ae)}finally{const Ae=E!==null?_e.get(E).__webglFramebuffer:null;le.bindFramebuffer(I.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(T,O,G,H,k,ae,ge){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Te=_e.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ge!==void 0&&(Te=Te[ge]),Te){const Ae=T.texture,He=Ae.format,je=Ae.type;if(!ve.textureFormatReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ve.textureTypeReadable(je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=T.width-H&&G>=0&&G<=T.height-k){le.bindFramebuffer(I.FRAMEBUFFER,Te);const Re=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Re),I.bufferData(I.PIXEL_PACK_BUFFER,ae.byteLength,I.STREAM_READ),I.readPixels(O,G,H,k,Ye.convert(He),Ye.convert(je),0);const st=E!==null?_e.get(E).__webglFramebuffer:null;le.bindFramebuffer(I.FRAMEBUFFER,st);const mt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Ff(I,mt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Re),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ae),I.deleteBuffer(Re),I.deleteSync(mt),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,O=null,G=0){T.isTexture!==!0&&(js("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,T=arguments[1]);const H=Math.pow(2,-G),k=Math.floor(T.image.width*H),ae=Math.floor(T.image.height*H),ge=O!==null?O.x:0,Te=O!==null?O.y:0;P.setTexture2D(T,0),I.copyTexSubImage2D(I.TEXTURE_2D,G,0,0,ge,Te,k,ae),le.unbindTexture()},this.copyTextureToTexture=function(T,O,G=null,H=null,k=0){T.isTexture!==!0&&(js("WebGLRenderer: copyTextureToTexture function signature has changed."),H=arguments[0]||null,T=arguments[1],O=arguments[2],k=arguments[3]||0,G=null);let ae,ge,Te,Ae,He,je,Re,st,mt;const _t=T.isCompressedTexture?T.mipmaps[k]:T.image;G!==null?(ae=G.max.x-G.min.x,ge=G.max.y-G.min.y,Te=G.isBox3?G.max.z-G.min.z:1,Ae=G.min.x,He=G.min.y,je=G.isBox3?G.min.z:0):(ae=_t.width,ge=_t.height,Te=_t.depth||1,Ae=0,He=0,je=0),H!==null?(Re=H.x,st=H.y,mt=H.z):(Re=0,st=0,mt=0);const Kt=Ye.convert(O.format),at=Ye.convert(O.type);let Pe;O.isData3DTexture?(P.setTexture3D(O,0),Pe=I.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(P.setTexture2DArray(O,0),Pe=I.TEXTURE_2D_ARRAY):(P.setTexture2D(O,0),Pe=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,O.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,O.unpackAlignment);const On=I.getParameter(I.UNPACK_ROW_LENGTH),ot=I.getParameter(I.UNPACK_IMAGE_HEIGHT),_n=I.getParameter(I.UNPACK_SKIP_PIXELS),Di=I.getParameter(I.UNPACK_SKIP_ROWS),en=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,_t.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,_t.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ae),I.pixelStorei(I.UNPACK_SKIP_ROWS,He),I.pixelStorei(I.UNPACK_SKIP_IMAGES,je);const As=T.isDataArrayTexture||T.isData3DTexture,xt=O.isDataArrayTexture||O.isData3DTexture;if(T.isRenderTargetTexture||T.isDepthTexture){const En=_e.get(T),Rs=_e.get(O),cn=_e.get(En.__renderTarget),ei=_e.get(Rs.__renderTarget);le.bindFramebuffer(I.READ_FRAMEBUFFER,cn.__webglFramebuffer),le.bindFramebuffer(I.DRAW_FRAMEBUFFER,ei.__webglFramebuffer);for(let ti=0;ti<Te;ti++)As&&I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,_e.get(T).__webglTexture,k,je+ti),T.isDepthTexture?(xt&&I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,_e.get(O).__webglTexture,k,mt+ti),I.blitFramebuffer(Ae,He,ae,ge,Re,st,ae,ge,I.DEPTH_BUFFER_BIT,I.NEAREST)):xt?I.copyTexSubImage3D(Pe,k,Re,st,mt+ti,Ae,He,ae,ge):I.copyTexSubImage2D(Pe,k,Re,st,mt+ti,Ae,He,ae,ge);le.bindFramebuffer(I.READ_FRAMEBUFFER,null),le.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else xt?T.isDataTexture||T.isData3DTexture?I.texSubImage3D(Pe,k,Re,st,mt,ae,ge,Te,Kt,at,_t.data):O.isCompressedArrayTexture?I.compressedTexSubImage3D(Pe,k,Re,st,mt,ae,ge,Te,Kt,_t.data):I.texSubImage3D(Pe,k,Re,st,mt,ae,ge,Te,Kt,at,_t):T.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,k,Re,st,ae,ge,Kt,at,_t.data):T.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,k,Re,st,_t.width,_t.height,Kt,_t.data):I.texSubImage2D(I.TEXTURE_2D,k,Re,st,ae,ge,Kt,at,_t);I.pixelStorei(I.UNPACK_ROW_LENGTH,On),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ot),I.pixelStorei(I.UNPACK_SKIP_PIXELS,_n),I.pixelStorei(I.UNPACK_SKIP_ROWS,Di),I.pixelStorei(I.UNPACK_SKIP_IMAGES,en),k===0&&O.generateMipmaps&&I.generateMipmap(Pe),le.unbindTexture()},this.copyTextureToTexture3D=function(T,O,G=null,H=null,k=0){return T.isTexture!==!0&&(js("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,H=arguments[1]||null,T=arguments[2],O=arguments[3],k=arguments[4]||0),js('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(T,O,G,H,k)},this.initRenderTarget=function(T){_e.get(T).__webglFramebuffer===void 0&&P.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?P.setTextureCube(T,0):T.isData3DTexture?P.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?P.setTexture2DArray(T,0):P.setTexture2D(T,0),le.unbindTexture()},this.resetState=function(){S=0,A=0,E=null,le.reset(),pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return qn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}}class Ks{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new he(e),this.near=t,this.far=n}clone(){return new Ks(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Jb extends ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new on,this.environmentIntensity=1,this.environmentRotation=new on,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class $u{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=uc,this.updateRanges=[],this.version=0,this.uuid=mn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=mn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=mn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Vt=new C;class or{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyMatrix4(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.applyNormalMatrix(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Vt.fromBufferAttribute(this,t),Vt.transformDirection(e),this.setXYZ(t,Vt.x,Vt.y,Vt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Sn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Sn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Sn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Sn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Sn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array),r=ut(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Mt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new or(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class cr extends an{static get type(){return"SpriteMaterial"}constructor(e){super(),this.isSpriteMaterial=!0,this.color=new he(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Yi;const Ds=new C,Ki=new C,Ji=new C,Zi=new J,Us=new J,ed=new ze,zr=new C,Ns=new C,Gr=new C,lh=new J,co=new J,hh=new J;class fa extends ft{constructor(e=new cr){if(super(),this.isSprite=!0,this.type="Sprite",Yi===void 0){Yi=new bt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new $u(t,5);Yi.setIndex([0,1,2,0,2,3]),Yi.setAttribute("position",new or(n,3,0,!1)),Yi.setAttribute("uv",new or(n,2,3,!1))}this.geometry=Yi,this.material=e,this.center=new J(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ki.setFromMatrixScale(this.matrixWorld),ed.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ji.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ki.multiplyScalar(-Ji.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const a=this.center;Hr(zr.set(-.5,-.5,0),Ji,a,Ki,i,r),Hr(Ns.set(.5,-.5,0),Ji,a,Ki,i,r),Hr(Gr.set(.5,.5,0),Ji,a,Ki,i,r),lh.set(0,0),co.set(1,0),hh.set(1,1);let o=e.ray.intersectTriangle(zr,Ns,Gr,!1,Ds);if(o===null&&(Hr(Ns.set(-.5,.5,0),Ji,a,Ki,i,r),co.set(0,1),o=e.ray.intersectTriangle(zr,Gr,Ns,!1,Ds),o===null))return;const c=e.ray.origin.distanceTo(Ds);c<e.near||c>e.far||t.push({distance:c,point:Ds.clone(),uv:fn.getInterpolation(Ds,zr,Ns,Gr,lh,co,hh,new J),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Hr(s,e,t,n,i,r){Zi.subVectors(s,t).addScalar(.5).multiply(n),i!==void 0?(Us.x=r*Zi.x-i*Zi.y,Us.y=i*Zi.x+r*Zi.y):Us.copy(Zi),s.copy(e),s.x+=Us.x,s.y+=Us.y,s.applyMatrix4(ed)}const uh=new C,dh=new rt,fh=new rt,Zb=new C,ph=new ze,Vr=new C,lo=new In,mh=new ze,ho=new fr;class Qb extends X{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=dl,this.bindMatrix=new ze,this.bindMatrixInverse=new ze,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new vt),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Vr),this.boundingBox.expandByPoint(Vr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new In),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Vr),this.boundingSphere.expandByPoint(Vr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),lo.copy(this.boundingSphere),lo.applyMatrix4(i),e.ray.intersectsSphere(lo)!==!1&&(mh.copy(i).invert(),ho.copy(e.ray).applyMatrix4(mh),!(this.boundingBox!==null&&ho.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,ho)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new rt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===dl?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===rf?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;dh.fromBufferAttribute(i.attributes.skinIndex,e),fh.fromBufferAttribute(i.attributes.skinWeight,e),uh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){const a=fh.getComponent(r);if(a!==0){const o=dh.getComponent(r);ph.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Zb.copy(uh).applyMatrix4(ph),a)}}return t.applyMatrix4(this.bindMatrixInverse)}}class td extends ft{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Oc extends Pt{constructor(e=null,t=1,n=1,i,r,a,o,c,l=Yt,h=Yt,u,d){super(null,a,o,c,l,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const gh=new ze,$b=new ze;class kc{constructor(e=[],t=[]){this.uuid=mn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new ze)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new ze;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:$b;gh.multiplyMatrices(o,t[r]),gh.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new kc(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Oc(t,e,e,pn,Zt);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let a=t[r];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),a=new td),this.bones.push(a),this.boneInverses.push(new ze().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class Ci extends Mt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Qi=new ze,bh=new ze,Wr=[],_h=new vt,e_=new ze,Fs=new X,Os=new In;class dn extends X{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ci(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,e_)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new vt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Qi),_h.copy(e.boundingBox).applyMatrix4(Qi),this.boundingBox.union(_h)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new In),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Qi),Os.copy(e.boundingSphere).applyMatrix4(Qi),this.boundingSphere.union(Os)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Fs.geometry=this.geometry,Fs.material=this.material,Fs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Os.copy(this.boundingSphere),Os.applyMatrix4(n),e.ray.intersectsSphere(Os)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Qi),bh.multiplyMatrices(n,Qi),Fs.matrixWorld=bh,Fs.raycast(e,Wr);for(let a=0,o=Wr.length;a<o;a++){const c=Wr[a];c.instanceId=r,c.object=this,t.push(c)}Wr.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Ci(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Oc(new Float32Array(i*this.count),i,this.count,Cc,Zt));const r=this.morphTexture.source.data.data;let a=0;for(let l=0;l<n.length;l++)a+=n[l];const o=this.geometry.morphTargetsRelative?1:1-a,c=i*e;r[c]=o,r.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Bc extends an{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new he(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const pa=new C,ma=new C,xh=new ze,ks=new fr,jr=new In,uo=new C,vh=new C;class Sa extends ft{constructor(e=new bt,t=new Bc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)pa.fromBufferAttribute(t,i-1),ma.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=pa.distanceTo(ma);e.setAttribute("lineDistance",new Je(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),jr.copy(n.boundingSphere),jr.applyMatrix4(i),jr.radius+=r,e.ray.intersectsSphere(jr)===!1)return;xh.copy(i).invert(),ks.copy(e.ray).applyMatrix4(xh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),b=Math.min(h.count,a.start+a.count);for(let g=f,p=b-1;g<p;g+=l){const m=h.getX(g),x=h.getX(g+1),v=Xr(this,e,ks,c,m,x);v&&t.push(v)}if(this.isLineLoop){const g=h.getX(b-1),p=h.getX(f),m=Xr(this,e,ks,c,g,p);m&&t.push(m)}}else{const f=Math.max(0,a.start),b=Math.min(d.count,a.start+a.count);for(let g=f,p=b-1;g<p;g+=l){const m=Xr(this,e,ks,c,g,g+1);m&&t.push(m)}if(this.isLineLoop){const g=Xr(this,e,ks,c,b-1,f);g&&t.push(g)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Xr(s,e,t,n,i,r){const a=s.geometry.attributes.position;if(pa.fromBufferAttribute(a,i),ma.fromBufferAttribute(a,r),t.distanceSqToSegment(pa,ma,uo,vh)>n)return;uo.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(uo);if(!(c<e.near||c>e.far))return{distance:c,point:vh.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:s}}const yh=new C,Mh=new C;class t_ extends Sa{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)yh.fromBufferAttribute(t,i),Mh.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+yh.distanceTo(Mh);e.setAttribute("lineDistance",new Je(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class n_ extends Sa{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class zc extends an{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new he(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Sh=new ze,pc=new fr,qr=new In,Yr=new C;class nd extends ft{constructor(e=new bt,t=new zc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),qr.copy(n.boundingSphere),qr.applyMatrix4(i),qr.radius+=r,e.ray.intersectsSphere(qr)===!1)return;Sh.copy(i).invert(),pc.copy(e.ray).applyMatrix4(Sh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,a.start),f=Math.min(l.count,a.start+a.count);for(let b=d,g=f;b<g;b++){const p=l.getX(b);Yr.fromBufferAttribute(u,p),wh(Yr,p,c,i,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let b=d,g=f;b<g;b++)Yr.fromBufferAttribute(u,b),wh(Yr,b,c,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function wh(s,e,t,n,i,r,a){const o=pc.distanceSqToPoint(s);if(o<t){const c=new C;pc.closestPointToPoint(s,c),c.applyMatrix4(n);const l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;r.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class id extends Pt{constructor(e,t,n,i,r,a,o,c,l){super(e,t,n,i,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Dn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let i=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,c=r-1,l;for(;o<=c;)if(i=Math.floor(o+(c-o)/2),l=n[i]-a,l<0)o=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===a)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),c=t||(a.isVector2?new J:new C);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new C,i=[],r=[],a=[],o=new C,c=new ze;for(let f=0;f<=e;f++){const b=f/e;i[f]=this.getTangentAt(b,new C)}r[0]=new C,a[0]=new C;let l=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const b=Math.acos(Rt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(o,b))}a[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(Rt(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let b=1;b<=e;b++)r[b].applyMatrix4(c.makeRotationAxis(i[b],f*b)),a[b].crossVectors(i[b],r[b])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Gc extends Dn{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new J){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class i_ extends Gc{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Hc(){let s=0,e=0,t=0,n=0;function i(r,a,o,c){s=r,e=o,t=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,l){i(a,o,l*(o-r),l*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,l,h,u){let d=(a-r)/l-(o-r)/(l+h)+(o-a)/h,f=(o-a)/h-(c-a)/(h+u)+(c-o)/u;d*=h,f*=h,i(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+n*o}}}const Kr=new C,fo=new Hc,po=new Hc,mo=new Hc;class sd extends Dn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new C){const n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let l,h;this.closed||o>0?l=i[(o-1)%r]:(Kr.subVectors(i[0],i[1]).add(i[0]),l=Kr);const u=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(Kr.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Kr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let b=Math.pow(l.distanceToSquared(u),f),g=Math.pow(u.distanceToSquared(d),f),p=Math.pow(d.distanceToSquared(h),f);g<1e-4&&(g=1),b<1e-4&&(b=g),p<1e-4&&(p=g),fo.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,b,g,p),po.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,b,g,p),mo.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,b,g,p)}else this.curveType==="catmullrom"&&(fo.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),po.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),mo.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(fo.calc(c),po.calc(c),mo.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new C().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Eh(s,e,t,n,i){const r=(n-e)*.5,a=(i-t)*.5,o=s*s,c=s*o;return(2*t-2*n+r+a)*c+(-3*t+3*n-2*r-a)*o+r*s+t}function s_(s,e){const t=1-s;return t*t*e}function r_(s,e){return 2*(1-s)*s*e}function a_(s,e){return s*s*e}function Js(s,e,t,n){return s_(s,e)+r_(s,t)+a_(s,n)}function o_(s,e){const t=1-s;return t*t*t*e}function c_(s,e){const t=1-s;return 3*t*t*s*e}function l_(s,e){return 3*(1-s)*s*s*e}function h_(s,e){return s*s*s*e}function Zs(s,e,t,n,i){return o_(s,e)+c_(s,t)+l_(s,n)+h_(s,i)}class rd extends Dn{constructor(e=new J,t=new J,n=new J,i=new J){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new J){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Zs(e,i.x,r.x,a.x,o.x),Zs(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class u_ extends Dn{constructor(e=new C,t=new C,n=new C,i=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new C){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Zs(e,i.x,r.x,a.x,o.x),Zs(e,i.y,r.y,a.y,o.y),Zs(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ad extends Dn{constructor(e=new J,t=new J){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new J){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new J){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class d_ extends Dn{constructor(e=new C,t=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new C){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new C){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class od extends Dn{constructor(e=new J,t=new J,n=new J){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new J){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Js(e,i.x,r.x,a.x),Js(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class cd extends Dn{constructor(e=new C,t=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new C){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Js(e,i.x,r.x,a.x),Js(e,i.y,r.y,a.y),Js(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ld extends Dn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new J){const n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,c=i[a===0?a:a-1],l=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(Eh(o,c.x,l.x,h.x,u.x),Eh(o,c.y,l.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new J().fromArray(i))}return this}}var ga=Object.freeze({__proto__:null,ArcCurve:i_,CatmullRomCurve3:sd,CubicBezierCurve:rd,CubicBezierCurve3:u_,EllipseCurve:Gc,LineCurve:ad,LineCurve3:d_,QuadraticBezierCurve:od,QuadraticBezierCurve3:cd,SplineCurve:ld});class f_ extends Dn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ga[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new ga[i.type]().fromJSON(i))}return this}}class mc extends f_{constructor(e){super(),this.type="Path",this.currentPoint=new J,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new ad(this.currentPoint.clone(),new J(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new od(this.currentPoint.clone(),new J(e,t),new J(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){const o=new rd(this.currentPoint.clone(),new J(e,t),new J(n,i),new J(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new ld(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,i,r,a,o,c),this}absellipse(e,t,n,i,r,a,o,c){const l=new Gc(e,t,n,i,r,a,o,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Vc extends bt{constructor(e=[new J(0,-.5),new J(.5,0),new J(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=Rt(i,0,Math.PI*2);const r=[],a=[],o=[],c=[],l=[],h=1/t,u=new C,d=new J,f=new C,b=new C,g=new C;let p=0,m=0;for(let x=0;x<=e.length-1;x++)switch(x){case 0:p=e[x+1].x-e[x].x,m=e[x+1].y-e[x].y,f.x=m*1,f.y=-p,f.z=m*0,g.copy(f),f.normalize(),c.push(f.x,f.y,f.z);break;case e.length-1:c.push(g.x,g.y,g.z);break;default:p=e[x+1].x-e[x].x,m=e[x+1].y-e[x].y,f.x=m*1,f.y=-p,f.z=m*0,b.copy(f),f.x+=g.x,f.y+=g.y,f.z+=g.z,f.normalize(),c.push(f.x,f.y,f.z),g.copy(b)}for(let x=0;x<=t;x++){const v=n+x*h*i,_=Math.sin(v),R=Math.cos(v);for(let S=0;S<=e.length-1;S++){u.x=e[S].x*_,u.y=e[S].y,u.z=e[S].x*R,a.push(u.x,u.y,u.z),d.x=x/t,d.y=S/(e.length-1),o.push(d.x,d.y);const A=c[3*S+0]*_,E=c[3*S+1],M=c[3*S+0]*R;l.push(A,E,M)}}for(let x=0;x<t;x++)for(let v=0;v<e.length-1;v++){const _=v+x*e.length,R=_,S=_+e.length,A=_+e.length+1,E=_+1;r.push(R,S,E),r.push(A,E,S)}this.setIndex(r),this.setAttribute("position",new Je(a,3)),this.setAttribute("uv",new Je(o,2)),this.setAttribute("normal",new Je(l,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vc(e.points,e.segments,e.phiStart,e.phiLength)}}class ms extends Vc{constructor(e=1,t=1,n=4,i=8){const r=new mc;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:i}}static fromJSON(e){return new ms(e.radius,e.length,e.capSegments,e.radialSegments)}}class wa extends bt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],a=[],o=[],c=[],l=new C,h=new J;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){const f=n+u/t*i;l.x=e*Math.cos(f),l.y=e*Math.sin(f),a.push(l.x,l.y,l.z),o.push(0,0,1),h.x=(a[d]/e+1)/2,h.y=(a[d+1]/e+1)/2,c.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Je(a,3)),this.setAttribute("normal",new Je(o,3)),this.setAttribute("uv",new Je(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wa(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Ve extends bt{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};const l=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let b=0;const g=[],p=n/2;let m=0;x(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Je(u,3)),this.setAttribute("normal",new Je(d,3)),this.setAttribute("uv",new Je(f,2));function x(){const _=new C,R=new C;let S=0;const A=(t-e)/n;for(let E=0;E<=r;E++){const M=[],y=E/r,L=y*(t-e)+e;for(let D=0;D<=i;D++){const U=D/i,F=U*c+o,W=Math.sin(F),B=Math.cos(F);R.x=L*W,R.y=-y*n+p,R.z=L*B,u.push(R.x,R.y,R.z),_.set(W,A,B).normalize(),d.push(_.x,_.y,_.z),f.push(U,1-y),M.push(b++)}g.push(M)}for(let E=0;E<i;E++)for(let M=0;M<r;M++){const y=g[M][E],L=g[M+1][E],D=g[M+1][E+1],U=g[M][E+1];(e>0||M!==0)&&(h.push(y,L,U),S+=3),(t>0||M!==r-1)&&(h.push(L,D,U),S+=3)}l.addGroup(m,S,0),m+=S}function v(_){const R=b,S=new J,A=new C;let E=0;const M=_===!0?e:t,y=_===!0?1:-1;for(let D=1;D<=i;D++)u.push(0,p*y,0),d.push(0,y,0),f.push(.5,.5),b++;const L=b;for(let D=0;D<=i;D++){const F=D/i*c+o,W=Math.cos(F),B=Math.sin(F);A.x=M*B,A.y=p*y,A.z=M*W,u.push(A.x,A.y,A.z),d.push(0,y,0),S.x=W*.5+.5,S.y=B*.5*y+.5,f.push(S.x,S.y),b++}for(let D=0;D<i;D++){const U=R+D,F=L+D;_===!0?h.push(F,F+1,U):h.push(F+1,F,U),E+=3}l.addGroup(m,E,_===!0?1:2),m+=E}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ve(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Jn extends Ve{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Jn(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Ea extends bt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),l(n),h(),this.setAttribute("position",new Je(r,3)),this.setAttribute("normal",new Je(r.slice(),3)),this.setAttribute("uv",new Je(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const v=new C,_=new C,R=new C;for(let S=0;S<t.length;S+=3)f(t[S+0],v),f(t[S+1],_),f(t[S+2],R),c(v,_,R,x)}function c(x,v,_,R){const S=R+1,A=[];for(let E=0;E<=S;E++){A[E]=[];const M=x.clone().lerp(_,E/S),y=v.clone().lerp(_,E/S),L=S-E;for(let D=0;D<=L;D++)D===0&&E===S?A[E][D]=M:A[E][D]=M.clone().lerp(y,D/L)}for(let E=0;E<S;E++)for(let M=0;M<2*(S-E)-1;M++){const y=Math.floor(M/2);M%2===0?(d(A[E][y+1]),d(A[E+1][y]),d(A[E][y])):(d(A[E][y+1]),d(A[E+1][y+1]),d(A[E+1][y]))}}function l(x){const v=new C;for(let _=0;_<r.length;_+=3)v.x=r[_+0],v.y=r[_+1],v.z=r[_+2],v.normalize().multiplyScalar(x),r[_+0]=v.x,r[_+1]=v.y,r[_+2]=v.z}function h(){const x=new C;for(let v=0;v<r.length;v+=3){x.x=r[v+0],x.y=r[v+1],x.z=r[v+2];const _=p(x)/2/Math.PI+.5,R=m(x)/Math.PI+.5;a.push(_,1-R)}b(),u()}function u(){for(let x=0;x<a.length;x+=6){const v=a[x+0],_=a[x+2],R=a[x+4],S=Math.max(v,_,R),A=Math.min(v,_,R);S>.9&&A<.1&&(v<.2&&(a[x+0]+=1),_<.2&&(a[x+2]+=1),R<.2&&(a[x+4]+=1))}}function d(x){r.push(x.x,x.y,x.z)}function f(x,v){const _=x*3;v.x=e[_+0],v.y=e[_+1],v.z=e[_+2]}function b(){const x=new C,v=new C,_=new C,R=new C,S=new J,A=new J,E=new J;for(let M=0,y=0;M<r.length;M+=9,y+=6){x.set(r[M+0],r[M+1],r[M+2]),v.set(r[M+3],r[M+4],r[M+5]),_.set(r[M+6],r[M+7],r[M+8]),S.set(a[y+0],a[y+1]),A.set(a[y+2],a[y+3]),E.set(a[y+4],a[y+5]),R.copy(x).add(v).add(_).divideScalar(3);const L=p(R);g(S,y+0,x,L),g(A,y+2,v,L),g(E,y+4,_,L)}}function g(x,v,_,R){R<0&&x.x===1&&(a[v]=x.x-1),_.x===0&&_.z===0&&(a[v]=R/2/Math.PI+.5)}function p(x){return Math.atan2(x.z,-x.x)}function m(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ea(e.vertices,e.indices,e.radius,e.details)}}class Ta extends Ea{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ta(e.radius,e.detail)}}class hd extends mc{constructor(e){super(e),this.uuid=mn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new mc().fromJSON(i))}return this}}const p_={triangulate:function(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=ud(s,0,i,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,c,l,h,u,d,f;if(n&&(r=x_(s,e,r,t)),s.length>80*t){o=l=s[0],c=h=s[1];for(let b=t;b<i;b+=t)u=s[b],d=s[b+1],u<o&&(o=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);f=Math.max(l-o,h-c),f=f!==0?32767/f:0}return lr(r,a,t,o,c,f,0),a}};function ud(s,e,t,n,i){let r,a;if(i===P_(s,e,t,n)>0)for(r=e;r<t;r+=n)a=Th(r,s[r],s[r+1],a);else for(r=t-n;r>=e;r-=n)a=Th(r,s[r],s[r+1],a);return a&&Aa(a,a.next)&&(ur(a),a=a.next),a}function Li(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(Aa(t,t.next)||yt(t.prev,t,t.next)===0)){if(ur(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function lr(s,e,t,n,i,r,a){if(!s)return;!a&&r&&w_(s,n,i,r);let o=s,c,l;for(;s.prev!==s.next;){if(c=s.prev,l=s.next,r?g_(s,n,i,r):m_(s)){e.push(c.i/t|0),e.push(s.i/t|0),e.push(l.i/t|0),ur(s),s=l.next,o=l.next;continue}if(s=l,s===o){a?a===1?(s=b_(Li(s),e,t),lr(s,e,t,n,i,r,2)):a===2&&__(s,e,t,n,i,r):lr(Li(s),e,t,n,i,r,1);break}}}function m_(s){const e=s.prev,t=s,n=s.next;if(yt(e,t,n)>=0)return!1;const i=e.x,r=t.x,a=n.x,o=e.y,c=t.y,l=n.y,h=i<r?i<a?i:a:r<a?r:a,u=o<c?o<l?o:l:c<l?c:l,d=i>r?i>a?i:a:r>a?r:a,f=o>c?o>l?o:l:c>l?c:l;let b=n.next;for(;b!==e;){if(b.x>=h&&b.x<=d&&b.y>=u&&b.y<=f&&ns(i,o,r,c,a,l,b.x,b.y)&&yt(b.prev,b,b.next)>=0)return!1;b=b.next}return!0}function g_(s,e,t,n){const i=s.prev,r=s,a=s.next;if(yt(i,r,a)>=0)return!1;const o=i.x,c=r.x,l=a.x,h=i.y,u=r.y,d=a.y,f=o<c?o<l?o:l:c<l?c:l,b=h<u?h<d?h:d:u<d?u:d,g=o>c?o>l?o:l:c>l?c:l,p=h>u?h>d?h:d:u>d?u:d,m=gc(f,b,e,t,n),x=gc(g,p,e,t,n);let v=s.prevZ,_=s.nextZ;for(;v&&v.z>=m&&_&&_.z<=x;){if(v.x>=f&&v.x<=g&&v.y>=b&&v.y<=p&&v!==i&&v!==a&&ns(o,h,c,u,l,d,v.x,v.y)&&yt(v.prev,v,v.next)>=0||(v=v.prevZ,_.x>=f&&_.x<=g&&_.y>=b&&_.y<=p&&_!==i&&_!==a&&ns(o,h,c,u,l,d,_.x,_.y)&&yt(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;v&&v.z>=m;){if(v.x>=f&&v.x<=g&&v.y>=b&&v.y<=p&&v!==i&&v!==a&&ns(o,h,c,u,l,d,v.x,v.y)&&yt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;_&&_.z<=x;){if(_.x>=f&&_.x<=g&&_.y>=b&&_.y<=p&&_!==i&&_!==a&&ns(o,h,c,u,l,d,_.x,_.y)&&yt(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function b_(s,e,t){let n=s;do{const i=n.prev,r=n.next.next;!Aa(i,r)&&dd(i,n,n.next,r)&&hr(i,r)&&hr(r,i)&&(e.push(i.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),ur(n),ur(n.next),n=s=r),n=n.next}while(n!==s);return Li(n)}function __(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&A_(a,o)){let c=fd(a,o);a=Li(a,a.next),c=Li(c,c.next),lr(a,e,t,n,i,r,0),lr(c,e,t,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function x_(s,e,t,n){const i=[];let r,a,o,c,l;for(r=0,a=e.length;r<a;r++)o=e[r]*n,c=r<a-1?e[r+1]*n:s.length,l=ud(s,o,c,n,!1),l===l.next&&(l.steiner=!0),i.push(T_(l));for(i.sort(v_),r=0;r<i.length;r++)t=y_(i[r],t);return t}function v_(s,e){return s.x-e.x}function y_(s,e){const t=M_(s,e);if(!t)return e;const n=fd(t,s);return Li(n,n.next),Li(t,t.next)}function M_(s,e){let t=e,n=-1/0,i;const r=s.x,a=s.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){const d=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,i=t.x<t.next.x?t:t.next,d===r))return i}t=t.next}while(t!==e);if(!i)return null;const o=i,c=i.x,l=i.y;let h=1/0,u;t=i;do r>=t.x&&t.x>=c&&r!==t.x&&ns(a<l?r:n,a,c,l,a<l?n:r,a,t.x,t.y)&&(u=Math.abs(a-t.y)/(r-t.x),hr(t,s)&&(u<h||u===h&&(t.x>i.x||t.x===i.x&&S_(i,t)))&&(i=t,h=u)),t=t.next;while(t!==o);return i}function S_(s,e){return yt(s.prev,s,e.prev)<0&&yt(e.next,s,s.next)<0}function w_(s,e,t,n){let i=s;do i.z===0&&(i.z=gc(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,E_(i)}function E_(s){let e,t,n,i,r,a,o,c,l=1;do{for(t=s,s=null,r=null,a=0;t;){for(a++,n=t,o=0,e=0;e<l&&(o++,n=n.nextZ,!!n);e++);for(c=l;o>0||c>0&&n;)o!==0&&(c===0||!n||t.z<=n.z)?(i=t,t=t.nextZ,o--):(i=n,n=n.nextZ,c--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;t=n}r.nextZ=null,l*=2}while(a>1);return s}function gc(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function T_(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function ns(s,e,t,n,i,r,a,o){return(i-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(i-a)*(n-o)}function A_(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!R_(s,e)&&(hr(s,e)&&hr(e,s)&&C_(s,e)&&(yt(s.prev,s,e.prev)||yt(s,e.prev,e))||Aa(s,e)&&yt(s.prev,s,s.next)>0&&yt(e.prev,e,e.next)>0)}function yt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function Aa(s,e){return s.x===e.x&&s.y===e.y}function dd(s,e,t,n){const i=Zr(yt(s,e,t)),r=Zr(yt(s,e,n)),a=Zr(yt(t,n,s)),o=Zr(yt(t,n,e));return!!(i!==r&&a!==o||i===0&&Jr(s,t,e)||r===0&&Jr(s,n,e)||a===0&&Jr(t,s,n)||o===0&&Jr(t,e,n))}function Jr(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Zr(s){return s>0?1:s<0?-1:0}function R_(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&dd(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function hr(s,e){return yt(s.prev,s,s.next)<0?yt(s,e,s.next)>=0&&yt(s,s.prev,e)>=0:yt(s,e,s.prev)<0||yt(s,s.next,e)<0}function C_(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function fd(s,e){const t=new bc(s.i,s.x,s.y),n=new bc(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Th(s,e,t,n){const i=new bc(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function ur(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function bc(s,e,t){this.i=s,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function P_(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class Qs{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return Qs.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];Ah(e),Rh(n,e);let a=e.length;t.forEach(Ah);for(let c=0;c<t.length;c++)i.push(a),a+=t[c].length,Rh(n,t[c]);const o=p_.triangulate(n,i);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}}function Ah(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function Rh(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Wc extends bt{constructor(e=new hd([new J(.5,.5),new J(-.5,.5),new J(-.5,-.5),new J(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],r=[];for(let o=0,c=e.length;o<c;o++){const l=e[o];a(l)}this.setAttribute("position",new Je(i,3)),this.setAttribute("uv",new Je(r,2)),this.computeVertexNormals();function a(o){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,b=t.bevelSize!==void 0?t.bevelSize:f-.1,g=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,x=t.UVGenerator!==void 0?t.UVGenerator:L_;let v,_=!1,R,S,A,E;m&&(v=m.getSpacedPoints(h),_=!0,d=!1,R=m.computeFrenetFrames(h,!1),S=new C,A=new C,E=new C),d||(p=0,f=0,b=0,g=0);const M=o.extractPoints(l);let y=M.shape;const L=M.holes;if(!Qs.isClockWise(y)){y=y.reverse();for(let Q=0,ie=L.length;Q<ie;Q++){const I=L[Q];Qs.isClockWise(I)&&(L[Q]=I.reverse())}}const U=Qs.triangulateShape(y,L),F=y;for(let Q=0,ie=L.length;Q<ie;Q++){const I=L[Q];y=y.concat(I)}function W(Q,ie,I){return ie||console.error("THREE.ExtrudeGeometry: vec does not exist"),Q.clone().addScaledVector(ie,I)}const B=y.length,$=U.length;function V(Q,ie,I){let Ce,te,ve;const le=Q.x-ie.x,Fe=Q.y-ie.y,_e=I.x-Q.x,P=I.y-Q.y,w=le*le+Fe*Fe,z=le*P-Fe*_e;if(Math.abs(z)>Number.EPSILON){const Y=Math.sqrt(w),ee=Math.sqrt(_e*_e+P*P),K=ie.x-Fe/Y,Ee=ie.y+le/Y,de=I.x-P/ee,xe=I.y+_e/ee,Qe=((de-K)*P-(xe-Ee)*_e)/(le*P-Fe*_e);Ce=K+le*Qe-Q.x,te=Ee+Fe*Qe-Q.y;const ne=Ce*Ce+te*te;if(ne<=2)return new J(Ce,te);ve=Math.sqrt(ne/2)}else{let Y=!1;le>Number.EPSILON?_e>Number.EPSILON&&(Y=!0):le<-Number.EPSILON?_e<-Number.EPSILON&&(Y=!0):Math.sign(Fe)===Math.sign(P)&&(Y=!0),Y?(Ce=-Fe,te=le,ve=Math.sqrt(w)):(Ce=le,te=Fe,ve=Math.sqrt(w/2))}return new J(Ce/ve,te/ve)}const se=[];for(let Q=0,ie=F.length,I=ie-1,Ce=Q+1;Q<ie;Q++,I++,Ce++)I===ie&&(I=0),Ce===ie&&(Ce=0),se[Q]=V(F[Q],F[I],F[Ce]);const oe=[];let pe,Ie=se.concat();for(let Q=0,ie=L.length;Q<ie;Q++){const I=L[Q];pe=[];for(let Ce=0,te=I.length,ve=te-1,le=Ce+1;Ce<te;Ce++,ve++,le++)ve===te&&(ve=0),le===te&&(le=0),pe[Ce]=V(I[Ce],I[ve],I[le]);oe.push(pe),Ie=Ie.concat(pe)}for(let Q=0;Q<p;Q++){const ie=Q/p,I=f*Math.cos(ie*Math.PI/2),Ce=b*Math.sin(ie*Math.PI/2)+g;for(let te=0,ve=F.length;te<ve;te++){const le=W(F[te],se[te],Ce);ce(le.x,le.y,-I)}for(let te=0,ve=L.length;te<ve;te++){const le=L[te];pe=oe[te];for(let Fe=0,_e=le.length;Fe<_e;Fe++){const P=W(le[Fe],pe[Fe],Ce);ce(P.x,P.y,-I)}}}const qe=b+g;for(let Q=0;Q<B;Q++){const ie=d?W(y[Q],Ie[Q],qe):y[Q];_?(A.copy(R.normals[0]).multiplyScalar(ie.x),S.copy(R.binormals[0]).multiplyScalar(ie.y),E.copy(v[0]).add(A).add(S),ce(E.x,E.y,E.z)):ce(ie.x,ie.y,0)}for(let Q=1;Q<=h;Q++)for(let ie=0;ie<B;ie++){const I=d?W(y[ie],Ie[ie],qe):y[ie];_?(A.copy(R.normals[Q]).multiplyScalar(I.x),S.copy(R.binormals[Q]).multiplyScalar(I.y),E.copy(v[Q]).add(A).add(S),ce(E.x,E.y,E.z)):ce(I.x,I.y,u/h*Q)}for(let Q=p-1;Q>=0;Q--){const ie=Q/p,I=f*Math.cos(ie*Math.PI/2),Ce=b*Math.sin(ie*Math.PI/2)+g;for(let te=0,ve=F.length;te<ve;te++){const le=W(F[te],se[te],Ce);ce(le.x,le.y,u+I)}for(let te=0,ve=L.length;te<ve;te++){const le=L[te];pe=oe[te];for(let Fe=0,_e=le.length;Fe<_e;Fe++){const P=W(le[Fe],pe[Fe],Ce);_?ce(P.x,P.y+v[h-1].y,v[h-1].x+I):ce(P.x,P.y,u+I)}}}q(),re();function q(){const Q=i.length/3;if(d){let ie=0,I=B*ie;for(let Ce=0;Ce<$;Ce++){const te=U[Ce];De(te[2]+I,te[1]+I,te[0]+I)}ie=h+p*2,I=B*ie;for(let Ce=0;Ce<$;Ce++){const te=U[Ce];De(te[0]+I,te[1]+I,te[2]+I)}}else{for(let ie=0;ie<$;ie++){const I=U[ie];De(I[2],I[1],I[0])}for(let ie=0;ie<$;ie++){const I=U[ie];De(I[0]+B*h,I[1]+B*h,I[2]+B*h)}}n.addGroup(Q,i.length/3-Q,0)}function re(){const Q=i.length/3;let ie=0;we(F,ie),ie+=F.length;for(let I=0,Ce=L.length;I<Ce;I++){const te=L[I];we(te,ie),ie+=te.length}n.addGroup(Q,i.length/3-Q,1)}function we(Q,ie){let I=Q.length;for(;--I>=0;){const Ce=I;let te=I-1;te<0&&(te=Q.length-1);for(let ve=0,le=h+p*2;ve<le;ve++){const Fe=B*ve,_e=B*(ve+1),P=ie+Ce+Fe,w=ie+te+Fe,z=ie+te+_e,Y=ie+Ce+_e;Ge(P,w,z,Y)}}}function ce(Q,ie,I){c.push(Q),c.push(ie),c.push(I)}function De(Q,ie,I){ke(Q),ke(ie),ke(I);const Ce=i.length/3,te=x.generateTopUV(n,i,Ce-3,Ce-2,Ce-1);nt(te[0]),nt(te[1]),nt(te[2])}function Ge(Q,ie,I,Ce){ke(Q),ke(ie),ke(Ce),ke(ie),ke(I),ke(Ce);const te=i.length/3,ve=x.generateSideWallUV(n,i,te-6,te-3,te-2,te-1);nt(ve[0]),nt(ve[1]),nt(ve[3]),nt(ve[1]),nt(ve[2]),nt(ve[3])}function ke(Q){i.push(c[Q*3+0]),i.push(c[Q*3+1]),i.push(c[Q*3+2])}function nt(Q){r.push(Q.x),r.push(Q.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return I_(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new ga[i.type]().fromJSON(i)),new Wc(n,e.options)}}const L_={generateTopUV:function(s,e,t,n,i){const r=e[t*3],a=e[t*3+1],o=e[n*3],c=e[n*3+1],l=e[i*3],h=e[i*3+1];return[new J(r,a),new J(o,c),new J(l,h)]},generateSideWallUV:function(s,e,t,n,i,r){const a=e[t*3],o=e[t*3+1],c=e[t*3+2],l=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[i*3],f=e[i*3+1],b=e[i*3+2],g=e[r*3],p=e[r*3+1],m=e[r*3+2];return Math.abs(o-h)<Math.abs(a-l)?[new J(a,1-c),new J(l,1-u),new J(d,1-b),new J(g,1-m)]:[new J(o,1-c),new J(h,1-u),new J(f,1-b),new J(p,1-m)]}};function I_(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class jc extends bt{constructor(e=.5,t=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],c=[],l=[],h=[];let u=e;const d=(t-e)/i,f=new C,b=new J;for(let g=0;g<=i;g++){for(let p=0;p<=n;p++){const m=r+p/n*a;f.x=u*Math.cos(m),f.y=u*Math.sin(m),c.push(f.x,f.y,f.z),l.push(0,0,1),b.x=(f.x/t+1)/2,b.y=(f.y/t+1)/2,h.push(b.x,b.y)}u+=d}for(let g=0;g<i;g++){const p=g*(n+1);for(let m=0;m<n;m++){const x=m+p,v=x,_=x+n+1,R=x+n+2,S=x+1;o.push(v,_,S),o.push(_,R,S)}}this.setIndex(o),this.setAttribute("position",new Je(c,3)),this.setAttribute("normal",new Je(l,3)),this.setAttribute("uv",new Je(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jc(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Et extends bt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const h=[],u=new C,d=new C,f=[],b=[],g=[],p=[];for(let m=0;m<=n;m++){const x=[],v=m/n;let _=0;m===0&&a===0?_=.5/t:m===n&&c===Math.PI&&(_=-.5/t);for(let R=0;R<=t;R++){const S=R/t;u.x=-e*Math.cos(i+S*r)*Math.sin(a+v*o),u.y=e*Math.cos(a+v*o),u.z=e*Math.sin(i+S*r)*Math.sin(a+v*o),b.push(u.x,u.y,u.z),d.copy(u).normalize(),g.push(d.x,d.y,d.z),p.push(S+_,1-v),x.push(l++)}h.push(x)}for(let m=0;m<n;m++)for(let x=0;x<t;x++){const v=h[m][x+1],_=h[m][x],R=h[m+1][x],S=h[m+1][x+1];(m!==0||a>0)&&f.push(v,_,S),(m!==n-1||c<Math.PI)&&f.push(_,R,S)}this.setIndex(f),this.setAttribute("position",new Je(b,3)),this.setAttribute("normal",new Je(g,3)),this.setAttribute("uv",new Je(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Et(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Xc extends Ea{constructor(e=1,t=0){const n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Xc(e.radius,e.detail)}}class gs extends bt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const a=[],o=[],c=[],l=[],h=new C,u=new C,d=new C;for(let f=0;f<=n;f++)for(let b=0;b<=i;b++){const g=b/i*r,p=f/n*Math.PI*2;u.x=(e+t*Math.cos(p))*Math.cos(g),u.y=(e+t*Math.cos(p))*Math.sin(g),u.z=t*Math.sin(p),o.push(u.x,u.y,u.z),h.x=e*Math.cos(g),h.y=e*Math.sin(g),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(b/i),l.push(f/n)}for(let f=1;f<=n;f++)for(let b=1;b<=i;b++){const g=(i+1)*f+b-1,p=(i+1)*(f-1)+b-1,m=(i+1)*(f-1)+b,x=(i+1)*f+b;a.push(g,p,x),a.push(p,m,x)}this.setIndex(a),this.setAttribute("position",new Je(o,3)),this.setAttribute("normal",new Je(c,3)),this.setAttribute("uv",new Je(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gs(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class qc extends bt{constructor(e=new cd(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),t=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:i,closed:r};const a=e.computeFrenetFrames(t,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new C,c=new C,l=new J;let h=new C;const u=[],d=[],f=[],b=[];g(),this.setIndex(b),this.setAttribute("position",new Je(u,3)),this.setAttribute("normal",new Je(d,3)),this.setAttribute("uv",new Je(f,2));function g(){for(let v=0;v<t;v++)p(v);p(r===!1?t:0),x(),m()}function p(v){h=e.getPointAt(v/t,h);const _=a.normals[v],R=a.binormals[v];for(let S=0;S<=i;S++){const A=S/i*Math.PI*2,E=Math.sin(A),M=-Math.cos(A);c.x=M*_.x+E*R.x,c.y=M*_.y+E*R.y,c.z=M*_.z+E*R.z,c.normalize(),d.push(c.x,c.y,c.z),o.x=h.x+n*c.x,o.y=h.y+n*c.y,o.z=h.z+n*c.z,u.push(o.x,o.y,o.z)}}function m(){for(let v=1;v<=t;v++)for(let _=1;_<=i;_++){const R=(i+1)*(v-1)+(_-1),S=(i+1)*v+(_-1),A=(i+1)*v+_,E=(i+1)*(v-1)+_;b.push(R,S,E),b.push(S,A,E)}}function x(){for(let v=0;v<=t;v++)for(let _=0;_<=i;_++)l.x=v/t,l.y=_/i,f.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new qc(new ga[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class D_ extends Xt{static get type(){return"RawShaderMaterial"}constructor(e){super(e),this.isRawShaderMaterial=!0}}class $t extends an{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new he(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new he(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xa,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Un extends $t{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new J(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Rt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new he(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new he(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new he(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class U_ extends an{static get type(){return"MeshPhongMaterial"}constructor(e){super(),this.isMeshPhongMaterial=!0,this.color=new he(16777215),this.specular=new he(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new he(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xa,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=ba,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ut extends an{static get type(){return"MeshLambertMaterial"}constructor(e){super(),this.isMeshLambertMaterial=!0,this.color=new he(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new he(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xa,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new on,this.combine=ba,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}function Qr(s,e,t){return!s||!t&&s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function N_(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function F_(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Ch(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let c=0;c!==e;++c)i[a++]=s[o+c]}return i}function pd(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push.apply(t,a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)}class pr{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class O_ extends pr{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:fl,endingEnd:fl}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,a=e+1,o=i[r],c=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case pl:r=e,o=2*t-n;break;case ml:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case pl:a=e,c=2*n-t;break;case ml:a=1,c=n+i[1]-i[0];break;default:a=e-1,c=t}const l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-o),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,b=(n-t)/(i-t),g=b*b,p=g*b,m=-d*p+2*d*g-d*b,x=(1+d)*p+(-1.5-2*d)*g+(-.5+d)*b+1,v=(-1-f)*p+(1.5+f)*g+.5*b,_=f*p-f*g;for(let R=0;R!==o;++R)r[R]=m*a[h+R]+x*a[l+R]+v*a[c+R]+_*a[u+R];return r}}class k_ extends pr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=e*o,l=c-o,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[l+d]*u+a[c+d]*h;return r}}class B_ extends pr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Nn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Qr(t,this.TimeBufferType),this.values=Qr(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Qr(e.times,Array),values:Qr(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new B_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new k_(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new O_(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case ir:t=this.InterpolantFactoryMethodDiscrete;break;case sr:t=this.InterpolantFactoryMethodLinear;break;case Ua:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ir;case this.InterpolantFactoryMethodLinear:return sr;case this.InterpolantFactoryMethodSmooth:return Ua}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),e=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),e=!1;break}a=c}if(i!==void 0&&N_(i))for(let o=0,c=i.length;o!==c;++o){const l=i[o];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Ua,r=e.length-1;let a=1;for(let o=1;o<r;++o){let c=!1;const l=e[o],h=e[o+1];if(l!==h&&(o!==1||l!==e[0]))if(i)c=!0;else{const u=o*n,d=u-n,f=u+n;for(let b=0;b!==n;++b){const g=t[u+b];if(g!==t[d+b]||g!==t[f+b]){c=!0;break}}}if(c){if(o!==a){e[a]=e[o];const u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,c=a*n,l=0;l!==n;++l)t[c+l]=t[o+l];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}Nn.prototype.TimeBufferType=Float32Array;Nn.prototype.ValueBufferType=Float32Array;Nn.prototype.DefaultInterpolation=sr;class ws extends Nn{constructor(e,t,n){super(e,t,n)}}ws.prototype.ValueTypeName="bool";ws.prototype.ValueBufferType=Array;ws.prototype.DefaultInterpolation=ir;ws.prototype.InterpolantFactoryMethodLinear=void 0;ws.prototype.InterpolantFactoryMethodSmooth=void 0;class md extends Nn{}md.prototype.ValueTypeName="color";class bs extends Nn{}bs.prototype.ValueTypeName="number";class z_ extends pr{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-t)/(i-t);let l=e*o;for(let h=l+o;l!==h;l+=4)Ln.slerpFlat(r,0,a,l-o,a,l,c);return r}}class _s extends Nn{InterpolantFactoryMethodLinear(e){return new z_(this.times,this.values,this.getValueSize(),e)}}_s.prototype.ValueTypeName="quaternion";_s.prototype.InterpolantFactoryMethodSmooth=void 0;class Es extends Nn{constructor(e,t,n){super(e,t,n)}}Es.prototype.ValueTypeName="string";Es.prototype.ValueBufferType=Array;Es.prototype.DefaultInterpolation=ir;Es.prototype.InterpolantFactoryMethodLinear=void 0;Es.prototype.InterpolantFactoryMethodSmooth=void 0;class xs extends Nn{}xs.prototype.ValueTypeName="vector";class G_{constructor(e="",t=-1,n=[],i=af){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=mn(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(V_(n[a]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,a=n.length;r!==a;++r)t.push(Nn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,a=[];for(let o=0;o<r;o++){let c=[],l=[];c.push((o+r-1)%r,o,(o+1)%r),l.push(0,1,0);const h=F_(c);c=Ch(c,1,h),l=Ch(l,1,h),!i&&c[0]===0&&(c.push(r),l.push(l[0])),a.push(new bs(".morphTargetInfluences["+t[o].name+"]",c,l).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,c=e.length;o<c;o++){const l=e[o],h=l.name.match(r);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(l)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const n=function(u,d,f,b,g){if(f.length!==0){const p=[],m=[];pd(f,p,m,b),p.length!==0&&g.push(new u(d,p,m))}},i=[],r=e.name||"default",a=e.fps||30,o=e.blendMode;let c=e.length||-1;const l=e.hierarchy||[];for(let u=0;u<l.length;u++){const d=l[u].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const f={};let b;for(b=0;b<d.length;b++)if(d[b].morphTargets)for(let g=0;g<d[b].morphTargets.length;g++)f[d[b].morphTargets[g]]=-1;for(const g in f){const p=[],m=[];for(let x=0;x!==d[b].morphTargets.length;++x){const v=d[b];p.push(v.time),m.push(v.morphTarget===g?1:0)}i.push(new bs(".morphTargetInfluence["+g+"]",p,m))}c=f.length*a}else{const f=".bones["+t[u].name+"]";n(xs,f+".position",d,"pos",i),n(_s,f+".quaternion",d,"rot",i),n(xs,f+".scale",d,"scl",i)}}return i.length===0?null:new this(r,c,i,o)}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function H_(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return bs;case"vector":case"vector2":case"vector3":case"vector4":return xs;case"color":return md;case"quaternion":return _s;case"bool":case"boolean":return ws;case"string":return Es}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function V_(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=H_(s.type);if(s.times===void 0){const t=[],n=[];pd(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const ui={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class W_{constructor(e,t,n){const i=this;let r=!1,a=0,o=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){const u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){const f=l[u],b=l[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return b}return null}}}const j_=new W_;class Ii{constructor(e){this.manager=e!==void 0?e:j_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Ii.DEFAULT_MATERIAL_NAME="__DEFAULT";const Vn={};class X_ extends Error{constructor(e,t){super(e),this.response=t}}class Yc extends Ii{constructor(e){super(e)}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=ui.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(Vn[e]!==void 0){Vn[e].push({onLoad:t,onProgress:n,onError:i});return}Vn[e]=[],Vn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,c=this.responseType;fetch(a).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=Vn[e],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=d?parseInt(d):0,b=f!==0;let g=0;const p=new ReadableStream({start(m){x();function x(){u.read().then(({done:v,value:_})=>{if(v)m.close();else{g+=_.byteLength;const R=new ProgressEvent("progress",{lengthComputable:b,loaded:g,total:f});for(let S=0,A=h.length;S<A;S++){const E=h[S];E.onProgress&&E.onProgress(R)}m.enqueue(_),x()}},v=>{m.error(v)})}}});return new Response(p)}else throw new X_(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return l.json();default:if(o===void 0)return l.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return l.arrayBuffer().then(b=>f.decode(b))}}}).then(l=>{ui.add(e,l);const h=Vn[e];delete Vn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(l)}}).catch(l=>{const h=Vn[e];if(h===void 0)throw this.manager.itemError(e),l;delete Vn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class q_ extends Ii{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=ui.get(e);if(a!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a;const o=rr("img");function c(){h(),ui.add(e,this),t&&t(this),r.manager.itemEnd(e)}function l(u){h(),i&&i(u),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",c,!1),o.removeEventListener("error",l,!1)}return o.addEventListener("load",c,!1),o.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),r.manager.itemStart(e),o.src=e,o}}class Y_ extends Ii{constructor(e){super(e)}load(e,t,n,i){const r=this,a=new Oc,o=new Yc(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(r.withCredentials),o.load(e,function(c){let l;try{l=r.parse(c)}catch(h){if(i!==void 0)i(h);else{console.error(h);return}}l.image!==void 0?a.image=l.image:l.data!==void 0&&(a.image.width=l.width,a.image.height=l.height,a.image.data=l.data),a.wrapS=l.wrapS!==void 0?l.wrapS:Cn,a.wrapT=l.wrapT!==void 0?l.wrapT:Cn,a.magFilter=l.magFilter!==void 0?l.magFilter:Nt,a.minFilter=l.minFilter!==void 0?l.minFilter:Nt,a.anisotropy=l.anisotropy!==void 0?l.anisotropy:1,l.colorSpace!==void 0&&(a.colorSpace=l.colorSpace),l.flipY!==void 0&&(a.flipY=l.flipY),l.format!==void 0&&(a.format=l.format),l.type!==void 0&&(a.type=l.type),l.mipmaps!==void 0&&(a.mipmaps=l.mipmaps,a.minFilter=wn),l.mipmapCount===1&&(a.minFilter=Nt),l.generateMipmaps!==void 0&&(a.generateMipmaps=l.generateMipmaps),a.needsUpdate=!0,t&&t(a,l)},n,i),a}}class Zn extends Ii{constructor(e){super(e)}load(e,t,n,i){const r=new Pt,a=new q_(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class Ra extends ft{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new he(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Ph extends Ra{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ft.DEFAULT_UP),this.updateMatrix(),this.groundColor=new he(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const go=new ze,Lh=new C,Ih=new C;class Kc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new J(512,512),this.map=null,this.mapPass=null,this.matrix=new ze,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Nc,this._frameExtents=new J(1,1),this._viewportCount=1,this._viewports=[new rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Lh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Lh),Ih.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ih),t.updateMatrixWorld(),go.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(go),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(go)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class K_ extends Kc{constructor(){super(new jt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,n=fs*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class J_ extends Ra{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ft.DEFAULT_UP),this.updateMatrix(),this.target=new ft,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new K_}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const Dh=new ze,Bs=new C,bo=new C;class Z_ extends Kc{constructor(){super(new jt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new J(4,2),this._viewportCount=6,this._viewports=[new rt(2,1,1,1),new rt(0,1,1,1),new rt(3,1,1,1),new rt(1,1,1,1),new rt(3,0,1,1),new rt(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Bs.setFromMatrixPosition(e.matrixWorld),n.position.copy(Bs),bo.copy(n.position),bo.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(bo),n.updateMatrixWorld(),i.makeTranslation(-Bs.x,-Bs.y,-Bs.z),Dh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Dh)}}class Q_ extends Ra{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Z_}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class $_ extends Kc{constructor(){super(new ya(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class gd extends Ra{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ft.DEFAULT_UP),this.updateMatrix(),this.target=new ft,this.shadow=new $_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class $s{static decodeText(e){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let n=0,i=e.length;n<i;n++)t+=String.fromCharCode(e[n]);try{return decodeURIComponent(escape(t))}catch{return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class ex extends Ii{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=ui.get(e);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(l=>{t&&t(l),r.manager.itemEnd(e)}).catch(l=>{i&&i(l)});return}return setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0),a}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader;const c=fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(l){return ui.add(e,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){i&&i(l),ui.remove(e),r.manager.itemError(e),r.manager.itemEnd(e)});ui.add(e,c),r.manager.itemStart(e)}}class tx{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Uh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Uh();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Uh(){return performance.now()}const Jc="\\[\\]\\.:\\/",nx=new RegExp("["+Jc+"]","g"),Zc="[^"+Jc+"]",ix="[^"+Jc.replace("\\.","")+"]",sx=/((?:WC+[\/:])*)/.source.replace("WC",Zc),rx=/(WCOD+)?/.source.replace("WCOD",ix),ax=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Zc),ox=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Zc),cx=new RegExp("^"+sx+rx+ax+ox+"$"),lx=["material","materials","bones","map"];class hx{constructor(e,t,n){const i=n||dt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class dt{constructor(e,t,n){this.path=t,this.parsedPath=n||dt.parseTrackName(t),this.node=dt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new dt.Composite(e,t,n):new dt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(nx,"")}static parseTrackName(e){const t=cx.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);lx.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const c=n(o.children);if(c)return c}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=dt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const a=e[i];if(a===void 0){const l=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}dt.Composite=hx;dt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};dt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};dt.prototype.GetterByBindingType=[dt.prototype._getValue_direct,dt.prototype._getValue_array,dt.prototype._getValue_arrayElement,dt.prototype._getValue_toArray];dt.prototype.SetterByBindingTypeAndVersioning=[[dt.prototype._setValue_direct,dt.prototype._setValue_direct_setNeedsUpdate,dt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_array,dt.prototype._setValue_array_setNeedsUpdate,dt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_arrayElement,dt.prototype._setValue_arrayElement_setNeedsUpdate,dt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[dt.prototype._setValue_fromArray,dt.prototype._setValue_fromArray_setNeedsUpdate,dt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const Nh=new ze;class ux{constructor(e,t,n=0,i=1/0){this.ray=new fr(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Uc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Nh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Nh),this}intersectObject(e,t=!0,n=[]){return _c(e,this,n,t),n.sort(Fh),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)_c(e[i],this,n,t);return n.sort(Fh),n}}function Fh(s,e){return s.distance-e.distance}function _c(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)_c(r[a],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:wc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=wc);function er(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,c=new bt;let l=0;for(let h=0;h<s.length;++h){const u=s[h];let d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,f,h),l+=f}}if(t){let h=0;const u=[];for(let d=0;d<s.length;++d){const f=s[d].index;for(let b=0;b<f.count;++b)u.push(f.getX(b)+h);h+=s[d].attributes.position.count}c.setIndex(u)}for(const h in r){const u=Oh(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let g=0;g<a[h].length;++g)f.push(a[h][g][d]);const b=Oh(f);if(!b)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(b)}}return c}function Oh(s){let e,t,n,i=-1,r=0;for(let l=0;l<s.length;++l){const h=s[l];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}const a=new e(r),o=new Mt(a,t,n);let c=0;for(let l=0;l<s.length;++l){const h=s[l];if(h.isInterleavedBufferAttribute){const u=c/t;for(let d=0,f=h.count;d<f;d++)for(let b=0;b<t;b++){const g=h.getComponent(d,b);o.setComponent(d+u,b,g)}}else a.set(h.array,c);c+=h.count*t}return i!==void 0&&(o.gpuType=i),o}function kh(s,e){if(e===of)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===hc||e===Fu){let t=s.getIndex();if(t===null){const a=[],o=s.getAttribute("position");if(o!==void 0){for(let c=0;c<o.count;c++)a.push(c);s.setIndex(a),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const n=t.count-2,i=[];if(e===hc)for(let a=1;a<=n;a++)i.push(t.getX(0)),i.push(t.getX(a)),i.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(i.push(t.getX(a)),i.push(t.getX(a+1)),i.push(t.getX(a+2))):(i.push(t.getX(a+2)),i.push(t.getX(a+1)),i.push(t.getX(a)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}class Ca extends Ii{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new gx(t)}),this.register(function(t){return new bx(t)}),this.register(function(t){return new Tx(t)}),this.register(function(t){return new Ax(t)}),this.register(function(t){return new Rx(t)}),this.register(function(t){return new xx(t)}),this.register(function(t){return new vx(t)}),this.register(function(t){return new yx(t)}),this.register(function(t){return new Mx(t)}),this.register(function(t){return new mx(t)}),this.register(function(t){return new Sx(t)}),this.register(function(t){return new _x(t)}),this.register(function(t){return new Ex(t)}),this.register(function(t){return new wx(t)}),this.register(function(t){return new fx(t)}),this.register(function(t){return new Cx(t)}),this.register(function(t){return new Px(t)})}load(e,t,n,i){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const l=$s.extractUrlBase(e);a=$s.resolveURL(l,this.path)}else a=$s.extractUrlBase(e);this.manager.itemStart(e);const o=function(l){i?i(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new Yc(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r;const a={},o={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===bd){try{a[Ze.KHR_BINARY_GLTF]=new Lx(e)}catch(u){i&&i(u);return}r=JSON.parse(a[Ze.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new Wx(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](l);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case Ze.KHR_MATERIALS_UNLIT:a[u]=new px;break;case Ze.KHR_DRACO_MESH_COMPRESSION:a[u]=new Ix(r,this.dracoLoader);break;case Ze.KHR_TEXTURE_TRANSFORM:a[u]=new Dx;break;case Ze.KHR_MESH_QUANTIZATION:a[u]=new Ux;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}l.setExtensions(a),l.setPlugins(o),l.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}}function dx(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}const Ze={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class fx{constructor(e){this.parser=e,this.name=Ze.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let l;const h=new he(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],Gt);const u=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new gd(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new Q_(h),l.distance=u;break;case"spot":l=new J_(h),l.distance=u,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),l.decay=2,jn(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),i=Promise.resolve(l),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(c){return n._getNodeRef(t.cache,o,c)})}}class px{constructor(){this.name=Ze.KHR_MATERIALS_UNLIT}getMaterialType(){return wt}extendParams(e,t,n){const i=[];e.color=new he(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],Gt),e.opacity=a[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,gt))}return Promise.all(i)}}class mx{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}}class gx{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];if(a.clearcoatFactor!==void 0&&(t.clearcoat=a.clearcoatFactor),a.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",a.clearcoatTexture)),a.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=a.clearcoatRoughnessFactor),a.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",a.clearcoatRoughnessTexture)),a.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",a.clearcoatNormalTexture)),a.clearcoatNormalTexture.scale!==void 0)){const o=a.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new J(o,o)}return Promise.all(r)}}class bx{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_DISPERSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}}class _x{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return a.iridescenceFactor!==void 0&&(t.iridescence=a.iridescenceFactor),a.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",a.iridescenceTexture)),a.iridescenceIor!==void 0&&(t.iridescenceIOR=a.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),a.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=a.iridescenceThicknessMinimum),a.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=a.iridescenceThicknessMaximum),a.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",a.iridescenceThicknessTexture)),Promise.all(r)}}class xx{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SHEEN}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[];t.sheenColor=new he(0,0,0),t.sheenRoughness=0,t.sheen=1;const a=i.extensions[this.name];if(a.sheenColorFactor!==void 0){const o=a.sheenColorFactor;t.sheenColor.setRGB(o[0],o[1],o[2],Gt)}return a.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=a.sheenRoughnessFactor),a.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",a.sheenColorTexture,gt)),a.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",a.sheenRoughnessTexture)),Promise.all(r)}}class vx{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return a.transmissionFactor!==void 0&&(t.transmission=a.transmissionFactor),a.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",a.transmissionTexture)),Promise.all(r)}}class yx{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_VOLUME}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];t.thickness=a.thicknessFactor!==void 0?a.thicknessFactor:0,a.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",a.thicknessTexture)),t.attenuationDistance=a.attenuationDistance||1/0;const o=a.attenuationColor||[1,1,1];return t.attenuationColor=new he().setRGB(o[0],o[1],o[2],Gt),Promise.all(r)}}class Mx{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_IOR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=i.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}}class Sx{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_SPECULAR}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];t.specularIntensity=a.specularFactor!==void 0?a.specularFactor:1,a.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",a.specularTexture));const o=a.specularColorFactor||[1,1,1];return t.specularColor=new he().setRGB(o[0],o[1],o[2],Gt),a.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",a.specularColorTexture,gt)),Promise.all(r)}}class wx{constructor(e){this.parser=e,this.name=Ze.EXT_MATERIALS_BUMP}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return t.bumpScale=a.bumpFactor!==void 0?a.bumpFactor:1,a.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",a.bumpTexture)),Promise.all(r)}}class Ex{constructor(e){this.parser=e,this.name=Ze.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){const n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:Un}extendMaterialParams(e,t){const n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();const r=[],a=i.extensions[this.name];return a.anisotropyStrength!==void 0&&(t.anisotropy=a.anisotropyStrength),a.anisotropyRotation!==void 0&&(t.anisotropyRotation=a.anisotropyRotation),a.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",a.anisotropyTexture)),Promise.all(r)}}class Tx{constructor(e){this.parser=e,this.name=Ze.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const r=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class Ax{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_WEBP,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(e,a.source,c);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class Rx{constructor(e){this.parser=e,this.name=Ze.EXT_TEXTURE_AVIF,this.isSupported=null}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let c=n.textureLoader;if(o.uri){const l=n.options.manager.getHandler(o.uri);l!==null&&(c=l)}return this.detectSupport().then(function(l){if(l)return n.loadTextureImage(e,a.source,c);if(i.extensionsRequired&&i.extensionsRequired.indexOf(t)>=0)throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");return n.loadTexture(e)})}detectSupport(){return this.isSupported||(this.isSupported=new Promise(function(e){const t=new Image;t.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",t.onload=t.onerror=function(){e(t.height===1)}})),this.isSupported}}class Cx{constructor(e){this.name=Ze.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const c=i.byteOffset||0,l=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(o,c,l);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}}class Px{constructor(e){this.name=Ze.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const l of i.primitives)if(l.mode!==hn.TRIANGLES&&l.mode!==hn.TRIANGLE_STRIP&&l.mode!==hn.TRIANGLE_FAN&&l.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],c={};for(const l in a)o.push(this.parser.getDependency("accessor",a[l]).then(h=>(c[l]=h,c[l])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(l=>{const h=l.pop(),u=h.isGroup?h.children:[h],d=l[0].count,f=[];for(const b of u){const g=new ze,p=new C,m=new Ln,x=new C(1,1,1),v=new dn(b.geometry,b.material,d);for(let _=0;_<d;_++)c.TRANSLATION&&p.fromBufferAttribute(c.TRANSLATION,_),c.ROTATION&&m.fromBufferAttribute(c.ROTATION,_),c.SCALE&&x.fromBufferAttribute(c.SCALE,_),v.setMatrixAt(_,g.compose(p,m,x));for(const _ in c)if(_==="_COLOR_0"){const R=c[_];v.instanceColor=new Ci(R.array,R.itemSize,R.normalized)}else _!=="TRANSLATION"&&_!=="ROTATION"&&_!=="SCALE"&&b.geometry.setAttribute(_,c[_]);ft.prototype.copy.call(v,b),this.parser.assignFinalMaterial(v),f.push(v)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const bd="glTF",zs=12,Bh={JSON:1313821514,BIN:5130562};class Lx{constructor(e){this.name=Ze.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,zs),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==bd)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-zs,r=new DataView(e,zs);let a=0;for(;a<i;){const o=r.getUint32(a,!0);a+=4;const c=r.getUint32(a,!0);if(a+=4,c===Bh.JSON){const l=new Uint8Array(e,zs+a,o);this.content=n.decode(l)}else if(c===Bh.BIN){const l=zs+a;this.body=e.slice(l,l+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class Ix{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ze.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},c={},l={};for(const h in a){const u=xc[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=xc[h]||h.toLowerCase();if(a[h]!==void 0){const d=n.accessors[e.attributes[h]],f=as[d.componentType];l[u]=f.name,c[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(const b in f.attributes){const g=f.attributes[b],p=c[b];p!==void 0&&(g.normalized=p)}u(f)},o,l,Gt,d)})})}}class Dx{constructor(){this.name=Ze.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class Ux{constructor(){this.name=Ze.KHR_MESH_QUANTIZATION}}class _d extends pr{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=o*2,l=o*3,h=i-t,u=(n-t)/h,d=u*u,f=d*u,b=e*l,g=b-l,p=-2*f+3*d,m=f-d,x=1-p,v=m-d+u;for(let _=0;_!==o;_++){const R=a[g+_+o],S=a[g+_+c]*h,A=a[b+_+o],E=a[b+_]*h;r[_]=x*R+v*S+p*A+m*E}return r}}const Nx=new Ln;class Fx extends _d{interpolate_(e,t,n,i){const r=super.interpolate_(e,t,n,i);return Nx.fromArray(r).normalize().toArray(r),r}}const hn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},as={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},zh={9728:Yt,9729:Nt,9984:Tu,9985:na,9986:Ws,9987:wn},Gh={33071:Cn,33648:ua,10497:Pn},_o={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},xc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},ci={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Ox={CUBICSPLINE:void 0,LINEAR:sr,STEP:ir},xo={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function kx(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new $t({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Qn})),s.DefaultMaterial}function yi(s,e,t){for(const n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function jn(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Bx(s,e,t){let n=!1,i=!1,r=!1;for(let l=0,h=e.length;l<h;l++){const u=e[l];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);const a=[],o=[],c=[];for(let l=0,h=e.length;l<h;l++){const u=e[l];if(n){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):s.attributes.position;a.push(d)}if(i){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):s.attributes.normal;o.push(d)}if(r){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):s.attributes.color;c.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c)]).then(function(l){const h=l[0],u=l[1],d=l[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=d),s.morphTargetsRelative=!0,s})}function zx(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Gx(s){let e;const t=s.extensions&&s.extensions[Ze.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+vo(t.attributes):e=s.indices+":"+vo(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+vo(s.targets[n]);return e}function vo(s){let e="";const t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function vc(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Hx(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const Vx=new ze;class Wx{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new dx,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,a=-1;if(typeof navigator<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const c=o.match(/Version\/(\d+)/);i=n&&c?parseInt(c[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&a<98?this.textureLoader=new Zn(this.options.manager):this.textureLoader=new ex(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Yc(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return yi(r,o,i),jn(o,i),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(o)})).then(function(){for(const c of o.scenes)c.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){const a=t[i].joints;for(let o=0,c=a.length;o<c;o++)e[a[o]].isBone=!0}for(let i=0,r=e.length;i<r;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),r=(a,o)=>{const c=this.associations.get(a);c!=null&&this.associations.set(o,c);for(const[l,h]of a.children.entries())r(h,o.children[l])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[Ze.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(r,a){n.load($s.resolveURL(t.uri,i.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=_o[i.type],o=as[i.componentType],c=i.normalized===!0,l=new o(i.count*a);return Promise.resolve(new Mt(l,a,c))}const r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],c=_o[i.type],l=as[i.componentType],h=l.BYTES_PER_ELEMENT,u=h*c,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,b=i.normalized===!0;let g,p;if(f&&f!==u){const m=Math.floor(d/f),x="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+m+":"+i.count;let v=t.cache.get(x);v||(g=new l(o,m*f,i.count*f/h),v=new $u(g,f/h),t.cache.add(x,v)),p=new or(v,c,d%f/h,b)}else o===null?g=new l(i.count*c):g=new l(o,d,i.count*c),p=new Mt(g,c,b);if(i.sparse!==void 0){const m=_o.SCALAR,x=as[i.sparse.indices.componentType],v=i.sparse.indices.byteOffset||0,_=i.sparse.values.byteOffset||0,R=new x(a[1],v,i.sparse.count*m),S=new l(a[2],_,i.sparse.count*c);o!==null&&(p=new Mt(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let A=0,E=R.length;A<E;A++){const M=R[A];if(p.setX(M,S[A*c]),c>=2&&p.setY(M,S[A*c+1]),c>=3&&p.setZ(M,S[A*c+2]),c>=4&&p.setW(M,S[A*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=b}return p})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const c=n.manager.getHandler(a.uri);c!==null&&(o=c)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const i=this,r=this.json,a=r.textures[e],o=r.images[t],c=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const d=(r.samplers||{})[a.sampler]||{};return h.magFilter=zh[d.magFilter]||Nt,h.minFilter=zh[d.minFilter]||wn,h.wrapS=Gh[d.wrapS]||Pn,h.wrapT=Gh[d.wrapT]||Pn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Yt&&h.minFilter!==Nt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const a=i.images[e],o=self.URL||self.webkitURL;let c=a.uri||"",l=!1;if(a.bufferView!==void 0)c=n.getDependency("bufferView",a.bufferView).then(function(u){l=!0;const d=new Blob([u],{type:a.mimeType});return c=o.createObjectURL(d),c});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(c).then(function(u){return new Promise(function(d,f){let b=d;t.isImageBitmapLoader===!0&&(b=function(g){const p=new Pt(g);p.needsUpdate=!0,d(p)}),t.load($s.resolveURL(u,r.path),b,void 0,f)})}).then(function(u){return l===!0&&o.revokeObjectURL(c),jn(u,a),u.userData.mimeType=a.mimeType||Hx(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[Ze.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[Ze.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const c=r.associations.get(a);a=r.extensions[Ze.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,c)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new zc,an.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(o,c)),n=c}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let c=this.cache.get(o);c||(c=new Bc,an.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(o,c)),n=c}if(i||r||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let c=this.cache.get(o);c||(c=n.clone(),r&&(c.vertexColors=!0),a&&(c.flatShading=!0),i&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(o,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return $t}loadMaterial(e){const t=this,n=this.json,i=this.extensions,r=n.materials[e];let a;const o={},c=r.extensions||{},l=[];if(c[Ze.KHR_MATERIALS_UNLIT]){const u=i[Ze.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),l.push(u.extendParams(o,r,t))}else{const u=r.pbrMetallicRoughness||{};if(o.color=new he(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],Gt),o.opacity=d[3]}u.baseColorTexture!==void 0&&l.push(t.assignTexture(o,"map",u.baseColorTexture,gt)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),l.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Ct);const h=r.alphaMode||xo.OPAQUE;if(h===xo.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===xo.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==wt&&(l.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new J(1,1),r.normalTexture.scale!==void 0)){const u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==wt&&(l.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==wt){const u=r.emissiveFactor;o.emissive=new he().setRGB(u[0],u[1],u[2],Gt)}return r.emissiveTexture!==void 0&&a!==wt&&l.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,gt)),Promise.all(l).then(function(){const u=new a(o);return r.name&&(u.name=r.name),jn(u,r),t.associations.set(u,{materials:e}),r.extensions&&yi(i,u,r),u})}createUniqueName(e){const t=dt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function r(o){return n[Ze.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(c){return Hh(c,o,t)})}const a=[];for(let o=0,c=e.length;o<c;o++){const l=e[o],h=Gx(l),u=i[h];if(u)a.push(u.promise);else{let d;l.extensions&&l.extensions[Ze.KHR_DRACO_MESH_COMPRESSION]?d=r(l):d=Hh(new bt,l,t),i[h]={primitive:l,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let c=0,l=a.length;c<l;c++){const h=a[c].material===void 0?kx(this.cache):this.getDependency("material",a[c].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(c){const l=c.slice(0,c.length-1),h=c[c.length-1],u=[];for(let f=0,b=h.length;f<b;f++){const g=h[f],p=a[f];let m;const x=l[f];if(p.mode===hn.TRIANGLES||p.mode===hn.TRIANGLE_STRIP||p.mode===hn.TRIANGLE_FAN||p.mode===void 0)m=r.isSkinnedMesh===!0?new Qb(g,x):new X(g,x),m.isSkinnedMesh===!0&&m.normalizeSkinWeights(),p.mode===hn.TRIANGLE_STRIP?m.geometry=kh(m.geometry,Fu):p.mode===hn.TRIANGLE_FAN&&(m.geometry=kh(m.geometry,hc));else if(p.mode===hn.LINES)m=new t_(g,x);else if(p.mode===hn.LINE_STRIP)m=new Sa(g,x);else if(p.mode===hn.LINE_LOOP)m=new n_(g,x);else if(p.mode===hn.POINTS)m=new nd(g,x);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(m.geometry.morphAttributes).length>0&&zx(m,r),m.name=t.createUniqueName(r.name||"mesh_"+e),jn(m,r),p.extensions&&yi(i,m,p),t.assignFinalMaterial(m),u.push(m)}for(let f=0,b=u.length;f<b;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&yi(i,u[0],r),u[0];const d=new Ne;r.extensions&&yi(i,d,r),t.associations.set(d,{meshes:e});for(let f=0,b=u.length;f<b;f++)d.add(u[f]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new jt(Uf.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new ya(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),jn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const r=i.pop(),a=i,o=[],c=[];for(let l=0,h=a.length;l<h;l++){const u=a[l];if(u){o.push(u);const d=new ze;r!==null&&d.fromArray(r.array,l*16),c.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new kc(o,c)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,a=[],o=[],c=[],l=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){const f=i.channels[u],b=i.samplers[f.sampler],g=f.target,p=g.node,m=i.parameters!==void 0?i.parameters[b.input]:b.input,x=i.parameters!==void 0?i.parameters[b.output]:b.output;g.node!==void 0&&(a.push(this.getDependency("node",p)),o.push(this.getDependency("accessor",m)),c.push(this.getDependency("accessor",x)),l.push(b),h.push(g))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(u){const d=u[0],f=u[1],b=u[2],g=u[3],p=u[4],m=[];for(let x=0,v=d.length;x<v;x++){const _=d[x],R=f[x],S=b[x],A=g[x],E=p[x];if(_===void 0)continue;_.updateMatrix&&_.updateMatrix();const M=n._createAnimationTracks(_,R,S,A,E);if(M)for(let y=0;y<M.length;y++)m.push(M[y])}return new G_(r,void 0,m)})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let c=0,l=i.weights.length;c<l;c++)o.morphTargetInfluences[c]=i.weights[c]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=i.children||[];for(let l=0,h=o.length;l<h;l++)a.push(n.getDependency("node",o[l]));const c=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(a),c]).then(function(l){const h=l[0],u=l[1],d=l[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,Vx)});for(let f=0,b=u.length;f<b;f++)h.add(u[f]);return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?i.createUniqueName(r.name):"",o=[],c=i._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&o.push(c),r.camera!==void 0&&o.push(i.getDependency("camera",r.camera).then(function(l){return i._getNodeRef(i.cameraCache,r.camera,l)})),i._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){o.push(l)}),this.nodeCache[e]=Promise.all(o).then(function(l){let h;if(r.isBone===!0?h=new td:l.length>1?h=new Ne:l.length===1?h=l[0]:h=new ft,h!==l[0])for(let u=0,d=l.length;u<d;u++)h.add(l[u]);if(r.name&&(h.userData.name=r.name,h.name=a),jn(h,r),r.extensions&&yi(n,h,r),r.matrix!==void 0){const u=new ze;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);return i.associations.has(h)||i.associations.set(h,{}),i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,r=new Ne;n.name&&(r.name=i.createUniqueName(n.name)),jn(r,n),n.extensions&&yi(t,r,n);const a=n.nodes||[],o=[];for(let c=0,l=a.length;c<l;c++)o.push(i.getDependency("node",a[c]));return Promise.all(o).then(function(c){for(let h=0,u=c.length;h<u;h++)r.add(c[h]);const l=h=>{const u=new Map;for(const[d,f]of i.associations)(d instanceof an||d instanceof Pt)&&u.set(d,f);return h.traverse(d=>{const f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=l(r),r})}_createAnimationTracks(e,t,n,i,r){const a=[],o=e.name?e.name:e.uuid,c=[];ci[r.path]===ci.weights?e.traverse(function(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}):c.push(o);let l;switch(ci[r.path]){case ci.weights:l=bs;break;case ci.rotation:l=_s;break;case ci.position:case ci.scale:l=xs;break;default:switch(n.itemSize){case 1:l=bs;break;case 2:case 3:default:l=xs;break}break}const h=i.interpolation!==void 0?Ox[i.interpolation]:sr,u=this._getArrayFromAccessor(n);for(let d=0,f=c.length;d<f;d++){const b=new l(c[d]+"."+ci[r.path],t.array,u,h);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(b),a.push(b)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=vc(t.constructor),i=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof _s?Fx:_d;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function jx(s,e,t){const n=e.attributes,i=new vt;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],c=o.min,l=o.max;if(c!==void 0&&l!==void 0){if(i.set(new C(c[0],c[1],c[2]),new C(l[0],l[1],l[2])),o.normalized){const h=vc(as[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new C,c=new C;for(let l=0,h=r.length;l<h;l++){const u=r[l];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],f=d.min,b=d.max;if(f!==void 0&&b!==void 0){if(c.setX(Math.max(Math.abs(f[0]),Math.abs(b[0]))),c.setY(Math.max(Math.abs(f[1]),Math.abs(b[1]))),c.setZ(Math.max(Math.abs(f[2]),Math.abs(b[2]))),d.normalized){const g=vc(as[d.componentType]);c.multiplyScalar(g)}o.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}s.boundingBox=i;const a=new In;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=a}function Hh(s,e,t){const n=e.attributes,i=[];function r(a,o){return t.getDependency("accessor",a).then(function(c){s.setAttribute(o,c)})}for(const a in n){const o=xc[a]||a.toLowerCase();o in s.attributes||i.push(r(n[a],o))}if(e.indices!==void 0&&!s.index){const a=t.getDependency("accessor",e.indices).then(function(o){s.setIndex(o)});i.push(a)}return $e.workingColorSpace!==Gt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${$e.workingColorSpace}" not supported.`),jn(s,e),jx(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Bx(s,e.targets,t):s})}var xd=function(){var s="b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q;iekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq:P8Yqdbk;3sezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhDcbhqinaqae9pmeaDaeaq9RaqaDfae6Egkcsfgocl4cifcd4hxdndndndnaoc9WGgmTmbcbhPcehsawcjdfhzalhHinaraH9Rax6midnaraHaxfgl9RcK6mbczhoinawcj;cbfaogifgoc9WfhOdndndndndnaHaic9WfgAco4fRbbaAci4coG4ciGPlbedibkaO9cb83ibaOcwf9cb83ibxikaOalRblalRbbgAco4gCaCciSgCE86bbaocGfalclfaCfgORbbaAcl4ciGgCaCciSgCE86bbaocVfaOaCfgORbbaAcd4ciGgCaCciSgCE86bbaoc7faOaCfgORbbaAciGgAaAciSgAE86bbaoctfaOaAfgARbbalRbegOco4gCaCciSgCE86bbaoc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc93faAaCfgARbbaOciGgOaOciSgOE86bbaoc94faAaOfgARbbalRbdgOco4gCaCciSgCE86bbaoc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc97faAaCfgARbbaOciGgOaOciSgOE86bbaoc98faAaOfgORbbalRbiglco4gAaAciSgAE86bbaoc99faOaAfgORbbalcl4ciGgAaAciSgAE86bbaoc9:faOaAfgORbbalcd4ciGgAaAciSgAE86bbaocufaOaAfgoRbbalciGglalciSglE86bbaoalfhlxdkaOalRbwalRbbgAcl4gCaCcsSgCE86bbaocGfalcwfaCfgORbbaAcsGgAaAcsSgAE86bbaocVfaOaAfgORbbalRbegAcl4gCaCcsSgCE86bbaoc7faOaCfgORbbaAcsGgAaAcsSgAE86bbaoctfaOaAfgORbbalRbdgAcl4gCaCcsSgCE86bbaoc91faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc4faOaAfgORbbalRbigAcl4gCaCcsSgCE86bbaoc93faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc94faOaAfgORbbalRblgAcl4gCaCcsSgCE86bbaoc95faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc96faOaAfgORbbalRbvgAcl4gCaCcsSgCE86bbaoc97faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc98faOaAfgORbbalRbogAcl4gCaCcsSgCE86bbaoc99faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc9:faOaAfgORbbalRbrglcl4gAaAcsSgAE86bbaocufaOaAfgoRbbalcsGglalcsSglE86bbaoalfhlxekaOal8Pbb83bbaOcwfalcwf8Pbb83bbalczfhlkdnaiam9pmbaiczfhoaral9RcL0mekkaiam6mialTmidnakTmbawaPfRbbhOcbhoazhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkkazcefhzaPcefgPad6hsalhHaPad9hmexvkkcbhlasceGmdxikalaxad2fhCdnakTmbcbhHcehsawcjdfhminaral9Rax6mialTmdalaxfhlawaHfRbbhOcbhoamhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkamcefhmaHcefgHad6hsaHad9hmbkaChlxikcbhocehsinaral9Rax6mdalTmealaxfhlaocefgoad6hsadao9hmbkaChlxdkcbhlasceGTmekc9:hoxikabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqalmbkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;ebf8Kjjjjbaok;yzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;siliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabavcefciGaiVcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:Ohkxekcjjjj94hkkabavcdfciGaiVcetfak87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:Ohqxekcjjjj94hqkabavcufciGaiVcetfaq87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohqxekcjjjj94hqkabavciGaiVcetfaq87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2geTmbinababydbgdcwtcw91:Yadce91cjjj;8ifcjjj98G::NUdbabclfhbaecufgembkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaiczfhiaeczfheadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklz9Kbb",e="b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q;Aekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq;t9tqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk;h8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhwcbhDinaDae9pmeawaeaD9RaDawfae6Egqcsfgoc9WGgkci2hxakcethmaocl4cifcd4hPabaDad2fhscbhzdnincehHalhOcbhAdninaraO9RaP6miavcj;cbfaAak2fhCaOaPfhlcbhidnakc;ab6mbaral9Rc;Gb6mbcbhoinaCaofhidndndndndnaOaoco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklbalczfhlkdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklzalczfhlkdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklaalczfhlkdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalclfaYpQbfaXc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalcwfaYpQbfaXc:q:yjjbfRbbfhlxekaialpbbbpkl8Walczfhlkaoc;abfhiaocjefak0meaihoaral9Rc;Fb0mbkkdndnaiak9pmbaici4hoinaral9RcK6mdaCaifhXdndndndndnaOaico4fRbbaocoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpklbxikaXalpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaXalpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaXalpbbbpklbalczfhlkaocdfhoaiczfgiak6mbkkalTmbaAci6hHalhOaAcefgohAaoclSmdxekkcbhlaHceGmdkdnakTmbavcjdfazfhiavazfpbdbhYcbhXinaiavcj;cbfaXfgopblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLaoakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEaoamfpblbg3cep9Ta3aQp9op9Hp9rg3aoaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfhiaXczfgXak6mbkkazclfgzad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfhDc9:hoalmexikkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk;uzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:EPliuo97eue978Jjjjjbca9Rhidndnadcl9hmbdnaec98GglTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalae9pmeaiaeciGgvcdtgdVcbczad9R;8kbaiabalcdtfglad;8qbbdnavTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkalaiad;8qbbskdnaec98GgxTmbcbhvabhdinadczfglalpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oawaopmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgvax6mbkkaxae9pmbaiaeciGgvcitgdfcbcaad9R;8kbaiabaxcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oawaopmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalae9pmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbhdabheinaeaepbbbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepkbbaeczfheadclfgdav6mbkkdnaval9pmbaialciGgdcdtgeVcbc;abae9R;8kbaiabavcdtfgvae;8qbbdnadTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepklbkavaiae;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz9Tbb",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),n=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var i=WebAssembly.validate(t)?e:s,r,a=WebAssembly.instantiate(o(i),{}).then(function(m){r=m.instance,r.exports.__wasm_call_ctors()});function o(m){for(var x=new Uint8Array(m.length),v=0;v<m.length;++v){var _=m.charCodeAt(v);x[v]=_>96?_-97:_>64?_-39:_+4}for(var R=0,v=0;v<m.length;++v)x[R++]=x[v]<60?n[x[v]]:(x[v]-60)*64+x[++v];return x.buffer.slice(0,R)}function c(m,x,v,_,R,S){var A=r.exports.sbrk,E=v+3&-4,M=A(E*_),y=A(R.length),L=new Uint8Array(r.exports.memory.buffer);L.set(R,y);var D=m(M,v,_,y,R.length);if(D==0&&S&&S(M,E,_),x.set(L.subarray(M,M+v*_)),A(M-A(0)),D!=0)throw new Error("Malformed buffer data: "+D)}var l={NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp"},h={ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"},u=[],d=0;function f(m){var x={object:new Worker(m),pending:0,requests:{}};return x.object.onmessage=function(v){var _=v.data;x.pending-=_.count,x.requests[_.id][_.action](_.value),delete x.requests[_.id]},x}function b(m){for(var x="var instance; var ready = WebAssembly.instantiate(new Uint8Array(["+new Uint8Array(o(i))+"]), {}).then(function(result) { instance = result.instance; instance.exports.__wasm_call_ctors(); });self.onmessage = workerProcess;"+c.toString()+p.toString(),v=new Blob([x],{type:"text/javascript"}),_=URL.createObjectURL(v),R=0;R<m;++R)u[R]=f(_);URL.revokeObjectURL(_)}function g(m,x,v,_,R){for(var S=u[0],A=1;A<u.length;++A)u[A].pending<S.pending&&(S=u[A]);return new Promise(function(E,M){var y=new Uint8Array(v),L=d++;S.pending+=m,S.requests[L]={resolve:E,reject:M},S.object.postMessage({id:L,count:m,size:x,source:y,mode:_,filter:R},[y.buffer])})}function p(m){a.then(function(){var x=m.data;try{var v=new Uint8Array(x.count*x.size);c(r.exports[x.mode],v,x.count,x.size,x.source,r.exports[x.filter]),self.postMessage({id:x.id,count:x.count,action:"resolve",value:v},[v.buffer])}catch(_){self.postMessage({id:x.id,count:x.count,action:"reject",value:_})}})}return{ready:a,supported:!0,useWorkers:function(m){b(m)},decodeVertexBuffer:function(m,x,v,_,R){c(r.exports.meshopt_decodeVertexBuffer,m,x,v,_,r.exports[l[R]])},decodeIndexBuffer:function(m,x,v,_){c(r.exports.meshopt_decodeIndexBuffer,m,x,v,_)},decodeIndexSequence:function(m,x,v,_){c(r.exports.meshopt_decodeIndexSequence,m,x,v,_)},decodeGltfBuffer:function(m,x,v,_,R,S){c(r.exports[h[R]],m,x,v,_,r.exports[l[S]])},decodeGltfBufferAsync:function(m,x,v,_,R){return u.length>0?g(m,x,v,h[_],l[R]):a.then(function(){var S=new Uint8Array(m*x);return c(r.exports[h[_]],S,m,x,v,r.exports[l[R]]),S})}}}();const Xx={fur:{map:"fur",nor:"fur_n",rep:2.2,metal:0,rough:.92},skin:{map:"skin",nor:void 0,rep:1.4,metal:0,rough:.78},cloth:{map:"cloth",nor:"cloth_n",rep:2.8,metal:0,rough:.95},leather:{map:"leather",nor:"leather_n",rep:2,metal:0,rough:.7},metal:{map:"metal",nor:"metal_n",rep:1.6,metal:.72,rough:.42},gold:{map:"metal",nor:"metal_n",rep:1.8,metal:.85,rough:.35},rust:{map:"rust",nor:"rust_n",rep:1.8,metal:.35,rough:.78},iron:{map:"iron",nor:"iron_n",rep:1.4,metal:.65,rough:.55},wood:{map:"wood",nor:"wood_n",rep:1.6,metal:0,rough:.88},bark:{map:"bark",nor:"bark_n",rep:1.5,metal:0,rough:.95},leaf:{map:"leaf",nor:"leaf_n",rep:2.4,metal:0,rough:.9},stone:{map:"concrete",nor:"concrete_n",rep:1.8,metal:0,rough:.92},paint:{map:"plaster",nor:"plaster_n",rep:2,metal:.05,rough:.7},concrete:{map:"concrete",nor:"concrete_n",rep:1.5,metal:0,rough:.9}},Vh=new Map;function Wh(s,e,t){const n=s+":"+t+(e?":s":"");let i=Vh.get(n);return i||(i=new Zn().load(Jt(`assets/tex/${s}.webp`)),i.wrapS=i.wrapT=Pn,i.repeat.set(t,t),i.anisotropy=4,e&&(i.colorSpace=gt),Vh.set(n,i),i)}const yc=new Map,qx=new wt({vertexColors:!0,toneMapped:!1});let Ei=2;function yo(s){Ei=s,yc.clear()}function di(s){if(s==="glow")return qx;const e=s+":"+Ei;let t=yc.get(e);if(t)return t;const n=Xx[s];if(Ei<=0)t=new Ut({vertexColors:!0,flatShading:!0});else{const i=Wh(n.map,!0,n.rep),r=Ei>=2&&n.nor?Wh(n.nor,!1,n.rep):null,a=Ei>=2?n.metal:Math.min(n.metal,s==="gold"?.55:.28);t=new $t({map:i,normalMap:r,vertexColors:!0,metalness:a,roughness:Math.max(n.rough,Ei<2?.55:n.rough),envMapIntensity:s==="metal"||s==="gold"||s==="iron"?Ei>=2?1.1:.85:.55,flatShading:!!n.flat})}return t.name="fp_"+s,yc.set(e,t),t}function Yx(s,e=!1){if(e)return"glow";const t=s>>16&255,n=s>>8&255,i=s&255;if(t>170&&n>120&&i<110&&t>=n&&n>i+20)return"gold";if(n>t+15&&n>i+10&&n>70)return"leaf";if(t>170&&n>130&&i>90&&t>n&&n>i&&t-i<140)return"skin";if(t>55&&t<170&&n>30&&n<120&&i<90&&t>n&&n>=i-10)return"fur";if(t>70&&n>35&&i<70&&t>n*1.15&&n>i)return"wood";if(t>40&&t<100&&n>25&&n<70&&i<55&&t>=n)return"bark";if(i>t+40&&i>n)return"paint";if(t>150&&n<90&&i<90)return"leather";const r=Math.max(t,n,i),a=Math.min(t,n,i);return r-a<35?r<55?"iron":r<130?"metal":"paint":n>60&&n<140&&t>40&&t<130&&i<90&&Math.abs(t-n)<40?"cloth":"paint"}const Kx=new Ca().setMeshoptDecoder(xd),jh=new Map;function vs(s){let e=jh.get(s);return e||(e=Kx.loadAsync(Jt(`assets/military/${s}.glb`)).then(t=>t.scene),jh.set(s,e)),e}const rn=(s,e="paint")=>{const t=di(e).clone();return t.vertexColors=!1,"color"in t&&(t.color.setHex(s),.2126*t.color.r+.7152*t.color.g+.0722*t.color.b<.08&&(t.color.offsetHSL(0,0,.14),"metalness"in t&&(t.metalness=Math.min(t.metalness,.28)),"roughness"in t&&(t.roughness=Math.max(t.roughness,.62)))),t},Ue=(s,e,t,n)=>(s.position.set(e,t,n),s),Xh=new Map;function la(s,e,t=2){const n=s+":"+t+(e?":s":"");let i=Xh.get(n);return i||(i=new Zn().load(Jt(`assets/tex/${s}.webp`)),i.wrapS=i.wrapT=Pn,i.repeat.set(t,t),i.anisotropy=4,e&&(i.colorSpace=gt),Xh.set(n,i),i)}function zt(s){const e=s.rep??2.2,t=new $t({map:la(s.map,!0,e),normalMap:s.nor?la(s.nor,!1,e):null,roughnessMap:s.roughMap?la(s.roughMap,!1,e):null,color:s.color??16777215,metalness:s.metal??.1,roughness:s.rough??.7,envMapIntensity:.85,flatShading:!!s.flat,vertexColors:!1});return t.metalness=Math.min(t.metalness,.22),t.roughness=Math.max(t.roughness,.55),t.emissive=new he(1711124),t.emissiveIntensity=.35,t}const Ft={tank:[7.6,8.6,9.6],heli:[11,12,13.2],barrel:.95,crate:.8,crate_large:1.25,tent:4.2,barrier:2.6,sandbags:2.6,gun_rifle:.86,gun_rocket:1.15,gun_sniper:1.18,gun_shotgun:.98,gun_pistol:.21,gun_smg:.52},Qc={tank_1:Math.PI,tank_2:Math.PI,tank_3:Math.PI,heli:Math.PI/2};function mr(s,e,t=0,n){const i=s.clone(!0);i.rotation.y=t,i.updateMatrixWorld(!0);const r=new vt().setFromObject(i),a=r.getSize(new C),o=e/Math.max(a.x,a.z),c=new Ne,l=new Ne;return l.add(i),i.position.set(-(r.min.x+r.max.x)/2,-r.min.y,-(r.min.z+r.max.z)/2),l.scale.setScalar(o),c.add(l),c}function dr(s,e,t=!1,n="metal"){const i=di(n);s.traverse(r=>{const a=r;if(!a.isMesh)return;const o=Array.isArray(a.material)?a.material:[a.material];a.material=o.map(c=>{const l=e(c.name,c.color??new he(1,1,1)),h=i.clone();return h.color.set(l??c.color??16777215),!t&&c.map&&(h.map=c.map,h.color.set(16777215)),h.name=c.name,h.vertexColors=!!a.geometry.attributes.color,h}),a.material.length===1&&(a.material=a.material[0]),a.castShadow=!0})}async function qh(s){const e=`tank_${Math.min(2,s)+1}`,t=await vs(e),n=mr(t,Ft.tank[Math.min(2,s)],Qc[e]),i=s>=2?"tank_olive":"tank_tan",r=zt({map:i,nor:"tank_n",roughMap:"tank_rough",rep:2.4,color:16777215,metal:.08,rough:.72}),a=zt({map:i,nor:"tank_n",roughMap:"tank_rough",rep:2.8,color:14212296,metal:.1,rough:.75}),o=zt({map:"tank_track",nor:"tank_track_n",rep:3.2,color:6973536,metal:.05,rough:.92}),c=zt({map:"tank_iron",nor:"tank_iron_n",rep:1.8,color:13158592,metal:.22,rough:.55});n.traverse(g=>{var _;const p=g;if(!p.isMesh)return;const x=((_=(Array.isArray(p.material)?p.material:[p.material])[0])==null?void 0:_.name)??"";let v=r;/Wheel/i.test(x)||/Wheel/i.test(p.name)?v=o:/Gun/i.test(x)||/Gun/i.test(p.name)?v=c:/Dark|Detail/i.test(x)?v=a:s===2&&/Main_Light/i.test(x)&&(v=zt({map:i,nor:"tank_n",roughMap:"tank_rough",rep:2,color:13686976,metal:.18,rough:.55})),p.material=v,p.castShadow=!0});const l=n.children[0].children[0];l.updateMatrixWorld(!0),n.updateMatrixWorld(!0);const h=[];l.traverse(g=>{/Turret|Gun/i.test(g.name)&&g.isMesh&&h.push(g)});const u=h.find(g=>/Turret/i.test(g.name)),d=new Ne;if(u){const g=new vt().setFromObject(u).getCenter(new C);d.position.set(g.x,0,g.z),n.add(d),d.updateMatrixWorld(!0);for(const p of h)d.attach(p)}n.userData.turret=d;const f=c,b=r;if(s>=1){const g=new vt().setFromObject(n);for(const p of[-1,1])for(let m=0;m<4;m++)n.add(Ue(new X(new Le(.85,.28,.1),b),g.min.x+1.4+m*1.05,g.max.y*.38,p*(g.max.z+.02)))}if(s>=2){const g=new vt().setFromObject(n);for(const E of[-1,1])for(let M=0;M<5;M++)n.add(Ue(new X(new Le(.9,.42,.14),b),g.min.x+1.3+M*1.05,g.max.y*.42,E*(g.max.z+.02)));d.updateMatrixWorld(!0);let p=null,m=-1;d.traverse(E=>{const M=E;if(!M.isMesh||!/Turret/i.test(M.name))return;const y=new vt().setFromObject(M),L=y.getSize(new C),D=L.x*L.z;D>m&&(m=D,p=M)});const x=p?new vt().setFromObject(p):new vt().setFromObject(d),v=x.max.y,_=(x.min.x+x.max.x)/2-d.position.x,R=Ue(new X(new Ve(.02,.03,2.6,4),f),-1.2,v+1.2,-.7);d.add(R);const S=new Ne;S.add(Ue(new X(new Ve(.38,.4,.12,10),b),0,.04,0)),S.add(Ue(new X(new Ve(.28,.32,.32,8),b),0,.26,0)),S.add(Ue(new X(new Et(.17,8,6),zt({map:"tank_track",nor:"tank_track_n",rep:1.5,color:9080936,metal:.05,rough:.85})),0,.48,0));const A=new Ne;A.add(Ue(new X(new Le(.55,.18,.2),f),0,0,0)),A.add(Ue(new X(new Ve(.045,.045,1.15,6).rotateZ(Math.PI/2),f),.7,.02,0)),Ue(A,.12,.48,.28),S.add(A),Ue(S,_-.35,v-.08,.35),d.add(S),n.userData.gunner=S}return n.userData.kind="tank",n.userData.textured=!0,n}function vd(s,e){s.updateMatrixWorld(!0);const t=new C;s.traverse(n=>{const i=n;if(!i.isMesh)return;const r=i.geometry.index?i.geometry.toNonIndexed():i.geometry.clone(),a=r.attributes.position,o=a.count,c=new Float32Array(o*3);for(let d=0;d<o;d++)c[d*3]=a.getX(d),c[d*3+1]=a.getY(d),c[d*3+2]=a.getZ(d);const l=[];for(let d=0;d<o;d+=3){let f=!1;for(let b=0;b<3;b++)t.set(c[(d+b)*3],c[(d+b)*3+1],c[(d+b)*3+2]).applyMatrix4(i.matrixWorld),t.y>e&&(f=!0);f||l.push(d,d+1,d+2)}if(l.length===0){i.visible=!1;return}const h=new bt,u=new Float32Array(l.length*3);l.forEach((d,f)=>{u[f*3]=c[d*3],u[f*3+1]=c[d*3+1],u[f*3+2]=c[d*3+2]}),h.setAttribute("position",new Mt(u,3));for(const d of Object.keys(r.attributes)){if(d==="position")continue;const f=r.attributes[d],b=new Float32Array(l.length*f.itemSize);for(let g=0;g<l.length;g++)for(let p=0;p<f.itemSize;p++)b[g*f.itemSize+p]=f.getComponent(l[g],p);h.setAttribute(d,new Mt(b,f.itemSize))}h.computeVertexNormals(),i.geometry=h})}async function Jx(s){const e=await vs("heli"),t=Ft.heli[Math.min(2,s)],n=mr(e,t,Qc.heli);n.updateMatrixWorld(!0);const i=new vt().setFromObject(n),r=i.min.y+(i.max.y-i.min.y)*.78,a=i.min.x+(i.max.x-i.min.x)*.55;vd(n,r+.05);const o=[16777215,15266008,13687992][Math.min(2,s)],c=zt({map:"tank_olive",nor:"tank_n",roughMap:"tank_rough",rep:2.6,color:o,metal:.08,rough:.7}),l=zt({map:"tank_olive",nor:"tank_n",roughMap:"tank_rough",rep:3,color:13160624,metal:.1,rough:.72});n.traverse(S=>{var M;const A=S;if(!A.isMesh)return;const E=((M=Array.isArray(A.material)?A.material[0]:A.material)==null?void 0:M.name)??"";A.material=/003|004/.test(E)?l:c,A.castShadow=!0});const h=new vt().setFromObject(n),u=h.max.y,d=h.max.x-h.min.x,f=zt({map:"tank_iron",nor:"tank_iron_n",rep:2.5,color:6975592,metal:.35,rough:.5}),b=new Ne;b.add(Ue(new X(new Ve(.1,.14,Math.max(.35,r+.32-u),8),f),0,-(r+.32-u)/2,0));const g=s>=2?5:4;for(let S=0;S<g;S++){const A=new X(new Le(t*.47,.05,.32).translate(t*.235,0,0),f);A.rotation.y=S/g*Math.PI*2,b.add(A)}b.add(new X(new Ve(.22,.28,.28,8),f));const p=new X(new wa(t*.47,32).rotateX(-Math.PI/2),new wt({color:2236962,transparent:!0,opacity:.16,depthWrite:!1,side:Ct}));b.add(p),b.position.set(a,r+.32,0),n.add(b);const m=new Ne;for(let S=0;S<2;S++){const A=new X(new Le(.16,t*.16,.04),f);A.rotation.z=S*Math.PI/2,m.add(A)}m.position.set(h.min.x+.35,Math.min(u*.92,r*.88),.42),n.add(m),n.userData.rotor=b,n.userData.tail=m;const x=rn(2237983,"iron"),v=rn(3817776,"metal"),_=h.max.x-d*.12,R=new Ne;R.add(new X(new Et(.28,8,6),x));for(const S of[-.07,.07])R.add(Ue(new X(new Ve(.04,.04,1.3,6).rotateZ(Math.PI/2),x),.65,0,S));if(Ue(R,_,u*.18,0),n.add(R),s>=1){const S=h.min.x+d*.55;n.add(Ue(new X(new Le(.9,.08,3.4),x),S,u*.38,0));for(const A of[-1,1])if(n.add(Ue(new X(new Ve(.24,.24,1.5,10).rotateZ(Math.PI/2),v),S,u*.3,A*1.2)),s>=2){n.add(Ue(new X(new Ve(.24,.24,1.5,10).rotateZ(Math.PI/2),v),S,u*.3,A*1.65));for(const E of[0,1])n.add(Ue(new X(new Ve(.09,.09,1.6,6).rotateZ(Math.PI/2),rn(6975328)),S+.1,u*.22-E*.22,A*.75))}}return n.userData.kind="heli",n.userData.textured=!0,n}function Zx(s){const e=new Ne,t=[12,14,16][Math.min(2,s)],n=rn(2764856,"iron"),i=rn(5925496,"metal"),r=rn(6977672,"metal"),a=rn(14212320,"paint"),o=rn(6965818,"rust"),c=rn(16757594,"gold");e.add(Ue(new X(new Le(t,1.4,3.2+s*.3),i),0,.7,0)),e.add(Ue(new X(new Le(t*.98,.18,3.25+s*.3),o),0,.12,0)),e.add(Ue(new X(new Le(t*.92,.35,3+s*.25),r),0,1.5,0)),e.add(Ue(new X(new Jn(1.7+s*.1,2.8,4).rotateZ(-Math.PI/2),i),t/2+.4,.85,0));for(let u=0;u<3+s;u++)e.add(Ue(new X(new Le(1.2,.04,1.4),n),-t*.25+u*1.5,1.7,0));e.add(Ue(new X(new Le(2.8,1.6+s*.3,2.2),a),-.5,2.4,0)),e.add(Ue(new X(new Le(1.2,1.2,1.4),n),-.3,3.5+s*.15,0)),e.add(Ue(new X(new Le(2.4,.35,.08),rn(8048895,"paint")),-.5,2.9,1.12)),e.add(Ue(new X(new Ve(.06,.08,3.2+s*.4,6),n),.4,4.5+s*.2,0)),s>=1&&e.add(Ue(new X(new Le(1.4,.15,.6),rn(9412784,"metal")),.4,5.6,0)),s>=2&&e.add(Ue(new X(new Et(.25,8,6),c),.4,6.2,0));const l=new Ne,h=1+s;for(let u=0;u<h;u++){const d=t*.22-u*2.4,f=new Ne;f.add(new X(new Ve(.55,.65,.5,10),n)),f.add(Ue(new X(new Ve(.1,.12,2.2+s*.3,8).rotateZ(Math.PI/2),n),1.2,.1,0)),s>=2&&f.add(Ue(new X(new Le(.35,.12,.35),c),0,.32,0)),Ue(f,d,1.85,0),l.add(f)}return e.add(l),e.userData.turret=l,e.userData.kind="destroyer",e.userData.textured=!0,e.traverse(u=>{const d=u;d.isMesh&&(d.castShadow=!0)}),e}function Qx(s){const e=new Ne,t=8+s*1.5,n=zt({map:"lh_cream",nor:"lh_paint_n",rep:1.6,color:16775920,metal:0,rough:.82}),i=zt({map:"lh_red",nor:"lh_red_n",rep:1.8,color:16769248,metal:0,rough:.78}),r=zt({map:"lh_brick",nor:"lh_brick_n",rep:2.4,metal:0,rough:.9}),a=zt({map:"lh_rock",nor:"lh_rock_n",rep:1.8,metal:0,rough:.95}),o=zt({map:"lh_slate",nor:"tank_iron_n",rep:2,metal:.25,rough:.55}),c=zt({map:"tank_iron",nor:"tank_iron_n",rep:3,color:13686492,metal:.35,rough:.4}),l=new $t({color:13166847,metalness:.05,roughness:.12,transparent:!0,opacity:.42,envMapIntensity:1,vertexColors:!1,side:Ct});e.add(Ue(new X(new Ve(1.65,1.95,.55,14),a),0,.28,0));for(let g=0;g<8;g++){const p=g/8*Math.PI*2;e.add(Ue(new X(new Et(.35+g%3*.08,8,6),a),Math.cos(p)*1.75,.22,Math.sin(p)*1.75))}e.add(Ue(new X(new Ve(1.15,1.35,.45,14),r),0,.7,0)),e.add(Ue(new X(new Le(.55,.9,.12),rn(5913128,"wood")),0,1.15,1.05));const h=4+s,u=t*.68;for(let g=0;g<h;g++){const p=u/h,m=.95+g*p,x=.95-g*.035,v=.9-g*.035;e.add(Ue(new X(new Ve(v,x,p,16),g%2?i:n),0,m+p/2,0))}const d=.95+u;e.add(Ue(new X(new Ve(1.25,1.25,.12,16),o),0,d,0)),e.add(Ue(new X(new gs(1.2,.045,6,24),c),0,d+.35,0));for(let g=0;g<12;g++){const p=g/12*Math.PI*2;e.add(Ue(new X(new Ve(.03,.03,.35,5),c),Math.cos(p)*1.2,d+.18,Math.sin(p)*1.2))}const f=d+.7+s*.05;e.add(Ue(new X(new Ve(.78,.78,1.15+s*.12,14),l),0,f,0));for(let g=0;g<6;g++){const p=g/6*Math.PI*2;e.add(Ue(new X(new Le(.07,1.1+s*.12,.07),o),Math.cos(p)*.78,f,Math.sin(p)*.78))}const b=new X(new Et(.42+s*.06,12,10),new wt({color:16765514}));return Ue(b,0,f,0),e.add(b),e.add(Ue(new X(new Ve(.95,.95,.1,14),o),0,f+.65+s*.06,0)),e.add(Ue(new X(new Jn(.95,.7+s*.05,14),o),0,f+1.05+s*.08,0)),e.add(Ue(new X(new Et(.08,6,6),c),0,f+1.45+s*.1,0)),s>=1&&e.add(Ue(new X(new Le(.35,.45,.08),n),.55,.95+u*.45,.7)),s>=2&&e.add(Ue(new X(new Ve(.04,.04,1.2,5),o),.9,d-.5,0)),e.userData.lamp=b,e.userData.kind="beacon",e.userData.textured=!0,e.traverse(g=>{const p=g;p.isMesh&&p!==b&&(p.castShadow=!0)}),e}function tr(){const s=new Ne,e=new Et(.55,10,7).scale(.72,.3,.4);let t;try{const r=la("sandbag",!0,1.4);t=new $t({map:r,color:15260080,roughness:.92,metalness:0,envMapIntensity:.5,vertexColors:!1}),t.emissive=new he(1710096),t.emissiveIntensity=.2}catch{t=rn(11771764,"cloth")}const n=Ft.sandbags;for(let r=0;r<4;r++){const a=5-r%2;for(let o=0;o<a;o++)for(let c=0;c<2;c++){const l=new X(e,t);l.castShadow=!0,l.receiveShadow=!0;const h=-n/2+.28+o*.52+r%2*.26,u=.14+r*.22,d=(c-.5)*.32+r%2*.06;l.position.set(h,u,d),l.rotation.set(((o+r)%5-2)*.05,((o*7+r)%5-2)*.08,((o+c)%3-1)*.06),s.add(l)}}const i=new X(new Le(n*.95,.35,.85),t);return i.position.set(0,.18,0),i.castShadow=!0,s.add(i),s}function $x(){const s=new Ne,e=tr();e.position.z=-.95,s.add(e);const t=tr();t.rotation.y=Math.PI/2.5,t.position.set(-1.35,0,.15),s.add(t);const n=tr();n.rotation.y=-Math.PI/2.5,n.position.set(1.35,0,.15),s.add(n);const i=zt({map:"sandbag",nor:"sandbag_n",rep:1.2,color:14733480,metal:0,rough:.95});for(const[r,a]of[[-1.1,-.7],[1.1,-.7]]){const o=new X(new Et(.55,8,6).scale(1.1,.7,1),i);o.position.set(r,.35,a),o.castShadow=!0,s.add(o)}return s}async function Tn(s,e,t,n,i=0,r=0,a){const o=mr(await vs(s),e);return o.position.set(t,r,n),o.rotation.y=i,a!==void 0?dr(o,()=>a,s==="barrel"):dr(o,()=>null),o}async function ev(s){if(s==="sandbags")return $x();const e=new Ne;if(s==="supply")e.add(await Tn("crate_large",Ft.crate_large,-.7,-.3,.1,0,9075278),await Tn("crate_large",Ft.crate_large,.62,-.42,-.08,0,8220744)),e.add(await Tn("crate",Ft.crate,-.55,-.25,.3,Ft.crate_large*.98,10127962),await Tn("crate",Ft.crate,.4,.75,.6,0,9075278)),e.add(await Tn("barrel",Ft.barrel,1.45,.55,0,0,5201722),await Tn("barrel",Ft.barrel,-1.35,.8,0,0,5201722));else if(s==="fuel")for(const[t,n]of[[-.5,-.5],[.5,-.5],[-.5,.5],[.5,.5],[1.4,.1]])e.add(await Tn("barrel",Ft.barrel,t,n,t*2,0,t>1?9055778:5201722));else if(s==="tent"){const t=await Tn("tent",Ft.tent,0,0,0);dr(t,()=>7304528,!0),e.add(t)}else s==="barrier"&&e.add(await Tn("barrier",Ft.barrier,-1.25,0,.15,0,9075290),await Tn("barrier",Ft.barrier,1.25,0,-.15,0,9075290));return e}const tv={Gray8:2764079,Gray6:4343626,Gray5:7038032,FrontColor:5001558},nv={rifle:"gun_rifle_ph",sniper:"gun_rifle_ph",shotgun:"gun_rifle_ph",smg:"gun_rifle_ph",pistol:"gun_pistol_ph"};async function Mo(s){const e="gun_"+s,t=nv[s];let n;if(t){n=(await vs(t)).clone(!0);const d=[];n.traverse(f=>{s!=="sniper"&&/scope/i.test(f.name)&&d.push(f)});for(const f of d)f.removeFromParent();n.traverse(f=>{const b=f;if(!b.isMesh)return;const g=b.material.clone();g.envMapIntensity=.9,b.material=g,b.castShadow=!0})}else n=await vs(e);const i=mr(n,Ft[e]);t||(dr(i,d=>tv[d]??null),i.traverse(d=>{const f=d,b=f.material;if(!b||!b.color)return;const g=b.color.getHSL({h:0,s:0,l:0}).l<.12?new he(3883075):b.color;f.material=new $t({color:g,metalness:.55,roughness:.45,vertexColors:b.vertexColors})})),i.updateMatrixWorld(!0);const r=new vt().setFromObject(i),a=r.max.z-r.min.z,o=new C,c={lo:[1/0,-1/0],hi:[1/0,-1/0]};i.traverse(d=>{const f=d;if(!f.isMesh)return;const b=f.geometry.attributes.position;for(let g=0;g<b.count;g++){o.fromBufferAttribute(b,g).applyMatrix4(f.matrixWorld);const p=o.z<r.min.z+a*.15?c.lo:o.z>r.max.z-a*.15?c.hi:null;p&&(p[0]=Math.min(p[0],o.y),p[1]=Math.max(p[1],o.y))}});const l=c.lo[1]-c.lo[0]<c.hi[1]-c.hi[0],h=new Ne;h.add(i),l||(i.rotation.y=Math.PI);const u=l?(c.lo[0]+c.lo[1])/2:(c.hi[0]+c.hi[1])/2;return h.userData={len:a,h:r.max.y,muzzle:new C(0,u,-a/2-.02),gunKind:s,textured:!!t},h}let Gs=null;function $r(s,e,t){const n=new Zn().load(Jt(`assets/tex/${s}.webp`));return n.wrapS=n.wrapT=Pn,n.repeat.set(t,t),e&&(n.colorSpace=gt),n}function Yh(s=5200700,e=5917242){Gs??(Gs={glove:$r("glove",!0,1),gloveN:$r("glove_n",!1,1),fab:$r("fabric",!0,2),fabN:$r("fabric_n",!1,2)});const t=new Ne,n=new $t({color:e,map:Gs.glove,normalMap:Gs.gloveN,roughness:.62,metalness:0,envMapIntensity:.7}),i=new $t({color:new he(s).multiplyScalar(1.6),map:Gs.fab,normalMap:Gs.fabN,roughness:.95,metalness:0});n.name="glove_leather",i.name="sleeve_fabric",t.add(new X(new Le(.09,.1,.085),n));for(let a=0;a<4;a++)t.add(Ue(new X(new ms(.014,.05,2,6).rotateZ(Math.PI/2),n),.02,.06-a*.026,-.05));t.add(Ue(new X(new ms(.016,.05,2,6).rotateX(Math.PI/2.4),n),-.045,.04,-.035)),t.add(Ue(new X(new Ve(.05,.045,.06,10).rotateZ(Math.PI/2),new $t({color:1776411,roughness:.7})),0,-.065,.02));const r=Ue(new X(new Ve(.06,.07,.42,10),i),.02,-.28,.06);return t.add(r),t.userData.glove=!0,t}function iv(s,e){return e?"rifle":{odst:"rifle",marine:"rifle",spartan:"rocket",line_watch:"shotgun",paladin:"pistol",ranger:"sniper",monkey_soldier:"smg"}[s]??"rifle"}async function sv(s,e=0){const t=s==="heli"?"heli":s==="tank2"?"tank_2":"tank_1",n=mr(await vs(t),s==="heli"?Ft.heli[1]:Ft.tank[1],Qc[t]);if(s==="heli"){n.updateMatrixWorld(!0);const o=new vt().setFromObject(n);vd(n,o.min.y+(o.max.y-o.min.y)*.78)}const i=[2828067,3485738,2236188,4862756,5913382];let r=e;dr(n,()=>i[(r++*7+e)%i.length],!0);const a=n.children[0];return s==="heli"?(a.rotation.z=.42,a.rotation.x=.12,a.position.y=-.35):(a.rotation.z=.05+e%3*.03,a.position.y=-.18,a.traverse(o=>{/Turret|Gun/i.test(o.name)&&o.isMesh&&(o.rotation.y+=.6+e*.2,o.rotation.z+=.12)})),n.userData.kind="wreck",n}const rv=new Ca,Kh=new Map,Jh=new Map;function yd(s){let e=Kh.get(s);return e||(e=rv.loadAsync(Jt(`assets/glb/${s}.glb`)).then(t=>{const n=t.scene;return n.traverse(i=>{const r=i;if(!r.isMesh)return;r.castShadow=!0,r.receiveShadow=!0;const a=r.material;a&&"envMapIntensity"in a&&(a.envMapIntensity=.85)}),n}),Kh.set(s,e)),e}function Md(s){let e=Jh.get(s);return e||(e=yd(s).then(t=>{t.updateMatrixWorld(!0);const n=[];if(t.traverse(r=>{const a=r;if(!a.isMesh||!a.geometry)return;const o=a.geometry.clone();o.applyMatrix4(a.matrixWorld),n.push(o)}),!n.length)return new Et(.5,12,8);n.sort((r,a)=>{var o,c;return(((o=a.getAttribute("position"))==null?void 0:o.count)??0)-(((c=r.getAttribute("position"))==null?void 0:c.count)??0)});const i=n[0];return i.computeVertexNormals(),i}),Jh.set(s,e)),e}function Zh(s){return yd(s).then(e=>e.clone(!0))}const av={dart_monkey:"tower_dart",ninja_monkey:"tower_ninja",wizard_monkey:"tower_wizard",sniper_monkey:"tower_sniper",super_monkey:"tower_apex",glue_slinger:"tower_glue"},Qh={dart:"gun_dart",shuriken:"gun_shuriken",magic:"gun_staff",laser:"gun_laser",rail:"gun_sniper",glue:"gun_glue",bullet:"gun_sniper"},ov=["red","blue","green","yellow","pink","lead","ceramic"],$h=new Map,cv=new Zn;function So(s){const e=s;let t=$h.get(e);if(t)return t;const n=s.startsWith("boss_")||s.startsWith("bug_")||s.startsWith("bloon_")?s:s==="bile_titan"?"bug_titan":s==="gargoyle"?"bug_gargoyle":["red","blue","green","yellow","pink","lead","ceramic","moab"].includes(s)?`bloon_${s}`:`bug_${s}`;return t=cv.load(Jt(`assets/v3/${n}.webp`)),t.colorSpace=gt,t.anisotropy=4,$h.set(e,t),t}function lv(s){const e=ov.includes(s)?s:"red";return Md(`bloon_${e}`)}function hv(){return Md("bug_scavenger")}const eu=new Map;function Mi(s,e){let t=eu.get(s);if(!t){const n=e();if(t=n.index?n.toNonIndexed():n,!t.getAttribute("uv")){const i=t.getAttribute("position"),r=new Float32Array(i.count*2);for(let a=0;a<i.count;a++)r[a*2]=i.getX(a),r[a*2+1]=i.getZ(a);t.setAttribute("uv",new Mt(r,2))}eu.set(s,t)}return t}const uv=()=>{const s=new hd;for(let e=0;e<10;e++){const t=Math.PI/2+e*Math.PI/5,n=e%2?.45:1;s[e?"lineTo":"moveTo"](Math.cos(t)*n,Math.sin(t)*n)}return new Wc(s,{depth:1,bevelEnabled:!1}).translate(0,0,-.5)},dv=new C(0,1,0);class fv{constructor(){this.parts=[],this.head=!1,this.off=[0,0,0],this.pivot=[0,0,0],this.seed=7}rnd(){return this.seed=this.seed*16807%2147483647,this.seed/2147483647}add(e,t,n,i,r={},a){const o=a??new Ln().setFromEuler(new on(...r.r??[0,0,0],"YZX")),c=new ze().compose(new C(t[0]+this.off[0],t[1]+this.off[1],t[2]+this.off[2]),o,new C(...n)),l=!!r.glow;this.parts.push({g:e,m:c,c:i,glow:l,head:r.head??this.head,mat:r.mat??Yx(i,l)})}box(e,t,n,i,r,a){this.add(Mi("box",()=>new Le(1,1,1)),i,[e,t,n],r,a)}cyl(e,t,n,i,r,a={}){const o=Math.max(e,t,1e-4),c=+(e/o).toFixed(2),l=+(t/o).toFixed(2),h=a.seg??10;this.add(Mi(`c${c}/${l}/${h}`,()=>new Ve(c,l,1,h)),i,[o,n,o],r,a)}sph(e,t,n,i,r,a){this.add(Mi("s",()=>new Et(1,12,8)),i,[e,t,n],r,a)}hemi(e,t,n,i,r,a){this.add(Mi("h",()=>new Et(1,12,5,0,Math.PI*2,0,Math.PI/2)),i,[e,t,n],r,a)}tor(e,t,n,i,r){const a=+(t/e).toFixed(2);this.add(Mi("t"+a,()=>new gs(1,a,5,14)),n,[e,e,e],i,r)}star(e,t,n,i,r){this.add(Mi("star",uv),n,[e,e,t],i,r)}limb(e,t,n,i,r={}){const a=new C(...e),o=new C(...t).sub(a),c=o.length(),l=new Ln().setFromUnitVectors(dv,o.clone().normalize()),h=a.addScaledVector(o,.5),u=r.r2??n,d=Math.max(n,u),f=`c${+(u/d).toFixed(2)}/${+(n/d).toFixed(2)}/${r.seg??7}`;this.add(Mi(f,()=>new Ve(u/d,n/d,1,r.seg??7)),[h.x,h.y,h.z],[d,c,d],i,r,l)}chain(e,t,n,i={}){for(let r=0;r<e.length-1;r++){const a=i.taper??1,o=t*Math.pow(a,r),c=t*Math.pow(a,r+1);this.limb(e[r],e[r+1],o,n,{...i,r2:c}),this.sph(c,c,c,e[r+1],n,i)}}barrel(e,t,n,i,r){this.limb(e,[e[0]+t,e[1],e[2]],n,i,{seg:8,...r})}leaf(e,t,n,i,r=.35,a=.42){const o=Math.cos(t),c=-Math.sin(t);this.sph(n,.035,n*a,[e[0]+o*n*.85,e[1]+Math.sin(r)*n*.6,e[2]+c*n*.85],i,{r:[0,t,r]})}ring(e,t,n,i,r=0){for(let a=0;a<e;a++){const o=r+a/e*Math.PI*2;i(Math.cos(o)*t,Math.sin(o)*t,o,a)}}}const ct={fur:7031343,face:14267530,dirt:4862755,grass:5212716,leaf:4161322,wood:8016434,gold:14725168};function An(s,e=1,t=ct.dirt){s.cyl(e*.85,e,.3,[0,.15,0],t,{seg:12});for(let n=0;n<7;n++){const i=n*.9+.3,r=e*(.55+.4*s.rnd());s.cyl(0,.06,.25,[Math.cos(i)*r,.38,Math.sin(i)*r],ct.grass,{seg:4})}}function Hs(s,e=7169370){s.cyl(.85,.95,.18,[0,.09,0],e,{seg:12})}function li(s,e){const t=e.fur??ct.fur,n=e.face??ct.face,i=e.legs??e.torso,r=e.arms??e.torso,a=e.boots??2826777,o=e.crouch?-.38:0;if(e.robe)s.cyl(.34,.6,1.15,[0,.58,0],e.torso,{seg:10}),e.trim&&s.tor(.59,.035,[0,.04,0],e.trim,{r:[Math.PI/2,0,0]});else for(const f of[1,-1]){const b=e.crouch?f>0?[[-.05,.6,.18],[.38,.55,.22],[.25,.08,.22]]:[[-.05,.6,-.18],[.05,.12,-.2],[-.42,.1,-.2]]:[[0,.95,.17*f],[.12,.5,.2*f],[0,.1,.2*f]];s.chain(b,.12,i,{taper:.85});const g=b[2];s.box(.36,.15,.18,[g[0]+.08,.075,g[2]],a)}if(s.sph(.34,.47,.38,[0,1.36+o,0],e.torso),s.sph(.2,.26,.26,[.17,1.28+o,0],e.armor??n),e.armor){s.sph(.3,.37,.35,[.07,1.42+o,0],e.armor);for(const f of[1,-1])s.sph(.17,.13,.19,[0,1.73+o,.42*f],e.armor)}e.belt&&s.tor(.33,.05,[0,1.05+o,0],e.belt,{r:[Math.PI/2,0,0]}),e.scarf&&(s.tor(.23,.07,[0,1.76+o,0],e.scarf,{r:[Math.PI/2,0,0]}),s.chain([[-.15,1.75+o,.08],[-.4,1.55+o,.18],[-.55,1.3+o,.12]],.06,e.scarf)),e.gem&&s.sph(.08,.08,.08,[.36,1.48+o,0],e.gem,{glow:!0}),e.pack&&s.box(.3,.55,.48,[-.38,1.4+o,0],e.pack),e.cape&&s.box(.06,1.35,.85,[-.42,1.15+o,0],e.cape,{r:[0,0,-.22]});const c=1.68+o,l=e.punch?[.78,c-.05,.3]:[.52,1.42+o,.32],h=e.punch?[.3,1.25+o,-.45]:[.48,1.4+o,-.22];s.chain([[0,c,.4],e.punch?[.4,c-.02,.38]:[.2,1.36+o,.47],l],.1,r,{taper:.85}),s.chain([[0,c,-.4],e.punch?[.05,1.35+o,-.5]:[.22,1.33+o,-.47],h],.1,r,{taper:.85}),s.sph(.1,.1,.1,l,n),s.sph(.1,.1,.1,h,n);const u=2.06+o;s.sph(.31,.31,.31,[0,u,0],t),s.sph(.16,.21,.24,[.19,u-.03,0],n),s.sph(.12,.1,.16,[.3,u-.1,0],n);for(const f of[1,-1])s.sph(.045,.045,.045,[.33,u+.05,.09*f],1118481),s.sph(.05,.11,.1,[0,u+.02,.31*f],n);s.box(.06,.04,.3,[.32,u+.11,0],t),s.chain([[-.28,1+o,0],[-.62,.78+o,.06],[-.88,1.02+o,.1],[-.85,1.4+o,.1]],.055,t);const d=e.hatC??e.torso;switch(e.hat){case"wizard":s.cyl(.5,.5,.05,[0,u+.2,0],d,{seg:12}),s.cyl(0,.33,.8,[-.04,u+.6,0],d,{r:[0,0,.22]});break;case"cowboy":s.cyl(.52,.52,.04,[0,u+.22,0],d,{seg:12}),s.cyl(.24,.29,.26,[0,u+.36,0],d);break;case"hood":s.sph(.34,.35,.35,[-.07,u+.03,0],d);break;case"ninja":s.sph(.34,.35,.35,[-.07,u+.03,0],d),s.box(.12,.12,.42,[.26,u-.08,0],d),s.chain([[-.3,u+.05,0],[-.6,u-.1,.1],[-.75,u-.3,.05]],.04,d);break;case"helmet":s.hemi(.36,.3,.36,[-.02,u+.04,0],d);break;case"hazmat":s.sph(.4,.4,.4,[0,u,0],d),s.sph(.12,.2,.28,[.3,u,0],10148095,{glow:!0});break}if(e.ghillie)for(let f=0;f<26;f++){const b=s.rnd()*6.28,g=.9+s.rnd()*1.3+o,p=.32+s.rnd()*.12;s.sph(.11,.09,.11,[Math.cos(b)*p*.8-.05,g,Math.sin(b)*p],f%3?e.ghillie:6978106)}return{rh:l,lh:h}}const it=(s,e,t,n)=>[s[0]+e,s[1]+t,s[2]+n];function wo(s,e){s.head=!1,s.cyl(1.15,1.28,.75,[0,.38,0],[5462605,5001800,4672322][e],{seg:8}),s.cyl(.72,.8,.14,[0,.82,0],3356719,{seg:8}),s.box(.1,.22,.6,[1.17,.38,0],e?5929664:3828432,{glow:e===0}),e>=1&&s.ring(4,1.12,0,(t,n,i)=>s.box(.35,.5,.06,[t,.4,n],4080185,{r:[0,-i+Math.PI/2,0]}),Math.PI/4),e>=2&&s.ring(16,1.22,0,(t,n,i,r)=>s.box(.08,.12,.42,[t,.6,n],r%2?14196768:2236962,{r:[0,-i,0]})),s.pivot=[0,1.15,0],s.head=!0}const pv={dart_monkey(s,e){Hs(s),s.head=!0,s.off=[0,.18,0];const{rh:t,lh:n}=li(s,{torso:[5913120,5190688,9080728][e],legs:4864554,armor:e===2?12172998:void 0,scarf:e===1?2771594:void 0,belt:e>=1?3811866:void 0,gem:e===2?16762954:void 0,pack:e>=1?4861976:void 0}),i=e+1;for(let r=0;r<i;r++){const a=(r-(i-1)/2)*.07;s.barrel(it(t,-.1,.04,a),.5,.022,9071168),s.cyl(0,.045,.14,it(t,.47,.04,a),e===2?ct.gold:10133672,{r:[0,0,-Math.PI/2]}),s.box(.08,.08,.01,it(t,-.08,.04,a),12595248)}s.sph(.06,.06,.06,n,9071168)},ninja_monkey(s,e){Hs(s,4868690),s.head=!0,s.off=[0,.18,0];const t=[1842466,1977436,8133917][e],{rh:n,lh:i}=li(s,{torso:t,legs:t,hat:"ninja",hatC:e===2?5903380:1579036,belt:e>=1?11545130:3355443,armor:e===2?3806485:void 0,scarf:e===2?13934624:void 0}),r=e===2?16762944:10528430;s.star(.17,.03,it(n,.12,.05,0),r,{r:[0,Math.PI/2,0],glow:e===2}),e>=1&&s.star(.15,.03,it(i,.1,.06,0),r,{r:[0,Math.PI/2,.4],glow:e===2}),e>=1&&s.limb([-.4,1.3,-.15],[-.25,2.2,.2],.035,2763306)},wizard_monkey(s,e){Hs(s,5919848),s.head=!0,s.off=[0,.18,0];const t=[3100559,5910410,14275302][e],n=[10137824,ct.gold,6961824][e],{rh:i,lh:r}=li(s,{torso:t,robe:!0,trim:n,hat:"wizard",hatC:e===2?9071304:t,belt:n});s.limb(it(r,0,-1.25,0),it(r,0,.75+e*.12,0),.04,6965802);const a=it(r,0,.9+e*.12,0),o=.1+e*.03;s.cyl(0,o,o*1.6,it(a,0,o*.8,0),11563263,{glow:!0,seg:6}),s.cyl(o,0,o*1.2,it(a,0,-o*.6,0),9457888,{glow:!0,seg:6}),e>=1&&s.tor(o*1.3,.02,a,ct.gold,{r:[Math.PI/2,0,0]}),e>=1&&(s.box(.26,.07,.34,it(i,.08,0,0),5909018),s.box(.22,.02,.3,it(i,.08,.045,0),15786160,{glow:!0})),e===2&&s.ring(3,.75,0,(c,l)=>s.sph(.08,.08,.08,[c,2.4,l],13672703,{glow:!0}))},super_monkey(s,e){s.cyl(.9,.9,.04,[0,.03,0],[12593706,3832528,14725168][e],{glow:!0,seg:16}),s.cyl(.7,.7,.05,[0,.04,0],3158064,{seg:16}),s.head=!0,s.off=[0,.55,0];const t=[12593706,2047903,14200896][e],n=[2767514,1714794,13146672][e];li(s,{torso:t,legs:n,arms:t,cape:[11542046,1714794,14198832][e],armor:e>=1?[0,3828432,15782e3][e]:void 0,gem:e>=1?[0,7000319,16777215][e]:16764992,punch:!0,boots:[11542046,1384522,11567136][e],hat:e===1?"helmet":"none",hatC:2771632})},money_monkey(s,e){s.box(1,.09,1.9,[.15,.86,0],6963238);for(const i of[1,-1])s.box(.9,.8,.45,[.15,.4,.68*i],5911584);if(s.box(.45,.9,.6,[-.95,.75,0],2763306),s.off=[-.7,-.4,0],li(s,{torso:[8018490,15658734,2237738][e],arms:[8018490,15658734,2237738][e],legs:3355443}),e>=1&&s.box(.03,.4,.08,[.36,1.33,0],e===2?9050650:2771594),s.off=[0,0,0],e===0)s.box(.4,.03,.5,[.05,.92,0],3355443),s.box(.03,.32,.5,[.25,1.08,0],3355443,{r:[0,0,.25]}),s.box(.02,.27,.44,[.235,1.08,0],8040703,{r:[0,0,.25],glow:!0});else for(const i of e===2?[-.5,0,.5]:[-.3,.3])s.box(.06,.42,.5,[.35,1.22,i],2236962),s.box(.02,.36,.44,[.31,1.22,i],2787914,{glow:!0}),s.box(.06,.25,.06,[.38,.98,i],2236962);const n=e===0?2:e===1?3:5;for(let i=0;i<n;i++)s.cyl(.11,.11,.1+i*.05,[.45,.95+i*.025,-.75+i*.12],ct.gold,{seg:10});if(e>=1&&s.sph(.2,.24,.2,[.4,1.12,.78],11569744),e===2){s.box(.7,2,.75,[-.6,1,-1.3],1842980);for(let i=0;i<6;i++)s.box(.02,.05,.5,[-.24,.35+i*.28,-1.3],i%2?4259712:4235519,{glow:!0});s.ring(7,.5,0,(i,r)=>s.cyl(0,.32,.4+s.rnd()*.25,[.9+i,.2,1.2+r],ct.gold,{seg:7})),s.box(.6,.6,.6,[.9,.3,-1.2],9075280),s.cyl(.08,.08,.05,[1.21,.35,-1.2],3355443,{r:[0,0,Math.PI/2]})}},solar_pea_fusion(s,e){An(s);for(let r=0;r<6;r++)s.leaf([0,.35,0],r*1.05+.3,.55+.1*e,ct.leaf,.25);s.chain([[0,.3,0],[-.08,.9,0],[.02,1.5,0]],.1,4885034),s.leaf([0,1,0],2,.4,ct.leaf,.5),s.leaf([0,1,0],-1.1,.4,ct.leaf,.5),s.pivot=[.02,1.75,0],s.head=!0;const t=1.75;if(e===0){s.sph(.45,.42,.42,[0,t,0],5933610);for(const r of[-.18,0,.18])s.tor(.4,.02,[r,t,0],3828250,{r:[0,Math.PI/2,0]})}else s.sph(.4,.4,.4,[-.1,t,0],6967328),s.ring(12,.55+e*.08,0,(r,a,o)=>s.sph(.05,.12,.26,[-.12,t+r,a],16106776,{r:[o,0,0]}));const n=e+1,i=n===1?[0]:n===2?[-.24,.24]:[-.38,0,.38];for(const r of i)s.barrel([.15,t,r],.45,.19,14266416,{seg:12}),s.cyl(.16,.16,.04,[.61,t,r],16773232,{r:[0,0,Math.PI/2],glow:!0})},gatling_cherry_bomber(s,e){An(s);const t=[4880938,6965802,5913120][e];e===0?s.chain([[0,.3,0],[-.1,.7,.05],[0,1.05,0]],.08,t):s.cyl(.2+e*.06,.42+e*.12,.9+e*.1,[0,.7,0],t,{seg:7});for(let a=0;a<5;a++)s.leaf([0,.35,0],a*1.3,.5,ct.leaf,.3);s.pivot=[0,1.25+e*.15,0],s.head=!0;const n=s.pivot[1],i=[5933626,5933626,3820074][e];s.ring(6,.2+e*.03,0,(a,o)=>s.barrel([-.35,n+a,o],1.15+e*.15,.1+e*.015,i,{seg:7}));for(const a of[-.15,.3,.65])s.tor(.33+e*.05,.05,[a,n,0],6965802,{r:[0,Math.PI/2,0]});const r=2+e*3;for(let a=0;a<r;a++){const o=(a%2?1:-1)*(.32+(a>>1)*.12),c=-.3+(a>>1)*.18,l=n-.35-a%3*.08;s.sph(.14,.14,.14,[c,l,o],12588060),s.limb([c,l+.12,o],[c-.05,n+.15,o*.6],.015,3828250)}},flame_melon_mortar(s,e){An(s,1,e===2?2759960:ct.dirt),e===2&&s.ring(6,.6,0,(c,l,h)=>s.box(.5,.03,.06,[c,.31,l],16732176,{r:[0,-h,0],glow:!0})),s.head=!0;const t=[5917226,4864548,3811872][e],n=.2+e*.06,i=[.45,2.05+e*.1,0];s.chain([[0,.25,0],[-.25,.9,0],[.05,1.6,0],i],n,t,{taper:.85}),e>=1&&s.chain([[.02,.25,.1],[-.2,1,.12]],.05,16738848,{glow:!0}),s.cyl(.45,.2,.3,it(i,.05,.1,0),4876842);const r=e===2?2779786:3111471;s.sph(.3,.28,.3,it(i,.05,.32,0),r);for(const c of[-.6,0,.6])s.tor(.29,.02,it(i,.05,.32,0),1722906,{r:[0,c,0]});const a=e===2?6342911:16747040,o=3+e*2;for(let c=0;c<o;c++){const l=c/o*6.28;s.cyl(0,.08+.02*e,.25+.1*e+s.rnd()*.15,it(i,.05+Math.cos(l)*.15,.62+.1*e,Math.sin(l)*.15),c%2?a:16764992,{glow:!0,seg:5})}},star_emperor(s,e){An(s);const t=[4160042,2775706,3811962][e],n=[5937722,4881088,5913248][e];for(let i=0;i<4;i++)s.ring(7,.15,0,(r,a,o)=>s.leaf([0,.4+i*.42,0],o+i*.4,.75-i*.14,i%2?t:n,.7-i*.05,.35));s.cyl(.08,.14,1.9,[0,1.1,0],3824170),s.pivot=[0,2.35,0],s.head=!0,s.star(.42,.14,[0,2.35,0],16764976,{r:[0,Math.PI/2,0]}),s.sph(.12,.12,.12,[.06,2.35,0],16774816,{glow:!0}),e===2&&(s.cyl(.2,.16,.16,[0,2.86,0],ct.gold),s.ring(5,.18,0,(i,r)=>s.cyl(0,.04,.16,[i,3,r],ct.gold,{seg:4})),s.ring(6,.9,0,(i,r)=>s.sph(.05,.05,.05,[i,1.6+Math.abs(i),r],16773280,{glow:!0})))},frost_wallnut_bastion(s,e){An(s,1.2,e?3814448:ct.dirt),s.head=!0;const t=e===0?1:.82;s.sph(t,t*.95,t,[0,t*.95,0],9068608);for(const n of[0,.9,1.8,2.6])s.tor(t*.98,.05,[0,t*.95,0],5913124,{r:[Math.PI/2+.3,n,0]});if(e===0)for(let n=0;n<6;n++)s.cyl(0,.08,.35,[Math.cos(n)*.5,1.8,Math.sin(n)*.5],14217471,{seg:4,r:[.3,n,0]});else{const n=e===1?9:14;for(let i=0;i<n;i++){const r=i/n*6.28+i%2*.2,a=.95+s.rnd()*.3,o=(e===1?1.2:1.8)+s.rnd()*(e===1?.6:1.1);s.cyl(0,.18+s.rnd()*.1,o,[Math.cos(r)*a,o/2+.2,Math.sin(r)*a],i%3?9097471:13167871,{seg:5,r:[0,0,0],glow:e===2&&i%4===0})}e===2&&s.sph(.35,.35,.35,[0,2.1,0],6340863,{glow:!0})}},unsc_autoturret(s,e){wo(s,e);const t=1.15,n=[5922896,5593420,5001286][e];s.sph(.6+e*.06,.48,.6+e*.06,[0,t,0],n),s.box(.5,.35,.9,[-.1,t+.15,0],4606784);const i=e===2?[-.18,.18]:[0];for(const r of i)s.barrel([.4,t,r],1.1+e*.2,.09,2764078),s.cyl(.13,.13,.22,[1.5+e*.2,t,r],1974306,{r:[0,0,Math.PI/2],seg:8});if(e>=1)for(const r of[1,-1])s.box(.6,.35,.08,[.1,t,.62*r],4080185);e===2&&(s.cyl(.08,.08,.35,[.1,t+.5,0],2236962,{r:[0,0,Math.PI/2]}),s.cyl(.06,.06,.02,[.28,t+.5,0],16732240,{r:[0,0,Math.PI/2],glow:!0}))},unsc_flak(s,e){wo(s,e);const t=1.15;s.sph(.6,.52,.65,[0,t,0],[5791311,5462089,5001286][e]),s.box(.4,.3,.5,[-.25,t+.3,0],4606784);const n=e===0?[0]:e===1?[-.32,.32]:[-.36,-.18,.18,.36],i=e===2?.07:.1;for(const r of n)s.barrel([.3,t,r],1.05+e*.1,i,2764078),s.cyl(i*1.5,i*1.5,.25,[1.3+e*.1,t,r],1974306,{r:[0,0,Math.PI/2],seg:8});if(e>=1)for(const r of[1,-1])s.sph(.3,.3,.2,[0,t,.62*r],4212028);e===2&&(s.box(.25,.14,.2,[-.2,t+.55,0],3828479,{glow:!0}),s.tor(.62,.03,[0,t-.1,0],14196768,{r:[Math.PI/2,0,0]}))},unsc_rail(s,e){wo(s,e);const t=1.2;s.sph(.95,.42,.5,[-.1,t,0],[5922920,5593954,4869973][e]),s.box(.9,.2,.6,[-.3,t+.3,0],4212043);for(const i of[1,-1])s.box(1.7+e*.2,.1,.07,[1.35+e*.1,t,.13*i],2764080);const n=6+e*2;for(let i=0;i<n;i++)s.tor(.13,.035,[.65+i*.22,t,0],4251903,{r:[0,Math.PI/2,0],glow:!0});if(s.barrel([.5,t,0],1.7+e*.2,.05,10155263,{glow:!0}),e>=1)for(const i of[1,-1])s.sph(.45,.15,.15,[-.1,t,.62*i],5264732),s.limb([-.1,t,.5*i],[-.1,t,.3*i],.05,3355443);if(e===2){s.sph(.2,.2,.2,[.45,t,0],8454143,{glow:!0});for(const i of[1,-1])s.box(1.2,.04,.04,[-.1,t+.2,.5*i],14196768)}},unsc_firebase(s,e){const t=[5988181,5198668,4606532][e];s.ring(16,1.45,0,(n,i,r)=>s.sph(.32,.18,.2,[n,.17,i],11049584,{r:[0,-r+Math.PI/2,0]})),s.ring(14,1.42,0,(n,i,r)=>s.sph(.32,.17,.2,[n,.45,i],10128484,{r:[0,-r+Math.PI/2,0]}),.2),s.box(2.1,1,1.9,[0,.5,0],t),s.box(2.3,.14,2.1,[0,1.06,0],4080187),s.box(.06,.16,1.2,[1.06,.72,0],1118481),e===0&&(s.limb([-.8,1.1,-.7],[-.8,2.6,-.7],.03,8947848),s.box(.04,.45,.7,[-.8,2.35,-.35],2775728),s.sph(.1,.1,.02,[-.78,2.35,-.35],16777215)),e===2&&(s.box(.9,1,.9,[-.3,1.6,0],4080187),s.box(.92,.1,.92,[-.3,2.13,0],2764072),s.limb([-.3,2.1,0],[-.3,3.4,0],.03,10066329),s.sph(.06,.06,.06,[-.3,3.42,0],16724016,{glow:!0}),s.box(.05,.5,.5,[1.06,.3,.6],16752704,{glow:!0}),s.ring(4,1,0,(n,i)=>s.sph(.05,.05,.05,[n*1.05,1.17,i*.95],16764992,{glow:!0}),Math.PI/4)),e>=1&&(s.pivot=[.5,1.2,.5],s.head=!0,s.cyl(.05,.05,.35,[.5,1.3,.5],6710886),s.hemi(.45,.18,.45,[.62,1.55,.5],11580592,{r:[0,0,-1.2]}),s.limb([.62,1.55,.5],[.95,1.65,.5],.02,3355443))},unsc_depot(s,e){s.box(2.4,.22,2.4,[0,.11,0],5592910),s.ring(4,1.2,0,(n,i,r)=>s.box(.08,.04,1.6,[n,.23,i],14196768,{r:[0,-r,0]}));const t=5922880;if(s.box(.7,.55,.7,[-.6,.5,-.55],t),s.box(.7,.55,.7,[-.6,.5,.25],t),s.box(.6,.45,.6,[-.6,1,-.15],5133368),s.cyl(.22,.22,.6,[.75,.52,-.75],3820074),s.cyl(.22,.22,.6,[.75,.52,-.25],3820074),e>=1){s.box(.9,.85,1.6,[.55,.65,.4],4876938);for(let n=0;n<6;n++)s.box(.92,.8,.03,[.55,.65,-.35+n*.25],3824250);s.limb([-.95,.2,.95],[-.95,2.4,.95],.08,14196768),s.limb([-.95,2.35,.95],[.4,2.1,.2],.06,14196768),s.limb([.4,2.1,.2],[.4,1.4,.2],.01,2236962)}e===2&&(s.sph(.5,.85,.5,[.1,1.95,-.2],9079418),s.cyl(.35,.5,.3,[.1,1.15,-.2],4473924),s.limb([1,.2,-1],[1,2.8,-1],.035,10066329),s.sph(.07,.07,.07,[1,2.85,-1],16752688,{glow:!0}),s.ring(4,1.55,0,(n,i)=>s.sph(.06,.06,.06,[n*.75,.26,i*.75],16752688,{glow:!0}),Math.PI/4))},sniper_monkey(s,e){s.head=!0;for(let r=0;r<3;r++)for(let a=0;a<2;a++)s.sph(.3,.16,.22,[.95,.16+a*.3,(r-1)*.42+a*.2],11049584);const t=[4872746,5200442,2369066][e],{rh:n}=li(s,{torso:t,legs:t,crouch:!0,ghillie:e===0?5925418:void 0,hat:e===0?"hood":"helmet",hatC:[5596458,4870709,1579292][e],pack:e>=1?3817258:void 0,belt:e>=1?2763290:void 0}),i=[.15,n[1]+.08,.1];s.box(.75,.13,.08,[i[0]+.25,i[1],i[2]],2763306),s.barrel([i[0]+.6,i[1]+.02,i[2]],.9+e*.15,.03,1710618),s.cyl(.05,.05,.35,[i[0]+.35,i[1]+.12,i[2]],1118481,{r:[0,0,Math.PI/2]}),s.box(.3,.12,.07,[i[0]-.2,i[1]-.04,i[2]],e?3355443:6965802),s.limb([i[0]+1.2,i[1]-.02,i[2]],[i[0]+1.25,i[1]-.35,i[2]+.12],.012,2236962),s.limb([i[0]+1.2,i[1]-.02,i[2]],[i[0]+1.25,i[1]-.35,i[2]-.12],.012,2236962),e===2&&s.barrel([i[0]+1.5,i[1]-.05,i[2]],1.6,.012,16724016,{glow:!0})},glue_slinger(s,e){Hs(s,5921354),s.head=!0,s.off=[0,.18,0];const{rh:t,lh:n}=li(s,{torso:[7031343,5913124,14729248][e],legs:e===2?14729248:4864554,arms:e===2?14729248:void 0,hat:e===2?"hazmat":"none",hatC:14729248,pack:e===2?13150232:void 0,boots:e===2?2236962:void 0});if(e===1&&s.box(.08,.8,.5,[.37,1.25,0],3811872),e===0)s.limb(t,it(t,.15,.2,.08),.025,6965802),s.limb(t,it(t,.15,.2,-.08),.025,6965802),s.limb(it(t,-.05,-.15,0),t,.03,6965802),s.cyl(.18,.15,.3,[.2,.33,-.55],7829367),s.cyl(.16,.16,.02,[.2,.49,-.55],9109312,{glow:!0});else{const i=e===1?.45:.8,r=e===1?.07:.12;s.barrel(it(t,-.15,0,-.05),i,r,e===1?3824170:3355443),s.sph(r*1.6,r*1.6,r*1.6,it(t,0,.12,-.05),7000112),s.cyl(r*.8,r*.8,.04,it(t,i-.15,0,-.05),9109312,{r:[0,0,Math.PI/2],glow:!0}),s.sph(.06,.06,.06,n,9109312)}},banana_drop(s,e){const t=n=>{for(let i=0;i<4;i++)s.tor(.13,.035,[n[0]+(i-1.5)*.08,n[1],n[2]],15781920,{r:[0,Math.PI/2,i*.3]})};if(e===0){s.box(2,.15,2,[0,.08,0],8018490);for(const[n,i]of[[-.45,-.45],[.45,-.45],[-.45,.45],[.45,.45]])s.box(.8,.55,.8,[n,.43,i],ct.wood),t([n,.75,i]);s.limb([-.8,.2,-.8],[-.8,2.6,-.8],.03,6965802),s.box(.04,.6,.8,[-.8,2.25,-.4],15657176),t([-.76,2.25,-.4])}else if(e===1){s.box(1.8,.08,1.4,[0,1,0],ct.wood);for(const n of[-.8,.8])for(const i of[-.6,.6])s.limb([n,0,i],[n,1,i],.05,5913120);s.box(.7,.45,.6,[-.3,1.27,0],ct.wood),t([-.3,1.55,0]),t([.4,1.12,.2]),s.limb([.6,1,-.4],[.6,2.7,-.4],.03,14540253),s.ring(8,0,0,(n,i,r,a)=>s.cyl(0,.9,.45,[.6,2.55,-.4],a%2?15781952:4889146,{seg:8,r:[0,r,0]}))}else{s.cyl(1.25,1.35,.3,[0,.15,0],3816768,{seg:8}),s.ring(8,1.2,0,(n,i,r,a)=>s.box(.06,.06,.5,[n,.32,i],a%2?14196768:2236962,{r:[0,-r,0]}));for(const[n,i]of[[-.5,.5],[.5,.6],[.2,-.6]])s.box(.6,.5,.6,[n,.55,i],14196768),t([n,.85,i]);s.limb([-.8,.3,-.6],[-.8,2.6,-.6],.08,5592405),s.limb([-.8,2.55,-.6],[.4,2.3,0],.06,5592405),s.sph(.08,.08,.08,[-.8,2.7,-.6],16752688,{glow:!0}),s.ring(4,1,0,(n,i)=>s.sph(.06,.06,.06,[n,.36,i],4259712,{glow:!0}),Math.PI/4)}},sunflower(s,e){An(s);for(let n=0;n<6;n++)s.leaf([0,.35,0],n*1.05,.5,ct.leaf,.3);const t=(n,i)=>{s.cyl(.32*i,.32*i,.14*i,n,6963232,{r:[0,0,Math.PI/2],seg:14}),s.ring(14,.42*i,0,(r,a,o)=>s.sph(.05*i,.24*i,.11*i,[n[0]-.02,n[1]+r,n[2]+a],e===2?16764992:16106776,{r:[o-Math.PI/2,0,0]}));for(const r of[-.1,.1])s.sph(.04*i,.06*i,.04*i,[n[0]+.08*i,n[1]+.06*i,n[2]+r*i],1118481);s.tor(.1*i,.02,[n[0]+.08*i,n[1]-.08*i,n[2]],1118481,{r:[0,Math.PI/2,0]}),e===2&&s.sph(.12*i,.3*i,.3*i,[n[0]+.02,n[1],n[2]],16770688,{glow:!0})};s.chain([[0,.3,0],[-.05,1,0],[.05,1.7,0]],.07,4885034),s.leaf([0,.95,0],1.6,.4,ct.leaf,.4),s.leaf([0,1.2,0],-1.5,.35,ct.leaf,.4),e===1&&(s.chain([[0,.3,.1],[.05,.9,.35],[.1,1.15,.45]],.05,4885034),t([.15,1.2,.45],.75)),s.pivot=[.05,1.95,0],s.head=!0,t([.08,1.95,0],e===2?1.35:1.05)},repeater_gatling(s,e){An(s);for(let i=0;i<7;i++)s.leaf([0,.35,0],i*.9,.55,ct.leaf,.3);if(e===0){for(const i of[-.33,.33])s.chain([[0,.3,i*.5],[-.05,.9,i],[0,1.25,i]],.07,4885034),s.leaf([0,.9,i],i>0?-1.4:1.4,.3,ct.leaf);s.pivot=[0,1.4,0],s.head=!0;for(const i of[-.33,.33]){s.sph(.3,.3,.3,[0,1.4,i],6991914),s.barrel([.15,1.4,i],.4,.13,6991914),s.cyl(.11,.11,.02,[.56,1.4,i],1718794,{r:[0,0,Math.PI/2]});for(const r of[-.08,.08])s.sph(.04,.06,.04,[.24,1.5,i+r],1118481)}return}const t=e===1?6965802:11569728;s.cyl(.3,.5,.9,[0,.75,0],5913120,{seg:7}),s.pivot=[0,1.45,0],s.head=!0;const n=1.45;s.barrel([-.55,n,0],.9,.36,t,{seg:10}),s.tor(.37,.05,[-.1,n,0],3811860,{r:[0,Math.PI/2,0]}),s.ring(6,.17,0,(i,r)=>s.barrel([.3,n+i,r],.75,.07,3355443,{seg:6})),s.cyl(.28,.28,.06,[1.05,n,0],e===2?9109312:3355443,{r:[0,0,Math.PI/2],glow:e===2});for(let i=0;i<8;i++){const r=i*.45;s.sph(.09,.09,.09,[-.25+Math.sin(r)*.1,n-.4-Math.sin(r)*.25,.42+Math.cos(r)*.05-i*.04],8048688)}if(e===2)for(const i of[1,-1])s.leaf([-.4,n+.2,.2*i],i>0?-2.3:2.3,.6,13148224,.6)},wallnut_barrier(s){An(s,1);for(let e=0;e<6;e++)s.chain([[0,.5,0],[Math.cos(e)*.6,.25,Math.sin(e)*.6],[Math.cos(e)*.9,.05,Math.sin(e)*.9]],.06,6965802);s.head=!0,s.sph(.72,.95,.68,[0,1.1,0],10119738),s.tor(.69,.03,[0,1.1,0],6964262,{r:[Math.PI/2,0,.2]});for(const e of[-.2,.2])s.sph(.1,.12,.08,[.63,1.25,e],16050896),s.sph(.05,.06,.05,[.72,1.24,e],1118481),s.box(.04,.05,.22,[.68,1.42,e*1.1],3810836,{r:[e>0?-.4:.4,0,0]});s.box(.04,.04,.24,[.7,.92,0],3810836);for(let e=0;e<5;e++)s.leaf([0,2,0],e*1.25,.45,ct.leaf,.5)},cherry_pod(s){s.hemi(.95,.4,.75,[0,.4,0],8018490,{r:[Math.PI,0,0]}),s.tor(.9,.06,[0,.4,0],6965802,{r:[Math.PI/2,0,0]}),s.head=!0;for(const e of[-.38,.38]){s.sph(.45,.43,.45,[0,.75,e],12588060),s.sph(.12,.08,.12,[-.15,1.05,e-.1],16744576);for(const t of[-.1,.1])s.sph(.06,.06,.04,[.41,.85,e+t],1118481);s.box(.04,.04,.16,[.42,.97,e],2755082,{r:[e>0?-.5:.5,0,0]}),s.box(.04,.04,.2,[.43,.6,e],2755082),s.chain([[0,1.15,e*.9],[.05,1.6,e*.3],[.1,1.85,0]],.03,3832346)}s.sph(.14,.14,.14,[.1,1.95,0],16764992,{glow:!0}),s.ring(6,.18,0,(e,t)=>s.cyl(0,.03,.2,[.1+e,1.95,t],16744480,{glow:!0,seg:4,r:[t*5,0,-e*5]}))},stone_wall(s,e){const t=[6973024,6183509,4868165][e],n=.9+e*.25;if(s.ring(12,1.35,0,(i,r,a)=>s.sph(.32,.17,.2,[i*1.05,.17,r*.95],11049584,{r:[0,-a+Math.PI/2,0]})),s.box(2.2,n,.32,[0,n/2,.8],t),s.box(2.2,n,.32,[0,n/2,-.8],t),s.box(.32,n,1.9,[.95,n/2,0],t),s.box(.32,n,1.9,[-.95,n/2,0],t),s.box(1.7,.1,1.3,[0,.12,0],4866102),e>=1){for(let i=0;i<5;i++)s.box(.28,.25,.36,[-.88+i*.44,n+.12,.8],t),s.box(.28,.25,.36,[-.88+i*.44,n+.12,-.8],t);s.box(.05,.6,.45,[1.12,.3,0],2760728)}e===2&&(s.box(.9,1.9,.9,[-.2,.95,0],4078650),s.box(.92,.06,.92,[-.2,1.4,0],4235519,{glow:!0}),s.box(1,.12,1,[-.2,1.95,0],2763306),s.limb([-.2,2,0],[-.2,3.1,0],.03,10066329),s.sph(.06,.06,.06,[-.2,3.12,0],16724016,{glow:!0}))},boomerang_monkey(s,e){Hs(s),s.head=!0,s.off=[0,.18,0];const{rh:t}=li(s,{torso:[6965802,4863008,10119728][e],legs:4864554,hat:e===1?"cowboy":"none",hatC:5913120,belt:e===1?2759184:void 0,armor:e===2?11567168:void 0,scarf:e===1?9054762:void 0}),n=e===2?16762944:9067050;s.box(.42,.04,.1,it(t,.12,.12,.08),n,{r:[0,0,.6],glow:e===2}),s.box(.42,.04,.1,it(t,.12,-.08,.08),n,{r:[0,0,-.6],glow:e===2}),e>=1&&s.limb([-.3,1,-.3],[-.3,1.9,-.25],.025,6965802)},hypno_shroom(s,e){An(s,1,4864570),s.cyl(.38,.55,1.2,[0,.75,0],15784160,{seg:10});for(const t of[-.15,.15])s.sph(.05,.07,.05,[.45,1.05,t],2759210),s.box(.02,.02,.1,[.46,1.13,t],2759210,{r:[t>0?.3:-.3,0,0]});s.hemi(1.15,.8,1.15,[0,1.25,0],[14704816,15231168,15757504][e]),s.cyl(1.1,1.15,.06,[0,1.24,0],13127834,{seg:12});for(let t=0;t<4;t++){const n=.2+t*.22;s.tor(n,.04,[0,1.27+.8*Math.sqrt(Math.max(0,1-(n/1.15)**2)),0],9054896,{r:[Math.PI/2,0,0]})}if(e>=1&&s.ring(e===1?3:6,.95,0,(t,n,i,r)=>{const a=.3+r%3*.08;s.cyl(.06,.08,a,[t,.3+a/2,n],15784160),s.hemi(a*.7,a*.5,a*.7,[t,.3+a,n],13652160)},.5),e===2)for(let t=0;t<8;t++)s.sph(.05,.05,.05,[Math.cos(t)*1.2,1.5+t%3*.4,Math.sin(t)*1.2],16744703,{glow:!0})},chomper(s,e){An(s);for(let i=0;i<6;i++)s.leaf([0,.35,0],i*1.05,.6,3832362,.3);const t=[8006266,5904986,4856394][e];if(e===2){s.sph(.45,.6,.45,[0,1,0],3811898),s.tor(.42,.05,[0,1.15,0],ct.gold,{r:[Math.PI/2,0,0]});for(const i of[1,-1])s.chain([[0,1,.25*i],[.1,.5,.3*i],[0,.1,.3*i]],.12,3811898)}else s.chain([[0,.3,0],[-.15,.9,0],[0,1.45,0]],.1,3832362);if(e>=1)for(const i of[1,-1])s.chain([[0,1,.1*i],[-.3,.8,.45*i],[-.5,.95,.6*i]],.05,t);s.pivot=[.1,1.75,0],s.head=!0;const n=[.15,1.75,0];s.hemi(.55,.42,.48,it(n,0,.04,0),t,{r:[0,0,-.35]}),s.hemi(.5,.3,.44,it(n,0,-.04,0),t,{r:[Math.PI,0,.3]}),s.sph(.4,.05,.36,it(n,.12,-.02,0),11546688);for(let i=0;i<7;i++){const r=-1.2+i*.4;s.cyl(0,.045,.16,it(n,.3+Math.cos(r)*.15,.07,Math.sin(r)*.38),16052448,{seg:4,r:[0,0,Math.PI]}),s.cyl(0,.045,.14,it(n,.3+Math.cos(r)*.15,-.08,Math.sin(r)*.36),16052448,{seg:4})}for(let i=0;i<5;i++)s.sph(.07,.07,.07,it(n,-.1+i*.1,.36-Math.abs(i-2)*.04,0),10111642);e===2&&(s.cyl(.24,.2,.14,it(n,-.1,.48,0),ct.gold),s.ring(5,.22,0,(i,r)=>s.cyl(0,.05,.18,it(n,-.1+i,.62,r),ct.gold,{seg:4})),s.sph(.05,.05,.05,it(n,.12,.5,0),16728224,{glow:!0}))},tesla_coil(s,e){const n=e===2?14198848:12614202,i=1+e*.12;s.cyl(.95,1.05,.5,[0,.25,0],6965818,{seg:8}),s.cyl(.65,.8,.75*i,[0,.5+.37*i,0],8018504,{seg:8}),s.cyl(.42,.55,.85*i,[0,.5+.75*i+.42*i,0],5917248,{seg:8});const r=.5+1.6*i;for(const a of[.5,.5+.75*i,r-.1])s.tor(a>1.5?.45:a>1?.62:.8,.06,[0,a,0],n,{r:[Math.PI/2,0,0]});for(let a=0;a<6;a++)s.tor(.3-a*.025,.035,[0,r+.1+a*.12,0],n,{r:[Math.PI/2,0,0]});if(s.limb([0,r,0],[0,r+.85,0],.08,3815994),s.sph(.3,.3,.3,[0,r+1,0],e?8444159:n,{glow:e>0}),e>=1)for(let a=0;a<3+e*2;a++){const o=a*2.1;s.limb([0,r+1,0],[Math.cos(o)*.7,r+.6+a%2*.4,Math.sin(o)*.7],.015,10545407,{glow:!0})}e===2&&(s.ring(6,.5,0,(a,o)=>s.limb([a,r+.2,o],[a*.6,r+1.25,o*.6],.025,ct.gold)),s.ring(8,.85,0,(a,o)=>s.sph(.05,.05,.05,[a,.55,o],6342911,{glow:!0})))},arcane_obelisk(s,e){s.box(1.3,.3,1.3,[0,.15,0],7828588),s.box(1,.2,1,[0,.4,0],6973536);const n=2.6+e*.3;s.cyl(.24,.5,n,[0,.5+n/2,0],6446952,{seg:4,r:[0,Math.PI/4,0]}),s.cyl(0,.24,.4,[0,.7+n,0],6446952,{seg:4,r:[0,Math.PI/4,0]});for(let i=0;i<4;i++){const r=i*Math.PI/2;for(let a=0;a<4;a++){const o=.9+a*n*.2,c=.5-(o-.5)/n*.26;s.box(.02,.18,.12,[Math.cos(r)*c*.72,o,Math.sin(r)*c*.72],10510591,{r:[0,-r,0],glow:!0})}}if(e>=1){const i=1.15+n;s.cyl(0,.2,.35,[0,i+.17,0],11567359,{glow:!0,seg:4}),s.cyl(.2,0,.3,[0,i-.15,0],9461984,{glow:!0,seg:4})}e===2&&s.ring(4,.85,0,(i,r)=>{s.cyl(0,.1,.22,[i,2.4,r],13672703,{glow:!0,seg:4}),s.cyl(.1,0,.18,[i,2.2,r],10514687,{glow:!0,seg:4})})}},tu=new Map;function mv(s,e){if(!s.length)return null;const t=new he,n=s.map(r=>{const a=r.g.clone();a.applyMatrix4(r.m),e&&a.translate(-e[0],-e[1],-e[2]);const o=a.attributes.position.count,c=new Float32Array(o*3);t.setHex(r.c);const l=r.mat==="gold"||r.mat==="metal"||r.mat==="iron"?1.15:1.05;for(let h=0;h<o;h++)c.set([Math.min(1,t.r*l),Math.min(1,t.g*l),Math.min(1,t.b*l)],h*3);return a.setAttribute("color",new Mt(c,3)),a}),i=er(n,!1);return n.forEach(r=>r.dispose()),i}function nu(s,e){const t=new Map;for(const i of s){const r=i.mat,a=t.get(r);a?a.push(i):t.set(r,[i])}const n=[];for(const[i,r]of t){const a=mv(r,e);a&&n.push({g:a,mat:i})}return n}function gv(s,e){const t=s+":"+e;let n=tu.get(t);if(n)return n;const i=pv[s];if(!i)return null;const r=new fv;i(r,e);const a=r.pivot,o=nu(r.parts.filter(h=>!h.head),void 0),c=nu(r.parts.filter(h=>h.head),a),l=new vt;for(const h of r.parts){const u=h.g;u.boundingBox||u.computeBoundingBox(),l.union(u.boundingBox.clone().applyMatrix4(h.m))}return n={base:o,head:c,pivot:a,height:l.max.y},tu.set(t,n),n}const iu={dart_monkey:1.2,ninja_monkey:1.2,wizard_monkey:1.2,super_monkey:1.2,boomerang_monkey:1.2,glue_slinger:1.2,sniper_monkey:1.2,cherry_pod:1.3};function bv(s,e){const t=gv(s,e);if(!t)return null;const n=new Ne,i=new Ne;i.position.set(...t.pivot),n.add(i),n.scale.setScalar(iu[s]??1);for(const r of t.base){const a=new X(r.g,di(r.mat));a.castShadow=r.mat!=="glow",n.add(a)}for(const r of t.head){const a=new X(r.g,di(r.mat));a.castShadow=r.mat!=="glow",i.add(a)}return n.userData.tower3d=s+":"+e,n.userData.textured=!0,{root:n,head:i,height:t.height*(iu[s]??1)}}const Mc=["grass","sand","dirt","cobble","rock"],_v={grass:"burned",sand:"dryground",dirt:"burned",cobble:"mud",rock:"rock"},xv={grass:[.3187,.236,.1057],sand:[.2268,.1742,.1096],dirt:[.1255,.0859,.049],cobble:[.3016,.276,.2305],rock:[.1719,.1232,.0515],burned:[.1567,.1166,.0834],mud:[.1152,.0963,.074],dryground:[.2392,.2004,.1477]};let Vs=null;const Sd={value:0};function $c(s=!1){if(Vs&&(!s||Vs.burned))return Vs;const e=new Zn,t=Vs??{};for(const n of[...Mc,"water_n",...s?["burned","mud","dryground"]:[]]){if(t[n])continue;const i=e.load(Jt(`assets/tex/${n}.webp`));i.wrapS=i.wrapT=Pn,i.anisotropy=4,i.generateMipmaps=!0,i.minFilter=wn,n!=="water_n"&&(i.colorSpace=gt),t[n]=i}return Vs=t}function vv(){return $c().water_n}function Eo(s,e={}){const t=$c(!!e.war);return s.userData.detail=!0,s.onBeforeCompile=n=>{for(const r of Mc){const a=e.war?_v[r]:r;n.uniforms["t_"+r]={value:t[a]},n.uniforms["m_"+r]={value:new C(...xv[a])}}n.uniforms.t_wn={value:t.water_n},n.uniforms.uTime=Sd,n.uniforms.uStone={value:e.stone??.6},n.vertexShader=n.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vGW; varying float vGNy;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vGW = (modelMatrix * vec4(transformed, 1.0)).xyz; vGNy = normalize(mat3(modelMatrix) * objectNormal).y;`);const i=Mc.map(r=>`uniform sampler2D t_${r}; uniform vec3 m_${r};`).join(`
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
}`)},s.customProgramCacheKey=()=>"gdet"+(e.slope?"s":"")+(e.war?"w":"")+(e.stone??.6),s.needsUpdate=!0,s}function To(s){return $c()[s]}const yv={palm:"palm",palm_bend:"palm",palm_tall:"palm",oak:"oak",tree:"oak",tree_detailed:"jungle",pine:"pine",pine_round:"pine",bush:"bush",bush_big:"bush",fern:"fern",grass:"grass",dead:"dead"},Mv={palm:22,oak:20,jungle:20,pine:20,dead:20,bush:10,fern:9,grass:7},Sv=34,wv=new Ca().setMeshoptDecoder(xd),su=new Map,ru=new WeakMap;function Ev(s){return s.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace("#include <map_fragment>",`#include <map_fragment>
 diffuseColor.rgb = vec3(dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11))) * vec3(0.62, 0.47, 0.36);`)},s.customProgramCacheKey=()=>"charred",s}function au(s,e,t=!1){var i;let n=ru.get(s);return n||ru.set(s,n=[]),t?n[i=3+e]??(n[i]=Ev(e===0?new Ut({map:s.mat.map,side:Ct}):new $t({map:s.mat.map,normalMap:e>=2?s.mat.normalMap:null,roughness:.95,metalness:0,side:Ct,envMapIntensity:.4}))):e>=2?s.mat:n[e]??(n[e]=e===1?new $t({map:s.mat.map,roughness:.9,metalness:0,side:Ct,envMapIntensity:.6}):new Ut({map:s.mat.map,side:Ct}))}function Tv(s){let e=su.get(s);return e||(e=wv.loadAsync(Jt(`assets/flora_tex/${s}.glb`)).then(t=>{t.scene.updateMatrixWorld(!0);const n=u=>{const d=u.clone();for(const f of["position","normal","uv"]){const b=d.getAttribute(f);if(!b||b.array instanceof Float32Array)continue;const g=new Float32Array(b.count*b.itemSize);for(let p=0;p<b.count;p++)for(let m=0;m<b.itemSize;m++)g[p*b.itemSize+m]=b.getComponent(p,m);d.setAttribute(f,new Mt(g,b.itemSize))}return d},i=u=>{const d=t.scene.getObjectByName(u);return{m:d,g:n(d.geometry).applyMatrix4(d.matrixWorld)}},r=i("lod0"),a=i("lod1");r.g.computeBoundingBox();const o=r.g.boundingBox,c=1/Math.max(.001,o.max.y-o.min.y);for(const u of[r.g,a.g])u.translate(0,-o.min.y,0),u.scale(c,c,c);const l=r.m.material,h=new $t({map:l.map,normalMap:l.normalMap,roughness:.88,metalness:0,side:Ct,envMapIntensity:.6});return h.normalMap&&h.normalScale.set(.8,.8),h.name="flora_tex_"+s,{lod:[r.g,a.g],mat:h}}),su.set(s,e)),e}const Av={palm:"tree_palmTall",palm_bend:"tree_palmBend",palm_tall:"tree_palmDetailedTall",oak:"tree_oak",tree:"tree_default",tree_detailed:"tree_detailed",pine:"tree_pineTallA_detailed",pine_round:"tree_pineRoundC",bush:"plant_bushDetailed",bush_big:"plant_bushLarge",rock:"rock_largeC",rock_big:"rock_largeA",rock_tall:"rock_tallB",rock_small:"rock_smallC",stump:"stump_old",stump_round:"stump_roundDetailed",log:"log_large"},wd=/leaf|grass/i,ha=/palm/,ou={leafsGreen:[5208620,2827292],leafsDark:[3103280,2498843],grass:[4616236,3024928],woodBark:[7230008,2235415],woodBarkDark:[5652526,2038294],woodInner:[12098162,3812900],dirt:[9078140,5196614],_defaultMat:[8022608,2761760]},Ed=/^rock/,Rv=new Ca,cu=new Map;function Cv(s,e){const t=s+(e?"#b":"");let n=cu.get(t);return n||(n=Rv.loadAsync(Jt(`assets/flora/${Av[s]}.glb`)).then(i=>{const r=i.scene;r.updateMatrixWorld(!0);const a=new Map;r.traverse(u=>{const d=u;if(!d.isMesh)return;let f=d.geometry.clone().applyMatrix4(d.matrixWorld);for(const g of Object.keys(f.attributes))g!=="position"&&g!=="normal"&&f.deleteAttribute(g);f.index&&(f=f.toNonIndexed());const b=d.material.name||"_defaultMat";(a.get(b)??a.set(b,[]).get(b)).push(f)});const o=[...a.values()].flat(),c=new vt;for(const u of o)u.computeBoundingBox(),c.union(u.boundingBox);const l=1/Math.max(.001,c.max.y-c.min.y),h=[];for(const[u,d]of a){const f=er(d);if(f.translate(0,-c.min.y,0),f.scale(l,l,l),e&&wd.test(u)&&!Ed.test(s)){f.computeBoundingBox();const b=f.boundingBox.getCenter(new C),g=ha.test(s)?.78:.68;f.translate(-b.x,-b.y,-b.z),f.scale(g,g*(ha.test(s)?.7:.85),g),f.translate(b.x,b.y-(ha.test(s)?.03:.06),b.z)}f.computeVertexNormals(),h.push({geo:f,mat:u})}return h}),cu.set(t,n)),n}const lu=new Map;function Pv(s,e,t){const n=Ed.test(e),i=s+(t?"b":"")+(n?"r":"");let r=lu.get(i);if(!r){const a=n&&s==="grass"?[6122302,3814444]:ou[s]??ou._defaultMat;r=new Ut({color:a[t?1:0],flatShading:!0}),t&&wd.test(s)&&ha.test(e)&&r.color.setHex(5127207),lu.set(i,r)}return r}async function Lv(s,e,t=2){const n=new Ne;n.name="flora";const i=new Map,r=new Map;for(const b of s){b.burnt&&(b.k==="tree"||b.k==="oak"||b.k==="tree_detailed")&&(b.k="dead");const g=yv[b.k];if(g){const m=g+(b.burnt?"#b":"");(r.get(m)??r.set(m,[]).get(m)).push(b);continue}const p=b.k+(b.burnt?"#b":"");(i.get(p)??i.set(p,[]).get(p)).push(b)}const a=new ft,o=new he,c=[];await Promise.all([...r].map(async([b,g])=>{const[p,m]=b.split("#"),x=!!m,v=await Tv(p),_=au(v,t,x),R=new dn(v.lod[0],_,g.length),S=new dn(v.lod[1],_,g.length);R.userData.texModel=S.userData.texModel=v,R.userData.burnt=S.userData.burnt=x;const A={file:p,near:R,far:S,mats:[],cols:[],pos:[]};g.forEach((E,M)=>{a.position.set(E.x,E.y,E.z),a.rotation.set(E.tilt??0,E.rot,(E.tilt??0)*.6),a.scale.setScalar(E.h),a.updateMatrix();const y=.88+(M*2654435761>>>0)%1e3/1e3*.24;A.mats.push(a.matrix.clone()),A.cols.push(new he(y,y,y)),A.pos.push(new C(E.x,E.y+E.h*.4,E.z))});for(const E of[R,S])E.instanceColor=new Ci(new Float32Array(g.length*3),3),E.castShadow=e,E.receiveShadow=e,E.userData.flora=p,E.userData.tex=!0,E.frustumCulled=!1,n.add(E);S.castShadow=!1,S.userData.lod=1,c.push(A)}));const l=new C(1e9,0,0),h=new C,u=new C,d=new C,f=new C;return n.userData.updateLod=(b,g=!1)=>{if(b.getWorldPosition(u),b.getWorldDirection(d),d.y=0,d.normalize(),!g&&l.distanceToSquared(u)<2.25&&h.dot(d)>.97)return;l.copy(u),h.copy(d);let p=0;for(const m of c){let x=0,v=0;const _=Mv[m.file]??26;for(let R=0;R<m.mats.length;R++){f.subVectors(m.pos[R],u),f.y=0;const S=f.length();if(S>9&&f.dot(d)<-.3*S||m.file==="grass"&&S>Sv)continue;const A=S>_,E=A?m.far:m.near,M=A?v++:x++;E.setMatrixAt(M,m.mats[R]),E.setColorAt(M,m.cols[R])}m.near.count=x,m.far.count=v,p+=v;for(const R of[m.near,m.far])R.instanceMatrix.needsUpdate=!0,R.instanceColor&&(R.instanceColor.needsUpdate=!0)}n.userData.far=p},n.userData.texKinds=c.length,n.userData.setDetail=b=>n.traverse(g=>{const p=g;p.userData.texModel&&(p.material=au(p.userData.texModel,b,!!p.userData.burnt),b===0&&(p.castShadow=p.receiveShadow=!1))}),await Promise.all([...i].map(async([b,g])=>{const p=b.split("#")[0],m=b.endsWith("#b");for(const x of await Cv(p,m)){const v=new dn(x.geo,Pv(x.mat,p,m),g.length);g.forEach((_,R)=>{a.position.set(_.x,_.y,_.z),a.rotation.set(_.tilt??0,_.rot,(_.tilt??0)*.6),a.scale.setScalar(_.h),a.updateMatrix(),v.setMatrixAt(R,a.matrix);const S=.86+(R*2654435761>>>0)%1e3/1e3*.28;v.setColorAt(R,o.setScalar(S))}),v.castShadow=e,v.receiveShadow=e,v.userData.flora=p,v.frustumCulled=!1,n.add(v)}})),n}function hu(s,e){const t=e*.05;switch(s){case"oak":return{k:"oak",h:t*1.15};case"pine":return{k:"pine",h:t*1.5};case"rtree":return{k:"tree_detailed",h:t*1.2};case"palm":return{k:"palm",h:t*1.2};case"palm2":return{k:"palm_tall",h:t*1.25};case"bpalm":return{k:"palm",h:t*1.2,burnt:!0};case"bpalm2":return{k:"palm_bend",h:t*1.1,burnt:!0};case"deadtree":case"deadtree2":return{k:"tree",h:t*1.2,burnt:!0};case"hedge":case"bamboo":return{k:"bush_big",h:t*.32};case"monstera":case"fern":case"tbush":return{k:"fern",h:t*.22};case"rose":case"redflower":return{k:"bush",h:t*.24};case"boulders":case"vinerock":case"searocks":case"trock":return{k:e*7%3<1.5?"rock_big":"rock",h:t*.22};case"mossrock":return{k:"rock",h:t*.24};case"rubble":return{k:"rock_small",h:t*.16};case"stump":return{k:"stump",h:t*.16};case"log":return{k:"log",h:t*.12};default:return null}}const Sc=s=>new Ut({color:s});let ea=null;function uu(){if(ea)return ea;const s=document.createElement("canvas");s.width=s.height=64;const e=s.getContext("2d");for(let t=0;t<7;t++){const n=32+Math.cos(t*2.4)*9,i=32+Math.sin(t*2.4)*9,r=e.createRadialGradient(n,i,0,n,i,22);r.addColorStop(0,"rgba(255,255,255,0.55)"),r.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=r,e.fillRect(0,0,64,64)}return ea=new id(s),ea}let $i=null;function Td(s){!$i&&s&&($i=s.clone(),$i.repeat.set(3,.8),$i.needsUpdate=!0);const e=new Ne,t=new Ut({color:12104360,map:$i}),n=Sc(1184016),i=new Ut({color:5591114,map:$i}),r=(a,o,c,l,h,u=0,d=0)=>{const f=new X(a,o);return f.position.set(c,l,h),f.rotation.set(0,u,d),f.castShadow=f.receiveShadow=!0,e.add(f),f};r(new Ve(2.5,2.8,2,8),t,0,1,0,Math.PI/8),r(new Ve(2.9,2.9,.42,8),i,.15,2.2,.1,Math.PI/8+.05,.06);for(let a=0;a<3;a++){const o=-.6+a*.6;r(new Le(.12,.28,1.3),n,Math.cos(o)*2.62,1.45,Math.sin(o)*2.62,-o)}r(new Le(1.8,1.1,1.5),i,-2.4,.4,-1.9,.5,.35);for(let a=0;a<7;a++)r(new Ta(.3+a%3*.16,0),a%2?t:i,-2.2+a*.75,.18,2.9+a%2*.6);return e}function Iv(s){const e=new Ne,t=Sc(3812384),n=Sc(4868678);for(let a=0;a<=2;a++){const o=new X(new Ve(.05,.06,1.3,5),t);o.position.set(-s/2+a*s/2,.65,0),e.add(o)}const i=[],r=Math.round(s*2.2);for(let a=0;a<=r*12;a++){const o=a/(r*12),c=o*r*Math.PI*2;i.push(new C(-s/2+o*s,.48+Math.sin(c)*.45,Math.cos(c)*.45))}return e.add(new X(new qc(new sd(i),r*12,.012,3),n)),e}function Dv(s,e,t,n,i,r){const a={wrecks:0,smoke:0,props:0},o=[];let c=0;for(const[_,R,S,A]of e){const E=R*n,M=S*n,y=t(R,S),L=(R*13+S*7)%628/100;if(_==="wtank"||_==="wtank2"||_==="wheli"){const D=c++;sv(_==="wheli"?"heli":_==="wtank2"?"tank2":"tank",D).then(U=>{U.position.set(E,y,M),U.rotation.y=L,U.traverse(F=>{F.castShadow=!i,F.receiveShadow=!i}),U.userData.war=_,s.add(U),a.wrecks++}),o.push(new C(E,y+1.2,M))}else if(_==="bunker"){const D=Td(r);D.position.set(E,y-.1,M),D.rotation.y=L,D.userData.war=_,s.add(D),a.props++}else if(_==="sandbags"){const D=new Ne,U=tr();U.rotation.y=.35,U.position.x=-1.2;const F=tr();F.rotation.y=-.35,F.position.x=1.2,D.add(U,F),D.position.set(E,y,M),D.rotation.y=L,D.traverse(W=>{W.castShadow=!i}),D.userData.war=_,s.add(D),a.props++}else if(_==="wire"){const D=Iv(A*n*.9);D.position.set(E,y,M),D.rotation.y=L,D.userData.war=_,s.add(D),a.props++}}const l=new cr({map:uu(),color:3881012,transparent:!0,depthWrite:!1,opacity:.6,fog:!0}),h=[],u=i?8:13;for(const _ of o)for(let R=0;R<u;R++){const S=new fa(l.clone());S.renderOrder=2,s.add(S),h.push({s:S,base:_,t:R/u*9,life:9})}a.smoke=o.length;const d=new cr({map:uu(),color:16742954,transparent:!0,depthWrite:!1,blending:os}),f=o.map(_=>{const R=new fa(d.clone());return R.position.copy(_),R.position.y-=.4,R.scale.setScalar(2.4),s.add(R),R}),b=i?220:500,g=28,p=new Float32Array(b*3);for(let _=0;_<b;_++)p.set([(Math.random()-.5)*2*g,Math.random()*16,(Math.random()-.5)*2*g],_*3);const m=new bt;m.setAttribute("position",new Mt(p,3));const x=new nd(m,new zc({color:10130572,size:.06,transparent:!0,opacity:.8,depthWrite:!1}));x.frustumCulled=!1,x.name="ash",s.add(x);let v=0;return{count:a,update(_,R){v+=_;for(const E of h){E.t+=_,E.t>E.life&&(E.t-=E.life);const M=E.t/E.life,y=2.6+M*13;E.s.position.set(E.base.x+M*M*10+Math.sin(v*.5+E.base.x)*.6,E.base.y+M*24,E.base.z+M*M*4),E.s.scale.set(y,y,1),E.s.material.opacity=Math.min(1,M*8)*(1-M)*.95,E.s.material.color.setScalar(.16+M*.3)}f.forEach((E,M)=>{const y=.75+.25*Math.sin(v*9+M*2.1)*Math.sin(v*5.3+M);E.scale.setScalar(2.2*y+.6),E.material.opacity=.55+.35*y});const S=m.attributes.position,A=R.position;x.position.set(A.x,0,A.z);for(let E=0;E<b;E++){let M=S.getY(E)-_*.7;M<A.y-4&&(M+=16),S.setXYZ(E,S.getX(E)+Math.sin(v+E)*_*.15,M,S.getZ(E))}S.needsUpdate=!0}}}function Uv(s,e){if(s==="bunker"){const o=Td(e);return o.userData.env=s,o}const t=new Ne;t.userData.env=s;const n=new Ut({color:13615784,map:e??null}),i=new Ut({color:7032627}),r=new Ut({color:5134906}),a=(o,c,l,h,u,d=0)=>{const f=new X(o,c);return f.position.set(l,h,u),f.rotation.y=d,f.castShadow=f.receiveShadow=!0,t.add(f),f};if(s==="watchtower"){for(const[o,c]of[[-1,-1],[1,-1],[-1,1],[1,1]])a(new Ve(.1,.13,4.6,6),i,o,2.3,c);a(new Le(2.6,.16,2.6),i,0,4,0);for(const[o,c,l,h]of[[0,-1.25,2.6,.08],[0,1.25,2.6,.08],[-1.25,0,.08,2.6],[1.25,0,.08,2.6]])a(new Le(l,.9,h),i,o,4.5,c);a(new Jn(2.1,1.1,4).rotateY(Math.PI/4),r,0,6,0);for(const[o,c]of[[-1,-1],[1,-1],[-1,1],[1,1]])a(new Ve(.05,.05,1.5,4),i,o,5.2,c)}else if(s==="garita"){a(new Ve(1,1.15,2.6,14),n,0,1.3,0),a(new Et(1.05,14,8,0,Math.PI*2,0,Math.PI/2),n,0,2.6,0),a(new Jn(.16,.5,8),n,0,3.85,0);const o=new wt({color:1381135});for(let c=0;c<4;c++){const l=c*Math.PI/2;a(new Le(.12,.55,.1),o,Math.sin(l)*1.03,1.9,Math.cos(l)*1.03,l)}}else{a(new Le(3.4,2.2,.5),n,0,1.1,-1.4),a(new Le(.5,1.4,2.6),n,-1.5,.7,-.1),a(new Le(1.4,1,.5),n,1,.5,1.2,.2);for(let o=0;o<7;o++)a(new Ta(.22+o%3*.1,0),n,Math.sin(o*2.3)*1.6,.15,Math.cos(o*1.7)*1.4)}return t}class Nv extends Y_{constructor(e){super(e),this.type=Qt}parse(e){const a=function(E,M){switch(E){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(M||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(M||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(M||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(M||""))}},h=`
`,u=function(E,M,y){M=M||1024;let D=E.pos,U=-1,F=0,W="",B=String.fromCharCode.apply(null,new Uint16Array(E.subarray(D,D+128)));for(;0>(U=B.indexOf(h))&&F<M&&D<E.byteLength;)W+=B,F+=B.length,D+=128,B+=String.fromCharCode.apply(null,new Uint16Array(E.subarray(D,D+128)));return-1<U?(E.pos+=F+U+1,W+B.slice(0,U)):!1},d=function(E){const M=/^#\?(\S+)/,y=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,L=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,D=/^\s*FORMAT=(\S+)\s*$/,U=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,F={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0};let W,B;for((E.pos>=E.byteLength||!(W=u(E)))&&a(1,"no header found"),(B=W.match(M))||a(3,"bad initial token"),F.valid|=1,F.programtype=B[1],F.string+=W+`
`;W=u(E),W!==!1;){if(F.string+=W+`
`,W.charAt(0)==="#"){F.comments+=W+`
`;continue}if((B=W.match(y))&&(F.gamma=parseFloat(B[1])),(B=W.match(L))&&(F.exposure=parseFloat(B[1])),(B=W.match(D))&&(F.valid|=2,F.format=B[1]),(B=W.match(U))&&(F.valid|=4,F.height=parseInt(B[1],10),F.width=parseInt(B[2],10)),F.valid&2&&F.valid&4)break}return F.valid&2||a(3,"missing format specifier"),F.valid&4||a(3,"missing image size specifier"),F},f=function(E,M,y){const L=M;if(L<8||L>32767||E[0]!==2||E[1]!==2||E[2]&128)return new Uint8Array(E);L!==(E[2]<<8|E[3])&&a(3,"wrong scanline width");const D=new Uint8Array(4*M*y);D.length||a(4,"unable to allocate buffer space");let U=0,F=0;const W=4*L,B=new Uint8Array(4),$=new Uint8Array(W);let V=y;for(;V>0&&F<E.byteLength;){F+4>E.byteLength&&a(1),B[0]=E[F++],B[1]=E[F++],B[2]=E[F++],B[3]=E[F++],(B[0]!=2||B[1]!=2||(B[2]<<8|B[3])!=L)&&a(3,"bad rgbe scanline format");let se=0,oe;for(;se<W&&F<E.byteLength;){oe=E[F++];const Ie=oe>128;if(Ie&&(oe-=128),(oe===0||se+oe>W)&&a(3,"bad scanline data"),Ie){const qe=E[F++];for(let q=0;q<oe;q++)$[se++]=qe}else $.set(E.subarray(F,F+oe),se),se+=oe,F+=oe}const pe=L;for(let Ie=0;Ie<pe;Ie++){let qe=0;D[U]=$[Ie+qe],qe+=L,D[U+1]=$[Ie+qe],qe+=L,D[U+2]=$[Ie+qe],qe+=L,D[U+3]=$[Ie+qe],U+=4}V--}return D},b=function(E,M,y,L){const D=E[M+3],U=Math.pow(2,D-128)/255;y[L+0]=E[M+0]*U,y[L+1]=E[M+1]*U,y[L+2]=E[M+2]*U,y[L+3]=1},g=function(E,M,y,L){const D=E[M+3],U=Math.pow(2,D-128)/255;y[L+0]=Ar.toHalfFloat(Math.min(E[M+0]*U,65504)),y[L+1]=Ar.toHalfFloat(Math.min(E[M+1]*U,65504)),y[L+2]=Ar.toHalfFloat(Math.min(E[M+2]*U,65504)),y[L+3]=Ar.toHalfFloat(1)},p=new Uint8Array(e);p.pos=0;const m=d(p),x=m.width,v=m.height,_=f(p.subarray(p.pos),x,v);let R,S,A;switch(this.type){case Zt:A=_.length/4;const E=new Float32Array(A*4);for(let y=0;y<A;y++)b(_,y*4,E,y*4);R=E,S=Zt;break;case Qt:A=_.length/4;const M=new Uint16Array(A*4);for(let y=0;y<A;y++)g(_,y*4,M,y*4);R=M,S=Qt;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:x,height:v,data:R,header:m.string,gamma:m.gamma,exposure:m.exposure,type:S}}setDataType(e){return this.type=e,this}load(e,t,n,i){function r(a,o){switch(a.type){case Zt:case Qt:a.colorSpace=Gt,a.minFilter=Nt,a.magFilter=Nt,a.generateMipmaps=!1,a.flipY=!0;break}t&&t(a,o)}return super.load(e,r,n,i)}}const Ad={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Ts{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Fv=new ya(-1,1,1,-1,0,1);class Ov extends bt{constructor(){super(),this.setAttribute("position",new Je([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Je([0,2,0,0,2,0],2))}}const kv=new Ov;class el{constructor(e){this._mesh=new X(kv,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Fv)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Bv extends Ts{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof Xt?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ar.clone(e.uniforms),this.material=new Xt({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new el(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class du extends Ts{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){const i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class zv extends Ts{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Gv{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const n=e.getSize(new J);this._width=n.width,this._height=n.height,t=new gn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Qt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Bv(Ad),this.copyPass.material.blending=Yn,this.clock=new tx}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),a.needsSwap){if(n){const o=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}du!==void 0&&(a instanceof du?n=!0:a instanceof zv&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new J);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class fu extends Ts{constructor(e,t,n=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new he}render(e,t,n){const i=e.autoClear;e.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=i}}const Hv={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new he(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class ys extends Ts{constructor(e,t,n,i){super(),this.strength=t!==void 0?t:1,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new J(e.x,e.y):new J(256,256),this.clearColor=new he(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new gn(r,a,{type:Qt}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const d=new gn(r,a,{type:Qt});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const f=new gn(r,a,{type:Qt});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=Hv;this.highPassUniforms=ar.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Xt({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const c=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new J(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const l=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=l,this.bloomTintColors=[new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=Ad;this.copyUniforms=ar.clone(h.uniforms),this.blendMaterial=new Xt({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:os,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new he,this.oldClearAlpha=1,this.basic=new wt,this.fsQuad=new el(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new J(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this.fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[c].uniforms.direction.value=ys.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=ys.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[c];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(n),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){const t=[];for(let n=0;n<e;n++)t.push(.39894*Math.exp(-.5*n*n/(e*e))/e);return new Xt({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new J(.5,.5)},direction:{value:new J(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new Xt({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}ys.BlurDirectionX=new J(1,0);ys.BlurDirectionY=new J(0,1);const Vv={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Wv extends Ts{constructor(){super();const e=Vv;this.uniforms=ar.clone(e.uniforms),this.material=new D_({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new el(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},$e.getTransfer(this._outputColorSpace)===ht&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===vu?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===yu?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Mu?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ec?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Su?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===wu&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const es=22;let ye=.05;const Ri=.05,jv={red:16724787,blue:3377407,green:3394611,yellow:16763904,pink:16737996,lead:5988976,ceramic:15328476,moab:5939432},Xv={scavenger:14252331,hunter:12867115,charger:9067051,brood:11766318,bile_titan:6978858,ironback:7305088,warden:4638440,gargoyle:10120145};function ta(s){const e=s.data.color;return e&&/^#?[0-9a-fA-F]{6}$/.test(e.replace("#",""))?parseInt(e.replace("#",""),16):(s.data.family==="bloon"?jv:Xv)[s.data.id]??15217967}const pu={dart:14271626,pea:5955402,gpea:16734810,shuriken:12633808,magic:13073919,melon:16747066,star:16769126,bullet:16769162,laser:16732240,rail:9425151,ice:11069695,glue:10944333,acid_vial:10944333,acid_spray:10944333,acid_can:10288954,flak:16752704,seed:11990927,boomerang:14132058,tesla:10479615,arrow:14278114,shell:6975608},mu={moab:3108824,boss_zeppelin:9060312,boss_leviathan:2071178,boss_scarab:12092971,boss_dreadnought:3817288,gargoyle:7368816},qv=()=>matchMedia("(pointer: coarse)").matches||"ontouchstart"in window,tt=(s,e,t,n)=>(s.position.set(e,t,n),s),Yv=s=>s==="pistol",At=s=>new Ut({color:s});function gu(s){return s.data.air?6.5:s.data.family==="bloon"?s.data.boss||s.data.id==="moab"?2.6:1.3:Math.max(.5,s.data.radius*Ri*.8)}function bu(s){return Math.max(.45,s.data.radius*Ri*1.15)}class Kv{constructor(e,t){this.host=e,this.scene=new Jb,this.touch=qv(),this.yaw=0,this.pitch=-.12,this.keys=new Set,this.firing=!1,this.locked=!1,this.joy={id:-1,ox:0,oy:0,x:0,y:0},this.lookId=-1,this.lookX=0,this.lookY=0,this.ctl={aim:0,fire:!1,target:null,mx:0,my:0},this.fps=60,this.fpsAcc=0,this.fpsN=0,this.slow=0,this.pr=1,this.hits=0,this.shots=0,this.lastShot=-1,this.hitT=0,this.sendT=0,this.sentFire=!1,this.bloonMeshes=new Map,this.bossModels=new Map,this.towerModels=new Map,this.unitVeh=new Map,this.sunDir=new C(-.5,.36,-.79).normalize(),this.gunBase=new C(.22,-.22,-.45),this.gunRoll=0,this.bob=0,this.vm={kind:"box",hands:0,props:0,vehicles:0,flora:0,quality:"high",tex:{flora:0,lod:0,gun:0,glove:0},size:{},towers3d:{}},this.seaN=null,this.war=null,this.ctxLost=!1,this.bits=[],this.seen=new Map,this.gun=new Ne,this.flashT=0,this.kick=0,this.tracers=[],this.dummy=new ft,this.tmpC=new he,this.raf=0,this.last=0,this.alive=!0,this.el={},this.miniImg=new Image,this.miniT=0,this.ray=new ux,this.v=new C,this.v2=new C,this.onUp=()=>{this.firing=!1},this.onLock=()=>{this.locked=document.pointerLockElement===this.renderer.domElement,this.locked||(this.firing=!1)},this.onMouse=a=>{this.locked&&!this.g.paused&&this.look(a.movementX,a.movementY)},this.onKey=a=>{var c,l;if((l=(c=a.target)==null?void 0:c.closest)!=null&&l.call(c,"input,textarea,#bug-report,.br-overlay"))return;const o=a.key.toLowerCase();if(a.stopImmediatePropagation(),o==="escape"||o==="e"){a.repeat||this.exit();return}if(o==="p"){this.setPause(!this.g.paused);return}if(this.keys.add(o),o===" "&&a.preventDefault(),!this.isTower){const h=this.g.squadAbilities(this.obj.squad),u=o==="q"?0:/^[1-9]$/.test(o)?+o-1:-1;u>=0&&h[u]&&this.ability(h[u])}},this.onKeyUp=a=>{this.keys.delete(a.key.toLowerCase()),a.stopImmediatePropagation()},this.resize=()=>{var c,l;const a=innerWidth,o=innerHeight;this.renderer.setSize(a,o,!1),(c=this.composer)==null||c.setPixelRatio(this.pr),(l=this.composer)==null||l.setSize(a,o),this.camera.aspect=a/o,this.camera.updateProjectionMatrix()},this.last0=performance.now(),this.composer=null,this.bloom=null,this.envRT=null,this.floraGrp=null,this.lodT=0,this.pinQ=!1,this.loop=a=>{var h;if(!this.alive)return;const o=Math.min(.1,(a-this.last)/1e3);if(this.last=a,Sd.value+=o,(h=this.war)==null||h.update(o,this.camera),this.seaN&&(this.seaN.offset.x+=o*.0026,this.seaN.offset.y+=o*.0017),this.fpsAcc+=Math.min(1,(a-this.last0)/1e3),this.last0=a,this.fpsN++,this.fpsAcc>=.5&&(this.fps=this.fpsN/this.fpsAcc,this.fpsAcc=0,this.fpsN=0,this.governor()),!this.tick(o))return;if(this.ctxLost){this.raf=requestAnimationFrame(this.loop);return}this.lodT-=o,this.lodT<=0&&this.floraGrp&&(this.lodT=.12,this.floraGrp.userData.updateLod(this.camera));const c=this.renderer,l=this.camera;if(this.composer&&this.bloom)this.bloom.enabled=!this.g.reduceFlash,this.composer.render(o);else{l.layers.set(0),c.autoClear=!0,c.render(this.scene,l);const u=this.scene.background;this.scene.background=null,l.layers.set(1),c.autoClear=!1,c.clearDepth(),c.render(this.scene,l),l.layers.set(0),this.scene.background=u}this.raf=requestAnimationFrame(this.loop)},this.g=e.g,this.obj=t,this.isTower=t instanceof xn,ye=this.g.map.mpp??.05,this.root=document.createElement("div"),this.root.id="possess-root",document.body.appendChild(this.root),document.body.classList.add("possess-on"),document.body.classList.toggle("ps-touch-on",this.touch),this.renderer=new Kb({antialias:!this.touch,powerPreference:"high-performance",preserveDrawingBuffer:!0}),this.pr=Math.min(devicePixelRatio,this.touch?1.25:1.75),this.renderer.setPixelRatio(this.pr),this.renderer.outputColorSpace=gt,this.renderer.domElement.className="p3d",this.renderer.toneMapping=Ec,this.renderer.toneMappingExposure=1.15;const n=new URLSearchParams(location.search).get("fpq");this.vm.quality=n==="low"||n==="medium"||n==="high"?n:this.touch?"medium":"high",this.pinQ=!!n,yo({high:2,medium:1,low:0}[this.vm.quality]),this.root.appendChild(this.renderer.domElement),this.renderer.domElement.addEventListener("webglcontextlost",a=>{a.preventDefault(),this.ctxLost=!0,console.warn("[possess] WebGL context lost")}),this.renderer.domElement.addEventListener("webglcontextrestored",()=>{this.ctxLost=!1,this.composer&&this.composer.setSize(innerWidth,innerHeight)}),this.camera=new jt(70,1,.03,this.real?1100:420),this.camera.rotation.order="YXZ",this.buildWorld(),this.buildPost(),this.buildGun(),this.buildPools(),this.buildHud(),this.bindInput();const r=this.g.enemies.filter(a=>a.alive).sort((a,o)=>(a.x-t.x)**2+(a.y-t.y)**2-((o.x-t.x)**2+(o.y-t.y)**2))[0]??{x:this.g.map.width/2,y:this.g.map.height/2};this.yaw=Math.atan2(-(r.x-t.x),-(r.y-t.y)),this.ctl.aim=Math.atan2(r.y-t.y,r.x-t.x),this.g.possessCtl(t,this.ctl),this.g.speed=1,this.resize(),addEventListener("resize",this.resize),La(`possess: ${this.isTower?"tower "+t.data.id:"unit "+t.data.id}`),this.last=performance.now(),this.raf=requestAnimationFrame(this.loop)}get isWar(){return this.g.map.id==="tropical"}get real(){return(this.g.map.mpp??.05)>.051}groundAt(e,t){return Ht(this.g.map,e,t)}buildWorld(){const{scene:e,g:t}=this,n=t.map.width*ye,i=t.map.height*ye,r=this.isWar,a=r?new Ph(14208960,3814444,1.05):new Ph(16773336,5660730,1.25);a.layers.enableAll(),e.add(a);const o=new gd(r?16758904:16767400,r?2:2.4);o.position.copy(this.sunDir).multiplyScalar(80),e.add(o,o.target),this.sun=o,o.layers.enableAll(),!this.touch&&this.vm.quality!=="low"&&(this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=xu,o.castShadow=!0,o.shadow.mapSize.set(2048,2048),o.shadow.bias=-4e-4,o.shadow.normalBias=.025,o.shadow.radius=2,Object.assign(o.shadow.camera,{left:-es,right:es,top:es,bottom:-es,near:1,far:200})),this.vm.quality!=="low"&&new Nv().load(Jt("assets/tex/sky_env.hdr"),p=>{if(!this.alive){p.dispose();return}const m=new dc(this.renderer),x=m.fromEquirectangular(p);p.dispose(),m.dispose(),e.environment=x.texture,e.environmentIntensity=r?.45:.6,this.envRT=x},void 0,p=>console.warn("hdri",p));const c=t.map.terrain,l=[];if(c)this.buildTerrain(n,i,l);else{const p=new Zn().load(Jt(t.map.image));p.colorSpace=gt,p.anisotropy=8;const m=new X(new un(n,i).rotateX(-Math.PI/2).translate(n/2,0,i/2),Eo(new Ut({map:p}),{stone:t.map.id==="morro"||t.map.id==="fortress"?1:.5}));m.name="floor",m.userData.detail=!0,e.add(m);const x=new X(new un(900,900).rotateX(-Math.PI/2),Eo(At(6262586)));x.position.set(n/2,-.05,i/2),e.add(x);const v=At(7035460),_=t.map.id==="morro"||t.map.id==="fortress",R=y=>{if(!_)return v;const L=To("cobble").clone();return L.repeat.set(y/2.4,.46),L.needsUpdate=!0,new Ut({map:L,color:14207924})};for(const[y,L,D,U]of[[n/2,-.4,n+1.6,.8],[n/2,i+.4,n+1.6,.8],[-.4,i/2,.8,i],[n+.4,i/2,.8,i]])e.add(tt(new X(new Le(D,1.1,U),R(Math.max(D,U))),y,.55,L));let S=7;const A=()=>(S=S*16807%2147483647)/2147483647,E={garden:["oak","tree","pine","oak","tree_detailed"],jungle:["palm","palm_bend","tree_detailed","palm_tall"],fortress:["pine","pine_round","pine","tree"],morro:["palm","palm_bend","palm_tall"]},M=E[t.map.id]??E.garden;for(let y=0;y<110;y++){const L=y/110*Math.PI*2,D=1.04+A()*.32,U=M[Math.floor(A()*M.length)];l.push({k:U,x:n/2+Math.cos(L)*n*.6*D,y:0,z:i/2+Math.sin(L)*i*.66*D,h:(U.startsWith("pine")?12:U.startsWith("palm")?10:9)*(.8+A()*.5),rot:A()*6.28,burnt:t.map.id==="fortress"&&A()<.3})}}this.buildSky(n,i);const h=e.getObjectByName("floor");h&&(h.receiveShadow=!0);const u=(p,m)=>Ht(t.map,p,m);for(const p of t.props)ev(p.kind).then(m=>{this.alive&&(m.position.set(p.x*ye,u(p.x,p.y),p.y*ye),m.rotation.y=(p.kind==="tent"?.5:.25)+(p.flip?Math.PI:0),m.userData.mil=p.kind,m.traverse(x=>{x.castShadow=!0,x.receiveShadow=!0}),e.add(m),this.vm.props++)}).catch(m=>console.warn("prop load",m));let d=11;const f=()=>(d=d*16807%2147483647)/2147483647;for(const[p,m,x,v]of t.map.deco??[]){const _=hu(p,v);if(_&&(l.push({k:_.k,h:_.h*(.9+f()*.2),burnt:_.burnt,x:m*ye,y:u(m,x)-.05,z:x*ye,rot:f()*6.28}),!c&&!_.burnt&&/^(oak|tree|pine|palm|bush|fern)/.test(_.k)))for(let R=0;R<2;R++){const S=f()*6.28,A=.6+f()*1.6;l.push({k:"grass",h:.35+f()*.3,x:m*ye+Math.cos(S)*A,y:u(m,x)-.02,z:x*ye+Math.sin(S)*A,rot:f()*6.28})}}for(const p of t.obstacles)p.alive&&l.push(p.kind==="rock"?{k:"rock_big",h:1.5,x:p.x*ye,y:u(p.x,p.y)-.1,z:p.y*ye,rot:-p.ang}:{k:"log",h:.55,x:p.x*ye,y:u(p.x,p.y),z:p.y*ye,rot:-p.ang+Math.PI/2});Lv(l,!this.touch&&this.vm.quality!=="low",{high:2,medium:1,low:0}[this.vm.quality]).then(p=>{this.alive&&(e.add(p),this.vm.flora=l.length,this.floraGrp=p,p.userData.updateLod(this.camera,!0),this.vm.tex.flora=p.userData.texKinds,this.vm.tex.lod=p.children.filter(m=>m.userData.lod===1).length)}).catch(p=>console.warn("flora",p));for(const p of t.envs){const m=Uv(p.kind,To("cobble"));tt(m,p.x*ye,u(p.x,p.y)-.05,p.y*ye),m.rotation.y=(p.x*13+p.y*7)%628/100,e.add(m)}const b=At(9146265),g=At(3829712);for(const p of t.buildings)if(p.alive){const m=new Ne;p.isHQ?(m.add(tt(new X(new Le(6,4,6),b),0,2,0)),m.add(tt(new X(new Ve(1.3,1.5,7,8),b),0,5.5,0)),m.add(tt(new X(new Jn(2,2.5,8),g),0,10.2,0)),m.add(tt(new X(new un(2,1.2),new Ut({color:16767050,side:Ct})),1,12,0))):(m.add(tt(new X(new Le(3.4,2.4,3.4),b),0,1.2,0)),m.add(tt(new X(new Jn(2.6,1.4,4).rotateY(Math.PI/4),g),0,3.1,0))),tt(m,p.x*ye,u(p.x,p.y),p.y*ye),e.add(m)}this.ring=new X(new jc(.96,1,64).rotateX(-Math.PI/2),new wt({color:8382719,transparent:!0,opacity:.55,depthWrite:!1})),this.ring.position.y=.04,e.add(this.ring)}buildSky(e,t){const n=this.isWar,{scene:i}=this,r=new he(n?10195847:14542047),a=new he(n?6186092:6264783),o=new he(n?14721120:16769720),c=new he(n?6972506:11122086);i.background=r.clone(),i.fog=this.real?new Ks(r.getHex(),180,1e3):new Ks(r.getHex(),n?28:40,n?150:185);const l=new Ne;l.name="sky";const h=new Et(360,32,16),u=h.attributes.position,d=new Float32Array(u.count*3),f=new he,b=new C;for(let S=0;S<u.count;S++)b.fromBufferAttribute(u,S).normalize(),b.y<0?f.copy(r).lerp(c,Math.min(1,-b.y*4)):f.copy(r).lerp(a,Math.pow(b.y,.55)),f.lerp(o,Math.pow(Math.max(0,b.dot(this.sunDir)),5)*.75),d.set([f.r,f.g,f.b],S*3);h.setAttribute("color",new Mt(d,3));const g=new X(h,new wt({vertexColors:!0,side:qt,fog:!1,depthWrite:!1}));g.renderOrder=-2,l.add(g);const p=document.createElement("canvas");p.width=p.height=128;const m=p.getContext("2d"),x=m.createRadialGradient(64,64,0,64,64,64);x.addColorStop(0,"rgba(255,255,250,1)"),x.addColorStop(.07,"rgba(255,252,236,1)"),x.addColorStop(.22,"rgba(255,224,170,0.5)"),x.addColorStop(1,"rgba(255,205,150,0)"),m.fillStyle=x,m.fillRect(0,0,128,128);const v=new fa(new cr({map:new id(p),blending:os,depthWrite:!1,fog:!1,transparent:!0}));v.position.copy(this.sunDir).multiplyScalar(330),v.scale.setScalar(150),v.name="sunglow",l.add(v),i.add(l),this.sky=l;const _=new Ne;_.name="hills";const R=Math.max(e,t)*.5+85;for(let S=0;S<2;S++){const E=R+S*70,M=[],y=[],L=[],D=new he(n?S?8157038:5130819:S?10991798:8230272).lerp(r,S?.35:.15),U=D.clone().lerp(r,.55);for(let B=0;B<=72;B++){const $=B/72*Math.PI*2,V=(12+9*Math.sin($*3+S*2)+6*Math.sin($*7+1.3)+3.5*Math.sin($*17))*(S?1.7:1)+4,se=e/2+Math.cos($)*E,oe=t/2+Math.sin($)*E*.92;if(M.push(se,-3,oe,se,V,oe),y.push(U.r,U.g,U.b,D.r,D.g,D.b),B<72){const pe=B*2;L.push(pe,pe+1,pe+2,pe+1,pe+3,pe+2)}}const F=new bt;F.setAttribute("position",new Je(M,3)),F.setAttribute("color",new Je(y,3)),F.setIndex(L);const W=new X(F,new wt({vertexColors:!0,fog:!1,side:Ct}));W.renderOrder=-1+S*-.5,_.add(W)}this.real||i.add(_)}buildTerrain(e,t,n){const{scene:i,g:r}=this,a=r.map.terrain,o=Ld(a);i.background=new he(9425138),i.fog=new Ks(9425138,70,200);const c=new un(e,t,a.cols-1,a.rows-1).rotateX(-Math.PI/2).translate(e/2,0,t/2),l=c.attributes.position;for(let p=0;p<l.count;p++)l.setY(p,o[p]);c.computeVertexNormals();const h=new Zn().load(Jt(a.ground));h.colorSpace=gt,h.anisotropy=8;const u=new X(c,Eo(new Ut({map:h}),{slope:!0,stone:this.real?.25:.4,war:this.isWar}));u.name="floor",u.userData.detail=!0,i.add(u);const d=this.real?3200:900,f=new X(new un(d,d).rotateX(-Math.PI/2),(()=>{const p=vv().clone();return p.repeat.set(d/7,d/7),p.needsUpdate=!0,this.seaN=p,new U_({color:this.real?2906718:3494223,transparent:!0,opacity:this.real?.8:.86,normalMap:p,normalScale:new J(.6,.6),shininess:70,specular:7307136})})());f.position.set(e/2,a.water,t/2),f.name="sea",i.add(f);const b=new X(new un(d,d).rotateX(-Math.PI/2),At(1846318));b.position.set(e/2,this.real?a.off-.3:-1.7,t/2),i.add(b);const g=(p,m)=>Ud(r.map,p,m);for(const[p,m,x,v]of a.props){const _=hu(p,v);if(_){n.push({k:_.k,h:_.h,burnt:_.burnt,x:m*ye,y:g(m,x)-.08,z:x*ye,rot:(m*7+x*3)%628/100,tilt:_.burnt?((m+x)%9-4)*.02:0});continue}if(p!=="prflag")continue;const R=new Zn().load(Jt(`assets/maps/tropical/${p}.png`));R.colorSpace=gt;const S=new fa(new cr({map:R,alphaTest:.4})),A=v*Ri*.9;S.center.set(.5,.04),S.scale.set(A,A,1),S.position.set(m*ye,g(m,x)-.1,x*ye),S.userData.prop=p,i.add(S)}this.isWar&&(this.war=Dv(i,a.props,g,ye,this.touch,To("cobble")))}buildGun(){const e=At(2896680),t=At(5596735),n=new wt({color:16758074}),i=(r,a,o,c,l,h,u)=>{const d=new X(new Le(r,a,o),c);return d.position.set(l,h,u),this.gun.add(d),d};if(this.isTower){const r=new he(_r(this.obj.data.faction).color).getHex(),a=At(r);i(.5,.2,.55,a,0,-.08,.05);for(const o of[-.1,.1])i(.06,.06,.7,e,o,0,-.45);i(.2,.03,.04,n,0,.04,-.2),this.gun.position.set(0,-.32,-.5)}else i(.11,.13,.62,t,0,0,-.1),i(.05,.05,.38,e,0,.02,-.55),i(.07,.17,.09,e,0,-.13,.02),i(.06,.05,.14,e,0,.1,-.05),i(.03,.02,.06,n,0,.13,-.05),i(.15,.13,.5,At(5204794),.06,-.2,.12).rotation.x=.35,this.gun.scale.setScalar(.85),this.gun.position.set(.22,-.22,-.45);this.flash=new X(new un(.34,.34),new wt({color:16762976,transparent:!0,blending:os,depthWrite:!1})),this.flash.position.set(0,.02,this.isTower?-.85:-.78),this.flash.visible=!1,this.gun.add(this.flash),this.gunBase.copy(this.gun.position),this.gun.traverse(r=>r.layers.set(1)),this.camera.add(this.gun),this.scene.add(this.camera),this.loadViewmodel().catch(r=>console.warn("viewmodel",r))}async loadViewmodel(){const e=this.obj,t=(i,r,a,o,c=1)=>{if(this.alive){for(const l of[...this.gun.children])this.gun.remove(l);this.gun.add(i),i.add(this.flash),this.flash.position.copy(r),this.flash.scale.setScalar(c),this.gun.position.copy(a),this.gunBase.copy(a),this.vm.kind=o,this.gun.traverse(l=>l.layers.set(1))}},n=At(2303775);if(e instanceof xn&&e.data.id==="unsc_tank"){const i=new Ne,r=At([11902060,6122309,5662015][Math.min(2,e.tier)]);return i.add(tt(new X(new Le(2.6,.14,1.6),r),0,-.98,-.45)),i.add(tt(new X(new Le(1,.55,.7),r),0,-.88,-1.15)),i.add(tt(new X(new Ve(.08,.1,3.6,12).rotateX(Math.PI/2),n),0,-.78,-2.9)),i.add(tt(new X(new Ve(.13,.13,.5,12).rotateX(Math.PI/2),n),0,-.78,-3.3)),i.add(tt(new X(new gs(.42,.06,6,16).rotateX(Math.PI/2),n),0,-.9,.05)),this.vm.vehicles++,t(i,new C(0,-.78,-4.8),new C(0,0,0),"tank_cannon",4)}if(e instanceof xn&&e.data.id==="unsc_heli"){const i=new Ne,r=At(2830630),a=new wt({color:9240474});i.add(tt(new X(new Le(1.9,.3,.55),r),0,-.62,-.75));for(let c=0;c<3;c++)i.add(tt(new X(new un(.28,.16),a),-.45+c*.45,-.46,-.47));for(const c of[-1,1]){const l=tt(new X(new Le(.07,1.8,.07),r),c*.95,.05,-.75);l.rotation.z=c*.28,l.rotation.x=-.35,i.add(l)}i.add(tt(new X(new Le(2.3,.07,.07),r),0,.82,-.55));const o=new Ne;o.add(new X(new Et(.22,10,8),n));for(const c of[-.06,.06])o.add(tt(new X(new Ve(.035,.035,1.3,6).rotateX(Math.PI/2),n),c,0,-.65));return tt(o,0,-1.25,-1.5),i.add(o),this.vm.vehicles++,t(i,new C(0,-1.25,-2.25),new C(0,0,0),"heli_chingun",1.6)}if(e instanceof xn&&(e.data.id==="unsc_autoturret"||e.data.id==="unsc_flak")){const i=await Mo("rifle"),r=new Ne;if(i.scale.setScalar(1.25),r.add(i),i.userData.textured&&this.vm.tex.gun++,e.data.id==="unsc_flak"){const o=await Mo("rifle");o.scale.setScalar(1.25),o.position.x=-.32,r.add(o)}const a=i.userData.muzzle.clone().multiplyScalar(1.25);return t(r,a,new C(.12,-.3,-.42),"mounted_mg")}if(e instanceof xn&&e.t.combat){const i=e.data.projectile??"dart",r=Qh[i]??Qh[e.data.id==="unsc_rail"?"rail":""]??null;if(r)try{const a=await Zh(r);a.rotation.y=-Math.PI/2,a.updateMatrixWorld(!0);const c=new vt().setFromObject(a).getSize(new C),l=Math.max(c.x,c.z,.4),h=new Ne;h.add(a);const u=new C(0,.02,-l*.55);return this.vm.tex.gun++,t(h,u,new C(.15,-.22,-.35),"glb_"+r,i==="laser"||i==="rail"?1.4:.9)}catch(a){console.warn("glb gun",r,a)}}if(e instanceof Ia){const i=!!e.squad.data.vehicle,r=iv(e.squad.data.id,i),a=await Mo(r),o=a.userData.textured?1:.78;a.scale.set(1,o,1);const c=a.userData.len,l=a.userData.muzzle.clone();l.y*=o,a.userData.textured&&this.vm.tex.gun++;const h=new Ne;if(h.add(a),!i){const d=new he(_r(e.squad.data.faction).color).lerp(new he(4870710),.7).getHex(),f=r==="pistol",b=Yh(d);if(b.scale.setScalar(.9),tt(b,.035,l.y-.1,f?.02:c*.17),b.rotation.set(-1,.15,.3),h.add(b),this.vm.tex.glove++,f)this.vm.hands=1;else{const g=Yh(d);g.scale.setScalar(.9),tt(g,a.userData.textured?-.012:-.035,l.y-.095,-c*.2),g.rotation.set(-.55,-.25,-.45),h.add(g),this.vm.hands=2}h.rotation.set(.02,.07,.03)}const u=i?new C(0,-.45-l.y*1.4,-.75):new C(Yv(r)?.1:.17,-.1-l.y,-(c*.5)-.12);return i&&a.scale.multiplyScalar(1.4),t(h,l.multiplyScalar(i?1.4:1),u,"gun_"+r,r==="rocket"?2:.7)}}buildPools(){const e=new Et(.62,12,9);e.scale(1,1.18,1);const t=new Jn(.12,.2,6).translate(0,-.78,0).rotateX(Math.PI),n=er([e,t]),i=["red","blue","green","yellow","pink","lead","ceramic"];for(const p of i){const m=new Ut({color:16777215,map:So(p)}),x=new dn(n,m,200);x.instanceColor=new Ci(new Float32Array(200*3),3),x.count=0,x.frustumCulled=!1,this.scene.add(x),this.bloonMeshes.set(p,x)}const r=new Ut({color:16777215,map:So("red")});this.bloonMesh=new dn(n.clone(),r,200);const a=new Et(.55,10,8).scale(1.3,.7,1).translate(0,.55,0),o=new Et(.32,8,6).translate(.75,.62,0),c=[];for(let p=0;p<6;p++){const m=-.4+p%3*.4,x=p<3?1:-1;c.push(new Le(.08,.08,.7).translate(m,.25,x*.55).rotateX(x*.3))}const l=new Ut({color:16777215,map:So("scavenger")});this.bugMesh=new dn(er([a,o,...c].map(p=>p.index?p.toNonIndexed():p)),l,300);const h=new ms(.32,.9,4,10).translate(0,.78,0),u=new Le(.34,.14,.22).translate(.2,1.4,0),d=new Le(.7,.18,.35).translate(0,1.25,0),f=di("cloth").clone();f.vertexColors=!0,this.unitMesh=new dn(er([h.toNonIndexed(),u.toNonIndexed(),d.toNonIndexed()]),f,300);const b=new ms(.08,.55,3,6);b.rotateZ(Math.PI/2),this.shotMesh=new dn(b,new wt({vertexColors:!0}),500),this.shotMesh.instanceColor=new Ci(new Float32Array(500*3),3),this.bitMesh=new dn(new Xc(.16),new wt,500);for(const p of[this.bloonMesh,this.bugMesh,this.unitMesh,this.bitMesh])p.instanceColor=new Ci(new Float32Array(p.instanceMatrix.count*3),3);this.acidMesh=new dn(new Ve(.5,.5,1,8),new wt({color:9240378}),200),this.poolMesh=new dn(new wa(1,20).rotateX(-Math.PI/2),new wt({color:8314924,transparent:!0,opacity:.6,depthWrite:!1}),48);for(const p of[this.acidMesh,this.poolMesh])p.count=0,p.frustumCulled=!1,this.scene.add(p);for(const p of[this.bloonMesh,this.bugMesh,this.unitMesh,this.shotMesh,this.bitMesh])p.count=0,p.frustumCulled=!1,this.scene.add(p);this.upgradeEnemyGlbs();const g=new Bc({color:16773280,transparent:!0,depthWrite:!1});for(let p=0;p<48;p++){const m=new Sa(new bt().setFromPoints([new C,new C]),g.clone());m.visible=!1,m.frustumCulled=!1,this.scene.add(m),this.tracers.push({line:m,life:0})}}async upgradeEnemyGlbs(){try{for(const n of["red","blue","green","yellow","pink","lead","ceramic"]){const i=this.bloonMeshes.get(n);if(!i)continue;const r=await lv(n);if(!this.alive)return;const a=i.geometry;i.geometry=r,a.dispose()}const e=await hv();if(!this.alive)return;const t=this.bugMesh.geometry;this.bugMesh.geometry=e,t.dispose(),this.vm.towers3d.glb_bloons=7,this.vm.towers3d.glb_scavenger=1}catch(e){console.warn("glb enemies",e)}}bossModel(e){let t=this.bossModels.get(e);if(t)return t;t=new Ne;const n=ta(e)||(mu[e.data.id]??9060312);if(e.data.family==="bloon"||e.data.air){t.add(new X(new Et(1,16,10).scale(1.9,.85,.85),At(n)));for(const i of[-1,1])t.add(tt(new X(new Le(.5,.06,.9),At(2238520)),-1.6,0,i*.6));t.add(tt(new X(new Le(.5,.9,.06),At(2238520)),-1.6,.4,0))}else{t.add(new X(new Et(1,14,10).scale(1.5,.75,1.1),At(n))),t.add(tt(new X(new Et(.5,10,8),At(2763306)),1.4,.15,0));for(let i=0;i<6;i++){const r=-.7+i%3*.7,a=i<3?1:-1;t.add(tt(new X(new Le(.15,.15,1.3),At(2236962)),r,-.45,a*1))}}return this.scene.add(t),this.bossModels.set(e,t),t}towerModel(e){let t=this.towerModels.get(e);if(t&&t.tier!==e.tier&&(this.scene.remove(t.root),this.towerModels.delete(e),t=void 0),t)return t;if(e.data.id==="unsc_tank"||e.data.id==="unsc_heli"||e.data.id==="unsc_destroyer"||e.data.id==="unsc_beacon"){const o=new Ne,c=new Ne;o.add(c);const l=e.data.id==="unsc_tank"?"tank":e.data.id==="unsc_heli"?"heli":e.data.id==="unsc_destroyer"?"destroyer":"beacon",h={root:o,head:c,veh:l,tier:e.tier,model:void 0};return(l==="tank"?qh(e.tier):l==="heli"?Jx(e.tier):Promise.resolve(l==="destroyer"?Zx(e.tier):Qx(e.tier))).then(d=>{if(!this.alive)return;d.traverse(b=>{b.castShadow=!0}),c.add(d),h.model=d,this.vm.vehicles++;const f=new vt().setFromObject(d).getSize(new C);this.vm.size[l]=[f.x,f.y,f.z].map(b=>+b.toFixed(2))}),o.userData.veh=l,this.scene.add(o),this.towerModels.set(e,h),h}const n=av[e.data.id];if(n){const o=new Ne,c=new Ne;o.add(c);const l={root:o,head:c,tier:e.tier,base:1,model:void 0};return Zh(n).then(h=>{if(!this.alive||!this.towerModels.get(e))return;h.scale.setScalar(1.15),c.add(h),l.model=h,this.vm.towers3d["glb_"+n]=(this.vm.towers3d["glb_"+n]??0)+1;const u=new vt().setFromObject(h).getSize(new C);this.vm.size[n]=[u.x,u.y,u.z].map(d=>+d.toFixed(2))}),this.scene.add(o),this.towerModels.set(e,l),l}const i=bv(e.data.id,e.tier);if(i)return this.vm.towers3d[i.root.userData.tower3d]=(this.vm.towers3d[i.root.userData.tower3d]??0)+1,this.scene.add(i.root),t={root:i.root,head:i.head,tier:e.tier,base:i.root.scale.x},this.towerModels.set(e,t),t;const r=new Ne,a=new Ne;return r.add(tt(new X(new Ve(1.1,1.3,.5,10),At(7166532)),0,.25,0)),a.add(new X(new Le(1,.6,.9),At(new he(_r(e.data.faction).color).getHex()))),a.position.y=2,r.add(a),this.scene.add(r),t={root:r,head:a,tier:e.tier},this.towerModels.set(e,t),t}buildHud(){const e=this.obj,t=this.isTower?e.t.name:e.squad.data.tiers[this.g.unitTier(e.squad.data.id)].name,n=this.isTower?[]:this.g.squadAbilities(e.squad);this.root.insertAdjacentHTML("beforeend",`
      <div class="ps-hud">
        <div class="ps-cross" id="ps-cross"><i></i></div>
        <div class="ps-top"><span class="ps-tag">👁 POSSESSED</span><span class="ps-chip">🌊 Wave <b id="ps-wave"></b></span>
          <span class="ps-chip">🏰 HQ <b id="ps-hq"></b><span class="ps-bar"><b id="ps-hqb"></b></span></span><span class="ps-chip">💰 <b id="ps-cash"></b></span><span class="ps-chip">🎯 <b id="ps-hits">0</b> hits</span></div>
        <div class="ps-btns"><button id="ps-pause" title="Pause">⏸</button><button class="ps-exit" id="ps-exit">⏏ Exit (Esc/E)</button></div>
        <div class="ps-me"><div class="nm">${t}</div><div class="hp"><b id="ps-hp"></b></div><div class="cd"><b id="ps-cd"></b></div>
          <small>${this.isTower?"Stationary turret":"WASD move · squad follows"} · direct hits +${Math.round((Id-1)*100)}% dmg · ammo ∞</small></div>
        <div class="ps-abil" id="ps-abil">${n.map((i,r)=>`<button data-ab="${i}">${Da[i].icon} ${Da[i].name}<br><small>${r===0?"Q / 1":String(r+1)}</small><i></i></button>`).join("")}</div>
        <div class="ps-help">Mouse aim · click/hold fire${this.isTower?"":" · WASD move · Q/1-2 abilities"}<br>Esc or E: back to the 2D map · P pause</div>
        <div class="ps-msg" id="ps-msg" hidden></div>
      </div>
      <canvas class="ps-mini" id="ps-mini" width="180" height="${Math.round(180*this.g.map.height/this.g.map.width)}"></canvas>
      <div class="ps-touch" id="ps-touch" ${this.touch?"":"hidden"}>${this.isTower?"":'<div class="ps-joy home" id="ps-joy"><i></i></div>'}<button class="ps-fire" id="ps-fire">FIRE</button></div>
      <div class="ps-pause" id="ps-pause-ov" hidden><div class="panel"><h2>⏸ Paused</h2><div class="row"><button class="btn primary" id="ps-resume">▶ Resume</button><button class="btn" id="ps-pexit">⏏ Exit first-person</button></div></div></div>`);for(const i of["cross","wave","hq","hqb","cash","hits","hp","cd","abil","msg","pause-ov","joy","fire"])this.el[i]=this.root.querySelector("#ps-"+i);this.mini=this.root.querySelector("#ps-mini"),this.miniImg.src=Jt(this.g.map.image)}setPause(e){const t=this.g;t.netPause?t.netPause(e):t.paused=e}bindInput(){const e=this.renderer.domElement,t=a=>this.root.querySelector("#ps-"+a);t("exit").onclick=t("pexit").onclick=()=>this.exit(),t("pause").onclick=()=>this.setPause(!0),t("resume").onclick=()=>{var a;this.setPause(!1),this.touch||(a=e.requestPointerLock)==null||a.call(e)};for(const a of["exit","pause"])t(a).onpointerdown=o=>o.stopPropagation();this.el.abil.querySelectorAll("button").forEach(a=>{a.onpointerdown=o=>o.stopPropagation(),a.onclick=()=>this.ability(a.dataset.ab)}),e.addEventListener("mousedown",a=>{var o;this.touch||a.button!==0||(this.locked||(o=e.requestPointerLock)==null||o.call(e),this.firing=!0)}),addEventListener("mouseup",this.onUp),e.addEventListener("contextmenu",a=>a.preventDefault()),document.addEventListener("pointerlockchange",this.onLock),addEventListener("mousemove",this.onMouse),addEventListener("keydown",this.onKey,!0),addEventListener("keyup",this.onKeyUp,!0);const n=t("touch");n.addEventListener("pointerdown",a=>{!this.isTower&&a.clientX<innerWidth*.4&&this.joy.id<0&&this.el.joy?(this.joy={id:a.pointerId,ox:a.clientX,oy:a.clientY,x:0,y:0},this.el.joy.classList.remove("home"),Object.assign(this.el.joy.style,{display:"block",left:a.clientX-60+"px",top:a.clientY-60+"px"})):this.lookId<0&&(this.lookId=a.pointerId,this.lookX=a.clientX,this.lookY=a.clientY)}),n.addEventListener("pointermove",a=>{if(a.pointerId===this.joy.id){let o=a.clientX-this.joy.ox,c=a.clientY-this.joy.oy;const l=Math.hypot(o,c);l>50&&(o*=50/l,c*=50/l),this.joy.x=o/50,this.joy.y=c/50,this.el.joy.firstElementChild.style.transform=`translate(${o}px,${c}px)`}else a.pointerId===this.lookId&&(this.look((a.clientX-this.lookX)*2.2,(a.clientY-this.lookY)*2.2),this.lookX=a.clientX,this.lookY=a.clientY)});const i=a=>{a.pointerId===this.joy.id&&(this.joy.id=-1,this.joy.x=this.joy.y=0,this.el.joy.removeAttribute("style"),this.el.joy.classList.add("home"),this.el.joy.firstElementChild.style.transform=""),a.pointerId===this.lookId&&(this.lookId=-1)};n.addEventListener("pointerup",i),n.addEventListener("pointercancel",i);const r=this.el.fire;r.addEventListener("pointerdown",a=>{a.stopPropagation(),this.firing=!0}),r.addEventListener("pointerup",()=>{this.firing=!1}),r.addEventListener("pointercancel",()=>{this.firing=!1})}look(e,t){this.yaw-=e*.0022;const[n,i]=this.isTower?[-.85,.45]:[-1.2,1.2];this.pitch=Math.max(n,Math.min(i,this.pitch-t*.0022))}ability(e){this.obj instanceof Ia&&this.g.useAbility(this.obj.squad,e)&&La("possess: ability "+e)}buildPost(){if(this.vm.quality!=="high")return;const e=this.camera,t=this.scene,n=new fu(t,e),i=new fu(t,e);i.clear=!1,i.clearDepth=!0;const r=n.render.bind(n),a=i.render.bind(i);n.render=(...c)=>{e.layers.set(0),r(...c)},i.render=(...c)=>{const l=t.background;t.background=null,e.layers.set(1),a(...c),e.layers.set(0),t.background=l};const o=new Gv(this.renderer,new gn(1,1,{type:Qt,samples:this.touch?0:4}));this.bloom=new ys(new J(256,256),.22,.35,.92),o.addPass(n),o.addPass(i),o.addPass(this.bloom),o.addPass(new Wv),this.composer=o}dropToLow(){var e,t,n;this.vm.quality="low",yo(0),this.scene.environment=null,this.sun.castShadow=!1,this.renderer.shadowMap.enabled=!1,(n=(e=this.floraGrp)==null?void 0:(t=e.userData).setDetail)==null||n.call(t,0),this.scene.traverse(i=>{const r=i.material;r&&(r.needsUpdate=!0)}),console.info("[possess] slow frames: low quality")}dropPost(){this.composer&&(this.composer.dispose(),this.composer=null,this.bloom=null,this.vm.quality="medium",yo(1),console.info("[possess] slow frames: bloom off"))}placeSun(e){const t=this.v2.set(-Math.sin(this.yaw),0,-Math.cos(this.yaw)).multiplyScalar(es*.4).add(e),n=es*2/2048;t.x=Math.round(t.x/n)*n,t.z=Math.round(t.z/n)*n,this.sun.position.copy(t).addScaledVector(this.sunDir,80),this.sun.target.position.copy(t),this.sun.target.updateMatrixWorld()}governor(){if(this.fps<45?this.slow++:this.slow=Math.max(0,this.slow-1),!this.pinQ&&this.slow>=3&&this.fps<24&&this.vm.quality!=="low"){this.composer?this.dropPost():this.dropToLow(),this.slow=0;return}this.slow>=3&&this.pr>.6&&(this.pr=Math.max(.6,this.pr-.25),this.renderer.setPixelRatio(this.pr),this.resize(),this.slow=0)}eye(){const e=this.obj,t=Ht(this.g.map,e.x,e.y);return e instanceof xn?this.v.set(e.x*ye,t+(e.data.id==="unsc_tank"?3.4:e.data.id==="unsc_heli"?7.6+Math.sin(performance.now()/640)*.15:e.data.id==="unsc_destroyer"?4.2:e.data.id==="unsc_beacon"?9.5+e.tier*.4:2.7+e.tier*.15),e.y*ye):this.v.set(e.x*ye,t+(e.squad.data.id==="scorpion"?3.3:e.squad.data.vehicle?2.4:1.65),e.y*ye)}tick(e){var R;const t=this.g,n=this.obj;if(!n.alive||t.state!=="playing"||n.possessedBy>=0&&n.possessedBy!==t.localPid&&t.net!=="solo")return this.exit(n.alive?void 0:`${this.isTower?"Tower":"Troop"} lost — back to the map`),!1;t.speed!==1&&(t.speed=1);const i=this.eye();this.camera.position.copy(i),this.camera.rotation.set(this.pitch,this.yaw,0),this.sky.position.copy(i),this.placeSun(i),this.ray.setFromCamera(new J(0,0),this.camera);let r=null,a=1/0;const o=this.rangePx()*ye*1.3;for(const S of t.enemies){if(!S.alive)continue;const A=this.v2.set(S.x*ye,this.ey(S),S.y*ye),E=bu(S)*(S.data.boss||S.data.id==="moab"?2.2:1.25),M=A.clone().sub(this.ray.ray.origin).dot(this.ray.ray.direction);M<=0||M>o+E||M>=a||this.ray.ray.distanceSqToPoint(A)<E*E&&(a=M,r=S)}const c=this.ray.ray.direction;let l=Math.atan2(c.z,c.x);if(r)l=Math.atan2(r.y-n.y,r.x-n.x);else if(c.y<-.02){const S=-(i.y-Ht(t.map,n.x,n.y))/c.y;l=Math.atan2(i.z+c.z*S-n.y*ye,i.x+c.x*S-n.x*ye)}this.el.cross.classList.toggle("on",!!r);let h=0,u=0;this.isTower||((this.keys.has("w")||this.keys.has("arrowup"))&&(h+=1),(this.keys.has("s")||this.keys.has("arrowdown"))&&(h-=1),(this.keys.has("d")||this.keys.has("arrowright"))&&(u+=1),(this.keys.has("a")||this.keys.has("arrowleft"))&&(u-=1),h-=this.joy.y,u+=this.joy.x);const d=-Math.sin(this.yaw),f=-Math.cos(this.yaw),b=Math.cos(this.yaw),g=-Math.sin(this.yaw),p={aim:l,fire:this.firing&&!t.paused,target:r,mx:d*h+b*u,my:f*h+g*u};this.sendT-=e,t.net!=="client"||this.sendT<=0||p.fire!==this.sentFire?(this.sendT=1/15,this.sentFire=p.fire,this.ctl=p,t.possessCtl(n,p)):n.manual&&(n.manual.aim=l,n.manual.mx=p.mx,n.manual.my=p.my,n.manual.target=r);const m=n instanceof xn?((R=n.combat)==null?void 0:R.shotCount)??0:t.stats.manualShots;if(this.lastShot<0&&(this.lastShot=m),m!==this.lastShot){this.lastShot=m,this.shots++,this.flashT=.06,this.kick=1;const S=r?new C(r.x*ye,this.ey(r),r.y*ye):i.clone().addScaledVector(c,Math.min(o,40)),A=this.obj instanceof xn?this.obj.data.projectile??"bullet":"bullet",E=A==="rail"||A==="laser";this.tracer(this.flash.getWorldPosition(new C),S,pu[A]??16773280,E?.22:.1),this.gunRoll=(Math.random()-.5)*.05,r&&(this.hits++,this.hitT=.15)}this.hitT-=e,this.el.cross.classList.toggle("hit",this.hitT>0),this.flashT-=e,this.flash.visible=this.flashT>0,this.flash.visible&&(this.flash.rotation.z=Math.random()*3);const x=!this.isTower&&Math.abs(p.mx)+Math.abs(p.my)>.1;this.bob+=e*(x?9:1.5);const v=x?.012:.003;this.kick=Math.max(0,this.kick-e*9);const _=this.vm.kind==="tank_cannon"?2.5:1;return this.gun.position.set(this.gunBase.x+Math.cos(this.bob)*v,this.gunBase.y+Math.abs(Math.sin(this.bob))*v-this.kick*.01,this.gunBase.z+this.kick*.06*_),this.gun.rotation.set(this.kick*.09,0,this.gunRoll*this.kick),this.syncEntities(e),this.hud(e),!0}rangePx(){const e=this.obj;return e instanceof xn?e.t.combat?e.range(e.t.combat.range):200:e.range(this.g)}tracer(e,t,n=16773280,i=.12){const r=this.tracers.find(a=>a.life<=0)??this.tracers[0];r.line.geometry.setFromPoints([e,t]),r.line.material.color.setHex(n),r.line.material.opacity=1,r.life=i,r.line.visible=!0}syncBeams(e){var i,r,a;const t=this.g,n=(o,c)=>Ht(t.map,o,c);for(const o of t.towers){const c=(i=o.combat)==null?void 0:i.beamTo;if(!c||!c.alive||o.data.id!=="unsc_beacon")continue;const l=o.combat.lockT,h=((r=o.t.combat)==null?void 0:r.lockRampMax)??2,u=Math.min(1,l*(((a=o.t.combat)==null?void 0:a.lockRamp)??.25)/Math.max(.01,h)),d=new C(o.x*ye,n(o.x,o.y)+9.2+o.tier*.35,o.y*ye),f=new C(c.x*ye,this.ey(c),c.y*ye),b=u>.6?16763e3:u>.25?16771248:16774880;this.tracer(d,f,b,.08)}for(const o of t.effects){if(o.kind!=="beam"||(o.t??0)>.05)continue;const c=new C(o.x*ye,n(o.x,o.y)+2.2,o.y*ye),l=new C((o.x2??o.x)*ye,n(o.x2??o.x,o.y2??o.y)+1.8,(o.y2??o.y)*ye);let h=16773280;const u=o.color??"";u.includes("8fd0")||u.includes("c8f0")||u.includes("7ec8")||u.includes("9adf")?h=10149887:u.includes("ffd2")||u.includes("ffe9")||u.includes("fff6")?h=16771488:u.includes("ff4")||u.includes("ff60")||u.includes("ff50")?h=16736352:u.includes("9fe7")&&(h=10479615),this.tracer(c,l,h,Math.max(.12,o.dur??.1))}}syncEntities(e){var b;const t=this.g,n=this.dummy,i=this.obj;let r=0;const a=new Set;for(const g of this.bloonMeshes.values())g.userData._n=0;this.bloonMesh.userData._n=0;for(const g of t.enemies){if(!g.alive)continue;a.add(g);const p=Ht(t.map,g.x,g.y),m=g.x*ye,x=g.y*ye,v=gu(g)+p,_=g.data.id;if(g.data.boss||_==="moab"||g.data.air){const R=this.bossModel(g),S=Math.max(1,g.data.radius*Ri*.9);R.position.set(m,v,x),R.rotation.set(0,-g.ang,0),R.scale.setScalar(S),this.seen.set(g,{x:m,y:v,z:x,c:mu[_]??9060312});continue}if(g.data.family==="bloon"){const R=this.bloonMeshes.get(_)??this.bloonMesh,S=R.userData._n||0;if(S>=R.instanceMatrix.count)continue;const A=bu(g)/.62*.95,E=Math.sin(performance.now()/300+g.uid)*.12;n.position.set(m,v+E,x),n.rotation.set(0,0,0),n.scale.setScalar(A),n.updateMatrix(),R.setMatrixAt(S,n.matrix),R.setColorAt(S,this.tmpC.setHex(16777215)),R.userData._n=S+1,this.seen.set(g,{x:m,y:v,z:x,c:ta(g)})}else{if(r>=300)continue;const R=Math.max(.6,g.data.radius*Ri*1.6);n.position.set(m,p,x),n.rotation.set(0,-g.ang,0),n.scale.setScalar(R),n.updateMatrix(),this.bugMesh.setMatrixAt(r,n.matrix),this.bugMesh.setColorAt(r++,this.tmpC.setHex(ta(g))),this.seen.set(g,{x:m,y:p+.5,z:x,c:ta(g)})}}for(const[g,p]of this.seen)a.has(g)||(this.seen.delete(g),this.burst(p.x,p.y,p.z,p.c,g.data.boss?30:8));for(const[g,p]of this.bossModels)a.has(g)||(this.scene.remove(p),this.bossModels.delete(g));for(const g of this.bloonMeshes.values())g.count=g.userData._n||0,g.userData._n=0,g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0);this.bloonMesh.count=this.bloonMesh.userData._n||0,this.bloonMesh.userData._n=0,this.bloonMesh.instanceMatrix.needsUpdate=!0,this.bloonMesh.instanceColor&&(this.bloonMesh.instanceColor.needsUpdate=!0),this.bugMesh.count=r,this.bugMesh.instanceMatrix.needsUpdate=!0,this.bugMesh.instanceColor&&(this.bugMesh.instanceColor.needsUpdate=!0);const o=new Set;for(const g of t.towers){if(!g.alive)continue;o.add(g);const p=this.towerModel(g);if(p.root.visible=g!==i,p.root.position.set(g.x*ye,Ht(t.map,g.x,g.y),g.y*ye),p.head.rotation.y=-g.aim,p.veh==="heli"){p.root.position.y+=6+Math.sin(performance.now()/640+g.uid)*.3;const m=(b=p.model)==null?void 0:b.userData;m&&(m.rotor.rotation.y+=e*24,m.tail.rotation.z+=e*40)}else p.veh||p.root.scale.setScalar((p.base??1)*(g.t.visual.scale??1))}for(const[g,p]of this.towerModels)o.has(g)||(this.scene.remove(p.root),this.towerModels.delete(g));let c=0;for(const g of t.units){if(!g.alive||g.garrison||g===i||c>=300||(g.x-i.x)**2+(g.y-i.y)**2<26*26)continue;if(g.squad.data.vehicle){this.vehicleUnit(g,e);continue}n.position.set(g.x*ye,Ht(t.map,g.x,g.y),g.y*ye),n.rotation.set(0,g.facing>0?0:Math.PI,0),n.scale.setScalar(g.squad.data.vehicle?1.6:1),n.updateMatrix(),this.unitMesh.setMatrixAt(c,n.matrix);const p=t.net!=="solo"&&t.mode==="coop"?Dd[g.squad.owner]??"#fff":_r(g.squad.data.faction).color;this.unitMesh.setColorAt(c++,this.tmpC.set(p))}for(const[g,p]of this.unitVeh)(!g.alive||g.garrison||g===i)&&(g.alive?p.g.visible=!1:(this.scene.remove(p.g),this.unitVeh.delete(g)));this.unitMesh.count=c,this.unitMesh.instanceMatrix.needsUpdate=!0,this.unitMesh.instanceColor&&(this.unitMesh.instanceColor.needsUpdate=!0);let l=0,h=0;for(const g of t.projectiles){const p=g.o.kind;!g.alive||!p.startsWith("acid")||h>=200||(n.position.set(g.x*ye,Ht(t.map,g.x,g.y)+1.6+g.height*Ri,g.y*ye),p==="acid_spray"?(n.rotation.set(0,-Math.atan2(g.vy,g.vx),Math.PI/2),n.scale.set(.16,.9,.16)):(n.rotation.set(g.spin*.8,0,g.spin*.5),p==="acid_vial"?n.scale.set(.2,.42,.2):n.scale.set(.38,.75,.38)),n.updateMatrix(),this.acidMesh.setMatrixAt(h++,n.matrix))}this.acidMesh.count=h,this.acidMesh.instanceMatrix.needsUpdate=!0;let u=0;for(const g of t.acidPools){if(u>=48)break;const p=Math.min(1,(g.dur-g.t)/.6);n.position.set(g.x*ye,Ht(t.map,g.x,g.y)+.06,g.y*ye),n.rotation.set(0,0,0),n.scale.set(g.r*ye*p,1,g.r*ye*p),n.updateMatrix(),this.poolMesh.setMatrixAt(u++,n.matrix)}this.poolMesh.count=u,this.poolMesh.instanceMatrix.needsUpdate=!0;for(const g of t.projectiles){if(!g.alive||l>=500||g.o.kind.startsWith("acid"))continue;const p=g.o.kind,m=Math.atan2(g.vy,g.vx),x=g.o.scale??1,v=Ht(t.map,g.x,g.y)+1.5+g.height*Ri;n.position.set(g.x*ye,v,g.y*ye),n.rotation.set(0,-m,0);const _=p==="shell"||p==="melon"?2.4*x:p==="boomerang"||p==="star"?1.8*x:p==="dart"||p==="arrow"?1.6*x:p==="bullet"?1.1*x:1.35*x,R=p==="shell"?1.6:p==="pea"||p==="gpea"||p==="seed"?1.5:1;n.scale.set(_,R,R),n.updateMatrix(),this.shotMesh.setMatrixAt(l,n.matrix),this.shotMesh.setColorAt(l++,this.tmpC.setHex(pu[p]??16769162))}this.shotMesh.count=l,this.shotMesh.instanceMatrix.needsUpdate=!0,this.shotMesh.instanceColor&&(this.shotMesh.instanceColor.needsUpdate=!0),this.syncBeams(e);let d=0;for(const g of this.bits)g.life<=0||(g.life-=e,g.vy-=14*e,g.x+=g.vx*e,g.y=Math.max(g.floor,g.y+g.vy*e),g.z+=g.vz*e,n.position.set(g.x,g.y,g.z),n.rotation.set(g.life*9,g.life*7,0),n.scale.setScalar(Math.max(.1,g.life*2)),n.updateMatrix(),this.bitMesh.setMatrixAt(d,n.matrix),this.bitMesh.setColorAt(d++,g.c));this.bits.length>400&&(this.bits=this.bits.filter(g=>g.life>0)),this.bitMesh.count=d,this.bitMesh.instanceMatrix.needsUpdate=!0,this.bitMesh.instanceColor&&(this.bitMesh.instanceColor.needsUpdate=!0);for(const g of this.tracers)g.life>0&&(g.life-=e,g.life<=0&&(g.line.visible=!1));const f=this.rangePx()*ye;this.ring.visible=f<60,this.ring.position.set(i.x*ye,Ht(t.map,i.x,i.y)+.06,i.y*ye),this.ring.scale.set(f,1,f)}vehicleUnit(e,t){let n=this.unitVeh.get(e);if(!n){const a=new Ne;if(n={g:a,ang:e.facing>0?0:Math.PI,x:e.x,y:e.y},this.unitVeh.set(e,n),this.scene.add(a),e.squad.data.id==="scorpion")qh(Math.min(2,this.g.unitTier(e.squad.data.id))).then(o=>{o.traverse(c=>{c.castShadow=!0}),a.add(o),this.vm.vehicles++});else{const o=(()=>{const h=di("metal").clone();return h.color.setHex(6978130),h})(),c=(()=>{const h=di("iron").clone();return h.color.setHex(2237983),h})(),l=(()=>{const h=di("rust").clone();return h.color.setHex(6965808),h})();a.add(tt(new X(new Le(4.4,.9,2),o),0,1,0),tt(new X(new Le(1.4,.5,1.9),o),1.5,1.6,0)),a.add(tt(new X(new Le(4.2,.12,2.1),l),0,.55,0));for(const[h,u]of[[1.4,1],[1.4,-1],[-1.4,1],[-1.4,-1]])a.add(tt(new X(new Ve(.48,.48,.4,12).rotateX(Math.PI/2),c),h,.48,u));a.add(tt(new X(new Le(.1,1,1.9),c),.2,2,0),tt(new X(new Ve(.05,.05,1.3,6).rotateZ(Math.PI/2),c),-.6,2.2,0)),a.add(tt(new X(new gs(.55,.05,6,14),c),-2,1.3,0)),a.traverse(h=>{h.castShadow=!0}),a.userData.textured=!0}}const i=e.x-n.x,r=e.y-n.y;if(i*i+r*r>.2){const a=Math.atan2(r,i);n.ang+=Math.atan2(Math.sin(a-n.ang),Math.cos(a-n.ang))*Math.min(1,t*5)}n.x=e.x,n.y=e.y,n.g.visible=!0,n.g.position.set(e.x*ye,Ht(this.g.map,e.x,e.y),e.y*ye),n.g.rotation.y=-n.ang}burst(e,t,n,i,r){for(let a=0;a<r&&!(this.bits.length>480);a++){const o=Math.random()*6.283,c=2+Math.random()*4;this.bits.push({floor:Ht(this.g.map,e/ye,n/ye)+.05,x:e,y:t,z:n,vx:Math.cos(o)*c,vy:2+Math.random()*4,vz:Math.sin(o)*c,life:.5+Math.random()*.3,c:new he(i)})}}hud(e){const t=this.g,n=this.obj,i=t.waves;this.el.wave.textContent=i.freeplay?`${i.index} (free)`:`${i.index}/${i.total}`,this.el.hq.textContent=String(Math.ceil(t.hq.health.hp)),this.el.hqb.style.width=`${Math.max(0,t.hq.health.frac)*100}%`,this.el.cash.textContent=String(Math.floor(t.res.credits)),this.el.hits.textContent=String(this.hits),this.el.hp.style.width=`${Math.max(0,n.health.frac)*100}%`;const r=n instanceof xn?n.combat?1-Math.max(0,n.combat.cooldown)/Math.max(.01,n.combat.period):1:(()=>{const a=t.unitTier(n.squad.data.id),o=1/(n.squad.data.tiers[a].stats.attackRate*n.rateMul);return 1-Math.max(0,n.cooldown)/o})();this.el.cd.style.width=`${Math.max(0,Math.min(1,r))*100}%`,this.el["pause-ov"].hidden=!t.paused,t.paused&&document.pointerLockElement&&document.exitPointerLock(),n instanceof Ia&&this.el.abil.querySelectorAll("button").forEach(a=>{const o=a.dataset.ab,c=n.squad.abilityCd[o]??0,l=Da[o].cooldown??1;a.disabled=c>0,a.querySelector("i").style.width=`${(1-Math.min(1,c/l))*100}%`}),this.el.msg.hidden=this.locked||this.touch||t.paused,this.el.msg.hidden||(this.el.msg.textContent="Click to aim & fire · Esc/E to exit"),this.miniT-=e,this.miniT<=0&&(this.miniT=.1,this.drawMini())}drawMini(){const e=this.mini.getContext("2d");if(!e)return;const t=this.g,n=this.mini.width/t.map.width;this.miniImg.complete&&this.miniImg.naturalWidth?e.drawImage(this.miniImg,0,0,this.mini.width,this.mini.height):(e.fillStyle="#3d5a2a",e.fillRect(0,0,this.mini.width,this.mini.height)),e.fillStyle="#fff";for(const c of t.towers)c.alive&&e.fillRect(c.x*n-1.5,c.y*n-1.5,3,3);e.fillStyle="#7fd3ff";for(const c of t.units)c.alive&&!c.garrison&&e.fillRect(c.x*n-1,c.y*n-1,2,2);for(const c of t.enemies)c.alive&&(e.fillStyle=c.data.boss?"#c070ff":"#ff4a3a",e.fillRect(c.x*n-1.5,c.y*n-1.5,c.data.boss?5:3,c.data.boss?5:3));const i=this.obj,r=i.x*n,a=i.y*n,o=this.ctl.aim;e.fillStyle="#ffe14a33",e.beginPath(),e.moveTo(r,a),e.arc(r,a,26,o-.6,o+.6),e.closePath(),e.fill(),e.fillStyle="#ffe14a",e.strokeStyle="#000",e.beginPath(),e.arc(r,a,4,0,6.283),e.fill(),e.stroke()}aimAt(e,t,n=1.3){const i=this.eye().clone(),r=e*ye-i.x,a=t*ye-i.z;this.yaw=Math.atan2(-r,-a),this.pitch=0,this.look(0,-Math.atan2(n-i.y,Math.hypot(r,a))/.0022)}aimNearest(){const e=this.obj,t=this.rangePx()*1.2,n=this.g.enemies.filter(i=>i.alive&&(i.x-e.x)**2+(i.y-e.y)**2<t*t).sort((i,r)=>(i.x-e.x)**2+(i.y-e.y)**2-((r.x-e.x)**2+(r.y-e.y)**2))[0];return n?(this.aimAt(n.x,n.y,this.ey(n)),!0):!1}ey(e){return gu(e)+Ht(this.g.map,e.x,e.y)}setFire(e){this.firing=e}setMove(e,t){this.joy.x=t,this.joy.y=-e}state(){const e=this.obj;return{kind:this.isTower?"tower":"unit",id:(e instanceof xn,e.data.id),x:e.x,y:e.y,hits:this.hits,shots:this.shots,fps:Math.round(this.fps),locked:this.locked,target:!!this.ctl.target,manual:!!e.manual,possessedBy:e.possessedBy,touch:this.touch}}exit(e){var t,n,i,r;this.alive&&(this.alive=!1,cancelAnimationFrame(this.raf),removeEventListener("resize",this.resize),removeEventListener("keydown",this.onKey,!0),removeEventListener("keyup",this.onKeyUp,!0),removeEventListener("mousemove",this.onMouse),removeEventListener("mouseup",this.onUp),document.removeEventListener("pointerlockchange",this.onLock),document.pointerLockElement&&document.exitPointerLock(),this.obj.alive&&this.g.possessCtl(this.obj,null),this.scene.traverse(a=>{var l,h,u;const o=a;(h=(l=o.geometry)==null?void 0:l.dispose)==null||h.call(l);const c=o.material;Array.isArray(c)?c.forEach(d=>d.dispose()):(u=c==null?void 0:c.dispose)==null||u.call(c)}),(t=this.composer)==null||t.dispose(),(n=this.envRT)==null||n.dispose(),this.renderer.dispose(),(r=(i=this.renderer).forceContextLoss)==null||r.call(i),this.root.remove(),document.body.classList.remove("possess-on","ps-touch-on"),sn===this&&(sn=null),La("possess: exit"+(e?" ("+e+")":"")),e&&this.g.toast(e,"#ffd84a"),this.host.onExit())}}let sn=null;function Zv(s,e){var t;sn==null||sn.exit();try{sn=new Kv(s,e)}catch(n){console.error("possess failed",n),(t=document.getElementById("possess-root"))==null||t.remove(),document.body.classList.remove("possess-on","ps-touch-on"),s.g.possessCtl(e,null),s.g.toast("3D view unavailable on this device","#ff8a6a"),sn=null}return window.__possess={get cur(){return sn},exit:()=>sn==null?void 0:sn.exit()},sn}function Qv(){return sn}export{Kv as Possess,ye as S,Qv as current,Zv as possess};
