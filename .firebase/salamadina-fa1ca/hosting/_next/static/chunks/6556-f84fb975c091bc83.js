(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6556],{66556:function(e,t,r){Promise.resolve().then(r.bind(r,65271))},42715:function(e,t,r){var a,n,s;void 0!==(n="function"==typeof(a=s=function(){function e(){for(var e=0,t={};e<arguments.length;e++){var r=arguments[e];for(var a in r)t[a]=r[a]}return t}function t(e){return e.replace(/(%[0-9A-Z]{2})+/g,decodeURIComponent)}return function r(a){function n(){}function s(t,r,s){if("undefined"!=typeof document){"number"==typeof(s=e({path:"/"},n.defaults,s)).expires&&(s.expires=new Date(new Date*1+864e5*s.expires)),s.expires=s.expires?s.expires.toUTCString():"";try{var o=JSON.stringify(r);/^[\{\[]/.test(o)&&(r=o)}catch(e){}r=a.write?a.write(r,t):encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),t=encodeURIComponent(String(t)).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/[\(\)]/g,escape);var i="";for(var l in s)s[l]&&(i+="; "+l,!0!==s[l]&&(i+="="+s[l].split(";")[0]));return document.cookie=t+"="+r+i}}function o(e,r){if("undefined"!=typeof document){for(var n={},s=document.cookie?document.cookie.split("; "):[],o=0;o<s.length;o++){var i=s[o].split("="),l=i.slice(1).join("=");r||'"'!==l.charAt(0)||(l=l.slice(1,-1));try{var c=t(i[0]);if(l=(a.read||a)(l,c)||t(l),r)try{l=JSON.parse(l)}catch(e){}if(n[c]=l,e===c)break}catch(e){}}return e?n[e]:n}}return n.set=s,n.get=function(e){return o(e,!1)},n.getJSON=function(e){return o(e,!0)},n.remove=function(t,r){s(t,"",e(r,{expires:-1}))},n.defaults={},n.withConverter=r,n}(function(){})})?a.call(t,r,t,e):a)&&(e.exports=n),e.exports=s()},97271:function(e,t,r){"use strict";var a=r(2265),n=r(42715),s=r.n(n);t.Z=function(e){var t=(0,a.useState)(function(){return s().get(e)||null}),r=t[0],n=t[1];return[r,(0,a.useCallback)(function(t,r){s().set(e,t,r),n(t)},[e]),(0,a.useCallback)(function(){s().remove(e),n(null)},[e])]}},96545:function(e,t,r){"use strict";r.d(t,{J:function(){return c},SettingsProvider:function(){return d}});var a=r(57437),n=r(2265),s=r(13211),o=[{name:"primary-1",light:"#ff8d8e",main:"#F06769",dark:"#c55556"},{name:"primary-2",light:"#4EB0B1",main:"#0D9394",dark:"#096B6C"},{name:"primary-3",light:"#FFC25A",main:"#FFAB1D",dark:"#BA7D15"},{name:"primary-4",light:"#F0718D",main:"#EB3D63",dark:"#AC2D48"},{name:"primary-5",light:"#5CAFF1",main:"#2092EC",dark:"#176BAC"}],i=r(97271);let l=(e,t)=>{let[r,a]=(0,i.Z)(e);return[(0,n.useMemo)(()=>r?JSON.parse(r):t,[r]),e=>{a(JSON.stringify(e))}]},c=(0,n.createContext)(null),d=e=>{let t={mode:s.Z.mode,skin:s.Z.skin,semiDark:s.Z.semiDark,layout:s.Z.layout,navbarContentWidth:s.Z.navbar.contentWidth,contentWidth:s.Z.contentWidth,footerContentWidth:s.Z.footer.contentWidth,primaryColor:o[0].main},r={...t,mode:e.mode||s.Z.mode},[i,d]=l(s.Z.settingsCookieName,"{}"!==JSON.stringify(e.settingsCookie)?e.settingsCookie:r),[u,m]=(0,n.useState)("{}"!==JSON.stringify(i)?i:r),p=(e,t)=>{let{updateCookie:r=!0}=t||{};m(t=>{let a={...t,...e};return r&&d(a),a})},g=(0,n.useMemo)(()=>JSON.stringify(t)!==JSON.stringify(u),[u]);return(0,a.jsx)(c.Provider,{value:{settings:u,updateSettings:p,isSettingsChanged:g,resetSettings:()=>{p(t)},updatePageSettings:e=>(p(e,{updateCookie:!1}),()=>p(i,{updateCookie:!1}))},children:e.children})}},76463:function(e,t,r){"use strict";r.d(t,{r:function(){return s}});var a=r(2265),n=r(96545);let s=()=>{let e=(0,a.useContext)(n.J);if(!e)throw Error("useSettingsContext must be used within a SettingsProvider");return e}},13211:function(e,t){"use strict";t.Z={templateName:"Salamadina",homePageUrl:"/",settingsCookieName:"Salamadina-mui-next-1",mode:"system",skin:"default",semiDark:!1,layout:"vertical",layoutPadding:24,compactContentWidth:1440,navbar:{type:"fixed",contentWidth:"compact",floating:!0,detached:!0,blur:!0},contentWidth:"compact",footer:{type:"static",contentWidth:"compact",detached:!0},disableRipple:!1,toastPosition:"top-right"}},45814:function(e,t,r){"use strict";r.d(t,{Py:function(){return u},Uu:function(){return m},_w:function(){return g},a$:function(){return l},e$:function(){return p},fu:function(){return c},qA:function(){return d}});var a=r(69842),n=r(73501);let s=(0,a.ad)(n.Z),o=(0,a.hJ)(s,"promos"),i=(0,a.hJ)(s,"airports"),l=async()=>{try{let e=await (0,a.PL)(o),t=await (0,a.PL)(i),r=e.docs.map(e=>({id:e.id,name:e.data().name})),n=t.docs.map(e=>({id:e.id,code:e.data().code,name:e.data().name}));return{promos:r,airports:n}}catch(e){throw console.error("Error fetching filters:",e),e}},c=async e=>{try{return{id:(await (0,a.ET)(o,{name:e})).id,name:e}}catch(e){throw console.error("Error adding promo:",e),e}},d=async e=>{try{return await (0,a.oe)((0,a.JU)(s,"promos",e)),!0}catch(e){throw console.error("Error deleting promo:",e),e}},u=async(e,t)=>{try{return{id:(await (0,a.ET)(i,{code:e,name:t})).id,code:e,name:t}}catch(e){throw console.error("Error adding airport:",e),e}},m=async e=>{try{return await (0,a.oe)((0,a.JU)(s,"airports",e)),!0}catch(e){throw console.error("Error deleting airport:",e),e}},p=async(e,t)=>{try{let r=(0,a.JU)(s,"promos",e);return await (0,a.r7)(r,{name:t}),{id:e,name:t}}catch(e){throw console.error("Error updating promo:",e),e}},g=async(e,t,r)=>{try{let n=(0,a.JU)(s,"airports",e);return await (0,a.r7)(n,{code:t,name:r}),{id:e,code:t,name:r}}catch(e){throw console.error("Error updating airport:",e),e}}},73501:function(e,t,r){"use strict";let a=(0,r(15236).ZF)({apiKey:"AIzaSyCh-VbkFTAxPrY7lvEbaOd4i73lodoE4RQ",authDomain:"salamadina-fa1ca.firebaseapp.com",projectId:"salamadina-fa1ca",storageBucket:"salamadina-fa1ca.firebasestorage.app",messagingSenderId:"1025635284303",appId:"1:1025635284303:web:a19855074f12f54ffa413a"});t.Z=a},26457:function(e,t,r){"use strict";r.d(t,{p:function(){return o}});var a=r(69842),n=r(73501);let s=(0,a.ad)(n.Z),o={getPackages:async()=>{try{let e=(0,a.IO)((0,a.hJ)(s,"umrahPackages"),(0,a.Xo)("createdAt","desc")),t=await (0,a.PL)(e),r=[];return t.forEach(e=>{r.push({id:e.id,...e.data()})}),r}catch(e){throw console.error("Error fetching packages: ",e),Error("Failed to fetch packages")}},addPackage:async e=>{try{return(await (0,a.ET)((0,a.hJ)(s,"umrahPackages"),{...e,createdAt:a.EK.now()})).id}catch(e){throw console.error("Error adding package: ",e),Error("Failed to add package")}},updatePackage:async(e,t)=>{try{if(!e)throw Error("Package ID is required");let r=(0,a.JU)(s,"umrahPackages",e);console.log("Updating package ".concat(e," with data:"),t),await (0,a.r7)(r,{...t,updatedAt:a.EK.now()}),console.log("Package ".concat(e," updated successfully"))}catch(e){if(console.error("Error updating package: ",e),e instanceof Error)throw Error("Failed to update package: ".concat(e.message));throw Error("Failed to update package: Unknown error")}},deletePackage:async e=>{try{await (0,a.oe)((0,a.JU)(s,"umrahPackages",e))}catch(e){throw console.error("Error deleting package: ",e),Error("Failed to delete package")}}}},65271:function(e,t,r){"use strict";r.d(t,{default:function(){return m}});var a=r(57437),n=r(2265),s=()=>{let[e,t]=(0,n.useState)("");return((0,n.useEffect)(()=>{let e="cloudinary://474379412111872:vmLrf2n0HiVRg-YagsYWCSPtRqs@dcvqd1yg5";if(!e){console.error("CLOUDINARY_URL is not defined in environment variables");return}let r=e.match(/@([a-z0-9-]+)/i),a=r?r[1]:null;a&&t("https://res.cloudinary.com/".concat(a,"/image/upload/salamadina/IMG-20250201-WA0057_qwru42"))},[]),e)?(0,a.jsxs)("section",{className:"relative h-[200px] md:h-[300px] lg:h-[400px] overflow-hidden",children:[(0,a.jsx)("div",{className:"absolute inset-0 bg-cover bg-center bg-no-repeat",style:{backgroundImage:"url(".concat(e,")")}}),(0,a.jsx)("div",{className:"absolute inset-0 bg-[#811745] bg-opacity-50"}),(0,a.jsx)("div",{className:"relative h-full flex flex-col items-center justify-center px-4 py-8 md:py-12",children:(0,a.jsx)("div",{className:" px-6 py-4 md:px-8 md:py-6 rounded-xl",children:(0,a.jsxs)("h1",{className:"text-2xl md:text-3xl lg:text-4xl font-bold text-center text-white",children:["Explore our"," ",(0,a.jsx)("span",{className:"font-extrabold relative z-[1]",children:"Umrah Reguler"})]})})})]}):(0,a.jsx)("div",{className:"flex items-center justify-center h-64",children:(0,a.jsx)("div",{className:"animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-900"})})},o=r(76463),i=r(97835),l=r(90186),c=r(26457),d=r(45814),u=()=>{let[e,t]=(0,n.useState)([]),[r,s]=(0,n.useState)(!0),[o,u]=(0,n.useState)(null),[m,p]=(0,n.useState)(""),[g,f]=(0,n.useState)(null),[h,x]=(0,n.useState)(""),[y,b]=(0,n.useState)("All Promos"),[v,j]=(0,n.useState)("All Airports"),[w,N]=(0,n.useState)("All Packages"),[k,C]=(0,n.useState)(["All Packages"]);(0,n.useEffect)(()=>{let t=Array.from(new Set(e.map(e=>e.subType).filter(Boolean)));console.log(t),t||C(["All Packages",...t])},[e]),(0,n.useEffect)(()=>{console.log("Current packageTypes:",k)},[k]),(0,n.useEffect)(()=>{(async()=>{try{s(!0);let[e,r]=await Promise.all([c.p.getPackages(),(0,d.a$)()]);t(e),f(r)}catch(e){u("Failed to load data. Please try again later."),console.error(e)}finally{s(!1)}})()},[]),(0,n.useEffect)(()=>{let e="cloudinary://474379412111872:vmLrf2n0HiVRg-YagsYWCSPtRqs@dcvqd1yg5";if(!e){console.error("CLOUDINARY_URL is not defined in environment variables");return}let t=e.match(/@([a-z0-9-]+)/i),r=t?t[1]:null;r&&p("https://res.cloudinary.com/".concat(r,"/image/upload/salamadina/IMG-20250201-WA0057_qwru42"))},[]);let E=e.filter(e=>{var t;let r=e.title.toLowerCase().includes(h.toLowerCase())||e.subtitle&&e.subtitle.toLowerCase().includes(h.toLowerCase()),a="All Promos"===y||e.tags&&e.tags.some(e=>{let t=null==g?void 0:g.promos.find(t=>t.name===e);return t&&t.name===y}),n="All Airports"===v||e.tags&&e.tags.some(e=>{let t=null==g?void 0:g.airports.find(t=>"".concat(t.code)===e);return t&&"".concat(t.code," (").concat(t.name,")")===v}),s="All Packages"===w||(null==e?void 0:null===(t=e.subType)||void 0===t?void 0:t.toLowerCase())===w.toLowerCase();return r&&a&&n&&s}),S=e=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(e),P=function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return(0,a.jsx)("span",{className:"text-xs px-2 py-1 rounded-full ".concat(t?"bg-rose-100 text-rose-800":"bg-blue-100 text-blue-800"),children:e})};return r?(0,a.jsx)("div",{className:"flex justify-center items-center h-64",children:(0,a.jsx)("p",{children:"Loading packages and filters..."})}):o?(0,a.jsx)("div",{className:"flex justify-center items-center h-64",children:(0,a.jsx)("p",{className:"text-red-500",children:o})}):(0,a.jsx)("div",{className:"min-h-screen bg-white p-4 md:p-8",children:(0,a.jsxs)("div",{className:"max-w-7xl border border-[#811745] p-12 rounded mx-auto",children:[(0,a.jsx)("div",{className:"bg-white rounded-xl p-6 mb-8 border border-[#811745] shadow-sm",children:(0,a.jsxs)("div",{className:"grid gap-6 md:grid-cols-2 lg:grid-cols-4",children:[(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Search"}),(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)(i.Z,{className:"absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",size:20}),(0,a.jsx)("input",{type:"text",placeholder:"Search packages...",className:"w-full pl-10 pr-4 py-2 border border-[#811745] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",value:h,onChange:e=>x(e.target.value)})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Promo"}),(0,a.jsxs)("div",{className:"relative border border-[#811745] rounded-lg bg-white",children:[(0,a.jsxs)("select",{value:y,onChange:e=>b(e.target.value),className:"w-full px-4 py-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg",children:[(0,a.jsx)("option",{value:"All Promos",children:"All Promos"}),null==g?void 0:g.promos.map(e=>(0,a.jsx)("option",{value:e.name,children:e.name},e.id))]}),(0,a.jsx)(l.Z,{className:"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none",size:20})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Airport"}),(0,a.jsxs)("div",{className:"relative border border-[#811745] rounded-lg bg-white",children:[(0,a.jsxs)("select",{value:v,onChange:e=>j(e.target.value),className:"w-full px-4 py-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg",children:[(0,a.jsx)("option",{value:"All Airports",children:"All Airports"}),null==g?void 0:g.airports.map(e=>(0,a.jsxs)("option",{value:"".concat(e.code," (").concat(e.name,")"),children:[e.code," (",e.name,")"]},e.id))]}),(0,a.jsx)(l.Z,{className:"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none",size:20})]})]}),(0,a.jsxs)("div",{children:[(0,a.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Package Type"}),(0,a.jsxs)("div",{className:"relative border border-[#811745] rounded-lg bg-white",children:[(0,a.jsx)("select",{value:w,onChange:e=>N(e.target.value),className:"w-full px-4 py-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg",children:k.map(e=>(0,a.jsx)("option",{value:e,children:e},e))}),(0,a.jsx)(l.Z,{className:"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none",size:20})]})]})]})}),(0,a.jsx)("div",{className:"grid gap-6 md:grid-cols-2 lg:grid-cols-3",children:E.length>0?E.map(e=>{var t;return(0,a.jsxs)("div",{className:"bg-white h-full rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-transform duration-300 hover:scale-105",children:[(0,a.jsx)("div",{className:"relative h-48 bg-gray-200",children:(0,a.jsx)("img",{className:"h-full w-full object-cover",src:e.imageUrl||m||"/api/placeholder/400/320",alt:"package"})}),(0,a.jsxs)("div",{className:"p-6",children:[(0,a.jsxs)("div",{className:"flex flex-wrap gap-2 mb-3",children:[e.packageType&&P(e.packageType,!0),e.subType&&P(e.subType),null===(t=e.tags)||void 0===t?void 0:t.filter(t=>t!==e.packageType&&t!==e.subType).map(e=>(0,a.jsx)("span",{className:"bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full",children:e},e))]}),(0,a.jsx)("h3",{className:"text-xl font-bold text-center mb-2",children:e.title}),(0,a.jsx)("p",{className:"text-gray-500 text-center italic mb-4",children:e.subtitle}),(0,a.jsx)("p",{className:"text-2xl font-bold text-center text-rose-800 mb-6",children:S(e.price)}),(0,a.jsx)("div",{className:"border-t border-gray-200 my-4"}),(0,a.jsx)("div",{className:"space-y-3",children:e.features.map((e,t)=>(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[""===e.icon?(0,a.jsx)("span",{className:"w-5 h-5 flex items-center justify-center rounded-full text-white ".concat(t<3?"bg-blue-500":t<6?"bg-green-500":"bg-yellow-500"),children:"✓"}):(0,a.jsx)("i",{className:"tabler-".concat(e.icon," text-blue-600 text-lg")}),(0,a.jsx)("span",{className:"text-gray-600",children:e.label})]},t))}),(0,a.jsx)("div",{className:"border-t border-gray-200 my-4"}),(0,a.jsxs)("div",{className:"mb-6",children:[(0,a.jsxs)("p",{className:"font-bold mb-2",children:[e.seatsLeft," seats left!"]}),(0,a.jsx)("div",{className:"h-2 bg-rose-100 rounded-full",children:(0,a.jsx)("div",{className:"h-full bg-rose-800 rounded-full",style:{width:"".concat(e.seatsLeft/e.totalSeats*100,"%")}})})]}),(0,a.jsxs)("button",{className:"w-full bg-rose-800 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2",children:[(0,a.jsx)("i",{className:"tabler-user-search"}),"Detail Paket"]})]})]},e.id)}):(0,a.jsx)("div",{className:"col-span-3 text-center py-12 text-gray-500 text-lg",children:"No packages found matching your criteria"})})]})})},m=()=>{let{updatePageSettings:e}=(0,o.r)();return(0,n.useEffect)(()=>e({skin:"default"}),[]),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(s,{}),(0,a.jsx)(u,{})]})}},90186:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});let a=(0,r(6497).Z)("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]])},97835:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});let a=(0,r(6497).Z)("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]])}}]);