---
title: "I learned a new way to authenticate: HMAC 🔐"
description: "This week, I also learned a new way of developing authentication for an API: HMAC authentication."
date: 2022-12-03
draft: false
slug: authentication-with-hmac
tags:
  - HMAC
  - Authentication
---

# Authentication with HMAC 🔐

This week, I also learned a new way of developing authentication for an API: HMAC authentication (https://www.geeksforgeeks.org/what-is-hmachash-based-message-authentication-code/).
One of the requirements of the project was to allow authentication for an organization as a whole instead of doing the authentication per user.

- Cryptographic hash function used is `SHA256`.
- When the organization is created, generate an `secret shared key` (symmetric key) unique to that organization that will be used for generating a signature client-side.
- When calling an authenticated API endpoint, the user will have to provide the following headers:
  - `X-Signature` which the HMAC signature generated from the following string.
    ```ruby
      # Example: POST:/api/v1/infos:2022-11-01T12:00:00:1:{"parameter":"value"}
      "#{request.method}:#{request.fullpath}:#{@header_datetime}:#{@header_organization_user_id}:#{body}"
    ```
  - `X-Organization-User-ID` (example: 1)
  - `X-Datetime` (example: 2022-11-01T12:00:00)
- As a result, the `X-Signature` will be different for every request.
- The server, upon receing the authenticated request, generates its own HMAC signature and compares it with the sent HMAC signature from the client. If they are both the same, the request is considered legitimate.
