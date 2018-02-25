import React, { Component } from 'react';
import { shapeType } from '../enums';

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
 * @param {merkaba.svgShape} focusedShape
 */
export const Details = ({
  focusedShape = {}
}) =>
  <div className="fill details">
    {focusedShape.type === shapeType.RECT ?
      <RectUI />
    : null}
  </div>
