import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import { ChainableComponent } from '../ChainableComponent';
import { withState } from '../lib/withState';
import { TestWrapperComponent } from './TestWrapperComponent';

// type Concat<T, Arr extends T[]> = [T, {K in keyof Arr}: Arr[K] ]

// type Foo = Prepend<number, [string, number]>  // produce [number, string, number]

// type ArgumentTypes<T extends (...a: any) => any> =
//     T extends (...a: infer A) => any ? A : never;
// type Prepend<T, Arr extends any[]> =
//     ArgumentTypes<(t: T, ...r: Arr) => void>

type TestBuilder<T> = {
  effect(effect: (t: T) => void): TestBuilder<T>;
  test(f: (...renders: T[]) => void): void;
};

export function testing<T>(chainable: ChainableComponent<T>): TestBuilder<T> {
  const effects: ((t:T) => void)[] = []
  return {
    effect: function(e) {
      effects.push(e)
      return this;
    },
    test: f => {
      const underTest = TestRenderer.create(
        React.createElement(TestWrapperComponent, {
          chainable,
          effects
        } as any)
      );
      
      const instance = underTest.getInstance() as any as TestWrapperComponent<T>

      while(!instance.nextEffect()) { }
      f.apply(null, instance.renders);
    }
  };
};
