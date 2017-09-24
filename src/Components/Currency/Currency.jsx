import React from 'react';
import { easyComp } from 'react-easy-state';

const Currency = ({ value = '--', symbol = null }) =>
  <div className="Currency">
    <span className={`Currency__symbol Currency__symbol--${symbol}`}></span>
    <span className="Currency__value">{value}</span>
  </div>

export default easyComp(Currency);
