---
title: Request Life Cycle
---

Praxis processes each incoming request by funneling them through a pipeline of stages. Stages are execution points during the servicing of a request, which could themselves contain a set of sub-stages. Each registered stage has a unique name and is connected to the other stages in a well-known order.

Praxis allows applications to 'hook into' any of those existing stages through `before`, `after` and `around` callbacks and provides facilities to create or alter the pipeline. Any stage or its hooks are able to abort the pipeline processing early, and shortcut directly to sending a response to the client. A callback can indicate such shortcut by simply returning a `Praxis::Request` object. Note that when a callback does that, any other further callbacks are not going to be invoked.

Note: while stages in the request lifecycle might behave similarly to bootstrap stages (as described [here](bootstrapping)), they perform a different role. Request life cycle stages define the processing path for every incoming request, while bootstrapping stages define the execution order when the application first boots.

Praxis comes out of the box with the following pipeline of stages for any incoming request:

![Request Life Cycle Diagram]({{ site.baseurl }}/public/images/praxis_request_life_cycle_diagram.png)

The first of these stages in the pipeline will start after the routing has been processed for the incoming request and the appropriate controller and action has 
been identified. This means that currently, there is no way to affect the request routing dynamically.

## Request Loading Stage (`:load_request`)

The request loading stage is used to retrieve all the necessary information from the incoming HTTP request so that it is ready for processing.

This involves:

- parsing the parameters from the URI captures
- retrieving any parameters from query string
- retrieving the paylod contents
- retrieving the incoming headers

All of these are done, without performing any parsing or type coercion: simply gathering the low-level arguments in one place.

Note: Strictly speaking retrieving the query string params involves some form-encoding parsing, but it still does not involve any type coercion.

## Validation Stage (`:validate`)

During the Validate stage, Praxis will gather the raw data retrieved from the loading stage and will:

* load them into (read: coerce if necessary) into the proper structures as defined in your endpoint definitions for the action that this request is serving.
* validate these created objects based on the requirements set forth by the endpoint definitions.

These two tasks are done for data corresponding to headers, parameters and payload. In practice, this will result in creating the appropriate `headers`, `params` and `payload` objects accessible through the `request` object in the controller. Any errors while loading the data into the right types, or validating
their integrity will cause Praxis to abort the pipeline (by shortcutting to the  `:response` stage) and immediately return an error to the end user indicating the exact 
problem (or problems) that were encountered about the incoming data.

The Validation stage is further composed of two sub-stages.

* `:headers_and_params` : First, this stage will load the headers and the parameters. If all loaded fine they will both be validated in the same order.
* `:payload` : Then this stage will load the incoming payload and then validate its integrity after that.

Splitting it is these sub-stages it allows enough flexibility to hook into the desired step.

## Action stage(`:action`)

Once the incoming request has been loaded and validated, the next step is to deliver it to the controller action that will service it. At this point Praxis has created a `Praxis::Request` instance, and made it available to the controller through the `request` method. This object will have the `headers`, `params` and `payload` methods, which will return the appropriately loaded and validated objects, as defined in your endpoints. The same `params` attributes will also be splatted into keyword arguments of your controller action.

The request enters the Action stage at the point when the controller action is invoked. This is the stage where the application will do its logic. Note that your controller only gets invoked if the validation stage succeeds. Therefore, your action should never validate any of the `params`, `headers` or `payload` in its code as they are guaranteed to match all of the requirements of your definition.


## Response Stage (`:response`)

The Response stage is going to *always* be invoked, even when any of the previous pipeline stages have decided to shortcut the cycle. This is done to give the application
a chance to catch and possibly modify the logic involved in returning the response to the user, even when it is an error response. In the normal, non-error case however, the Response stage is entered when the control returns from the controller action stage.

The responsibility of this stage is to inspect the returned value (usually a response instance) and perform the necessary steps to unpack it and send it back to the client.

