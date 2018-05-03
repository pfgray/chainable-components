# Chainable Components

Make your render props composable!

_Note: This library is in it's early stages and will likely change many times before becoming stable_

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



## License
[MIT](./LICENSE)
