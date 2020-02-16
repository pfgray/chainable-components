import { ChainableComponent } from './../ChainableComponent';
import * as React from 'react';
import { Do } from 'fp-ts-contrib/lib/Do';
import { withState } from '../lib/withState';
import { chainableComponent } from './../lib/fpts';
import { testing } from './TestWrapper';
import { fork } from '../ChainableComponent';

function display(n: number): ChainableComponent<unknown> {
  console.log('Checking:', n);
  return n > 3 ? fork(() => React.createElement('div', null, ['large'])) : ChainableComponent.of(n) as any
}

test('adds 1 + 2 to equal 3', () => {
  const underTest =
    Do(chainableComponent)
      .bind('outer', withState(0))
      .doL(({outer}) => display(outer.value))
      .done();

  return testing(underTest)
    .act(p => {
      p.outer.update(4)
      // p.outer.update(6)
    })
    .act((p) => {
      console.log('running second update')
      p.outer.update(1)
    })
    .testRenders(function() {
      console.log('done.')
      // console.log('##########################WUT')
      // console.log('Got:', renders.length, 'renders')

      // renders.forEach((r, i) => {
      //   console.log(`hmm ${i}:`, r[0], typeof r[1])
      // })
    })

  // console.log("wut", document)
  // return new Promise((res) => {
  //   setTimeout(() => {
  //     console.log("hrm", document)
  //     res(4)
  //   }, 12000)
  // })

});
