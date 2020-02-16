import { WithLifecycleOptions } from './withLifecycle';
import * as React from 'react';
import {
  ChainableComponent,
  fromRenderProp,
  RenderPropsProps
} from '../ChainableComponent';

/**
 * Configuration for the withLifecycle chainable component
 */
export type WithLifecycleOptions<C> = {
  init: () => C;
  componentDidMount?: (c: C) => C;
  componentWillUnmount?: (c: C) => C;
  deriveContext?: (c:C) => C;
  componentWillUpdate?: (c: C) => C;
  shouldComponentUpdate?: (c: C) => boolean;
};

type WithLifecycleProps<C> = RenderPropsProps<WithLifecycleOptions<C>, C>;

const iff = <A>(a: A | undefined, f: (a:A) => void): void => a && f(a)

const fold = <A, Z>(z: Z, a: A | undefined, f: (a:A) => Z): Z => a ? f(a) : z

/**
 * A Render Prop component that mimics the react Component API
 */
export class WithLifecycle<C> extends React.Component<
  WithLifecycleProps<C>,
  { context: C }
> {
  constructor(props: WithLifecycleProps<C>) {
    super(props);
    this.state = {
      context: this.props.init()
    }
  }

  static getDerivedStateFromProps<C>(nextProps: WithLifecycleProps<C>, state: { context: C }) {
    return nextProps.deriveContext ? { context: nextProps.deriveContext(state.context) } : state
  }

  componentDidMount() {
    iff(this.props.componentDidMount, dm => {
      this.setState(s => {
        context: dm(s.context)
      })
    })
  }

  componentWillUnmount() {
    iff(this.props.componentWillUnmount, wu => {
      this.setState(s => {
        context: wu(s.context)
      })
    })
  }
  shouldComponentUpdate() {
    return fold(true, this.props.shouldComponentUpdate, scu => {
      return scu(this.state.context)
    })
  }

  // UNSAFE_componentWillUpdate(nextProps: WithLifecycleProps<C>) {
  //   iff(nextProps.componentWillUpdate, wu => {
  //     this.setState(s => {
  //       context: wu(s.context)
  //     })
  //   })
  // }

  render() {
    return this.props.children(this.state.context);
  }
}

/**
 * Builds a chainable component that encapsulates a react component's lifecycle
 * @param promise the promise returning function to use.
 */
export function withLifecycle<C>(
  options: WithLifecycleOptions<C>
): ChainableComponent<C> {
  return fromRenderProp<WithLifecycleProps<C>>(WithLifecycle, options);
}
