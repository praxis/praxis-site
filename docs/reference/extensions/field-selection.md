---
title: Field Selection
---

One of the most important Praxis extensions is the ability to select which fields of the response objects you want to receive. Using this extension, an API client is able to fully specify (through a graphQL syntax) which fields to retrieve. This functionality, along with the GraphQL syntax allows you to recurse as deep as you need it to describe the complete tree of data that you want to retrieve using a single API request.

The functionality is achieved by exposing a well known `fields` query string parameter which is typically available to any `index`, `show` actions, but that can technically be available in any other action as well. 

Before getting into the details, let's take a look at an example of how the client can use this functionality. Let's assume we're putting together an API that serves `Post`s which have things like `id`, `title`, `content`, etc. Also let's assume each of these posts has a list of associated `Comment`s, which have attributes like `message`. Furthermore let's assume that each `Comment` belongs to an associated `User`, which has things like `first_name` or `email`.

If we wanted to retrieve, in one single API call, the list of all Posts's contents, along with all of their embedded comments, and for each of them, also include the first name of the user that made them, we would be crafting the following GraphQL syntax string in the value of the `filters` parameter:

```shell
curl 'http://localhost:9292/posts?api_version=1' -G \
      --data-urlencode "fields=id,content,comments{user{first_name}}"
```

TODO: example output?

Now, while from a point of view of the client, this only seem to have implications on the rendering of the fields returned in the API request, achieving such a result has much deeper implications. In particular, there are a series of events that need to happen to make sure we can map those attributes to the right DB tables and columns, that the right DB queries are crafted to retrieve all the required data (and no more) and that that these can perform in an efficient matter. Therefore the field selection extension, as a concept is very much linked to the Rendering and the Automatic Querying extensions. In other words, the querying extensions needs to understand the tree of data that it is required to retrieve, and the rendering extension needs to make sure to render these required fields.

So anyway, let's get into how you define and use the field selection. The first thing is define the `fields` parameter to any actions that you need

## Defining the fields parameter

To allow field selection abilities in an action, Praxis provides a bundled type class, which you can directly use: `Praxis::Types::FieldSelector`. Here's how you'd define the field selection query string parameter for an action that returns `Post` mediatypes:

```ruby
attribute :fields, Praxis::Types::FieldSelector.for(MediaTypes::Post),
            description: 'Fields with which to render the result.'
```

In particular, using the `.for(<MT>)` method, this class is gonna be able to understand that the syntax allowed for this field can contain any of the defined attributes for a `Post` media type, including any further recursion of those attributes down into other related media types of `Post`. For example, it will properly validate and decode incoming field strings like `fields=id,contents,comments`, but it will generate a validation erro if you pass things like `fields=this,is,not,right`. 

Note that the power of this embedded FieldSelector type is that you don't have to worry about defining any allowed attributes. The type will assume you want to allow to request fields with the same exact names as the media type attribute tree. If for whatever reason you wanted to define a different field name mapping, you can look at the underlying `FieldSelector` type (without using the `.for` method), and craft whatever you need for your purposes. Praxis recommends, however, to be very consistent with names, so please use the provided types as it makes for a confusing API when things don't properly align.

## Using the fields parameter

TODO: ... talk about the includes etc...

So, now that we have a type that is able to validate and coerce the fields string into a proper class, we need to be able to use it for both retrieving the necessary data, and to render the appropriate fields in the response.

To make proper use of this type the best is to simply use `Mapper` and `Rendering` extensions. In fact, the best is to simply configure the `MapperPlugin` which brings both of these extensions. Combined, they are able to take care of those things for you, in an efficient way, by just adding a couple of lines in our controller action. For example, here is how to implement the `index` action for Posts, which fully supports field selection parameter if defined in the endpoint:

```ruby
    def index
      objects = build_query(:Post).all
      display(objects)
    end
```

The `build_query` code will craft the necessary efficient queries based on the required fields, and the `display` method will take care of rendering the results based on them


## Internals of the FieldSelector type

TODO: Move to internals???