import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import './demo.less';

const Demos = require.context('./demos', true, /\.*\.tsx$/);

const APP_ELEMENT = document.getElementById("app");
const render = (Component: React.ComponentType<any>) => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    APP_ELEMENT,
  );
};

render(() => <div>
  {Demos.keys().map(key => Demos(key)).map((Comp, i) => {
    return <Comp.default key={i}/>;
  })}
</div>);

declare var module: any;
if (module.hot) {
  // module.hot.accept('./Demo', () => {
  //   render(require('./Demo').Demo);
  // });
}
