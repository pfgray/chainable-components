import * as React from 'react';
import { fromRenderProp } from '../src/ChainableComponent';
// how to create a context hoc?
import Step from './Step';
const { Consumer, Provider } = React.createContext("Default Value");

const withContext = fromRenderProp(Consumer);

const DisplayContext =
  withContext({ children: () => 'hmm, this should be necessary' }).ap(
    context => {
      return (
        <span>
          Current context is:
          <pre>{JSON.stringify(context, null, 2)}</pre>
        </span>
      );
    }
  );

const ContextDemo = () => (
  <div>
    {DisplayContext}
    <Provider value="Overriden value">
      {DisplayContext}
    </Provider>
  </div>
);

export default () => (
  <Step title="React 16 Context Demo">
    <pre className='code-sample'>
      {`import { fromRenderProp } from 'chainable-components';
const { Consumer, Provider } = React.createContext("Default Value");
const withStringContext = fromRenderProp(Consumer);

const DisplayContext =
withStringContext({ children: a => '' }).ap(
  context => {
    return (
      <span>
        Current context is:
        <pre>{JSON.stringify(context, null, 2)}</pre>
      </span>
    );
  }

const ContextDemo = () => (
<div>
  {DisplayContext}
  <Provider value="Overriden value">
    {DisplayContext}
  </Provider>
</div>
);`}
    </pre>
    <ContextDemo />
  </Step>
);
