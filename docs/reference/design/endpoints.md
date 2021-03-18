---
title: API Endpoints
---

With Praxis, you can define all of the API endpoints that your API provides. An enpoint is commonly a set of API actions that are related to a given resource type or related set of actions. i.e., the Users endpoint might define all the actions to list/create and update users.


Defining an endpoint is done by creating a class that derives from `Praxis::EndpointDefinition`. Using this class you will be able to define all of the aspects of your endpoint including versioning, description, all actions, with their parameters, routing, responses, authentication, etc.

Here's a simple example of a `Blogs` endpoint definition which provides actions related to the `MediaTypes::Blog` media
type. 

```ruby
class Blogs
  include Praxis::EndpointDefinition

  media_type MediaTypes::Blog
  version '1.0'

  description <<-EOS
    Blogs is the Resource where you write your thoughts.

    And there's much more I could say about this resource...
  EOS

  action :index do
    routing { get '' }
    description 'Fetch all blog entries'
    response :ok, Praxis::Collection.of(MediaTypes::Blog)
  end

  action :show do
    routing { get '/:id' }
    description 'Fetch a single blog by id'
    params do
      attribute :id
    end
    response :ok
  end

  action :create do
    description 'Create a new Blog'
    routing { post '' }
    payload reference: MediaTypes::Blog do
        attribute :title
        attribute :description
    end
    response :created
    response :bad_request
  end
end
```

At a glance, we have defined that this endpoint will respond only to Api version "1.0", it has a description, uses a
routing prefix of "/blogs", and exposes simple `:index`, `:show` and `:create` actions.
The `:index` action returns a collection of blogs and does not take any parameters. The `:show` action takes an id parameter and returns a single Blog mediatype. While `:index` and `:show` respond to HTTP GET verbs, the `:create` action responds is accessible through a `POST /blogs`, and can take a payload that contains a title and a description field. Successful requests will return a 201 created HTTP code, while sending a bad parameters will cause a 400 Bad Request response with the body containing the cause.

Let's dig into the different configuration pieces available when defining endpoints

## Description

You can specify a description for the endpoint definition using the `description`
method. This description string is just for human consumption and is simply inserted directly into to the generated API documentation.

```ruby
class Blogs
  include Praxis::EndpointDefinition
  description <<-EOS
    Blogs is the Resource where you write your thoughts.

    And there's much more I could say about this resource...
  EOS
end
```

## Routing Prefix

Each endpoint definition has a routing prefix (partial path) which Praxis will
automatically prepend to all of the routes found in all of the actions of its resource. By default, this
prefix is the class name of the endpoint definition converted to snake-case.
For our `Blogs` endpoint definition above, the default routing prefix is
`blogs`. To override the default routing prefix, simply provide a value using the `prefix` method:

```ruby
class Blogs
  include Praxis::EndpointDefinition

  prefix '/my-blogs'
end
```

## Media Type

Since endpoints usually group a collection of actions that are related to a type, you can set the "default" media type of a endpoint definition. This way, if the majority of actions return the same mediatype, you don't need to repeat it as much.

```ruby
class Blogs
  include Praxis::EndpointDefinition

  media_type BlogMediaType
end
```

A MediaType in Praxis is often more than just an Internet media-type string.
It commonly refers to the structure or schema with which a given resource type
will be displayed. This structure is also often associated with an Internet media-type string (i.e.
the string is the `name` for the structure schema).

The value you pass to the media_type method must be a:

* Praxis::MediaType-derived class that defines the attributes 
  available for representing an API resource.
* string representing an Internet media type identifier (i.e.
  'application/json').

For more information on Praxis media types, please see [MediaTypes](media-types).


## Version

You can apply an API version to a endpoint definition by using the `version`
method:

```ruby
class Blogs
  include Praxis::EndpointDefinition

  version '1.0'
end
```

Setting the version of a endpoint definition allows you to have version control
over the resources available through the API.

You can use any string as a version. By using the version method, you're
telling Praxis to only dispatch actions for this resource when the incoming request
carries the correct version value.

An incoming request can specify a version in three different ways:

