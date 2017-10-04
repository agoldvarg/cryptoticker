import React, { Component } from 'react';
import { easyComp } from 'react-easy-state';
import { subscribeTo, unsubscribe } from './Services/cryptocompareService';

import FlipMove from 'react-flip-move';
import Card from './Components/Card/Card.jsx';
import Currency from './Components/Currency/Currency.jsx';

import PRICE_STORE from './Stores/priceStore';

import './App.css';

const ROOT_CURRENCIES = ['eth', 'btc'];
const DEFAULT_PAIRS = ['btc/usd', 'eth/usd', 'omg/usd'];

class App extends Component {
  constructor() {
    super();

    this.store = {
      availablePairs: [],
    }

    // this.subscribe(DEFAULT_PAIRS);
    this.fetchTopPairsList();
  }

  componentWillUnmount() {
    DEFAULT_PAIRS.forEach(pair => unsubscribe(pair));
  }

  fetchTopPairsList() {
    ROOT_CURRENCIES.forEach(symbol => {
      fetch(`https://min-api.cryptocompare.com/data/top/pairs?fsym=${symbol.toUpperCase()}&limit=10`)
        .then(res => {
          if (!res.ok) {
            throw new Error();
          }

          return res.text()
        })
        .then(json => {
          const data = JSON.parse(json).Data;

          this.store.availablePairs = this.store.availablePairs
            .concat(Object.keys(data).map(key =>
              `${data[key].fromSymbol}/${data[key].toSymbol}`));
        });
    });
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
