---
title: I built the best LGTM generator 🎉
description: Let's celebrate your colleagues' hard work with a LGTM GIF image generator powered by Giphy images!
date: 2023-12-01
draft: false
slug: i-built-the-best-lgtm-generator
tags:
  - LGTM
  - NextJS
  - AWS
  - Terraform
  - API Gateway
  - Serverless
  - CloudFront
  - S3
  - DynamoDB
  - Lambda
  - Giphy
---

Hello! 👋

Recently, I have been appointed as one of the tech leaders of my project 🎉
I am very happy to be able to help my colleagues and learn from them. However, I felt I can approve my PRs in a more fun way that would break the monotony of the daily work 🚀

So that's why I came up with the idea of building a LGTM image generator powered by Giphy images in order to approve the PRs of my colleagues and reward their hard work with a funny GIF image 💪
Hopefully, this will make them smile and feel appreciated for their work 😁

Here is the website: https://lgtmarvelous.vercel.app/

![Overview of LGTM](./lgtm.png)

I made the code open-source so feel free to use it. I also wrote the instructions on the repositories' description.
AWS skills may be needed to run the backend repository.

## Frontend

https://github.com/tonystrawberry/lgtm-generator-next

- **NextJS** for the FE framework
- **TailwindCSS** for CSS styling
- **shadcn/ui** for pre-made UI components
- Deployment is done with **Vercel** 🚀

## Backend

https://github.com/tonystrawberry/lgtm-generator-ruby/

- **AWS API Gateway** for publishing the Backend API (backed by the below Lambda)
- **AWS Lambda** with Ruby Runtime for getting images data from DynamoDB
- **AWS DynamoDB** for storing metadata of images
- **AWS S3** for storing my post-processed images
- **AWS Cloudfront** for the CDN fronting my images
- **AWS Eventbridge** for scheduling a background job every 5 minutes (it will run the below Lambda function)
- Another **AWS Lambda** that will run every 5 minutes for getting the images from Giphy API, process it by adding the `LGTM characters` on the original image and save it to S3 and DynamoDB
- **Terraform** for managing all the above AWS infrastructure
- Deployment is done via **Github Actions** 🚀

I hope this can inspire others 💪

![LGTM](https://d30lzxra6n3hkq.cloudfront.net/lgtm/a5llhdWKMOIfneMCpB.gif)
