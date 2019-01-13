import * as React from 'react';

/**
 * Omits keys K from T
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Represents a HoC, whose wrapped component props are inferable.
 */
export interface InferableHOC<ProvidedProps extends {}> {
  <B extends ProvidedProps>(
    c: React.ComponentType<B>,
  ): React.ComponentType<Omit<B, keyof ProvidedProps>>;
}

/**
 * Represents a HoC, whose wrapped component props are inferable.
 */
export interface InferableHOCWithProps<ProvidedProps, NeededProps> {
  <B extends ProvidedProps>(
    c: React.ComponentType<B>,
  ): React.ComponentType<Omit<B, keyof ProvidedProps> & NeededProps>;
}

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
  render(f: (a: A) => React.ReactNode): React.ReactNode;

  /**
   * Renders this chainable into a render prop component.
   */
  toRenderProp(): React.ComponentType<ChildrenProp<A>>;

  /**
   * Renders this chainable into a Higher Order Component.
   * @param propMapper A function which maps chainable arguments into props
   */
  toHigherOrderComponent<B extends object>(
    propMapper: (a: A) => B
  ): InferableHOC<B>;

  /**
   * Converts the value inside this Chainable Component.
   *
   * @param f A function which is used to convert this value. The result of
   *          f will replace the existing in a new Chainable Component which is returned.
   */
  map<B>(f: (a: A) => B): ChainableComponent<B>;
  /**
   * @deprecated: use fantasy-land/map instead
   */
  'fantasyland/map'<B>(f: (a: A) => B): ChainableComponent<B>;
  'fantasy-land/map'<B>(f: (a: A) => B): ChainableComponent<B>;

  /**
   * Converts the value inside this Chainable Component.
   * @param c Apply the function inside of c to the value inside of this Chainable Component
   */
  ap<B>(c: ChainableComponent<(a: A) => B>): ChainableComponent<B>;
  /**
   * @deprecated: use fantasy-land/ap instead
   */
  'fantasyland/ap'<B>(
    c: ChainableComponent<(a: A) => B>
  ): ChainableComponent<B>;
  'fantasy-land/ap'<B>(
    c: ChainableComponent<(a: A) => B>
  ): ChainableComponent<B>;

  /**
   * Composes or 'chains' another Chainable Component along with this one.
   * @param f A function which is provided the contextual value, and returns a chainable component
   *      The result if this function will be returned.
   */
  chain<B>(f: (a: A) => ChainableComponent<B>): ChainableComponent<B>;
  /**
   * @deprecated: use fantasy-land/ap instead
   */
  'fantasyland/chain'<B>(
    f: (a: A) => ChainableComponent<B>
  ): ChainableComponent<B>;
  'fantasy-land/chain'<B>(
    f: (a: A) => ChainableComponent<B>
  ): ChainableComponent<B>;
};

/**
 * Represents the props used by a Render Props component.
 * @template P represents the props used to configure the Render Prop component.
 * @template A represents the type of the contextual value of the Render Props component.
 */
export type RenderPropsProps<P, A> = P & ChildrenProp<A>;

/**
 * A standard Render Prop's children property which doesn't pass a value
 */
export type ChildrenProp<A> = {
  children: (a: A) => React.ReactNode;
};

/**
 * Represents a function that takes a value A and returns a renderable ReactNode.
 */
type Applied<A> = (f: (a: A) => React.ReactNode) => React.ReactNode;

/**
 * Infers the type of the parameter to the 'children' function
 */
export type InferChildren<P> = P extends {
  children: (a: infer A) => React.ReactNode;
}
  ? A
  : never;

/**
 * Represents an un-parameterized Render Prop component.
 * @template P encapsulates the props used to configure this Render Prop
 * @template A represents the type of the contextual value of the Render Props component.
 */
export type UnParameterizedRenderPropsComponent<A> = React.ComponentType<
  ChildrenProp<A>
>;

/**
 * Converts a Render Prop Component into a Chainable Component.
 * @template A The type of the parameter of the 'children' prop
 * @param Inner the render prop component
 */
export function fromRenderProp<A>(
  Inner: UnParameterizedRenderPropsComponent<A>
): ChainableComponent<A>;

/**
 * Converts a Render Prop Component into a Chainable Component.
 * @template A The type of the parameter of the 'children' prop
 * @param Inner the render prop component
 * @param parameters an object containing the props that shoud be applied to this render prop component.
 */
export function fromRenderProp<P extends ChildrenProp<any>>(
  Inner: React.ComponentType<P>,
  parameters: Omit<P, 'children'>
): ChainableComponent<InferChildren<P>>;

