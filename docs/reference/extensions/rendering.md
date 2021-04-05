---
title: Rendering
---

The `Rendering` extension adds `render` and `display` helper methods to controllers. These functions reduce common boilerplate when producing rendered representations of media types and setting response "Content-Type" headers.

In particular, one should almost exclusively call `display`, as it is a wrapper to the underlying `render` method.

## display

The display instance method of controllers, take an object (or a collection of objects) to render, and an optional `include_nil` and `encoder` parameter.

The logic of this function is very simple:
* it loads the default mediatype identifier for the controller (i.e., maybe 'application/vnd.user')
* it enhances the the mediatype with the encoder. For example: 'application/vnd.user+json' for a json encoder
* sets the `Content-Type` header to that enhanced identifier for the current action response response.
* calls the underlying `render` with the received `object` and `include_nil` option
* assigns the render result to the current `response.body`
* and returns the response

Here's essentially the full definition and body of the method:

```ruby
    def display(object, include_nil: false, encoder: self.default_encoder )
      identifier = Praxis::MediaTypeIdentifier.load(self.media_type.identifier)
      identifier += encoder unless encoder.blank?
      response.headers['Content-Type'] = identifier.to_s
      response.body = render(object, include_nil: include_nil)
      response
    end
```

The `encoder` parameter can dictate the type of encoding format to render the output with. This encoder must be a valid value that matches one of the registered handlers. For example: 'json'. This defaults to the value of the `default_encoder` method, so we can easily build controllers that easily include or inherit that function, which returns the right value.

The `object` parameter can be one or more instances of the objects that contain the data to render. Seen `render` below for more details on that and the `include_nil` parameter.

## render

The render function is in charge of taking the incoming `object` parameter and recursively render all required fields based on the attached mediatypes, and the required fields requested by the client. Rendering in these terms means to produce native Ruvy array and/or hash objects and are suitable for converting into the right encoder later (i.e., JSON, XML, etc..)

To achieve that, the render method will load the incoming object (or objects if it's an array) into the corresponding mediatype structure (as from `Controller#media_type`) and will recursively render them using the expanded subtree structure provided by the `Controller#expanded_fields` method (which is added by the rendering extension). This expanded fields logic is capable of calculating which fields (and recursive fields out of relationships) that must be rendered based on the fields that the API client requested through the well known `fields` parameter, and the `default_fieldset` defined in each of the Mediatypes. Think of this as calculating a tree of attributes and relationships to surface while rendering.

The `object` parameter passed to render can be an array, in which case an array will be rendered. Each of the objects passed in must be `loadable` (i.e., compatible) with the Controller default mediatype, which essentially means that they simply need to respond to methods that match the attribute names, and obviously return compatible values. 

It is worth noting that loading the media type, will effectively always wrap the passed object with an instance of the MediaType's domain model. Obviously we we already passed an instance of the domain model, nothing will be wrapped. Also, if we don't pass an instance but a Ruby hash/String we will wrap it by coercing in to the attribute type.

The convenience of this wrapping is that it makes it very easy to just pass lower-level results (i.e., model instances) and be sure that our resources will properly end up wrapping them before rendering (i.e., the resources are the ones that respond to all of the proper attribute methods that relate to MediaTypes attributes)

Finally, the `include_nil` parameter (which defaults to false) can dictate if we want to ouput attributes that have nil values. For APIs that can be built with the assumption that a non-existing known attribute means it is set to nil, this flag can help greatly reduce the size of responses. For clients that always need to receive all possible attributes, even if they're nil, you can always render it passing false.


## Example

To summarize, the most common way to utilize this extension is to simply gather the model instances from your datastore, and pass them up to the `display` function. For example, here's a basic show action implementation:

```ruby
  def show(id:, **_args)
    model = Post.where(id: id)).first
    return Praxis::Responses::NotFound.new if model.nil?

    display(model)
  end
```

If this `show` action relates to an endpoint definition that defines a `MediaType::Post` mediatype, and such mediatype has defined `Resources::Post` as its domain_object, then this is what will happen:
* the rendering functions will call `MediaType::Post.load(object)`
* which first will wrap and return an instance of its domain_model `Resources::Post.new(object)`
* and then the rendering code will call the same method name as the attribute to render on that domain_model instance.

To use this extension, include it in a controller with `include Praxis::Extensions::Rendering`. Note that this is automatically included by things like the `Mapper::Plugin`.

