---
title: Implementing Reads
sidebar_label:  Implementing Reads
---

So here we are. We have designed our new API endpoints by specifying which actions we want to expose and the shapes of our Post and Comments. We have also taken care of creating our DB structure and filling in some data to play with. Now it is time to actually implement some code that can allow us to query for these resources.

## Implementing index and show actions

The `index` and `show` actions (that search the collection and show a single element) are 100% implemented in the generated scaffolding code. Not only that, but they also support field selection (similarly to GraphQL), ordering, and pagination. Done and done. Don't quite believe it? Let's take our API for a spin shall we? Let's first start our app by:

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

And there you go! you have a fully functioning API that is able to query items from a real DB, with support for GraphQL-style field selection, embeddable nested resources, pagination, and ordering. You're more than welcome to enable SQL logging and see how efficient the queries are... Not too shabby having all this functionality without having written a single line of controller or ORM code! (To enable logging the easiest is to add `ActiveRecord::Base.logger = Logger.new(STDOUT)` towards the end of `config.ru`)

Did this leave you thirsty for more? Ok, challenge accepted, let's go for extra credit by showing you how you can trivially enable powerful query filtering on top of this.

## Building Filtering capabilities

So to build filters with which to query elements in the `index` action we need to do a couple of things:

 * Enable the `filters` parameter in the API endpoint, and specify which attributes we're allowed to filter by.
 * Tell Praxis how each of the API filters map into which underlying resource or model properties.

Let's get started.

Luckily, since we've generated the endpoint using the Praxis generator, we already have en example of how to define the `filters` attribute. We can just uncomment those lines and then list the attributes we want to allow for filtering. The `Post` MediaType has an `id`, `title`, `content` and an `author`. You could, for example, allow filtering by `title` (allowing wildcards), and then by author's `email` or `id`. In these cases we'll only enable the `=` and `!=` operators, but there are many others that are supported. To do so, we need replace the already existing (commented out due to scaffolding) `filters` parameter in the `design/v1/endpoints/posts.rb` file with the following:

```ruby
    attribute :filters, Praxis::Types::FilteringParams.for(MediaTypes::Post) do
       filter 'title', using: ['=', '!='], fuzzy: true
       filter 'author.email', using: ['=', '!=']
       filter 'author.id', using: ['=', '!=']
    end
```

And now that the endpoint is ready to accept and validate that new parameter, we simply need to inform the associated Resource object about how to map these API-level attribute names into ORM-level models and associations. To do so, we simply need to fill it in the `filters_mapping` function in the `Post` resource (in `app/v1/resources/post.rb`). In this case, we've designed the DB fields to match those in the API. However, other APIs may have to deal with already existing DBs and ORMs that might not perfectly match the API you wish to expose, and so the mappings might look a little more purposeful. But anyway, for our `title` filter, the mapping is the same as that's exactly the same method in the underlying `Post` model. For our `author.email` filter, we don't need to remap anything either, as the `author` relationship is called the same in the model, and once we're in the `User` model there is an `email` attribute as well. For `author.id` we could simply do the same as they map properly to the underlying ORM world, but for demonstration purposes, we can also show that we can map it to the `author_id` attribute of the `Post` model itself (that way we don't even need to pay the price of an inner join with users). Anyway, all of this simply means that you'll need to delete the commented out scaffolding of the `filters_mapping` in the `Post` resource, and paste this instead:

```ruby
  filters_mapping(
    'title': 'title',
    'author.email': 'author.email',
    'author.id': 'author_id',
  )
```

We can similarly do the same thing for `Comments`. For example, we can allow filtering of comments by `post.id` and `user.id` so we can easily list comments for specific posts and/or made by certain users. We're leaving this as an excercise for the reader ;).

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

And there you go. Notice two things here: one is that multiple filters are separated by an `&`, and also equality filters support an array of values, separated by commas (`author.id=11,12`) which will translate into something like `...WHERE authod_id IN (11,12)...`. Also, this is just the tip of the iceberg with what you can do with filters, suffice to say that it supports AND, OR with the right precedence, including grouping sub-clauses with parenthesis. It also supports all kinds of operators including equality, inequality, greater/smaller, NULL, not NULL and even fuzzy (prefix/suffix) regexp. Pretty powerful for being something that requires no coding whatsoever.

Well, at this point we have built a fully featured read-only API that allows us to retrieve users, posts, and comments; which supports field selection (including nested relationships); which can paginate and sort; and which supports all a wide range of filtering. All of it, without writing a single line of controller code or any explicit ORM queries. Talk about development efficiency!

The next logical step you might be thinking of is: what about the CRUD operations? I'm glad you asked, let's dig in.