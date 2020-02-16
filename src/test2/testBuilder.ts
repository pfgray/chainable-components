import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import { ChainableComponent } from '../ChainableComponent';
import { TestWrapperComponent, Render } from './TestWrapperComponent';
import { array } from 'fp-ts/lib/Array'
import { Option } from 'fp-ts/lib/Option'

type TestBuilder<T> = {
  effect(effect: (t: T) => void): TestBuilder<T>;
  asyncEffect(effect: (t: T) => Promise<void>): TestBuilder<T>;
  wait(timeout: number): TestBuilder<T>;
  testRenders(f: (...renders: Render<T>[]) => void): Promise<void>;
  test(f: (...contexts: T[]) => void): Promise<void>;
};

export function testing<T>(chainable: ChainableComponent<T>): TestBuilder<T> {
  const effects: ((t:T) => Promise<void>)[] = [];
  function run(f: (t: Render<T>[]) => void): void {
    const underTest = TestRenderer.create(
      React.createElement(TestWrapperComponent, {
        chainable,
        effects
      } as any)
    );
    
    const instance = underTest.getInstance() as any as TestWrapperComponent<T>
    
    exhaustRenders(instance, f)
  }
  function exhaustRenders(t: TestWrapperComponent<T>, f: (t: [React.ReactNode, Option<T>][]) => void) {
    if(t.nextEffect()) {
      f(t.renders);
    } else {
      exhaustRenders(t, f);
    }
  }
  return {
    effect: function(e) {
      effects.push(t => Promise.resolve(e(t)));
      return this;
    },
    asyncEffect: function(e) {
      effects.push(e);
      return this;
    },
    wait: function(timeout: number): TestBuilder<T> {
      effects.push(() => new Promise(res => {
        setTimeout(() => res(), timeout)
      }))
      return this;
    },
    testRenders: f => {
      return run(renders => f.apply(null, renders))
    },
    test: f => {
      return run(renders => {
        f.apply(array.chain(renders, ([, context]) => context.fold([], c => [c])))
      })
    }
  };
};
