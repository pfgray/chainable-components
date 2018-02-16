import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import '../styles/index.less';

import { Test3 } from './Demo';
import './demo.less';

const APP_ELEMENT = document.getElementById('app')!;
const render = (Component: React.ComponentType<any>) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    APP_ELEMENT,
  );
};

render(() => <div>
  {Test3}
</div>);

declare var module: any;
if (module.hot) {
  module.hot.accept('./Demo', () => {
    render(require('./Demo').Demo);
  });
}
