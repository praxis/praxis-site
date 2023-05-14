(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{133:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return b}));var a=n(0),i=n.n(a);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=i.a.createContext({}),c=function(e){var t=i.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},d=function(e){var t=c(e.components);return i.a.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},h=i.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,r=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(n),h=a,b=d["".concat(r,".").concat(h)]||d[h]||u[h]||o;return n?i.a.createElement(b,l(l({ref:t},p),{},{components:n})):i.a.createElement(b,l({ref:t},p))}));function b(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,r=new Array(o);r[0]=h;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,r[1]=l;for(var p=2;p<o;p++)r[p]=n[p];return i.a.createElement.apply(null,r)}return i.a.createElement.apply(null,n)}h.displayName="MDXCreateElement"},78:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return r})),n.d(t,"metadata",(function(){return l})),n.d(t,"toc",(function(){return s})),n.d(t,"default",(function(){return c}));var a=n(3),i=n(7),o=(n(0),n(133)),r={title:"Implementing Reads",sidebar_label:"Implementing Reads"},l={unversionedId:"gettingStarted/implementingReads",id:"gettingStarted/implementingReads",isDocsHomePage:!1,title:"Implementing Reads",description:"So here we are. We have designed our new API endpoints by specifying which actions we want to expose and the shapes of our Posts and Comments. We have also taken care of creating our DB structure and filling in some data to play with. Now it is time to actually implement some code that allows us to query for these resources.",source:"@site/docs/gettingStarted/implementingReads.md",slug:"/gettingStarted/implementingReads",permalink:"/docs/gettingStarted/implementingReads",version:"current",sidebar_label:"Implementing Reads",sidebar:"mainSidebar",previous:{title:"Setting Up Our Database",permalink:"/docs/gettingStarted/settingUpOurDB"},next:{title:"Building CRUD",permalink:"/docs/gettingStarted/buildingCRUD"}},s=[{value:"Implementing index and show actions",id:"implementing-index-and-show-actions",children:[]},{value:"Building Filtering capabilities",id:"building-filtering-capabilities",children:[]}],p={toc:s};function c(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"So here we are. We have designed our new API endpoints by specifying which actions we want to expose and the shapes of our Posts and Comments. We have also taken care of creating our DB structure and filling in some data to play with. Now it is time to actually implement some code that allows us to query for these resources."),Object(o.b)("h2",{id:"implementing-index-and-show-actions"},"Implementing index and show actions"),Object(o.b)("p",null,"The ",Object(o.b)("inlineCode",{parentName:"p"},"index")," and ",Object(o.b)("inlineCode",{parentName:"p"},"show")," actions (that search the collection and show a single element or multiple elements) are 100% implemented in the generated scaffolding code. Not only that, but they also support field selection (similarly to GraphQL), ordering, and pagination. Done and done. Don't quite believe it? Let's take our API for a spin shall we? Let's first start our app by:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-shell"}),"bundle exec rackup\n")),Object(o.b)("p",null,"And now we're ready to throw some queries at it. Here are some examples you can start trying from another terminal:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-shell"}),'# Get all posts, but only include:\n#  -- id, contents and author (with only the author\'s first_name)\ncurl \'http://localhost:9292/posts?api_version=1\' -G \\\n      --data-urlencode "fields=id,content,author{first_name}"\n\n# Retrieve the comment with id 1, but only include:\n#  -- id, contents, related post (only id) and related user (only first_name)\ncurl \'http://localhost:9292/comments/1?api_version=1\' -G \\\n  --data-urlencode "fields=id,content,post{id},user{first_name}"\n\n# Retrieve the second page of users with a page size of 5, ordered by uuid first and then last_name\n#  -- display only their id, email and first_name\ncurl \'http://localhost:9292/users?api_version=1\' -G \\\n    --data-urlencode "fields=id,email,first_name" \\\n    --data-urlencode "order=uuid,last_name" \\\n    --data-urlencode "pagination=page=2,items=5"\n')),Object(o.b)("p",null,"And there you go! you have a fully functioning API that is able to query items from a real DB, with support for GraphQL-style field selection, embeddable nested resources, pagination, and ordering. You're more than welcome to enable SQL logging and see how efficient the queries are... Not too shabby having all this functionality without having written a single line of controller or ORM code! (To enable logging the easiest is to add ",Object(o.b)("inlineCode",{parentName:"p"},"ActiveRecord::Base.logger = Logger.new(STDOUT)")," towards the end of ",Object(o.b)("inlineCode",{parentName:"p"},"config.ru"),")"),Object(o.b)("p",null,"Did this leave you thirsty for more? Ok, challenge accepted, let's go for extra credit by showing you how you can trivially enable powerful query filtering on top of this."),Object(o.b)("h2",{id:"building-filtering-capabilities"},"Building Filtering capabilities"),Object(o.b)("p",null,"So to build filters with which to query elements in the ",Object(o.b)("inlineCode",{parentName:"p"},"index")," action we need to do a couple of things:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"Enable the ",Object(o.b)("inlineCode",{parentName:"li"},"filters")," parameter in the API endpoint, and specify which attributes we're allowed to filter by."),Object(o.b)("li",{parentName:"ul"},"Tell Praxis how each of the API filters map into which underlying resource or model properties.")),Object(o.b)("p",null,"Let's get started."),Object(o.b)("p",null,"Luckily, since we've generated the endpoint using the Praxis generator, we already have en example of how to define the ",Object(o.b)("inlineCode",{parentName:"p"},"filters")," attribute. We can just uncomment those lines and then list the attributes we want to allow for filtering. The ",Object(o.b)("inlineCode",{parentName:"p"},"Post")," MediaType has an ",Object(o.b)("inlineCode",{parentName:"p"},"id"),", ",Object(o.b)("inlineCode",{parentName:"p"},"title"),", ",Object(o.b)("inlineCode",{parentName:"p"},"content")," and an ",Object(o.b)("inlineCode",{parentName:"p"},"author"),". You could, for example, allow filtering by ",Object(o.b)("inlineCode",{parentName:"p"},"title")," (allowing wildcards), and then by author's ",Object(o.b)("inlineCode",{parentName:"p"},"email")," or ",Object(o.b)("inlineCode",{parentName:"p"},"id"),". In these cases we'll only enable the ",Object(o.b)("inlineCode",{parentName:"p"},"=")," and ",Object(o.b)("inlineCode",{parentName:"p"},"!=")," operators, but there are many others that are supported. To do so, we need to replace the already existing (commented out due to scaffolding) ",Object(o.b)("inlineCode",{parentName:"p"},"filters")," parameter in the ",Object(o.b)("inlineCode",{parentName:"p"},"design/v1/endpoints/posts.rb")," file with the following:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),"    attribute :filters, Praxis::Types::FilteringParams.for(MediaTypes::Post) do\n       filter 'title', using: ['=', '!='], fuzzy: true\n       filter 'author.email', using: ['=', '!=']\n       filter 'author.id', using: ['=', '!=']\n    end\n")),Object(o.b)("p",null,"And now that the endpoint is ready to accept and validate that new parameter, we simply need to inform the associated Resource object about how to map these API-level attribute names into ORM-level models and associations. To do so, we simply need to fill it in the ",Object(o.b)("inlineCode",{parentName:"p"},"filters_mapping")," function in the ",Object(o.b)("inlineCode",{parentName:"p"},"Post")," resource (in ",Object(o.b)("inlineCode",{parentName:"p"},"app/v1/resources/post.rb"),"). In this case, we've designed the DB fields to match those in the API. However, other APIs may have to deal with already existing DBs and ORMs that might not perfectly match the API you wish to expose, and so the mappings might look a little more purposeful. But anyway, for our ",Object(o.b)("inlineCode",{parentName:"p"},"title")," filter, the mapping is the same as that's exactly the same method in the underlying ",Object(o.b)("inlineCode",{parentName:"p"},"Post")," model. For our ",Object(o.b)("inlineCode",{parentName:"p"},"author.email")," filter, we don't need to remap anything either, as the ",Object(o.b)("inlineCode",{parentName:"p"},"author")," relationship is called the same in the model, and once we're in the ",Object(o.b)("inlineCode",{parentName:"p"},"User")," model there is an ",Object(o.b)("inlineCode",{parentName:"p"},"email")," attribute as well. For ",Object(o.b)("inlineCode",{parentName:"p"},"author.id")," we could simply do the same as they map properly to the underlying ORM world, but for demonstration purposes, we can also show that we can map it to the ",Object(o.b)("inlineCode",{parentName:"p"},"author_id")," attribute of the ",Object(o.b)("inlineCode",{parentName:"p"},"Post")," model itself (that way we don't even need to pay the price of an inner join with users). Anyway, all of this simply means that you'll need to delete the commented out scaffolding of the ",Object(o.b)("inlineCode",{parentName:"p"},"filters_mapping")," in the ",Object(o.b)("inlineCode",{parentName:"p"},"Post")," resource (",Object(o.b)("inlineCode",{parentName:"p"},"app/v1/resources/post.rb"),"), and paste this instead:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),"  filters_mapping(\n    'title': 'title',\n    'author.email': 'author.email',\n    'author.id': 'author_id',\n  )\n")),Object(o.b)("p",null,"We can similarly do the same thing for ",Object(o.b)("inlineCode",{parentName:"p"},"Comments"),". For example, we can allow filtering of comments by ",Object(o.b)("inlineCode",{parentName:"p"},"post.id")," and ",Object(o.b)("inlineCode",{parentName:"p"},"user.id")," so we can easily list comments for specific posts and/or made by certain users. We're leaving this as an exercise for the reader ;)."),Object(o.b)("p",null,"So, that's essentially it. What!? There is still no need to build any controller or ORM queries? Nope, that's the power of following the best practices and adding the extensions. Let's give it a whirl!"),Object(o.b)("p",null,"First let's make sure we start (or restart) the API server with ",Object(o.b)("inlineCode",{parentName:"p"},"bundle exec rackup"),". Then, from another terminal, let's get all ",Object(o.b)("inlineCode",{parentName:"p"},"posts")," that were written by ",Object(o.b)("inlineCode",{parentName:"p"},"peter@pan.com")," (We know there are some with this email in our seeds):"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-shell"}),'# Get all posts written by an author with email=peter@pan.com:\n#  -- id, contents and author (with only first_name)\ncurl \'http://localhost:9292/posts?api_version=1\' -G \\\n      --data-urlencode "filters=author.email=peter@pan.com" \\\n      --data-urlencode "fields=id,title,content,author{first_name}"\n')),Object(o.b)("p",null,"Or we can combine multiple filters at once. For example, let's get posts that contain the word ",Object(o.b)("inlineCode",{parentName:"p"},"first")," in the ",Object(o.b)("inlineCode",{parentName:"p"},"title")," AND that have been written by authors with ",Object(o.b)("inlineCode",{parentName:"p"},"id")," 11 OR 12 (which we know they are Peter and Alice, from the seeds)."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-shell"}),'# Get all posts that contain `first` in the title, written by an author with id 11 or 12:\n#  -- id, contents and author (with only first_name)\ncurl \'http://localhost:9292/posts?api_version=1\' -G \\\n      --data-urlencode "filters=title=*first*&author.id=11,12" \\\n      --data-urlencode "fields=id,title,content,author{first_name}"\n')),Object(o.b)("p",null,"And there you go. Notice two things here: one is that multiple filters are separated by an ",Object(o.b)("inlineCode",{parentName:"p"},"&"),", and also equality filters support an array of values, separated by commas (",Object(o.b)("inlineCode",{parentName:"p"},"author.id=11,12"),") which will translate into something like ",Object(o.b)("inlineCode",{parentName:"p"},"...WHERE authod_id IN (11,12)..."),". Also, this is just the tip of the iceberg with what you can do with filters, suffice to say that it supports AND, OR with the right precedence, including grouping sub-clauses with parenthesis. It also supports all kinds of operators including equality, inequality, greater/smaller, NULL, not NULL and even fuzzy (prefix/suffix) regexp. Pretty powerful for being something that requires no coding whatsoever."),Object(o.b)("p",null,"Well, at this point we have built a fully featured read-only API that allows us to retrieve users, posts, and comments; which supports field selection (including nested relationships); which can paginate and sort; and which supports all a wide range of filtering. All of it, without writing a single line of controller code or any explicit ORM queries. Talk about development efficiency!"),Object(o.b)("p",null,"The next logical step you might be thinking of is: what about the CRUD operations? I'm glad you asked, let's dig in."))}c.isMDXComponent=!0}}]);