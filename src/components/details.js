import React, { Component } from 'react';
import { selectedToolType } from '../enums';

const RectUI = ({
}) =>
  <div>
    <label>
      <p>X:</p>
      <input name="x"/>
    </label>
    <label>
      <p>Y:</p>
      <input name="y"/>
    </label>
    <label>
      <p>Width:</p>
      <input name="width"/>
    </label>
    <label>
      <p>Height:</p>
      <input name="height"/>
    </label>
    <label>
      <p>Stroke Width:</p>
      <input name="strokeWidth"/>
    </label>
    <label>
      <p>Fill:</p>
      <input name="fill"/>
    </label>
  </div>

/**
 * @class merkaba.Details
 * @param {merkaba.module:enums.selectedToolType} selectedTool
 */
export const Details = ({
  selectedTool
}) =>
  <div className="fill details">
    {selectedTool === selectedToolType.RECTANGLE ?
      <RectUI />
    : null}
  </div>
