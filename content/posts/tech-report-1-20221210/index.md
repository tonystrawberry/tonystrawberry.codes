---
title: "Tech report #2 🔖 My first AWS examination and a summary of the React State Management"
description:
date: 2022-12-10
draft: false
slug: tech-report-1-20221210
tags:
  - Report
  - AWS
  - Certification
  - React
  - Mobile development
---

# I passed the AWS Certified Cloud Practitioner examination 🎉

One objective I have set this year was to pass the AWS Certified Cloud Practitioner examination and I managed to pass it just in time! 😤

I already had 2 years of experience of using AWS services (especially those that are often used for building web applications such as EC2, Security groups, ECS, Fargate, RDS, S3) so it was not a very difficult examination for me.

To be honest, I could have skipped this one to pass the Solutions Architect Associate but I prefered to go slowly but surely 🐢 and gain confidence in my abilities. I won't say I didn't learn anything new though. I learned about many other services like AWS Organizations for centralizing the billing of multiple AWS accounts, AWS Snow family for helping migrate data from on-premises data center to the cloud and many other. You are not required to have very deep knowledge of the AWS services but you will need to learn about a lot of them.

I studied approximately 1 month using the acloudguru.com website and I can say it covered everything I needed to know in order to pass the examination without issues. They also have several mock examinations in order for you to test your knowledge. I will definitely use it again for my next examination (AWS Solutions Architect Associate) in March 2023 💪

I also chose to take the examination remotely from my place instead of going to the test center. It was a very smooth experience and I would recommend it to anyone to take it from home as long as yoou have a stable internet connection.

# What I learned about React State Management

I am now working on a personal mobile application that I planned to release next year on both the Apple App Store and Play Store (you will know more about it in the upcoming weeks).

And for the front-end mobile application, I chose to take advantage of React Native. Even though I already some experience developing in React from 3 years ago, I thought I needed to catch up with the latest changes (everything is changing so fast in the tech world...)

I came across a extremely YouTube video detailing what can be used to manage the state of a React application: https://www.youtube.com/watch?v=-bEzt5ISACA&t=6106s&ab_channel=freeCodeCamp.org

## React Hooks API: useState, useReducer, useMemo, useCallback, useEffect and useRef

### useState: the most simple to manage the state

`useState` is the most simple way to track state in a functional component.
You can use it for declaring one state variable (of any type) so it is ideal if the state is simple.

This is a simple example for displaying a Pokemon name that changes everytime the text of the input is changing.

```javascript
const Pokemon = () => {
  const [pokemon, setPokemon] = useState( '' ); // Returns the value (pokemon) and the setter function (setPokemon)

  return (
    <div>
      <input
         type="text"
         value={pokemon}
         placeholder="Enter a Pokemon name"
         onChange={e => setPokemon(e.target.value)}
       />
      <p>
        <strong>{pokemon}</strong>
      </p>
    </div>
  );
};
```

### useReducer: the solution for managing a complex state

`useState` may be ideal if your state is simple and if the different pieces of your state are independent from each other.
But what if you have complex state logic?

According to the <a href="https://reactjs.org/docs/hooks-reference.html#:~:text=useReducer%20is%20usually%20preferable%20to,dispatch%20down%20instead%20of%20callbacks." target="_blank">React documentation</a>,
> useReducer is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one. useReducer also lets you optimize performance for components that trigger deep updates because you can pass dispatch down instead of callbacks.

```javascript
import { useReducer } from "react";
import ReactDOM from "react-dom/client";

const initialTodos = [
  {
    id: 1,
    title: "Todo 1",
    complete: false,
  },
  {
    id: 2,
    title: "Todo 2",
    complete: false,
  },
];

// Custom logic is implemented here
const reducer = (state, action) => {
  switch (action.type) {
    case "COMPLETE":
      return state.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, complete: !todo.complete };
        } else {
          return todo;
        }
      });
    default:
      return state;
  }
};

function Todos() {
  const [todos, dispatch] = useReducer(reducer, initialTodos); // Returns the current value of the state (todos) and a dispatch method for used for changing the state based on some custom logic

  const handleComplete = (todo) => {
    dispatch({ type: "COMPLETE", id: todo.id });
  };

  return (
    <>
      {todos.map((todo) => (
        <div key={todo.id}>
          <label>
            <input
              type="checkbox"
              checked={todo.complete}
              onChange={() => handleComplete(todo)}
            />
            {todo.title}
          </label>
        </div>
      ))}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Todos />);
```

### useMemo: for improving performance by memoizing calculated values

