"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5501],{50913:function(e,t,n){let r;n.d(t,{NI:function(){return G},RB:function(){return C},XI:function(){return K},YF:function(){return N},Y_:function(){return et},bQ:function(){return H},ll:function(){return U},qs:function(){return J},xp:function(){return er}});var o,u=n(2265),l=n(40600),i=n(75224),c=n(38086),a=n(54887),s=n(94674);let f={...o||(o=n.t(u,2))},d=f.useInsertionEffect||(e=>e());function m(e){let t=u.useRef(()=>{});return d(()=>{t.current=e}),u.useCallback(function(){for(var e=arguments.length,n=Array(e),r=0;r<e;r++)n[r]=arguments[r];return null==t.current?void 0:t.current(...n)},[])}var v="undefined"!=typeof document?u.useLayoutEffect:u.useEffect;function p(){return(p=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}let g=!1,b=0,h=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+b++,E=f.useId||function(){let[e,t]=u.useState(()=>g?h():void 0);return v(()=>{null==e&&t(h())},[]),u.useEffect(()=>{g=!0},[]),e};function y(){let e=new Map;return{emit(t,n){var r;null==(r=e.get(t))||r.forEach(e=>e(n))},on(t,n){e.set(t,[...e.get(t)||[],n])},off(t,n){var r;e.set(t,(null==(r=e.get(t))?void 0:r.filter(e=>e!==n))||[])}}}let x=u.createContext(null),w=u.createContext(null),R=()=>{var e;return(null==(e=u.useContext(x))?void 0:e.id)||null},k=()=>u.useContext(w);function C(e){let{children:t}=e,n=u.useRef([]),r=u.useCallback(e=>{n.current=[...n.current,e]},[]),o=u.useCallback(e=>{n.current=n.current.filter(t=>t!==e)},[]),l=u.useState(()=>y())[0];return u.createElement(w.Provider,{value:u.useMemo(()=>({nodesRef:n,addNode:r,removeNode:o,events:l}),[r,o,l])},t)}function M(e){return"data-floating-ui-"+e}function L(e){let t=(0,u.useRef)(e);return v(()=>{t.current=e}),t}let T=M("safe-polygon");function P(e,t,n){return n&&!(0,l.r)(n)?0:"number"==typeof e?e:null==e?void 0:e[t]}function K(e,t){void 0===t&&(t={});let{open:n,onOpenChange:r,dataRef:o,events:c,elements:a}=e,{enabled:s=!0,delay:f=0,handleClose:d=null,mouseOnly:p=!1,restMs:g=0,move:b=!0}=t,h=k(),E=R(),y=L(d),x=L(f),w=L(n),C=u.useRef(),M=u.useRef(-1),K=u.useRef(),A=u.useRef(-1),S=u.useRef(!0),O=u.useRef(!1),_=u.useRef(()=>{}),D=u.useCallback(()=>{var e;let t=null==(e=o.current.openEvent)?void 0:e.type;return(null==t?void 0:t.includes("mouse"))&&"mousedown"!==t},[o]);u.useEffect(()=>{if(s)return c.on("openchange",e),()=>{c.off("openchange",e)};function e(e){let{open:t}=e;t||(clearTimeout(M.current),clearTimeout(A.current),S.current=!0)}},[s,c]),u.useEffect(()=>{if(!s||!y.current||!n)return;function e(e){D()&&r(!1,e,"hover")}let t=(0,l.Me)(a.floating).documentElement;return t.addEventListener("mouseleave",e),()=>{t.removeEventListener("mouseleave",e)}},[a.floating,n,r,s,y,D]);let I=u.useCallback(function(e,t,n){void 0===t&&(t=!0),void 0===n&&(n="hover");let o=P(x.current,"close",C.current);o&&!K.current?(clearTimeout(M.current),M.current=window.setTimeout(()=>r(!1,e,n),o)):t&&(clearTimeout(M.current),r(!1,e,n))},[x,r]),B=m(()=>{_.current(),K.current=void 0}),j=m(()=>{if(O.current){let e=(0,l.Me)(a.floating).body;e.style.pointerEvents="",e.removeAttribute(T),O.current=!1}});u.useEffect(()=>{if(s&&(0,i.kK)(a.domReference)){var e;let t=a.domReference;return n&&t.addEventListener("mouseleave",f),null==(e=a.floating)||e.addEventListener("mouseleave",f),b&&t.addEventListener("mousemove",u,{once:!0}),t.addEventListener("mouseenter",u),t.addEventListener("mouseleave",c),()=>{var e;n&&t.removeEventListener("mouseleave",f),null==(e=a.floating)||e.removeEventListener("mouseleave",f),b&&t.removeEventListener("mousemove",u),t.removeEventListener("mouseenter",u),t.removeEventListener("mouseleave",c)}}function t(){return!!o.current.openEvent&&["click","mousedown"].includes(o.current.openEvent.type)}function u(e){if(clearTimeout(M.current),S.current=!1,p&&!(0,l.r)(C.current)||g>0&&!P(x.current,"open"))return;let t=P(x.current,"open",C.current);t?M.current=window.setTimeout(()=>{w.current||r(!0,e,"hover")},t):r(!0,e,"hover")}function c(e){if(t())return;_.current();let r=(0,l.Me)(a.floating);if(clearTimeout(A.current),y.current&&o.current.floatingContext){n||clearTimeout(M.current),K.current=y.current({...o.current.floatingContext,tree:h,x:e.clientX,y:e.clientY,onClose(){j(),B(),I(e,!0,"safe-polygon")}});let t=K.current;r.addEventListener("mousemove",t),_.current=()=>{r.removeEventListener("mousemove",t)};return}"touch"===C.current&&(0,l.r3)(a.floating,e.relatedTarget)||I(e)}function f(e){!t()&&o.current.floatingContext&&(null==y.current||y.current({...o.current.floatingContext,tree:h,x:e.clientX,y:e.clientY,onClose(){j(),B(),I(e)}})(e))}},[a,s,e,p,g,b,I,B,j,r,n,w,h,x,y,o]),v(()=>{var e,t;if(s&&n&&null!=(e=y.current)&&e.__options.blockPointerEvents&&D()){let e=(0,l.Me)(a.floating).body;e.setAttribute(T,""),e.style.pointerEvents="none",O.current=!0;let n=a.floating;if((0,i.kK)(a.domReference)&&n){let e=a.domReference,r=null==h||null==(t=h.nodesRef.current.find(e=>e.id===E))||null==(t=t.context)?void 0:t.elements.floating;return r&&(r.style.pointerEvents=""),e.style.pointerEvents="auto",n.style.pointerEvents="auto",()=>{e.style.pointerEvents="",n.style.pointerEvents=""}}}},[s,n,E,a,h,y,D]),v(()=>{n||(C.current=void 0,B(),j())},[n,B,j]),u.useEffect(()=>()=>{B(),clearTimeout(M.current),clearTimeout(A.current),j()},[s,a.domReference,B,j]);let F=u.useMemo(()=>{function e(e){C.current=e.pointerType}return{onPointerDown:e,onPointerEnter:e,onMouseMove(e){let{nativeEvent:t}=e;function o(){S.current||w.current||r(!0,t,"hover")}(!p||(0,l.r)(C.current))&&!n&&0!==g&&(clearTimeout(A.current),"touch"===C.current?o():A.current=window.setTimeout(o,g))}}},[p,r,n,w,g]),U=u.useMemo(()=>({onMouseEnter(){clearTimeout(M.current)},onMouseLeave(e){I(e.nativeEvent,!1)}}),[I]);return u.useMemo(()=>s?{reference:F,floating:U}:{},[s,F,U])}function A(e,t){let n=e.filter(e=>{var n;return e.parentId===t&&(null==(n=e.context)?void 0:n.open)}),r=n;for(;r.length;)r=e.filter(e=>{var t;return null==(t=r)?void 0:t.some(t=>{var n;return e.parentId===t.id&&(null==(n=e.context)?void 0:n.open)})}),n=n.concat(r);return n}let S=()=>({getShadowRoot:!0,displayCheck:"function"==typeof ResizeObserver&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function O(e,t){let n=(0,c.ht)(e,S());"prev"===t&&n.reverse();let r=n.indexOf((0,l.AW)((0,l.Me)(e)));return n.slice(r+1)[0]}function _(e,t){let n=t||e.currentTarget,r=e.relatedTarget;return!r||!(0,l.r3)(n,r)}let D={border:0,clip:"rect(0 0 0 0)",height:"1px",margin:"-1px",overflow:"hidden",padding:0,position:"fixed",whiteSpace:"nowrap",width:"1px",top:0,left:0};function I(e){"Tab"===e.key&&(e.target,clearTimeout(r))}let B=u.forwardRef(function(e,t){let[n,r]=u.useState();v(()=>((0,l.G6)()&&r("button"),document.addEventListener("keydown",I),()=>{document.removeEventListener("keydown",I)}),[]);let o={ref:t,tabIndex:0,role:n,"aria-hidden":!n||void 0,[M("focus-guard")]:"",style:D};return u.createElement("span",p({},e,o))}),j=u.createContext(null),F=M("portal");function U(e){let{children:t,id:n,root:r=null,preserveTabOrder:o=!0}=e,l=function(e){void 0===e&&(e={});let{id:t,root:n}=e,r=E(),o=W(),[l,c]=u.useState(null),a=u.useRef(null);return v(()=>()=>{null==l||l.remove(),queueMicrotask(()=>{a.current=null})},[l]),v(()=>{if(!r||a.current)return;let e=t?document.getElementById(t):null;if(!e)return;let n=document.createElement("div");n.id=r,n.setAttribute(F,""),e.appendChild(n),a.current=n,c(n)},[t,r]),v(()=>{if(!r||a.current)return;let e=n||(null==o?void 0:o.portalNode);e&&!(0,i.kK)(e)&&(e=e.current),e=e||document.body;let u=null;t&&((u=document.createElement("div")).id=t,e.appendChild(u));let l=document.createElement("div");l.id=r,l.setAttribute(F,""),(e=u||e).appendChild(l),a.current=l,c(l)},[t,n,r,o]),l}({id:n,root:r}),[s,f]=u.useState(null),d=u.useRef(null),m=u.useRef(null),p=u.useRef(null),g=u.useRef(null),b=!!s&&!s.modal&&s.open&&o&&!!(r||l);return u.useEffect(()=>{if(l&&o&&(null==s||!s.modal))return l.addEventListener("focusin",e,!0),l.addEventListener("focusout",e,!0),()=>{l.removeEventListener("focusin",e,!0),l.removeEventListener("focusout",e,!0)};function e(e){l&&_(e)&&("focusin"===e.type?function(e){e.querySelectorAll("[data-tabindex]").forEach(e=>{let t=e.dataset.tabindex;delete e.dataset.tabindex,t?e.setAttribute("tabindex",t):e.removeAttribute("tabindex")})}:function(e){(0,c.ht)(e,S()).forEach(e=>{e.dataset.tabindex=e.getAttribute("tabindex")||"",e.setAttribute("tabindex","-1")})})(l)}},[l,o,null==s?void 0:s.modal]),u.createElement(j.Provider,{value:u.useMemo(()=>({preserveTabOrder:o,beforeOutsideRef:d,afterOutsideRef:m,beforeInsideRef:p,afterInsideRef:g,portalNode:l,setFocusManagerState:f}),[o,l])},b&&l&&u.createElement(B,{"data-type":"outside",ref:d,onFocus:e=>{if(_(e,l)){var t;null==(t=p.current)||t.focus()}else{let e=O(document.body,"prev")||(null==s?void 0:s.refs.domReference.current);null==e||e.focus()}}}),b&&l&&u.createElement("span",{"aria-owns":l.id,style:D}),l&&a.createPortal(t,l),b&&l&&u.createElement(B,{"data-type":"outside",ref:m,onFocus:e=>{if(_(e,l)){var t;null==(t=g.current)||t.focus()}else{let t=O(document.body,"next")||(null==s?void 0:s.refs.domReference.current);null==t||t.focus(),(null==s?void 0:s.closeOnFocusOut)&&(null==s||s.onOpenChange(!1,e.nativeEvent))}}}))}let W=()=>u.useContext(j),Y={pointerdown:"onPointerDown",mousedown:"onMouseDown",click:"onClick"},q={pointerdown:"onPointerDownCapture",mousedown:"onMouseDownCapture",click:"onClickCapture"},X=e=>{var t,n;return{escapeKey:"boolean"==typeof e?e:null!=(t=null==e?void 0:e.escapeKey)&&t,outsidePress:"boolean"==typeof e?e:null==(n=null==e?void 0:e.outsidePress)||n}};function H(e,t){void 0===t&&(t={});let{open:n,onOpenChange:r,elements:o,dataRef:c}=e,{enabled:a=!0,escapeKey:s=!0,outsidePress:f=!0,outsidePressEvent:d="pointerdown",referencePress:v=!1,referencePressEvent:p="pointerdown",ancestorScroll:g=!1,bubbles:b,capture:h}=t,E=k(),y=m("function"==typeof f?f:()=>!1),x="function"==typeof f?y:f,w=u.useRef(!1),R=u.useRef(!1),{escapeKey:C,outsidePress:L}=X(b),{escapeKey:T,outsidePress:P}=X(h),K=m(e=>{var t;if(!n||!a||!s||"Escape"!==e.key)return;let o=null==(t=c.current.floatingContext)?void 0:t.nodeId,u=E?A(E.nodesRef.current,o):[];if(!C&&(e.stopPropagation(),u.length>0)){let e=!0;if(u.forEach(t=>{var n;if(null!=(n=t.context)&&n.open&&!t.context.dataRef.current.__escapeKeyBubbles){e=!1;return}}),!e)return}r(!1,(0,l.MM)(e)?e.nativeEvent:e,"escape-key")}),S=m(e=>{var t;let n=()=>{var t;K(e),null==(t=(0,l.U9)(e))||t.removeEventListener("keydown",n)};null==(t=(0,l.U9)(e))||t.addEventListener("keydown",n)}),O=m(e=>{var t;let n=w.current;w.current=!1;let u=R.current;if(R.current=!1,"click"===d&&u||n||"function"==typeof x&&!x(e))return;let a=(0,l.U9)(e),s="["+M("inert")+"]",f=(0,l.Me)(o.floating).querySelectorAll(s),m=(0,i.kK)(a)?a:null;for(;m&&!(0,i.Py)(m);){let e=(0,i.Ow)(m);if((0,i.Py)(e)||!(0,i.kK)(e))break;m=e}if(f.length&&(0,i.kK)(a)&&!(0,l.ex)(a)&&!(0,l.r3)(a,o.floating)&&Array.from(f).every(e=>!(0,l.r3)(m,e)))return;if((0,i.Re)(a)&&I){let t=a.clientWidth>0&&a.scrollWidth>a.clientWidth,n=a.clientHeight>0&&a.scrollHeight>a.clientHeight,r=n&&e.offsetX>a.clientWidth;if(n&&"rtl"===(0,i.Dx)(a).direction&&(r=e.offsetX<=a.offsetWidth-a.clientWidth),r||t&&e.offsetY>a.clientHeight)return}let v=null==(t=c.current.floatingContext)?void 0:t.nodeId,p=E&&A(E.nodesRef.current,v).some(t=>{var n;return(0,l.Pe)(e,null==(n=t.context)?void 0:n.elements.floating)});if((0,l.Pe)(e,o.floating)||(0,l.Pe)(e,o.domReference)||p)return;let g=E?A(E.nodesRef.current,v):[];if(g.length>0){let e=!0;if(g.forEach(t=>{var n;if(null!=(n=t.context)&&n.open&&!t.context.dataRef.current.__outsidePressBubbles){e=!1;return}}),!e)return}r(!1,e,"outside-press")}),_=m(e=>{var t;let n=()=>{var t;O(e),null==(t=(0,l.U9)(e))||t.removeEventListener(d,n)};null==(t=(0,l.U9)(e))||t.addEventListener(d,n)});u.useEffect(()=>{if(!n||!a)return;function e(e){r(!1,e,"ancestor-scroll")}c.current.__escapeKeyBubbles=C,c.current.__outsidePressBubbles=L;let t=(0,l.Me)(o.floating);s&&t.addEventListener("keydown",T?S:K,T),x&&t.addEventListener(d,P?_:O,P);let u=[];return g&&((0,i.kK)(o.domReference)&&(u=(0,i.Kx)(o.domReference)),(0,i.kK)(o.floating)&&(u=u.concat((0,i.Kx)(o.floating))),!(0,i.kK)(o.reference)&&o.reference&&o.reference.contextElement&&(u=u.concat((0,i.Kx)(o.reference.contextElement)))),(u=u.filter(e=>{var n;return e!==(null==(n=t.defaultView)?void 0:n.visualViewport)})).forEach(t=>{t.addEventListener("scroll",e,{passive:!0})}),()=>{s&&t.removeEventListener("keydown",T?S:K,T),x&&t.removeEventListener(d,P?_:O,P),u.forEach(t=>{t.removeEventListener("scroll",e)})}},[c,o,s,x,d,n,r,g,a,C,L,K,T,S,O,P,_]),u.useEffect(()=>{w.current=!1},[x,d]);let D=u.useMemo(()=>({onKeyDown:K,[Y[p]]:e=>{v&&r(!1,e.nativeEvent,"reference-press")}}),[K,r,v,p]),I=u.useMemo(()=>({onKeyDown:K,onMouseDown(){R.current=!0},onMouseUp(){R.current=!0},[q[d]]:()=>{w.current=!0}}),[K,d]);return u.useMemo(()=>a?{reference:D,floating:I}:{},[a,D,I])}function N(e){void 0===e&&(e={});let{nodeId:t}=e,n=function(e){let{open:t=!1,onOpenChange:n,elements:r}=e,o=E(),l=u.useRef({}),[i]=u.useState(()=>y()),c=null!=R(),[a,s]=u.useState(r.reference),f=m((e,t,r)=>{l.current.openEvent=e?t:void 0,i.emit("openchange",{open:e,event:t,reason:r,nested:c}),null==n||n(e,t,r)}),d=u.useMemo(()=>({setPositionReference:s}),[]),v=u.useMemo(()=>({reference:a||r.reference||null,floating:r.floating||null,domReference:r.reference}),[a,r.reference,r.floating]);return u.useMemo(()=>({dataRef:l,open:t,onOpenChange:f,elements:v,events:i,floatingId:o,refs:d}),[t,f,v,i,o,d])}({...e,elements:{reference:null,floating:null,...e.elements}}),r=e.rootContext||n,o=r.elements,[l,c]=u.useState(null),[a,f]=u.useState(null),d=(null==o?void 0:o.reference)||l,p=u.useRef(null),g=k();v(()=>{d&&(p.current=d)},[d]);let b=(0,s.YF)({...e,elements:{...o,...a&&{reference:a}}}),h=u.useCallback(e=>{let t=(0,i.kK)(e)?{getBoundingClientRect:()=>e.getBoundingClientRect(),contextElement:e}:e;f(t),b.refs.setReference(t)},[b.refs]),x=u.useCallback(e=>{((0,i.kK)(e)||null===e)&&(p.current=e,c(e)),((0,i.kK)(b.refs.reference.current)||null===b.refs.reference.current||null!==e&&!(0,i.kK)(e))&&b.refs.setReference(e)},[b.refs]),w=u.useMemo(()=>({...b.refs,setReference:x,setPositionReference:h,domReference:p}),[b.refs,x,h]),C=u.useMemo(()=>({...b.elements,domReference:d}),[b.elements,d]),M=u.useMemo(()=>({...b,...r,refs:w,elements:C,nodeId:t}),[b,w,C,t,r]);return v(()=>{r.dataRef.current.floatingContext=M;let e=null==g?void 0:g.nodesRef.current.find(e=>e.id===t);e&&(e.context=M)}),u.useMemo(()=>({...b,context:M,refs:w,elements:C}),[b,w,C,M])}let z="active",V="selected";function Z(e,t,n){let r=new Map,o="item"===n,u=e;if(o&&e){let{[z]:t,[V]:n,...r}=e;u=r}return{..."floating"===n&&{tabIndex:-1},...u,...t.map(t=>{let r=t?t[n]:null;return"function"==typeof r?e?r(e):null:r}).concat(e).reduce((e,t)=>(t&&Object.entries(t).forEach(t=>{let[n,u]=t;if(!(o&&[z,V].includes(n))){if(0===n.indexOf("on")){if(r.has(n)||r.set(n,[]),"function"==typeof u){var l;null==(l=r.get(n))||l.push(u),e[n]=function(){for(var e,t=arguments.length,o=Array(t),u=0;u<t;u++)o[u]=arguments[u];return null==(e=r.get(n))?void 0:e.map(e=>e(...o)).find(e=>void 0!==e)}}}else e[n]=u}}),e),{})}}function G(e){void 0===e&&(e=[]);let t=e.map(e=>null==e?void 0:e.reference),n=e.map(e=>null==e?void 0:e.floating),r=e.map(e=>null==e?void 0:e.item),o=u.useCallback(t=>Z(t,e,"reference"),t),l=u.useCallback(t=>Z(t,e,"floating"),n),i=u.useCallback(t=>Z(t,e,"item"),r);return u.useMemo(()=>({getReferenceProps:o,getFloatingProps:l,getItemProps:i}),[o,l,i])}let Q=new Map([["select","listbox"],["combobox","listbox"],["label",!1]]);function J(e,t){var n;void 0===t&&(t={});let{open:r,floatingId:o}=e,{enabled:l=!0,role:i="dialog"}=t,c=null!=(n=Q.get(i))?n:i,a=E(),s=null!=R(),f=u.useMemo(()=>"tooltip"===c||"label"===i?{["aria-"+("label"===i?"labelledby":"describedby")]:r?o:void 0}:{"aria-expanded":r?"true":"false","aria-haspopup":"alertdialog"===c?"dialog":c,"aria-controls":r?o:void 0,..."listbox"===c&&{role:"combobox"},..."menu"===c&&{id:a},..."menu"===c&&s&&{role:"menuitem"},..."select"===i&&{"aria-autocomplete":"none"},..."combobox"===i&&{"aria-autocomplete":"list"}},[c,o,s,r,a,i]),d=u.useMemo(()=>{let e={id:o,...c&&{role:c}};return"tooltip"===c||"label"===i?e:{...e,..."menu"===c&&{"aria-labelledby":a}}},[c,o,a,i]),m=u.useCallback(e=>{let{active:t,selected:n}=e,r={role:"option",...t&&{id:o+"-option"}};switch(i){case"select":return{...r,"aria-selected":t&&n};case"combobox":return{...r,...t&&{"aria-selected":!0}}}return{}},[o,i]);return u.useMemo(()=>l?{reference:f,floating:d,item:m}:{},[l,f,d,m])}let $=e=>e.replace(/[A-Z]+(?![a-z])|[A-Z]/g,(e,t)=>(t?"-":"")+e.toLowerCase());function ee(e,t){return"function"==typeof e?e(t):e}function et(e,t){void 0===t&&(t={});let{initial:n={opacity:0},open:r,close:o,common:l,duration:i=250}=t,c=e.placement,a=c.split("-")[0],s=u.useMemo(()=>({side:a,placement:c}),[a,c]),f="number"==typeof i,d=(f?i:i.open)||0,m=(f?i:i.close)||0,[p,g]=u.useState(()=>({...ee(l,s),...ee(n,s)})),{isMounted:b,status:h}=function(e,t){void 0===t&&(t={});let{open:n,elements:{floating:r}}=e,{duration:o=250}=t,l=("number"==typeof o?o:o.close)||0,[i,c]=u.useState("unmounted"),a=function(e,t){let[n,r]=u.useState(e);return e&&!n&&r(!0),u.useEffect(()=>{if(!e&&n){let e=setTimeout(()=>r(!1),t);return()=>clearTimeout(e)}},[e,n,t]),n}(n,l);return a||"close"!==i||c("unmounted"),v(()=>{if(r){if(n){c("initial");let e=requestAnimationFrame(()=>{c("open")});return()=>{cancelAnimationFrame(e)}}c("close")}},[n,r]),{isMounted:a,status:i}}(e,{duration:i}),E=L(n),y=L(r),x=L(o),w=L(l);return v(()=>{let e=ee(E.current,s),t=ee(x.current,s),n=ee(w.current,s),r=ee(y.current,s)||Object.keys(e).reduce((e,t)=>(e[t]="",e),{});if("initial"===h&&g(t=>({transitionProperty:t.transitionProperty,...n,...e})),"open"===h&&g({transitionProperty:Object.keys(r).map($).join(","),transitionDuration:d+"ms",...n,...r}),"close"===h){let r=t||e;g({transitionProperty:Object.keys(r).map($).join(","),transitionDuration:m+"ms",...n,...r})}},[m,x,E,y,w,d,h,s]),{isMounted:b,styles:p}}function en(e,t){let[n,r]=e,o=!1,u=t.length;for(let e=0,l=u-1;e<u;l=e++){let[u,i]=t[e]||[0,0],[c,a]=t[l]||[0,0];i>=r!=a>=r&&n<=(c-u)*(r-i)/(a-i)+u&&(o=!o)}return o}function er(e){let t;void 0===e&&(e={});let{buffer:n=.5,blockPointerEvents:r=!1,requireIntent:o=!0}=e,u=!1,c=null,a=null,s=performance.now(),f=e=>{let{x:r,y:f,placement:d,elements:m,onClose:v,nodeId:p,tree:g}=e;return function(e){function b(){clearTimeout(t),v()}if(clearTimeout(t),!m.domReference||!m.floating||null==d||null==r||null==f)return;let{clientX:h,clientY:E}=e,y=[h,E],x=(0,l.U9)(e),w="mouseleave"===e.type,R=(0,l.r3)(m.floating,x),k=(0,l.r3)(m.domReference,x),C=m.domReference.getBoundingClientRect(),M=m.floating.getBoundingClientRect(),L=d.split("-")[0],T=r>M.right-M.width/2,P=f>M.bottom-M.height/2,K=y[0]>=C.x&&y[0]<=C.x+C.width&&y[1]>=C.y&&y[1]<=C.y+C.height,S=M.width>C.width,O=M.height>C.height,_=(S?C:M).left,D=(S?C:M).right,I=(O?C:M).top,B=(O?C:M).bottom;if(R&&(u=!0,!w))return;if(k&&(u=!1),k&&!w){u=!0;return}if(w&&(0,i.kK)(e.relatedTarget)&&(0,l.r3)(m.floating,e.relatedTarget)||g&&A(g.nodesRef.current,p).some(e=>{let{context:t}=e;return null==t?void 0:t.open}))return;if("top"===L&&f>=C.bottom-1||"bottom"===L&&f<=C.top+1||"left"===L&&r>=C.right-1||"right"===L&&r<=C.left+1)return b();let j=[];switch(L){case"top":j=[[_,C.top+1],[_,M.bottom-1],[D,M.bottom-1],[D,C.top+1]];break;case"bottom":j=[[_,M.top+1],[_,C.bottom-1],[D,C.bottom-1],[D,M.top+1]];break;case"left":j=[[M.right-1,B],[M.right-1,I],[C.left+1,I],[C.left+1,B]];break;case"right":j=[[C.right-1,B],[C.right-1,I],[M.left+1,I],[M.left+1,B]]}if(!en([h,E],j)){if(u&&!K)return b();if(!w&&o){let t=function(e,t){let n=performance.now(),r=n-s;if(null===c||null===a||0===r)return c=e,a=t,s=n,null;let o=e-c,u=t-a;return c=e,a=t,s=n,Math.sqrt(o*o+u*u)/r}(e.clientX,e.clientY);if(null!==t&&t<.1)return b()}en([h,E],function(e){let[t,r]=e;switch(L){case"top":{let e=[[M.left,T?M.bottom-n:S?M.bottom-n:M.top],[M.right,T?S?M.bottom-n:M.top:M.bottom-n]];return[[S?t+n/2:T?t+4*n:t-4*n,r+n+1],[S?t-n/2:T?t+4*n:t-4*n,r+n+1],...e]}case"bottom":{let e=[[M.left,T?M.top+n:S?M.top+n:M.bottom],[M.right,T?S?M.top+n:M.bottom:M.top+n]];return[[S?t+n/2:T?t+4*n:t-4*n,r-n],[S?t-n/2:T?t+4*n:t-4*n,r-n],...e]}case"left":return[[P?M.right-n:O?M.right-n:M.left,M.top],[P?O?M.right-n:M.left:M.right-n,M.bottom],[t+n+1,O?r+n/2:P?r+4*n:r-4*n],[t+n+1,O?r-n/2:P?r+4*n:r-4*n]];case"right":{let e=[[P?M.left+n:O?M.left+n:M.right,M.top],[P?O?M.left+n:M.right:M.left+n,M.bottom]];return[[t-n,O?r+n/2:P?r+4*n:r-4*n],[t-n,O?r-n/2:P?r+4*n:r-4*n],...e]}}}([r,f]))?!u&&o&&(t=window.setTimeout(b,40)):b()}}};return f.__options={blockPointerEvents:r},f}}}]);