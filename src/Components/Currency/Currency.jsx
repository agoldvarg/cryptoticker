import React from 'react';

const Currency = ({ value = null, symbol = null }) =>
  <div className="Currency">
    <span className={`Currency__symbol Currency__symbol--${symbol}`}></span>
    <span className="Currency__value">{value}</span>
  </div>

export default Currency;
