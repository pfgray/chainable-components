import { buildChainable, ChainableComponent, RenderPropsProps } from '../ChainableComponent';
import * as React from 'react';

export type WithPromiseState<A> = {
  loading: true
} | {
  loading: false,
  data: A
};

export type WithPromiseOptions<A> = {
  get: () => Promise<A>
};

export type WithPromiseProps<A> = RenderPropsProps<WithPromiseOptions<A>, WithPromiseState<A>>;

export class WithPromise<A> extends React.Component<WithPromiseProps<A>, WithPromiseState<A>> {
  state: WithPromiseState<A> = {
    loading: true
  };

  componentDidMount() {
    this.props.get().then(data => {
      this.setState(() => ({
        loading: false,
        data
      }))
    });
  }

  render() {
    return this.props.children(this.state);
  }
};

export function withPromise<A>(opts: WithPromiseOptions<A>): ChainableComponent<WithPromiseState<A>> {
  return buildChainable<WithPromiseOptions<A>, WithPromiseState<A>>(WithPromise)(opts);
};
