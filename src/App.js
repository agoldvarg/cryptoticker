import React, { Component } from 'react';
import io from 'socket.io-client';
import { easyComp } from 'react-easy-state';


import FlipMove from 'react-flip-move';
import Card from './Components/Card/Card.jsx';
import Currency from './Components/Currency/Currency.jsx';

import PRICE_STORE from './Store/priceStore';

import './App.css';

const FIELDS = {
  'TYPE': 0x0       // hex for binary 0, it is a special case of fields that are always there
  , 'MARKET': 0x0       // hex for binary 0, it is a special case of fields that are always there
  , 'FROMSYMBOL': 0x0       // hex for binary 0, it is a special case of fields that are always there
  , 'TOSYMBOL': 0x0       // hex for binary 0, it is a special case of fields that are always there
  , 'FLAGS': 0x0       // hex for binary 0, it is a special case of fields that are always there
  , 'PRICE': 0x1       // hex for binary 1
  , 'BID': 0x2       // hex for binary 10
  , 'OFFER': 0x4       // hex for binary 100
  , 'LASTUPDATE': 0x8       // hex for binary 1000
  , 'AVG': 0x10      // hex for binary 10000
  , 'LASTVOLUME': 0x20      // hex for binary 100000
  , 'LASTVOLUMETO': 0x40      // hex for binary 1000000
  , 'LASTTRADEID': 0x80      // hex for binary 10000000
  , 'VOLUMEHOUR': 0x100     // hex for binary 100000000
  , 'VOLUMEHOURTO': 0x200     // hex for binary 1000000000
  , 'VOLUME24HOUR': 0x400     // hex for binary 10000000000
  , 'VOLUME24HOURTO': 0x800     // hex for binary 100000000000
  , 'OPENHOUR': 0x1000    // hex for binary 1000000000000
  , 'HIGHHOUR': 0x2000    // hex for binary 10000000000000
  , 'LOWHOUR': 0x4000    // hex for binary 100000000000000
  , 'OPEN24HOUR': 0x8000    // hex for binary 1000000000000000
  , 'HIGH24HOUR': 0x10000   // hex for binary 10000000000000000
  , 'LOW24HOUR': 0x20000   // hex for binary 100000000000000000
  , 'LASTMARKET': 0x40000   // hex for binary 1000000000000000000, this is a special case and will only appear on CCCAGG messages
};

const unpack = (value) => {
  const valuesArray = value.split("~");
  const valuesArrayLenght = valuesArray.length;
  const mask = valuesArray[valuesArrayLenght-1];
  const maskInt = parseInt(mask,16);
  const unpackedCurrent = {};
  let currentField = 0;
  for(let property in FIELDS)
  {
      if(FIELDS[property] === 0)
      {
          unpackedCurrent[property] = valuesArray[currentField];
          currentField++;
      }
      else if(maskInt&FIELDS[property])
      {
    //i know this is a hack, for cccagg, future code please don't hate me:(, i did this to avoid
    //subscribing to trades as well in order to show the last market
        if(property === 'LASTMARKET'){
              unpackedCurrent[property] = valuesArray[currentField];
          }else{
                unpackedCurrent[property] = parseFloat(valuesArray[currentField]);
          }
          currentField++;
      }
  }

  return unpackedCurrent;
}

class App extends Component {
  constructor() {
    super();

    // this.sockets = this.initSockets('eth/usd', 'btc/usd');

    this.socket = io.connect('wss://streamer.cryptocompare.com');
    this.subscribe('btc/usd', 'eth/usd', 'omg/usd');
  }

  componentWillUnmount() {
    Object.keys(this.sockets).forEach(key =>
      this.sockets[key].close());
  }

  subscribe(...pairs) {
    const { updatePrice } = PRICE_STORE;

    const subs = pairs.map(pair =>
      `5~CCCAGG~${pair.split('/')[0].toUpperCase()}~${pair.split('/')[1].toUpperCase()}`);

    this.socket.emit('SubAdd', { subs });
    this.socket.on('m', msg => {
      const messageType = msg.substring(0, msg.indexOf('~'));

      if (messageType === '5') {
        const update = unpack(msg);

        if (update.PRICE) {
          const pair = `${update.FROMSYMBOL.toLowerCase()}/${update.TOSYMBOL.toLowerCase()}`

          updatePrice({
            pair,
            price: parseFloat(update.PRICE),
          });
        }
      }
    });
  }

  // initSockets(...pairs) {
  //   const { updatePrice, prices } = PRICE_STORE;
  //   return pairs.reduce((sockets, pair) => {
  //     sockets[pair] = new WebSocket(`wss://api.gemini.com/v1/marketdata/${pair.replace('/', '')}`);

  //     sockets[pair].onmessage = evt => {
  //       const events = JSON.parse(evt.data).events
  //       const trades = events.filter(event => event.type === 'trade');
  //       const prevPrice = prices[pair];

  //       const BOGUS_PRICE = '0.01';
  //       let price = BOGUS_PRICE;

  //       if (!prevPrice) {
  //         price = events[0].price;
  //       }

  //       if (trades.length) {
  //         price = trades[0].price
  //       }

  //       if (price !== BOGUS_PRICE) {
  //         updatePrice({
  //           pair,
  //           price: parseFloat(price)
  //         });
  //       }
  //     }

  //     return sockets;
  //   }, {});
  // }

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
