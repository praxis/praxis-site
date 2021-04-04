---
title: Actions
---

Each of the available actions for an endpoint are defined using the `action` method. At a minimum, an action definition must have a name and at least one route. It's a good idea to add a description for each action so Praxis can use it when generating documentation. In addition to a description an action can also specify:

* `routing`: paths that should map to this action
* `params`: the structure of the incoming query string and the parameters you expect tofind in it
* `payload`: the structure of the incoming request body
* `headers`: specific named headers that Praxis should parse and make available to this action
* `responses`: type and code of the possible responses the action can generate
* `nodoc!`: this action should not be included in documentation. Also any types defined withinits payload or parameter blocks will not appear in the generated documentation.


## Routing

The routing block defines the way Praxis will map requests to your actions.
This DSL accepts one or more entries of the form: HTTP verb, path (with colon
encoded capture variables), and options. For example:

```ruby
action :index do
  routing do
    get 'blogs'
    get '//orgs/:org_id/blogs'
  end
end
```

Praxis has convenience methods for all the HTTP verbs defined in the [HTTP/1.1
Specification](http://tools.ietf.org/html/rfc7231#section-4.3) (OPTIONS, GET,
HEAD, POST, PUT, DELETE, TRACE and CONNECT) plus
[PATCH](http://tools.ietf.org/html/rfc5789).

Praxis also accepts the 'ANY' verb keyword to indicate that the given route should
match for any incoming verb string. Routes with concrete HTTP verbs will always
take precendence against 'ANY' verb routes. For instance, take a look at the following
simplistic and contrived example:

```ruby
class Blogs
  include Praxis::EndpointDefinition

  action :show do
    routing { get '/:id' }
    description 'Fetch one blog entry'
  end
  action :other do
    routing { any '/:id' }
    description 'Do other stuff with non GET verbs'
  end
end
```

In this case an incoming `"GET /"` request will always invoke the `:show` action,
while others like `"POST /"` or `"PATCH /"` will always map the the `:other` action.
Using the 'ANY' verb is mostly a convenience to avoid repeating several routes with
the same exact path for an action that needs to respond to all those verbs in the
same manner. There is a subtle difference, however, and that is that using 'ANY'
will truly accept any incoming HTTP verb string, while listing them in several routes
will need to match the specific supported names. For example, an 'ANY' route like the
above will be able to match incoming requests like `"LINK /"` or `"UNLINK /"` (assuming the Web
server supports it).

Remember that Praxis prefixes all your resources' routes with a string based
on the name of your enclosing endpoint definition class, in this case
'/blogs' since our class is called `Blogs`. You can, however, override the prefix for a single route by prepending '//' to the path (like in the example above) if you don't want the resource-wide prefix to apply. Alternately, you can provide a special prefix of either `''` or `'//'` in the routing block to clear the prefix for any other paths given.

*Note*: The above 'resetting' behavior of '//' applies *only* to any Resource-level route prefixes that may be defined. It will *not* override an API-wide `base_path` if one is defined (see [Global Api Info](global-api-information/)).

You can inspect the complete Praxis routing table using `praxis routes` or `rake praxis:routes`:

```bash
$ rake praxis:routes
+---------------------------------------------------------------------------+
| Version |        Path         | Verb | Resource | Action | implementation |
+---------------------------------------------------------------------------+
| n/a     | /blogs              | GET  | Blogs    | index  | -n/a-          |
| n/a     | /orgs/:org_id/blogs | GET  | Blogs    | index  | -n/a-          |
+---------------------------------------------------------------------------+
```

The route command supports the `json` format parameter (i.e., `praxis routes json`) to retrieve the complete routing table in JSON format instead of the tabular example above.

### Route parameters

Routes can also take optional parameters. Any of those options passed to the route will be sent to the underlying routing engine (Mustermann). This makes it possible to use advanced features like wildcards, and extra type matching restrictions. For example, the following route will match any url ending with `/do_stuff` except if it starts with `/special`:

```ruby
action :wildcards do
  routing do
    get '/*/do_stuff' , except: '/special*'
  end
  description "Will match '/foo/bar/do_stuff' but not '/special/do_stuff"
  params do
    # :splat will contain the mathing pieces of the wildcards
    attribute :splat, Attributor::Collection.of(String)
  end
end
```

Notice in the example above that if we use wilcard operators for our routes, we will also need to declare the
`:splat` parameter in our action definition. This parameter will contain a collection of strings matching every wildcard in our route (and yes, you can have a route with multiple wildcards). If only one wildcard is used, `:splat` will still be an array, and will contain a single string element in it. See the [Mustermann site](https://github.com/rkh/mustermann) for more information about pattern types and other supported options.



## Params

Praxis allows you to define the expected structure of incoming request
parameters in the query string, in the URL itself and in the request body
(payload). By doing so, you can let the framework perform basic request
validation and coercion of values into their expected types. This is also a key
component of the Praxis documentation generator.

In Praxis actions, the `params` stanza is used to describe incoming parameters that can
be found in both the action path (route) or the query string. In case of name
conflicts, parameters in the path always take precedence over parameters in
the query string.

You can define the expected structure of URL and query string parameters by
using the `params` method with a block. Use the standard Attributor::Struct
interface to declare attributes.

For example, if you want to pass a simple boolean query string parameter in your blog index action you could define it like so:

```ruby
action :index do
  routing { get '' }
  params do
    attribute :force, Attributor::Boolean, default: false
  end
end
```


## Payload

Similar to params, you can define the expected structure of the incoming request body
using the `payload` method. As in the case of `params`, Attributes are optional
by default, so mark them as required if they must be present so Praxis can
validate them for you.

```ruby
action :create do
  routing { post '' }
  payload do
    attribute :title, String, required: true
    attribute :text, String, required: true
    attribute :author do
      attribute :id, Integer, required: true
    end
    attribute :tags, Attributor::Collection.of(String)
  end
end
```

Give that payload definition sending the
following request body with an 'application/json' content type will pass
validation:

```ruby
{
  "title": "Why I Ditched My Co-Working Space",
  "text": "Last summer I tried the start-up dream. I moved into...",
  "author": {
    "id": 29
  }
}
```

Note that unlike other frameworks like Rails and Sinatra, Praxis explicitly
distinguishes payload parameters from URL parameters (path and query string
parameters). Be sure not to expect any parameters coming from the request body
in the `params` accessor. Request body parameters will only appear in
`payload`.

### Payload inheritance

It is common practice (especially in RESTful APIs) to be able to accept incoming resource payloads that closely match outgoing resource responses receive from the same API. For example, if you get a blog MediaType from a show action, it is nice to easily modify parts of it, and re-POST it to the API to save some changes. To help with this, Praxis will maps any payload attribute definition of any action to its corresponding attribute of the default MediaType of the Resource. By doing that, the designer can define attributes by name, without being required to specify the type and/or options that might exist in the associated MediaType.

In other words: Praxis will inject a `:reference` parameter to the payload, pointing to the defined default MediaType of the endpoint (refer to [MediaType](media-types) for more info). It is for this reason that the following `create` action payload definition is enough if the default MediaType of the corresponding `Post` resource has those same attribute names defined.

```
action :create do
  routing { post '' }
  payload do
    attribute :title, required: true
    attribute :text, required: true
    attribute :author
    attribute :tags
  end
end
```

Also, know that you can mix and match the inherited attributes with other ones that do not exist in the MediaType. For example, the above payload can also add a new attribute called `:hidden` which includes its type, description or any other options it requires.

TODO: MultiPart payloads!!
## Headers

Action definitions can call out special request headers that Praxis validates
and makes available to your actions, just like `params` and `payload`.  Use the
`headers` method with the attributor interface for hashes to define request header
expectations:

```ruby
action :create do
  routing { post '' }
  headers do
    key "Authorization", String, required: true
  end
end
```

In addition to defining a header `key` in the standard `Hash` manner, Praxis
also enhances the DSL with a `header` method that can shortcut the syntax for
certain common cases. The `header` DSL takes a String name, and an optional type or expected value:

* if no value is passed, the only expectation is that a header with that name is received.
* if a Class is passed, it is used as the type to coerce the header value to.
* if a Regexp value is passed, the expectation is that the header value (if exists) matches it
* if a String value is passed, the expectation is that the incoming header value (if exists) fully matches it.

Note: specifying both header type *and* value is not supported with the `header` method. If you need to use a non-String type and validate the contents in some other way, use the standard `key` method instead.

Any hash-like options provided as the last argument are passed along to the
underlying `Attributor` types. Here are some examples of how to define header expectations:

```ruby
headers do
  # Defining a required header
  header "Authorization"
  # Which is equivalent to
  key "Authorization", String, required: true

  # Defining a non-required header that must match a given regexp
  header "Authorization", /Secret/
  # Which is equivalent to
  key "Authorization", String, regexp: /Secret/

  # Defining a required header that must be equal to "hello"
  header "Authorization", "hello", required: true
  # Which is equivalent to
  key "Authorization", String, values: ["hello"], required: true

  # Define a header that is cast as an Integer
  header "Account-Id", Integer
  # Which is equivalent to
  key "Account-Id", Integer
end
```

Using the simplified `headers` syntax can cover most of your typical definitions, while the native
`Hash` syntax allows you to mix and match many more options. Which one to use is up to you. They
both can perfectly coexist at the same time.


## Responses

All actions must specify the list of responses that they can return. Do this by
using the `response` method and passing a response name, as well as any additional arguments if applicable.

```ruby
action :create do
  routing { post '' }
  response :on_a_break
end
```

Praxis already provides a set of common responses to work with, but an
application can register its own custom responses too. Each registered response
has a unique name which is the name to use in the call to `response`.

If the controller for this action can explicitly return any of the common HTTP errors, its endpoint definition for the action must also explicitly list those responses. For example, if the controller for the `:show` action uses a "404 Not Found" to indicate that a given resource id is not present in the DB, the response `:not_found` must be defined in its list of responses. Another way to see this requirement is that any response class that any controller action can return, must have its name listed in the allowed responses of its endpoint definition.

For more information, please see [Responses](responses).


