import { buildChainable, ChainableComponent, RenderPropsProps } from './ChainableComponent';
import * as React from 'react';

export type User = {
  name: string,
  age: number
};

type WithFetchState = {
  loading: true
} | {
  loading: false,
  user: User
};

type WithFetchOptions = { url: string };

type WithFetchProps = RenderPropsProps<WithFetchOptions, User>;

class WithFetch extends React.Component<WithFetchProps, WithFetchState> {
  state: WithFetchState = {
    loading: true
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState(() => ({
        loading: false,
        user: {name: 'paul', age: 50}
      }))
    }, 2000);
  }

  render() {
    return this.state.loading ? (
      <div>loading ({this.props.url})</div>
    ) : (
      this.props.children(this.state.user)
    );
  }
};

export const withFetch = buildChainable(WithFetch);
