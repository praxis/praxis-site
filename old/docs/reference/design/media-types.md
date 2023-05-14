---
title: Media Types
---

Media types provide the structural representation of the API resources we want to expose. They also commonly have an associated name (i.e., its identifier). 

How does that work? Let's take a look at an example. Let's say we want to expose Users in our API. In this case, our users MediaType could be defined by a structure that contains an `id`, `name` and `email`, and be represented by the following identifier `application/vnd.mycompany.users`. So in this case, if a client issues an API to retrieve a user, he will receive a response with `Content-Type: application/vnd.mycompany.users+json`, which indicates 2 different things: The first one is to indicat what type of attribute __shape__ the payload contains (i.e., `id`, `name` and `email` fields). The second one (denoted by the `+json` suffix) indicates that the returned structure is encoded using JSON. 

Praxis Media-Types are concerned only with the design aspects only (i.e., structure and name), and leaves any encoding concerns to the implementation part. So it is worth noting that a MediaType definition does imply any particular encoding (JSON vs XML...). 

So, how do we define these in Praxis? To define a media type for an API resource, we simply create a class that derives from `Praxis::MediaType`, where we can define its structure within the `attributes` section and give it a unique identifier name. A media type can also have a human-readable description, which will show up in any generated documentation.

Here's an example of a simple media type that describes a few attributes for a
hypothetical Blog API resource.

```ruby
class Blog < Praxis::MediaType
  description 'A Blog API resource represents...'
  identifier 'application/vnd.acme.blog'

  attributes do
    attribute :id, Integer
    attribute :href, String
    attribute :owner, Person
    attribute :subject, String
    attribute :locale do
      attribute :language, String
      attribute :country, String
    end
  end
end
```


## Description

You can specify a description for the media type using the `description`
method. This description string is just for human consumption and is simply inserted directly into to the generated API documentation.

```ruby
class Blog < Praxis::MediaType
  description <<-eos
    This is a sample blog.
    Which requires a much longer an elaborate description to be written.
  eos
end
```

## Identifier

The media type identifier method allows you to associate an internet media type
string with the MediaType definition. internet media types should typically be used as unique names (i.e., 'application/vnd.acme.blog') that way the client receiving the response knows exactly what structure to expect to find. However, it is not necessary to do so, and they can be also be left withot a name by using just an encoder string (i.e., 'application/json').

```ruby
class Blog < Praxis::MediaType
  identifier 'application/vnd.acme.blog'
end
```

Identifiers have an optional suffix that indicates the encoding format used to represent the media;
for instance, a blog could be represented as an `application/vnd.acme.blog+json` or a `+xml`
without changing its essential blog-ness. Identifiers can also have semicolon-delimited options
such as `text/html; charset=utf-8`..

In Praxis, media type identifiers are represented by the `MediaTypeIdentifier` class which parses
the identifier's components and makes them available as instance accessors: `type`, `subtype`,
`suffix` and `parameters`. Identifier objects can be compared, modified, fuzzy-matched against
broader or narrower types, and transformed back into strings.

```ruby
MediaTypeIdentifier.load('text/plain; charset=utf-8').parameters['charset'] # => "utf-8"
MediaTypeIdentifier.load('image/*').match('image/jpeg') # => true
```

## Attributes

The attributes section of the media type describes the full structure of the
resource representation. It describes the superset of all possible attributes
that can appear in any view that can be rendered.

The `attributes` method expects a block of attribute definitions:

```ruby
class Blog < Praxis::MediaType
  attributes do
    attribute :id, Integer
    attribute :href, String,        regexp: %r{/blogs/\d+}
    attribute :owner, Person,       description: 'Owner of this Blog'
    attribute :subject, String
    attribute :created_at, DateTime
    attribute :visibility, String,  values: ['public','private']
  end
end
```

Each attribute has a name, type, description and other specific configuration
options: allowed values, format, examples, etc. While some options, such as
`description` and `values` are always available for any attribute, different
attribute types support type-specific options: `min`/`max` values for Integers,
`regexp` for Strings, etc. 

Similarly to the overall MediaType description, the documentation browser will render attribute `description` values in the generated docs.

