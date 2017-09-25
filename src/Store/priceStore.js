import { easyStore } from 'react-easy-state';

export default easyStore({
  prices: {},
  updatePrice (update) {
    const { pair, price } = update;
    const delta = (price - (this.prices[pair] ? this.prices[pair].price : 0)).toFixed(2);

    this.prices[pair] = {
      delta,
      price: price.toFixed(2),
    };
  }
});
