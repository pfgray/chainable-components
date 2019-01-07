import * as React from 'react';
import { ChainableComponent, fromRenderProp, RenderPropsProps } from '../ChainableComponent';

/**
 * The type of options that Pure expects
 */
export type PureOptions = {
  when: () => boolean,
};

/**
 * The Props that configure the withPromise Chainable Component.
 */
export type PureProps = RenderPropsProps<PureOptions, null>;

/**
 * A Render Prop component that encapsulates the state around resolving a Promise which is
 * requested when this component mounts.
 */
export class Pure extends React.Component<PureProps, {}> {

  shouldComponentUpdate() {
    return this.props.when();
  }

  render() {
    return this.props.children(null);
  }
}

/**
 * Builds a chainable component that encapsulates the state around resolving a Promise which is
 * requested when this component mounts.
 * @param promise the promise returning function to use.
 */
export function pure(when: () => boolean): ChainableComponent<null> {
  return fromRenderProp<PureProps>(Pure, {when});
}
