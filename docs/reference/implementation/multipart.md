---
title: Multipart Types 
---

Praxis does not only have multipart support for the design of your API, but it also provides some classes that allow you to read and generate proper multipart structures. The majority of that is still encapsulated in the `MultipartArray` class, the same one used in the design pieces.

## Multipart Responses

Praxis also provides support for generating multipart responses. In particular, Praxis provides:

- an `add_parts` accessor in `Praxis::Response` to add parts to be returned in
  a response.
- a `parts` accessor in `Praxis::Response` to list the parts contained in a
  response.
- a `Praxis::MultipartPart` class to represent and format individual parts

Here's an example of how to create a multipart response containing two parts named 'part1' and 'part2', oth use the 'text/plain' Content-Type. NOTE: We're assuming the structure of the multipart body to return is defined in a class elsewhere (i.e., `MyDefinedMultipartResponseClass`), and that obviously the Parts we're adding will correspond and be valid according to that.

```ruby
# This response directly defines a 200 status and a media_type of multipart/form-data
response = Praxis::Responses::MultipartOk.new
response.body = MyDefinedMultipartResponseClass.new

plain_headers = {'Content-Type' => 'text/plain'}

part1 = Praxis::MultipartPart.new("this is part 1", plain_headers)
response.add_part("part1", part1)

part2 = Praxis::MultipartPart.new("this is part 2", plain_headers)
response.add_part("part2", part2)
```

There is a specialized `MultipartOk` response class is used to easily return a `MultipartArray` body.
It just simply takes care of properly encoding the body as "multipart/form-data", with a proper "Content-Type"
header specifying the boundary of each part. The response is registered as `:multipart_ok`.

Upon rendering, this response class will also take care of properly dumping each parts according to its "Content-Type" header, using any applicable handlers registered with Praxis. See [`Handlers`](../internals/handlers/) for more details on how to define and
register custom handlers.

## Parsing multipart object

If we are trying to inspect an instance of a `MultipartArray` (i.e., a `request.payload` object when that's defined a one), we have two options:
* retrieve a part by name using `.part(name)` method. This usually results in a single `MultipartPart` instance. However, you will get an array of `MultipartPart` instances, if such part has been defined with the `multiple: true` option
* consider the object as an array of parts, and use the standard Ruby `Array` and `Enumerable` methods. In this case you will get an instance of `MultipartPart` everytime (potentially with repeated part names if there were indeed multiple part with the same name).

## Crafting MultipartArray objects

To create a `MultipartArray` instance we can simply instantiate the object from the class, and start adding `MultipartPart` instances through use `push(part)` or `push(*parts)`. Doing so it will validate the part names and coerce any headers and payload as applicable.

The `MultipartPart` object have the following methods:
  * `payload`: the part body data
  * `headers`: hash of headers
  * `name`: part name
  * `filename`: filename, if applicable

Here you have an example action that shows how to read and genarate multipart payloads. This silly action will loop over the parts received in the action, and will generate an outgoing multipart response that has as many parts as received. Each of the generated parts will have a simple string body and a `Special` header as well.  Note that this assumes the `bulk_create` action has been defined as receiving a `MultipartArray` payload, which supports the `.each` method to loop over the individual parts.

```ruby
def bulk_create
  self.response = Praxis::Responses::MultipartOk.new
  # For demonstration purposes, reach out to the multipart type defined for this action
  # and instantiate it here. Typically this type would probably be defined and reused from elsewhere
  self.response.body = request.action.responses[:multipart_ok].media_type.new

  # Loop over each incoming part, and generate an outgoing part for each
  request.payload.each do |part_name, part|
    part = Praxis::MultipartPart.new("the part body", name: part_name, {'Special' => 'header'})

    response.add_part(part_name, part)
  end
  
  response
end
```
