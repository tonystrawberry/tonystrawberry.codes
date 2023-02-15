---
title: "Tech report #7 🔖 AWS Solutions Artchitect - Review notes for my upcoming examination"
description: Just some review notes that will help me pass the AWS SAA certification
date: 2023-01-15
draft: false
slug: tech-report-7-aws-solutions-architect-review-notes-iam-s3
tags:
  - AWS
  - S3
  - IAM
  - Certification
---

I will pass my second AWS certification (Solutions Architect Associate) very soon and compiled some important notes for the S3 and IAM services.

# 1 - **Identity and Access Management (IAM)**

## Root Account

- Enable MFA
- Create group and assign appropriate permissions to that group
- Create users accounts for the administrators and add users to the admin group

## IAM Policy Documents

- Assign permissions

```jsx
{
  "Version": "2012-10-12",
  "Statement": [
		"Effect": "Allow",
		"Action": "*",
		"Resource": "*"
  ]
}
```

## Good to remember

- IAM is universal.
- Root account is the account created when you setup AWS for the first time. God mode access.
- New users has no permissions per default.
- Access key ID and secret access keys for CLI or API.
- It is a good practice to setup password rotations.
- Use IAM Federation when you want to combine your existing user account with AWS (Microsoft Active Directory).
- Identity Federation uses the SAML standard which is Active Directory.

# 2 - S3

## Good to remember

- S3 is an object-based storage for files.
- Files from 0 bytes up to 5 TB.
- Not for OS or DB storage.
- Unlimited storage.
- Universal namespace.

## S3 Object tips

- Key is the object name.
- Value is the data itself which is made up of a sequence of bytes.
- Version ID allows you to store multiple versions of the same object.
- Metadata is the data about the data you are storing (content-type, last-modified…).

## Securing your bucket with S3

- Buckets are private by default.
- Object ACLs for making individual objects public using object ACLs or setting deletion rule for a single object.
- Bucket policies to make entire buckets public using bucket policies.

## Hosting a static website

- Make the entire bucket public using bucket policies.
- Static content only.
- Automatic scaling.

## Versioning Objects

- All versions of an object are stored in S3. This includes all writes and deletions.
- Can be a great backup tool.
- Once enabled, cannot be disabled.
- Can be integrated with lifecycle rules.
- Supports MFA.

## Storage Tiers

- S3 Standard
- S3 Standard IA
- S3 One zone IA
- S3 Glacier
- S3 Glacier Deep Archive
- S3 Intelligent-Tiering

## Tips for Lifecycle Management

- Automates moving your object between the different tiers.
- Used in conjunction with versioning.
- Can be applied to current versions AND previous versions.

## S3 Object Lock and Glacier Vault Lock

- Use S3 Object Lock to store objects with write once, read many (WORM) model.
- Object Lock can be applied on individual objects or on a whole bucket.
- Governance mode and compliance mode.
- Governance mode → users cannot overwrite or delete an object version or alter its lock settings unless they have special permissions.
- Compliance mode → a protected object version can’t be overwritten or deleted by any user, including the root user.
- S3 Glacier Vault lock for deploying and enforcing compliance controls for individual S3 Glacier vaults with a vault lock policy. The policy can be locked and if locked, can no longer be changed.

## Encryption

- Transit: SSL/TLS
- Rest: Server side encryption with SSE-S3 or SSE-KMS or SSE-C
- Client-side encryption also possible. You need to encrypt the files before uploading to S3.
- Enforcing encryption by denying all PUT requests that don’t include the `x-aws-server-side-encryption` parameter in the header.

## Optimizing S3 performance

- 3500 PUT/COPY/POST/DELETE and 5500 GET/HEAD requests per second per prefix
- Spread your reads across different prefixes for better performance.
- Use multipart uploads to increase performance when uploading files over 100MB (for over 5GB, it is mandatory) to S3.
- Use S3 byte-range fetches to increase performance when downloading files to S3.

## Replication

- You can replicate objects from one bucket to another (same region or cross-region).
- Objects in an existing bucket are not replicated by default.
- Delete markers are not replicated by default (possible to turn it on optionally)
