import React, { Component } from 'react';
import { selectedToolType } from '../enums';

/**
 * @class merkaba.Toolbar
 * @param {merkaba.module:enums.selectedToolType} selectedTool
 * @extends {external:React.Component}
 */
export const Toolbar = ({
  selectedTool
}) =>
  <div className="fill toolbar">
    <ul>
      <li>
        <button className={`glyphicon glyphicon-stop${selectedTool === selectedToolType.RECTANGLE ? ' active' : ''}`} />
      </li>
    </ul>
  </div>
