import * as React from 'react';
import Step from '../Step';
import { fromHigherOrderComponent, InferableHOC, ChainableComponent } from '../../src/ChainableComponent';
import { withState, withProps } from 'recompose';

const randomProps = withProps({
  foo: 'bar'
});

const count = withState('count', 'setCount', 2);
type CountProps = {
  count: number,
  setCount: (n: number) => number
};

// typecast necessary here since InferableHOC is not compatible 
//   with InferableComponetEnhancerWithProps from recompose (even thought they have the same shape!).
// Chainable Components could just refer to the type from recompose, but that would add a compile
//   dependency and would break for other hoc implementations.
const foo = fromHigherOrderComponent<{foo: string}>(randomProps as InferableHOC<{foo: string}>)();
const outerCount = fromHigherOrderComponent<CountProps>(count as InferableHOC<CountProps>)();
const innerCount = fromHigherOrderComponent<CountProps>(count as InferableHOC<CountProps>)();

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
