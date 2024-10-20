---
title: "Generated columns: how to use this useful feature in Rails"
description: Learn how to use generated columns in Rails to improve performance and simplify your code
date: 2024-09-02
draft: false
slug: generated-columns-a-useful-feature-in-rails
tags:
  - Ruby on Rails
  - Ruby
  - Database
---

## What are generated columns?

Generated columns are columns in a database table whose values are automatically calculated based on a formula or expression. They are also known as computed columns or virtual columns.

This allows us to store the result of a calculation in the database without having to calculate it every time we need it.
Who already implemented `full_name` method in Rails models to concatenate the first and last name? 🙋‍♂️

```ruby
class User < ApplicationRecord
  def full_name
    "#{first_name} #{last_name}"
  end
end
```

Well, with generated columns, we can store the full name in the database and avoid calculating it every time we need it.

## How to create and use generated columns in Rails?

To create a generated column in Rails, we can use the `virtual` option in the `add_column` method in a migration.

```ruby
class AddFullNameToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :full_name, :virtual, type: :text, as: "first_name || ' ' || last_name", stored: true
  end
end
```

In this example, we are adding a `full_name` column to the `users` table. Note that we are using the `virtual` type and the `as` option to define the formula to calculate the value of the column.
`stored: true` tells the database to store the value of the column in the table. When `stored` is set to `false`, the column is not stored as a physical column in the table, but it is calculated on read.

When creating a table, it looks like this:

```ruby
create_table :users do |t|
  ...
  t.virtual :full_name, type: :text, as: "first_name || ' ' || last_name", stored: true
end
```

After running the migration, we can use the `full_name` column as if it were a regular column in the table.

```ruby
user = User.create(first_name: "John", last_name: "Doe")
puts user.full_name # John Doe
```

When we update the `first_name` or `last_name` columns, the `full_name` column is also automatically updated.

```ruby
user.update(first_name: "Jane")
puts user.full_name # Jane Doe
```

## Why use generated columns?

If the calculation is heavy (for the `full_name` case above, the calculation is quite negligible...), it can be a good idea to store the result in the database to avoid recalculating it every time we need it (`stored` must be set to `TRUE`). This can improve the speed of retrieval.

Generated columns can be useful when we need to calculate a value based on other columns in the table and want to avoid calculating it every time we need it (e.g., full name, value-added tax, conversion rate).

For reporting tasks when we need to display some derived data based on the existing data in the table, generated columns can allow us to simplify the queries.

Centralizing the calculation logic in the database can help us avoid duplicating the logic in the application code and ensure consistency across the application.

## Conclusion

Generated columns are a simple yet useful feature in databases that can help us improve performance, simplify our code, and ensure data consistency. By using generated columns in Rails, we can avoid calculating derived values every time we need them and centralize the calculation logic in the database.
