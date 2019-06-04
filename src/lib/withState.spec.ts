import { withState } from '../lib/withState';
import { testing } from '../test/testBuilder';

describe('withState', () => {
  test('stores values and updates', () => {

    testing(withState(0))
      .effect(count => {
        count.update(1)
      })
      .effect(count => {
        count.update(4)
      })
      .test(function(render1, render2, render3) {
        // two updates, so three renders (one initial, then two after each pdate)
        expect(render1.value).toBe(0);
        expect(render2.value).toBe(1);
        expect(render3.value).toBe(4);
      });
  });
});
