import { Consumer } from 'react';
import { ChainableComponent, fromRenderProp, RenderPropsProps } from '../ChainableComponent';

export function withContext<A>(consumer: Consumer<A>): ChainableComponent<A> {
    return fromRenderProp<A>(consumer)
}
