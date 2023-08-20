---
title: "My first steps in the mobile development world"
description: What I learned about React Native in 7 days
date: 2022-12-03
draft: false
slug: my-first-steps-in-the-mobile-development-world
tags:
  - React Native
  - Mobile development
---

# What I learned about React Native in 7 days 📱

Recently, I found myself interested in mobile development 📱 After spending three years doing and studying web development (both front-end and back-end as well as cloud infrastructure), I wanted to make the jump and learn something different 🧐

So I tried React Native. A framework for developing cross-platform applications for iOS and Android (as well as other platforms).

I watched this crash course of 14 hours that was available on YouTube: https://www.youtube.com/watch?v=AkEnidfZnCU
Learning by doing has been my favorite way of learning and the most efficient so far 💪

So here my few takeaways of this week 📃
- Developing on React Native is very similar to developing on React for web. There is some key differences such as the accepted tags (React Native uses `<View>`, `<Text>` and React uses standard HTML tags such as `<div>`, `<span>`).
- `Local storage` does not exist in mobile but instead there is `Async storage`.
- `React Navigation` seems to be the main library used for navigating between screens.
- `Redux Toolkit` has made using Redux so much simpler. I remember using Redux by configuring everything (actions, reducers, dependency injection) but Redux toolkit makes abstraction of all of this to allow us developers to focus on the logic
- Expo seems to be very standard for starting a React Native project.
- On these projects, I used the CSS framework `TailwindCSS` (using the package `nativewind`) for styling my application and I must say that I love it. It really makes your life easier by making you use utility classes so that you don't really need to write CSS (unless you need really custom styles).
- I also learned about the folder structure for a React Native project. These are the folders commonly created: `screens` (for storing the differents screens of the application), `components` (for reusable components), `assets`, `slices` (for Redux toolkit).

Building four mini-projects has taught me a lot and made me extremely excited about the future applications I will build in the near future 🚀

- https://github.com/tonystrawberry/playground.deliveroo
- https://github.com/tonystrawberry/playground.uber
- https://github.com/tonystrawberry/playground-tinder
