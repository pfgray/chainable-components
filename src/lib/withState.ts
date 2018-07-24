import * as React from 'react';
import { ChainableComponent, fromRenderProp, RenderPropsProps } from '../ChainableComponent';

/**
 * The state used by the WithState render prop.
 */
export type WithStateState<A> = {
  value: A,
};

/**
 * Stores the state value and provides a function that updates the state.
 */
export type WithStateContext<A> = {
  value: A,
  update: (a: A) => void,
};

/**
 * The options to pass
 */
export type WithStateOptions<A> = {
  initial: A,
};

export type WithStateProps<A> = RenderPropsProps<WithStateOptions<A>, WithStateContext<A>>;

export class WithState<A> extends React.Component<WithStateProps<A>, WithStateState<A>> {
  state: WithStateState<A> = {
    value: this.props.initial,
  };

  constructor(props: WithStateProps<A>) {
    super(props);
    this.update = this.update.bind(this);
  }

  update(a: A) {
    this.setState({
      value: a,
    });
  }

  render() {
    return this.props.children({
      value: this.state.value,
      update: this.update,
    });
  }
}

export function withState<A>(a: A): ChainableComponent<WithStateContext<A>> {
  return fromRenderProp<WithStateProps<A>>(WithState, {initial: a});
}
