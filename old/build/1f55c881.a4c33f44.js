(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{133:function(e,n,t){"use strict";t.d(n,"a",(function(){return b})),t.d(n,"b",(function(){return m}));var i=t(0),a=t.n(i);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,i,a=function(e,n){if(null==e)return{};var t,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)t=r[i],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)t=r[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var p=a.a.createContext({}),c=function(e){var n=a.a.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},b=function(e){var n=c(e.components);return a.a.createElement(p.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.a.createElement(a.a.Fragment,{},n)}},u=a.a.forwardRef((function(e,n){var t=e.components,i=e.mdxType,r=e.originalType,o=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),b=c(t),u=i,m=b["".concat(o,".").concat(u)]||b[u]||d[u]||r;return t?a.a.createElement(m,s(s({ref:n},p),{},{components:t})):a.a.createElement(m,s({ref:n},p))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var r=t.length,o=new Array(r);o[0]=u;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var p=2;p<r;p++)o[p]=t[p];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,t)}u.displayName="MDXCreateElement"},74:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return o})),t.d(n,"metadata",(function(){return s})),t.d(n,"toc",(function(){return l})),t.d(n,"default",(function(){return c}));var i=t(3),a=t(7),r=(t(0),t(133)),o={title:"General API Definitions"},s={unversionedId:"reference/design/api-definition",id:"reference/design/api-definition",isDocsHomePage:!1,title:"General API Definitions",description:"There are certain things in an API that are common across all or many endpoints and actions. Praxis' ApiDefinition class is a singleton that allows you do exactly that",source:"@site/docs/reference/design/api-definition.md",slug:"/reference/design/api-definition",permalink:"/docs/reference/design/api-definition",version:"current",sidebar:"mainSidebar",previous:{title:"Actions",permalink:"/docs/reference/design/actions"},next:{title:"Responses",permalink:"/docs/reference/design/response-definitions"}},l=[{value:"Global Information",id:"global-information",children:[]},{value:"Path-Based Versioning",id:"path-based-versioning",children:[]}],p={toc:l};function c(e){var n=e.components,t=Object(a.a)(e,["components"]);return Object(r.b)("wrapper",Object(i.a)({},p,t,{components:n,mdxType:"MDXLayout"}),Object(r.b)("p",null,"There are certain things in an API that are common across all or many endpoints and actions. Praxis' ",Object(r.b)("inlineCode",{parentName:"p"},"ApiDefinition")," class is a singleton that allows you do exactly that: i.e., to define reusable API-wide constructs. In particular you can define:"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},"API Information: Global, or versioned, metadata about the api (see ",Object(r.b)("a",Object(i.a)({parentName:"li"},{href:"#global-information"}),"API Information"),")."),Object(r.b)("li",{parentName:"ul"},"Response Definitions: Reusable response templates (see ",Object(r.b)("a",Object(i.a)({parentName:"li"},{href:"../response-definitions/"}),"Response Definitions"),")"),Object(r.b)("li",{parentName:"ul"},"Traits: A convenient way to share common DSL elements across resource definitions and actions (see ",Object(r.b)("a",Object(i.a)({parentName:"li"},{href:"../traits/"}),"traits"),").")),Object(r.b)("p",null,"Below is a basic ApiDefinition that defines a response template, general info, and a trait:"),Object(r.b)("pre",null,Object(r.b)("code",Object(i.a)({parentName:"pre"},{className:"language-ruby"}),"Praxis::ApiDefinition.define\n  info do\n    name 'Some App'\n    title 'An example Praxis application'\n    description 'A simple application meant for testing purposes'\n    base_path '/'\n  end\n\n  info '1.0' do\n    base_path '/v1'\n  end\n\n  response_template :other_response do\n    status 200\n  end\n\n  trait :authenticated do\n    headers do\n      key \"Auth-Token\", String, required: true\n    end\n  end\nend\n")),Object(r.b)("p",null,Object(r.b)("inlineCode",{parentName:"p"},"Praxis::ApiDefinition")," is a singleton that can be augmented at any point\nduring the bootstrapping process, but it must be before any of your resource definitions\nare loaded. This allows you to refer to the contents of your ApiDefinition from\nyour resource definitions. See ",Object(r.b)("a",Object(i.a)({parentName:"p"},{href:"../bootstrapping/"}),"Bootstrapping")," for more\ninformation on the various bootstrapping stages."),Object(r.b)("h2",{id:"global-information"},"Global Information"),Object(r.b)("p",null,"It is possible to provide global API information in the ",Object(r.b)("inlineCode",{parentName:"p"},"ApiDefinition.define")," block with the ",Object(r.b)("inlineCode",{parentName:"p"},"info")," method. You may define this metadata for all versions of your API, or only for a specific version. All definitions at the global level (i.e. those that do not specify a version) will be inherited by all versions. Any directive defined within a version will overwrite anything inherited (except ",Object(r.b)("inlineCode",{parentName:"p"},"base_path")," and ",Object(r.b)("inlineCode",{parentName:"p"},"base_params")," which a version cannot override if they have been set at the default level)."),Object(r.b)("p",null,"There are several attributes that are ",Object(r.b)("em",{parentName:"p"},"only")," allowed at global level:"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"endpoint")," can define your fully qualified API's endpoint. It's used purely for documentation purposes and will not be used in any routing or route-generation."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"version_with"),' will define what versioning "scheme" your application will use. By default it\'s set to ',Object(r.b)("inlineCode",{parentName:"li"},"[:header, :params]"),", meaning Praxis will look for either an  ",Object(r.b)("inlineCode",{parentName:"li"},"X-Api-Version")," request header ",Object(r.b)("em",{parentName:"li"},"or")," an ",Object(r.b)("inlineCode",{parentName:"li"},"api_version")," query parameter to determine the version of your API to use for processing the request. It is also possible to use a path-based versioning scheme by using ",Object(r.b)("inlineCode",{parentName:"li"},"version_with :path"),". See section below for details."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"documentation_url")," is a hint to users where they can find the final version of the API's documentation.")),Object(r.b)("p",null,"The rest of the directives are supported in both the global or version level:"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"name"),": A short name for your API"),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"title"),": A title or tagline."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"description"),": A longer description about the API."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"base_path"),": Root path prepended to ",Object(r.b)("em",{parentName:"li"},"all")," routes."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"base_params"),": Default parameters applied to all actions. Used to define any params specified in ",Object(r.b)("inlineCode",{parentName:"li"},"base_path"),"."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"consumes"),": List of ",Object(r.b)("a",Object(i.a)({parentName:"li"},{href:"../handlers"}),"handlers")," the API accepts from clients (defaults to ",Object(r.b)("inlineCode",{parentName:"li"},"'json', 'x-www-form-urlencoded'"),")."),Object(r.b)("li",{parentName:"ul"},Object(r.b)("inlineCode",{parentName:"li"},"produces"),": List of ",Object(r.b)("a",Object(i.a)({parentName:"li"},{href:"../handlers"}),"handlers")," the API may use to generate responses (defaults to ",Object(r.b)("inlineCode",{parentName:"li"},"'json'"),").")),Object(r.b)("p",null,"It is also possible to dynamically define other simple properties, which will treated in an Opaque way, but properly rendered in the API documentation. For example, one can utilize ",Object(r.b)("inlineCode",{parentName:"p"},"termsOfService")," as one of the allowed OpenAPI fields."),Object(r.b)("p",null,"Below is a basic ApiDefinition that defines global info, as well info for a specific version:"),Object(r.b)("pre",null,Object(r.b)("code",Object(i.a)({parentName:"pre"},{className:"language-ruby"}),"Praxis::ApiDefinition.define\n\n  info do\n    name 'Some App'\n    title 'An example Praxis application'\n    description 'This is an example application API.'\n    endpoint 'api.example.com'\n    documentation_url 'https://docs.example.com/some-app/'\n    termsOfService 'http://somesite.com/tos'\n    consumes 'json', ''x-www-form-urlencoded''\n    produces 'json', 'xml'\n    base_path '/:app_name'\n    base_params do\n      attribute :app_name, String, required: true\n    end\n  end\n\n  info '1.0' do\n    base_path '/v1'\n    # override the global description.\n    description 'The first stable version of of this example API.'\n  end\n\nend\n")),Object(r.b)("p",null,"In this example, the given info for version 1.0 would have a ",Object(r.b)("inlineCode",{parentName:"p"},"description"),' of "The first stable version of of this example API.", while the ',Object(r.b)("inlineCode",{parentName:"p"},"base_path"),' would be "/:app_name/v1".'),Object(r.b)("p",null,"You can use the ",Object(r.b)("inlineCode",{parentName:"p"},"base_path")," and ",Object(r.b)("inlineCode",{parentName:"p"},"base_param"),' directives to define the base routes and their params for re-use across your whole API, or for a specific version. These are applied "before" any prefixes that you specify in your resources and actions, and will ',Object(r.b)("em",{parentName:"p"},"always")," apply, before, and independently, of any ",Object(r.b)("inlineCode",{parentName:"p"},"prefix")," that may be defined."),Object(r.b)("h2",{id:"path-based-versioning"},"Path-Based Versioning"),Object(r.b)("p",null,"If you want to version your API based on request paths, set the ",Object(r.b)("inlineCode",{parentName:"p"},"version_using")," directive to ",Object(r.b)("inlineCode",{parentName:"p"},":path"),", and specify an appropriate ",Object(r.b)("inlineCode",{parentName:"p"},"base_path")," matcher. This ",Object(r.b)("inlineCode",{parentName:"p"},"base_path")," matcher must include an ",Object(r.b)("inlineCode",{parentName:"p"},":api_version")," variable in it (like any other action route) which Praxis will use to extract the exact version string when routing to your resources."),Object(r.b)("p",null,"Below is a basic ApiDefinition that uses path-based versioning, and specifies a ",Object(r.b)("inlineCode",{parentName:"p"},"base_path")," with the ",Object(r.b)("inlineCode",{parentName:"p"},":api_version")," placeholder:"),Object(r.b)("pre",null,Object(r.b)("code",Object(i.a)({parentName:"pre"},{className:"language-ruby"}),"Praxis::ApiDefinition.define\n\n  info do\n    description 'An example an API using path-based versioning'\n    version_using :path\n    base_path '/api/v:api_version'\n  end\n\n  info '1.0' do\n    description 'The first stable version of of this example API.'\n  end\n\nend\n")),Object(r.b)("p",null,"In the above example, Praxis will resolve the ",Object(r.b)("inlineCode",{parentName:"p"},"base_path"),' for any resources in version "1.0" to "/api/v1.0".'))}c.isMDXComponent=!0}}]);