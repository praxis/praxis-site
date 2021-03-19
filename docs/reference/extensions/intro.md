---
title: Introduction
---

The philosophy of Praxis is to be a high productivity framework where you can immediatly leverage many framework functions while keeping all of those extensions and building blocks as optional. This way you can always decide to customize and combine the things that make more sense to you as your application changes or evolves.

Therefore, at its core, Praxis provides extensions for rendering, automatic DB query building, pagination and sorting, API filtering, and many more lower level classes you can leverage to build your apps.

At the same time, it is likely that you'll want to take advantage of many of these extensions together, so Praxis also provides things like the `MapperPlugin` or `PaginationPlugin` which configure multiple of those building blocks in a ready to use manner. Think of it as a meta-extensions. We higly recommend you use them, at least as a start, rather than trying glue all the individual extensions together.