import * as React from 'react';
import { withState } from '../src/lib/withState';
import Step from './Step';
// import { all } from '../src/ChainableComponent';

export const WithStateDemo =
  withState({ initial: 0 }).chain(outer =>
    withState({ initial: 16 }).map(inner =>
      ({ inner, outer })
    )
  )
    .ap(({ inner, outer }) => (
      <div>
        <div>Outer: {outer.value} <button onClick={() => outer.update(outer.value + 1)}>+</button></div>
        <div>Inner: {inner.value} <button onClick={() => inner.update(inner.value + 1)}>+</button></div>
      </div>
    ));

export default () => (
  <Step title="withState Demo">
    <pre className='code-sample'>
      {`import { withState } from 'chainable-components';

withState({initial: 0}).chain(outer => 
  withState({initial: 16}).map(inner => 
    ({inner, outer})
  )
)
.ap(({inner, outer}) => (
  <div>
    <div>Outer: {outer.value} <button onClick={() => outer.update(outer.value + 1)}>+</button></div>
    <div>Inner: {inner.value} <button onClick={() => inner.update(inner.value + 1)}>+</button></div>
  </div>
))`}
    </pre>
    {WithStateDemo}
  </Step>
);
  //   all([
  //     withState({initial: 'yo'}),
  //     withState({initial: 16})
  //   ])
  // .ap(([outer, inner]) => (
  //   <div>
  //     <div>Outer: {outer.value} <button onClick={() => outer.update(outer.value + 1)}></button></div>
  //     <div>Inner: {inner.value} <button onClick={() => inner.update(inner.value + 1)}></button></div>
  //   </div>
  // ));

