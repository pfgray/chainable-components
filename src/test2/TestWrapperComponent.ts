import { ChainableComponent } from '../ChainableComponent';
import * as React from 'react';
import { ReactNode } from 'react';
import { some, none, Option } from 'fp-ts/lib/Option';

const EmptyRender = () => null;
export type Render<T> = [ReactNode, Option<T>];

export type TestWrapperProps<T> = {
  chainable: ChainableComponent<T>;
  effects: ((t: T) => Promise<void>)[];
};
export class TestWrapperComponent<T> extends React.Component<
  TestWrapperProps<T>
> {
  tempContext: Option<T>;
  renders: Render<T>[];
  effectsLeft: ((t: T) => Promise<void>)[];
  nextEffect: () => Promise<boolean>;
  constructor(props: TestWrapperProps<T>) {
    super(props);
    this.renders = [];
    this.tempContext = none;
    this.effectsLeft = this.props.effects;
    this.nextEffect = () => Promise.resolve(true);
  }
  private addContext(context: T) {
    this.tempContext = some(context);
  }
  private addElement(r: ReactNode) {
    this.renders.push([r, this.tempContext]);
    this.tempContext = none;
  }
  render() {
    const el = this.props.chainable.render(values => {
      console.log('inside:', values);
      this.addContext(values);
      const [next] = this.effectsLeft.splice(0, 1);
      const done = this.effectsLeft.length === 0;
      this.nextEffect = next
        ? () => next(values).then(() => {
          console.log('forcing update');
          this.forceUpdate();
          return done
        })
        : () => Promise.resolve(true);
      return React.createElement(EmptyRender);
    });
    this.addElement(el);
    return el;
  }
}
