(window.webpackJsonp=window.webpackJsonp||[]).push([[60],{127:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return s})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return d}));var i=n(3),a=n(7),r=(n(0),n(133)),o={title:"Field Selection"},s={unversionedId:"reference/extensions/field-selection",id:"reference/extensions/field-selection",isDocsHomePage:!1,title:"Field Selection",description:"One of the most important Praxis extensions is the ability to select which fields of the response objects you want to receive. Using this extension, an API client is able to fully specify (through a graphQL syntax) which fields to retrieve. This functionality, along with the GraphQL syntax allows you to recurse as deep as you need it to describe the complete tree of data that you want to retrieve using only a single API request.",source:"@site/docs/reference/extensions/field-selection.md",slug:"/reference/extensions/field-selection",permalink:"/docs/reference/extensions/field-selection",version:"current",sidebar:"mainSidebar",previous:{title:"Pagination Plugin",permalink:"/docs/reference/extensions/pagination-plugin"},next:{title:"Filtering",permalink:"/docs/reference/extensions/filtering"}},l=[{value:"Defining the fields parameter",id:"defining-the-fields-parameter",children:[]},{value:"Using the fields parameter",id:"using-the-fields-parameter",children:[]},{value:"Internals of the FieldSelector type",id:"internals-of-the-fieldselector-type",children:[]}],c={toc:l};function d(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(r.b)("wrapper",Object(i.a)({},c,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("p",null,"One of the most important Praxis extensions is the ability to select which fields of the response objects you want to receive. Using this extension, an API client is able to fully specify (through a graphQL syntax) which fields to retrieve. This functionality, along with the GraphQL syntax allows you to recurse as deep as you need it to describe the complete tree of data that you want to retrieve using only a single API request."),Object(r.b)("p",null,"This functionality is achieved by exposing a well known ",Object(r.b)("inlineCode",{parentName:"p"},"fields")," query string parameter which is typically available to any ",Object(r.b)("inlineCode",{parentName:"p"},"index"),", ",Object(r.b)("inlineCode",{parentName:"p"},"show")," actions, but that can technically be available in any other action as well. "),Object(r.b)("p",null,"Before getting into the details, let's take a look at an example of how the client can use this functionality. Let's assume we're putting together an API that serves ",Object(r.b)("inlineCode",{parentName:"p"},"Post"),"s which have things like ",Object(r.b)("inlineCode",{parentName:"p"},"id"),", ",Object(r.b)("inlineCode",{parentName:"p"},"title"),", ",Object(r.b)("inlineCode",{parentName:"p"},"content"),", etc. Also let's assume each of these posts has a list of associated ",Object(r.b)("inlineCode",{parentName:"p"},"Comment"),"s, which have attributes like ",Object(r.b)("inlineCode",{parentName:"p"},"message"),". Furthermore let's assume that each ",Object(r.b)("inlineCode",{parentName:"p"},"Comment")," belongs to an associated ",Object(r.b)("inlineCode",{parentName:"p"},"User"),", which has things like ",Object(r.b)("inlineCode",{parentName:"p"},"first_name")," or ",Object(r.b)("inlineCode",{parentName:"p"},"email"),"."),Object(r.b)("p",null,"If we wanted to retrieve, in one single API call, the list of all Posts's contents, along with all of their embedded comments, and for each of them, also include the first name of the user that made them, we would be crafting the following GraphQL syntax string (no newlines or spaces) in the value of the ",Object(r.b)("inlineCode",{parentName:"p"},"filters")," parameter:"),Object(r.b)("pre",null,Object(r.b)("code",Object(i.a)({parentName:"pre"},{className:"language-shell"}),"curl 'http://localhost:9292/posts?api_version=1' -G \\\n      --data-urlencode \"fields=id,content,comments{user{first_name}}\"\n")),Object(r.b)("p",null,"TODO: example output?"),Object(r.b)("p",null,"From a point of view of the client, this may only seem to have implications on the rendering of the fields returned in the API request, however, achieving such a result has much deeper requirements. In particular, there are a series of events that need to happen to make sure we can map those attributes to the right DB tables and columns, that the right DB queries are crafted to retrieve all the required data (and no more than necessary) and that that these can perform in an efficient matter. Therefore the field selection extension, as a concept is very much linked to the Rendering and the Automatic Querying extensions. In other words, the querying extensions need to understand the tree of data that it is required to retrieve, as much as the rendering extension needs to make sure to render these required fields."),Object(r.b)("p",null,"Anyway, let's get into how you define and use the field selection. The first thing is define the ",Object(r.b)("inlineCode",{parentName:"p"},"fields")," parameter to any actions that you need."),Object(r.b)("h2",{id:"defining-the-fields-parameter"},"Defining the fields parameter"),Object(r.b)("p",null,"To allow field selection abilities in an action, Praxis provides a bundled type class, which you can directly use: ",Object(r.b)("inlineCode",{parentName:"p"},"Praxis::Types::FieldSelector"),". Here's how you'd define the field selection query string parameter for an action that returns ",Object(r.b)("inlineCode",{parentName:"p"},"Post")," mediatypes:"),Object(r.b)("pre",null,Object(r.b)("code",Object(i.a)({parentName:"pre"},{className:"language-ruby"}),"attribute :fields, Praxis::Types::FieldSelector.for(MediaTypes::Post),\n            description: 'Fields with which to render the result.'\n")),Object(r.b)("p",null,"In particular, using the ",Object(r.b)("inlineCode",{parentName:"p"},".for(<MT>)")," method, this class is gonna be able to understand that the syntax allowed for this field can contain any of the defined attributes for a ",Object(r.b)("inlineCode",{parentName:"p"},"Post")," media type, including any further recursion of those attributes down into other related media types of ",Object(r.b)("inlineCode",{parentName:"p"},"Post"),". For example, it will properly validate and decode incoming field strings like ",Object(r.b)("inlineCode",{parentName:"p"},"fields=id,contents,comments"),", but it will generate a validation errors if you pass things like ",Object(r.b)("inlineCode",{parentName:"p"},"fields=this,is,not,right"),". "),Object(r.b)("p",null,"Note that the power of this embedded FieldSelector type is that you don't have to worry about defining any allowed attributes. The type will assume you want to allow to request fields with the same exact names as the media type attribute tree. If for whatever reason you wanted to define a different field name mapping, you can look at the underlying ",Object(r.b)("inlineCode",{parentName:"p"},"FieldSelector")," type (without using the ",Object(r.b)("inlineCode",{parentName:"p"},".for")," method), and craft whatever you need for your purposes. Praxis recommends, however, to be very consistent with names, so please use the provided types as it makes for a confusing API when things don't properly align."),Object(r.b)("h2",{id:"using-the-fields-parameter"},"Using the fields parameter"),Object(r.b)("p",null,"TODO: ... talk about the includes etc..."),Object(r.b)("p",null,"So, now that we have a type that is able to validate and coerce the fields string into a proper class, we need to be able to use it for both retrieving the necessary data, and to render the appropriate fields in the response."),Object(r.b)("p",null,"To put this functionality to work, you need to first make sure the FieldSelection extension is enabled. You can manually achieve this by ",Object(r.b)("inlineCode",{parentName:"p"},"require 'praxis/extensions/field_selection'")," (and then making sure that the DB and rendering extensions are also included and configured). However, it's much preferred and easier that instead, you simply configure the ",Object(r.b)("inlineCode",{parentName:"p"},"MapperPlugin"),". Configuring the ",Object(r.b)("inlineCode",{parentName:"p"},"MapperPlugin")," will take care of those things for you, and you will only need to define the fields parameter as above, and just add a couple of lines in our controller action (to implement the querying and rendering bits). For example, here is how to implement the ",Object(r.b)("inlineCode",{parentName:"p"},"index")," action for Posts, which fully supports field selection parameter if defined in the endpoint:"),Object(r.b)("pre",null,Object(r.b)("code",Object(i.a)({parentName:"pre"},{className:"language-ruby"}),"    def index\n      objects = build_query(:Post).all\n      display(objects)\n    end\n")),Object(r.b)("p",null,"The ",Object(r.b)("inlineCode",{parentName:"p"},"build_query")," code will craft the necessary efficient queries based on the required fields, and the ",Object(r.b)("inlineCode",{parentName:"p"},"display")," method will take care of rendering the results based on them. Done and done."),Object(r.b)("h2",{id:"internals-of-the-fieldselector-type"},"Internals of the FieldSelector type"),Object(r.b)("p",null,"TODO: Move to internals???"))}d.isMDXComponent=!0},133:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return f}));var i=n(0),a=n.n(i);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=a.a.createContext({}),d=function(e){var t=a.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=d(e.components);return a.a.createElement(c.Provider,{value:t},e.children)},h={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},u=a.a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,o=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=d(n),u=i,f=p["".concat(o,".").concat(u)]||p[u]||h[u]||r;return n?a.a.createElement(f,s(s({ref:t},c),{},{components:n})):a.a.createElement(f,s({ref:t},c))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,o=new Array(r);o[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var c=2;c<r;c++)o[c]=n[c];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);