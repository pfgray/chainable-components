import * as React from 'react';;
import { Route, Router } from 'react-router';
import { fromRenderProp } from '../src/ChainableComponent';
import Step from './Step';
import createBrowserHistory from 'history/createBrowserHistory';

const customHistory = createBrowserHistory();

const withRoute = fromRenderProp(Route);

// Route doesn't have any required props, so we can just pass the empty object here
const ReactRouterDemoInner: React.SFC = () => (
  <Step title="React Router Demo">
    <pre className='code-sample'>
      {`import { Route } from 'react-router';
const withRoute = fromRenderProp(Route);

withRoute({}).ap(
  route => {
    return (
      <span>
        Current route is:
        <pre>{route.history.location.pathname}</pre> {/* route's type is automatically inferred. */}
      </span>
    );
  }
)`}
    </pre>
    <Router history={customHistory}>
      {withRoute({}).ap(
        route => {
          return (
            <span>
              Current route is:
              <pre>{route.history.location.pathname}</pre> {/* route's type is automatically inferred. */}
            </span>
          );
        }
      )}
    </Router>
  </Step>
);

export default ReactRouterDemoInner;
