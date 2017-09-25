import React, { Component } from 'react';
import { easyComp } from 'react-easy-state';
import FlipMove from 'react-flip-move';

import './App.css';

import Card from './Components/Card/Card.jsx';
import Currency from './Components/Currency/Currency.jsx';

import PRICE_STORE from './Store/priceStore';

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

      sockets[pair].onmessage = evt => {
        PRICE_STORE.updatePrice({
          pair,
          price: JSON.parse(evt.data).events[0].price,
        })
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
            <Card key={pair}>
              <Currency
                symbol="usd"
                value={prices[pair]}
              />
            </Card>
          )}
        </FlipMove>
      </div>
    );
  }
}

export default easyComp(App);
