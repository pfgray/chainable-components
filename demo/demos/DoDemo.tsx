import * as React from 'react';
import { withState } from '../../src/lib/withState';
import { all, Do, ChainableComponent } from '../../src/ChainableComponent';
import Step from '../Step';

export const DoDemo = () =>
  Do(function*() {
    const a = yield withState({initial: 'string value'});
    const b = yield withState({initial: 8432});
    return [a, b];
  })
  .ap(([a, b]) => (
    <div>
      {/* a.value is inferred as a string */}
      <div>a: {a.value} <button onClick={() => a.update(a.value + 1)}>+</button></div>
      
      {/* b.value through f.value is inferred as a number */}
      <div>b: {b.value} <button onClick={() => b.update(b.value + 1)}>+</button></div>
    </div>
  ));

export default () => (
  <Step title="Do Demo">
    <pre className='code-sample'>
      {`import { withState, all } from 'chainable-components';`}
    </pre>
    <DoDemo />
  </Step>
);
  

