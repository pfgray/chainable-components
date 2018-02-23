import { createFactory, ReactNode } from 'react';

export type ChainableComponent<A> = {
  ap(f: (a: A) => ReactNode): ReactNode;
  map<B>(f: (a: A) => B): ChainableComponent<B>;
  chain<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B>;
}

export type RenderPropsProps<P, A> = P & {
  children: (a: A) => ReactNode
};

export type RenderPropsComponent<P, A> = React.ComponentClass<RenderPropsProps<P, A>>;

type Applied<A> = (f:(a:A) => ReactNode) => ReactNode;

// P is the configuration parameter to build a chainable component
export function buildChainable<P extends object, A>(Inner: RenderPropsComponent<P, A>): (p:P) => ChainableComponent<A> {
   return p => fromAp(f => {
    const apply = createFactory<RenderPropsProps<P, A>>(Inner);
    return apply({
      ...(p as any), // todo: we have any until https://github.com/Microsoft/TypeScript/pull/13288 is merged
      children: f
    });
   });
}


function fromAp<A>(ap: (f: (a: A) => ReactNode) => ReactNode): ChainableComponent<A> {
  return {
    ap,
    map<B>(f: (a: A) => B): ChainableComponent<B> {
      const Mapped: Applied<B> = g => this.ap(a => g(f(a)));
      return fromAp(Mapped);
    },
    chain<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B> {
      const FlatMapped: Applied<B> = g => this.ap(a => f(a).ap(g));
      return fromAp(FlatMapped);
    }
  };
}

const ChainableComponent = {
  of<A>(a: A): ChainableComponent<A> {
    return fromAp(f => f(a));
  }
}