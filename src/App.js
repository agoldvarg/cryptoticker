import React, { Component } from 'react';
import { easyComp } from 'react-easy-state';

// Choose cryptocompare or gemini as your data source
import { subscribeTo, unsubscribe } from './Services/cryptocompareService';
// import { subscribeTo, unsubscribe } from './Services/geminiService';

import FlipMove from 'react-flip-move';
import Card from './Components/Card/Card.jsx';
import Currency from './Components/Currency/Currency.jsx';

import PRICE_STORE from './Stores/priceStore';

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
