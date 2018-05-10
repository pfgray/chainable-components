import * as React from 'react';

import { fromRenderProp, RenderPropsComponent } from '../src/ChainableComponent';
import { withState } from '../src/lib/withState';

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

type Config = { n: string };

const Wut: RenderPropsComponent<{}, User> = null as any;

// function hmm () {
//   return <Wut username="wut" age={3}>
//     {s => <div>s.length</div>}
//   </Wut>
// }

const wut = fromRenderProp(Wut);

type Thing<A, B> = A & {
  t: (b:B) => number
};

type User = {
  username: string,
  age: number
};

type SupplyUserProps = {
  children: (u: User) => JSX.Element
};

class SupplyUser extends React.Component<SupplyUserProps, User> {
  render() {
    return this.props.children({
      username: 'paul',
      age:29
    });
  }
}

const supplyUser = fromRenderProp(SupplyUser);

// supplyUser()
