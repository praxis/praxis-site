"use strict";(self.webpackChunkpraxis_site=self.webpackChunkpraxis_site||[]).push([[3930],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>h});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var p=n.createContext({}),s=function(e){var t=n.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},u=function(e){var t=s(e.components);return n.createElement(p.Provider,{value:t},e.children)},d="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},c=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,p=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=s(a),c=r,h=d["".concat(p,".").concat(c)]||d[c]||m[c]||i;return a?n.createElement(h,o(o({ref:t},u),{},{components:a})):n.createElement(h,o({ref:t},u))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,o=new Array(i);o[0]=c;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[d]="string"==typeof e?e:r,o[1]=l;for(var s=2;s<i;s++)o[s]=a[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}c.displayName="MDXCreateElement"},4400:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>l,toc:()=>s});var n=a(7462),r=(a(7294),a(3905));const i={title:"Multipart"},o=void 0,l={unversionedId:"reference/design/multipart",id:"reference/design/multipart",title:"Multipart",description:'Praxis has built-in support for defining and handling "multipart/form-data" requests and responses (rfc2388 & friends). This support is mostly provided by the underlying Praxis::MultipartOk response.',source:"@site/docs/reference/design/multipart.md",sourceDirName:"reference/design",slug:"/reference/design/multipart",permalink:"/docs/reference/design/multipart",draft:!1,tags:[],version:"current",frontMatter:{title:"Multipart"},sidebar:"mainSidebar",previous:{title:"Document Generation",permalink:"/docs/reference/design/doc-generation"},next:{title:"Controllers",permalink:"/docs/reference/implementation/controllers"}},p={},s=[{value:"Designing Multipart structures",id:"designing-multipart-structures",level:2},{value:"Returning Multipart Responses",id:"returning-multipart-responses",level:2}],u={toc:s},d="wrapper";function m(e){let{components:t,...a}=e;return(0,r.kt)(d,(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,'Praxis has built-in support for defining and handling "multipart/form-data" requests and responses (',(0,r.kt)("a",{parentName:"p",href:"https://www.ietf.org/rfc/rfc2388.txt"},"rfc2388")," & friends). This support is mostly provided by the underlying ",(0,r.kt)("inlineCode",{parentName:"p"},"Praxis::Types::MultipartArray")," type, and the ",(0,r.kt)("inlineCode",{parentName:"p"},"Praxis::Responses::MultipartOk")," response."),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"MultipartArray")," type is the main piece of code use to handle decoding/encoding multipart structures. It is typically used to define the structure of incoming multipart payloads, as well as used to create proper multipart bodies in API responses. In particular, it is a type defined as a ",(0,r.kt)("inlineCode",{parentName:"p"},"Attributor::Collection")," of ",(0,r.kt)("inlineCode",{parentName:"p"},"Praxis::MultipartPart")," type members that allows you to describe each part of a multipart request or response body."),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"MultipartOk")," response class (and corresponding template) is a simlple thin layer on top of the ",(0,r.kt)("inlineCode",{parentName:"p"},"Ok")," response that makes it easier to compose multipart responses in your controllers."),(0,r.kt)("h2",{id:"designing-multipart-structures"},"Designing Multipart structures"),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"MultipartArray")," is a fully compatible ",(0,r.kt)("inlineCode",{parentName:"p"},"Attributor")," type, that can:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"load, coerce and validate incoming multipart payload bodies, transforming them in instances of ",(0,r.kt)("inlineCode",{parentName:"li"},"MultipartArray")),(0,r.kt)("li",{parentName:"ul"},"use the ",(0,r.kt)("inlineCode",{parentName:"li"},"MultipartArray")," features to generate fully multipart objects that are ready to be sent as response payloads. ")),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"MultipartArray")," dsl allows defining its inner parts in several ways. The most common way is to list out the structure of each of the expected parts. And this can be done, with the ",(0,r.kt)("inlineCode",{parentName:"p"},"part")," DSL, which explicitly the structure each of the parts will have. This can be done for each explicit part name, or it can be done in groups, as defined by a regexp on the name. The name regexp method allows to define the same structure for multiple parts that match the same name regexp (very useful when you might be receiving an unknown list of related parts for which you cannot know the name in advance)."),(0,r.kt)("p",null,"It is common for multipart bodies to contain parts that are to be treated as files. For that you can annotate a part with ",(0,r.kt)("inlineCode",{parentName:"p"},"filename: true")," or simply use the ",(0,r.kt)("inlineCode",{parentName:"p"},"file")," DSL instead (they are equivalent)."),(0,r.kt)("p",null,"Defining each type follows the rules of any other attribute definition you're used to crafting in any Media Type or action payload/parameter definition. Therefore it accepts common options like ",(0,r.kt)("inlineCode",{parentName:"p"},":description")," or ",(0,r.kt)("inlineCode",{parentName:"p"},":required"),", ",(0,r.kt)("inlineCode",{parentName:"p"},":default")," etc...Like any other attribute, the type of a part can be any ",(0,r.kt)("inlineCode",{parentName:"p"},"Attributor")," type. This means you can define a part to be a simple ",(0,r.kt)("inlineCode",{parentName:"p"},"String")," (maybe even with some expected regexp check), a ",(0,r.kt)("inlineCode",{parentName:"p"},"Struct"),", a ",(0,r.kt)("inlineCode",{parentName:"p"},"Hash")," or any other type that you are used to having."),(0,r.kt)("p",null,"Here's a made up example of a large multipart payload that showcases different ways to use the DSL:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ruby"},"class NamedPartsExample < Praxis::Types::MultipartArray\n  # a simple part named \"title\" with default payload type (i.e., a String)\n  part 'title'\n  # a part named \"uri\" with a URI payload\n  part 'uri', URI\n  # a part named \"contents\" \n  part 'contents' do\n    # that should have a Content-Type header of \"application/json\"\n    header 'Content-Type', 'application/json'\n    # and be loadable as a Hash\n    payload Hash\n  end\n  # zero or more parts with names ending in \"_at\" must contain DateTimes payloads\n  part /_at$/, DateTime\n  # a summary part, which is required\n  part 'summary', String, required: true\n  # zero or more parts whose name matches /nam/, with String payloads that must match Bob\n  part(/nam/, String, regexp: /Bob/i)\n  # zero or more parts whose name matches /stuff/ that contain objects loadable as Hashes\n  part /stuff/ do\n    payload Hash\n  end\n  # potentially multiple parts named 'files', each of which are expected to have \n  # contain an octet-stream, a filename (matching /file/) and loaded as a tempfile\n  file 'files', multiple: true do\n    header 'Content-Type', 'application/octet-stream'\n    filename String, regexp: /file/\n    payload Attributor::Tempfile\n  end\n  # a thumbnail part with a filename attribute, which will be loaded as a tempfile\n  file 'thumbnail', Attributor::Tempfile\n  # an part named image with a filename attribute, which will be loaded as a tempfile\n  part 'image', Attributor::Tempfile, filename: true\nend\n")),(0,r.kt)("p",null,"So in general you can use the following features when defining ",(0,r.kt)("inlineCode",{parentName:"p"},"MultipartArray"),"s:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"part <STRING>")," is the DSL to define the structure of a part by explicit name"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"part <REGEXP>")," is the DSL to define the structure of any part whose name matches the regexp"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"file <STRING>|<REGEXP>")," is an alias to ",(0,r.kt)("inlineCode",{parentName:"li"},"part")," which explicitly adds the ",(0,r.kt)("inlineCode",{parentName:"li"},"filename: true")," option.")),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"part")," (or ",(0,r.kt)("inlineCode",{parentName:"p"},"file"),") DSL, accepts multiple options. In particular:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"required")," if true, the loading and validation will fail if that part isn't provided"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"multiple")," if true, it will allow collecting multiple parts with the same exact name. When this option is set the corresponding part becomes an array.")),(0,r.kt)("p",null,"The type of the payload of a part is defined by providing a block. Each of the underlying part structures will be backed by the ",(0,r.kt)("inlineCode",{parentName:"p"},"MultipartPart"),"-derived class. This block can define the following expected characteristics for the part structure:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"header"),": defines an expectation for that part to have a header matching the name, and possibly a regexp  (syntax is the same as defining a String attribute). Note you can define multiple headers by adding muliple lines."),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"filename"),": define an expectation on the filename attribute of the part (syntax is the same as defining a String attribute)"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"payload"),": define the expected type of the payload (syntax is the same as defining any attribute in a mediatype or payload)")),(0,r.kt)("p",null,"NOTE: For simple type payloads with no other expectations, you can use a type directly as the first parameter on the ",(0,r.kt)("inlineCode",{parentName:"p"},"part"),", and skip any further block definition. Look at some examples above (i.e., the ",(0,r.kt)("inlineCode",{parentName:"p"},"uri")," or ",(0,r.kt)("inlineCode",{parentName:"p"},"title")," parts)."),(0,r.kt)("p",null,"While uncommon, it is also possible to define a multipart payload in a much more fuzzy manner. This can be achieved by not using the ",(0,r.kt)("inlineCode",{parentName:"p"},"part")," or ",(0,r.kt)("inlineCode",{parentName:"p"},"file")," DSL at all, but simply using ",(0,r.kt)("inlineCode",{parentName:"p"},"name_type")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"payload_type")," as a way to define multipart content where all parts are identical in payload structure. It is probably not very common at all to go this route, as dynamic parts can be probably be more clearly defined using the ",(0,r.kt)("inlineCode",{parentName:"p"},"part")," DSL with a name regex. But just for completeness, here is an example of how to use these methods to define that all part names are of type ",(0,r.kt)("inlineCode",{parentName:"p"},"String")," and all the part payloads are of type ",(0,r.kt)("inlineCode",{parentName:"p"},"Hash"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ruby"},"class SimpleExample < Praxis::Types::MultipartArray\n  name_type String\n  payload_type Hash\nend\n")),(0,r.kt)("p",null,"Using ",(0,r.kt)("inlineCode",{parentName:"p"},"String")," as the type name means that Praxis will not perform any validation or coercion on part names. Also\nboth ",(0,r.kt)("inlineCode",{parentName:"p"},"name_type")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"payload_type "),"are optional and not specifying one is equivalent to using the ",(0,r.kt)("inlineCode",{parentName:"p"},"String")," type."),(0,r.kt)("p",null,"Here is a more less convoluted example of defining a multipart type that defines several\nparts in different ways:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ruby"},"class ImageUpload < Praxis::Types::MultipartArray\n\n  # Image author, loaded (and validated) as pre-defined Author type  \n  part 'author', Author, \n    required: true, \n    description: 'Authorship information'  \n  \n  # Set of tags, as strings. May be specified more than once.\n  part 'tags', String,\n    multiple: true, \n    description: 'Category name. May be given multiple times'\n\n  # Any part whose name ends in '_at' should be a DateTime\n  part /_at$/, description: 'Timestamp information for the set of files' do\n    payload DateTime\n  end\n\n  # The parser will save uploaded file as a Ruby Tempfile.\n  # Note: This maps to the Attributor::Tempfile type.\n  part 'image', Tempfile, \n    required: true,\n    filename: true, \n    description: 'Image to upload'\n\n  # Ensure the incoming thumbnail is a jpeg with proper filename'\n  file 'thumbnail', description: 'Image thumbnail, must be jpeg' do\n    header 'Content-Type', 'image/jpeg'\n    payload Attributor::Tempfile\n    filename values: ['thumb.jpg']\n  end\n\nend\n")),(0,r.kt)("h2",{id:"returning-multipart-responses"},"Returning Multipart Responses"),(0,r.kt)("p",null,"In the same way that we have support for designing incoming multipart payloads for our actions, Praxis also allows you to define multipart payloads of responses of your actions."),(0,r.kt)("p",null,"To do so, you can take advantage of the ",(0,r.kt)("inlineCode",{parentName:"p"},":multipart_ok")," response template. As we previously said, this is a simple template wrapper for a ",(0,r.kt)("inlineCode",{parentName:"p"},"200 Ok")," response, but that defines a ",(0,r.kt)("inlineCode",{parentName:"p"},"MultipartArray")," as its default mediatype type."),(0,r.kt)("p",null,"With that defined, you can any action can use a ",(0,r.kt)("inlineCode",{parentName:"p"},"response :multipart_ok ...")," by:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"directly passing an already ",(0,r.kt)("inlineCode",{parentName:"li"},"MultipartArray"),"-derived type to it. "),(0,r.kt)("li",{parentName:"ul"},"or by passing the generic type, and fully defining one inline with a block.")),(0,r.kt)("p",null,"Here's how you could reuse an already defined type (i.e., our ",(0,r.kt)("inlineCode",{parentName:"p"},"ImageUpload")," type above) for it:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ruby"},"response :multipart_ok, ImageUpload\n")),(0,r.kt)("p",null,"And here's how you'd define the multipart type inline:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ruby"},"response :multipart_ok, Praxis::Types::MultipartArray do\n  part 'name', String\n  part 'timestamps' do\n    attribute 'created_at', DateTime\n    attribute 'updated_at', DateTime\n  end\n  part 'address', Address\nend\n")))}m.isMDXComponent=!0}}]);