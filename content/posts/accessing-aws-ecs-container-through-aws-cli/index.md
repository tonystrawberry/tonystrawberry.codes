---
title: "Accessing AWS ECS container through AWS CLI"
description: "A compact and practical guide to access your AWS ECS container through AWS CLI"
date: 2022-12-18
draft: false
slug: accessing-aws-ecs-container-through-aws-cli
tags:
  - AWS
  - ECS
  - Rails
---

## Accessing AWS ECS container through AWS CLI

In some of my web application projects running on ECS, I sometimes needed to debug and access the database to check its state or run some methods from the `rails console` of my Rails application.

Well, in the local environment, it is as simple as running `rails console` from the terminal, right? But when you need to access your application which is running on AWS, you have two options:

- Access the application through a bastion EC2 server that is located inside the VPC of your application and that has everything set to access the RDS database
    - That allows you to run code from any branches because you are managing the `git` repository inside that bastion server.
- Access the application in the ECS container context by accessing the `rails console` from the running tasks.
    - That allows you to access the real application and run operations from it.

In today’s report, I will teach you the second option.

### Configuring your AWS account

You should have the following information:

- your AWS account access token (generated from the IAM Management Console)
- your AWS account secret key (also (generated from the IAM Management Console)
- the region (ex: ap-northeast-1) in which your application is running

Then, configure your AWS profile using the following command.

```ruby
aws configure --profile [custom-identifier-for-your-aws-profile]
```

### List the running tasks of your application

Reference: https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ecs/list-tasks.html

Now, you need to identify the ECS cluster inside which your application is running. With the following commands, you can list the active tasks in your cluster.

```ruby
aws ecs list-tasks
  --cluster [cluster-name]
  --profile [custom-identifier-for-your-aws-profile]
```

You will get a response similar to this. You may have multiple tasks inside `taskArns` if you set your desired number of tasks greater than one.

```ruby
{
    "taskArns": [
        "arn:aws:ecs:ap-northeast-1:[account-id]:task/[cluster-name]/[task-id]",
        "arn:aws:ecs:ap-northeast-1:[account-id]:task/[cluster-name]/[task-id]"
    ]
}
```

### Access the task

Reference: [https://docs.aws.amazon.com/cli/latest/reference/ecs/execute-command.html](https://docs.aws.amazon.com/cli/latest/reference/ecs/execute-command.html)

Now, it is time to run a command inside one of the container of the task. In case of my Rails application, I have a container called `app` which is running the Rails server.

```ruby
aws ecs execute-command \
  --cluster [cluster-name] \
  --task [task-id] \
  --container app \
  --interactive \
  --command "rails console" \
  --profile [custom-identifier-for-your-aws-profile]

```

After this, you should be able to access remotely the `rails console` inside the container and run queries against the database.
