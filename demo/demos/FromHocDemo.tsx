import * as React from 'react';
import { fromHigherOrderComponent } from '../../src/ChainableComponent';
import { withState as withStateHoc, InferableComponentEnhancerWithProps } from 'recompose';
import Step from '../Step';

type OuterProps = {outer: number, setOuter: (n: number) => number};
const outerHoc: InferableComponentEnhancerWithProps<OuterProps, any> = withStateHoc('outer', 'setOuter', 12);
const outerChainable = fromHigherOrderComponent<OuterProps>(outerHoc);

type InnerProps = {inner: number, setInner: (n: number) => number};
const innerHoc: InferableComponentEnhancerWithProps<InnerProps, any> = withStateHoc('inner', 'setInner', 8);
const innerChainable = fromHigherOrderComponent<InnerProps>(innerHoc);

export const HocDemo =
  outerChainable.chain(outer =>
    innerChainable.map(inner =>
      ({ inner, outer })
    )
  ).render(({ inner, outer }) => {
    return (
      <div>
        <div>Outer: {outer.outer} <button onClick={() => outer.setOuter(outer.outer + 1)}>+</button></div>
        <div>Inner: {inner.inner} <button onClick={() => inner.setInner(inner.inner + 1)}>+</button></div>
      </div>
    );
  });

export default () => (
  <Step title="HoC Demo">
    <pre className='code-sample'>
      {``}
    </pre>
    {HocDemo}
  </Step>
);






