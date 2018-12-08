import * as React from 'react';
import Step from '../Step';
import { fromHigherOrderComponent, ChainableComponent } from '../../src/ChainableComponent';
import { withState, withProps } from 'recompose';

const randomProps = withProps({
  foo: 'bar'
});

const count = withState('count', 'setCount', 2);
type CountProps = {
  count: number,
  setCount: (n: number) => number
};

const foo = fromHigherOrderComponent<{foo: string}>(randomProps as any);
const outerCount = fromHigherOrderComponent<CountProps>(count as any);
const innerCount = fromHigherOrderComponent<CountProps>(count as any);

export const FromHoCDemo =
  ChainableComponent.all([
    foo,
    outerCount,
    innerCount
  ]).render(([foo, outer, inner]) => (
    <div>
      {foo.foo}
      <div>Outer: {outer.count} <button onClick={() => outer.setCount(outer.count + 1)}>+</button></div>
      <div>Inner: {inner.count} <button onClick={() => inner.setCount(inner.count + 1)}>+</button></div>
    </div>
  ))

export default () => (
  <Step title="FromHoCDemo Demo">
    <pre className='code-sample'>
{`import { withState, withProps } from 'recompose';

const randomProps = withProps({
  foo: 'bar'
});

const count = withState('count', 'setCount', 2);
type CountProps = {
  count: number,
  setCount: (n: number) => number
};

const foo = fromHigherOrderComponent<{foo: string}>(randomProps);
const outerCount = fromHigherOrderComponent<CountProps>(count);
const innerCount = fromHigherOrderComponent<CountProps>(count);

ChainableComponent.all([
  foo,
  outerCount,
  innerCount
]).render(([foo, outer, inner]) => (
  <div>
    {foo.foo}
    <div>Outer: {outer.count} <button onClick={() => outer.setCount(outer.count + 1)}>+</button></div>
    <div>Inner: {inner.count} <button onClick={() => inner.setCount(inner.count + 1)}>+</button></div>
  </div>
))
`}
    </pre>
    {FromHoCDemo}
  </Step>
);
