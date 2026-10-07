import * as React from 'react';
import Step from '../Step';
import { fromHigherOrderComponent, InferableHOC, ChainableComponent } from '../../src/ChainableComponent';

// Simple custom HOC that adds props
const withProps = <P extends object>(props: P): InferableHOC<P> =>
  <C extends P>(Component: React.ComponentType<C>) =>
    (outerProps: Omit<C, keyof P>) =>
      <Component {...(outerProps as any)} {...props} />;

// Simple custom HOC that adds state
const withState = <T,>(
  stateName: string,
  setterName: string,
  initialValue: T
): InferableHOC<Record<string, any>> =>
  <P extends Record<string, any>>(Component: React.ComponentType<P>) =>
    (props: Omit<P, typeof stateName | typeof setterName>) => {
      const [state, setState] = React.useState(initialValue);
      const injectedProps = {
        ...props,
        [stateName]: state,
        [setterName]: setState
      } as P;
      return <Component {...injectedProps} />;
    };

const randomProps = withProps({
  foo: 'bar'
});

const count = withState('count', 'setCount', 2);
type CountProps = {
  count: number;
  setCount: (n: number) => number;
};

const foo = fromHigherOrderComponent<{foo: string}>(randomProps)();
const outerCount = fromHigherOrderComponent<CountProps>(count)();
const innerCount = fromHigherOrderComponent<CountProps>(count)();

export const FromHoCDemo = ChainableComponent.all([
  foo,
  outerCount,
  innerCount
]).render(([foo, outer, inner]) => (
  <div>
    {foo.foo}
    <div>
      Outer: {outer.count}{' '}
      <button onClick={() => outer.setCount(outer.count + 1)}>+</button>
    </div>
    <div>
      Inner: {inner.count}{' '}
      <button onClick={() => inner.setCount(inner.count + 1)}>+</button>
    </div>
  </div>
));

export default () => (
  <Step title="FromHoCDemo Demo">
    <pre className="code-sample">
      {`// Custom HOCs (could also use recompose, redux, etc.)
const withProps = (props) => Component => outerProps =>
  <Component {...outerProps} {...props} />;

const withState = (name, setter, initial) => Component => props => {
  const [state, setState] = React.useState(initial);
  return <Component {...props} [name]: state, [setter]: setState} />;
};

const randomProps = withProps({ foo: 'bar' });
const count = withState('count', 'setCount', 2);

const foo = fromHigherOrderComponent(randomProps)();
const outerCount = fromHigherOrderComponent(count)();
const innerCount = fromHigherOrderComponent(count)();

ChainableComponent.all([foo, outerCount, innerCount])
  .render(([foo, outer, inner]) => (
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