export function fromRenderProp<P extends ChildrenProp<A>, A>(
  Inner: React.ComponentType<P> | UnParameterizedRenderPropsComponent<A>,
  parameters?: Omit<P, 'children'>
): ChainableComponent<A> {
  return fromRender(f => {
    const apply = React.createFactory<P>(Inner as any);
    if (parameters) {
      return apply({
        ...(parameters as any), // todo: we have any until https://github.com/Microsoft/TypeScript/pull/13288 is merged
        children: f
      });
    } else {
      return apply({
        children: f
      } as any);
    }
  });
}

/**
 * Converts a ChainableComponent to a render prop component
 * @param chainable The chainable component
 * @param {string} [prop=children] defaults to children
 */
export function toRenderProp<A>(
  chainable: ChainableComponent<A>
): React.ComponentType<ChildrenProp<A>> {
  // typecast here because of: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/18051
  return props =>
    chainable.render(props.children) as React.ReactElement<any> | null;
}

/**
 * Converts a ChainableComponent to a HigherOrderComponent
 * @param chainable The ChainableComponent
 * @param propMapper convert the value inside this chainable to props
 *                   that will be supplied by the created HoC
 */
export function toHigherOrderComponent<A, B extends object>(
  chainable: ChainableComponent<A>,
  propMapper: (a: A) => B
): InferableHOC<B> {
  return component => ownProps =>
    chainable.render(a =>
      React.createElement(component, {
        ...(ownProps as object),
        ...(propMapper(a) as object)
      } as any)
    ) as React.ReactElement<any> | null;
}

type DummyRenderPropProps<A, B> = A & {
  children: (b: B) => React.ReactNode;
};

/**
 * Converts a HigherOrderComponent to a ChainableComponent
 * @param hoc The HigherOrderComponent
 */
export function fromHigherOrderComponent<P extends {}>(
  hoc: InferableHOC<P>
): () => ChainableComponent<P>
export function fromHigherOrderComponent<P extends {}>(
  hoc: InferableHOCWithProps<P, {}>
): () => ChainableComponent<P>
export function fromHigherOrderComponent<P extends {}, N extends {}>(
  hoc: InferableHOCWithProps<P, N>
): (n: N) => ChainableComponent<P> {
  const Dummy: React.StatelessComponent<DummyRenderPropProps<P, P>> = props => props.children(props) as React.ReactElement<any> | null;
  const RenderPropComponent = hoc(Dummy as any as React.ComponentType<P>);

  const apply = React.createFactory<P>(RenderPropComponent as any as React.FunctionComponent<P>);
  return (n) => fromRender(f => {
    if(n) {
      return apply({...(n as any), children:f});
    } else {
      return apply({children:f} as any);
    }
  });
}

/**
 * Converts a Render Props Component into a function that can be used to build a ChainableComponent
 * Represents the type of a non standard render prop
 * @template P the props of the render prop component
 * @template A the type of the parameter of the render function
 * @template C the string of the key of the render function
 */
type NonStandardRenderPropProps<P, A, C extends keyof P> = A &
  { [K in C]: (a: P[K]) => React.ReactNode };

/**
 * Converts a Render Prop Component into a function that can be used to build a ChainableComponent
 * If a renderMethod name is not provided, it defaults to `children`.
 * A "non-standard" render prop is any render prop that does not use the 'children' prop as the render method.
 * @param Inner the render prop component
 */
export function fromNonStandardRenderProp<P, A, S extends keyof P>(
  renderMethod: S,
  Inner: React.ComponentType<NonStandardRenderPropProps<P, A, S>>,
  parameters?: Omit<P, S>
): ChainableComponent<A> {
  return fromRender(f => {
    const apply = React.createFactory<NonStandardRenderPropProps<P, A, S>>(
      Inner as any
    );
    return apply({
      ...(parameters as any),
      [renderMethod]: f
    });
  });
}

/**
 * Converts an apply function to a ChainableComponent
 * @param render
 */
export function fromRender<A>(
  render: (f: (a: A) => React.ReactNode) => React.ReactNode
): ChainableComponent<A> {
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
    }
  };

  // https://github.com/fantasyland/fantasy-land/blob/master/README.md#prefixed-method-names
  return {
    ...cc,
    'fantasyland/map': cc.map,
    'fantasy-land/map': cc.map,
    'fantasyland/ap': cc.ap,
    'fantasy-land/ap': cc.ap,
    'fantasyland/chain': cc.chain,
    'fantasy-land/chain': cc.chain,
    toRenderProp() {
      return toRenderProp(this);
    },
    toHigherOrderComponent(mapper) {
      return toHigherOrderComponent(this, mapper);
    }
  };
}

type CC<A> = ChainableComponent<A>;

