import { toMonad, MonadicComponent, Inner } from './MonadicComponent';
import * as React from 'react';
import { ReactNode } from 'react';

export type WithStateState<A> = {
  data: A
};

export type WithStateContext<A> = {
  data: A,
  update: (a: A) => void
}

function inner<A>(initialState: A, F: React.ComponentType<WithStateContext<A>>): React.SFC<any> {
  console.log(`initializing withState with:${initialState}`);
  class WithState extends React.Component<{}, WithStateState<A>> {
    state: WithStateState<A> = {
      data: initialState
    }

    constructor() {
      super({});
      this.update = this.update.bind(this);
    }

    update(a: A) {
      this.setState({
        data: a
      });
    }
  
    render() {
      return <F data={this.state.data} update={this.update}>{this.props.children}</F>;
    }
  };

  return (props) => <WithState {...props} />;
}

// guh why can't ts infer this...
export function withState<A>(a: A): MonadicComponent<WithStateContext<A>>{
  return toMonad(inner as Inner<A, WithStateContext<A>>)(a);
}


export type WithStateProps<A> = {
  initial: A,
  children: (c: WithStateContext<A>) => ReactNode
}

export class WithState<A> extends React.Component<WithStateProps<A>, WithStateState<A>> {
  state: WithStateState<A> = {
    data: this.props.initial
  }

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
    }); // data={this.state.data} update={this.update}>{this.props.children}</F>;
  }
}