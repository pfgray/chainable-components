import { ChainableComponent } from './../ChainableComponent';
import * as React from 'react';

export type TestWrapperProps<T> = {
  chainable: ChainableComponent<T>;
  effects: ((t: T) => void)[];
};
export class TestWrapperComponent<T> extends React.Component<
  TestWrapperProps<T>
> {
  renders: T[];
  effectsLeft: ((t: T) => void)[];
  nextEffect: () => boolean;
  constructor(props: TestWrapperProps<T>) {
    super(props);
    this.renders = [];
    this.effectsLeft = this.props.effects;
    this.nextEffect = () => true;
  }
  private addRender(values: T) {
    this.renders.push(values);
  }
  render() {
    return this.props.chainable.render(values => {
      this.addRender(values);
      const [next] = this.effectsLeft.splice(0, 1);
      const done = this.effectsLeft.length === 0;
      this.nextEffect = next ? () => {
        next(values);
        return done;
      } : () => true;
      return null;
    });
  }
}
