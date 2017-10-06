import { easyStore } from 'react-easy-state';

export default easyStore({
  prices: {},
  updatePrice (update) {
    const { pair, price } = update;
    const delta = (price - (this.prices[pair] ? this.prices[pair].price : 0));

    console.warn(`[DELTA] ${pair}:`, delta);

    this.prices[pair] = {
      delta,
      price,
    };
  }
});
