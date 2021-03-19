---
title: Responses
---
Praxis allows API designers to define the set of response templates the
application can return. By designing a response, you are describing a set of
expectations about its structure and attributes. You then give it a name and
tell Praxis about it using `response_template`.

Here is an example of how to design a response definition:

```ruby
ApiDefinition.define do
  response_template :ok do
    description 'An ok response refers to a successful outcome'
    status 200
    media_type 'application/vnd.acme.user'
    headers name: 'X-Header1', value: 'foo', description: 'This is a very nais header, which has value foo'
    headers name: 'X-Header2', value: /bar/, description: 'This header contains the bar string'
    headers name: 'X-Some-Stuff', value: nil, description: 'This only requires the header to exist, with any value'
  end
end
```

This creates a response definition named `ok` with a human-readable description which will be rendered in the API documentation. With this we are declaring that this response will:

* have a status code of 200
* return an `application/vnd.acme.user` media type (the value of the Content-Type header)
* contain, at least, the following two headers:
  * `X-Header1` which must always match a literal value "foo"
  * `X-Header2` which must always match the regular expression `/bar/`
  * `X-Some-Stuff` which can have any value

Any action may refer to a response by name when declaring its list of expected
responses. For example, here is a snippet of an action describing
that it can return the `ok` response defined above.

```ruby
# somewhere in a resource definition...
action :index do
  routing { get '' }
  response :ok
end
```

See [ActionDefinitions](../resource-definitions/) for more information about
how to specify which responses an action can return.

Having response templates that have all fields statically defined like our example above, make it more difficult to reuse accross actions. For example, you may want to use the `ok` definition above for an action that returns an a media-type other than `application/vnd.acme.user`.

For this reason, response definitons are parameterizable via block parameters.
For example, introducing a `media_type` parameter in our previous `ok` response
could be done like this:

```ruby
ApiDefinition.define do
  response_template :ok do |media_type: 'application/vnd.acme.user'|
    description 'An ok response refers to a successful outcome'
    status 200
    media_type media_type
    headers name: 'X-Header1', value: 'foo', description: 'This is a very nais header, which has value foo'
    headers name: 'X-Header2', value: /bar/, description: 'This header contains the bar string'
    headers name: 'X-Some-Stuff', value: nil, description: 'This only requires the header to exist, with any value'
  end
end
```

Parameterized responses allow you to reuse registered responses in action definitions with some flexibility:

```ruby
# somewhere in a resource definition...
action :index do
  routing { get '' }
  response :ok, media_type: 'application/custom'
end
```

This example response definition has not just a `media_type` parameter but
also a default value of 'application/json'.  This allows you to override the
`media_type` only when necessary. If you don't specify the `media_type`,
you'll get `application/json`. If you don't specify a default, you will have to
explicitly pass a value in every action that uses this response definition.

## Preregistered Responses

Praxis comes with many common response definitions pre-registered. All of them
also have customizable parameters. Here is how the basic `200 Ok` response is defined. Note that one can add or override not just the mediatype but also, the location, any header expectations and even the description.

```ruby
response_template :ok do |media_type: nil, location: nil, headers: nil, description: nil|
  status 200
  description( description || base_description ) # description can "potentially" be overriden in an individual action.

  media_type media_type if media_type
  location location if location
  headers&.each do |(name, value)|
    header(name: name, value: value)
  end
end
```

