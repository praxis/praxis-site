---
title: Responses
---

The main goal for an API service is to return the right HTTP responses to the client. There are many different types API response, with many different HTTP codes, different types of payload encodings, headers...etc.

Praxis makes some of this easier by providing a response class for every existing HTTP response code. These classes are all defined within the `Praxis::Responses` module, and they are named based on their human http code message. For example, you can find the `Praxis::Responses::NoContent` to refer to a `204 No Content` HTTP response. See [this](https://github.com/praxis/praxis/blob/master/lib/praxis/responses/http.rb) file for their definition.

Here's an example of how to create a simple 204 response and save it in a `resp` variable:
```ruby
 resp = Praxis::Responses::NoContent.new
```

These instances of response object expose several different way to configure and manage pieces of their structure.

## Response Body

Many responses have a body: some useful content that is sent back to the user agent. You can easily set the body for a response by calling the `body=` writer of your instance. If your response has a body, then you should also set its `content_type=` so the user agent will know how to handle your data.

If you provide a String when setting the body body, Praxis will respond verbatim with the body and content-type header you have provided. If you provide structured data -- a Hash or an Array -- Praxis will analyze your response's `content_type` and encode your data using a suitable handler (and default to JSON if no specific handler seems appropriate).
See [Handlers](../internals/handlers/) to learn how to customize encoding.

```ruby
response.content_type = 'application/vnd.acme.greeting'
response.body = {hi: 'mom'}

# The user agent will receive a response like so:
#   Content-Type: application/vnd.acme.greeting+json
#
#   {"hi":"mom"}
```

Response encoding is performed by the `encode!` method of the Response base class;
custom responses may alter or supplant this behavior.

## Creating Custom Response Classes

While Praxis provides a Response class for all well known response codes, you can still decide to create or customize one for your purposes. To do so, this is what you need to do:

* create a class that extends `Praxis::Response`
* set the response name. This links your class to a response definition, the
  API design object.
* optionally set the class-level `status` value. If you don't do it here, you
  will need to set it in an initializer

Your new response class may then define/override the following methods, which will be invoked before sending the request to the client:

* `handle`: executes any business logic that needs to be done to complete the response data.
* `format!`: constructs the format of the response object. For example, it could transform the body object into a hash with appropriate attributes. The default `format!` behavior is to not modify the body.
* `encode!`: encodes the formatted contents of the request. For example, it could look at some aspect of the request to figure out how to encode the response into JSON or something else.

Here is an example of a custom response class:

```ruby
# As specified in RFC 2324 (seriously; look it up!)
class ImATeapot < Praxis::Response
  self.response_name = :tea_pot
  self.status = 418

  def handle
    # custom logic  (or nothing if the initialization defaults are enough)
    headers['X-TeaPot'] = 'MadeInJapan'
  end
end
```

*Note:* Each of the response classes you create in the runtime part of your application will need a corresponding response template defined in the design area that shares the same name. Make sure you use the `register_response` DSL that the ApiDefinition class provides. In this case, we would need to register a template named `:tea_pot`, which must match a status code of 418 and a 'X-TeaPot' header of value 'MadeInJapan'. See [Response Definitions](../design/response-definitions) for more information on how to do that. If you don't register a template for each of your classes, you will not be able to refer to them in your `response` stanzas of your actions in your EndpointDefinitions.


## Multipart Responses

Praxis also provides support for generating multipart responses. Please see [Multipart Responses](multipart) for how to do so.