---
title: Using strict loading for avoiding lazy loading and N+1 queries
description: Strict loading is a feature in Rails that helps you avoid lazy loading and N+1 queries by raising an error when you try to access an association that hasn't been loaded.
date: 2024-10-17
draft: false
slug: avoid-overusing-active-record-callbacks
tags:
  - Rails
  - Ruby
  - Best Practices
---


Have you ever heard of strict loading in Rails?
That feature is helping Rails developers prevent lazy loading and N+1 queries by raising an error when you try to access an association that hasn't been loaded.

For example, let's say we have an `Article` model that `has_many` comments.

```ruby
class Article < ApplicationRecord
  has_many :comments
end
```

If we load an article and try to access its comments without loading them, Rails will raise an error.

```ruby
articles = Article.all
articles.each do |article|
  puts article.comments # Raises an error
end

# An error occurred when inspecting the object: #<ActiveRecord::StrictLoadingViolationError: `Article` is marked for strict_loading. The Comments association named `:comments` cannot be lazily loaded.>
```

The above example is clearly an example of N+1 queries but that strict loading feature will help you catch that error in development and avoid it.

It is possible to set the `strict_loading` option on associations to `true` to enable strict loading for that association.

```ruby
class Article < ApplicationRecord
  has_many :tags
  has_many :comments, strict_loading: true
end
```

Now, if you try to access the comments of an article without loading them, Rails will raise an error.

```ruby
articles = Article.all
articles.each do |article|
  puts article.tags # Works fine even though it's an N+1 query
end

articles.each do |article|
  puts article.comments # Raises an error
end
```

If you want to enable strict loading for all associations in a model, you can set the `strict_loading` option to `true` in the model class.

```ruby
class Article < ApplicationRecord
  self.strict_loading = true

  has_many :tags
  has_many :comments
end
```

### Enabling strict loading globally

We can enable strict loading globally in the Rails application by setting the `config.active_record.strict_loading_by_default` option to `true` in the `config/application.rb` file (or in an environment-specific configuration file). This may be useful to catch N+1 queries in development and avoid them.

```ruby
config.active_record.strict_loading_by_default = true
```

### What about the production environment?

In production environment, you may want to log the strict loading violations instead of raising an error.
You can set the `config.active_record.action_on_strict_loading_violation` option to `:log` in the `config/application.rb` file.

```ruby
config.active_record.action_on_strict_loading_violation = :log
```

### What about the cases when it is not a N+1 query?

In some cases, some lazy loaded associations are not N+1 queries.
For example, when you have a `has_one` association, it is not an N+1 query because the association can be loaded with a single query.

It is possible to specify the `strict_loading` option with the `mode: :n_plus_one_only` value to enable strict loading only for N+1 queries. By default, it is set to `:all`.

```ruby
class User < ApplicationRecord
  has_one :address
end

user.strict_loading!(mode: :n_plus_one_only)
user.address # Does not raise an error
```
