---
title: How I fix Universal Clipboard between my Mac and iPhone
description: How I fixed the Universal Clipboard feature on my Mac (memo to my future self)
date: 2023-09-15
draft: false
slug: how-i-fix-universal-clipboard-between-my-mac-and-iphone
tags:
  - Mac
  - iPhone
  - Tech
  - Memo
---

I was using the Universal Clipboard feature between my Mac and iPhone for a while now and it was working perfectly fine until one day, it stopped working. I tried to find a solution on the Internet but I couldn't find any. So I decided to write this article to help my future self and others who might have the same problem.

## What is Universal Clipboard?

Universal Clipboard is a feature that allows you to copy text, images, photos, and videos on one Apple device and then paste them onto another Apple device. It works with iPhone, iPad, iPod touch, and Mac.

## How to fix it?

I tried many things but the only thing that worked for me was to enable the `ClipboardSharingEnabled` flag on my Mac through the Terminal.

```bash
defaults read ~/Library/Preferences/com.apple.coreservices.useractivityd.plist ClipboardSharingEnabled
```

The above command showed me that the flag was disabled (0). So I enabled it with the following command:

```bash
defaults write ~/Library/Preferences/com.apple.coreservices.useractivityd.plist ClipboardSharingEnabled 1
```

As simple as that! 🎉
