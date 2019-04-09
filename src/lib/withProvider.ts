import { Provider, createElement } from 'react';
import { ChainableComponent, fromRender } from '../ChainableComponent';

export function withProvider<A>(provider: Provider<A>): (value: A) => ChainableComponent<A> {
    return a => fromRender<A>(f => createElement(provider, {value: a}, f(a)))
}
