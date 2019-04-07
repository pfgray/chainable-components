import * as React from 'react';
import { withState } from '../../src/lib/withState';
import { ChainableComponent } from '../../src/ChainableComponent';
import Step from '../Step';

export const AllDemo =
  ChainableComponent.allT(
    withState('string value'),
    withState(1),
    withState(2),
    withState(3),
    withState(5),
    withState(8)
  )
  .render(([a, b, c, d, e, f]) => (
    <div>
      {/* a.value is inferred as a string */}
      <div>a: {a.value} <button onClick={() => a.update(a.value + 1)}>+</button></div>
      
      {/* b.value through f.value is inferred as a number */}
      <div>b: {b.value} <button onClick={() => b.update(b.value + 1)}>+</button></div>
      <div>c: {c.value} <button onClick={() => c.update(c.value + 1)}>+</button></div>
      <div>d: {d.value} <button onClick={() => d.update(d.value + 1)}>+</button></div>
      <div>e: {e.value} <button onClick={() => e.update(e.value + 1)}>+</button></div>
      <div>f: {f.value} <button onClick={() => f.update(f.value + 1)}>+</button></div>
    </div>
  ));

export default () => (
  <Step title="all Demo">
    <pre className='code-sample'>
      {`import { withState, ChainableComponent } from 'chainable-components';

ChainableComponent.all([
  withState({initial: 'string value'}),
  withState({initial: 1}),
  withState({initial: 2}),
  withState({initial: 3}),
  withState({initial: 5}),
  withState({initial: 8})
])
.render(([a, b, c, d, e, f]) => (
  <div>
    {/* a.value is inferred as a string */}
    <div>a: {a.value} <button onClick={() => a.update(a.value + 1)}>+</button></div>
    
    {/* b.value through f.value is inferred as a number */}
    <div>b: {b.value} <button onClick={() => b.update(b.value + 1)}>+</button></div>
    <div>c: {c.value} <button onClick={() => c.update(c.value + 1)}>+</button></div>
    <div>d: {d.value} <button onClick={() => d.update(d.value + 1)}>+</button></div>
    <div>e: {e.value} <button onClick={() => e.update(e.value + 1)}>+</button></div>
    <div>f: {f.value} <button onClick={() => f.update(f.value + 1)}>+</button></div>
  </div>
));`}
    </pre>
    {AllDemo}
  </Step>
);