And there are many others. In particular, Praxis automatically creates a
response definition for every Response class in
[responses/http.rb](https://github.com/praxis/praxis/blob/master/lib/praxis/responses/http.rb).
Each of those definitions will have the name and status code specified in the
`self.response_name` and `self.status` of those classes.

You can use any of these response definitions within your application without
having to register them yourself. You can also override any of them with your
own definition if the default one does not suit your needs.

## Defining Response Expectations

When defining a response, you may include expectations for: status code,
headers, location, media_type and multipart parts.

All expectations in definitions are optional and potentially parameterizable
with the exception of status code. A status code must always be defined and set
statically. It is possible for multiple responses to share the same status code
as they might differ in other expectations (i.e. different headers) which may
be enough to warrant a different name.

### Headers

The `header` DSL in a response definition is how we can define expectations on the returned headers of a response. There are three types of expectations we can define:

* Expecting to see a header with a given name, without specifying anything about its value.
* Expecting to see a header with a given name, specifying that its contents will have a literal match to a specific value.
* Expecting to see a header with a given name, specifying that its contents will match a given regular expression.

Here's an example of each type of header definition:

```ruby
ApiDefinition.define do
  # header field set with a String
  response_template :found do
    status 200
    headers name: 'X-Header1', value: 'foo', description: 'This is a very nais header, which has value foo'
    headers name: 'X-Header2', value: /bar/, description: 'This header contains the bar string'
    headers name: 'X-Some-Stuff', value: nil, description: 'This only requires the header to exist, with any value'
  end
```

### MediaType

Use the `media_type` method to set expectations for the media type of a response. The `media_type` method can accept:

* a string indicating the full Internet media type identifier
* a complete Praxis MediaType class

For example:

```ruby
# Praxis media_type
class ExampleMediaType < Praxis::MediaType
end

ApiDefinition.define do
  # String media_type
  response_template :found do
    status 200
    media_type 'application/json'
  end

  # Praxis::MediaType
  response_template :found do
    status 200
    media_type ExampleMediaType
  end

  # Media type passed in via a required named parameter
  response_template :found do |media_type: |
    status 200
    media_type media_type
  end
end
```

Using a string for the media-type is equivalent to defining the 'Content-Type'
header with a string value. The reason for providing a media-type DSL is just a
convenience since (just like `Location`) it is a common header to use.

### Location

A response definition can directly define a 'Location' header using the
`location` method. This method can accept the same value matchers as any other
headers. In fact, underneath, the location method will call the `header` with `name: 'Location'`. As such, it can also take a description

```ruby
ApiDefinition.define do
  response_template :redirection do
    status 302
    location 'http://www.example.com', description: 'Response to redirect you home'
  end

  response_template :created do
    status 202
    location /api/
  end
end
```

### Multipart responses

TODO!! Should we get rid and/or simplify multipart responses????


Praxis also allows you to define that a given response will be of multipart type. Not only that, but it also allows to define expectations on the individual parts of the multipart response. You can do this by using the `parts` DSL.

Currently, the `parts` DSL only allows you to define a common template
definition to which *all* parts must comply. In the future, we will extend the
DSL to allow you to define different expectations for each individual part.

The DSL lets you define parts as if they were complete
sub-requests. This can be done in either of the following ways:

* pass a block with a full response definition. This allows you to define a
  part inline, as if it were a new and complete sub-request.
* pass a ```like``` parameter which names an existing response definition

Since a multipart part does not have a status code, Praxis will enforce the
expectation by looking at the value of a special 'Status' header. The rest of
the fields (headers, location and media_type) are native fields of the part.

Here are two examples of how to add part expectations using both of these
approaches. Using a response block:

```ruby
ApiDefinition.define do
  response_template :bulk_create do
    status 200
    media_type 'multipart/form-data'
    parts do
      status 201
      media_type 'application/json'
      location  /my_resource/
    end
  end
end
```

Using the ```:like``` option:

```ruby
ApiDefinition.define do
  response_template :bulk_create do
    status 200
    media_type 'multipart/form-data'
    parts like: :create
  end
end
```

Obviously, good reuse of these definitions requires parameterization, so a more
realistic definition of a multipart response could look like this:

```ruby
ApiDefinition.define do
  response_template :bulk_response do |parts: |
    status 200
    media_type 'multipart/form-data'
    parts( parts )
  end
end
```

You could allow an action to customize parts using the ```like``` option or by
passing a full response definition block. Here are some more examples:

```ruby
# Using the :like option for parts like the :ok response
action :bulk_operation do
  routing { post '/bulk' }
  response :bulk_response, parts: { like: :ok }
end

# Using the :like option for parts like the :ok response, but also overriding
# the media-type of the :ok response
action :bulk_operation do
  routing { post '/bulk' }
  response :bulk_response, parts: {
    like: :ok,
    media_type: ExampleMediaType
  }
end

# Using a full response block definition
action :bulk_operation do
  routing { post '/bulk' }
  sub_request = proc do
    status 200
    media_type ExampleMediaType
    headers ['X-Foo','X-Bar']
  end
  response :bulk_response, parts: sub_request
end
```

The only reason to not pass the block directly in the response line is that
Ruby would never pass it to the `parts` parameter, but rather to the response
function. Splitting into a different line to create a `proc` looks cleaner than
adding the right parenthesis in one line.

For more information on multipart responses, please see
[Responses](../responses/).
