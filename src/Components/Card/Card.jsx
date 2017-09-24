import React from 'react';
import { easyComp } from 'react-easy-state';

const Card = ({ children = null }) =>
  <div className="Card">
    {children}
  </div>

export default easyComp(Card);
