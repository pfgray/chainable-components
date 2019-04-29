import * as React from 'react';
import { withState } from '../../src/lib/withState';
import { ChainableComponent } from '../../src/ChainableComponent';
import Step from '../Step';
import { DoBuilder } from '../../src';
import { withHandler } from '../../src/lib/withHandler';

export const WithHandlersDemo =
  DoBuilder
    .bind('b', withState(0))
    .bind('a', withState(0))
    .bindL('handler', ({a, b}) => {
      console.log('handler', a.value, b.value)
      return withHandler(() => alert(`A's count is : ${a.value}`), [b.value])
    })
    .done()
    .render(({a, b, handler}) => (
      <div>
        <div>a: {a.value} <button onClick={() => a.update(a.value + 1)}>+</button></div>
        <div>b: {b.value} <button onClick={() => b.update(b.value + 1)}>+</button></div>
        <button onClick={handler}>alert</button>
      </div>
    ))

export default () => (
  <Step title="WithHandlersDemo Demo">
    <pre className='code-sample'>
      {``}
    </pre>
    {WithHandlersDemo}
  </Step>
);
