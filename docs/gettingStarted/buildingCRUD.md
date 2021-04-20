---
title: Building CRUD
sidebar_label:  Building CRUD
---

The way that people build CRUD operations often varies more than read-only operations like `index` and `show`. However, Praxis still brings in many best practices (and helper tools) that you can decide to follow. You can also decide not to follow these practices and implement your controller code however you see fit otherwise. That's one of the main goals of Praxis: at the core, it provides a solid Web API routing/parameter/controller Rack-based framework you can directly use (i.e., a la Sinatra), but you can easily opt-in to as many other extensions and best practices as you want (and you can even do it on a controller by controller basis, etc.)

But anyway, we were talking about implementing the CRUD operations weren't we? Let's go through it one by one, first `update`, then `create`, and finally, `delete`.

## Update

Like always, we start by defining the API design of our new action.

### Designing Update

For that, let's take a look at the scaffolded code from our generator:

```ruby
  action :update do
    description 'Update one or more attributes of an existing Post'
    routing { patch '/:id' }
    params do
      attribute :id, required: true
    end
    payload reference: MediaTypes::Post do
      # List the attributes you accept from the one existing in the Post Mediatype
      # and/or fully define any other ones you allow to change
      # attribute :name
    end
    response :no_content
    response :bad_request
  end
```

This defines that an update will be done through a `PATCH` request to the member url of the posts collection (`/posts/:id`), where `:id` is the given identifier of the post to update. As a response, the client can expect a `204 No Content` when successful update or a `400 Bad Request` if the request couldn't be completed (which will include information as to why it failed). Looks pretty reasonable so far.

Notice that query-string parameters are defined separately from body parameters. Query string parameters are defined in the `params` block of the design, while request body structure is defined in the `payload` block. In this case we will be defining the payload as a simple incoming hash-like structure, but bear in mind that it can be designed to accept arrays, and/or complex multipart bodies, etc.

The only thing that we need to modify from the scaffold code is the payload, as it contains the attributes we want to allow the client to update. You are obviously free to choose the shape and names of that structure. However, a Praxis best practice is to design incoming payload structures that mimic the rendered the corresponding output MediaType (i.e., trying to have INPUTS == OUTPUTS as much as possible). To follow that tenet, we want to accept a payload that has `title`, `contents` (and potentially an `author`), given that these are the only three existing attributes of a `Post`. In this case, however, we won't allow sending an `author` attribute as that's something we might want to keep immutable from creation time. So in the most pure Praxis style, here's how the payload would be designed:

```ruby
  payload reference: MediaTypes::Post do
    attribute :title
    attribute :content
  end
```

Copy that to the `update` action of the `Post` endpoint (`design/v1/endpoints/posts.rb`). Now, let's take a look at a couple of things in this definition. 

The first thing to notice is that we didn't define types for any of the attributes. What's that all about? Well, the answer lies in the `reference: MediaTypes::Post` option passed to `payload`. When a payload is given a MediaType reference, any attributes with matching names will direclty inherit all of their type and options from the correspondingly-named attribute in the MediaType. In this case, `title` and `content` will both be defined as `String` as that's the type they have in the reference `Post` MediaType. Good, saved some keystrokes in there.

Notice that this is already a benefit from following the INPUTS==OUTPUTS paradigm, as it provides you with terser and more readable code, and it can help avoid silly copy and paste mistakes. We can always define any extra payload attribute we want (including its type and options), even if it does not exist in the reference MediaType. In fact, it is also possible to also redefine the type and options of an attribute, even if it exists in the reference MediaType (that's generaly a bad practice, though, as it's not intuitive to the client)

Another thing to notice from the definition is that none of the attributes are required. That is because this `update` action (through the `PATCH` HTTP verb) only changes the attributes that are passed in, and leaves the rest untouched. If you wanted an update-type action that can change a member of the collection fully, we recommend the best practice of creating another action using a `PUT` verb to the same member url, and call it something like `replace` to clearly denote that it will replace _all_ values of the object, including resetting the ones that aren't passed in.

So all in all, we only needed to add a couple of attributes to the payload. Good times. Also, feel free to fire up the doc browser (`bundle exec praxis docs browser`) to see how our design turned out, in a more visually appealing way. Let's move to the implementation.


### Implementing Update

So let's now focus our efforts on building the implementation of what we have just designed. In particular we need to be able to update a `Post` based on the incoming payload we have defined. The first question is: how much should this controller code do? Let's turn to another important set of Praxis best practices.

