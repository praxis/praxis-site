(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{133:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return m}));var r=n(0),o=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=o.a.createContext({}),u=function(e){var t=o.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=u(e.components);return o.a.createElement(c.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},d=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,i=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=u(n),d=r,m=p["".concat(i,".").concat(d)]||p[d]||f[d]||a;return n?o.a.createElement(m,s(s({ref:t},c),{},{components:n})):o.a.createElement(m,s({ref:t},c))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var c=2;c<a;c++)i[c]=n[c];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},88:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return s})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return u}));var r=n(3),o=n(7),a=(n(0),n(133)),i={title:"Introduction"},s={unversionedId:"reference/extensions/intro",id:"reference/extensions/intro",isDocsHomePage:!1,title:"Introduction",description:"Praxis is to be a high productivity framework where you can immediatly leverage many framework features to guide you and allow you to move really fast. At the same time, however, the philosophy of Praxis is to also keep all of those extensions and building blocks as optional. It is our goal, building it in this way it can give the best of both worlds, as you can always decide to customize, change or combine the pieces that make more sense to you as your application changes and evolves.",source:"@site/docs/reference/extensions/intro.md",slug:"/reference/extensions/intro",permalink:"/docs/reference/extensions/intro",version:"current",sidebar:"mainSidebar",previous:{title:"Multipart Types",permalink:"/docs/reference/implementation/multipart"},next:{title:"Mapper Plugin",permalink:"/docs/reference/extensions/mapper-plugin"}},l=[],c={toc:l};function u(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},c,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"Praxis is to be a high productivity framework where you can immediatly leverage many framework features to guide you and allow you to move really fast. At the same time, however, the philosophy of Praxis is to also keep all of those extensions and building blocks as optional. It is our goal, building it in this way it can give the best of both worlds, as you can always decide to customize, change or combine the pieces that make more sense to you as your application changes and evolves."),Object(a.b)("p",null,"Therefore, at its core, Praxis provides many powerful extensions that you can immediately leverage. In particular, extensions for rendering responses, for automatically building efficient DB queries based on the exact data you require, design and implementation features for pagination and sorting, API filtering extensions...and below all that, many more lower-level classes and features you can leverage to build your apps."),Object(a.b)("p",null,"It is likely that you'll want to take advantage of many of these extensions together, so Praxis also provides things like the ",Object(a.b)("inlineCode",{parentName:"p"},"MapperPlugin")," or ",Object(a.b)("inlineCode",{parentName:"p"},"PaginationPlugin")," which configure multiple of those building blocks in a ready to use manner. Think of it as a meta-extensions. We higly recommend you use them, at least as a start, rather than trying glue all the individual extensions together."))}u.isMDXComponent=!0}}]);