---
title: Where to put logic in a Rails application
description: It might be difficult to decide where to put logic in a Rails application. Here are some tips to help you decide.
date: 2024-08-26
draft: false
slug: where-to-put-logic-in-a-rails-application
tags:
  - Rails
  - Ruby
---

Hello! 👋

Today, I want to share with you some tips on where to put logic in a Rails application.

When you're building a Rails application, you might find yourself wondering where to put your logic. Should you put it in the controller, the model, or maybe in a service object? It can be difficult to decide, especially if you're new to Rails.

I faced this problem when I started working with Rails and made some mistakes along the way. But over time, I've learned some better practices that have helped me decide where to put my logic.

## From fat controllers to fat models

One of the first things you'll hear when you start working with Rails is "fat models, skinny controllers". The idea is to keep your controllers thin by moving the business logic to the models.
The controller should only be responsible for handling the request, building the execution context (like authenticating the user, setting up the parameters, etc.), and delegating the core logic to the models.

Here's an example of a fat controller:

```ruby
# app/controllers/users_controller.rb
class UsersController < ApplicationController
  def create
    @user = User.new(user_params)

    if params[:invite_code].present?
      invite = Invite.find_by(code: params[:invite_code])
      if invite && !invite.expired?
        @user.apply_invite(invite)
      else
        flash[:error] = "Invalid or expired invite code."
        render :new and return
      end
    end

    if @user.save
      UserMailer.welcome_email(@user).deliver_now
      redirect_to @user, notice: 'User was successfully created.'
    else
      flash[:error] = @user.errors.full_messages.join(", ")
      render :new
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
```

**Folder structure**
```
├── app
│   ├── controllers
│   │   └── users_controller.rb (very big)
│   ├── models
│   │   └── user.rb
```

As you can see, this controller is doing a lot of things: creating a new user, applying an invite code, sending a welcome email, and handling errors. This is not ideal because it makes the controller hard to read, test, and maintain.

Now, let's refactor this controller to follow the "fat models, skinny controllers" principle.

```ruby
# app/controllers/users_controller.rb
class UsersController < ApplicationController
  def create
    @user = User.create_with_invite(user_params, params[:invite_code])

    if @user.persisted?
      redirect_to @user, notice: 'User was successfully created.'
    else
      flash[:error] = @user.errors.full_messages.join(", ")
      render :new
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end

# app/models/user.rb
class User < ApplicationRecord
  has_one :invite

  def self.create_with_invite(user_params, invite_code)
    user = new(user_params)

    if invite_code.present?
      user.apply_invite_code(invite_code)
    end

    if user.save
      user.send_welcome_email
    end

    user
  end

  def apply_invite_code(code)
    invite = Invite.find_by(code: code)
    if invite && !invite.expired?
      self.invite = invite
    else
      errors.add(:invite_code, "is invalid or expired")
    end
  end

  def send_welcome_email
    UserMailer.welcome_email(self).deliver_now
  end
end
```

**Folder structure**
```
├── app
│   ├── controllers
│   │   └── users_controller.rb
│   ├── models
│   │   └── user.rb (very big)
```

## From fat models to service objects

While moving logic from controllers to models is a good start, you might find that your models are getting too fat and are becoming over-responsible for too many things. This is where service objects come in.

Service objects are plain Ruby objects that encapsulate a specific piece of business logic. They are a great way to keep your models clean and focused on their core responsibilities.

Here's an example of a service object:

```ruby
# app/controllers/users_controller.rb
class UsersController < ApplicationController
  def create
    result = UserCreationService.new(user_params, params[:invite_code]).call

    if result.success?
      redirect_to result.user, notice: 'User was successfully created.'
    else
      flash[:error] = result.errors.join(", ")
      render :new
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end

# app/services/user/user_creation_service.rb
class User::UserCreationService
  attr_reader :user, :errors

  def initialize(user_params, invite_code)
    @user_params = user_params
    @invite_code = invite_code
    @errors = []
  end

  def call
    @user = User.new(@user_params)

    if @invite_code.present?
      apply_invite_code
      return self if @errors.any?
    end

    if @user.save
      UserMailer.welcome_email(@user).deliver_now
      @success = true
    else
      @errors += @user.errors.full_messages
      @success = false
    end

    self
  end

  def success?
    @success
  end

  private

  def apply_invite_code
    invite = Invite.find_by(code: @invite_code)
    if invite && !invite.expired?
      @user.invite = invite
    else
      @errors << "Invalid or expired invite code."
    end
  end
end
```

Now each piece of the business logic is encapsulated in its own service object, making the code easier to read, test, and maintain.
We can easily imagine that as the application grows, we can add more service objects to encapsulate more complex business logic instead of bloating the models.


**Folder structure**
```
├── app
│   ├── controllers
│   │   └── users_controller.rb
│   ├── models
│   │   └── user.rb
│   ├── services
│   │   └── user
│   │       └── user_creation_service.rb
|   |       └── user_deletion_service.rb
|   |       └── user_update_service.rb
|   |       └── ...
```

As a result:
- Models are becoming lighter and are responsible for managing the data and relationships.
- Controllers only are responsible for setting the execution context, handling the request and response as well as calling the right business actions.
- Service objects are responsible for the business logic.

## Conclusion

Deciding where to put logic in a Rails application can be challenging but service objects pattern provides a good way to structure your code and keep it clean and maintainable. Remember to keep your controllers thin, your models focused on data management, and your service objects responsible for business logic. This way, you can build a Rails application that is easy to read, test, and maintain. I hope this article helps you in your Rails journey!

Happy coding! 🚀
