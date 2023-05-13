---
title: Pagination Plugin
---

The `PaginationPlugin` plugin is a 'meta'-extension that brings in the pagination and ordering extensions.

Specifically, this extension builds on top of the `MapperPlugin` extensions, and provides a way to signal the mapper to add sorting and limiting statements to the DB queries.

With this plugin, in addition to the mapper features, you can equip your application to:
* accept a powerful language for paginating (i.e., restricting the amount of data returned) and sorting results from your clients
* apply those specifications into the DB queries (compatible with field selection and filtering)
* reflect the pagination and sorting requirements into the rendered results

Neat uh?

There is really only one thing you need to do to enable all this functionality in your app. Simply define the `pagination` and `order` parameters in the right endpoint actions where you want to provide this functionality. Here's an example of the parameter types for an action that returns lists of `Post` media types. In particular, this allows you to use cursor-based pagination on `id` or `title` fields, and to control order in which the results are returned:

```ruby
  params do
    attribute :pagination, Praxis::Types::PaginationParams.for(MediaTypes::Post) do
      by_fields :id, :title
    end
    attribute :order, Praxis::Extensions::Pagination::OrderingParams.for(MediaTypes::Post)
  end
```

That's it! Nothing else needs to be done. Your controller will take care of it all when you're using the `build_query` functionality provided by the `MapperPlugin`.

## Parameter configuration

Both the `PaginationParams` and the `OrderingParams` parameter types accept configuration. This means not only can you customize how to paginate and sort, but you can also do it on a per parameter and per action basis. Let's take a look at the existing available configurations.

The built-in pagination supports two types of collection traversal. What we call `page`-based vs. `cursor`-based pagination.

### Page-based Pagination

Page-based pagination returns part of the collection given a fixed page size and based on the underlying (i.e,. implicit) ordering specification from your datastore. Many relational DBs, for example, return results based on primary key order (i.e., the `id` field). It is possible, however, to use this type of pagination with specific order if you combine it with the `order` parameter.

Typically, this type of pagination is associated with the well known "offset/limit" queries and allows you to jump directly to any of the existing pages of the result set. This pagination type is enabled by using the `page` parameter:

* `page=<integer>` indicates which page number to retrieve (based on a given page size)
* You can explicitly set the size of a page by also passing in `items=<integer>`

For example, the following request will return posts 201-250 from the underlying collection (i.e., 5th page of 50 items each)
```shell
curl 'http://localhost:9292/posts?api_version=1' -G \
      --data-urlencode "pagination=page=5,items=50"
```

Note that, in addition to URL-encode the whole query string parameter, you need to URL-escape the `value` portion of the pagination param to clearly differentiate from the parameter name. i.e., escaped_value=URLescape(`page=5,items=50`), URLencode(pagination=escaped_value)


### Cursor-based Pagination

Cursor-based pagination is usually a more deterministic way to traverse an entire collection (independent from DB internals). However, this type of pagination does not allow jumping directly to any page of the collection as it requires you to know the last seen value.

This pagination type is enabled by utilizing the `by` parameter:

