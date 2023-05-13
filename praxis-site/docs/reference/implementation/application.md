---
title: Application
---

Praxis allows certain application-wide level configuration and customization options.

### Uncaught Exceptions

Praxis allows you to register an error handler to define how to properly catch and act against uncaught exceptions in your code. By default, the default error handler of Praxis will simply print the exception and backtrace onto the configured `Application.instance.logger` and then immediately return an `InternalServerError` response which will either contain the exception details in the body (Application.instance.config.praxis.show_exceptions == true) or simply "Something bad happe
ed" otherwise.

You can register your own error handler class by setting it with `Application#error_handler`. For example:

```ruby
Praxis::Application.configure do |application|
  application.error_handler = MyErrorHandler.new
end
```

The error handler class must implement a `handle!(request, error)` method, where `request` is the current `Request` instance being processed, and `error` is the exception in question. The return value must be a low-level Rack response tuple (i.e., `[status,headers,body]` ), which will be immediatly sent back to the client.

### Formatting Validation Responses

Any validation errors encountered in the flow of the request will be processed by the registered `validation_handler` in the Application. By default, Praxis validation_handler will simply return a response of type `Responses::ValidationError`.

This default behavior, however, may be customized by registering your own validation handler like this:

```ruby
Praxis::Application.configure do |application|
  application.validation_handler = MyValidationHandler.new
end
```

The validation handler must implement a `handle!(summary:, request:, stage:, errors: nil, exception: nil, **opts)` method where:

* `summary` is a string containing a short description of the validation error that has just occurred
* `request` is the current `Request` instance being processed. One can get to the `action` and other interesting values from it.
* `stage` is a symbol denoting where in the request flow the validation error occurred. The possible received values are:
  * `:params_and_headers`: if it occurred validating the parameters or headers.
  * `:payload`: if it occurred validating the payload.
  * `:response`: if it occurred validating the response. This can only occur if the `validate_responses` configuration is enabled.
* `errors` is an array of the errors as returned by the underlying type validations performed. The default types for headers, params and payload will return individual error message containing a string with the details of the encountered error. If you are using custom payload types, however, they could return different data in each of the individual error messages.
* `exception` is the exception in question.

The return valid from the `handle!` must be a Praxis response, which will be directly returned to the client.

### Rack Middleware

Praxis allows you to programatically register Rack middleware with the application. The syntax is analogous to the `use` directive in `Rack::Builder` works. Doing that through Praxis vs mounting the middleware at the lowest with Rack is basically a matter of choice. Sometimes its cleaner to register middleware in your `config.ru` file that is completely detached from the actual API, and sometimes is good to embed certain middleware configurations as part of configuring your Praxis Application after certain pieces of code have been properly loaded.

A typical way to register your middleware through praxis is by adding the following snippet in `config/environment.rb`:

```ruby
Praxis::Application.configure do |application|
  application.middleware MyMiddleware
end
```