function all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  values: [
    CC<T1>,
    CC<T2>,
    CC<T3>,
    CC<T4>,
    CC<T5>,
    CC<T6>,
    CC<T7>,
    CC<T8>,
    CC<T9>
  ]
): CC<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
function all<T1, T2, T3, T4, T5, T6, T7, T8>(
  values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>, CC<T6>, CC<T7>, CC<T8>]
): CC<[T1, T2, T3, T4, T5, T6, T7, T8]>;
function all<T1, T2, T3, T4, T5, T6, T7>(
  values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>, CC<T6>, CC<T7>]
): CC<[T1, T2, T3, T4, T5, T6, T7]>;
function all<T1, T2, T3, T4, T5, T6>(
  values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>, CC<T6>]
): CC<[T1, T2, T3, T4, T5, T6]>;
function all<T1, T2, T3, T4, T5>(
  values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>, CC<T5>]
): CC<[T1, T2, T3, T4, T5]>;
function all<T1, T2, T3, T4>(
  values: [CC<T1>, CC<T2>, CC<T3>, CC<T4>]
): CC<[T1, T2, T3, T4]>;
function all<T1, T2, T3>(values: [CC<T1>, CC<T2>, CC<T3>]): CC<[T1, T2, T3]>;
function all<T1, T2>(values: [CC<T1>, CC<T2>]): CC<[T1, T2]>;
function all<T>(values: (CC<T>)[]): CC<T[]>;
function all(values: CC<any>[]) {
  return values.reduce((aggOp: CC<any[]>, aOp: CC<any>) => {
    return aggOp.ap(
      aOp.map(a => {
        const g: (a: any[]) => any = agg => agg.concat([a]);
        return g;
      })
    );
  }, ChainableComponent.of([]));
}

function of<A>(a: A): ChainableComponent<A> {
  return fromRender(f => f(a));
}

function Do<T1, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<Z>
): ChainableComponent<Z>;
function Do<T1, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => Z
): ChainableComponent<Z>;

function Do<T1, T2, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  z: (t2: T2, t1: T1) => ChainableComponent<Z>
): ChainableComponent<Z>;
function Do<T1, T2, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  z: (t2: T2, t1: T1) => Z
): ChainableComponent<Z>;

function Do<T1, T2, T3, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  f2: (t2: T2, t1: T1) => ChainableComponent<T3>,
  z: (t3: T3, t2: T2, t1: T1) => ChainableComponent<Z>
): ChainableComponent<Z>;
function Do<T1, T2, T3, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  f2: (t2: T2, t1: T1) => ChainableComponent<T3>,
  z: (t3: T3, t2: T2, t1: T1) => Z
): ChainableComponent<Z>;

function Do<T1, T2, T3, T4, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  f2: (t2: T2, t1: T1) => ChainableComponent<T3>,
  f3: (t3: T3, t2: T2, t1: T1) => ChainableComponent<T4>,
  z: (t4: T4, t3: T3, t2: T2, t1: T1) => ChainableComponent<Z>
): ChainableComponent<Z>;
function Do<T1, T2, T3, T4, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  f2: (t2: T2, t1: T1) => ChainableComponent<T3>,
  f3: (t3: T3, t2: T2, t1: T1) => ChainableComponent<T4>,
  z: (t4: T4, t3: T3, t2: T2, t1: T1) => Z
): ChainableComponent<Z>;

function Do<T1, T2, T3, T4, T5, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  f2: (t2: T2, t1: T1) => ChainableComponent<T3>,
  f3: (t3: T3, t2: T2, t1: T1) => ChainableComponent<T4>,
  f4: (t4: T4, t3: T3, t2: T2, t1: T1) => ChainableComponent<T5>,
  z: (t5: T5, t4: T4, t3: T3, t2: T2, t1: T1) => ChainableComponent<Z>
): ChainableComponent<Z>;
function Do<T1, T2, T3, T4, T5, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  f2: (t2: T2, t1: T1) => ChainableComponent<T3>,
  f3: (t3: T3, t2: T2, t1: T1) => ChainableComponent<T4>,
  f4: (t4: T4, t3: T3, t2: T2, t1: T1) => ChainableComponent<T5>,
  z: (t5: T5, t4: T4, t3: T3, t2: T2, t1: T1) => Z
): ChainableComponent<Z>;

