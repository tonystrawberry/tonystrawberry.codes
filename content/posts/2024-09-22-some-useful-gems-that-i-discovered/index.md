---
title: "Some useful gems that I discovered along my learning journey"
description: I discovered some useful gems that helped me accelerate development.
date: 2024-09-22
draft: false
slug: some-useful-gems-that-i-discovered-along-my-learning-journey
tags:
  - Ruby on Rails
  - Gems
  - Development
---

Hi there! 👋

These days, I am studying Ruby on Rails more in-depth. I recently subscribed to the [GoRails](https://gorails.com/) Pro plan, and I am learning a lot from the screencasts and tutorials there. The book called [Layered Design for Ruby on Rails Applications](https://www.amazon.co.jp/Layered-Design-Ruby-Rails-Applications/dp/1801813787) that I read some weeks ago also gave me a lot of insights into how to structure Rails applications better.

So through them, I discovered some gems that I found very useful and that I would like to use in my future projects. Here are some of them:
- [view_component](https://www.google.com/search?q=view+component+rails&oq=view+component&gs_lcrp=EgZjaHJvbWUqDggAEEUYJxg7GIAEGIoFMg4IABBFGCcYOxiABBiKBTIGCAEQRRhAMgYIAhBFGDkyBggDEEUYOzIGCAQQRRg7MgYIBRBFGDwyBggGEEUYPDIGCAcQRRg80gEIMTY4MmowajGoAgCwAgA&sourceid=chrome&ie=UTF-8)
- [mobility](https://github.com/shioyama/mobility)
- [prefixed_ids](https://github.com/excid3/prefixed_ids)

## view_component

[ViewComponent](https://viewcomponent.org/) is a gem that helps you to create reusable, testable, and encapsulated view components in Rails. I like the idea of having a component that is self-contained and that can be tested independently of the rest of the application.

This results in following the Single Responsibility Principle (SRP) more strictly.

Before, I used to create partials to define such components but there was no clear separation between the logic and the view. Indeed, it is common to see partials with a lot of dependencies which makes them hard to test and maintain.

With ViewComponent, I can define the logic in the component class and the view in the component template file and it becomes clear what dependencies the component has.

Let's illustrate this with an example. Let's suppose we have a counter component that displays a count.

In the case of partials, I would have a partial file like this:

```erb
<!-- app/views/shared/_counter.html.erb -->
<div>
  <p>Count: <%= count %></p>
</div>
```

And I would use it in my views like this:

```erb
<%= render(partial: 'shared/counter', locals: { count: 10 }) %>
```

With ViewComponent, I can define the component in a class and a template file in the `app/components` directory.

```ruby
# app/components/counter_component.rb
class CounterComponent < ViewComponent::Base
  def initialize(count:)
    @count = count
  end
end
```

```erb
<!-- app/components/counter_component.html.erb -->
<div>
  <p>Count: <%= @count %></p>
</div>
```

And I can use this component in my views like this:

```erb
<%= render(CounterComponent.new(count: 10)) %>
```

This is a simple example but it shows how ViewComponent can help to structure the code better.

## mobility

This gem is a translation library that allows you to translate your database columns into multiple languages. It is very useful when you have to support multiple languages in your application.

Usually, we use the built-in `i18n` library to translate the strings in the views. But when it comes to translating the database columns, it becomes a bit more complicated as the values are user-input and dynamic.

Well, if we had to do it ourselves, we could:
- store the translated values as columns in the same table (`title_en`, `title_fr`, etc.). But this would make the table very wide and hard to maintain (it is not scalable as we would have to add a new column for each new language).
- store the translated values in a separate table `translations` and link them to the table we want to translate.

The latter is what Mobility does. It creates a table for storing these translations. It also provides a nice API to access the translated values based on the current locale.

Here is an example of how to use it for a `Post` model with translated `title` (the model does not need to have a `title` column):

```ruby
class Post < ApplicationRecord
  extend Mobility
  translates :title, type: :string
end
```

And you can access the translated values like this:

```ruby

post = Post.create(title_en: 'Hello, world!', title_fr: 'Bonjour, le monde!')
I18n.locale = :fr
post.title
# => 'Hello, world!'

I18n.locale = :en
post.title
# => 'Bonjour, le monde!'
```

## prefixed_ids

Last but not least, this gem is a simple one but very useful. It allows you to generate prefixed IDs for your models.
Have you ever worked with Stripe? If so, you might have noticed that the IDs of the resources are prefixed with the resource type (e.g., `cus_` for customers, `sub_` for subscriptions, etc.).

This is what this gem does. It generates prefixed IDs for your models and makes them safer than using the default auto-incremented IDs.

By using this gem, it is also possible to use `find` with the prefixed ID to find the record.

Here is an example of how to use it:

```ruby
class User < ApplicationRecord
  has_prefix_id :user # this will generate ids like 'user_xxxxxx', where 'xxxxxx' is a random string
end
```

And you can use it like this:

```ruby
user = User.create
user.id
# => 'user_xxxxxx'

User.find('user_xxxxxx')
# => #<User id: 1, ...>
```

## Conclusion

I hope you found these gems as useful as I did. I am looking forward to using them in my future professional projects (I am actually applying them in my [Netflix clone project](https://github.com/tonystrawberry/netflix/)).
See you in the next post! 🚀
