import * as React from 'react';
import { ChainableComponent } from '../../src/ChainableComponent';
import Step from '../Step';
import { withState } from '../../src';
import { pure } from '../../src/lib/pure';

export const PureDemo =
  ChainableComponent.DoRender(
    withState(1),
    () => withState(1),
    (a, b) => pure(() => a.value + b.value < 13),
    (_, a, b) => 
      <div>
        <div>Outer: {a.value} <button onClick={() => a.update(a.value + 1)}>+</button><button onClick={() => a.update(a.value - 1)}>-</button></div>
        <div>Inner: {b.value} <button onClick={() => b.update(b.value + 1)}>+</button><button onClick={() => b.update(b.value - 1)}>-</button></div>
      </div>
  );

export default () => (
  <Step title="Pure Demo">
    <pre className='code-sample'>
      {`import { withState, all } from 'chainable-components';`}
    </pre>
    {PureDemo}
  </Step>
);


