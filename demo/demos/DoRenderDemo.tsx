import * as React from 'react';
import { withState } from '../../src/lib/withState';
import { ChainableComponent } from '../../src/ChainableComponent';
import Step from '../Step';

export const DoRenderDemo =
  ChainableComponent.DoRender(
    withState(5),
    () => withState(5),
    () => withState('foo'),
    (foo, inner, outer) =>
      <div>
        {foo.value}
        <div>outer: {outer.value}</div>
        <button onClick={() => outer.update(outer.value + 1)}>+</button>

        <div>inner: {inner.value}</div>
        <button onClick={() => inner.update(inner.value + 1)}>+</button>
      </div>
  )

export default () => (
  <Step title="DoRender Demo">
    <pre className='code-sample'>
      {`import { withState, ChainableComponent } from 'chainable-components';

ChainableComponent.DoRender(
    withState(5),
    () => withState(5),
    () => withState('foo'),
    (foo, inner, outer) =>
      <div>
        {foo.value}
        <div>outer: {outer.value}</div>
        <button onClick={() => outer.update(outer.value + 1)}>+</button>

        <div>inner: {inner.value}</div>
        <button onClick={() => inner.update(inner.value + 1)}>+</button>
      </div>
  )`}
    </pre>
    {DoRenderDemo}
  </Step>
);
