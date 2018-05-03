# Chainable Components
_Make your render props composable!_

From:
```jsx
const withTwoState = props => {
  return (
    <WithState initial={0}>
      {outer => (
        <WithState initial={outer + 5}>
          {inner => (
            props.children({inner, outer})
          )}
        </WithState>
      )
    </WithState>
  );
}
```

To:
```jsx
const withTwoState = 
  withState({initial: 0}).chain(outer => 
    withState({initial: outer + 5}).map(inner => 
      ({inner, outer})
    )
  )
```

### Converting a Render Prop component to a Chainable:
Convert your existing Render Prop component to a chainable component with the `buildChainable` function:

```
const withPromise = buildChainable(WithPromise)
```

`withState`  is now a function that takes a configuration object (which would have been props to the render prop function), and returns a chainable component:
```
const userChainable: ChainableComponent<User> = withPromise({get: () => fetchUser(1234)});
```

The `WithPromise`’ s render prop takes the result of the promise and applies it to the child function. In this case, `fetchUser` returns a promise of `User`, so  `count` ’s type is `ChainableComponent<User>` (said, “chainable component of user”) .

### Rendering a Chainable Component:
Since the ”wrapped” value’s type is  `User`, the `ap` method takes a function which takes a user, and returns the rendered output:
```
userChainable.ap(user => (
  <div>{user.id} - {user.username}</div>
));
```

All together, this looks like:
```
withPromise({get: () => fetchUser(1234)})
  .ap(user => (
	  <div>{user.id} - {user.username}</div>
  ))
```
Which is actually quite similar to the render prop version:
```
<WithPromise get={() => fetchUser(1234)}>
  {user => (
    <div>{user.id} - {user.username}</div>
  )}
</WithPromise>
```
Why would we go through the trouble of converting a Render Prop to a Chainable Component? The answer is the additional methods a chainable component has, `map` and `chain`.

### Mapping values inside a Chainable Component
Suppose we didn’t care about any information about the user at all, only their role, because we wanted to display something to the user, but only if they were an admin. We could map the user value inside our hoc into a boolean, and then use the boolean when we actually apply the chainable component. For instance,
```
withPromise({get: () => fetchUser(1234)})
  .map(user => user.role === 'Administrator')
  .ap(isAdmin => (
	  isAdmin ? (<div>secret plans...</div>) :
      <div>Access denied!</div>
  ))
```

### Composing Chainable Components
Chainable components can be composed, or “chained” easily using the chain method. `chain`  is very similar to `map`, except that the function parameter returns another chainable component. This allows you to combine chainables, and use the output of one as input to the other.

Let’s suppose that you wanted to fetch the user, and when the user loaded, “fade in” the ui so that it looks smooth. You could add the fade in styles to the `WithPromise` render prop, but then it would be applied all the time. A better approach, would be to build a separate chainable component, and then compose the two together with `chain`:

Assuming we have a Render Prop component named `WithFetch`, we could do:

```
const fadeIn = buildChainable(FadeIn);

withPromise({get: () => fetchUser(1234)})
  .chain(user =>
    fadeIn().map(() => user))
  .ap(user => (
	  <div>{user.id} - {user.username}</div>
  ))
```

With the addition of `map` and `chain`, our Render Prop components can now enjoy the composablity of HOC’s, but still keep the declarative nature of Render Props!
