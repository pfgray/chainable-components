import { createFactory, ReactNode } from 'react';
import { Lazy } from './lib/lazy';

// export type ComponentLike<P = {}> = React.ComponentClass<P, any> | React.StatelessComponent<P>;

/**
 * A composable wrapper around React effects.
 * 
 */
export type ChainableComponent<A> = {

  /**
   * Renders this chainable into a ReactNode, which can be embedded inside the render
   * method of another component.
   * @param f A function which is used to render the contextual value. 
   *          This method returns another ReactNode, possibly wrapped with
   *          additional functionality.
   */
  ap(f: (a: A) => ReactNode): ReactNode;

  /**
   * Converts the value inside this Chainable Component.
   * @param f A function which is used to convert this value. The result of
   *          f will replace the existing in a new Chainable Component which is returned.
   */
  map<B>(f: (a: A) => B): ChainableComponent<B>;

  /**
   * Composes or 'chains' another Chainable Component along with this one.
   * @param f A function which is provided the contextual value, and returns a chainable component
   *          The result if this function will be returned.
   */
  chain<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B>;
};

/**
 * Represents the props used by a Render Props component.
 * @type P represents the props used to configure the Render Prop component.
 * @type A represents the type of the contextual value of the Render Props component.
 */
export type RenderPropsProps<P, A> = P & {
  children: (a: A) => ReactNode
};

/**
 * Represents a Render Prop component.
 * @type P encapsulates the props used to configure this Render Prop
 * @type A represents the type of the contextual value of the Render Props component.
 */
export type RenderPropsComponent<P, A> = React.ComponentType<RenderPropsProps<P, A>>;

/**
 * Represents a function that takes a value A and returns a renderable ReactNode.
 */
type Applied<A> = (f: (a: A) => ReactNode) => ReactNode;

export function fromRenderProp<P extends object, A>(Inner: RenderPropsComponent<P, A>): (p: P) => ChainableComponent<A> {
  return p => fromAp(f => {
    const apply = createFactory<RenderPropsProps<P, A>>(Inner as any);
    return apply({
      ...(p as any), // todo: we have any until https://github.com/Microsoft/TypeScript/pull/13288 is merged
      children: f
    });
  });
}

/**
 * Converts a Render Props Component into a function that can be used to build a ChainableComponent
 * If a renderMethod name is not provided, it defaults to `children`.
 * @param Inner the render prop component
 */
export function fromNonStandardRenderProp<P extends object, A>(
  renderMethod: string,
  Inner: React.ComponentClass<P & {[render: string]: (a:A) => ReactNode}>
): (p: P) => ChainableComponent<A> {
  return p => fromAp(f => {
    const apply = createFactory<P & {[renderMethod: string]: (a:A) => ReactNode}>(Inner);
    return apply({
      ...(p as any),
      [renderMethod]: f
    });
  });
}

/**
 * Converts an apply function to a ChainableComponent
 * @param ap
 */
export function fromAp<A>(ap: (f: (a: A) => ReactNode) => ReactNode): ChainableComponent<A> {
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

type CC<A> = ChainableComponent<A>;

export const ChainableComponent = {
  /**
   * Wraps any value 'A' into a chainable component.
   * @param a the value that provides the context.
   */
  of<A>(a: A): ChainableComponent<A> {
    return fromAp(f => f(a));
  }

};

// TODO: all and Do are not specific to Chainable Components, but rather all Monads
// how can we share the implementations of these methods without HKTs?

export function all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>, CC<T6>, CC<T7>, CC<T8>, CC<T9>]): CC<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>
export function all<T1, T2, T3, T4, T5, T6, T7, T8>(values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>, CC<T6>, CC<T7>, CC<T8>]): CC<[T1, T2, T3, T4, T5, T6, T7, T8]>
export function all<T1, T2, T3, T4, T5, T6, T7>(values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>, CC<T6>, CC<T7>]): CC<[T1, T2, T3, T4, T5, T6, T7]>
export function all<T1, T2, T3, T4, T5, T6>(values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>, CC<T6>]): CC<[T1, T2, T3, T4, T5, T6]>
export function all<T1, T2, T3, T4, T5>(values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>]): CC<[T1, T2, T3, T4, T5]>
export function all<T1, T2, T3, T4>(values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>]): CC<[T1, T2, T3, T4]>
export function all<T1, T2, T3>(values: [CC<T1>, CC<T2>, CC<T3>]): CC<[T1, T2, T3]>
export function all<T1, T2>(values: [CC<T1>, CC<T2>]): CC<[T1, T2]>
export function all<T>(values: (CC<T>)[]): CC<T[]>
export function all(values: CC<any>[]) {
  return values.reduce((aggOp: CC<any[]>, aOp: CC<any>) =>
    aggOp.chain((agg: any[]) => (
      aOp.map(a => agg.concat([a]))
    )
  ), ChainableComponent.of([]));
}

export function Do<A>(f: () => Iterator<any>): ChainableComponent<any> {
  const gen = f();
  // const agg: ChainableComponent<A[]> = ChainableComponent.of([]);
  function doRec(i: number, cache: any[], v = undefined): ChainableComponent<A[]> {
    // generate a new generator, then compute to the ith element,

    //const context = gen.next(v);

    const context = hmm(f(), undefined, i);
    
    console.log('Computed:', context)
    // var context = null;
    // if(cache[i]){
    //   context = cache[i];
    //   console.log('using cached value', context);
    // } else {
    //   context = gen.next(v);
    //   console.log('generated new value', context);
    //   cache[i] = context;
    // }
    
    return context.done ? ChainableComponent.of(context.value) : context.value.chain((v: any) => doRec(i + 1, cache, v));
  }

  // 
  return doRec(0, []);
}

function hmm(it: Iterator<any>, prev: any, i: number): IteratorResult<any> {
  console.log('computing the: ', i, 'th number')
  if(i === 0) {
    const wut = it.next(prev);
    console.log('resolved:', wut);
    return wut;
  } else {
    const context = it.next(prev);
    //return context.value.chain((v: any) => hmm(it, v, i - 1));
    return hmm(it, context.value.chain((v: any) => ) )
  }
}