`useMemo` will be used to "cache" computed values that are not forcibly changing at every render of the component.
This will help improve performance by skipping expensive computation when it is not needed.

Here is an example of a very poor performing application: `expensiveCalculation` is run everytime the component is rerendered on state changes even when the changes are not affecting the `expensiveCalculation` result (for example `todos`).

```javascript
import { useState } from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]);
  const calculation = expensiveCalculation(count);

  const increment = () => {
    setCount((c) => c + 1);
  };
  const addTodo = () => {
    setTodos((t) => [...t, "New Todo"]);
  };

  return (
    <div>
      <div>
        <h2>My Todos</h2>
        {todos.map((todo, index) => {
          return <p key={index}>{todo}</p>;
        })}
        <button onClick={addTodo}>Add Todo</button>
      </div>
      <hr />
      <div>
        Count: {count}
        <button onClick={increment}>+</button>
        <h2>Expensive Calculation</h2>
        {calculation}
      </div>
    </div>
  );
};

const expensiveCalculation = (num) => {
  console.log("Calculating...");
  for (let i = 0; i < 1000000000; i++) {
    num += 1;
  }
  return num;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

To fix that, we can use `useMemo` to memoize the `expensiveCalculation` function.
As a result, the `expensiveCalculation` will only run when its dependencies have changed. In our case, that means it will run only when the `count` is changed and won't run when `todos` is.

```javascript
const calculation = useMemo(() => expensiveCalculation(count), [count]);
```

### useCallback: useMemo for functions

`useCallback` is another callback for helping the performance of your React application to be better by caching functions.
In the below example, when `ProductPage` is rerendered, `ShippingForm` is also rerendered.

By using `memo` on the `ShippingForm`, we are instructing it to rerender only when its props changes.

The thing is that when `ProductPage` is rerendered, it is recreating the `handleSubmit` function even when it does not need to change. One case when it stays the same is when `theme` is changed because it has no influence whatsoever on the `handleSubmit` meethod.

`memo` is working by comparing references and not values so since the `handleSubmit` is changing at every render, `memo` won't work at all.

```javascript
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

```javascript
function ProductPage({ productId, referrer, theme }) {
  // Every time the theme changes, this will be a different function...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* ... so ShippingForm's props will never be the same, and it will re-render every time */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

That is where `useCallback` comes handy. Just like `useMemo`, it receives a list of dependencies (`[productId, referrer]` in the example below) and will only recreate the function when either `productId` or `referrer` changes.

```javascript
function ProductPage({ productId, referrer, theme }) {
  // Tell React to cache your function between re-renders...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...so as long as these dependencies don't change...

  return (
    <div className={theme}>
      {/* ...ShippingForm will receive the same props and can skip re-rendering */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

### useEffect: performing side effect in functional components

By using `useEffect`, you are telling React to perform some side effects when the component rerenders.
In the example below, the code inside `useEffect` is run everytime the component rerenders.

```javascript
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

But we can control when to run `useEffect` by passing dependencies to it.

- Runs on every render by not passing any dependencies
```javascript
useEffect(() => {
  // runs on every render
});
```

- Runs only on the first render by passing an empty array
```javascript
useEffect(() => {
  // runs only on the first render
}, []);
```

- Runs on the first render and any time any dependency value changes
```javascript
useEffect(() => {
  // And any time any dependency value changes
}, [value]);
```

Cleanup function called when the component is unmounted can also be specified by returning it.
```javascript
useEffect(() => {
    let timer = setTimeout(() => {
    setCount((count) => count + 1);
  }, 1000);

  return () => clearTimeout(timer)
  }, []);

```

### useRef: store a mutable value that does not cause rerender or store a reference to a DOM element

`useRef` hook allows us to persist values between renders.
One common usage to keep track of a mutable value that should not trigger rerenders. If we use `useState` for managing that value, that would cause rerender everytime it is changed.

In the below example, when `inputValue` is changed, a rerender will be trigerred but `count` will keep its previous value and won't be reset to 0.

```
function App() {
  const [inputValue, setInputValue] = useState("");
  const count = useRef(0);

  useEffect(() => {
    count.current = count.current + 1;
  });

  return (
    <>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <h1>Render Count: {count.current}</h1>
    </>
  );
}

```

Another use case of `useRef` is to access a DOM element and make DOM manipulation like in the example below.

```
function App() {
  const inputElement = useRef();

  const focusInput = () => {
    inputElement.current.focus();
  };

  return (
    <>
      <input type="text" ref={inputElement} />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}
```
