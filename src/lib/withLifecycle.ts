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
  componentDidMount: () => C;
  componentWillUnmount?: (c: C) => void;
  shouldComponentUpdate?: (c: C) => boolean;
};

type WithLifecycleProps<C> = RenderPropsProps<WithLifecycleOptions<C>, {}>;

/**
 * A Render Prop component that mimics the react Component API
 */
export class WithLifecycle<C> extends React.Component<
  WithLifecycleProps<C>,
  {}
> {
  constructor(props: WithLifecycleProps<C>) {
    super(props);
  }

  componentDidMount() {
    this.context = this.props.componentDidMount();
  }
  componentWillUnmount() {
    this.props.componentWillUnmount &&
      this.props.componentWillUnmount(this.context);
  }
  shouldComponentUpdate() {
    return this.props.shouldComponentUpdate
      ? this.props.shouldComponentUpdate(this.context)
      : true;
  }

  render() {
    return this.props.children({});
  }
}

/**
 * Builds a chainable component that encapsulates a react component's lifecycle
 * @param promise the promise returning function to use.
 */
export function withLifecycle<C>(
  options: WithLifecycleOptions<C>
): ChainableComponent<{}> {
  return fromRenderProp<WithLifecycleProps<C>>(WithLifecycle, options);
}
