---
title: Designing our API resources
sidebar_label: Designing our API resources
---

Ok, so our goal was to build an API that contains `Posts` and embedded `Comments`. So let's first scaffold the design for them. To do so, the easiest way is to use the Praxis scaffold generator, so let's do that:

```shell
bundle exec praxis g posts --model
bundle exec praxis g comments --model
```

Each of these scaffold generation commands will create the design files (MediaType and Endpoint) that are necessary to define the API actions and resource shapes we want to expose. By default, the generator will create the standard set of CRUD actions for each endpoint: `create`, `index`, `show`, `update` and `delete`. This can be further customized by passing extra flags to the generators as well.

Since we didn't specify the `--no-implementation` flag, the genarator above also has also created the corresponding implementation files (Controller and Resource) that go with the given design. We commonly would want to generate the implementation side of the API after we're happy with the design, but for the sake of this guide we'll just generate them all at once. Also, since we know we're using a DB, we also explicitly asked the generator to create the model file for us with `--model` (defaulting to an ActiveRecord model, but Sequel is also supported)

So with all that scaffolding in place, it's time to put on our design hat. The first thing we need to do is to fill in the API attributes that we want `Posts` and `Comments` to have. For now, let's start simple and assume that a `Post` only has an `id` (`Integer`), a `title` (`String`), some `contents` (`String`) and an author (a `User`). Add these attributes into the `Post` MediaType in `design/v1/media_types/post.rb` so that its attribures block looks like:

```ruby
attributes do
  attribute :id, Integer
  attribute :title, String
  attribute :content, String  
  attribute :author, MediaTypes::User
end
```

Similarly, for the `Comment` MediaType, let's assume assme want it to also have an `id`, some `contents` (`String`), a related `Post`, and finally the `User` that wrote it. To achieve that, we need the attributes on our `Comment` MediaType in  `design/v1/media_types/comment.rb` to look like this:

```ruby
attributes do
  attribute :id, Integer
  attribute :content, String
  attribute :post, MediaTypes::Post
  attribute :user, MediaTypes::User
end
```

At this point, having the CRUD actions scaffolded by the generator, and having designed the shape of the attributes for `Post` and `Comment` we might feel it's a suitable moment to celebrate. Do you want to see the full API documentation of what we just built? No problem! You can generate the OpenAPI docs and view them in ReDoc with:
 
 ```shell
bundle exec praxis docs browser
 ```

That should open your browser and show you something like:

![Docusaurus](/img/first-api-doc-browser.png)

Nice, huh? Well, we might be feeling pretty good about our design, but we need to actually implement something before breaking out the champagne. Before we get into the implemenation phase, we first need to make sure we have a properly built DB and have configured our models.
