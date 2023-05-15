---
title: Controllers
---

Controllers are the entrypoint where the implementation to fulfill all API requests live.
They behave much in the same as they do in other MVC-based web frameworks - they implement the actions that receive requests from API clients, operate on the underlying resources to service those requests, and return the
appropriate responses. In short, controllers are the glue which connects actions and their responses to application business logic.

Praxis controllers differ from some other frameworks in that they:

* are plain Ruby classes that happen to include the `Praxis::Controller` module. By using plain Ruby classes, Praxis allows you to use the full power of Ruby. You are not limited in your inheritance options, and your controller code can be well-isolated and easily tested.
* serve actions by implementing an instance method with the same name as the action in your endpoint, which accept Ruby **keyword** parameters corresponding to the attribute names of the action definition. Exposing the common parameters as keword method arguments, make your code and interface cleaner, and connects to the API definition in a more direct way.

## Including the Controller concern

To implement a controller in Praxis, include the `Praxis::Controller` module in your controller class and indicate which of your Resource Definitions it implements by using the `implements` stanza. For example, this could be how you create rthe Post controller class, which will serve the implementation of all actions defined in `Endpoints::Posts`:

```ruby
class Posts
  include Praxis::Controller

  implements Endpoints::Posts

  # Controller code...
end
```

Including the `Praxis::Controller` module enhances the class with important methods such as `implements`, lifecycle methods (i.e.,`before`, `around` `after`), `request` to retrieve the incoming API request object, and `response` for using the default response object when needed.

## Linking to the Endpoint Definition

The `implements` method is used to connect a controller with its corresponding EndpointDefinition. Technically speaking there is nothing that prevents having the Endpoint definition from also being a controller (i.e., implementing itself). However, and despite that being feasible due to the modularity that Praxis provides, we highly discourage it in order to keep "design" logically separate from "implementation".

Once the controller is linked, you can also get to its corresponding `EndpointDefinition` object through the `definition` method, which is defined on both the class and instance.

## Implementing an Action

A controller action is an instance method defined on a controller class. The method's name must match an action defined in the controller's resource definition. And its keyword arguments must match the defined parameters in the action.

For example, on the design side, we can have an endpoint definition class for `Posts` that defines two actions: `:index` and `:show`:

```ruby
class Endpoints::Posts
  include Praxis::EndpointDefinition

  media_type Post
  version '1.0'

  action :index do
    routing { get '' }
    description 'Fetch all blog posts'
  end

  action :show do
    routing { get '/:id' }
    description 'Fetch an individual blog post'
    params do
      attribute :id, Integer, required: true
      attribute :token, String, required: true
      attribute :allow_deleted, Attributor::Boolean
      attribute :extended_info, Attributor::Boolean
    end
  end
end
```

The controller implementing this resource definition must have instance methods named `index` and `show` must which accept the argument names described by the params block from the resource definition.

```ruby
class Posts
  include Praxis::Controller

  implements Endpoints::Posts

  def index
    # empty method signature: the index action defines no parameters
  end

  def show(id:, token:, **other_params)
    # four parameters defined matching the names of the arguments
    # Note that ruby allows is to unpack only the names we care about
    # and leave the rest tucked away in the other_params hash
  end
end
```

Note that the `index` action has no parameters defined in its endpoint definition so the method accepts no arguments.

On the other hand, the `show` action has four parameters defined in its endpoint, so it can explicitly declare them as named method arguments. Ruby gives you great flexibility in declaring named parameters with the splat operator. It is up to the developer to choose how many explicit arguments to list, and how many to tuck away inside an `other_params` hash. In
this case, the developer decided that `id` and `token` are important enough to use as direct variables in the controller (it is common to only explicitly list the required ones), while pushing the `allowed_deleted` and `extended_info` into the other_params hash. Having this flexibility is great for dealing with large number of parameters while keeping your controller code tidy.

In addition to using named arguments for incoming parameters, Praxis will also ensure their values match the types that you've specified in the Endpoint Definition. So in this case, you can rest assured that accessing the `id` variable within the `show` method will always get you an Integer. In other words, there should be no type and parameter validation being done in your controller, because Praxis ensures that if the code makes it to your action, the parameters (and headers and payloads) will properly be there if they are required, and will have been successfully coerced to the defined types.


## Retrieving Headers and Payload Data

While pure path and query string parameters are conveniently exposed as keyword arguments to the function. They are also accessible from inside the `request` method in the controller (which is provided by the `Praxis::Controller` include).

In fact, you can not only get to the params structure by accessing `request.params`, but you can also use the same technique to access the incoming API payload by `request.payload` and the incoming headers by `request.headers`. The data retrieved under these methods is type-curated exactly like keyword arguments and is accessible through calling method names matching your attributes. For example, I can access the same exact `token` query string parameter by calling `request.params.token`, or retrieve a hypothetical `first_name` parameter coming from the API payload of a request by `request.payload.first_name`.

