const UNSUBSCRIBE = [];

/**
 * @param  {Array} pairs - array of currency pairs as strings e.g. ['ETH/USD', 'btc/usd']
 */
const subscribeTo = (pairs, callback) => {
  [...pairs].forEach(pair => {
    const socket = new WebSocket(`wss://api.gemini.com/v1/marketdata/${pair.replace('/', '')}`);

    UNSUBSCRIBE[pair] = () => socket.close();

    socket.onmessage = evt => {
      const events = JSON.parse(evt.data).events;
      const trades = events.filter(evt => evt.type === 'trade');

      if (!trades.length) {
        return;
      }

      callback({
        FROMSYMBOL: pair.split('/')[0],
        TOSYMBOL: pair.split('/')[1],
        PRICE: trades[0].price
      });
    }
  });
};

/**
 * @param  {String} pair - currency pair e.g. 'btc/usd'
 */
const unsubscribe = pair => UNSUBSCRIBE[pair] && UNSUBSCRIBE[pair]();

export { subscribeTo, unsubscribe };
