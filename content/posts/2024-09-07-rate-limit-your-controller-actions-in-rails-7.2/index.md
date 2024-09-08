---
title: "Rate limit your controller actions in Rails 7.2"
description: A new feature in Rails 7.2 allows you to rate limit your controller actions easily
date: 2024-09-07
draft: false
slug: rate-limit-your-controller-actions-in-rails-7-2
tags:
  - Ruby on Rails
  - Ruby
  - API
---

Hi there! 👋

With the release of Rails 7.2, some new features have been added to the framework.
One of the new features is the ability to rate limit your controller actions easily.

Before the introduction of this feature, you would have to use a third-party gem like [`rack-attack`](https://github.com/rack/rack-attack) to achieve this.

For rate limiting your controller actions, you would have done something like this for throtting a particular action:
```ruby
# config/initializers/rack_attack.rb

Rack::Attack.throttle("requests by ip", limit: 3, period: 2) do |request|
  if request.path == '/users' && request.get?
    request.ip
  end
end
```

But with Rails 7.2, you can now do the same thing directly in your controller like so:
```ruby
class UsersController < ApplicationController
  rate_limit to: 3, within: 2.seconds, only: :index

  def index
    ...
  end
end
```

## How it works

The implementation of this feature can be found in the `Rails` repository [here](https://github.com/rails/rails/blob/main/actionpack/lib/action_controller/metal/rate_limiting.rb).

Here is the code snippet for the `rate_limit` method (as of August 2024):

```ruby
module ActionController # :nodoc:
  module RateLimiting
    extend ActiveSupport::Concern

    module ClassMethods
      def rate_limit(to:, within:, by: -> { request.remote_ip }, with: -> { head :too_many_requests }, store: cache_store, **options)
        before_action -> { rate_limiting(to: to, within: within, by: by, with: with, store: store) }, **options
      end
    end

    private
      def rate_limiting(to:, within:, by:, with:, store:)
        count = store.increment("rate-limit:#{controller_path}:#{instance_exec(&by)}", 1, expires_in: within)
        if count && count > to
          ActiveSupport::Notifications.instrument("rate_limit.action_controller", request: request) do
            instance_exec(&with)
          end
        end
      end
  end
end
```

Very simple and straightforward, right?
- The `RateLimiting` module defines the `rate_limit` class method (the one that you use in your controllers).
- Under the hood, it uses the `before_action` method to call the `rate_limiting` private instance method that does the actual rate limiting.
- The `rate_limiting` method increments the count of requests for the given action and checks if it exceeds the limit. The `count` are kept in the cache store (by default) and are stored with a key that includes the controller path and the `by` block result.

The [documentation](https://edgeapi.rubyonrails.org/classes/ActionController/RateLimiting/ClassMethods.html) also provides a good example of how to use this feature in your controllers.

## Rate limit does not work in development environment

By default, caching is disabled in the development environment, thus making the rate limiting feature not save the count of requests.
You can enable caching in the development environment by adding the following line to your `config/environments/development.rb` file:
```bash
rails dev:cache
```

That will simply create a `tmp/caching-dev.txt` file in your Rails application directory, which will enable caching in the development environment.

I hope you will make good use of this new feature in Rails 7.2! 🚀
