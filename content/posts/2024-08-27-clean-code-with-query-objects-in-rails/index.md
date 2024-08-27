---
title: Clean Code with Query Objects in Rails
description: Learn how to use query objects in Rails to keep our database complex queries clean and maintainable.
date: 2024-08-27
draft: false
slug: clean-code-with-query-objects-in-rails
tags:
  - Rails
  - Ruby
  - Design Patterns
---

Hello! 👋

In my current project at work, I had to deal with complex queries that involved multiple tables and conditions.
I couldn't find a way to organize these queries in a clean and maintainable way: there were too many scopes in the models, the controllers were getting bloated with complex queries emcompassing multiple models, and the tests were becoming hard to read and maintain.

That's when I discovered query objects in Rails through the book "Layered Design for Ruby on Rails Applications".
Query objects are a great way to encapsulate complex queries in a single object, making the code easier to read, test, and maintain.

But first, let's understand the problem with complex queries in Rails.

## The problem with complex queries in Rails

When you're working with Rails, you'll often find yourself writing complex queries that involve multiple tables and conditions.
Like the one below:

```ruby
# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  def index
    @posts = Post.joins(:categories, :tags)

    @posts = @posts.where(published_at: params[:min_published_at]..) if params[:min_published_at].present?
    @posts = @posts.where(category: { id: params[:category_ids] }) if params[:category_ids].present?
    @posts = @posts.where(tags: { id: params[:tag_ids] }) if params[:tag_ids].present?

    @posts = @posts.order(created_at: :desc).limit(10)

    render json: @posts
  end
end
```

As you can see, we have here a complex query that involves multiple tables and conditions.
The controller is also tightly coupled with the business logic, which is not ideal.

If we want to add more conditions or change the query, we'll have to modify the controller, which can lead to bloated controllers and hard-to-maintain code.

Rails provides scopes to help you build complex queries by breaking them down into smaller pieces.
Let's refactor the above code using scopes:

## Using scopes to refactor complex queries

```ruby
# app/models/post.rb
class Post < ApplicationRecord
  has_many :post_categories, dependent: :destroy
  has_many :post_tags, dependent: :destroy
  has_many :categories, through: :post_categories
  has_many :tags, through: :post_tags

  scope :by_published_at, ->(min_published_at) { where(published_at: min_published_at..) if min_published_at.present? }
  scope :by_category_ids, ->(category_ids) { where(category: { id: category_ids }) if category_ids.present? }
  scope :by_tag_ids, ->(tag_ids) { where(tags: { id: tag_ids }) if tag_ids.present? }
  scope :recent, -> { order(created_at: :desc).limit(10) }

  def self.filter(filters: {})
    posts = all
    posts = posts.by_published_at(filters[:min_published_at])
    posts = posts.by_category_ids(filters[:category_ids])
    posts = posts.by_tag_ids(filters[:tag_ids])
    posts.recent
  end
end

# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  def index
    @posts = Post.filter(filters: {
      min_published_at: params[:min_published_at],
      category_ids: params[:category_ids],
      tag_ids: params[:tag_ids]
    })

    render json: @posts
  end
end
```

A lot better, right?
We've moved the complex query logic from the controller to the model using scopes.
Although this way is acceptable, we are turning our models into "God objects" that are overloaded with responsibilities. These queries are directly related to user-facing features and are highly volatile.

We can easily imagine that the `Post` model will grow with more scopes and methods, making the developer confused about where each scope are used.

That's where query objects come in.

## Using query objects to encapsulate complex queries

Query objects add another layer of abstraction to our application, separating the query logic from the models and controllers.
We completely isolate the query logic in a separate object resulting in maintainable and testable piece of code. Indeed, whenever we need to change the query, we can now do it in a single place without worrying about breaking other parts of the application.

Let's see what a query object looks like:

```ruby
# app/queries/posts/list_with_filter_query.rb
class Posts::ListWithFilterQuery
  attr_reader :filters

  def initialize(filters)
    @filters = filters
  end

  def call
    posts = Post.all
    posts = posts.where(published_at: @filters[:min_published_at]..) if @filters[:min_published_at].present?
    posts = posts.where(category: { id: @filters[:category_ids] }) if @filters[:category_ids].present?
    posts = posts.where(tags: { id: @filters[:tag_ids] }) if @filters[:tag_ids].present?
  end
end
```

And now, we can use this query object in our controller:

```ruby
# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  def index
    @posts = Posts::ListWithFilterQuery.new({
      min_published_at: params[:min_published_at],
      category_ids: params[:category_ids],
      tag_ids: params[:tag_ids]
    }).call

    render json: @posts
  end
end
```

We have completely disconnected the query logic from the models and controllers making them both lightweight. It is now a more scalable approach since all new queries can be added as new query objects.

Testing them is also easier since each query object file can have its own test file.

## Conclusion

I have become a big fan of query objects in Rails. I am always looking for ways to make my codebase easier to navigate, read, and maintain. Query objects is a great addition to my toolbox.
Models are now more focused on their responsibilities, controllers are lightweight and testing these query objects is as simple as testing a single method.