* By providing an `X-Api-Version` header containing the defined version string. Example: `X-Api-Version: 1.0`
* By providing an `:api_version` parameter in the query containing the defined version string. Example: `/blogs?api_version`
* By using an appropriate URL prefix. Example: `/v1.0/blogs`

You can read more about how to configure the allowable ways to version the API in the [API definition](api-definition) section

## Parent Resource

Often times, we want to expose certain API resources embedded into others. For this reason, Praxis provides an easy way to define the parent of a resource by using the `parent` directive. This will configure the resource to use its parent's `canonical_path` as the base for all of its actions (in addition to any `prefix` you may define on this resource). By default, a canonical path is the `:show` action of an endpoint (but can be changed using the `canonical_path :<action_name>` method in the definition)

Additionally, any parameters in the parent's route will also be applied as defaults in the child. The last route parameter is assumed to be an 'id'-type parameter, and is prefixed with the parent's snake-cased singular name. I.e., `id` from a `Blog` parent will be renamed to `blog_id`. Any other parameters are copied unchanged.

This behavior can be overridden by providing a mapping hash of the form { "parent_name" => "child_name" } to the `parent` directive.

For example, to define a `Posts` subresource of the above `Blogs` resource:

```ruby
class Posts
  include Praxis::EndpointDefinition

  parent Blogs

  action :show do
    routing { get '/:id' }
  end

end
```

This would result in the `:show` action responding to the following path `/blogs/:blog_id/posts/:id`, due to the canonical path of the `Blogs` resource being `/blogs/:id`.

To achieve a custom parent parameter we could have used: `parent Blogs, :id => :parent_id` instead, which would have resulted in the following path: `/blogs/:parent_id/posts/:id`.


## Action Defaults

There are often situations where many actions within a endpoint will
require a common subset of definitions. For example, a common set of URL parameters,
a common set of headers, traits or even a common set of allowed responses.

Praxis allows you to easily define and share common pieces of code across all actions
by placing their definitions inside an `action_defaults` block at the endpoint definition level.
Here is an example:

```ruby
class Blogs
  include Praxis::EndpointDefinition

  action_defaults do
    params do
      attribute :dry_run, Attributor::Boolean, default: false
    end
    response :bad_request
  end

  action :index do
    routing { get '' }
  end

  action :show do
    routing { get '/:id' }
    params do
      attribute :id, String
    end
  end

end
```

The example above will cause the the `:dry_run` parameter to be propagated and
defined in all available actions of the `Blogs` endpoint definition (i.e., both
`:index` and `:show` actions will have such a parameter).

With `action_defaults` you can use `params`, `payload`, `headers`, and
`response` stanzas to propagate definitions to all existing actions.
If any of those stanzas are defined within an action itself Praxis will
appropriately merge them. Therefore, in this example, the `:show` action will
end up with both the `:dry_run` and `:id` parameters.

In case of conflict while merging, Praxis will always give overriding preference
to definitions found within the action block itself.


## Canonical Paths

By default the canonical path for an endpoint will point to the routing path of the `:show` action. However, you can specify which action should be used for the resource's canonical href with the `canonical_path` method:

```ruby
class Blogs
  include Praxis::EndpointDefinition

  canonical_path :show
end
```

Having the appropriate `canonical_path` allows you to both generate and parse hrefs for a given resource by using:

  * `EndpointDefinition.to_href(<named arguments hash>)` to generate an href for the resource.
  * `EndpointDefinition.parse_href(<href String>)` to get a type-coerced hash of the parameters for the canonical action from the given string.

Given a controller (class or instance), you can use use those helpers by first calling its its `definition` method to retrieve the `EndpointDefinition` it implements, and then using either `to_href` or `parse_href` as described above.

## nodoc!

TODO:  DEPRECATE IT??
You can mark a resource for exclusion from generated documentation by using the `nodoc!` method:

{% highlight ruby %}
class Blogs
  include Praxis::EndpointDefinition

  nodoc!
end
{% endhighlight %}

Additionally, the resource's actions and media type (if specified) will not be used when determining which media types should be documented.


The next big thing to expore is how we can define each of the specific actions for the endpoint. 
