import * as React from 'react';

export type RenderPropsType<A, B> = A & {
  children: (b: B) => JSX.Element
}

export type Inner<P, B> = (p:P, F: React.ComponentType<B>) => React.ComponentType<any>;


// P is the configuration parameter to build a chainable component
export function toChainable<P, A>(inner: Inner<P, A>): (p:P) => ChainableComponent<A> {
  //return a => new ChainableComponentWrapper(a, inner);
  return p => ({
    ap(f: React.ComponentType<A>): React.ComponentType<any> {
      return inner(p, f);
    },
    map<B>(f: (a: A) => B): ChainableComponent<B>{
      const inner2: Inner<P, B> = (p2, G) => {
        const composed = (a: A) => <G {...f(a)} />
        return inner(p2, composed);
      }
      return toChainable(inner2)(p);
    },
    chain<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B> {
      const inner2: Inner<P, B> = (p2, G) => {
        const composed = (a: A) => {
          const Applied = f(a).ap(G);
          return <Applied />;
        };
        return inner(p2, composed);
      }
      return toChainable(inner2)(p);
    }
  });
}

export interface ChainableComponent<A> {
  ap(f: React.ComponentType<A>): React.ComponentType<any>; // it shouldn't be any, it should be void
  map<B>(f: (a: A) => B): ChainableComponent<B>;
  chain<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B>;
}
