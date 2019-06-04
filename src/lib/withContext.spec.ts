import * as React from 'react';
import { Do } from 'fp-ts-contrib/lib/Do';
import { ChainableComponent } from '..';
import { withHandler } from '../lib/withHandler';
import { withState } from '../lib/withState';
import { chainableComponent } from './../lib/fpts';
import { testing } from '../test/testBuilder';
import { withContext } from './withContext';
import { withProvider } from './withProvider';

const { Consumer, Provider } = React.createContext('default')

type Inner<T> = T extends ChainableComponent<infer U> ? U : never;

describe('withContext', () => {
  test('provides context values', () => {
    const underTest = Do(chainableComponent)
      .bind('outer', withContext(Consumer))
      .do(withProvider(Provider)('override').map(a => a as unknown)) // todo: "do" should probably take 'any'
      .bind('inner', withContext(Consumer))
      .done();

    testing(underTest)
      .test(function(render) {
        
        // When not nested inside a provider, withContext shoudl take the default value
        expect(render.outer).toBe('default');

        // When withContext is inside a provider, it should be overriden with the provider's value
        expect(render.inner).toBe('override');
      });
  });
});