Note that `request.headers` will only give you the (coreced and validated) headers that you have defined. That is not the function to retrieve all the raw headers that the request carries. The rationale here is that if there are important headers that you're expecting to use in the action, you should probably have defined them in your API endpoint, as that's probably an important information for the API clients to know. For special circumstances, however, you can always access the raw Rack env (which contains the headers) by `request.env`.

## Nil vs not-provided values

Using these Struct-type parameters, you can also test if an incoming value was provided by the client (or has been assigned by a `default` option). To do so, just use the `key?` method passing the attribute name. This is useful in those cases where there is an important distinction between a user-provided `nil` value and the user simply not providing a value, as there is in "PATCH" requests. 

Here's a simple made up example of how to access these methods from a controller action:

```ruby
def update(id:,**other_params)
  id == request.params.id             # id argument will be the same as request.params.id
  accept = request.headers.accept     # Retrieve 'Accept' header

  if request.payload.key?(:email)     # the email attribute was passed (which could be nil)
    email = request.payload.email
    email ? update_email(email) : reset_email   # Update or reset the email
  else
    # Leave email untouched    
  end
end
```

## Returning a Response

The final piece of every controller action ia to return a Response object with the right headers, status code and body. To do so, you literally `return` an instance of a Praxis::Response-derived class from the action, and let Praxis worry about formatting and sending those bits back to the API client.

For every existing HTTP response code, Praxis has an appropriate Response class for you to use. They are all defined under the `Praxis::Responses` module, using a camel-case named class based on their human http code message. For example, to return a `204 No Content` HTTP response, you can simply create and return a `NoContent` class instance in this way:

```ruby
 return Praxis::Responses::NoContent.new
```

These response classes also allow configuration as a way to pass the response payload and its headers. They can be configured on instantiation (by pasing arguments to the controller), or as method calls on the created instance.

Here's an example of how you can create a `201 Created` response, with a `Location` header of `/users/23`, and a customer header of `X-My-Header` with value `foo`. This is done through setting things on the instance:


```ruby
response = Praxis::Responses::Created.new
response.headers = {
  'Location' => '/users/23',
  'X-My-Header' => 'foo'
}
return response 
```

And this is the equivalent in doing it through instantiation:
```ruby
 return Praxis::Responses::Created.new(location: '/users/23', headers: {`X-My-Header` => `foo` })
```

You are probably wondering why didn't we pass the location through a straight `Location` header. The answer is that we could have, without problems. We just wanted to illustrate, that since it is so common, we've also allowed you to use the `location:` parameter to achieve the same. And, in fact, the same is true for a `media_type:` parameter as well, which would be translated to the appropriate `Content-Type` parameter of the passed in `MediaType` object.

### Default response object

Many of your API actions are likely return a `200 Ok`, at least for the normal execution path. To make things easier keep your controller DRY, Praxis will alway have an instance of a `200 Ok` response ready for you in your action. You can access it through the `response` method, and you can easily change it by setting a different instance of a response at any point in time. Using the precreated response, you can keep your code DRY by not having to create a new one every time you return a 200. Note that this is just a convenience to avoid creating instances for all of the common cases, but in fact, you don't even have to use that response instance at all if you don't want to, as you can always return any response you create from your action.

Here's an example of one way to use and return the default response:

```ruby
def show(id:, **other_params)
  response.headers['Content-Type'] = 'text/plain'
  response.body = "This is a simple body"
  response
end
```

### Strings as responses

While returning a Response instance from your action is the normal flow, there is also another way. In particular, you can instead return a simple string, and if you do so, Praxis take it as the body to send back to the client, and will make use of the current contents of the `response` method to complete it. In other words, a string return will tell Praxis that you want to use the current contents of the `response` object, with the passed string as the body. The `response` method could be the default `200` instance set by Praxis itself, or could be that you have set it to something else. The final result will set the body of that request to the string returned, and sent that request back to the client. Here's a typical example:

```ruby
def show(id:, token:, **other_params)
  response.headers['Content-Type'] = 'application/json'
  '{ "first_name" : "Joe", "email" : "joe@example.com" }'
end
```

...which essentially results in 1) `response.body = <STR>` and return `response`

Any returned value from an action that it is not a Response instance or a String is an immediate error.


## Request Life Cycle Callbacks

Including the `Praxis::Controller` module also provides a way to register one or more callbacks to be executed during the request life cycle. This is done using the `before`, `after` and `around` methods which take zero or more params and a block for Praxis to execute.

For example, to execute a callback before the `show` action runs, you can add:

```ruby
before actions: [:show] do
  puts "before action"
end
```

To execute a callback before the `validate` stage of the request cycle, but
only when the action is `index`, you could add:

```ruby
before :validate, actions: [:index] do |controller|
  puts "About to validate params/headers/payload for action:"
  puts "#{controller.request.action.name}"
end
```

The block receives the instance of your controller, which you can use to access
all of the controller's properties, including the request, the response, any
actions, etc.

Any of these callbacks are able to interrupt (i.e., shortcut) the execution block of a request by returning an Response instance. For a complete discussion of what stages are available for use in your callbacks, as well as how to use them, please refer to the [Request LifeCycle](request-life-cycle) documentation.