import React from 'react';
import { func, string } from 'prop-types';
import { Icon } from './icon';
import { selectedToolType } from '../enums';

/**
 * @function merkaba.Toolbar
 * @param {Object} props
 * @returns {Element}
 */
export const Toolbar = ({ handleToolClick, selectedTool }) => (
  <div className="toolbar">
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

Toolbar.propTypes = {
  handleToolClick: func.isRequired,
  selectedTool: string.isRequired,
};
