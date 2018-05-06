import React from 'react';
import { Icon } from './icon';
import { selectedToolType } from '../enums';

/**
 * @class merkaba.Toolbar
 * @param {merkaba.Merkaba#handleToolClick} handleToolClick
 * @param {merkaba.module:enums.selectedToolType} selectedTool
 */
export const Toolbar = ({ handleToolClick, selectedTool }) => (
  <div className="fill toolbar">
    <ul>
      <li
        className={selectedTool === selectedToolType.RECTANGLE ? 'active' : ''}
      >
        <button onClick={() => handleToolClick(selectedToolType.RECTANGLE)}>
          <Icon type="stop" />
        </button>
      </li>
    </ul>
  </div>
);