function Do<T1, T2, T3, T4, T5, T6, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  f2: (t2: T2, t1: T1) => ChainableComponent<T3>,
  f3: (t3: T3, t2: T2, t1: T1) => ChainableComponent<T4>,
  f4: (t4: T4, t3: T3, t2: T2, t1: T1) => ChainableComponent<T5>,
  f5: (t5: T5, t4: T4, t3: T3, t2: T2, t1: T1) => ChainableComponent<T6>,
  z: (t6: T6, t5: T5, t4: T4, t3: T3, t2: T2, t1: T1) => ChainableComponent<Z>
): ChainableComponent<Z>;
function Do<T1, T2, T3, T4, T5, T6, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  f2: (t2: T2, t1: T1) => ChainableComponent<T3>,
  f3: (t3: T3, t2: T2, t1: T1) => ChainableComponent<T4>,
  f4: (t4: T4, t3: T3, t2: T2, t1: T1) => ChainableComponent<T5>,
  f5: (t5: T5, t4: T4, t3: T3, t2: T2, t1: T1) => ChainableComponent<T6>,
  z: (t6: T6, t5: T5, t4: T4, t3: T3, t2: T2, t1: T1) => Z
): ChainableComponent<Z>;

function Do(
  a: ChainableComponent<any>,
  ...fns: Function[]
): ChainableComponent<any> {
  function doIt(as: ChainableComponent<any[]>, fns: Function[]): any {
    const [fn, ...rest] = fns;
    if (rest.length === 0) {
      return as.chain(a2s => {
        const aPrime = fn.apply(null, a2s);
        if (isChainableComponent(aPrime)) {
          return aPrime;
        } else {
          return of(aPrime);
        }
      });
    } else {
      return as.chain(a2s => {
        const aPrime = fn.apply(null, a2s);
        return doIt(aPrime.map((aP: any) => [aP, ...a2s]), rest);
      });
    }
  }
  return doIt(a.map(a2 => [a2]), fns);
}

function DoRender<T1, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => React.ReactNode
): React.ReactNode;

function DoRender<T1, T2, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  z: (t2: T2, t1: T1) => React.ReactNode
): React.ReactNode;

function DoRender<T1, T2, T3, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  f2: (t2: T2, t1: T1) => ChainableComponent<T3>,
  z: (t3: T3, t2: T2, t1: T1) => React.ReactNode
): React.ReactNode;

function DoRender<T1, T2, T3, T4, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  f2: (t2: T2, t1: T1) => ChainableComponent<T3>,
  f3: (t3: T3, t2: T2, t1: T1) => ChainableComponent<T4>,
  z: (t4: T4, t3: T3, t2: T2, t1: T1) => React.ReactNode
): React.ReactNode;

function DoRender<T1, T2, T3, T4, T5, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  f2: (t2: T2, t1: T1) => ChainableComponent<T3>,
  f3: (t3: T3, t2: T2, t1: T1) => ChainableComponent<T4>,
  f4: (t4: T4, t3: T3, t2: T2, t1: T1) => ChainableComponent<T5>,
  z: (t5: T5, t4: T4, t3: T3, t2: T2, t1: T1) => React.ReactNode
): React.ReactNode;

function DoRender<T1, T2, T3, T4, T5, T6, Z>(
  c: ChainableComponent<T1>,
  f1: (t1: T1) => ChainableComponent<T2>,
  f2: (t2: T2, t1: T1) => ChainableComponent<T3>,
  f3: (t3: T3, t2: T2, t1: T1) => ChainableComponent<T4>,
  f4: (t4: T4, t3: T3, t2: T2, t1: T1) => ChainableComponent<T5>,
  f5: (t5: T5, t4: T4, t3: T3, t2: T2, t1: T1) => ChainableComponent<T6>,
  z: (t6: T6, t5: T5, t4: T4, t3: T3, t2: T2, t1: T1) => React.ReactNode
): React.ReactNode;

function DoRender(
  a: ChainableComponent<any>,
  ...fns: Function[]
): React.ReactNode {
  function doIt(as: ChainableComponent<any[]>, fns: Function[]): any {
    const [fn, ...rest] = fns;
    if (rest.length === 0) {
      return as.render(a2s => fn.apply(null, a2s));
    } else {
      return as.render(a2s => {
        const aPrime = fn.apply(null, a2s);
        return doIt(aPrime.map((aP: any) => [aP, ...a2s]), rest);
      });
    }
  }
  return doIt(a.map(a2 => [a2]), fns);
}

const isChainableComponent = (a: any) => {
  return (
    typeof a.chain === 'function' &&
    typeof a.map === 'function' &&
    typeof a.ap === 'function' &&
    typeof a.render === 'function'
  );
};

export const ChainableComponent = {
  /**
   * Wraps any value 'A' into a chainable component.
   * @param a the value that provides the context.
   */
  of,
  /**
   * @deprecated: use fantasy-land/of instead
   */
  'fantasyland/of': of,
  'fantasy-land/of': of,
  all,
  Do,
  DoRender
};
