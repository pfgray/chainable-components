import * as React from 'react';
import { fromRenderProp, ChainableComponent, RenderPropsProps } from '../ChainableComponent';

/**
 * The state used by the WithState render prop.
 */
export type WithStateState<A> = {
  data: A
};

/**
 * Stores the state value and provides a function that updates the state.
 */
export type WithStateContext<A> = {
  data: A,
  update: (a: A) => void
};

/**
 * The options to pass 
 */
export type WithStateOptions<A> = {
  initial: A
};

export type WithStateProps<A> = RenderPropsProps<WithStateOptions<A>, WithStateContext<A>>;

export class WithState<A> extends React.Component<WithStateProps<A>, WithStateState<A>> {
  state: WithStateState<A> = {
    data: this.props.initial
  };

  constructor(props: WithStateProps<A>) {
    super(props);
    this.update = this.update.bind(this);
  }

  update(a: A) {
    this.setState({
      data: a
    });
  }

  render() {
    return this.props.children({
      data: this.state.data,
      update: this.update
    });
  }
}

export function withState<A>(options: WithStateOptions<A>): ChainableComponent<WithStateContext<A>> {
  return fromRenderProp<WithStateOptions<A>, WithStateContext<A>>(WithState)(options);
}
