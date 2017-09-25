import React, { Component } from 'react';
import { easyComp } from 'react-easy-state';

import Button from '../Button/Button';

class PortfolioPage extends Component {
  render() {
    return (
      <div className="Page Page--Portfolio">
        <Button>Add Coin</Button>
      </div>
    );
  }
}

export default easyComp(PortfolioPage);
