import React from 'react';
import classnames from 'classnames';
import { easyComp } from 'react-easy-state';

const Header = ({  }) =>
  <div className={classnames('Header', {})}>
    <div className="Header__title">cryptoticker</div>
  </div>

export default easyComp(Header);
