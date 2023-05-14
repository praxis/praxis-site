(window.webpackJsonp=window.webpackJsonp||[]).push([[48],{115:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return r})),n.d(t,"metadata",(function(){return s})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return c}));var a=n(3),o=n(7),i=(n(0),n(133)),r={title:"Building CRUD",sidebar_label:"Building CRUD"},s={unversionedId:"gettingStarted/buildingCRUD",id:"gettingStarted/buildingCRUD",isDocsHomePage:!1,title:"Building CRUD",description:"The way that people build CRUD operations often varies more than read-only operations like index and show. However, Praxis still brings in many best practices (and helper tools) that you can decide to follow. You can also decide not to follow these practices and implement your controller code however you see fit otherwise. That's one of the main goals of Praxis: at the core, it provides a solid Web API routing/parameter/controller Rack-based framework you can directly use (i.e., a la Sinatra), but you can easily opt-in to as many other extensions and best practices as you want (and you can even do it on a controller by controller basis, etc.)",source:"@site/docs/gettingStarted/buildingCRUD.md",slug:"/gettingStarted/buildingCRUD",permalink:"/docs/gettingStarted/buildingCRUD",version:"current",sidebar_label:"Building CRUD",sidebar:"mainSidebar",previous:{title:"Implementing Reads",permalink:"/docs/gettingStarted/implementingReads"},next:{title:"Introduction",permalink:"/docs/reference/intro"}},l=[{value:"Update",id:"update",children:[{value:"Designing Update",id:"designing-update",children:[]},{value:"Implementing Update",id:"implementing-update",children:[]}]},{value:"Create",id:"create",children:[{value:"Designing Create",id:"designing-create",children:[]},{value:"Implementing Create",id:"implementing-create",children:[]}]},{value:"Delete",id:"delete",children:[{value:"Designing Delete",id:"designing-delete",children:[]},{value:"Implementing Delete",id:"implementing-delete",children:[]}]}],d={toc:l};function c(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(a.a)({},d,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"The way that people build CRUD operations often varies more than read-only operations like ",Object(i.b)("inlineCode",{parentName:"p"},"index")," and ",Object(i.b)("inlineCode",{parentName:"p"},"show"),". However, Praxis still brings in many best practices (and helper tools) that you can decide to follow. You can also decide not to follow these practices and implement your controller code however you see fit otherwise. That's one of the main goals of Praxis: at the core, it provides a solid Web API routing/parameter/controller Rack-based framework you can directly use (i.e., a la Sinatra), but you can easily opt-in to as many other extensions and best practices as you want (and you can even do it on a controller by controller basis, etc.)"),Object(i.b)("p",null,"But anyway, we were talking about implementing the CRUD operations weren't we? Let's go through it one by one, first ",Object(i.b)("inlineCode",{parentName:"p"},"update"),", then ",Object(i.b)("inlineCode",{parentName:"p"},"create"),", and finally, ",Object(i.b)("inlineCode",{parentName:"p"},"delete"),"."),Object(i.b)("h2",{id:"update"},"Update"),Object(i.b)("p",null,"Like always, we start by defining the API design of our new action."),Object(i.b)("h3",{id:"designing-update"},"Designing Update"),Object(i.b)("p",null,"For that, let's take a look at the scaffolded code from our generator:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),"  action :update do\n    description 'Update one or more attributes of an existing Post'\n    routing { patch '/:id' }\n    params do\n      attribute :id, required: true\n    end\n    payload reference: MediaTypes::Post do\n      # List the attributes you accept from the one existing in the Post Mediatype\n      # and/or fully define any other ones you allow to change\n      # attribute :name\n    end\n    response :no_content\n    response :bad_request\n  end\n")),Object(i.b)("p",null,"This defines that an update will be done through a ",Object(i.b)("inlineCode",{parentName:"p"},"PATCH")," request to the member url of the posts collection (",Object(i.b)("inlineCode",{parentName:"p"},"/posts/:id"),"), where ",Object(i.b)("inlineCode",{parentName:"p"},":id")," is the given identifier of the post to update. As a response, the client can expect a ",Object(i.b)("inlineCode",{parentName:"p"},"204 No Content")," when successful update or a ",Object(i.b)("inlineCode",{parentName:"p"},"400 Bad Request")," if the request couldn't be completed (which will include information as to why it failed). Looks pretty reasonable so far."),Object(i.b)("p",null,"Notice that query-string parameters are defined separately from body parameters. Query string parameters are defined in the ",Object(i.b)("inlineCode",{parentName:"p"},"params")," block of the design, while request body structure is defined in the ",Object(i.b)("inlineCode",{parentName:"p"},"payload")," block. In this case we will be defining the payload as a simple incoming hash-like structure, but bear in mind that it can be designed to accept arrays, and/or complex multipart bodies, etc."),Object(i.b)("p",null,"The only thing that we need to modify from the scaffold code is the payload, as it contains the attributes we want to allow the client to update. You are obviously free to choose the shape and names of that structure. However, a Praxis best practice is to design incoming payload structures that mimic the rendered corresponding output MediaType (i.e., trying to have INPUTS == OUTPUTS as much as possible). To follow that tenet, we want to accept a payload that has ",Object(i.b)("inlineCode",{parentName:"p"},"title"),", ",Object(i.b)("inlineCode",{parentName:"p"},"contents")," (and potentially an ",Object(i.b)("inlineCode",{parentName:"p"},"author"),"), given that these are the only three existing attributes of a ",Object(i.b)("inlineCode",{parentName:"p"},"Post"),". In this case, however, we won't allow sending an ",Object(i.b)("inlineCode",{parentName:"p"},"author")," attribute as that's something we might want to keep immutable from creation time. So in the most pure Praxis style, here's how the payload would be designed:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),"  payload reference: MediaTypes::Post do\n    attribute :title\n    attribute :content\n  end\n")),Object(i.b)("p",null,"Copy that to the ",Object(i.b)("inlineCode",{parentName:"p"},"update")," action of the ",Object(i.b)("inlineCode",{parentName:"p"},"Post")," endpoint (",Object(i.b)("inlineCode",{parentName:"p"},"design/v1/endpoints/posts.rb"),"). Now, let's take a look at a couple of things in this definition."),Object(i.b)("p",null,"The first thing to notice is that we didn't define types for any of the attributes. What's that all about? Well, the answer lies in the ",Object(i.b)("inlineCode",{parentName:"p"},"reference: MediaTypes::Post")," option passed to ",Object(i.b)("inlineCode",{parentName:"p"},"payload"),". When a payload is given a MediaType reference, any attributes will directly inherit all of their type and options from the attribute with the same name in the MediaType. In this case, ",Object(i.b)("inlineCode",{parentName:"p"},"title")," and ",Object(i.b)("inlineCode",{parentName:"p"},"content")," will both be defined as ",Object(i.b)("inlineCode",{parentName:"p"},"String")," as that's the type they have in the reference ",Object(i.b)("inlineCode",{parentName:"p"},"Post")," MediaType. Good, saved some keystrokes in there."),Object(i.b)("p",null,"Notice that this is already a benefit from following the INPUTS==OUTPUTS paradigm, as it provides you with terser and more readable code, and it can help avoid silly copy and paste mistakes. We can always define any extra payload attribute we want (including its type and options), even if it does not exist in the reference MediaType. In fact, it is also possible to also redefine the type and options of an attribute, even if it exists in the reference MediaType (that's generally a bad practice, though, as it's not intuitive to the client)"),Object(i.b)("p",null,"Another thing to notice from the definition is that none of the attributes are required. That is because this ",Object(i.b)("inlineCode",{parentName:"p"},"update")," action (through the ",Object(i.b)("inlineCode",{parentName:"p"},"PATCH")," HTTP verb) only changes the attributes that are passed in, and leaves the rest untouched. If you wanted an update-type action that can change a member of the collection fully, we recommend the best practice of creating another action using a ",Object(i.b)("inlineCode",{parentName:"p"},"PUT")," verb to the same member url, and call it something like ",Object(i.b)("inlineCode",{parentName:"p"},"replace")," to clearly denote that it will replace ",Object(i.b)("em",{parentName:"p"},"all")," values of the object, including resetting the ones that aren't passed in."),Object(i.b)("p",null,"So all in all, we only needed to add a couple of attributes to the payload. Good times. Also, feel free to fire up the doc browser (",Object(i.b)("inlineCode",{parentName:"p"},"bundle exec praxis docs browser"),") to see how our design turned out, in a more visually appealing way. Let's move to the implementation."),Object(i.b)("h3",{id:"implementing-update"},"Implementing Update"),Object(i.b)("p",null,"So let's now focus our efforts on building the implementation of what we have just designed. In particular we need to be able to update a ",Object(i.b)("inlineCode",{parentName:"p"},"Post")," based on the incoming payload we have defined. The first question is: how much should this controller code do? Let's turn to another important set of Praxis best practices."),Object(i.b)("p",null,"An important suggestion from Praxis is to confine controller code to only deal with HTTP concepts and transformations (request and response params, payload, headers, HTTP codes and errors, and etc.), while specifically avoiding any business logic (application domain logic). There are many reasons for this but the most important ones have to do with separation of concerns, testability and business logic reuse."),Object(i.b)("p",null,"So what Praxis proposes for the ",Object(i.b)("inlineCode",{parentName:"p"},"update")," action of our controller is to simply call an underlying business logic object to update a ",Object(i.b)("inlineCode",{parentName:"p"},"Post"),", commonly using the same action name (i.e., ",Object(i.b)("inlineCode",{parentName:"p"},"update"),") and pass all of the necessary parameters to it. Once that call to the underlying logic is done, then simply return the ",Object(i.b)("inlineCode",{parentName:"p"},"204 No Content"),". Done. Short. Clean. Our controller only deals with HTTP protocol adaptation, with some massaging of the incoming/outgoing structures to and from the business logic objects."),Object(i.b)("p",null,'Ok, so what are these business logic objects then? Well, Praxis calls them "Resources" and are nothing more than pure Ruby classes. Resources are the associated objects that sit in between the Controllers and the Data access, which contain the important business logic of your app. In other words: at the top level Controllers simply deal with HTTP and data structure concerns; at the lowest level Models deal with retrieving and saving data from or to the DB. Resources are reusable components of business logic that sit in the middle and abstract the underlying related models (or other related resources).'),Object(i.b)("p",null,"Alright, so how does that look in the controller code then? Let's take a look at the scaffolded code for the ",Object(i.b)("inlineCode",{parentName:"p"},"update")," action that our generator built for us:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),"  def update(id:)\n    # A good pattern is to call the same name method on the corresponding resource,\n    # passing the incoming id and payload (or massaging it first)\n    updated_resource = Resources::Post.update(\n      id: id,\n      payload: request.payload,\n    )\n    return Praxis::Responses::NotFound.new unless updated_resource\n\n    Praxis::Responses::NoContent.new\n  end\n")),Object(i.b)("p",null,"The first thing to notice is that the ",Object(i.b)("inlineCode",{parentName:"p"},"id")," parameter we defined in our design step is passed in as a keyword argument to the function. It is also accessible through ",Object(i.b)("inlineCode",{parentName:"p"},"request.params.id")," but it is cleaner and more self-documenting to be a required function argument."),Object(i.b)("p",null,"Another thing to notice is that the scaffolded code performs no validation whatsoever on the ",Object(i.b)("inlineCode",{parentName:"p"},"id")," or the ",Object(i.b)("inlineCode",{parentName:"p"},"payload")," elements. That is because a powerful part of building your API design with Praxis is that it will all be automatically validated and coerced before it can even reach your controller method. In other words, if our controller method is executed we can be 100% sure that the ",Object(i.b)("inlineCode",{parentName:"p"},"id")," is an Integer, and any of the passed payload attributes are ",Object(i.b)("inlineCode",{parentName:"p"},"Strings"),", as we have defined them. If there is any discrepancy with types of parameter names, the framework would have detected it and already sent a validation error back to the client detailing exactly what didn't match the API specification."),Object(i.b)("p",null,"The body of the function also follows the best practices we talked about. It calls a class method on the resource of the same name and gives it the necessary information to perform the job. In this case, the ",Object(i.b)("inlineCode",{parentName:"p"},"id")," of the post, and the incoming payload structure. In addition, it also returns a ",Object(i.b)("inlineCode",{parentName:"p"},"404 Not Found")," if the update call yield no resource, but otherwise it will return a ",Object(i.b)("inlineCode",{parentName:"p"},"204 No Content")," to indicate success. Some APIs like to return a ",Object(i.b)("inlineCode",{parentName:"p"},"200 OK")," with the resulting body of the updated resource. While this is perfectly fine and valid, we suggest it is much cleaner (and computationally cheaper) to just signal success without returning any payload, and let the the client decide to read the latest copy of the object in a subsequent request if necessary. This way it can also clearly specify which of the fields (including nested resources) it wants to gather. If we had to return the updated object in an update call, we'd either have to choose what fields to return, or somehow accept a ",Object(i.b)("inlineCode",{parentName:"p"},"fields")," parameter to know what to render. All are perfectly acceptable options, it's more a matter of preference."),Object(i.b)("p",null,"Ok, so nothing for us to change here, that's cool. So let's now look at this ",Object(i.b)("inlineCode",{parentName:"p"},"update")," method of the resource, where the business logic lives:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),"  def self.update(id:, payload:)\n    record = model.find_by(id: id)\n    return nil unless record\n    # Assuming the API field names directly map the the model attributes. Massage if appropriate.\n    record.update(**payload.to_h)\n    self.new(record)\n  end\nend\n")),Object(i.b)("p",null,"Well, it doesn't seem that we need to change anything here either! This scaffolded code is loading the model by ",Object(i.b)("inlineCode",{parentName:"p"},"id")," from the DB and returning ",Object(i.b)("inlineCode",{parentName:"p"},"nil")," to signal it didn't find it if applicable. If found, it simply updates the model attributes with the received values and returns the updated record wrapped in a resource instance. Done. The simplicity of this method is due to the fact that the API attributes have the same name as the ORM model. If they were different, we would probably have to do some extra massaging before invoking the model's update method ."),Object(i.b)("p",null,"So with that, we have finished the implementation for updating Posts. Let's give it a go real quick, by first starting (or restarting) the web API (",Object(i.b)("inlineCode",{parentName:"p"},"bundle exec rackup"),") and sending a PATCH request to change the title and content of ",Object(i.b)("inlineCode",{parentName:"p"},"Post")," with ",Object(i.b)("inlineCode",{parentName:"p"},"id"),"=1:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-shell"}),"curl -XPATCH 'http://localhost:9292/posts/1' \\\n    -H 'X-Api-Version: 1' \\\n    -H 'Content-Type: application/json' \\\n    -d '{ \"title\": \"Changed Title\", \"content\": \"New Content\"}'\n")),Object(i.b)("p",null,"There you go! You can now update posts. Check it out by reading the updated post with something like:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-shell"}),"curl 'http://localhost:9292/posts/1?api_version=1' -G \\\n      --data-urlencode \"fields=id,title,content\"\n")),Object(i.b)("p",null,"Ok, so this implementation for update took a bit of writing and explanation about best practices and options, but really, the scaffolding code did a very good job as we only had to change the payload definition of our ",Object(i.b)("inlineCode",{parentName:"p"},"update")," action! Not bad. Let's look at what happens when we implement ",Object(i.b)("inlineCode",{parentName:"p"},"create"),"."),Object(i.b)("h2",{id:"create"},"Create"),Object(i.b)("p",null,"The ",Object(i.b)("inlineCode",{parentName:"p"},"create")," action has many similarities with the previous ",Object(i.b)("inlineCode",{parentName:"p"},"update")," action. In fact, it could be almost identical. However, we are going to spice it up (for demonstration purposes) by accepting not only a ",Object(i.b)("inlineCode",{parentName:"p"},"title")," and ",Object(i.b)("inlineCode",{parentName:"p"},"content")," for a new post, but also a reference to an existing ",Object(i.b)("inlineCode",{parentName:"p"},"User")," as the author. Let's design the endpoint first."),Object(i.b)("h3",{id:"designing-create"},"Designing Create"),Object(i.b)("p",null,"The first thing to notice is the RESTful design choices that the scaffold generator did for us in the endpoint:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),"  action :create do\n    description 'Create a new Post'\n    routing { post '' }\n    payload reference: MediaTypes::Post do\n      # List the attributes you accept from the one existing in the Post Mediatype\n      # and/or fully define any other ones you allow at creation time\n      # attribute :name\n    end\n    response :created\n    response :bad_request\n  end\n")),Object(i.b)("p",null,"This specifies that creating a post is done through a ",Object(i.b)("inlineCode",{parentName:"p"},"POST")," verb to the collection url (",Object(i.b)("inlineCode",{parentName:"p"},"/posts"),"), and successful creation will return a ",Object(i.b)("inlineCode",{parentName:"p"},"204 Created")," response containing a Location header of the href for the created resource. Otherwise it will respond with a ",Object(i.b)("inlineCode",{parentName:"p"},"400 Bad Request")," if the request couldn't be completed (with the included information as to why not)."),Object(i.b)("p",null,"If we're good with this fairly standard RESTful practice, the only thing that this needs to be completed is to define what payload attributes we want to accept to create a ",Object(i.b)("inlineCode",{parentName:"p"},"Post"),"."),Object(i.b)("p",null,"If we follow the INPUTS==OUTPUT best practices, we want to accept a payload that has a ",Object(i.b)("inlineCode",{parentName:"p"},"title"),", a ",Object(i.b)("inlineCode",{parentName:"p"},"contents")," and an ",Object(i.b)("inlineCode",{parentName:"p"},"author")," (with this attribute also matching a subset of the original ",Object(i.b)("inlineCode",{parentName:"p"},"User")," MediaType). So, in the more pure Praxis style, here's how the payload would be designed:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),"  payload reference: MediaTypes::Post do\n    attribute :title\n    attribute :content\n    attribute :author do\n      attribute :id, required: true\n    end\n    requires.at_least(1).of :title, :content\n    requires.all :author\n  end\n")),Object(i.b)("p",null,"Now, let's take a look at a couple of things from this definition."),Object(i.b)("p",null,"The first one, again, is that we didn't define types for any of the attributes. There's no need since the attribute structure and names match the referenced ",Object(i.b)("inlineCode",{parentName:"p"},"Post")," MediaType. Yay! Again a best practice that can reward you in terseness and avoid mistakes when you follow the INPUTS==OUTPUTS paradigm. Note that any extra payload attribute that we might want to accept can still be fully defined with its type and options."),Object(i.b)("p",null,"The second thing to notice is how we've defined the way to specify the author of the post. Often times you see a payload having an ",Object(i.b)("inlineCode",{parentName:"p"},"author_id")," attribute, but following the INPUTS==OUTPUTS paradigm we want to change that to have an ",Object(i.b)("inlineCode",{parentName:"p"},"author")," struct, with only an ",Object(i.b)("inlineCode",{parentName:"p"},"id")," inside. In the same fashion, we can trivially start accepting other author information like ",Object(i.b)("inlineCode",{parentName:"p"},"email")," or ",Object(i.b)("inlineCode",{parentName:"p"},"uuid")," (even optionally within the ",Object(i.b)("inlineCode",{parentName:"p"},"author")," struct) to connect the ",Object(i.b)("inlineCode",{parentName:"p"},"Post")," to it. It's all about the consistency and the principle of least surprise to your users of the API."),Object(i.b)("p",null,"Finally (and more for demonstration purposes than anything else), we have decided that we can accept a post without a ",Object(i.b)("inlineCode",{parentName:"p"},"title")," or without a ",Object(i.b)("inlineCode",{parentName:"p"},"content"),", but we need at least one of them. The ",Object(i.b)("inlineCode",{parentName:"p"},"author")," however is always required (along with its ",Object(i.b)("inlineCode",{parentName:"p"},"id"),")."),Object(i.b)("p",null,"Let's turn to the implementation now."),Object(i.b)("h3",{id:"implementing-create"},"Implementing Create"),Object(i.b)("p",null,"This is the scaffolded code we find for ",Object(i.b)("inlineCode",{parentName:"p"},"create")," in the controller:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),"  # Creates a new Post\n  def create\n    # A good pattern is to call the same name method on the corresponding resource,\n    # passing the incoming payload, or massaging it first\n    created_resource = Resources::Post.create(request.payload)\n\n    # Respond with a created if it successfully finished\n    Praxis::Responses::Created.new(location: created_resource.href)\n  end\n")),Object(i.b)("p",null,"Umm... well, that looks good enough, doesn't it? Seems we're done with our controller! Let's build the actual business logic, shall we?"),Object(i.b)("p",null,"To do so, let's turn to our scaffolded ",Object(i.b)("inlineCode",{parentName:"p"},"Post")," resource in ",Object(i.b)("inlineCode",{parentName:"p"},"app/v1/resources/post.rb"),". As you can see, for now there is no extra logic other than actually creating a row in the DB and returning an instance of the resource that wraps it:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),"  def self.create(payload)\n    # Assuming the API field names directly map the the model attributes. Massage if appropriate.\n    self.new(model.create(**payload.to_h))\n  end\n")),Object(i.b)("p",null,"This scaffolded code assumes that the payload attributes of the API have the same name as the model attributes. Obviously, with our inclusion of a linked ",Object(i.b)("inlineCode",{parentName:"p"},"author")," id, this is not 100% correct. So in this case, we do need to change the scaffolded implementation to account for that. Not much, though, as we just need to change it to this:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),'  def self.create(payload)\n    author = ::User.find_by(id: payload.author.id)\n    raise "Author with id #{payload.author.id} not found" unless author\n    data = payload.to_h\n    data[:author] = author\n    self.new(model.create(**data))\n  end\n')),Object(i.b)("p",null,"Let's look at what we've done. First we dig the ",Object(i.b)("inlineCode",{parentName:"p"},"author.id")," from the payload and look the ",Object(i.b)("inlineCode",{parentName:"p"},"User")," in the DB, by ",Object(i.b)("inlineCode",{parentName:"p"},"id"),". Note that we do not need to check if the ",Object(i.b)("inlineCode",{parentName:"p"},"author")," or the ",Object(i.b)("inlineCode",{parentName:"p"},"id")," are null as that's all taken care for us by the framework."),Object(i.b)("p",null,"If we cannot find this user we need to signal something back to the client. In this trivial example we're just raising a string, but typically you'd have this code raise some well known error class and make the controller catch it and respond appropriately with the right HTTP response. For example, create a ",Object(i.b)("inlineCode",{parentName:"p"},"ResourceNotFoundError")," class or similar, and use it to signal this business logic case (remember this code is not aware of any HTTP concerns, just application business logic). We'll leave this as an exercise to the reader ;)."),Object(i.b)("p",null,"If we have found the user, we simply create a ruby hash from the payload and substitute the ",Object(i.b)("inlineCode",{parentName:"p"},":author")," attribute with the appropriate user model. ActiveRecord, in this case, knows how to properly fill in the foreign keys since the ",Object(i.b)("inlineCode",{parentName:"p"},"Post")," model has an ",Object(i.b)("inlineCode",{parentName:"p"},":author")," association defined pointing to the ",Object(i.b)("inlineCode",{parentName:"p"},"User")," model. We could have passed the ",Object(i.b)("inlineCode",{parentName:"p"},":author_id")," field just as well."),Object(i.b)("p",null,"And that's it. In this case we couldn't simply use the scaffolded code because we wanted to showcase accepting an ",Object(i.b)("inlineCode",{parentName:"p"},"author")," field on create, but it was fairly easy and short to adapt for it."),Object(i.b)("p",null,"Now, let's restart our API server and create a ",Object(i.b)("inlineCode",{parentName:"p"},"Post"),". To do that, we will send a POST request, with a body containing the ",Object(i.b)("inlineCode",{parentName:"p"},"title")," and an ",Object(i.b)("inlineCode",{parentName:"p"},"author")," sub-hash containing an ",Object(i.b)("inlineCode",{parentName:"p"},"id"),". The following curl request creates a post titled ",Object(i.b)("inlineCode",{parentName:"p"},"New Title"),", linked to author with ",Object(i.b)("inlineCode",{parentName:"p"},"id"),"=11:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-shell"}),"curl -XPOST 'http://localhost:9292/posts' \\\n    -D - \\\n    -H 'X-Api-Version: 1' \\\n    -H 'Content-Type: application/json' \\\n    -d '{ \"title\": \"New Title\", \"author\": { \"id\": 11}}'\n")),Object(i.b)("p",null,'Note that we\'ve added the "-D -" flag to curl to ask it to print the response headers. This way we can confirm that we properly get a ',Object(i.b)("inlineCode",{parentName:"p"},"Location")," header which tells us the URL (and therefore id) of the newly created post. Boom! it works!"),Object(i.b)("p",null,"And finally, let's wrap up our CRUD tutorial by looking at the ",Object(i.b)("inlineCode",{parentName:"p"},"delete")," action."),Object(i.b)("h2",{id:"delete"},"Delete"),Object(i.b)("p",null,"The delete action is definitely the easiest one, let's design it first."),Object(i.b)("h3",{id:"designing-delete"},"Designing Delete"),Object(i.b)("p",null,"From a design perspective, a delete is very similar to the ",Object(i.b)("inlineCode",{parentName:"p"},"update"),", except that it does not need any payload information, it only needs the ",Object(i.b)("inlineCode",{parentName:"p"},"id")," of the post to delete. Here's the scaffolded endpoint for delete:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),"  action :delete do\n    description 'Deletes a Post'\n    routing { delete '/:id' }\n    params do\n      attribute :id, required: true\n    end\n    response :no_content\n    response :not_found\n  end\n")),Object(i.b)("p",null,"It all looks exactly how we want it. This defines that a delete is done through a ",Object(i.b)("inlineCode",{parentName:"p"},"DELETE")," verb to the member url of the posts collection (",Object(i.b)("inlineCode",{parentName:"p"},"/posts/:id"),"), where ",Object(i.b)("inlineCode",{parentName:"p"},":id")," is the given identifier of the post. As a response, the client must expect a ",Object(i.b)("inlineCode",{parentName:"p"},"204 No Content")," when successful update, or a ",Object(i.b)("inlineCode",{parentName:"p"},"400 Bad Request")," when the request couldn't be completed (with included information as to why not)."),Object(i.b)("p",null,"Ok then, nothing to be added...moving along to the implementation."),Object(i.b)("h3",{id:"implementing-delete"},"Implementing Delete"),Object(i.b)("p",null,"Looking at the scaffolded Controller implementation for delete also reveals a structure almost identical to ",Object(i.b)("inlineCode",{parentName:"p"},"update"),":"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),"  def delete(id:)\n    # A good pattern is to call the same name method on the corresponding resource,\n    # maybe passing the already loaded model\n    deleted_resource = Resources::Post.delete(\n      id: id\n    )\n    return Praxis::Responses::NotFound.new unless deleted_resource\n\n    Praxis::Responses::NoContent.new\n  end\n")),Object(i.b)("p",null,"In fact, it is exactly the same code but calling the ",Object(i.b)("inlineCode",{parentName:"p"},"delete")," method of the resource, which obviously does not need a payload. Good, nothing to do here either. How about the ",Object(i.b)("inlineCode",{parentName:"p"},"delete")," method where the business logic lives?"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-ruby"}),"  def self.delete(id:)\n    record = model.find_by(id: id)\n    return nil unless record\n    record.destroy\n    self.new(record)\n  end\n")),Object(i.b)("p",null,"Well, nothing to be done here either as it simply loads and destroys the model, or returns nil if it couldn't find it. Nice job scaffolder!"),Object(i.b)("p",null,"Wanna delete a post? Yeah, I thought so. Create one with the previous curl above, and use the resulting id to delete it (buy substituting the ",Object(i.b)("inlineCode",{parentName:"p"},"YOUR_ID_HERE")," in the curl below for your id):"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{className:"language-shell"}),"curl -XDELETE 'http://localhost:9292/posts/YOUR_ID_HERE' \\\n    -H 'X-Api-Version: 1'\n")),Object(i.b)("h1",{id:"summary"},"Summary"),Object(i.b)("p",null,"So...just like that, we have built a full-on CRUD API for Posts, by literally just pasting a few lines of code (mostly just to define our own media type structures and payload attributes, as well as the ",Object(i.b)("inlineCode",{parentName:"p"},"create")," method of the resource due to our special-cased linked user). Hopefully you enjoyed it and have started to see that while this was just the tip of the iceberg, Praxis makes it easy and efficient to build powerful, consistent and fully documented APIs, all with extreme developer productivity."))}c.isMDXComponent=!0},133:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return u}));var a=n(0),o=n.n(a);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var d=o.a.createContext({}),c=function(e){var t=o.a.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=c(e.components);return o.a.createElement(d.Provider,{value:t},e.children)},h={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},b=o.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,r=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),p=c(n),b=a,u=p["".concat(r,".").concat(b)]||p[b]||h[b]||i;return n?o.a.createElement(u,s(s({ref:t},d),{},{components:n})):o.a.createElement(u,s({ref:t},d))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,r=new Array(i);r[0]=b;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,r[1]=s;for(var d=2;d<i;d++)r[d]=n[d];return o.a.createElement.apply(null,r)}return o.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);