import * as React from 'react';
import { Formik } from 'formik';
import { fromRenderProp } from '../src/ChainableComponent';


const hmm = fromRenderProp(Formik)

hmm({
  initialValues: {username: 'username', password: ''},
  onSubmit: values => {}
}).ap(
  wut => {
    return <span></span>
  }
)