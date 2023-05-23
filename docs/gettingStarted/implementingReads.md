---
title: Implementing Reads
sidebar_label:  Implementing Reads
---

So here we are. We have designed our new API endpoints by specifying which actions we want to expose and the shapes of our Posts and Comments. We have also taken care of creating our DB structure and filling in some data to play with. Now it is time to actually implement some code that allows us to query for these resources.

## Implementing index and show actions

The `index` and `show` actions (that search the collection and show a single element or multiple elements) are 100% implemented in the generated scaffolding code. Done and done. Not only that, but they also support field selection (similarly to GraphQL), ordering, and pagination. Don't quite believe it? Let's take our API for a spin shall we? Let's first start our app by:

```shell
bundle exec rackup
```

And now we're ready to throw some queries at it. Here are some examples you can start trying from another terminal:

```shell
# Get all posts, but only include:
#  -- id, contents and author (with only the author's first_name)
curl 'http://localhost:9292/posts?api_version=1' -G \
      --data-urlencode "fields=id,content,author{first_name}"

# Retrieve the comment with id 1, but only include:
#  -- id, contents, related post (only id) and related user (only first_name)
curl 'http://localhost:9292/comments/1?api_version=1' -G \
  --data-urlencode "fields=id,content,post{id},user{first_name}"

# Retrieve the second page of users with a page size of 5, ordered by uuid first and then last_name
#  -- display only their id, email and first_name
curl 'http://localhost:9292/users?api_version=1' -G \
    --data-urlencode "fields=id,email,first_name" \
    --data-urlencode "order=uuid,last_name" \
    --data-urlencode "pagination=page=2,items=5"
```

And there you go! you have a fully functioning API that is able to query items from a real DB, with support for GraphQL-style field selection, embeddable nested resources, pagination, and ordering. You're more than welcome to enable SQL logging and see how efficient the queries are...(To enable logging the easiest is to add `ActiveRecord::Base.logger = Logger.new(STDOUT)` towards the end of `config.ru`). 

 Not too shabby having all this functionality without having written a single line of controller or ORM code! Did this leave you thirsty for more? Ok, challenge accepted, let's go for extra credit by showing you how you can trivially enable powerful query filtering on top of this.

## Building Filtering capabilities

So to build filters with which to query elements in the `index` action we need to do a couple of things:

 * Define the `filters` parameter in the API endpoint (simply a design concern), and if you want to limit what you want to filter by, you can also specify which of the attributes you allow.
 * Tell Praxis how each of the API filters map into which underlying resource or model properties. This is only necessary if the API names and relationships have different names than the models fields and associations.

Let's get started.

Luckily, since we've generated the endpoint using the Praxis generator, we already have en example of how to define the `filters` attribute. We can just uncomment those lines and then list the attributes we want to allow for filtering. The `Post` MediaType has an `id`, `title`, `content` and an `author`. You could, for example, allow filtering by `title` (allowing wildcards), and then by author's `email` or `id`. In these cases we'll only enable the `=` and `!=` operators, but there are many others that are supported. To do so, we need to replace the already existing (commented out due to scaffolding) `filters` parameter in the `design/v1/endpoints/posts.rb` file with the following:

```ruby
    attribute :filters, Praxis::Types::FilteringParams.for(MediaTypes::Post) do
       filter 'title', using: ['=', '!='], fuzzy: true
       filter 'author.email', using: ['=', '!=']
       filter 'author.id', using: ['=', '!=']
    end
```

And now that the endpoint is ready to accept and validate that new `filters` parameter.

 In our simple case, we've designed the DB fields to match those in the API, so we don't need to specify any extra mapping of fields to match our ORM layer, we are all ready to go with our filtering. However, other APIs may have to deal with already existing DBs and ORMs that might not perfectly match the API names you wish to expose. In these cases, you simply would need to provide the conversion at the resource level. For example, if our `title` API attribute of our `Post` needed to be mapped to a column named `titulo` in our ORM, we would simply add that conversion in a `filters_mapping` function of the `Post` resource (`app/v1/resources/post.rb`). It's not our case, but here's an example of how that would look like:
 
```ruby
  filters_mapping(
    'title': 'titulo',
  )
```

We can similarly add filtering for `Comments`. For example, filtering by `post.id` and `user.id` so we can easily list comments for specific posts and/or made by certain users. Or instead, for ilustration purposes, we can decide to allow filtering by any of its fields (and embedded fields). To do so, simply requires adding the same filters stanza (without a block) to the `Comments` endpoint (`design/v1/endpoints/comments.rb`):

```ruby
  attribute :filters, Praxis::Types::FilteringParams.for(MediaTypes::Comment)
```

So, that's essentially it. What!? There is still no need to build any controller or ORM queries? Nope, that's the power of following the best practices and adding the extensions. Let's give it a whirl!

First let's make sure we start (or restart) the API server with `bundle exec rackup`. Then, from another terminal, let's get all `posts` that were written by `peter@pan.com` (We know there are some with this email in our seeds):

```shell
# Get all posts written by an author with email=peter@pan.com:
#  -- id, contents and author (with only first_name)
curl 'http://localhost:9292/posts?api_version=1' -G \
      --data-urlencode "filters=author.email=peter@pan.com" \
      --data-urlencode "fields=id,title,content,author{first_name}"
```

Or we can combine multiple filters at once. For example, let's get posts that contain the word `first` in the `title` AND that have been written by authors with `id` 11 OR 12 (which we know they are Peter and Alice, from the seeds).

```shell
# Get all posts that contain `first` in the title, written by an author with id 11 or 12:
#  -- id, contents and author (with only first_name)
curl 'http://localhost:9292/posts?api_version=1' -G \
      --data-urlencode "filters=title=*first*&author.id=11,12" \
      --data-urlencode "fields=id,title,content,author{first_name}"
```

And there you go. Notice two things here: one is that multiple filters are separated by an `&`, and also equality filters support an array of values, separated by commas (`author.id=11,12`) which will translate into something like `...WHERE authod_id IN (11,12)...`. Also, this is just the tip of the iceberg with what you can do with filters. Suffice to say for now that it supports AND, OR with the right precedence, including grouping sub-clauses with parenthesis. It also supports all kinds of operators including equality, inequality, greater/smaller, NULL, not NULL, empty/not-empty collection relationships, and even fuzzy (prefix/suffix) regexp. Pretty powerful for being something that requires no coding whatsoever.

Well, at this point we have built a fully featured read-only API that allows us to retrieve users, posts, and comments; which supports field selection (including nested relationships); which can paginate and sort; and which supports all a wide range of filtering. All of it, without writing a single line of controller code or any explicit ORM queries. Talk about development efficiency!

The next logical step you might be thinking of is: what about the CRUD operations? I'm glad you asked, let's dig in.