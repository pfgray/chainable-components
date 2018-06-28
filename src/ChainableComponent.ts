import { createFactory, ReactNode, createElement } from 'react';

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
  render(f: (a: A) => ReactNode): ReactNode;

  /**
   * Renders this chainable into a render prop component.
   * @param prop Defines which prop will be used to render a component.
   *        Defaults to children
   */
  toRenderProp<P>(prop?: string): React.ComponentType<P & { [prop: string]: (a: A) => ReactNode }>;

  /**
   * Renders this chainable into a Higher Order Component.
   * @param propMapper A function which maps chainable arguments into props
   */
  toHigherOrderComponent<B extends object, P extends object>(propMapper : (b : A) => B ) : (component : React.ComponentType<any>) => React.ComponentType<P>;

  /**
   * Converts the value inside this Chainable Component.
   * @param f A function which is used to convert this value. The result of
   *          f will replace the existing in a new Chainable Component which is returned.
   */
  map<B>(f: (a: A) => B): ChainableComponent<B>;
  'fantasyland/map'<B>(f: (a: A) => B): ChainableComponent<B>;

  /**
   * Converts the value inside this Chainable Component.
   * @param c Apply the function inside of c to the value inside of this Chainable Component
   */
  ap<B>(c: ChainableComponent<(a: A) => B>): ChainableComponent<B>;
  'fantasyland/ap'<B>(c: ChainableComponent<(a: A) => B>): ChainableComponent<B>;

  /**
   * Composes or 'chains' another Chainable Component along with this one.
   * @param f A function which is provided the contextual value, and returns a chainable component
   *          The result if this function will be returned.
   */
  chain<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B>;
  'fantasyland/chain'<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B>;
};

/**
 * Represents the props used by a Render Props component.
 * @type P represents the props used to configure the Render Prop component.
 * @type A represents the type of the contextual value of the Render Props component.
 */
export type RenderPropsProps<P, A> = P & {
  children: (a: A) => ReactNode,
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
  return p => fromRender(f => {
    const apply = createFactory<RenderPropsProps<P, A>>(Inner as any);
    return apply({
      ...(p as any), // todo: we have any until https://github.com/Microsoft/TypeScript/pull/13288 is merged
      children: f,
    });
  });
}

/**
 * Converts a ChainableComponent to a render prop component
 * @param chainable The chainable component
 * @param {string} [prop=children] defaults to children
 */
export function toRenderProp<P, A>(
  chainable: ChainableComponent<A>,
  prop = 'children'
): React.ComponentType<P & { [prop: string]: (a: A) => ReactNode }> {
  return props =>
    createElement('div', undefined, chainable.render(props[prop]));
}

/**
 * Converts a HigherOrderComponent to a ChainableComponent
 * @param hoc The HigherOrderComponent
 */
export function fromHigherOrderComponent<P>(
  hoc: (a: React.ComponentType<P>) => React.ComponentType<P>
): ChainableComponent<P> {
  return fromRender(f => 
    createElement(hoc(props => f(props) as any))
  );
}

/**
 * Converts a ChainableComponent to a HigherOrderComponent
 * @param chainable The ChainableComponent
 * @param propMapper converts render prop to a prop object
 */
export function toHigherOrderComponent<A, B extends object, P extends object>(
  chainable: ChainableComponent<A>,
  propMapper: (b: A) => B
): (component: React.ComponentType<any>) => React.ComponentType<P> {
  return component => (ownProps: P) =>
    createElement(
      'div',
      undefined,
      chainable.render(props =>
        createElement(component, {
          ...(ownProps as object),
          ...(propMapper(props) as object)
        })
      )
    );
}

/**
 * Converts a Render Props Component into a function that can be used to build a ChainableComponent
 * If a renderMethod name is not provided, it defaults to `children`.
 * @param Inner the render prop component
 */
export function fromNonStandardRenderProp<P extends object, A>(
  renderMethod: string,
  Inner: React.ComponentClass<P & { [render: string]: (a: A) => ReactNode }>,
): (p: P) => ChainableComponent<A> {
  return p => fromRender(f => {
    const apply = createFactory<P & { [renderMethod: string]: (a: A) => ReactNode }>(Inner);
    return apply({
      ...(p as any),
      [renderMethod]: f,
    });
  });
}

/**
 * Converts an apply function to a ChainableComponent
 * @param render
 */
export function fromRender<A>(render: (f: (a: A) => ReactNode) => ReactNode): ChainableComponent<A> {
  const cc = {
    render,
    map<B>(f: (a: A) => B): ChainableComponent<B> {
      const Mapped: Applied<B> = g => this.render(a => g(f(a)));
      return fromRender(Mapped);
    },
    ap<B>(c: ChainableComponent<(a: A) => B>): ChainableComponent<B> {
      const Apped: Applied<B> = g => this.render(a => c.render(f => g(f(a))));
      return fromRender(Apped);
    },
    chain<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B> {
      const FlatMapped: Applied<B> = g => this.render(a => f(a).render(g));
      return fromRender(FlatMapped);
    },
  };

  // https://github.com/fantasyland/fantasy-land/blob/master/README.md#prefixed-method-names
  return {
    ...cc,
    'fantasyland/map': cc.map,
    'fantasyland/ap': cc.ap,
    'fantasyland/chain': cc.chain,
    toRenderProp(method?: string) {
      return toRenderProp(this, method);
    },
    toHigherOrderComponent(mapper) {
      return toHigherOrderComponent(this, mapper);
    }
  };
}

type CC<A> = ChainableComponent<A>;

function all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>, CC<T6>, CC<T7>, CC<T8>, CC<T9>]): CC<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
function all<T1, T2, T3, T4, T5, T6, T7, T8>(
  values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>, CC<T6>, CC<T7>, CC<T8>]): CC<[T1, T2, T3, T4, T5, T6, T7, T8]>;
function all<T1, T2, T3, T4, T5, T6, T7>(values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>, CC<T6>, CC<T7>]): CC<[T1, T2, T3, T4, T5, T6, T7]>;
function all<T1, T2, T3, T4, T5, T6>(values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>, CC<T6>]): CC<[T1, T2, T3, T4, T5, T6]>;
function all<T1, T2, T3, T4, T5>(values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>]): CC<[T1, T2, T3, T4, T5]>;
function all<T1, T2, T3, T4>(values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>]): CC<[T1, T2, T3, T4]>;
function all<T1, T2, T3>(values: [CC<T1>, CC<T2>, CC<T3>]): CC<[T1, T2, T3]>;
function all<T1, T2>(values: [CC<T1>, CC<T2>]): CC<[T1, T2]>;
function all<T>(values: (CC<T>)[]): CC<T[]>;
function all(values: CC<any>[]) {
  return values.reduce((aggOp: CC<any[]>, aOp: CC<any>) => {
    return aggOp.ap(aOp.map(a => {
      const g: (a: any[]) => any = agg => agg.concat([a]);
      return g;
    }));
  }, ChainableComponent.of([]));
}

function of<A>(a: A): ChainableComponent<A> {
  return fromRender(f => f(a));
}

export const ChainableComponent = {
  /**
   * Wraps any value 'A' into a chainable component.
   * @param a the value that provides the context.
   */
  of,
  'fantasyland/of': of,
  all,
};
