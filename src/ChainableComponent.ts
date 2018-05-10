import { createFactory, ReactNode } from 'react';

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

export const ChainableComponent = {
  /**
   * Wraps any value 'A' into a chainable component.
   * @param a the value that provides the context.
   */
  of<A>(a: A): ChainableComponent<A> {
    return fromAp(f => f(a));
  }
};