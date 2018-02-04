import * as React from 'react';

import {withFetch} from '../src/withFetch';

import {withState, WithState} from '../src/withState';

export const Test =
  withFetch('/woot?')
    .map(user => ({...user, age: 35}))
    .map(user => ({...user, age: user.age+67}))
    .map(user => ({...user, age: user.age+67, woot: 'works??'}))
    .chain(user =>
      withFetch(user.name).chain(user =>
        withState(5).chain(outer => 
          withState(outer.data).map(inner => ({
            inner,
            outer,
            user
          }))
        )
      )
    )
    .ap(({user, inner, outer}) => (
      <div>
        {user.name}
        <div>Outer: {outer.data} <button onClick={() => outer.update(outer.data + 1)}></button></div>
        <div>Inner: {inner.data} <button onClick={() => inner.update(inner.data + 1)}></button></div>
      </div>
    ));

export const Test2 = () => (
  <WithState initial={0}>
    {(outer) => (
      <WithState initial={outer.data}>
        {inner => (
          <div>
            <div>Outer: {outer.data} <button onClick={() => outer.update(outer.data + 1)}></button></div>
            <div>Inner: {inner.data} <button onClick={() => inner.update(inner.data + 1)}></button></div>
          </div>
        )}
      </WithState>
    )}
  </WithState>
);

export const Test3 = 
  withState(0).apply(outer =>
    React.createElement(withState(outer.data)
      .apply(inner => (
        <div>
          <div>Outer: {outer.data} <button onClick={() => outer.update(outer.data + 1)}></button></div>
          <div>Inner: {inner.data} <button onClick={() => inner.update(inner.data + 1)}></button></div>
        </div>
      )), null, null)
  )
