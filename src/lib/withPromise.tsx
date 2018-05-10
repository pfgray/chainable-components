import { fromRenderProp, ChainableComponent, RenderPropsProps } from '../ChainableComponent';
import * as React from 'react';

/**
 * The state of the WithProps component.
 * It can either be loading, or have data available.
 */
export type WithPromiseState<A> = {
  loading: true
} | {
  loading: false,
  data: A
};

/**
 * The type of options that WithPromise expects 
 */
export type WithPromiseOptions<A> = {
  /**
   * A method that returns a Promise. this method will be invoked once when the component is mounted.
   */
  get: () => Promise<A>
};

/**
 * The Props that configure the withPromise Chainable Component.
 */
export type WithPromiseProps<A> = RenderPropsProps<WithPromiseOptions<A>, WithPromiseState<A>>;

/**
 * A Render Prop component that encapsulates the state around resolving a Promise which is 
 * requested when this component mounts.
 */
export class WithPromise<A> extends React.Component<WithPromiseProps<A>, WithPromiseState<A>> {
  state: WithPromiseState<A> = {
    loading: true
  };

  componentDidMount() {
    this.props.get().then(data => {
      this.setState(() => ({
        loading: false,
        data
      }));
    });
  }

  render() {
    return this.props.children(this.state);
  }
};

/**
 * Builds a chainable component that encapsulates the state around resolving a Promise which is 
 * requested when this component mounts.
 * @param opts Options for this chainable component which provide a method that returns
 */
export function withPromise<A>(opts: WithPromiseOptions<A>): ChainableComponent<WithPromiseState<A>> {
  return fromRenderProp<WithPromiseOptions<A>, WithPromiseState<A>>(WithPromise)(opts);
};
