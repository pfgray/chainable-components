import { Monad1 } from "fp-ts/Monad";
import { ChainableComponent } from "..";

export const URI = "ChainableComponent";
export type URI = typeof URI;

declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    readonly [URI]: ChainableComponent<A>;
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