* `by=<field name>` allows traversal of the collection based on ascending order of that field's values
* you can also use the `from=<field value>`, as a way to start the collection from values after the given one. The collection returned when no from value is specified is the very first in the result set.
* like in the case of page-based pagination, the page size can be overridden by using `items=<integer>`. There is a ceiling on the value of items you can set, based on the global configured value in the plugin (See [global Plugin's configuration](#global-plugin-configuration))

For example, the following API request will logically sort all users by their `email` address, in ascending order, and return [up to] 100 users after the one that has an email value of "joe@example.com".

```shell
curl 'http://localhost:9292/users?api_version=1' -G \
      --data-urlencode "pagination=by=email,from=joe@example.com,items=100"
```

Note that there is a dependency between using field-based cursor pagination and the sorting order that one might want for the results returned. In other words, the system will let you know if the use of the `by` clause in this pagination mode is incompatible with the requested sort `order` parameter.
Also note that while the system will not prevent one from doing so, cursor-based pagination when using a non-unique field should be avoided. If you do so, it is possible to 'skip over' and miss out on elements in the result sets such that you never know they exist (i.e., the `from` parameter would skip same value elements).

### Total-Count Header

Regardless of the type of pagination used, one can also request to receive the total count of elements existing in the collection (pre-paging) by adding `total_count=true` to the pagination string. When specified, a `Total-Count` header will be returned containing the total number of existing collection items (pre-pagination). Note that this calculation incurs an extra DB query (i.e., a SELECT COUNT(*) on the same predicate), thus it has extra performance implications.

### Link Header

Praxis also will return a `Link` header following rfc5988, where the client can easily find links to navigate the collection in a more agnostic way (i.e., `first`, `next`, `prev` and `last` relations).

### TLDR: examples

Here are some other types of pagination examples:

* `page=2` Retrieve the second page of elements from the collection (i.e. elements 101-200 since the default page size is 100)
* `page=4,items=50`	Retrieve the fourth page of 50 elements from the collection (i.e. elements 151-200)
* `by=id` Retrieve the first set of elements from the collection based on the ascending order of their id field (ie: first 100 elements since the default page size is 100)
* `by=name,from=alice` Retrieve a page worth of elements from the collection based on the ascending order of their name field, starting at the first value after "alice".
* `page=1,total_count=true` Retrieve the first page of elements from the collection (page-based unknown sorting), and include the total count in the Total-Count header.

Note: These example values are presented in the raw syntax, but they will all need to be properly encoded when passed in the query string parameters. For example: `pagination=page%3D1%2Ctotal_count%3Dtrue`



### Ordering

Endpoint actions that provide the order parameter allow you to specify the order with which the collection will be presented. Built-in sorting supports a syntax inspired by the JSON-API specification. It allows you to sort by multiple fields to resolve tie-breakers, and each field can be defined with a `-` or `+` sign to indicate descending or ascending order. The lack of sign defaults to ascending order.

Here are some handy examples:

* `-id`: Sort by the values of the id field, in descending order
* `name,-start_date,id`: Sort by name values, then by descending order of start_date, and finally by id

The names of the fields to sort must be valid attributes in the associated media type, or the request will fail with a validation error.

You can also restrict which fields you allow to sort by, by using the `by_fields` definition when you're declaring the `OrderingParams` parameter. Here's how to do it if you want to only allow sorting by `id` or `name` for your users:

```ruby
  attribute :order, Praxis::Extensions::Pagination::OrderingParams.for(MediaTypes::Post) do
    by_fields :id, :name
  end
```

Restricting the allowed fields is a common practice as allowing to sort by arbitrary fields might also have performance implications if the underlying datastore does not have indices for them.

It is very nice to provide nested sorting capabilities to the API clients (i.e., sort by name first, then by email, then by...) even though some of these properties clearly will not be indexed by the datastore. On the other hand, the first component of that sort clause can clearly have a performance penalty when not indexed. To provide more flexibility, and allow both more index control, yet deep nested sorts, we provide a configuration option that can ensure that either all sorting components belong to the allowed `by_fields` list, or that only the first one needs to belong to it. To configure that use the `enforce_for` stanza. By default only the first component of the sort clause needs to match one of the `by_fields` if specified.

For instance, with the `by_fields :id, :name` example above, the client can properly sort using things like `id,email, other`, or `name,id,other` cause it is only enforcing that the first component is either `id` or `name` (default of `enforce_for :first`).

If we wanted to restrict that even more we change the parameter definition like this:

```ruby
  attribute :order, Praxis::Extensions::Pagination::OrderingParams.for(MediaTypes::Post) do
    by_fields :id, :name
    enforce_for :all
  end
```

in which case "all" of the order fields would have to be in the `id` or `name` set. That means `id,name` or `name,id` will succeed, but even things like `id,created_at` would not.

## Enabling the Plugin

In order to be able to use the `PaginationParams` and the `OrderingParams`, you need to enable this plugin. You can do so by simply requiring its file and tell Praxis to use it within a `configure` block. For example, adding these pieces in the `config/environment.rb` file:

```ruby
require 'praxis/plugins/pagination_plugin'

Praxis::Application.configure do |application|
  # Use the Mapper plugin
  application.bootloader.use Praxis::Plugins::PaginationPlugin, **{
    max_items: 500,  # Unlimited by default
    ...
  }
```

This plugin also supports a good amount of global options and therefore it is fairly configurable. The default configuration, however, would probably suit most applications.

## Global Plugin configuration

Here are the list of globally configurable defaults

* `max_items`: The maximum number of results that a paginated response will ever allow. Unlimited by default,
* `default_page_size`: The default page size to use when no `items` is specified. 100 by default.
* `disallow_paging_by_default`: Disallows the use of the page type pagination mode when true (i.e., using 'page=' parameter, Defaults to false.
* `disallow_cursor_by_default`: Disallows the use of the cursor type pagination mode when true (i.e., using 'by=' or 'from=' parameter). Defaults to false.
* `paging_default_mode`: The default mode params hash to use. Defaults to  { page: 1 }
* `sorting`: Weather or not to enforce that *all* requested sort fields must be of the `by_fields` attributes. Defaults to { enforce_all_fields: false }, which means only the first attribute must meet the requirement

And here's an example of how to configure all of the default values for the plugin when registering it:

```ruby
Praxis::Application.configure do |application|
  application.bootloader.use Praxis::Plugins::PaginationPlugin, {
    max_items: 3000,
    default_page_size: 200,
    disallow_paging_by_default: false
    disallow_cursor_by_default: true
    paging_default_mode: {by: :id}
    sorting: {
      enforce_all_fields: true
    }
  end
end
```

Like any other plugin, you can also choose to configure the exact same parameters through `config.pagination` hash:


```ruby
Praxis::Application.configure do |application|

  application.config.pagination.max_items = 3000
  application.config.pagination.default_page_size = 3000
  ...
end
```