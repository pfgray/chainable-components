import * as React from 'react';
import {
  ChainableComponent,
  fork
} from '../../src/ChainableComponent';
import Step from '../Step';
import { withState } from '../../src';
import { WithStateContext } from '../../src/lib/withState';

export const ForkDemo = ChainableComponent.DoRender(
  withState(5),
  count => {
    if (count.value > 8) {
      return fork<WithStateContext<number>>(() => (
        <div>You've used up all your clicks!</div>
      ));
    } else {
      return ChainableComponent.of(count);
    }
  },
  count => (
    <div>
      <button onClick={() => count.update(count.value + 1)}>+</button>
      {count.value}
    </div>
  )
);

export default () => (
  <Step title="Fork Demo">
    <pre className="code-sample">
      {`ChainableComponent.DoRender(
  withState(5),
  count => {
    if (count.value > 8) {
      return fork<WithStateContext<number>>(() => (
        <div>You've used up all your clicks!</div>
      ));
    } else {
      return ChainableComponent.of(count);
    }
  },
  count => (
    <div>
      <button onClick={() => count.update(count.value + 1)}>+</button>
      {count.value}
    </div>
  )
);`}
    </pre>
    {ForkDemo}
  </Step>
);
