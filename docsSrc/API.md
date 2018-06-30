# API

## Creating a chainable:

###`of`
```typescript
of<A>(a: A): ChainableComponent<A>
```

Promotes a single value to a chainable

usage:
```typescript
import { ChainableComponent } from 'chainable-components';

const withStr: ChainableComponent<String> = ChainableComponent.of("My string");
```

###`fromRender`
```typescript
fromRender<A>(render: (f: (a: A) => ReactNode) => ReactNode): ChainableComponent<A>
```

Creates a chainable from a render function.

usage: 
````typescript
import { ChainableComponent, fromRender } from 'chainable-components';

const withFive: ChainableComponent<number> =
  fromRender((ap: (a: number) => React.ReactNode) => (
    function () {
      return <div>Applied: {ap(5)}</div>
    }
  ));
````

###`fromRenderProp`
Creates a function that builds a chainable component from a render prop component.

```typescript
fromRenderProp<P extends object, A>(Inner: RenderPropsComponent<P, A>): (p: P) => ChainableComponent<A>
```

usage:
````typescript
import { Route, RouteComponentProps } from 'react-router';
import { fromRenderProp, ChainableComponent } from 'chainable-components';

const withRoute: ChainableComponent<RouteComponentProps<any>> = 
  fromRenderProp(Route);
````

## Chainable API:

###`render`
Renders the chainable component into a `ReactNode`, which can be embedded inside the render of another component.
````typescript
render(f: (a: A) => ReactNode): ReactNode;
````

Usage:
````typescript
const withUser: ChainableComponent<User> = ...

const UserProfile = () =>
  withUser.render(user => (
    <div>
      {user.username}
      <img src={user.image} />
    </div>
  ));

...
<UserProfile />
````

###`map`
Converts the value inside this chainable, returning a new chainable.
````typescript
map<B>(f: (a: A) => B): ChainableComponent<B>;
````

Usage:
````typescript
const withMessage: ChainableComponent<String> = ChainableComponent.of("My message");

const withMessageLength: ChainableComponent<number> = withMessage.map(m => m.length);
````

###`ap`
Uses a lifted function to convert the value inside a chainable, returning a new chainable.
````typescript
ap<B>(c: ChainableComponent<(a: A) => B>): ChainableComponent<B>;
````

Usage:
````typescript
const withMessage: ChainableComponent<String> = ChainableComponent.of("My message");

const withMessageLength: ChainableComponent<number> = 
  withMessage.ap(ChainableComponent.of(m => m.length));
````

###`chain`
Composes two chainable components, returning the chainable returned by `f`.
````typescript
chain<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B>;
````
Usage:
````typescript

const withUser: CHainableComponent<User> = 
  withPromise({get: () => fetchUser()})
    .chain(userReq => withLoading(userReq));

const UserProfile = () =>
  withUser.render(user => (
    <div>
      Welcome, {user.username}!
    </div>
  ));

<UserProfile />
````

##Utils:

###`all`
Converts a list of chainable components into a chainable component of list.
````typescript
all<T>(values: (CC<T>)[]): CC<T[]>;
````

usage:
````js
ChainableComponent.all([
  withState({initial: 'string value'}),
  withState({initial: 1})
]).render(([stringState, numberState]) => (
  ...
))
````

