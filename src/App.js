import React, { Component } from 'react';
import { easyComp } from 'react-easy-state';
import PRICE_STORE from './Stores/priceStore';

// Choose cryptocompare or gemini as your data source
import { subscribeTo, unsubscribe } from './Services/cryptocompareService';
// import { subscribeTo, unsubscribe } from './Services/geminiService';

import FlipMove from 'react-flip-move';
import Header from './Components/Header/Header';
import Card from './Components/Card/Card';
import Currency from './Components/Currency/Currency';


import './App.css';

const DEFAULT_PAIRS = ['btc/usd', 'eth/usd'];

class App extends Component {
  constructor() {
    super();

    this.subscribe(DEFAULT_PAIRS);
  }

  componentWillUnmount() {
    DEFAULT_PAIRS.forEach(pair => unsubscribe(pair));
  }

  subscribe(pairs) {
    const { updatePrice } = PRICE_STORE;

    const filterUpdates = (unpacked) => {
      if (unpacked.PRICE) {
        const pair = `${unpacked.FROMSYMBOL.toLowerCase()}/${unpacked.TOSYMBOL.toLowerCase()}`
        const price = parseFloat(unpacked.PRICE);

        updatePrice({ pair, price });
      }
    };

    subscribeTo(pairs, filterUpdates);
  }

  render() {
    const { prices } = PRICE_STORE;

    return(
      <div className="App">
        <Header />
        <div className="Page">
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
      </div>
    );
  }
}

export default easyComp(App);
