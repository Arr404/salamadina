"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[156],{8562:function(e,t,n){n.d(t,{Z:function(){return a}});var r=n(2265),i="undefined"!=typeof window,a=function(e,t){var n=(0,r.useState)(void 0!==t?t:!!i&&window.matchMedia(e).matches),a=n[0],o=n[1];return(0,r.useEffect)(function(){var t=!0,n=window.matchMedia(e),r=function(){t&&o(!!n.matches)};return n.addEventListener("change",r),o(n.matches),function(){t=!1,n.removeEventListener("change",r)}},[e]),a}},6545:function(e,t,n){n.d(t,{J:function(){return d},m:function(){return m}});var r=n(7437),i=n(2265),a=n(3211),o=[{name:"primary-1",light:"#8F85F3",main:"#7367F0",dark:"#675DD8"},{name:"primary-2",light:"#4EB0B1",main:"#0D9394",dark:"#096B6C"},{name:"primary-3",light:"#FFC25A",main:"#FFAB1D",dark:"#BA7D15"},{name:"primary-4",light:"#F0718D",main:"#EB3D63",dark:"#AC2D48"},{name:"primary-5",light:"#5CAFF1",main:"#2092EC",dark:"#176BAC"}],s=n(7271);let u=(e,t)=>{let[n,r]=(0,s.Z)(e);return[(0,i.useMemo)(()=>n?JSON.parse(n):t,[n]),e=>{r(JSON.stringify(e))}]},d=(0,i.createContext)(null),m=e=>{let t={mode:a.Z.mode,skin:a.Z.skin,semiDark:a.Z.semiDark,layout:a.Z.layout,navbarContentWidth:a.Z.navbar.contentWidth,contentWidth:a.Z.contentWidth,footerContentWidth:a.Z.footer.contentWidth,primaryColor:o[0].main},n={...t,mode:e.mode||a.Z.mode},[s,m]=u(a.Z.settingsCookieName,"{}"!==JSON.stringify(e.settingsCookie)?e.settingsCookie:n),[c,l]=(0,i.useState)("{}"!==JSON.stringify(s)?s:n),f=(e,t)=>{let{updateCookie:n=!0}=t||{};l(t=>{let r={...t,...e};return n&&m(r),r})},h=(0,i.useMemo)(()=>JSON.stringify(t)!==JSON.stringify(c),[c]);return(0,r.jsx)(d.Provider,{value:{settings:c,updateSettings:f,isSettingsChanged:h,resetSettings:()=>{f(t)},updatePageSettings:e=>(f(e,{updateCookie:!1}),()=>f(s,{updateCookie:!1}))},children:e.children})}},6463:function(e,t,n){n.d(t,{r:function(){return a}});var r=n(2265),i=n(6545);let a=()=>{let e=(0,r.useContext)(i.J);if(!e)throw Error("useSettingsContext must be used within a SettingsProvider");return e}},2156:function(e,t,n){n.r(t),n.d(t,{default:function(){return m}});var r=n(7437),i=n(6463),a=n(2265),o=n(7271),s=n(8562),u=n(8576),d=e=>{let{settings:t}=(0,i.r)(),{setMode:n}=(0,u.tv)(),[r,d]=(0,o.Z)("colorPref"),m=(0,s.Z)("(prefers-color-scheme: dark)","dark"===e);(0,a.useEffect)(()=>{let e=m?"dark":"light";d(e),"system"===t.mode&&n(e)},[m])},m=e=>{let{systemMode:t,verticalLayout:n,horizontalLayout:a}=e,{settings:o}=(0,i.r)();return d(t),(0,r.jsx)("div",{className:"flex flex-col flex-auto","data-skin":o.skin,children:"horizontal"===o.layout?a:n})}}}]);