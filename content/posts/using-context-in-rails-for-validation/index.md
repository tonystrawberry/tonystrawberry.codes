---
title: Using context in Rails for Validation
description: Learn how to use `context` in Rails for validation
date: 2024-08-26
draft: false
slug: using-context-in-rails-for-validation
tags:
  - Rails
---

Hello! 👋

Today, I want to share with you a cool feature in Rails that you might not be aware of: `context` in validation.

When you're building a Rails application, you often need to validate your models based on different scenarios. For example, you might want to validate the presence of a field only when a certain condition is met, or you might want to skip a validation in a specific context.

This is where `context` comes in handy. By using `context` in your validations, you can define different scenarios in which the validation should be applied. Let me show you how it works with an example:

```ruby
# app/models/match.rb
class Match < ApplicationRecord
  validates :home_team_members_count, equality: { value: 11 }, context: :official_match
  validates :home_team_members_count, less_or_equal_than: { value: 11 }, context: :friendly_match

  validates :away_team_members_count, equality: { value: 11 }, context: :official_match
  validates :away_team_members_count, less_or_equal_than: { value: 11 }, context: :friendly_match
end


# any/where.rb

match.home_team_members_count = 100
match.save!(context: :official_match) # => Validation failed: Home team members count must be equal to 11

match.home_team_members_count = 11
match.save!(context: :official_match) # => Validation passed and saved

match.home_team_members_count = 100
match.save!(context: :friendly_match) # => Validation failed: Home team members count must be less than or equal to 11

match.home_team_members_count = 5
match.save!(context: :friendly_match) # => Validation passed and saved

match.home_team_members_count = 100
match.save! # => Validation passed and saved
```

In this very simple example, we have created two different contexts for our validations: `official_match` and `friendly_match`.
On `official_match` context, we want to validate that the number of team members is exactly 11, while on `friendly_match` context, we want to validate that the number of team members is less than or equal to 11.
