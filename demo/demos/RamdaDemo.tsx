import * as React from 'react';
import { withState, WithStateContext } from '../../src/lib/withState';
import Step from '../Step';
import * as R from 'ramda';

const composeK: any = R.composeK;

//Ramda's typings only work with arrays currently, so casting as any...
const counters = composeK(
  (outer: WithStateContext<number>) => {
    return withState(2 + outer.value).map(inner => ({
      outer, inner
    }));
  },
  withState
)(5);

export const RamdaDemo =
  counters
  .render(({outer, inner}: any) => (
    <div>
      <div>outer: {outer.value}</div>
      <button onClick={() => outer.update(outer.value + 1)}>+</button>

      <div>inner: {inner.value}</div>
      <button onClick={() => inner.update(inner.value + 1)}>+</button>
    </div>
  ));

export default () => (
  <Step title="Ramda Demo">
    <pre className='code-sample'>
{`const counters = composeK(
  (outer: WithStateContext<number>) => {
    return withState(2 + outer.value).map(inner => ({
      outer, inner
    }))
  },
  withState
)(5);

counters
  .render(({outer, inner}: any) => (
    <div>
      <div>outer: {outer.value}</div>
      <button onClick={() => outer.update(outer.value + 1)}>+</button>

      <div>inner: {inner.value}</div>
      <button onClick={() => inner.update(inner.value + 1)}>+</button>
    </div>
  ));`}
    </pre>
    {RamdaDemo}
  </Step>
);
