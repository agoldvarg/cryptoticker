import React from 'react';
import { easyComp } from 'react-easy-state';
import classnames from 'classnames';

const Button = ({ children = null, onClick = null, primary = false }) =>
  <div className={
    classnames(
      'Button',
      'Button--primary': primary,
    )}
    onClick={onClick}
  >
    {children}
  </div>

export default easyComp(Button);