An important suggestion from Praxis is to confine controller code to only deal with HTTP concepts and transformations (request and response params, payload, headers, HTTP codes and errors, and etc.), while specifically avoiding any business logic (application domain logic). There are many reasons for this but the most important ones have to do with separation of concerns, testability and business logic reuse.

So what Praxis proposes for the `update` action of our controller is to simply call an underlying business logic object to update a `Post`, commonly using the same action name (i.e., `create`) and pass all of the necessary parameters to do so. Once that call to the underlying logic is done, then simply return the `201 Created` response with the appropriate Location header containing the href of the created resource. Done. Short. Clean. Our controller only deals with HTTP protocol adaptation, with some massaging of the incoming/outgoing structures to and from the business logic objects.

Ok, so what are these business logic objects then? Well, Praxis calls them "Resources" and are nothing more than pure Ruby classes. Resources are the associated objects that sit in between the Controllers and the Data access, which contain the important business logic of your app. In other words: at the top level Controllers simply deal with HTTP and data structure concerns; at the lowest level Models deal with retrieving and saving data from or to the DB. Resources are reusable components of business logic that sit in the middle and abstract the underlying related models (or other related resources).

Allright, so how does that look in the controller code then? Let's take a look at the scaffolded code for the `update` action that our generator built for us:

```ruby
  def update(id:)
    # A good pattern is to call the same name method on the corresponding resource, 
    # passing the incoming id and payload (or massaging it first)
    updated_resource = Resources::Post.update(
      id: id,
      payload: request.payload,
    )
    return Praxis::Responses::NotFound.new unless updated_resource

    Praxis::Responses::NoContent.new
  end
```

The first thing to notice is that the `id` parameter we defined in our design step is passed in as a keyword argument to the function. It is also accessible through `request.params.id` but it is cleaner and more self-documenting to be a required function argument. 

Another thing to notice is that the scaffolded code performs no validation whatsoever on the `id` or the `payload` elements. That is because a powerful part of building your API design with Praxis is that it will all be automatically validated and coerced before it can even reach your controller method. In other words, if our controller method is executed we can be 100% sure that the `id` is an Integer, and any of the passed payload attributes are `Strings`, as we have defined them. If there is any discrepancy with types of parameter names, the framework would have detected it and already sent a validation error back to the client detailing exactly what didn't match the API specification.

The body of the function also follows the best practices we talked about. It calls a class method on the resource of the same name and gives it the necessary information to perform the job. In this case, the `id` of the post, and the incoming payload structure. In addition, it also returns a `404 Not Found` if the update call yield no resource, but otherwise it will return a `204 No Content` to indicate success. Some APIs like to return a `200 OK` with the resulting body of the updated resource. While this is perfectly fine and valid, we suggest it is much cleaner (and computationally cheaper) to just signal success without returning any payload, and let the the client decide to read the latest copy of the object in a subsequent request if necessary. This way it can also clearly specify which of the fields (including nested resources) it wants to gather. If we had to return the updated object in an update call, we'd either have to choose what fields to return, or somehow accept a `fields` parameter to know what to render. All are perfectly acceptable options, it's more a matter of preference.

Ok, so nothing for us to change here, that's cool. So let's now look at this `update` method of the resource, where the business logic lives:

```ruby
  def self.update(id:, payload:)
    record = model.find_by(id: id)
    return nil unless record
    # Assuming the API field names directly map the the model attributes. Massage if appropriate.
    record.update(**payload.to_h)
    self.new(record)
  end
end
```

Well, it doesn't seem that we need to change anything here either! This scaffolded code is loading the model by `id` from the DB and returning `nil` to signal it didn't find it if applicable. If found, it simply updates the model attributes with the received values and returns the updated record wrapped in a resource instance. Done. The simplicity of this method is due to the fact that the API attributes have the same name as the ORM model. If they were different, we would probably have to do some extra massaging before invoking the model's update method .

So with that, we have finished the implementation for updating Posts. Let's give it a go real quick, by first starting (or restarting) the web API (`bundle exec rackup`) and sending a PATCH request to change the title and content of `Post` with `id`=1:

```shell
curl -XPATCH 'http://localhost:9292/posts/1' \
    -H 'X-Api-Version: 1' \
    -H 'Content-Type: application/json' \
    -d '{ "title": "Changed Title", "content": "New Content"}'
```

There you go! You can now update posts. Check it out by reading the updated post with something like `curl 'http://localhost:9292/posts/1?api_version=1'`.

