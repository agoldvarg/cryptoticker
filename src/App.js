import React, { Component } from 'react';
import { easyComp } from 'react-easy-state';

import FlipMove from 'react-flip-move';
import Card from './Components/Card/Card.jsx';
import Currency from './Components/Currency/Currency.jsx';

import PRICE_STORE from './Store/priceStore';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.sockets = this.initSockets('eth/usd', 'btc/usd');
  }

  componentWillUnmount() {
    Object.keys(this.sockets).forEach(key =>
      this.sockets[key].close());
  }

  initSockets(...pairs) {
    const { updatePrice, prices } = PRICE_STORE;
    return pairs.reduce((sockets, pair) => {
      sockets[pair] = new WebSocket(`wss://api.gemini.com/v1/marketdata/${pair.replace('/', '')}`);

      sockets[pair].onmessage = evt => {
        const events = JSON.parse(evt.data).events
        const trades = events.filter(event => event.type === 'trade');
        const prevPrice = prices[pair];

        const BOGUS_PRICE = '0.01';
        let price = BOGUS_PRICE;

        if (!prevPrice) {
          price = events[0].price;
        }

        if (trades.length) {
          price = trades[0].price
        }

        if (price !== BOGUS_PRICE) {
          updatePrice({
            pair,
            price: parseFloat(price)
          });
        }
      }

      return sockets;
    }, {});
  }

  render() {
    const { prices } = PRICE_STORE;

    return(
      <div className="App">
        <FlipMove duration={300} easing="ease-out">
          {Object.keys(prices).map(pair =>
            <Card badge={pair} key={pair}>
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
