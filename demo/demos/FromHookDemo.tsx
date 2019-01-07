import * as React from 'react';
import Step from '../Step';
import { fromHook, ChainableComponent } from '../../src/ChainableComponent';

const withState = <T extends any>(
  t: T | (() => T)
): ChainableComponent<[T, (t: T) => void]> => {
  return fromHook<T | (() => T), [T, (t: T) => void]>(React.useState)(t);
};

export const FromHookDemo = ChainableComponent.all([
  withState(0),
  withState(3),
  withState(4)
]).render(([top, middle, bottom]) => (
  <div>
    <Counter counter={top} label={'top'} />
    <Counter counter={middle} label={'middle'} />
    <Counter counter={bottom} label={'bottom'} />
  </div>
));

type CounterProps = { counter: [number, (n: number) => void]; label: String };
const Counter: React.SFC<CounterProps> = ({
  counter: [count, setCount],
  label
}) => (
  <div>
    <h4>{label}</h4>
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>+</button>{' '}
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  </div>
);

export default () => (
  <Step title="FromHook Demo">
    <pre className="code-sample" />
    {FromHookDemo}
  </Step>
);
