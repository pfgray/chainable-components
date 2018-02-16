import * as React from 'react';

export type RenderPropsProps<P, A> = P & {
  children: (a: A) => JSX.Element
};

export type RenderPropsComponent<P, A> = React.ComponentType<RenderPropsProps<P, A>>;

export type Applied<A> = (f:(a:A) => JSX.Element) => JSX.Element;

function toChainable<A>(f: Applied<A>): ChainableComponent<A> {
  return ({
    ap(f2: (a: A) => JSX.Element): JSX.Element {
      return f(f2);
    },
    map<B>(f: (a: A) => B): ChainableComponent<B> {
      const Mapped: Applied<B> = g => this.ap(a => g(f(a)));
      return toChainable(Mapped);
    },
    chain<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B> {
      const FlatMapped: Applied<B> = g => this.ap(a => f(a).ap(g));
      return toChainable(FlatMapped);
    }
  });
}

// P is the configuration parameter to build a chainable component
export function buildChainable<P, A>(Inner: RenderPropsComponent<P, A>): (p:P) => ChainableComponent<A> {
  //return a => new ChainableComponentWrapper(a, inner);
  return p => ({
    ap(f: (a: A) => JSX.Element): JSX.Element {
      return <Inner {...p}>{f}</Inner>;
    },
    map<B>(f: (a: A) => B): ChainableComponent<B> {
      const Mapped: Applied<B> = g => this.ap(a => g(f(a)));
      return toChainable(Mapped);
    },
    chain<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B> {
      const FlatMapped: Applied<B> = g => this.ap(a => f(a).ap(g));
      return toChainable(FlatMapped);
    }
  });
}

export interface ChainableComponent<A> {
  ap(f: (a: A) => JSX.Element): JSX.Element; // it shouldn't be any, it should be void
  map<B>(f: (a: A) => B): ChainableComponent<B>;
  chain<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B>;
}
