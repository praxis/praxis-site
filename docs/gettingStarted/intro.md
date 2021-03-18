---
title: Intro
---
So you're new to Praxis, you've read some of the cool stuff that it can do and
you're ready to see it to believe it? Great! You're in the right place.

Let's show you how easy it is to create a fully functioning API from scratch, capable to serve Posts (that are authored by Users), each of which can contain comments where each comment is also made by one of the existing users.

To simplify the setup we will use the embedded sequel Lite DB, but you can easily configure
the app later on to work against a real MySQL or Postgres if you'd like.

The best thing to start is to create an example Praxis application. To do so, let's use the Praxis
example generator to build us one:

```shell
gem install praxis # Let's make sure we have Praxis installed in the system
praxis example firstapp && cd firstapp
bundle
```

This example Praxis app is a very simple API that is simply able to list users, which are stored in a DB, and only have a few attributes like id, uuid, email, first_namd and last_name. That's it, there is not much in there, but at least it has the basic directory structure, Gemfile, etc...

Ok so at this point we already have a fully bundled Praxis app. We can now create, migrate and populate its DB with some some users, and then we can trivially start it up on port 9292 by (i.e., `bundle exec rake db:recreate && bundle exec rackup`). 

If you are curious about what you just started, you can test it out by getting the list of all populated users by issuing the following curl command from a different shell:

```shell
# Get all Users in the DB (api version can also be requested through an X-Api-Version header)
curl 'http://localhost:9292/users?api_version=1'
```

Allright then. We have a basic app scaffold and a configured and working DB with some users in it. Seems like a good starting point to build on. Let's stop our server (CTRL-C) for now, and start building our Posts and Comments API.

