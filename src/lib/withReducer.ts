import * as React from 'react';
import { ChainableComponent, fromRenderProp, RenderPropsProps } from '../ChainableComponent';

/**
 * The state used by the WithState render prop.
 */
export type WithReducerState<S> = {
  value: S,
};

/**
 * Stores the state value and provides a function that updates the state.
 */
export type WithReducerContext<S, A> = {
  state: S,
  dispatch: (a: A) => void,
};

/**
 * The options to pass
 */
export type WithReducerOptions<S, A> = {
  initialState: S,
  reducer: (state: S, action: A) => S
};

export type WithReducerProps<S, A> = RenderPropsProps<WithReducerOptions<S, A>, WithReducerContext<S, A>>;

export class WithReducer<S, A> extends React.Component<WithReducerProps<S, A>, WithReducerState<S>> {
  state: WithReducerState<S> = {
    value: this.props.initialState,
  };

  constructor(props: WithReducerProps<S, A>) {
    super(props);
    this.dispatch = this.dispatch.bind(this);
  }

  dispatch(a: A) {
    this.setState(state => ({
      value: this.props.reducer(state.value, a)
    }))
  }

  render() {
    return this.props.children({
      state: this.state.value,
      dispatch: this.dispatch,
    });
  }
}

export function withReducer<S, A>(reducer: (state: S, action: A) => S, initialState: S): ChainableComponent<WithReducerContext<S, A>> {
  return fromRenderProp<WithReducerProps<S, A>>(WithReducer, {reducer, initialState});
}
