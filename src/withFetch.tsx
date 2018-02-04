import { toMonad } from './ChainableComponent';
import * as React from 'react';

export type User = {
  name: string,
  age: number
}

type WithFetchState = {
  loading: true
} | {
  loading: false,
  user: User
};

function inner(url: string, F: React.ComponentType<User>): React.SFC<any> {
  console.log(url);
  class WithFetch extends React.Component<{}, WithFetchState> {
    state: WithFetchState = {
      loading: true
    }
  
    componentDidMount() {
      setTimeout(() => {
        this.setState({
          loading: false,
          user: {name: 'paul', age: 50}
        });
      }, 2000);
    }
  
    render() {
      console.log('calling render?');
      return this.state.loading ? (
        <div>loading ({url})</div>
      ) : (
        <F {...this.state.user} />
      );
    }
  };

  return (props) => <WithFetch {...props} />;
}

export const withFetch = toMonad(inner)