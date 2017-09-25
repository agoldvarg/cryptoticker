import React from 'react';
import { easyComp } from 'react-easy-state';

import CountUp from 'react-countup';

const Currency = ({ delta = 0, symbol = null, value = 0.00, }) =>
  <div className="Currency">
    <span className={`Currency__symbol Currency__symbol--${symbol}`}></span>
    <span className="Currency__value">
      <CountUp
        decimals={2}
        end={value}
        start={(value - delta)}
        useGrouping={true}
        duration={1}
      />
    </span>
  </div>

export default easyComp(Currency);
