import * as React from 'react';
import Step from '../Step';
import {
  fromNonStandardRenderProp,
  ChainableComponent
} from '../../src/ChainableComponent';

type MyRenderPropProps = {
  foo: string;
  render?: (s: string) => React.ReactElement<any> | null;
  otherRender?: (n: number) => React.ReactElement<any> | null;
};

const MyRenderProp = (props: MyRenderPropProps) => (
  <div>
    {props.render
      ? props.render('string value')
      : props.otherRender
      ? props.otherRender(5)
      : null}
  </div>
);

const nonStandardStr = fromNonStandardRenderProp('render', MyRenderProp, {
  foo: 'asdf'
});
const nonStandardNum = fromNonStandardRenderProp('otherRender', MyRenderProp, {
  foo: 'asdf'
});

export const FromNonStandardRenderPropDemo = ChainableComponent.all([
  nonStandardStr,
  nonStandardNum,
  nonStandardNum
]).render(([foo, outer, inner]) => (
  <div>
    {foo}
    <div>
      Outer: {outer}
    </div>
    <div>
      Inner: {inner}
    </div>
  </div>
));

export default () => (
  <Step title="FromNonStandardRenderPropDemo Demo">
    <pre className="code-sample">
      {`hmm
`}
    </pre>
    {FromNonStandardRenderPropDemo}
  </Step>
);
