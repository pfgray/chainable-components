import { toChainable, ChainableComponent, Inner } from './ChainableComponent';
import * as React from 'react';
import { ReactNode, createFactory } from 'react';

export type WithStateState<A> = {
  data: A
};

export type WithStateContext<A> = {
  data: A,
  update: (a: A) => void
}

export function inner<A>(initialState: A, F: React.ComponentType<WithStateContext<A>>): React.ComponentType<any> {
  console.log(`initializing withState with: ${initialState}`);

  const factory = createFactory<WithStateContext<A>>(F as any);
  class WithState extends React.Component<{}, WithStateState<A>> {
    state: WithStateState<A> = {
      data: initialState
    }

    componentDidMount(){
      console.log('Mounting new WithState... ');
    }

    componentWillUnmount(){
      console.log('unmounting WithState... ', this.state);
    }

    componentWillReceiveProps(a, b){
      console.log('receiving props...', a, b);
    }

    update(a: A) {
      this.setState({
        data: a
      });
    }
  
    render() {
      F.displayName = "Wrapped";
      console.log('Rendering WithState.... ', F);
      console.log('with props', F.defaultProps);
      return factory({
        ...this.state,
        update: this.update.bind(this)
      });
    }
  };

  return WithState;

  // return (props) => (
  //   <WithState initial={initialState as A}>
  //     {(withStateContext: WithStateContext<A>) => (
  //       <F {...withStateContext} />
  //     )}
  //   </WithState>
  // );
}

// guh why can't ts infer this...
export function withState<A>(a: A): ChainableComponent<WithStateContext<A>> {
  return toChainable(inner as Inner<A, WithStateContext<A>>)(a);
}

export type WithStateProps<A> = {
  initial: A,
  children: (c: WithStateContext<A>) => Element
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