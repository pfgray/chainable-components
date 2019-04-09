import * as React from 'react';
import Step from '../Step';
import { withContext } from '../../src/lib/withContext';
import { withProvider } from '../../src/lib/withProvider';

const { Consumer, Provider } = React.createContext("Default Value");

const DisplayContext =
  withContext(Consumer).render(
    context => {
      return (
        <span>
          Current context is:
          <pre>{JSON.stringify(context, null, 2)}</pre>
        </span>
      );
    }
  );

const withText = withProvider(Provider)

const ContextDemo = () => (
  <div>
    {DisplayContext}
    <Provider value="Overriden value">
      {DisplayContext}
    </Provider>
    {withText("From withProvider").render(() => DisplayContext)}
  </div>
);

export default () => (
  <Step title="React 16 Context Demo">
    <pre className='code-sample'>
      {`const DisplayContext =
  withContext(Consumer).render(
    context => {
      return (
        <span>
          Current context is:
          <pre>{JSON.stringify(context, null, 2)}</pre>
        </span>
      );
    }
  );

const withText = withProvider(Provider)

const ContextDemo = () => (
  <div>
    {DisplayContext}
    <Provider value="Overriden value">
      {DisplayContext}
    </Provider>
    {withText("From withProvider").render(() => DisplayContext)}
  </div>
);`}
    </pre>
    <ContextDemo />
  </Step>
);
