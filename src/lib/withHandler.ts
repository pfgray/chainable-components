import { ChainableComponent } from '../ChainableComponent';
import { withLifecycle } from './withLifecycle';
import { equals } from '../Dependencies';

export function withHandler<F extends Function>(
  cb: F,
  dependencies: any[]
): ChainableComponent<F> {
  return withLifecycle<[F, any[]]>({
    init: () => [cb, dependencies],
    deriveContext: ([f, deps]) =>
      equals(deps, dependencies) ? [f, deps] : [cb, dependencies]
  }).map(a => a[0]);
}
