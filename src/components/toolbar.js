import React, { Component } from 'react';
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
          <i className="glyphicon glyphicon-stop" />
        </button>
      </li>
    </ul>
  </div>
