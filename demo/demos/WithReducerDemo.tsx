import * as React from 'react';
import {
  ChainableComponent,
  fork
} from '../../src/ChainableComponent';
import Step from '../Step';
import { withState } from '../../src';
import { WithStateContext } from '../../src/lib/withState';
import { withReducer } from '../../src/lib/withReducer';

type Action = 'increment' | 'decrement';

export const WithReducerDemo =
  withReducer((s: number, a: Action) => {
    return a === 'increment' ? s + 1 : s -1;
  }, 0).render(({state, dispatch}) => (
      <div>
          <button onClick={() => dispatch('decrement')}>-</button>
          {state}
          <button onClick={() => dispatch('increment')}>+</button>
      </div>
  ))

export default () => (
  <Step title="Fork Demo">
    <pre className="code-sample">
      {`withReducer((s: number, a: Action) => {
    return a === 'increment' ? s + 1 : s -1;
  }, 0).render(({state, dispatch}) => (
      <div>
          <button onClick={() => dispatch('decrement')}>-</button>
          {state}
          <button onClick={() => dispatch('increment')}>+</button>
      </div>
  ))`}
    </pre>
    {WithReducerDemo}
  </Step>
);
