"use strict";(self.webpackChunkpraxis_site=self.webpackChunkpraxis_site||[]).push([[4189],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>g});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},d=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},u="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),u=p(n),m=i,g=u["".concat(s,".").concat(m)]||u[m]||c[m]||o;return n?a.createElement(g,r(r({ref:t},d),{},{components:n})):a.createElement(g,r({ref:t},d))}));function g(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,r=new Array(o);r[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:i,r[1]=l;for(var p=2;p<o;p++)r[p]=n[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},6619:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>r,default:()=>c,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var a=n(7462),i=(n(7294),n(3905));const o={title:"Pagination Plugin"},r=void 0,l={unversionedId:"reference/extensions/pagination-plugin",id:"reference/extensions/pagination-plugin",title:"Pagination Plugin",description:"The PaginationPlugin plugin is a 'meta'-extension that brings in the pagination and ordering extensions.",source:"@site/docs/reference/extensions/pagination-plugin.md",sourceDirName:"reference/extensions",slug:"/reference/extensions/pagination-plugin",permalink:"/docs/reference/extensions/pagination-plugin",draft:!1,tags:[],version:"current",frontMatter:{title:"Pagination Plugin"},sidebar:"mainSidebar",previous:{title:"Mapper Plugin",permalink:"/docs/reference/extensions/mapper-plugin"},next:{title:"Field Selection",permalink:"/docs/reference/extensions/field-selection"}},s={},p=[{value:"Parameter configuration",id:"parameter-configuration",level:2},{value:"Page-based Pagination",id:"page-based-pagination",level:3},{value:"Cursor-based Pagination",id:"cursor-based-pagination",level:3},{value:"Total-Count Header",id:"total-count-header",level:3},{value:"Link Header",id:"link-header",level:3},{value:"TLDR: examples",id:"tldr-examples",level:3},{value:"Ordering",id:"ordering",level:3},{value:"Enabling the Plugin",id:"enabling-the-plugin",level:2},{value:"Global Plugin configuration",id:"global-plugin-configuration",level:2}],d={toc:p},u="wrapper";function c(e){let{components:t,...n}=e;return(0,i.kt)(u,(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"PaginationPlugin")," plugin is a 'meta'-extension that brings in the pagination and ordering extensions."),(0,i.kt)("p",null,"Specifically, this extension builds on top of the ",(0,i.kt)("inlineCode",{parentName:"p"},"MapperPlugin")," extensions, and provides a way to signal the mapper to add sorting and limiting statements to the DB queries."),(0,i.kt)("p",null,"With this plugin, in addition to the mapper features, you can equip your application to:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"accept a powerful language for paginating (i.e., restricting the amount of data returned) and sorting results from your clients"),(0,i.kt)("li",{parentName:"ul"},"apply those specifications into the DB queries (compatible with field selection and filtering)"),(0,i.kt)("li",{parentName:"ul"},"reflect the pagination and sorting requirements into the rendered results")),(0,i.kt)("p",null,"Neat uh?"),(0,i.kt)("p",null,"There is really only one thing you need to do to enable all this functionality in your app. Simply define the ",(0,i.kt)("inlineCode",{parentName:"p"},"pagination")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"order")," parameters in the right endpoint actions where you want to provide this functionality. Here's an example of the parameter types for an action that returns lists of ",(0,i.kt)("inlineCode",{parentName:"p"},"Post")," media types. In particular, this allows you to use cursor-based pagination on ",(0,i.kt)("inlineCode",{parentName:"p"},"id")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"title")," fields, and to control order in which the results are returned:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ruby"},"  params do\n    attribute :pagination, Praxis::Types::PaginationParams.for(MediaTypes::Post) do\n      by_fields :id, :title\n    end\n    attribute :order, Praxis::Extensions::Pagination::OrderingParams.for(MediaTypes::Post)\n  end\n")),(0,i.kt)("p",null,"That's it! Nothing else needs to be done. Your controller will take care of it all when you're using the ",(0,i.kt)("inlineCode",{parentName:"p"},"build_query")," functionality provided by the ",(0,i.kt)("inlineCode",{parentName:"p"},"MapperPlugin"),"."),(0,i.kt)("h2",{id:"parameter-configuration"},"Parameter configuration"),(0,i.kt)("p",null,"Both the ",(0,i.kt)("inlineCode",{parentName:"p"},"PaginationParams")," and the ",(0,i.kt)("inlineCode",{parentName:"p"},"OrderingParams")," parameter types accept configuration. This means not only can you customize how to paginate and sort, but you can also do it on a per parameter and per action basis. Let's take a look at the existing available configurations."),(0,i.kt)("p",null,"The built-in pagination supports two types of collection traversal. What we call ",(0,i.kt)("inlineCode",{parentName:"p"},"page"),"-based vs. ",(0,i.kt)("inlineCode",{parentName:"p"},"cursor"),"-based pagination."),(0,i.kt)("h3",{id:"page-based-pagination"},"Page-based Pagination"),(0,i.kt)("p",null,"Page-based pagination returns part of the collection given a fixed page size and based on the underlying (i.e,. implicit) ordering specification from your datastore. Many relational DBs, for example, return results based on primary key order (i.e., the ",(0,i.kt)("inlineCode",{parentName:"p"},"id")," field). It is possible, however, to use this type of pagination with specific order if you combine it with the ",(0,i.kt)("inlineCode",{parentName:"p"},"order")," parameter."),(0,i.kt)("p",null,'Typically, this type of pagination is associated with the well known "offset/limit" queries and allows you to jump directly to any of the existing pages of the result set. This pagination type is enabled by using the ',(0,i.kt)("inlineCode",{parentName:"p"},"page")," parameter:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"page=<integer>")," indicates which page number to retrieve (based on a given page size)"),(0,i.kt)("li",{parentName:"ul"},"You can explicitly set the size of a page by also passing in ",(0,i.kt)("inlineCode",{parentName:"li"},"items=<integer>"))),(0,i.kt)("p",null,"For example, the following request will return posts 201-250 from the underlying collection (i.e., 5th page of 50 items each)"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"curl 'http://localhost:9292/posts?api_version=1' -G \\\n      --data-urlencode \"pagination=page=5,items=50\"\n")),(0,i.kt)("p",null,"Note that, in addition to URL-encode the whole query string parameter, you need to URL-escape the ",(0,i.kt)("inlineCode",{parentName:"p"},"value")," portion of the pagination param to clearly differentiate from the parameter name. i.e., escaped_value=URLescape(",(0,i.kt)("inlineCode",{parentName:"p"},"page=5,items=50"),"), URLencode(pagination=escaped_value)"),(0,i.kt)("h3",{id:"cursor-based-pagination"},"Cursor-based Pagination"),(0,i.kt)("p",null,"Cursor-based pagination is usually a more deterministic way to traverse an entire collection (independent from DB internals). However, this type of pagination does not allow jumping directly to any page of the collection as it requires you to know the last seen value."),(0,i.kt)("p",null,"This pagination type is enabled by utilizing the ",(0,i.kt)("inlineCode",{parentName:"p"},"by")," parameter:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"by=<field name>")," allows traversal of the collection based on ascending order of that field's values"),(0,i.kt)("li",{parentName:"ul"},"you can also use the ",(0,i.kt)("inlineCode",{parentName:"li"},"from=<field value>"),", as a way to start the collection from values after the given one. The collection returned when no from value is specified is the very first in the result set."),(0,i.kt)("li",{parentName:"ul"},"like in the case of page-based pagination, the page size can be overridden by using ",(0,i.kt)("inlineCode",{parentName:"li"},"items=<integer>"),". There is a ceiling on the value of items you can set, based on the global configured value in the plugin (See ",(0,i.kt)("a",{parentName:"li",href:"#global-plugin-configuration"},"global Plugin's configuration"),")")),(0,i.kt)("p",null,"For example, the following API request will logically sort all users by their ",(0,i.kt)("inlineCode",{parentName:"p"},"email")," address, in ascending order, and return ","[up to]",' 100 users after the one that has an email value of "',(0,i.kt)("a",{parentName:"p",href:"mailto:joe@example.com"},"joe@example.com"),'".'),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"curl 'http://localhost:9292/users?api_version=1' -G \\\n      --data-urlencode \"pagination=by=email,from=joe@example.com,items=100\"\n")),(0,i.kt)("p",null,"Note that there is a dependency between using field-based cursor pagination and the sorting order that one might want for the results returned. In other words, the system will let you know if the use of the ",(0,i.kt)("inlineCode",{parentName:"p"},"by")," clause in this pagination mode is incompatible with the requested sort ",(0,i.kt)("inlineCode",{parentName:"p"},"order")," parameter.\nAlso note that while the system will not prevent one from doing so, cursor-based pagination when using a non-unique field should be avoided. If you do so, it is possible to 'skip over' and miss out on elements in the result sets such that you never know they exist (i.e., the ",(0,i.kt)("inlineCode",{parentName:"p"},"from")," parameter would skip same value elements)."),(0,i.kt)("h3",{id:"total-count-header"},"Total-Count Header"),(0,i.kt)("p",null,"Regardless of the type of pagination used, one can also request to receive the total count of elements existing in the collection (pre-paging) by adding ",(0,i.kt)("inlineCode",{parentName:"p"},"total_count=true")," to the pagination string. When specified, a ",(0,i.kt)("inlineCode",{parentName:"p"},"Total-Count")," header will be returned containing the total number of existing collection items (pre-pagination). Note that this calculation incurs an extra DB query (i.e., a SELECT COUNT(*) on the same predicate), thus it has extra performance implications."),(0,i.kt)("h3",{id:"link-header"},"Link Header"),(0,i.kt)("p",null,"Praxis also will return a ",(0,i.kt)("inlineCode",{parentName:"p"},"Link")," header following rfc5988, where the client can easily find links to navigate the collection in a more agnostic way (i.e., ",(0,i.kt)("inlineCode",{parentName:"p"},"first"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"next"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"prev")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"last")," relations)."),(0,i.kt)("h3",{id:"tldr-examples"},"TLDR: examples"),(0,i.kt)("p",null,"Here are some other types of pagination examples:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"page=2")," Retrieve the second page of elements from the collection (i.e. elements 101-200 since the default page size is 100)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"page=4,items=50"),"\tRetrieve the fourth page of 50 elements from the collection (i.e. elements 151-200)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"by=id")," Retrieve the first set of elements from the collection based on the ascending order of their id field (ie: first 100 elements since the default page size is 100)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"by=name,from=alice"),' Retrieve a page worth of elements from the collection based on the ascending order of their name field, starting at the first value after "alice".'),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"page=1,total_count=true")," Retrieve the first page of elements from the collection (page-based unknown sorting), and include the total count in the Total-Count header.")),(0,i.kt)("p",null,"Note: These example values are presented in the raw syntax, but they will all need to be properly encoded when passed in the query string parameters. For example: ",(0,i.kt)("inlineCode",{parentName:"p"},"pagination=page%3D1%2Ctotal_count%3Dtrue")),(0,i.kt)("h3",{id:"ordering"},"Ordering"),(0,i.kt)("p",null,"Endpoint actions that provide the order parameter allow you to specify the order with which the collection will be presented. Built-in sorting supports a syntax inspired by the JSON-API specification. It allows you to sort by multiple fields to resolve tie-breakers, and each field can be defined with a ",(0,i.kt)("inlineCode",{parentName:"p"},"-")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"+")," sign to indicate descending or ascending order. The lack of sign defaults to ascending order."),(0,i.kt)("p",null,"Here are some handy examples:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"-id"),": Sort by the values of the id field, in descending order"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"name,-start_date,id"),": Sort by name values, then by descending order of start_date, and finally by id")),(0,i.kt)("p",null,"The names of the fields to sort must be valid attributes in the associated media type, or the request will fail with a validation error."),(0,i.kt)("p",null,"You can also restrict which fields you allow to sort by, by using the ",(0,i.kt)("inlineCode",{parentName:"p"},"by_fields")," definition when you're declaring the ",(0,i.kt)("inlineCode",{parentName:"p"},"OrderingParams")," parameter. Here's how to do it if you want to only allow sorting by ",(0,i.kt)("inlineCode",{parentName:"p"},"id")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"name")," for your users:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ruby"},"  attribute :order, Praxis::Extensions::Pagination::OrderingParams.for(MediaTypes::Post) do\n    by_fields :id, :name\n  end\n")),(0,i.kt)("p",null,"Restricting the allowed fields is a common practice as allowing to sort by arbitrary fields might also have performance implications if the underlying datastore does not have indices for them."),(0,i.kt)("p",null,"It is very nice to provide nested sorting capabilities to the API clients (i.e., sort by name first, then by email, then by...) even though some of these properties clearly will not be indexed by the datastore. On the other hand, the first component of that sort clause can clearly have a performance penalty when not indexed. To provide more flexibility, and allow both more index control, yet deep nested sorts, we provide a configuration option that can ensure that either all sorting components belong to the allowed ",(0,i.kt)("inlineCode",{parentName:"p"},"by_fields")," list, or that only the first one needs to belong to it. To configure that use the ",(0,i.kt)("inlineCode",{parentName:"p"},"enforce_for")," stanza. By default only the first component of the sort clause needs to match one of the ",(0,i.kt)("inlineCode",{parentName:"p"},"by_fields")," if specified."),(0,i.kt)("p",null,"For instance, with the ",(0,i.kt)("inlineCode",{parentName:"p"},"by_fields :id, :name")," example above, the client can properly sort using things like ",(0,i.kt)("inlineCode",{parentName:"p"},"id,email, other"),", or ",(0,i.kt)("inlineCode",{parentName:"p"},"name,id,other")," cause it is only enforcing that the first component is either ",(0,i.kt)("inlineCode",{parentName:"p"},"id")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"name")," (default of ",(0,i.kt)("inlineCode",{parentName:"p"},"enforce_for :first"),")."),(0,i.kt)("p",null,"If we wanted to restrict that even more we change the parameter definition like this:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ruby"},"  attribute :order, Praxis::Extensions::Pagination::OrderingParams.for(MediaTypes::Post) do\n    by_fields :id, :name\n    enforce_for :all\n  end\n")),(0,i.kt)("p",null,'in which case "all" of the order fields would have to be in the ',(0,i.kt)("inlineCode",{parentName:"p"},"id")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"name")," set. That means ",(0,i.kt)("inlineCode",{parentName:"p"},"id,name")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"name,id")," will succeed, but even things like ",(0,i.kt)("inlineCode",{parentName:"p"},"id,created_at")," would not."),(0,i.kt)("h2",{id:"enabling-the-plugin"},"Enabling the Plugin"),(0,i.kt)("p",null,"In order to be able to use the ",(0,i.kt)("inlineCode",{parentName:"p"},"PaginationParams")," and the ",(0,i.kt)("inlineCode",{parentName:"p"},"OrderingParams"),", you need to enable this plugin. You can do so by simply requiring its file and tell Praxis to use it within a ",(0,i.kt)("inlineCode",{parentName:"p"},"configure")," block. For example, adding these pieces in the ",(0,i.kt)("inlineCode",{parentName:"p"},"config/environment.rb")," file:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ruby"},"require 'praxis/plugins/pagination_plugin'\n\nPraxis::Application.configure do |application|\n  # Use the Mapper plugin\n  application.bootloader.use Praxis::Plugins::PaginationPlugin, **{\n    max_items: 500,  # Unlimited by default\n    ...\n  }\n")),(0,i.kt)("p",null,"This plugin also supports a good amount of global options and therefore it is fairly configurable. The default configuration, however, would probably suit most applications."),(0,i.kt)("h2",{id:"global-plugin-configuration"},"Global Plugin configuration"),(0,i.kt)("p",null,"Here are the list of globally configurable defaults"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"max_items"),": The maximum number of results that a paginated response will ever allow. Unlimited by default,"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"default_page_size"),": The default page size to use when no ",(0,i.kt)("inlineCode",{parentName:"li"},"items")," is specified. 100 by default."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"disallow_paging_by_default"),": Disallows the use of the page type pagination mode when true (i.e., using 'page=' parameter, Defaults to false."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"disallow_cursor_by_default"),": Disallows the use of the cursor type pagination mode when true (i.e., using 'by=' or 'from=' parameter). Defaults to false."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"paging_default_mode"),": The default mode params hash to use. Defaults to  { page: 1 }"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"sorting"),": Weather or not to enforce that ",(0,i.kt)("em",{parentName:"li"},"all")," requested sort fields must be of the ",(0,i.kt)("inlineCode",{parentName:"li"},"by_fields")," attributes. Defaults to { enforce_all_fields: false }, which means only the first attribute must meet the requirement")),(0,i.kt)("p",null,"And here's an example of how to configure all of the default values for the plugin when registering it:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ruby"},"Praxis::Application.configure do |application|\n  application.bootloader.use Praxis::Plugins::PaginationPlugin, {\n    max_items: 3000,\n    default_page_size: 200,\n    disallow_paging_by_default: false\n    disallow_cursor_by_default: true\n    paging_default_mode: {by: :id}\n    sorting: {\n      enforce_all_fields: true\n    }\n  end\nend\n")),(0,i.kt)("p",null,"Like any other plugin, you can also choose to configure the exact same parameters through ",(0,i.kt)("inlineCode",{parentName:"p"},"config.pagination")," hash:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ruby"},"Praxis::Application.configure do |application|\n\n  application.config.pagination.max_items = 3000\n  application.config.pagination.default_page_size = 3000\n  ...\nend\n")))}c.isMDXComponent=!0}}]);