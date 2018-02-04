import * as React from 'react';

export type RenderPropsType<A, B> = A & {
  children: (b: B) => JSX.Element
}

export type Inner<A, B> = (a:A, F: React.ComponentType<B>) => React.SFC<any>

export function toChainable<A, B>(inner: Inner<A, B>): (a:A) => ChainableComponent<B> {
  return a => ({
    ap(f: React.ComponentType<B>): React.SFC<{}> {
      return inner(a, f);
    },
    apply(f: (b: B) => React.ReactNode): React.ComponentType<any> { // React.ReactNode): React.SFC<{}> {
      const g: any = f
      return inner(a, (b: B) => g(b));
    },
    map<C>(f: (b: B) => C): ChainableComponent<C>{
      const inner2: Inner<A, C> = (a2, G) => {
        const composed = (b:B) => <G {...f(b)} />
        return inner(a2, composed);
      }
      return toChainable(inner2)(a);
    },
    chain<C>(f: (b: B) => ChainableComponent<C>): ChainableComponent<C>{
      const inner2: Inner<A, C> = (a2, G) => {
        const composed = (b: B) => {
          const Applied = f(b).ap(G);
          return <Applied />
        };
        return inner(a2, composed)
      }
      return toChainable(inner2)(a);
    }
  })
}

export type ChainableComponent<A> = {
  ap(f: React.ComponentType<A>): React.SFC<{}>; // it shouldn't be any, it should be void
  apply(f: (a: A) => React.ReactNode): React.ComponentType<any>; // it shouldn't be any, it should be void
  map<B>(f: (a: A) => B): ChainableComponent<B>;
  chain<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B>;
}
