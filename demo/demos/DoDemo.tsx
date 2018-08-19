import * as React from 'react';
import { withState } from '../../src/lib/withState';
import { ChainableComponent } from '../../src/ChainableComponent';
import Step from '../Step';

export const DoDemo =
  ChainableComponent.Do(
    withState(5),
    (outer) => withState(2 + outer.value),
    () => withState('foo'),
    (foo, inner, outer) => ({outer, inner, foo})
  )
  .render(({outer, inner, foo}) => (
    <div>
      {foo.value}
      <div>outer: {outer.value}</div>
      <button onClick={() => outer.update(outer.value + 1)}>+</button>

      <div>inner: {inner.value}</div>
      <button onClick={() => inner.update(inner.value + 1)}>+</button>
    </div>
  ));

export default () => (
  <Step title="Do Demo">
    <pre className='code-sample'>
{`import { withState, ChainableComponent } from 'chainable-components';

ChainableComponent.Do(
  withState(5),
  (outer) => withState(2 + outer.value),
  (outer, inner) => ({outer, inner})
)
.render(({outer, inner}) => (
  <div>
    <div>outer: {outer.value}</div>
    <button onClick={() => outer.update(outer.value + 1)}>+</button>

    <div>inner: {inner.value}</div>
    <button onClick={() => inner.update(inner.value + 1)}>+</button>
  </div>
));`}
    </pre>
    {DoDemo}
  </Step>
);
