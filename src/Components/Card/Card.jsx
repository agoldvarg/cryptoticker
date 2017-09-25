import React from 'react';
import classnames from 'classnames';
import { easyComp } from 'react-easy-state';

const Card = ({ badge = null, children = null }) =>
  <div className={classnames('Card', `Card--${badge.replace('/', '')}`)}>
    <div className="Card__badge">{badge}</div>

    {children}
  </div>

export default easyComp(Card);