Ok, so this implementation for update took a bit of writing and explanation about best practices and options, but really, the scaffolding code did a very good job as we only had to change the payload definition of our `update` action! Not bad. Let's look at what happens when we implement `create`. 

## Create

The `create` action has many similarities with the previous `update` action. In fact, it could be almost identical. However, we are going to spice it up (for demonstration purposes) by accepting not only a `title` and `content` for a new post, but also a reference to an existing `User` as the author. Let's design the endpoint first.

### Designing Create

The first thing to notice is the RESTful design choices that the scaffold generator did for us in the endpoint:

```ruby
  action :create do
    description 'Create a new Post'
    routing { post '' }
    payload reference: MediaTypes::Post do
      # List the attributes you accept from the one existing in the Post Mediatype
      # and/or fully define any other ones you allow at creation time
      # attribute :name
    end
    response :created
    response :bad_request
  end
```

This specifies that creating a post is be done through a `POST` verb to the collection url (`/posts`), and successful creation will return a `204 Created` response containing a Location header of the href for the created resource. Otherwise it will respond with a `400 Bad Request` if the request couldn't be completed (with the included information as to why not).

If we're good with this fairly standard RESTful practice, the only thing that this needs to be completed is to define what payload attributes we want to accept to create a `Post`. 

If we follow the INPUTS==OUTPUT best practices, we want to accept a payload that has a `title`, a `contents` and an `author` (with this attribute also matching a subset of the original `User` MediaType). So, in the more pure Praxis style, here's how the payload would be designed:

```ruby
  payload reference: MediaTypes::Post do
    attribute :title
    attribute :content
    attribute :author do
      attribute :id, required: true
    end
    requires.at_least(1).of :title, :content
    requires.all :author 
  end
```

Now, let's take a look at a couple of things from this definition. 

The first one, again, is that we didn't define types for any of the attributes. There's no need since the attribute structure and names match the referenced `Post` MediaType. Yay! Again a best practice that can reward you in terseness and avoid mistakes when you follow the INPUTS==OUTPUTS paradigm. Note that any extra payload attribute that we might want to accept can still be fully defined with its type an options. In fact, it is possible to even redefine the type and options of an attribute even if the reference MediaType has it (that sounds like a bad practice, though, as it's not intuitive to the client).

The second thing to notice is how we've defined the way to specify the author of the post. Often times you see a payload having an `author_id` attribute, but following the INPUTS==OUTPUTS paradigm we want to change that to have an `author` struct, with only an `id` inside. In the same fashion, we can trivially start accepting other author information like `email` or `uuid` (even optionally within the `author` struct) to connect the `Post` to it. It's all about the consistency and the principle of least surprise to your users of the API.

Finally (and more for demonstration purposes than anything else), we have decided that we can accept a post without a `title` or without a `content`, but we need at least one of them. The `author` however is always required (along with its `id`).

<!-- 
TODO: These 2 paragraphs should be incorporated to the update instead?

So, now that the Create API is designed, and Praxis will take 1) route that request to the `create` method in the `Posts` version 1 controller, and 2) to take full care to always parse and validate all the incoming parameters and respond with a failure 400 code (and an appropriate message as to why) to the client, if something does not match the spec.

In the case all checks out, our `create` code in the `Posts` controller will be invoked, and we can make sure that all of the method params and incoming request payload have properly been parsed and coerced to the our type spec. This means we never shall do any of those validations on our code, Praxis will never invoke the action method unless all of them pass. -->

Let's turn to the implementation now.

### Implementating Create

This is the scaffolded code we find for `create` in the controller:

```ruby
  # Creates a new Post
  def create
    # A good pattern is to call the same name method on the corresponding resource, 
    # passing the incoming payload, or massaging it first
    created_resource = Resources::Post.create(request.payload)

    # Respond with a created if it successfully finished
    Praxis::Responses::Created.new(location: created_resource.href)
  end
```

Umm... well, that looks good enough, doesn't it? Seems we're done with our controller! Let's build the actual business logic shall we? 

To do so, let's turn to our scaffolded `Post` resource in `app/v1/resources/post.rb`. As you can see, for now there is no extra logic other than actually creating a row in the DB and returning an instance of the resource that wraps it:

```ruby
  def self.create(payload)
    # Assuming the API field names directly map the the model attributes. Massage if appropriate.
    self.new(model.create(**payload.to_h))
  end
```

