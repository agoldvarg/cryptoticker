import { easyStore } from 'react-easy-state';

export default easyStore({
  prices: {},
  updatePrice (update) {
    this.prices[update.pair] = update.price;
  }
});
