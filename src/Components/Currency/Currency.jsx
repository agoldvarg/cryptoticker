import React from 'react';
import classnames from 'classnames';
import { easyComp } from 'react-easy-state';

import CountUp from 'react-countup';

const CURRENCY = {
  usd: '$',
}

const Currency = ({ delta = 0, symbol = null, value = 0.00, }) =>
  <div className={
    classnames('Currency', {
      'Currency--up': delta > 0,
      'Currency--down': delta < 0,
    })}>
    <div className="Currency__symbol">{CURRENCY[symbol]}</div>
    <div className="Currency__value">
      <CountUp
        decimals={2}
        end={value}
        start={(value - delta)}
        useGrouping={true}
        duration={1}
      />
    </div>
    <div className="Currency__indicators">
      <div className={
        classnames('indicator', 'indicator--up', {
          'indicator--visible': delta > 0,
        })
      }></div>
      <div className={
        classnames('indicator', 'indicator--down', {
          'indicator--visible': delta < 0,
        })
      }></div>
    </div>
  </div>

export default easyComp(Currency);
