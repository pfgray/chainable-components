import { Consumer } from 'react';
import { ChainableComponent, fromRenderProp } from '../ChainableComponent';

export function withContext<A>(consumer: Consumer<A>): ChainableComponent<A> {
  return fromRenderProp<A>(consumer)
}
