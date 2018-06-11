import * as React from 'react';

type StepProps = {
  title: string,
  children: any
};

export default (props: StepProps) => (
  <div className='step'>
    <h4 className='step-header'>{props.title}</h4>
    <div className='step-body'>{props.children}</div>
  </div>
);