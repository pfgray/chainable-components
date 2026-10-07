import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './demo.less';

// @ts-ignore - webpack require.context type
const Demos = require.context('./demos', true, /\.*\.tsx$/);

const APP_ELEMENT = document.getElementById("app");
const render = (Component: React.ComponentType<any>) => {
  ReactDOM.render(
    <Component/>,
    APP_ELEMENT,
  );
};

render(() => <div>
  {Demos.keys().map((key: string, i: number) => {
    // @ts-ignore - webpack require.context type
    const Comp = Demos(key);
    return <Comp.default key={i}/>;
  })}
</div>);