This scaffolded code assumes that the payload attributes of the API have the same name as the model attributes. Obviously, with our inclusion of a linked `author` id, this is not 100% correct. So in this case, we do need to change the scaffolded implementation to account for that. Not much, though, as we just need to change it to this:

```ruby
  def self.create(payload)
    author = ::User.find_by(id: payload.author.id)
    raise "Author with id #{payload.author.id} not found" unless author
    data = payload.to_h
    data[:author] = author
    self.new(model.create(**data))
  end
```

Let's look at what we've done. First we dig the `author.id` from the payload and look the `User` in the DB, by `id`. Note that we do not need to check if the `author` or the `id` are null as that's all taken care for us by the framework.

If we cannot find this user we need to signal something back to the client. In this trivial example we're just raising a string, but typically you'd have this code raise some well known error class and make the controller catch it and respond appropriately with the right HTTP response. For example, create a `ResourceNotFoundError` class or similar, and use it to signal this business logic case (remember this code is not aware of any HTTP concerns, just application business logic). We'll leave this as an excercise to the student ;). 

If we have found the user, we simply create a ruby hash from the payload and substitute the `:author` attribute with the appropriate user model. ActiveRecord, in this case, knows how to properly fill in the foreign keys since the `Post` model has an `:author` association defined pointing to the `User` model. We could have passed the `:author_id` field just as well.

And that's it. In this case we couldn't simply use the scaffolded code because we wanted to showcase accepting an `author` field on create, but it was fairly easy and short to adapt for it.

Now, let's restart our API server and create a `Post`. To do that, we will send a POST request, with a body containing the `title` and an `author` sub-hash containing an `id`. The following curl request creates a post titled `New Title`, linked to author with `id`=1:

```shell
curl -XPOST 'http://localhost:9292/posts' \
    -D - \
    -H 'X-Api-Version: 1' \
    -H 'Content-Type: application/json' \
    -d '{ "title": "New Title", "author": { "id": 1}}'
```

Note that we've added the "-D -" flag to curl to ask it to print the response headers. This way we can confirm that we properly get a `Location` header which tells us the URL (and therefore id) of the newly created post. Boom! it works!

And finally, let's wrap up our CRUD tutorial by looking at the `delete` action.

## Delete

The delete action is definitely the easiest one, let's design it first.

### Designing Delete

From a design perspective, a delete is very similar to the `update`, except that it does not need any payload information, it only needs the `id` of the post to delete. Here's the scaffolded endpoint for delete:

```ruby
  action :delete do
    description 'Deletes a Post'
    routing { delete '/:id' }
    params do
      attribute :id, required: true
    end
    response :no_content
    response :not_found
  end
```

It all looks exactly how we want it. This defines that a delete is done through a `DELETE` verb to the member url of the posts collection (`/posts/:id`), where `:id` is the given identifier of the post. As a response, the client must expect a `204 No Content` when successful update, or a `400 Bad Request` if the request couldn't be completed (with included information as to why not).

Ok then, nothing to be added...moving along to the implementation.

### Implementing Delete

Looking at the scaffolded Controller implementation for delete also reveals a structure almost identical to `update`:

```ruby
  def delete(id:)
    # A good pattern is to call the same name method on the corresponding resource,
    # maybe passing the already loaded model
    deleted_resource = Resources::Post.delete(
      id: id
    )
    return Praxis::Responses::NotFound.new unless deleted_resource

    Praxis::Responses::NoContent.new
  end
```

In fact, it is exactly the same code but calling the `delete` method of the resource, which obviously does not need a payload. Good, nothing to do here either. How about the `delete` method where the business logic lives?

```ruby
  def self.delete(id:)
    record = model.find_by(id: id)
    return nil unless record
    record.destroy
    self.new(record)
  end
```


Well, nothing to be done here either as it simply loads and destroys the model, or returns nil if it couldn't find it. Nice job scaffolder!

Wanna delete a post? yeah, I thought so. Create one with the previous curl above, and use the resulting id to delete it (buy substituting the `YOUR_ID_HERE` in the curl below for your id):

```shell
curl -XDELETE 'http://localhost:9292/posts/YOUR_ID_HERE' \
    -H 'X-Api-Version: 1'
```


# Summary

So...just like that, we have built a full-on CRUD API for Posts, by literally just pasting a few lines of code (mostly just to define our own media type structures and payload attributes, as well as the `create` method of the resource due to our special-cased linked user). Hopefully you enjoyed it and have started to see that while this was just the tip of the iceberg, Praxis makes it easy and efficient to build powerful, consistent and fully documented APIs, all with extreme developer productivity.