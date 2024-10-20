---
title: I Got Lost in Git
description: I got lost in Git and I am trying to find my way back.
date: 2024-10-04
draft: false
slug: i-got-lost-in-git
tags:
  - Git
---

In my current project, I got into a (very) minor issue with Git. This post will be like a short diary entry.

We are using a feature branch workflow with feature branches created from the `develop` branch. We also have a `master` branch that is used for production releases.

```
(feature branches) -> develop -> master
```

We were squashing commits when merging feature branches into the `develop` branch. No problem so far. It makes the commit history cleaner.
But we were also squashing commits when merging the `develop` branch into the `master` branch. This is where the problem started.

When squashing commits, Git creates a new commit with a new commit hash. This is not a problem when merging feature branches into the `develop` branch because the feature branch is deleted after the merge.
But when merging the `develop` branch into the `master` branch, the `develop` branch is not deleted. This means that the `develop` branch has a different commit history than the `master` branch.

Even though the code is the same, when trying to merge the `develop` branch into the `master` branch, Git sees the different commit histories and tries to merge all the commits from the `develop` branch into the `master` branch again.

Well, the solution we adopted was:
- stop squashing commits when merging the `develop` branch into the `master` branch
- reset the `master` branch to the `develop` branch state
