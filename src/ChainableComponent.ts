import { createFactory } from 'react';

export type RenderPropsProps<P, A> = P & {
  children: (a: A) => JSX.Element
};

export type RenderPropsComponent<P, A> = React.ComponentClass<RenderPropsProps<P, A>>;

type Applied<A> = (f:(a:A) => JSX.Element) => JSX.Element;

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
export function buildChainable<P extends object, A>(Inner: RenderPropsComponent<P, A>): (p:P) => ChainableComponent<A> {
  //return a => new ChainableComponentWrapper(a, inner);
  return p => ({
    ap(f: (a: A) => JSX.Element): JSX.Element {
      const apply = createFactory<RenderPropsProps<P, A>>(Inner);
      return apply({
        ...(p as any), // todo: we have any until https://github.com/Microsoft/TypeScript/pull/13288 is merged
        children: f
      });
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
