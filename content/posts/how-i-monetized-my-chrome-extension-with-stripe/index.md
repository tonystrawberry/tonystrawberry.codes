---
title: How I Monetized My Chrome extension With Stripe
description: A technical guide on how to earn money with a Chrome extension
date: 2022-04-01
draft: true
slug: how-i-monetized-my-chrome-extension-with-stripe
tags:
  - Chrome
  - Extension
  - Tech
  - Money
  - Tutorial
---

# What did I build?

Last year (September 2021), I built a useful Chrome Web Extension for improving the user experience on the [Axie Infinity Marketplace](https://marketplace.axieinfinity.com/axie/).

Axie Infinity is a NFT game that has revolutionized the world of gaming by allowing players to earn money while playing the game. On the Axie Infinity Marketplace, the players can buy characters called Axies which are played in the game.

The extension that I have developed adds some handy features such as:

- bookmarking Axies
- being alerted on Discord when a particular Axie has become on sale
- displaying useful information that are only accessible via API
- and so on...

# How did I make money out of it?

I wanted to make some features accessible only for subscribed members.
In order to manage subscriptions, I also wanted to use Stripe as a payment processor.

When I was looking for solutions for that, I found two solutions:

1. using a third-party library called ExtensionPay that would manage all the payments for me
2. building a custom solution integrating Stripe by myself

I opted for the first one at the beginning since I only wanted to have a simple one-time payment system and did not want to spend a lot of time developing one myself.

But then, 4 months later, I needed to complexify my payment system by adding a monthly subscription on top of the one-time payment which was not possible with ExtensionPay at the time.

That's why I removed the integration with ExtensionPay and started building my own solution using Stripe API.

## ExtensionPay

ExtensionPay is an extremely easy-to-use library.
You only need to create an account on their website, follow the "how to get started" steps, and finally add the library in your extension by following the [documentation](https://github.com/Glench/ExtPay).

As a result, you will have a completely functional payment system in less than 30 minutes.

### PROS 🥰

- Very easy and quick to setup
- One time payment and monthly & yearly recurring subscriptions both available

### CONS 😅

- Not suitable for complex payment systems (subscriptions on top of a one-time payment for example)
- No full control over your customer payment & subscription data (impossible to make a particular customer as a subscribe member manually for example)

## Custom solution with Stripe API

# It paid off...

At first, I was not really sure if I was going to make money out of it.
In the end, I did earn some but most importantly, I had a really fun experience on my journey creating a Discord for my extension and interacting directly with my users to get their feedbacks and suggestions...
It was really fulfilling to see that people are actually using it and loving it.

I wish you will also feel the same way when you build something and I hope this article helped you in monetizing your next Chrome project.