To read more about supported types and defining a complex and rich structures,
take a look at the [Attributor](https://rubygems.org/gems/attributor) gem and
other Praxis media type examples.

## Default fielset

One way to think of media types is that they contain the superset of attributes that can ever be returned. Often times, we might want to return only some of those when rendering responses. In fact, we will see in the rendering extensions sections that we can allow the API client to fully specify which subset of the available attributes to return, depending on what it needs.

As a convenience, especially while developing, it is nice to be able to not have to worry about listing the fields you want rendered. For that reason Praxis Media Types have the concept of a `default_fieldset`, which defines what attributes to return if no specific fields have been asked for. By default, Praxis will calculate this default fieldset as the set of terminal fields (i.e., simple fields that aren't other related MediaTypes). In the case for our Blog above, the `default_fieldset` will only contain the `id`, `href`, `subject` and `locale`, but it will leave out the `owner` as it would recurse into the fields of a `Person` media type.

You can easily override the Praxis-picked set of fields and define them yourself using the `default_fieldset` DSL. For example, the following restrict the default fields to only have `id`, `href` and `subject`:

```ruby
class Blog < Praxis::MediaType
  description 'A Blog API resource represents...'
  identifier 'application/vnd.acme.blog'

  attributes do
    attribute :id, Integer
    attribute :href, String
    attribute :owner, Person
    attribute :subject, String
    attribute :locale do
      attribute :language, String
      attribute :country, String
    end
  end

  default_fieldset do
    attribute :id
    attribute :href
    attribute :subject
  end
end
```

## Collections

Often times, we need to expose arrays of media types. In fact, this is very common for a given media type to embed collections of other related media types or even the case of returning a full top-level collection of mediatypes in an `index` API response.

To help in defining those, Praxis provides a `Praxis::Collection` class.

### Praxis::Collection

To define a related collection of mediatype objects, you can use `Praxis::Collection.of(media_type)`
For example, here is how you would define a collection of related Post media types for your Blog:

```ruby
class Blog < Praxis::MediaType
  attributes do
    attribute :id, Integer
    attribute :posts, Praxis::Collection.of(Post)
  end
end
```



In its underbelly, this `Praxis::Collection.of` type is backed by the `Collection` class of Attributor, which also includes the `Praxis::MediaTypeCommon` module in it. For the folk interested in greedy details, it would be interested to know that this resulting Attributor type is gonna be stored in a `Collection` constant under the `Post` mediatype. In other words, one can think of `Praxis::Collection.of(Post)` to be equivalent to accessing `Post::Collection`, except that it will create one if it does not exist already. 


As stated above, the created inner `Collection` class will simply be an `Attributor::Collection` that wraps members of a given MediaType, and that has an identifier that matches the member's identifier, with an added "collection=true" suffix. So in the above case, the `Post::Collection` will have an identifier of "application/vnd.acme.post;collection=true".

This inner `Collection` should be sufficient in most cases. However, you can explicitly define your own and Praxis will use that instead. Here's an example of how to do that if you wanted `Post::Collection` to have an identifier of "application/vnd.acme.posts" instead:

```ruby
class Post < Praxis::MediaType
  identifier 'application/vnd.acme.post'
  # ...

  class Collection < Attributor::Collection
    member_type Post
    identifier 'application/vnd.acme.posts'
  end
end
```

Note: When defined without using the `.of` helper, you use the `member_type` method to specify what type of media type class this collection is wrapping. If you want a non-anonymous class that is a collection and also has other attributes (such as description), you have two ways to define it:

```ruby
# Option 1: implicit collection type; reopen class to add more information
CommentThread = Praxis::Collection.of(Comment)
class CommentThread
  description 'A sequence of comments on a blog post.'
end

# Option 2: explicit collection type with member_type specified inline
class CommentThread < Praxis::Collection
  member_type Comment
  description 'A sequence of comments on a blog post.'
end
```

### Attributor::Collection

An Attributor::Collection (as opposed to `Praxis::Collection`) is the way to embed a collection of lower-level types that aren't media types. In fact they use the same `.of(type)` method to create the types.

For example, you may want a collection of tag strings to be an attribute of your blog media type:

```ruby
class Blog < Praxis::MediaType
  attributes do
    attribute :id, Integer
    attribute :tags, Attributor::Collection.of(String)
  end
end
```

## Rendering mediatypes

Maybe some of this data is best to be brought up in implementation rendering?....

????

Once a media type is defined within your application, you can use it to wrap a
compatible data object holding resource data, and render it using any of the
available views. A compatible object must respond to the method names matching
the media type attribute names, and return sub-objects that are compatible with
the types defined in the media type. Praxis renders media types into `Hash`
structures to achieve format-independence.  These rendered hash structures can
be formatted in your application using the desired wire encoding (JSON, XML, or
any other type you might need).

Here are two examples of how to render a blog_object using the `Blog` media
type: one using its `default` view and another using its `link` view:

{% highlight ruby %}
Blog.render(blog_object, view: :default)
=> {
 'id' : 123,
 'owner' : { ...an owner hash rendered with its :compact view...},
 'subject' : 'First post',
 'locale' : { 'language': 'en', 'country': 'us' }
}


Blog.render(blog_object, view: :link)
=> { 'href' : '/blogs/123' }
{% endhighlight %}

In this example, your `blog_object` must return:

{% highlight bash %}
+---------+---------------------------------------------+
| Method  | Return value                                |
|---------+---------------------------------------------|
| id      | integer                                     |
| owner   | object compatible with a Person media type  |
| subject | String                                      |
| locale  | object compatible with the locale structure |
| href    | String                                      |
+---------+---------------------------------------------+
{% endhighlight %}

Praxis provides a lot of help in managing resource objects and linking them to
data sources (including databases) by integrating with the
[Praxis::Mapper](https://rubygems.org/gems/praxis-mapper) gem.

Also, Praxis allows you to generate compatible objects using the `.example`
feature of MediaType classes. Using this `.example` feature you can create
random instances of compatible objects without any extra effort, which is great
to simulate returning data objects when testing controller responses without
requiring any data source access. There is also some help available for
creating realistic examples for your test cases. See more [examples](#examples)
at the end of this document.


## Examples

??? TODO????

Praxis provides tools to automatically generate example object values that will
respond to each and every attribute name of a media type and will return an
object that responds to the correct methods of their defined type, including
when the attribute type is another media type.

The values of the generated example attributes will also conform to
specifications like default values, regexp, etc.

Please see [Praxis::Mapper](https://rubygems.org/gems/praxis-mapper) and
[Attributor](https://rubygems.org/gems/attributor) for more on generating
example objects.
