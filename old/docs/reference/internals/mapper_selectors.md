---
title: MapperSelectors
---

The `MapperSelectors` extension type is in charge of mapping the required fields from the API (after having been expanded by the [`FieldExpansion` extension](./field_expansion), to tables, associations and columns in the Datastore.

This extension adds the `set_selectors` method to the controllers, which will be used by the query building (i.e., mapper)extensions to know what fields to `select`, and join to retrieve the smallest subset of data necessary to satisfy the output fields of the request.

To manually use this extension, include it in a controller with `include Praxis::Extensions::MapperSelectors`. and define `before` callbacks on relevant actions that call `set_selectors`. For example:

```ruby
before actions: [:index, :show] do |controller|
  controller.set_selectors
end
```

This exact thing,however, is automatically done for you when you include the `MapperPlugin`