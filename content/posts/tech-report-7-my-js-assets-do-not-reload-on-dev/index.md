---
title: "Tech report #7 🔖 Rails - Why hot reload stopped working for the Javascript of my Rails application"
description: How to fix the hot reload of Javascript assets in Rails (development environment)
date: 2023-08-17
draft: false
slug: tech-report-7-rails-javascript-assets-do-not-reload-on-dev
tags:
  - Rails
  - Assets
  - Configuration
---

I stumbled across a problem in one of my Rails project. The hot reload of Javascript assets stopped working.
That affected greatly the development experience since I had to re-precompile the assets and restart the server every time I made a change in the Javascript code.

It worked fine when I first joined the project but it stopped working after some time for unknown reason.
I finally found the cause of the problem after getting my head around the Rails configuration and some research.

References:
- https://stackoverflow.com/questions/50907198/how-is-the-serving-of-public-assets-different-in-development-and-production-mode
- https://guides.rubyonrails.org/asset_pipeline.html#precompiling-assets

For some reason, in my local environment, I ran `rake assets:precompile` at some point and it generated the `public/assets` directory.
I didn't notice it at first but it was the cause of the problem.

According to the Rails documentation,
> If precompiled assets are available, they will be served — even if they no longer match the original (uncompiled) assets, even on the development server.

That means if you have precompiled assets inside your `public/assets` folder, the sevrer will serve them instead of the assets inside the `app/assets` folder even on the development environment. That is why even if I made changes to the Javascript code, the changes were not reflected in the browser and I needed to precoompile the assets and restart the server to see the changes.

Fortunately, the solution is simple. I just need to delete the `public/assets` folder and the hot reload will work again.

```shell
rails assets:clobber
```

One more solution is to change the `config.assets.prefix` value in `config/environments/development.rb` to something else than `/assets` (e.g. `/dev-assets`).

According to the Rails documentation,
> To ensure that the development server always compiles assets on-the-fly (and thus always reflects the most recent state of the code), the development environment must be configured to keep precompiled assets in a different location than production does. Otherwise, any assets precompiled for use in production will clobber requests for them in development (i.e., subsequent changes you make to assets will not be reflected in the browser).

> You can do this by adding the following line to config/environments/development.rb:

```ruby
config.assets.prefix = "/dev-assets"
```
