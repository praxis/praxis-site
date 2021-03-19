---
title: Document Generation
---
Praxis makes it easy to generate documentation for your app. To generate
documentation:

1. create one or more [endpoint definitions](endpoint-definitions)
2. create one or more associated [media types](media-types)
3. generate OpenApi 3.x documentation!

There are 3 associated tasks with generating documentation:

* the most useful thing to do while developing and designing is to run `praxis docs browser` (or invoke the equivalent `praxis:docs:browser` rake task). This task will generate the OpenAPI docs under `docs/openapi/*` (in both yaml and json format) and then will open a browser window loading them for you to browse. The Embedded OpenApi browser we use is reDoc.
* the task that you might want to run in CI or when you're ready to release a new version of the code is `praxis docs generate`. It essentially only does all the OpenApi generation of documents, but won't open a UI browser.
* the third one is simply called `praxis docs package` which basically consists of invoking the generation, and then packaging all the files in to a single zip file, left at `docs/openapi.zip`. You can then easily copy and deflate this file behind a web server to host your docs.

If your application has multiple API versions, there will be a directory for each of them, and the document generator will create a very (and I mean, very) basic index.html in the root that can link to each of them. Feel free to bring your artistic design chops to make multiple API version documents easier to browse.

Here's a very simple screenshot of how the document browser (i.e., reDoc) displays the generated documentation:

![Document Browser](/img/first-api-doc-browser.png)
