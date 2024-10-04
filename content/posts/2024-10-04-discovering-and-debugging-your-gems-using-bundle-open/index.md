---
title: Discovering and debugging your gems using `bundle open`
description: In this post, I will show you how to discover and debug your gems using the `bundle open` command.
date: 2024-10-04
draft: false
slug: discovering-and-debugging-your-gems-using-bundle-open
tags:
  - Ruby on Rails
  - Gems
  - Development
  - Debugging
---

Hi there! 👋

This article will be a short one. I am recently learning more about Ruby on Rails and I discovered a useful command on GoRails.
It is the `bundle open` command. This command allows you to open the source code of a gem in your editor.

This is very useful when you want to understand how a gem works or when you want to debug a gem.
It is necessary to specify the editor with the `EDITOR` environment variable. For example, if you use Visual Studio Code, you can run the following command:

```bash
cd {your_ruby_project}
EDITOR=code bundle open {gem_name}
```

This will open the source code of the gem in Visual Studio Code.
You can directly modify the source code of the gem and see the changes in your application. I often write `puts` or `binding.irb` statements in the gem source code to understand how it works.

I hope you found this tip useful! 😊
```
