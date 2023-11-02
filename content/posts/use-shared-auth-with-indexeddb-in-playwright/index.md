---
title: How to use Shared Auth in Playwright with IndexedDB
description: A compact and practical guide to use Shared Auth in Playwright with IndexedDB for Firebase Authentication
date: 2023-11-01
draft: false
slug: how-to-use-shared-auth-in-playwright-with-indexeddb
tags:
  - Playwright
  - IndexedDB
  - E2E Testing
  - Firebase Authentication
---

Hello!

For my Playwright E2E tests, I had to add an authentication step for my tests requiring the user to login to the application.

In the first version of my tests, all the tests had the same code for the authentication step which was not DRY. According to Playwright documentation, it seemed we can make use of storageState to share the state of the browser context between tests (https://playwright.dev/docs/auth#basic-shared-account-in-all-tests).

The problem is that I use Firebase authentication and the authentication state is stored in the browser's IndexedDB. Unfortunately, Playwright does not support IndexedDB with storageState (only cookies and localStorage) 🥲

## Solution 🎉

So I had to find a way to make it work. I managed to make use of shared authentication (Firebase) for my test cases using the following steps:

- Create a `auth.setup.ts` that will be run before all the tests.
  - It will login the user (in my case I login via email/password combination provided in the URL).
  - After login, Firebase saves the data in IndexedDB so I copy all the data to local storage and finally call `page.context().storageState` to save the authentication data in localStorage into `playwright/.auth/user.json`.

```typescript
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Perform authentication steps
  // Start from the index page with the e2eToken query parameter
  // That will automatically log in the user
  await page.goto(`/?email=e2e@matomeishi.com&password=${process.env.E2E_FIREBASE_USER_PASSWORD}`);

  // Wait until the page redirects to the cards page and stores the authentication data in the browser
  await page.waitForURL('/cards');

  // Copy the data in indexedDB to the local storage
  await page.evaluate(() => {
    // Open the IndexedDB database
    const indexedDB = window.indexedDB;
    const request = indexedDB.open('firebaseLocalStorageDb');

    request.onsuccess = function (event: any) {
      const db = event.target.result;

      // Open a transaction to access the firebaseLocalStorage object store
      const transaction = db.transaction(['firebaseLocalStorage'], 'readonly');
      const objectStore = transaction.objectStore('firebaseLocalStorage');

      // Get all keys and values from the object store
      const getAllKeysRequest = objectStore.getAllKeys();
      const getAllValuesRequest = objectStore.getAll();

      getAllKeysRequest.onsuccess = function (event: any) {
        const keys = event.target.result;

        getAllValuesRequest.onsuccess = function (event: any) {
          const values = event.target.result;

          // Copy keys and values to localStorage
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = values[i];
            localStorage.setItem(key, JSON.stringify(value));
          }
        }
      }
    }

    request.onerror = function (event: any) {
      console.error('Error opening IndexedDB database:', event.target.error);
    }
  });

  await page.context().storageState({ path: authFile });
});
```

- In my `playwright.config.ts`,  I add `setup` as a dependency inside `projects`.
```typescript

const config: PlaywrightTestConfig = {
  ...

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    }
  ],
}
```

- I then create a utility function that will get the contents of `playwright/.auth/user.json` and copy it into IndexedDB again so that Firebase can authenticate the user in my tests.

```typescript

import { Page } from "@playwright/test";

export const authenticate = async (page: Page) => {
  // Start from the index page
  await page.goto(`/`);

  // Get the authentication data from the `playwright/.auth/user.json` file (using readFileSync)
  const auth = JSON.parse(require('fs').readFileSync('playwright/.auth/user.json', 'utf8'));

  // Set the authentication data in the indexedDB of the page to authenticate the user
  await page.evaluate(auth => {
    // Open the IndexedDB database
    const indexedDB = window.indexedDB;
    const request = indexedDB.open('firebaseLocalStorageDb');

    request.onsuccess = function (event: any) {
      const db = event.target.result;

      // Start a transaction to access the object store (firebaseLocalStorage)
      const transaction = db.transaction(['firebaseLocalStorage'], 'readwrite');
      const objectStore = transaction.objectStore('firebaseLocalStorage', { keyPath: 'fbase_key' });

      // Loop through the localStorage data inside the `playwright/.auth/user.json` and add it to the object store
      const localStorage = auth.origins[0].localStorage;

      for (const element of localStorage) {
        const value = element.value;

        objectStore.put(JSON.parse(value));
      }
    }
  }, auth)
}
```

-  Finally, I call the `authenticate()` function in the `beforeEach` of my tests.
```typescript

import { authenticate } from "./utils/authenticate";

test.beforeEach(async ({ page }) => {
  await authenticate(page);
});
```

It works well for me here: https://github.com/tonystrawberry/matomeishi-next.jp
If you have any improvements suggestions, I am all ears (just started playing around with Playwright two days ago so my code may be weird or unnecessary complicated)!
I also wrote a comment on the GitHub issue related to this problem: https://github.com/microsoft/playwright/issues/11164
