---
title: Filtering
---

The filtering extensions, along with the field selection and the automatic DB querying is a powerful tool that makes it trivial to slice and dice data to API clients.

To take advantage of this extension you just need to design what attributes you want to allow to filter by, and to provide the mapping from names in the filters to the names of the underlying associations and/or database columns. Let's take a look at what this means before we get into the details.

Let's assume you want to allow to filter your `Posts` by their `title`, or by their author's `email` or by the date is was `posted_at`. To do so, you'd define a `filters` param (typically in the `index` action) much like this:

```ruby
  params do
    attribute :filters, Praxis::Types::FilteringParams.for(MediaTypes::Post) do
              filter 'title', using: ['=', '!='], fuzzy: true
              filter 'author.email', using: ['=', '!=']
              filter 'posted_at', using: ['=', '!=','>','<','>=','=<']
    end
  end
```

Note that we've made some decisions here, about restricting which operators we allow for each filter, including deciding that we can allow the client for filter by prefix/postfix on the title.

In your Resource business logic, you would also have to define how these API filter names might map differently to the lower level DB columns of your data. In this case, `title` and `posted_at` can be omitted since there's both simple attributes and map to the same-name column (but it seems clearer to show in this doc). For ilustration purposes, we've shown how you would map the author's email to an underlying `user` association, and a `email_address` column.

```ruby
    filters_mapping(
      'title': 'title',
      'author.email': 'user.email_address',
      'posted_at': 'posted_at',
    )
```

## FilteringParams type

Every filter defined in the Filtering params type can define:

* the exposed name of the filter
* the operators that are allowed to use
* and if they can be used to do prefix/suffix matching.

The filter names must correspond to fields of the mediatype passed in the `.for` method. These names can recurse down into other related fields of the mediatypes, all the way down to a leaf attribute. In other words, filtering is not restricted to a direct attribute, or a single nested level. The only way to provide filter names that do not map to the mediatype would be to use the `FilteringParams` type without the `.for` method, and properly build your parsing and coercion of attributes.

There are 8 available operators to choose from: `=`, `<`, `>`,`!=`, `>=`, `<=`, `!`,`!!`. The first 6 are seemingly straightforward and always have a name and take a value, i.e., `filter_name>value`. The last 2 operators are for checking NULL values and do not accept a value. In particular:
* `filter_name!` would filter results whose `filter_name` `is NOT NULL`
* `filter_name!!` would filter results whose `filter_name` `is NULL`

It is possible to combine multiple filter conditions in the same API call. In fact, it is possible to combine them with `AND`, `OR` operands, as well as group them with parenthesis. The precedence of operands is exactly what you'd expect, where `AND` has higher-precedence than `OR` unless there are parenthesized groups defining an element.

Here's a rough representation of how the overall syntax for the filters:
expression = TRIAD & TRIAD | TRIAD & ( TRIAD | TRIAD ) ... 

WHERE a TRIAD, is basically:

TRIAD = NAME OPERAND VALUE ( or NAME OPERAND for the `!` and `!!` operands)

NAME = is the name you've defined in the action
OPERAND = is one of the 8 available operands
VALUE = is either the direct value to compare against, or a set of comma-separated values to achieve an easy `IN clause` matching (i.e., a cheap OR)

VALUE (or each of the VALUEs if comma-separated) MUST be escaped (ie., not encoded, but escaped) as they cannot contain any of the reserved fields of our syntax (,),comma, & , |  ....


To see the full syntax look at the parser here.
uses `&` for `AND`, `|` for `OR

multiple values as comma...

values are properly coerced to the types of the mediatype attribute

TODO: Examples, encoding!!! and AND/OR/PAREN