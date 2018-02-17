import React, { Component } from 'react';
import { selectedToolType } from '../enums';

/**
 * @class merkaba.Details
 * @param {merkaba.module:enums.selectedToolType} selectedTool
 */
export const Details = ({
  selectedTool
}) =>
  <div className="fill details">
    {selectedTool === selectedToolType.RECTANGLE ?
      <div>
        <input name="x"/>
        <input name="y"/>
        <input name="width"/>
        <input name="height"/>
        <input name="strokeWidth"/>
        <input name="fill"/>
      </div>
    : null}
  </div>
