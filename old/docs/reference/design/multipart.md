---
title: Multipart
---

Praxis has built-in support for defining and handling "multipart/form-data" requests and responses ([rfc2388](https://www.ietf.org/rfc/rfc2388.txt) & friends). This support is mostly provided by the underlying `Praxis::Types::MultipartArray` type, and the `Praxis::Responses::MultipartOk` response.

The `MultipartArray` type is the main piece of code use to handle decoding/encoding multipart structures. It is typically used to define the structure of incoming multipart payloads, as well as used to create proper multipart bodies in API responses. In particular, it is a type defined as a `Attributor::Collection` of `Praxis::MultipartPart` type members that allows you to describe each part of a multipart request or response body.

The `MultipartOk` response class (and corresponding template) is a simlple thin layer on top of the `Ok` response that makes it easier to compose multipart responses in your controllers.

## Designing Multipart structures

The `MultipartArray` is a fully compatible `Attributor` type, that can:
* load, coerce and validate incoming multipart payload bodies, transforming them in instances of `MultipartArray`
* use the `MultipartArray` features to generate fully multipart objects that are ready to be sent as response payloads. 

The `MultipartArray` dsl allows defining its inner parts in several ways. The most common way is to list out the structure of each of the expected parts. And this can be done, with the `part` DSL, which explicitly the structure each of the parts will have. This can be done for each explicit part name, or it can be done in groups, as defined by a regexp on the name. The name regexp method allows to define the same structure for multiple parts that match the same name regexp (very useful when you might be receiving an unknown list of related parts for which you cannot know the name in advance).

It is common for multipart bodies to contain parts that are to be treated as files. For that you can annotate a part with `filename: true` or simply use the `file` DSL instead (they are equivalent).

Defining each type follows the rules of any other attribute definition you're used to crafting in any Media Type or action payload/parameter definition. Therefore it accepts common options like `:description` or `:required`, `:default` etc...Like any other attribute, the type of a part can be any `Attributor` type. This means you can define a part to be a simple `String` (maybe even with some expected regexp check), a `Struct`, a `Hash` or any other type that you are used to having.

Here's a made up example of a large multipart payload that showcases different ways to use the DSL:

```ruby
class NamedPartsExample < Praxis::Types::MultipartArray
  # a simple part named "title" with default payload type (i.e., a String)
  part 'title'
  # a part named "uri" with a URI payload
  part 'uri', URI
  # a part named "contents" 
  part 'contents' do
    # that should have a Content-Type header of "application/json"
    header 'Content-Type', 'application/json'
    # and be loadable as a Hash
    payload Hash
  end
  # zero or more parts with names ending in "_at" must contain DateTimes payloads
  part /_at$/, DateTime
  # a summary part, which is required
  part 'summary', String, required: true
  # zero or more parts whose name matches /nam/, with String payloads that must match Bob
  part(/nam/, String, regexp: /Bob/i)
  # zero or more parts whose name matches /stuff/ that contain objects loadable as Hashes
  part /stuff/ do
    payload Hash
  end
  # potentially multiple parts named 'files', each of which are expected to have 
  # contain an octet-stream, a filename (matching /file/) and loaded as a tempfile
  file 'files', multiple: true do
    header 'Content-Type', 'application/octet-stream'
    filename String, regexp: /file/
    payload Attributor::Tempfile
  end
  # a thumbnail part with a filename attribute, which will be loaded as a tempfile
  file 'thumbnail', Attributor::Tempfile
  # an part named image with a filename attribute, which will be loaded as a tempfile
  part 'image', Attributor::Tempfile, filename: true
end
```

So in general you can use the following features when defining `MultipartArray`s:
  * `part <STRING>` is the DSL to define the structure of a part by explicit name
  * `part <REGEXP>` is the DSL to define the structure of any part whose name matches the regexp
  * `file <STRING>|<REGEXP>` is an alias to `part` which explicitly adds the `filename: true` option.

The `part` (or `file`) DSL, accepts multiple options. In particular:
  * `required` if true, the loading and validation will fail if that part isn't provided
  * `multiple` if true, it will allow collecting multiple parts with the same exact name. When this option is set the corresponding part becomes an array.

The type of the payload of a part is defined by providing a block. Each of the underlying part structures will be backed by the `MultipartPart`-derived class. This block can define the following expected characteristics for the part structure:
  * `header`: defines an expectation for that part to have a header matching the name, and possibly a regexp  (syntax is the same as defining a String attribute). Note you can define multiple headers by adding muliple lines.
  * `filename`: define an expectation on the filename attribute of the part (syntax is the same as defining a String attribute)
  * `payload`: define the expected type of the payload (syntax is the same as defining any attribute in a mediatype or payload)
  
NOTE: For simple type payloads with no other expectations, you can use a type directly as the first parameter on the `part`, and skip any further block definition. Look at some examples above (i.e., the `uri` or `title` parts).

While uncommon, it is also possible to define a multipart payload in a much more fuzzy manner. This can be achieved by not using the `part` or `file` DSL at all, but simply using `name_type` and `payload_type` as a way to define multipart content where all parts are identical in payload structure. It is probably not very common at all to go this route, as dynamic parts can be probably be more clearly defined using the `part` DSL with a name regex. But just for completeness, here is an example of how to use these methods to define that all part names are of type `String` and all the part payloads are of type `Hash`:

```ruby
class SimpleExample < Praxis::Types::MultipartArray
  name_type String
  payload_type Hash
end
```

Using `String` as the type name means that Praxis will not perform any validation or coercion on part names. Also
both `name_type` and `payload_type `are optional and not specifying one is equivalent to using the `String` type.


Here is a more less convoluted example of defining a multipart type that defines several
parts in different ways:

```ruby
class ImageUpload < Praxis::Types::MultipartArray

  # Image author, loaded (and validated) as pre-defined Author type  
  part 'author', Author, 
    required: true, 
    description: 'Authorship information'  
  
  # Set of tags, as strings. May be specified more than once.
  part 'tags', String,
    multiple: true, 
    description: 'Category name. May be given multiple times'

  # Any part whose name ends in '_at' should be a DateTime
  part /_at$/, description: 'Timestamp information for the set of files' do
    payload DateTime
  end

  # The parser will save uploaded file as a Ruby Tempfile.
  # Note: This maps to the Attributor::Tempfile type.
  part 'image', Tempfile, 
    required: true,
    filename: true, 
    description: 'Image to upload'

  # Ensure the incoming thumbnail is a jpeg with proper filename'
  file 'thumbnail', description: 'Image thumbnail, must be jpeg' do
    header 'Content-Type', 'image/jpeg'
    payload Attributor::Tempfile
    filename values: ['thumb.jpg']
  end

end
```

## Returning Multipart Responses

In the same way that we have support for designing incoming multipart payloads for our actions, Praxis also allows you to define multipart payloads of responses of your actions.

To do so, you can take advantage of the `:multipart_ok` response template. As we previously said, this is a simple template wrapper for a `200 Ok` response, but that defines a `MultipartArray` as its default mediatype type.

With that defined, you can any action can use a `response :multipart_ok ...` by:
* directly passing an already `MultipartArray`-derived type to it. 
* or by passing the generic type, and fully defining one inline with a block.

Here's how you could reuse an already defined type (i.e., our `ImageUpload` type above) for it:

```ruby
response :multipart_ok, ImageUpload
```

And here's how you'd define the multipart type inline:

```ruby
response :multipart_ok, Praxis::Types::MultipartArray do
  part 'name', String
  part 'timestamps' do
    attribute 'created_at', DateTime
    attribute 'updated_at', DateTime
  end
  part 'address', Address
end
```