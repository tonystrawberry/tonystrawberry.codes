---
title: "How to use method arguments in before actions in Rails"
description: Learn how to use method arguments in before actions in Rails to make your controllers more flexible
date: 2024-09-03
draft: false
slug: how-to-use-method-arguments-in-before-actions-in-rails
tags:
  - Ruby on Rails
  - Ruby
---

Hi there! 👋

There are times when you need to pass arguments to a `before_action` in Rails.

For example, in the case of a controller with a `before_action` that is slightly different depending on the action, you might want to define two different methods like so:

```ruby
class SettingsController < ApplicationController
  before_action :authenticate_user_on_index!, only: [:index]
  before_action :authenticate_user_on_sign_up!, only: [:sign_up]

  ...

  private

  def authenticate_user_on_index!
    ...
  end

  def authenticate_user_on_sign_up!
    ...
  end
end
```

But for this case, assuming that the two methods are similar, you can use a single method with arguments to make it more DRY. Here's how you can pass arguments to a `before_action` in Rails:

```ruby
class SettingsController < ApplicationController
  before_action -> { authenticate_user!(action: :index) }, only: [:index]
  before_action -> { authenticate_user!(action: :sign_up) }, only: [:sign_up]

  ...

  private

  def authenticate_user!(action:)
    ...
  end
end
```

## Let's go further

Similarly to https://github.com/rails/rails/blob/69c86f9606e490b24e8628dc47f34fbec6b321d1/actionpack/lib/action_controller/metal/allow_browser.rb#L47, you can define the `before_action` method inside a class method to make it more reusable and readable:

```ruby
class SettingsController < ApplicationController
  ...
  authenticate_user!(action: :index, only: [:index])

  private

  def self.authenticate_user!(action:, **options)
    before_action -> { authenticate_user!(action: action) }, **options
  end
end
```

In this article, I introduced a way to use method arguments in `before_action` in Rails to make your controllers more flexible. I hope you found it useful! 🚀
