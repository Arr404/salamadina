(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4],{7271:function(t,e,n){"use strict";var o=n(2265),r=n(2715),a=n.n(r);e.Z=function(t){var e=(0,o.useState)(function(){return a().get(t)||null}),n=e[0],r=e[1];return[n,(0,o.useCallback)(function(e,n){a().set(t,e,n),r(e)},[t]),(0,o.useCallback)(function(){a().remove(t),r(null)},[t])]}},6545:function(t,e,n){"use strict";n.d(e,{J:function(){return u},m:function(){return s}});var o=n(7437),r=n(2265),a=n(3211),i=[{name:"primary-1",light:"#8F85F3",main:"#7367F0",dark:"#675DD8"},{name:"primary-2",light:"#4EB0B1",main:"#0D9394",dark:"#096B6C"},{name:"primary-3",light:"#FFC25A",main:"#FFAB1D",dark:"#BA7D15"},{name:"primary-4",light:"#F0718D",main:"#EB3D63",dark:"#AC2D48"},{name:"primary-5",light:"#5CAFF1",main:"#2092EC",dark:"#176BAC"}],l=n(7271);let c=(t,e)=>{let[n,o]=(0,l.Z)(t);return[(0,r.useMemo)(()=>n?JSON.parse(n):e,[n]),t=>{o(JSON.stringify(t))}]},u=(0,r.createContext)(null),s=t=>{let e={mode:a.Z.mode,skin:a.Z.skin,semiDark:a.Z.semiDark,layout:a.Z.layout,navbarContentWidth:a.Z.navbar.contentWidth,contentWidth:a.Z.contentWidth,footerContentWidth:a.Z.footer.contentWidth,primaryColor:i[0].main},n={...e,mode:t.mode||a.Z.mode},[l,s]=c(a.Z.settingsCookieName,"{}"!==JSON.stringify(t.settingsCookie)?t.settingsCookie:n),[d,h]=(0,r.useState)("{}"!==JSON.stringify(l)?l:n),f=(t,e)=>{let{updateCookie:n=!0}=e||{};h(e=>{let o={...e,...t};return n&&s(o),o})},y=(0,r.useMemo)(()=>JSON.stringify(e)!==JSON.stringify(d),[d]);return(0,o.jsx)(u.Provider,{value:{settings:d,updateSettings:f,isSettingsChanged:y,resetSettings:()=>{f(e)},updatePageSettings:t=>(f(t,{updateCookie:!1}),()=>f(l,{updateCookie:!1}))},children:t.children})}},6463:function(t,e,n){"use strict";n.d(e,{r:function(){return a}});var o=n(2265),r=n(6545);let a=()=>{let t=(0,o.useContext)(r.J);if(!t)throw Error("useSettingsContext must be used within a SettingsProvider");return t}},5004:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return f}});var o=n(7437),r=n(6800),a=n.n(r),i=n(6463),l=n(1634),c=n(7784),u=t=>{let{children:e}=t,{settings:n}=(0,i.r)(),r="compact"===n.contentWidth,u="wide"===n.contentWidth;return(0,o.jsx)(c.Z,{isContentCompact:r,className:a()(l.jU.content,"flex-auto",{["".concat(l.jU.contentCompact," is-full")]:r,[l.jU.contentWide]:u}),children:e})},s=n(8646);function d(){let t=(0,s._)(["\n  &:has(.",">.",") {\n    max-block-size: 100dvh;\n  }\n"]);return d=function(){return t},t}let h=n(8493).Z.div(d(),l.jU.content,l.kV.contentHeightFixed);var f=t=>{let{navbar:e,footer:n,navigation:r,children:i}=t;return(0,o.jsxs)("div",{className:a()(l.jU.root,"flex flex-auto"),children:[r||null,(0,o.jsxs)(h,{className:a()(l.jU.contentWrapper,"flex flex-col min-is-0 is-full"),children:[e||null,(0,o.jsx)(u,{children:i}),n||null]})]})}},7784:function(t,e,n){"use strict";var o=n(8646),r=n(8493),a=n(3211),i=n(1634);function l(){let t=(0,o._)(["\n  padding: ","px;\n  ","\n\n  &:has(.",") {\n    display: flex;\n    overflow: hidden;\n  }\n"]);return l=function(){return t},t}let c=r.Z.main(l(),a.Z.layoutPadding,t=>{let{isContentCompact:e}=t;return e&&"\n    margin-inline: auto;\n    max-inline-size: ".concat(a.Z.compactContentWidth,"px;\n  ")},i.kV.contentHeightFixed);e.Z=c},1634:function(t,e,n){"use strict";n.d(e,{WG:function(){return r},jU:function(){return o},kV:function(){return a}});let o={root:"ts-vertical-layout",contentWrapper:"ts-vertical-layout-content-wrapper",header:"ts-vertical-layout-header",headerFixed:"ts-vertical-layout-header-fixed",headerStatic:"ts-vertical-layout-header-static",headerFloating:"ts-vertical-layout-header-floating",headerDetached:"ts-vertical-layout-header-detached",headerAttached:"ts-vertical-layout-header-attached",headerContentCompact:"ts-vertical-layout-header-content-compact",headerContentWide:"ts-vertical-layout-header-content-wide",headerBlur:"ts-vertical-layout-header-blur",navbar:"ts-vertical-layout-navbar",navbarContent:"ts-vertical-layout-navbar-content",content:"ts-vertical-layout-content",contentCompact:"ts-vertical-layout-content-compact",contentWide:"ts-vertical-layout-content-wide",footer:"ts-vertical-layout-footer",footerStatic:"ts-vertical-layout-footer-static",footerFixed:"ts-vertical-layout-footer-fixed",footerDetached:"ts-vertical-layout-footer-detached",footerAttached:"ts-vertical-layout-footer-attached",footerContentWrapper:"ts-vertical-layout-footer-content-wrapper",footerContent:"ts-vertical-layout-footer-content",footerContentCompact:"ts-vertical-layout-footer-content-compact",footerContentWide:"ts-vertical-layout-footer-content-wide"},r={root:"ts-horizontal-layout",contentWrapper:"ts-horizontal-layout-content-wrapper",header:"ts-horizontal-layout-header",headerFixed:"ts-horizontal-layout-header-fixed",headerStatic:"ts-horizontal-layout-header-static",headerContentCompact:"ts-horizontal-layout-header-content-compact",headerContentWide:"ts-horizontal-layout-header-content-wide",headerBlur:"ts-horizontal-layout-header-blur",navbar:"ts-horizontal-layout-navbar",navbarContent:"ts-horizontal-layout-navbar-content",navigation:"ts-horizontal-layout-navigation",navigationContentWrapper:"ts-horizontal-layout-navigation-content-wrapper",content:"ts-horizontal-layout-content",contentCompact:"ts-horizontal-layout-content-compact",contentWide:"ts-horizontal-layout-content-wide",footer:"ts-horizontal-layout-footer",footerStatic:"ts-horizontal-layout-footer-static",footerFixed:"ts-horizontal-layout-footer-fixed",footerContentWrapper:"ts-horizontal-layout-footer-content-wrapper",footerContent:"ts-horizontal-layout-footer-content",footerContentCompact:"ts-horizontal-layout-footer-content-compact",footerContentWide:"ts-horizontal-layout-footer-content-wide"},a={contentHeightFixed:"ts-layout-content-height-fixed"}},6800:function(t,e){var n;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/!function(){"use strict";var o={}.hasOwnProperty;function r(){for(var t="",e=0;e<arguments.length;e++){var n=arguments[e];n&&(t=a(t,function(t){if("string"==typeof t||"number"==typeof t)return t;if("object"!=typeof t)return"";if(Array.isArray(t))return r.apply(null,t);if(t.toString!==Object.prototype.toString&&!t.toString.toString().includes("[native code]"))return t.toString();var e="";for(var n in t)o.call(t,n)&&t[n]&&(e=a(e,n));return e}(n)))}return t}function a(t,e){return e?t?t+" "+e:t+e:t}t.exports?(r.default=r,t.exports=r):void 0!==(n=(function(){return r}).apply(e,[]))&&(t.exports=n)}()}}]);