---
title: Mapper Plugin
---

The `MapperPlugin` plugin is a 'meta'-extension that will configure several of the common feature extensions to work together with minimal effort.

In particular, configuring this plugin will configure all of your Controllers to bring in the Rendering, FieldSelection, FieldExpansion and SelectorGeneration extensions.

These combined, equip your application to:
* accept GraphQL-type field selection as an API parameter
* accept a powerful language for filtering results
* automatically use the common functions to provide the necessary efficent DB queries to retrieve and filter the data
* seamlessly render the resulting data to match the desired client fields

Not bad!

You can find more information on each of these features in their respective extension pages, but in a nutshell, the `MapperPlugin` allows you to do things like this.

In the endpoint definition, you can easy enable field_selection and define which filters you accept:
```ruby
  params do
    attribute :fields, Praxis::Types::FieldSelector.for(MediaTypes::Post),
              description: 'Fields with which to render the result.'
    attribute :filters, Praxis::Types::FilteringParams.for(MediaTypes::Post) do
              filter 'title', using: ['=', '!='], fuzzy: true
              filter 'author.email', using: ['=', '!=']
              filter 'author.id', using: ['=', '!=']
    end
  end
```

In your Resource business logic, you can define how these API filter names might map differently to the lower level DB columns of your data:

```ruby
    filters_mapping(
      'title': 'title',
      'author.email': 'author.email',
      'author.id': 'author_id',
    )
```

And then finally, in your Controllers you can easily invoke the `build_query` to make the system craft the right set of DB queries, and the `display` method to render the retrieved resources, into the right media type subattribute trees that the client wants. Here's how the `index` action for retrieving posts could look like:

```ruby
  def index
    objects = build_query(::Post).all
    display(objects)
  end
```

So, in essence that's the meta functionality you get by simply requiring the plugin when your application boots, and telling Praxis to use it:

```ruby
require 'praxis/plugins/mapper_plugin'

Praxis::Application.configure do |application|
  # Use the Mapper plugin
  application.bootloader.use Praxis::Plugins::MapperPlugin
  ...

```

This alone brings in all the functionality above, but requiring classes like `FieldSelector`, `FilteringParams`, exposing the `display` and `build_query` methods in the controller, intercepting and mapping API filters into extra join DB statement, and being able to preload and join the necessary related tables to retrieve the required fields in an efficient way.

As a note, this plugin does not include pagination and sorting extensions, which are easily available through the `PaginationPlugin`

## Configuration

The Mapper plugin currently accepts only 1 configuration option: `debug_queries`. Like any other plugin, you can set it up under the `application.config` subtree. For example:

```ruby
Praxis::Application.configure do |application|
  ...
  application.config.mapper.debug_queries = true
```

When `debug_queries` is set to true, the system will output information about the expanded fields and associations that the system has calculated necessary to pull from the DB, based on the requested API fields, API filters and `property` dependencies defined in the domain models (i.e., resources)