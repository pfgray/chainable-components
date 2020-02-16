import { Do } from 'fp-ts-contrib/lib/Do';
import { withHandler } from '../lib/withHandler';
import { withState } from '../lib/withState';
import { chainableComponent } from '../lib/fpts';
import { testing } from './testBuilder';

test('adds 1 + 2 to equal 3', () => {
  const underTest =
    Do(chainableComponent)
      .bind('outer', withState(0))
      .bind('inner', withState(0))
      .bindL('handler', ({ inner }) => {
        return withHandler(() => {
          console.log('inner count is:', inner.value)
        }, [inner.value]) // handler depends on inner.value
      })
      .done();

  return testing(underTest)
    .effect(p => p.outer.update(1)) // handler doesn't depend on outer, so the ref shouldn't change
    .effect(p => p.inner.update(1)) // handler does depend on inner, so handler's reference should change
    .test(function(render1, render2, render3) {
      // handler's reference doesn't change from render1 to render2
      expect(render1.handler).toBe(render2.handler)
      // but it does change from render2 to render3
      expect(render2.handler).not.toBe(render3.handler)
    })

});
