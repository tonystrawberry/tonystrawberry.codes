---
title: "My experience as a daily code reviewer"
description: I am doing code reviews every day. And I am trying to get better at it.
date: 2024-09-10
draft: false
slug: my-experience-as-a-daily-code-reviewer
tags:
  - Code Review
  - Best Practices
---

Hi there! 👋

As part of my daily routine as a tech lead (this is the title in my company, please don't bash me 😅), I do code reviews for my team members.
I have been doing this for a while now, and I am trying to get better at it every day.


# Outside of the code...

Now, before diving into the code and the pull request, there are a few things I always keep in mind.
These are more about the mindset and approach to code reviews rather than the code itself.

## Know your team

When you are doing code reviews, it is essential to know your team members. Their strengths, weaknesses, and the areas they are trying to improve.
The team members might be at different levels of experience, and it is crucial to understand that and to provide feedback accordingly.

A junior developer might need more guidance and feedback than a senior developer, for example.

Well, knowing your team members better will come with time, but it is essential to keep this in mind when doing code reviews.

## Understand the context of the project

I have been a code reviewer for in-house projects with focus and priority on quality and performance over speed. To be honest, this is the best environment to be in as a code reviewer as you can take the time to write detailed feedback and suggestions.

But well, time is money, and sometimes you need to deliver fast. And for the projects with tight deadlines (especially those in the consulting business), you might need to compromise on the quality a bit to deliver on time.

Of course, you should always strive for the best quality possible, but sometimes you need to make compromises. And being able to identify when to make these compromises and what to compromise on is crucial.

## Make everyone better (including yourself) with your feedback

As a tech lead, I always try to make my team members better with my feedback.
If at the end of the project, the team members have learned something new and grew their skills, then I consider it a success.

Be also open to learn from your team members. They might have a different perspective on things, and you can learn a lot from them. It should be a two-way street.

## Have empathy

This might be the most important point. I always try to put myself in the shoes of the person who wrote the code.
I try to understand why they did things the way they did and what they were thinking when they wrote the code.

This helps me to provide more appropriate and detailed feedback and suggestions.

As a rule that is guiding me, I try to be the reviewer I would like to have.

## Be explicit at all times

When providing feedback, I always try to be explicit and clear to leave no room for ambiguity.
If necessary, I provide code snippets or examples to illustrate my point.

This speeds up the feedback process and helps the team members to correct the issues faster.
For example, instead of saying "This code is not clear", I would say "This method is doing too many things. It would be better to split it into smaller methods". That would avoid the reviewee to ask "What do you mean by 'not clear'?" and thus, save precious time.

## Be encouraging

As a leader, I always try to be encouraging in my feedback and to tell the team members what they did well. That helps to keep the motivation high and to make the team members feel valued.

A `LGTM! Good job! 🚀` comment can go a long way.

# Code quality

Now, let's talk about the code quality itself.

## Good code is understandable code

When reviewing code, I always look for readability and understandability.
If I can't understand the code easily, then it is not a good code to me, no matter how clever it is.

When I say code, I also include the comments. Sometimes, there are very complex pieces of code that need comments to explain what they are doing.
And I would consider it a good code if that complex part is well-commented and easy to understand.

## Consistency is key

Consistency is crucial in code. This is a big one in my current project. Indeed, I have been working on a project with a lot of developers, and of course the coding styles are different which makes reading the code a bit harder.

Introduce linters when possible to enforce a consistent coding style. This will avoid unnecessary discussions about coding styles.

## Testing is a must

Okay, this is a no-brainer. But I have seen a lot of code without tests. And I always ask for tests in my code reviews.
Ideally, the entire codebase should be covered by tests, but I understand that it is not always possible. When it is not possible (lack of time), I at least ask them to add `TODO:` comments to remind them to add tests later.

But let's not forget that when testing is difficult, it often indicates a red flag and that the code has room for improvement (not enough separation of concerns, too many dependencies, etc.).

Having tests is an investment for the future. You will thank them later when you need to refactor the code and have confidence that you didn't break anything.

## Let's name things properly

Naming things the right way is super important. A good name should be descriptive and should tell you what the variable, method, or class is doing.

## Comments

Comments should explain the WHY (and not the WHAT) of the code. They also should be written only when necessary. If the code is clear enough, then there is no need for comments.

## Does it do what it is supposed to do? (and no more)

This one might seem obvious. But it is sometimes easy to focus on just the code quality and forget about the functionality itself.

Ideally, when I have time, I run the code locally to see if it works as expected.

In my current project where I have to review lot of code and also develop features at the same time, it is not always possible.

But even so, I at least try to understand the code and see if it does what it is supposed to do.

Also, the code should just do what it is supposed to do and nothing more. No unnecessary complexity, no unnecessary features.

# Conclusion

I hope you found this article useful. It is not a technical article this time but hey, it's not only about the code sometimes. I am trying to apply the above points every day in my code reviews and so far, it has been working well for me. Please let me know if you have any other tips or suggestions for code reviews.

Bonus: spice up your code reviews with gifs from my [LGTM gallery](https://lgtmarvelous.vercel.app/).
