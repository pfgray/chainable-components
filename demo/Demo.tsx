import * as React from 'react';

import { withState } from '../src/withState';

export const Test3 =
  withState({initial: 0}).chain(outer => 
    withState({initial: 16}).map(inner => 
      ({inner, outer})
    )
  )
  .ap(({inner, outer}) => (
    <div>
      <div>Outer: {outer.data} <button onClick={() => outer.update(outer.data + 1)}></button></div>
      <div>Inner: {inner.data} <button onClick={() => inner.update(inner.data + 1)}></button></div>
    </div>
  ));
