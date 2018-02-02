import React from 'react';
import { Icon } from './icon';
import { selectedToolType } from '../enums';

/**
 * @class merkaba.Toolbar
 * @param {merkaba.module:enums.selectedToolType} selectedTool
 */
export const Toolbar = ({
  selectedTool
}) =>
  <div className="fill toolbar">
    <ul>
      <li>
        <button className={selectedTool === selectedToolType.RECTANGLE ? 'active' : ''}>
          <Icon type="stop"/>
        </button>
      </li>
    </ul>
  </div>
