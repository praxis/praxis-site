---
title: Traits
---

Sometimes one wants to reuse common definition functionality across your entire API, which can be applied across different endpoints and actions. Praxis has the concept of Traits, to achieve this goal.

## Declaring a Trait

Traits are defined and registered through the ApiDefinition singleton. A trait definition requires a globally unique name and a block of DSL elements. The block is used to instantiate an instance of the `Trait` class that is registered on the ApiDefinition singleton with the given name. You can think of a trait as a copy-pasteable block of code that you can refer to by name.

Here are a couple of example trait definitions:

```ruby
Praxis::ApiDefinition.define do
  trait :data_range do
    params do
      attribute :start_at, DateTime
      attribute :end_at, DateTime
    end
  end

  trait :authenticated do
    headers do
      key "Auth-Token", String, required: true
    end
  end
end
```

The first example creates a trait named `data_range` which defines two incoming parameters, `start_at` and `end_at`. If you write an action that uses this trait, it would be as if you had added this params block directly to your action. 

The second example creates a trait named `authenticated`. All it does is define a required header named `Auth-Token` for you to use in your actions.


## Using a Trait

To use a trait, call the `trait` method from within your action or endpoint, and pass the name of the trait you want to use. That will essentially bring over the block defined by that trait, as if you were creating it in place.

```ruby
class Blogs
  include Praxis::EndpointDefinition

  # the 'authenticated' trait will be applied to all actions.
  trait :authenticated

  action :index
    # the 'data_range' trait will only be used by the index action
    trait :data_range
  end
end
````

In this case, all actions in the `Blogs` resource definition will have the
`Auth-Token` header defined. The `index` action will have `:start_at` and
`:end_at` params defined. You can think of `trait :trait_name` as a cut-and-paste
mechanism which allows you to reuse common snippets of design-time code.
