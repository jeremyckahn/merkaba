import React from 'react';
import { Icon } from './icon';
import { selectedToolType } from '../enums';

/**
 * @class merkaba.Toolbar
 * @param {merkaba.module:enums.selectedToolType} selectedTool
 * @param {merkaba.Merkaba#handleToolClick} handleToolClick
 */
export const Toolbar = ({ selectedTool, handleToolClick }) => (
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
