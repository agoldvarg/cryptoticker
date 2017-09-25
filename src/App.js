import React, { Component } from 'react';
import { easyComp } from 'react-easy-state';
import './App.css';

import Card from './Components/Card/Card.jsx';
import Currency from './Components/Currency/Currency.jsx';
import PortfolioPage from './Components/Page/PortfolioPage.jsx';

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
    return(
      <div className="App">
        <PortfolioPage />
        <Card>
          <Currency
            symbol="usd"
            value={PRICE_STORE.prices['ethusd']}
          />
        </Card>
        <Card>
          <Currency
            symbol="usd"
            value={PRICE_STORE.prices['btcusd']}
          />
        </Card>
      </div>
    );
  }
}

export default easyComp(App);
