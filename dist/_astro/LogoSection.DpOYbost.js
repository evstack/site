import{j as r}from"./jsx-runtime.u17CrQMm.js";import{c as A}from"./data.TjoPmJit.js";import{a as Q,g as U}from"./index.BAnu8Lhe.js";import{m as D}from"./proxy.DartBq0F.js";var g={},O;function Y(){if(O)return g;O=1;function f(a){if(typeof window>"u")return;const c=document.createElement("style");return c.setAttribute("type","text/css"),c.innerHTML=a,document.head.appendChild(c),a}Object.defineProperty(g,"__esModule",{value:!0});var e=Q();function W(a){return a&&typeof a=="object"&&"default"in a?a:{default:a}}var i=W(e);f(`.rfm-marquee-container {
  overflow-x: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
  width: var(--width);
  transform: var(--transform);
}
.rfm-marquee-container:hover div {
  animation-play-state: var(--pause-on-hover);
}
.rfm-marquee-container:active div {
  animation-play-state: var(--pause-on-click);
}

.rfm-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}
.rfm-overlay::before, .rfm-overlay::after {
  background: linear-gradient(to right, var(--gradient-color), rgba(255, 255, 255, 0));
  content: "";
  height: 100%;
  position: absolute;
  width: var(--gradient-width);
  z-index: 2;
  pointer-events: none;
  touch-action: none;
}
.rfm-overlay::after {
  right: 0;
  top: 0;
  transform: rotateZ(180deg);
}
.rfm-overlay::before {
  left: 0;
  top: 0;
}

.rfm-marquee {
  flex: 0 0 auto;
  min-width: var(--min-width);
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  animation: scroll var(--duration) linear var(--delay) var(--iteration-count);
  animation-play-state: var(--play);
  animation-delay: var(--delay);
  animation-direction: var(--direction);
}
@keyframes scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.rfm-initial-child-container {
  flex: 0 0 auto;
  display: flex;
  min-width: auto;
  flex-direction: row;
  align-items: center;
}

.rfm-child {
  transform: var(--transform);
}`);const L=e.forwardRef(function({style:c={},className:B="",autoFill:u=!1,play:d=!0,pauseOnHover:b=!1,pauseOnClick:j=!1,direction:t="left",speed:v=50,delay:S=0,loop:q=0,gradient:F=!1,gradientColor:_="white",gradientWidth:p=200,onFinish:V,onCycleComplete:X,onMount:C,children:y},P){const[E,T]=e.useState(0),[w,Z]=e.useState(0),[x,I]=e.useState(1),[N,G]=e.useState(!1),H=e.useRef(null),o=P||H,m=e.useRef(null),h=e.useCallback(()=>{if(m.current&&o.current){const n=o.current.getBoundingClientRect(),M=m.current.getBoundingClientRect();let s=n.width,l=M.width;(t==="up"||t==="down")&&(s=n.height,l=M.height),I(u&&s&&l&&l<s?Math.ceil(s/l):1),T(s),Z(l)}},[u,o,t]);e.useEffect(()=>{if(N&&(h(),m.current&&o.current)){const n=new ResizeObserver(()=>h());return n.observe(o.current),n.observe(m.current),()=>{n&&n.disconnect()}}},[h,o,N]),e.useEffect(()=>{h()},[h,y]),e.useEffect(()=>{G(!0)},[]),e.useEffect(()=>{typeof C=="function"&&C()},[]);const k=e.useMemo(()=>u?w*x/v:w<E?E/v:w/v,[u,E,w,x,v]),J=e.useMemo(()=>Object.assign(Object.assign({},c),{"--pause-on-hover":!d||b?"paused":"running","--pause-on-click":!d||b&&!j||j?"paused":"running","--width":t==="up"||t==="down"?"100vh":"100%","--transform":t==="up"?"rotate(-90deg)":t==="down"?"rotate(90deg)":"none"}),[c,d,b,j,t]),K=e.useMemo(()=>({"--gradient-color":_,"--gradient-width":typeof p=="number"?`${p}px`:p}),[_,p]),$=e.useMemo(()=>({"--play":d?"running":"paused","--direction":t==="left"?"normal":"reverse","--duration":`${k}s`,"--delay":`${S}s`,"--iteration-count":q?`${q}`:"infinite","--min-width":u?"auto":"100%"}),[d,t,k,S,q,u]),R=e.useMemo(()=>({"--transform":t==="up"?"rotate(90deg)":t==="down"?"rotate(-90deg)":"none"}),[t]),z=e.useCallback(n=>[...Array(Number.isFinite(n)&&n>=0?n:0)].map((M,s)=>i.default.createElement(e.Fragment,{key:s},e.Children.map(y,l=>i.default.createElement("div",{style:R,className:"rfm-child"},l)))),[R,y]);return N?i.default.createElement("div",{ref:o,style:J,className:"rfm-marquee-container "+B},F&&i.default.createElement("div",{style:K,className:"rfm-overlay"}),i.default.createElement("div",{className:"rfm-marquee",style:$,onAnimationIteration:X,onAnimationEnd:V},i.default.createElement("div",{className:"rfm-initial-child-container",ref:m},e.Children.map(y,n=>i.default.createElement("div",{style:R,className:"rfm-child"},n))),z(x-1)),i.default.createElement("div",{className:"rfm-marquee",style:$},z(x))):null});return g.default=L,g}var ee=Y();const te=U(ee),oe=()=>r.jsxs("section",{className:"py-8 md:py-13",children:[r.jsx("div",{className:"container",children:r.jsx("div",{className:"w-full flex justify-center",children:r.jsx("div",{children:r.jsx(D.h2,{initial:{opacity:0},whileInView:{opacity:1},transition:{duration:.5,ease:"easeInOut",delay:.2},viewport:{once:!0},className:"text-xs! max-lg:text-center max-w-100",children:A.logoSection.title})})})}),r.jsx("div",{className:"w-full pt-8 overflow-hidden",children:r.jsx(D.div,{initial:{opacity:0},whileInView:{opacity:1},transition:{duration:.5,ease:"easeInOut",delay:.2},viewport:{once:!0},children:r.jsx(te,{autoFill:!0,pauseOnHover:!0,speed:100,loop:0,gradient:!0,gradientColor:"#F3F4F4",className:"flex",children:A.logoSection.logos.map((f,e)=>r.jsx("div",{children:f.src&&r.jsx("div",{className:"h-13 w-20 md:w-32 lg:w-40 px-4",children:r.jsx("img",{src:f.src,alt:f.alt,width:300,height:300,className:"max-h-full max-w-full object-contain"})})},e))})})})]});export{oe as default};
