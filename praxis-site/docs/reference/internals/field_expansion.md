---
title: FieldExpansion 
---

The `FieldExpansion` extension is an internal extension that helps connect the field selection with the querying functionality. It provides a `Controller#expanded_fields` helper determine the final set of fields necessary to process the request. This is necessary because you are not required to fully expand all fields to leaf nodes. For example, you can ask to render `id,author` fields, where the `author` attribute can map to a `User` mediatype with many attributes and other related mediatypes. In this case, one needs to fully expend the author to the set of attributes defined in the `default_fieldset` of a User. This is what the Field expanded does.

As such, any attributes with types that are either a `MediaType` or a collection of a `MediaType` will be recursively expanded into a complete set of "leaf" attributes.


A good use of the field expansion logic, can be to customize (i.e., restrict) the requested fields based on the principal requesting the action. In other words, we've seen this being used as a "security filtering" option.