---
title: Filtering
---

The filtering extensions, along with the field selection and the automatic DB querying is a powerful tool that makes it trivial for API clients to slice and dice what data to retrieve.

To take advantage of this extension you just need to do two things. First add which attributes you want to allow to filter by in your action design, and second, provide the mapping from these filter names, to the names of the underlying associations and/or database columns. Let's take a look at what this means before we get into the details.

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

Note that we've made some decisions here, about restricting which operators we allow for each filter, including deciding that we can allow the client for filter by prefix/postfix on the title (i.e., a `LIKE` or `REGEXP`-type condition).

In your Resource business logic, you also have to define how these API filter names might map differently to the lower level DB columns of your data. In this case, we can see that the `title` and `posted_at` filters map to the same column names. We can also see that we need to map the author's email filter, to an underlying `user` association, and a `email_address` column. In other words, the mapping can traverse associations and/or map to names of columns that might or might not coincide with the filter names used. For simplicity, Praxis allows you to omit mapping simple names that concide (so we could have perfectly omitted `title` and `posted_at` in this example.) Note that omission is for 'simple' fields, you still need to define mappings for any nested field even if they both map to the same(i.e., 'user.id' => 'user.id' still needs to defined ).

```ruby
    filters_mapping(
      'title': 'title',
      'author.email': 'user.email_address',
      'posted_at': 'posted_at',
    )
```

## FilteringParams type

Every filter defined in the Filtering params type can declare:

* the exposed name of the filter
* the operators that are allowed to use
* and if they can be used to do prefix/suffix matching.

When you use the `.for` method of the `FilteringParams` type, the defined filter names must correspond to fields of the mediatype. These names can recurse down into other related fields of the mediatypes, all the way down to a leaf attribute. In other words, filtering is not restricted to a direct attribute, or a single nested level. The only way to provide filter names that do not map to the mediatype would be to use the `FilteringParams` type without the `.for` method, and properly build your parsing and coercion of attributes.

There are 8 available operators to choose from: `=`, `<`, `>`,`!=`, `>=`, `<=`, `!`,`!!`. The first 6 are seemingly self explanatory and always take a value (i.e., `filter_name>value`). The last 2 operators are for checking NULL (or NOT NULL) values and do not accept a value. In particular:
* `filter_name!` would filter results whose `filter_name is NOT NULL`
* `filter_name!!` would filter results whose `filter_name is NULL`

Filters fo string attributes, can also accept a `fuzzy: true` option, which would allow to prefix or postfix patch the value. For example, using our `title` filter above would allow us to do things like this:
* `title=*ending`, which will translate to a SQL query similar to `LIKE "%ending"`
* `title=starting*`, which will translate to a SQL query similar to `LIKE "starting%"`
* `title=*Iam%20a%2A%21` (whose encoded value after the `*` is `Iam a*!`) which will translate to a SQL query similar to `LIKE "%Iam a*!"`

A filter condition generally has a single value, but Praxis allows you to pass a comma-separated list of values as a compact way to do a multimatch without requiring several clauses. These will generally be translated to `IN clause` SQL queries. Here is an example some examples:
* `author.email=one%40example.com,two%40example.com`, which will typically translate into `... email_address IN ('one@example.com', 'one@example.com)`

Remember that we need to always escape the filter values. This multi-map case is no different, so we will do so for each of them but not the "commas" as that's part of the filter syntax. Also note that all of the resulting string of the `filters` value will also be url-encoded when forming the query string of the API request.


The syntax allows you to to combine multiple filter conditions in the same API call. In fact, it is possible to combine them with `AND`, `OR` operands, as well as group them with parenthesis. The precedence of operands is exactly what you'd expect, where `AND` has higher-precedence than `OR` unless there are parenthesized groups defining an element.

* `&` is used to `AND` two filters and/or expressions. For example: `title=one&posted_at>2000-01-01`
* `|` is used to `OR` two filters and/or expressions. For example: `title=one|author.email=email1`
* `(` and `)` are used to group one or more filter conditions. For example: `(a=1|b=2)&c=3&d=4`

Not to repeat ourselves too much, but obviously do not escape these symbols when used in this mode. Only escape them when they are part of a value.