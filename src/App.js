import React, { Component } from 'react';
import { easyComp } from 'react-easy-state';
import _ from 'lodash';

import FlipMove from 'react-flip-move';
import Card from './Components/Card/Card.jsx';
import Currency from './Components/Currency/Currency.jsx';

import PRICE_STORE from './Store/priceStore';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.sockets = this.initSockets('ethusd', 'btcusd');
  }

  componentWillUnmount() {
    Object.keys(this.sockets).forEach(key =>
      this.sockets[key].close());
  }

  initSockets(...pairs) {
    return pairs.reduce((sockets, pair) => {
      sockets[pair] = new WebSocket(`wss://api.gemini.com/v1/marketdata/${pair}`);

      const priceUpdate = evt =>
        PRICE_STORE.updatePrice({
          pair,
          price: parseFloat(JSON.parse(evt.data).events[0].price),
        });

      const PRICE_THROTTLE_MS = 2000;
      const throttledUpdate = _.throttle(priceUpdate, PRICE_THROTTLE_MS);

      sockets[pair].onmessage = evt =>
        throttledUpdate(evt);

      return sockets;
    }, {});
  }

  render() {
    const { prices } = PRICE_STORE;

    return(
      <div className="App">
        <FlipMove duration={300} easing="ease-out">
          {Object.keys(prices).map(pair =>
            <Card key={pair}>
              <Currency
                delta={prices[pair].delta}
                value={prices[pair].price}
                symbol="usd"
              />
            </Card>
          )}
        </FlipMove>
      </div>
    );
  }
}

export default easyComp(App);
