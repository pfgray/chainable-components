
# Chainable Components
Chainable Components is a library for writing reusable components in react. They provide an interface on top of render prop components, which allows then to be combined, transformed and composed easily.

## Introduction
Chainable Components contain values (and functionality around those values) that can be rendered into `ReactNode`s when given a handler function.

The simplest example is constructing a chainable component from a static value:

````js
import { ChainableComponent } from ''; 
const withFive = ChainableComponent.of('five');
````

The constant `withFive` is now a chainable component containing the value `"five"` and it's type is said to be "a chainable component of string," or, `ChainableComponent<string>`. If we want to render this chainable component, we need to supply a function of type: `(s: string) => ReactNode`, and pass it off to the `render` method:

````js
<div>
  {withFive.render(str => (
    <span>{str}</span>
  )}
</div>
````

The render method takes the value inside the chainable component and passess it to this function, rendering the result. This example would produce the output:

```html
<div>
  <span>five</span>
</div>
```

## Transforming
Sometimes it's useful to modify the value inside a `ChainableComponent`. The `map` method allows you to do this given a transformer function. Instead of mutating the value inside, `map` returns a _new_ chainable component which holds the transformed value. Since the type of value inside `withFive` is `string`, we need to specify a function a function that takes a string and returns a new value:

```js
const withFiveLength = withFive.map(str => str.length);
```

Since we provided a function that takes a `string` and returns a `number`, the new chainable created is a `ChainableComponent<number>` (said, "chainable component of number"), and the value inside is the number '4' (since the word "five" is four characters long).

## Functionality
An abstraction over static values isn't very useful. Luckily, chainable components can also wrap effects around the React lifecycle. The `withState` chainable component is one example. 

### withState
`withState` is a function that takes an initial value, `A` (which can be any type), and returns a chainable component of `WithStateContext<A>`. `WithStateContext` provides the current value `A`, and an update function `setValue`, which takes a new `A`, and updates the wrapped value. Here's an example of how it's used:

````jsx
withState({initial: 14})
  .render(state => {
    <div>
      Current count is: {state.value}
      <button onClick={() => state.update(state.value + 1)}>+</button>
    </div>
  });
````

`withState` wraps the code needed to maintain state inside of a React component, leaving you to only define the view & how the state gets updated.

### withPromise
A common pattern is a component that fetches a value when it's mounted in order to display it. `withPromise` is a chainable component that abstracts this logic. It takes a promise, fetches it on `componentDidMount`, and provides a value of whether it's been resolved or not.

````jsx
withPromise({get: () => fetchCurrentUser()})
  .render(userRequest => (
    <div>
      {userRequest.loaded ? (
        `Welcome, ${userRequest.value.username}`
      ) : (
        "loading..."
      )}
    </div>
  ));
````

# Chainables & Render Props

Render props and chainable components are closely related. They have equivalent functionality, and they can even look similar in their usage sometimes:

````jsx
import { WithState, withState } from"chainable-components";

<WithState initial={"five"}>
  {state => ...}
</WithState>

withState({initial: "five"})
  .render(state => ...)
````

The main difference is that chainable components provide a few extra features in terms of composability, much like how promises can provide additional functionality for async callbacks. Further, in the same way that async callbacks can be converted to promises, a render prop component can be converted into a chainable component. 

For an example of this, let's look to React's Context API. This API uses a render prop to implicitly pass values down the tree of components. We can convert that render prop to a chainable component using the `fromRenderProp` method:

````jsx
import * as React from 'react';
import { fromRenderProp } from '../../src/ChainableComponent';

const { Consumer, Provider } = React.createContext("Default Value");
const withContextString = fromRenderProp(Consumer);
````

And use it like:

````jsx
<Provider value="Overriden value">
  {
    withContext({})
      .render(context => (
        <span>{context}</span>
      ))
  }
</Provider>
````

which would produce:

````html
<span>Overriden value</span>
````

# Creating Chainable Components

The easiest way to create a chainable component is, in fact, to create a render prop and then convert it to a chainable component. Make sure to build your render prop in a standard way that is understood by this library. You must specify the children prop as a function that takes exactly one argument, and all configuration must be defined through other props. This is important so that  `fromRenderProp` knows exactly how to convert your render prop into a chainable component.

Once you convert your render prop, you get back a function whose parameters are the same shape as the props used to configure the render prop (minus the children prop, of course). The function returns a `ChainableComponent<A>`, where `A` is the type of the single parameter that's passed to the children prop function.

Typescript is smart enough to be able to figure out the shape of the configuration parameter, and the shape of the children parameter automatically.

## Combination
Chainable Components are a powerful tool when used alone, but their power is amplified when combined with other chainable components. The static method `all` combines a list of chainable components into one:

````jsx
const with2States = ChainableComponent.all([
  withState({initial: 'string value'}),
  withState({initial: 1}),
]);
````

````jsx
with2States.render(([a, b]) => (
  <div>
    <div>a: {a.value} <button onClick={() => a.update(a.value + 1)}>+</button></div>
    <div>b: {b.value} <button onClick={() => b.update(b.value + 1)}>+</button></div>
  </div>
));
````

## Chaining
When combining chainable components, it's sometimes useful to use the output of one as input to the other. Let's suppose we're using the `withPromise` chainable to load a user's profile when a page loads. We also have a `withLoading` chainable component that takes the output of `withPromise`, and if the promise is loading, will display a nice "loading" icon, otherwise, it will provide us with the loaded value.

We can use the `chain` method to combine these chainable components, and use the output of `withPromise` as input to the `withLoading` chainable.

```jsx
withPromise({get: () => fetchUser()})
  .chain(userReq => withLoading(userReq))
  .render(user => (
    <div>
      Welcome, {user.username}!
    </div>
  ))
```

`withPromise` abstracts the state management of fetching a resource, `withLoading` abstracts the rendering of a 'loading' icon, and `chain` lets us compose the two!
 