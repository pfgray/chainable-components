import * as React from 'react';
import { createFactory } from 'react';
import {withFetch} from '../src/withFetch';
import { withState as ws, compose } from 'recompose'; 
import { withState, WithState, inner } from '../src/withState';

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
  withState(0).chain(outer =>
    withState(16)
      .map(inner => ({inner, outer}))
  ).ap(({inner, outer}) => (
    <div>
      <div>Outer: {outer.data} <button onClick={() => outer.update(outer.data + 1)}></button></div>
      <div>Inner: {inner.data} <button onClick={() => inner.update(inner.data + 1)}></button></div>
    </div>
  ));

export const Test4 =
  compose(
    ws('outer', 'setOuter', 0),
    ws('inner', 'setInner', 0),
  )(props => (
    <div>
      <div>Outer: {props.outer} <button onClick={() => props.setOuter(props.outer + 1)}></button></div>
      <div>Inner: {props.inner} <button onClick={() => props.setInner(props.inner + 1)}></button></div>
    </div>
  ))

export const Test5 =
  compose(
    ws('outer', 'setOuter', 0),
    ws('inner', 'setInner', props => props.outer),
  )(props => (
    <div>
      <div>Outer: {props.outer} <button onClick={() => props.setOuter(props.outer + 1)}></button></div>
      <div>Inner: {props.inner} <button onClick={() => props.setInner(props.inner + 1)}></button></div>
    </div>
  ));

export const Test6 = inner(0, outer => {
  const Hmm2 = inner(5, inner => (
      <div>
        <div>Outer: {outer.data} <button onClick={() => outer.update(outer.data + 1)}></button></div>
        <div>Inner: {inner.data} <button onClick={() => inner.update(inner.data + 1)}></button></div>
      </div>
    ));
  return <Hmm2 />
});

export const Test7 =
  ws('outer', 'setOuter', 3)(outer => {
    const Hmm2 = ws('inner', 'setInner', 3)(inner =>
      <div>
        <div>Outer: {outer.outer} <button onClick={() => outer.setOuter(outer.outer + 1)}></button></div>
        <div>Inner: {inner.inner} <button onClick={() => inner.setInner(inner.inner + 1)}></button></div>
      </div>
    );

    return <Hmm2 />;
  });

export const Test8 =
  ws('outer', 'setOuter', 3)(outer => {
    return ws('inner', 'setInner', 3)(inner =>
      <Hmm2 inner={inner} outer={outer} />
    );
  });

class Hmm2 extends React.Component<any, any> {
  constructor(props: any){
    super(props);
  }
  render() {
    return (
      <div>
        <div>Outer: {this.props.outer.outer} <button onClick={() => this.props.outer.setOuter(this.props.outer.outer + 1)}></button></div>
        <div>Inner: {this.props.inner.inner} <button onClick={() => this.props.inner.setInner(this.props.inner.inner + 1)}></button></div>
      </div>
    );
  }
}


const outerF = ws('outer', 'setOuter', 0)
const innerF = ws('inner', 'setInner', 3)

export const Test9 = outerF(oProps => {
  return createFactory(innerF(iProps =>
    <Hmm2 inner={iProps} outer={oProps} />
  ))(oProps);
});



