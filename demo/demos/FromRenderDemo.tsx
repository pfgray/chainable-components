import * as React from 'react';
import { fromRender } from '../../src/ChainableComponent';
import Step from '../Step';

export const FromRenderDemo =
  fromRender((render: (a: number) => React.ReactNode) => (
    function () {
      return <div>Rendered: {render(5)}</div>
    }
  ))
  .render(a => (
    <div>test: {a}</div>
  ));

export default () => (
  <Step title="FromRender Demo">
    <pre className='code-sample'>
      {`import { withState, all } from 'chainable-components';`}
    </pre>
    {FromRenderDemo}
  </Step>
);


