import * as React from 'react';
import { withState } from '../../src/lib/withState';
import { all, fromAp } from '../../src/ChainableComponent';
import Step from '../Step';

export const WithStateDemo =
  fromAp((ap: (a: number) => React.ReactNode) => (
    function() {
      return <div>Applied: {ap(5)}</div>
    }
  ))
  .ap(a => (
    <div>wait, wuuuut: {a}</div>
  ));

export default () => (
  <Step title="FromAp Demo">
    <pre className='code-sample'>
      {`import { withState, all } from 'chainable-components';`}
    </pre>
    {WithStateDemo}
  </Step>
);
  

