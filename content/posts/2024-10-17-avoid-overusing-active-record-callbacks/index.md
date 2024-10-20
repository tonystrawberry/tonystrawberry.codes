---
title: Avoid overusing Active Record callbacks
description: Active Record callbacks are a powerful feature in Rails, but they can make the code harder to understand and maintain if overused.
date: 2024-10-17
draft: false
slug: avoid-overusing-active-record-callbacks
tags:
  - Rails
  - Ruby
  - Best Practices
---

In one of my recent projects, I came across a model that had a lot of callbacks. Like a dozen of `:after_create`.
It was hard to predict what would happen when a record was created or updated.

Here is an example of a model with many callbacks:
```ruby
class Company < ApplicationRecord
  after_create :create_default_settings
  after_create :create_default_users
  after_create :create_default_products
  after_create :create_default_categories
  after_create :create_default_orders
  after_create :create_default_invoices
  after_create :create_default_payments
  after_create :create_default_reports
  after_create :create_default_notifications
  after_create :create_default_subscriptions
  after_create :create_default_licenses
  after_create :create_default_logs
end
```

Testing was also a nightmare. When creating that company in my test, there was so much unpredictable behaviors.

For example, when testing the count records depending on the `Company` model, there were so many times my seemingly simple test was failing.

```ruby
RSpec.describe Company, type: :model do
  it "creates default settings" do
    company = Company.create(name: "Acme Inc.")

    company.create_user(name: "John Doe")
    expect(company.users.count).to eq(1) # Failing because of the callback `after_create :create_default_users` which creates a user
  end
end
```

The above test is failing because of the `after_create :create_default_users` callback which already creates default users (how many? I don't know).

For this particular case, I decoupled the creation of default records from the `Company` model and moved it to a service.

Let's see how my refactored code looks like and take the below model as an example.
```ruby
class Company < ApplicationRecord
  after_create :create_default_users
  after_create :create_default_products
  after_create :create_default_categories

  private

  def create_default_users
    # Create the default users
  end

  def create_default_products
    # Create the default products
  end

  def create_default_categories
    # Create the default categories
  end
end
```

I moved the creation of default records to a service.

```ruby
# app/services/companies/create_company_default_data.rb
class Companies::CreateCompanyDefaultData
  include Companies::DefaultUsers::Initializer
  include Companies::DefaultProducts::Initializer
  include Companies::DefaultCategories::Initializer
  ...

  def initialize(company)
    @company = company
  end

  def call
    create_default_users
    create_default_products
    create_default_categories
    ...
  end
end
```

```ruby
# app/services/companies/default_users/initializer.rb
module Companies::DefaultUsers::Initializer
  def create_default_users
    # Create the default users
  end
end
```

```ruby
# app/services/companies/default_products/initializer.rb
module Companies::DefaultProducts::Initializer
  def create_default_products
    # Create the default products
  end
end
```

```ruby
# app/services/companies/default_categories/initializer.rb
module Companies::DefaultCategories::Initializer
  def create_default_categories
    # Create the default categories
  end
end
```

Now the `Company` model is decoupled from the creation of default records (which is actually a business logic).
From my experience, extracting the business logic from the model to services makes the code easier to understand, test, and maintain.

## So when to use them and when to avoid them?

But callbacks are not always bad. They can be useful when used judiciously.

I avoid using callbacks when:
- the callback is crossing the model's boundary (like creating records in other models)
- having side effects that are not obvious (like sending emails, modifying other records)
- calling external services (like sending requests to external APIs)

I use them when:
- the callback change is directly related to the current record (like updating a derived column value)
- the callback is simple and easy to understand (like updating another column in the same model)

The answers in this thread on https://www.reddit.com/r/rails/comments/15thm2z/when_to_use_active_record_callback_and_when_to/ are also interesting.

> Callbacks are like salt — a little bit can help the model behave more like itself, but you dont want too much. I only use them as a last resort when it makes more sense to use a callback than not because they solve a problem, instead of merely feeling more convenient.

> Do use callbacks when there is automatic data preparation that needs to be done by the object in order to ensure data integrity (eg. combining duplicates in a hash or similar)

> I’ve used Rails for more than 15 years.

> The only ActiveRecord callback I will use is before_validation. There are too many gotchas when callbacks do things like update the record, update other records, call an API, enqueue a job, write to a file system, or anything else.

> Rails has many great features, but callbacks isn’t one of them. You should never use them, write service objects instead. If for some obscure reason you absolutely want to, avoid updating relations using callbacks, it’s only gonna lead to technical debt (best case) or bugs (worst case).

The more I read about it, the more I realize that callbacks should be used as a last resort.
They can make the code harder to understand and maintain if overused.
