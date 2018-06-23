import * as React from 'react';
import { withState } from '../../src/lib/withState';
import Step from '../Step';

export const WithStateDemo =
  withState({ initial: 0 }).chain(outer =>
    withState({ initial: 16 }).map(inner =>
      ({ inner, outer })
    )
  ).render(({ inner, outer }) => (
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
.render(({inner, outer}) => (
  <div>
    <div>Outer: {outer.value} <button onClick={() => outer.update(outer.value + 1)}>+</button></div>
    <div>Inner: {inner.value} <button onClick={() => inner.update(inner.value + 1)}>+</button></div>
  </div>
))`}
    </pre>
    {WithStateDemo}
  </Step>
);