Note that if any of the around, before or after filters in any other stage return a `Response` objecy, the request pipeline is immediately shortcut to this `:response` stage. Therefore, you should never assume that your filters will all be invoked by the time the `:response` stage code starts. For example, if there is a `before :action`
filter that sets the current user into the request object, do not assume that this user will be correctly set when the response stage executes, as previous `before :action` filter might have shortcut the cycle first.

## Hooking Into the Request Life Cycle

There are three types of hooks you can use to run a block of code during the
life cycle of a request. You can register a callback to be run either `before`,
 `after` or `around` any of the available stages.

Installing callbacks is done directly from your controller. Just use the class
DSL methods `before`, `after` or `around` that comes with the Praxis::Callback
concerns(already included by the Praxis::Controller module). Each of these methods take 
the name of the stage to hook into, an optional list of options, and a callback block.

The name of the stage can be any of the ones described above: `:load_request`, `:validate` (including ```:validate, :headers_and_params``` or ```:validate, :payload``` to tap into a sub-stage only ), `:action` or `:response`.

The only option supported at the time of this writing is `:actions`, which
allows the caller to restrict the callback to be applied only to a set of named actions. 
Passing no `actions` option is logically equivalent to passing every possible action in
your controller. More options for callbacks might be introduced in the future.

To install your hook for substages, pass a second argument after the stage name (i.e. ```after :validate, :payload ...``` for tapping into the `:payload` substage of `:validation`). If you completely omit the stage name, Praxis will default to the `action` stage because that's the most common use case.

Here are some examples of how to register callbacks:

```ruby
  before :action, actions: [:show] do
    puts "Will print before invoking the controller method, for show action only"
  end

  before actions: [:show] do
    puts "Omiting the :action parameter!"
    puts "This is equivalent to the callback above"
  end

  after :validate, :payload do |controller|
    puts "Will print after validating the payload for any action"
  end

  after :validate, :payload, actions: [:create] do |controller|
    puts "Will print after validating the payload for create only"
  end

  after :validate do
    put "Will print after the headers and payload substages' after callbacks"
  end
  
  around :action do |controller, callee|
    puts "Before the action is called"
    callee.call
    puts "After the action is called"
  end
end
```

Technically speaking there is not much difference between `after :validate` and `before :action` since they are subsequent stages. Semantically, however, they are different as all the `after :validate` callbacks will be executed before any of the `before :action` ones. So you should really register the callback based on what stage you depend on, and not on neighboring stages. Otherwise, your code might stop functioning when the pipeline order is changed.

There is, however, an important difference beween an `after :action` callback, and a `before :response` one. That is because the `:response` stage is always invoked regardless of errors in the previous stages. Therefore `after :action` will be always skipped on previous stage shortcuts, while `before :response` will always be invoked regardless of shortcuts (assuming that no other `before :response` callbacks fail before).

There is currently no mechanism to order the callbacks for a given stage. They will be executed
in the order that they were registered. Also, there is currently no way to install callbacks around the complete request lifecycle, for example, to install an `around` callback wrapping all of the 
individual request stages. Both of these mechanisms can be added if the need arises.
To achieve something similar to a request `around` filter, use the [builtin middleware registration](../application) that the Application provides

### Shortcutting the request processing

Any of the registered callback blocks (or the core stage execution code itself) can return a
```Praxis::Response``` instance to signal the interruption of the request lifecycle processing. Anything else that the block returns (i.e., nil or any other value) will be ignored and assumed that it signals that the processing should continue.

If a `before` callback returns a response, the system will immediately stop processing any further
callbacks of any kind, and shortcut the execution to the `:response` stage. This means that (with
the exception of the `:request` stage):

* no other `before` callbacks in the chain will be executed
* none of the `around` filters will be executed
* the action won't be invoked 
* none of the `after` callbacks will be run either

If an `after` callback returns a response, no further `after` callbacks will be executed either.
Also note that the `around` callbacks are always started in after the `before` ones, since they wrap the processing of the controller `action`.