import * as React from 'react';
import { ReactNode } from 'react';
import * as TestRenderer from 'react-test-renderer';
import { ReactTestRenderer, ReactTestRendererJSON } from 'react-test-renderer';
import { withState } from '../lib/withState';
import { ChainableComponent } from '../ChainableComponent';
import { array } from 'fp-ts/lib/Array'
import { Option, none, some } from 'fp-ts/lib/Option'
import { resolve } from 'path';


export type Render<T> = [ReactTestRendererJSON | null, Option<T>];

type Act<T> = {_type: 'act', impl: (t:T) => Promise<void>}
type Effect<T> = {_type: 'effect', impl: (t:T) => Promise<void>}

type TestBuilder<T> = {
  effect(effect: (t: T) => void): TestBuilder<T>;
  asyncEffect(effect: (t: T) => Promise<void>): TestBuilder<T>;
  act(effect: (t: T) => void): TestBuilder<T>;
  asyncAct(effect: (t: T) => Promise<void>): TestBuilder<T>;
  wait(timeout: number): TestBuilder<T>;
  testRenders(f: (...renders: Render<T>[]) => void): Promise<void>;
  test(f: (...contexts: T[]) => void): Promise<void>;
};


declare const foo: object





export function testing<T>(chainable: ChainableComponent<T>): TestBuilder<T> {
  const effects: (Act<T> | Effect<T>)[] = [];
  const renders: Render<T>[] = [];

  function run(f: (t: Render<T>[]) => void): Promise<void> {

    let nextEffect: () => Promise<boolean> = null as any
    let instance = null as any;
    TestRenderer.act(() => {
      instance = TestRenderer.create(chainable.render(values => {

        console.log('rendering the result of the chainable component')
        addContext(values);
        addElement(instance);
        const [next] = effects.splice(0, 1);

        const done = effects.length === 0;

        nextEffect = next
          ? () => {
              return next._type === "act" ? (
                // return (TestRenderer.act as any)(() => {
                //   return next(values)
                // }).then(() => done)

                // we need this unless <> is merged, then we can remove with the above^
                new Promise((res, rej) => {
                  return (TestRenderer.act as any)(() => {
                    return next.impl(values)
                  }).then(() => {
                    console.log('Resolving')
                    res(done)
                  }, (err: any) => {
                    console.log('Rejecting: ', err)
                    rej(err)
                  })
                })
              ) : (next.impl(values).then(() => done))
            }
          : () => Promise.resolve(true);
        return null;
      }));
    })

    let tempContext: Option<T> = none;
    function addContext(context: T) {
      tempContext = some(context);
    }
    function addElement(r?: ReactTestRenderer) {
      // console.log("Adding Element");
      if(r) {
        renders.push([r.toJSON(), tempContext]);
      } else {
        renders.push([null, tempContext]);
      }
      tempContext = none;
    }

    function exhaustRenders(f: (t: Render<T>[]) => void): Promise<void> {
      const wut = nextEffect();
      return wut.then(done => {
        if(done) {
          f(renders)
          return undefined;
        } else {
          return exhaustRenders(f)
        }
      })
    };
    // const instance = underTest.getInstance() as any as TestWrapperComponent<T>
    return exhaustRenders(f);
  }
  return {
    effect: function(e) {
      effects.push({
        _type: 'effect',
        impl: t => Promise.resolve(e(t))
      });
      return this;
    },
    asyncEffect: function(e) {
      effects.push({
        _type: 'effect',
        impl: e
      });
      return this;
    },
    act: function(e) {
      effects.push({
        _type: 'act',
        impl: t => Promise.resolve(e(t))
      });
      return this;
    },
    asyncAct: function(e) {
      effects.push({
        _type: 'act',
        impl: e
      });
      return this;
    },
    wait: function(timeout: number): TestBuilder<T> {
      effects.push({
        _type: "effect",
        impl: () => new Promise(res => {
          setTimeout(() => res(), timeout);
        })
      })
      return this;
    },
    testRenders: f => {
      return run(renders => f.apply(null, renders));
    },
    test: f => {
      return run(renders => {
        f.apply(array.chain(renders, ([, context]) => context.fold([], c => [c])));
      })
    }
  };
};
