import { Monad1 } from "fp-ts/lib/Monad";
import { HKT } from 'fp-ts/lib/HKT';
import { ChainableComponent } from "..";
import { Do } from 'fp-ts-contrib/lib/Do';

export const URI = "ChainableComponent";
export type URI = typeof URI;

declare module "fp-ts/lib/HKT" {
  interface URI2HKT<A> {
    ChainableComponent: ChainableComponent<A>;
  }
}

export const chainableComponent: Monad1<URI> = {
  URI,
  of<A>(a: A) {
    return ChainableComponent.of(a);
  },
  map<A, B>(fa: ChainableComponent<A>, f: (a: A) => B) {
    return fa.map(f);
  },
  ap<A, B>(fab: ChainableComponent<(a: A) => B>, fa: ChainableComponent<A>) {
    return fa.ap(fab)
  },
  chain<A, B>(fa: ChainableComponent<A>, f: (a: A) => ChainableComponent<B>) {
    return fa.chain(f)
  }
};

export const DoBuilder = Do(chainableComponent)
