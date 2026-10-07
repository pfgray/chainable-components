import {
  ChainableComponent,
  fromRender,
  fromRenderProp,
  fromHigherOrderComponent,
  toRenderProp,
  toHigherOrderComponent
} from './ChainableComponent';
import { withPromise } from './lib/withPromise';
import { withState } from './lib/withState';
import { withLifecycle } from './lib/withLifecycle';
import { chainableComponent } from './lib/fpts';

export type { RenderPropsProps } from './ChainableComponent';
export type { WithPromise } from './lib/withPromise';
export type { WithState } from './lib/withState';
export type { WithLifecycle } from './lib/withLifecycle';

export {
  ChainableComponent,
  fromRenderProp,
  fromRender,
  toRenderProp,
  toHigherOrderComponent,
  fromHigherOrderComponent,
  withState,
  withPromise,
  withLifecycle,
  chainableComponent
};
