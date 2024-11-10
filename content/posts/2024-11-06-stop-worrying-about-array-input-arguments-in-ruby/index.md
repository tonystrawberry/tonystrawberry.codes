---
title: Stop worrying about array input arguments in Ruby
description: Sometimes, we may want a method that is expected to work with an array input argument. But as you know, Ruby is a duck-typed language, and it doesn't care if the input is an array or not. In this post, we will see how to handle this situation.
date: 2024-10-17
draft: false
slug: stop-worrying-about-array-input-arguments-in-ruby
tags:
  - Rails
  - Ruby
  - Confident Ruby Book
---

I am currently reading the book [Confident Ruby](https://store.avdi.codes/l/rrWapR?layout=profile) by Avdi Grimm. It's a great book that teaches you how to write Ruby code that is easy to maintain and change. In this post, I want to share a tip from the book that I found interesting.

Sometimes, we may want a method that is expected to work with an array input argument. But as you know, Ruby is a duck-typed language, and it doesn't care if the input is an array or not.

For example, let's consider the following method that is expected to work with an array input argument:

```ruby
def process_items(items)
  items.each do |item|
    puts item
  end
end
```

If you call this method with an array, it will work as expected:

```ruby
process_items([1, 2, 3])
# 1
# 2
# 3
```

But what if you call this method with a single item or a nil value, or even a string?

```ruby
process_items(1)
# (irb):2:in `process_items': undefined method `each' for 1:Integer (NoMethodError)

process_items(nil)
# (irb):2:in `process_items': undefined method `each' for nil:NilClass (NoMethodError)

process_items("Hello")
# (irb):2:in `process_items': undefined method `each' for "Hello":String (NoMethodError)
```

As you can see, the method will raise an error because the input is not an array. Fortunately, Ruby provides a method called `Array()` that can be used to convert the input to an array.

```ruby
Array("tony")                    # => ["tony"]
Array([1,2,3])                  # => [1, 2, 3]
Array([])                       # => []
Array(nil)                      # => []
Array({:a => 1, :b => 2})       # => [[:a, 1], [:b, 2]]
Array(1..5)                     # => [1, 2, 3, 4, 5]”
```

So, you can modify the method to convert the input to an array before processing it:

```ruby
def process_items(items)
  Array(items).each do |item|
    puts item
  end
end
```

Now, that method won't cause a crash anymore when called accidentally with a non-array input and we can stop worrying about the type of the input argument.

Of course, the decision to convert the input to an array or not depends on the requirements of your method. But it's good to know that you can use `Array()` to handle this situation.
