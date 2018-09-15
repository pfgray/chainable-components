# Chainable Components
_A composable API for reusable React code._

Chain together reusable React components:
```jsx
withState(0).chain(outer => 
  withState(outer.value + 5).map(inner =>
    ({inner, outer})
  )
).render(({inner, outer}) => (
  <div>
    <div>Outer: {outer.value} <button onClick={() => outer.update(outer.value + 1)}>+</button></div>
    <div>Inner: {inner.value} <button onClick={() => inner.update(inner.value + 1)}>+</button></div>
  </div>
));
```

Transform HOCs and Render Props to chainables and back:

![Chainable pipeline](docsSrc/chainable-pipeline.png?raw=true "Chainable pipeline")

:point_down: Here's a blog post that introduces the API.  
[https://paulgray.net/chainable-components](https://paulgray.net/chainable-components)

Example:
```jsx
import { Route } from 'react-router';
import { connect } from 'react-redux';

const withConnect = fromHigherOrderComponent(connect(mapState, mapDispatch));
const withRoute = fromRenderProp(Route);

// withConnect and withRoute are now chainable!
const withConnectAndRoute = 
  withConnect.chain(storeProps => 
    withRoute.map(route => ({
      store: storeProps,
      path: route.history.location.pathname
    })));

// then render it!
withConnectAndRoute.render(({store, path}) => (
  <div>
    current path is: {path}
    store contains: {store.users}
  </div>
));

// or convert it back render prop:
const ConnectAndRoute = withConnectAndRoute.toRenderProp();
<ConnectAndRoute>
  {({store, path}) => (
    <div>
      current path is: {path}
      store contains: {store.users}
    </div>
  )}
<ConnectAndRoute>

// or convert it back to a HOC:
const connectAndRouteHoc = withConnectAndRoute.toHigherOrderComponent(p => p);

connectAndRouteHoc(({store, path}) => (
  <div>
    current path is: {path}
    store contains: {store.users}
  </div>
));
```

