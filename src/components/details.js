import React, { Component } from 'react';
import { shapeType } from '../enums';

const RectUI = ({
  handlePropertyChange,
  rect: {
    x,
    y,
    width,
    height,
    strokeWidth,
  }
}) =>
  <div onChange={handlePropertyChange}>
    <label>
      <p>X:</p>
      <input name="x" defaultValue={x} />
    </label>
    <label>
      <p>Y:</p>
      <input name="y" defaultValue={y} />
    </label>
    <label>
      <p>Width:</p>
      <input name="width" defaultValue={width} />
    </label>
    <label>
      <p>Height:</p>
      <input name="height" defaultValue={height} />
    </label>
    <label>
      <p>Stroke Width:</p>
      <input name="strokeWidth" defaultValue={strokeWidth} />
    </label>
  </div>

/**
 * @class merkaba.Details
 * @param {merkaba.svgShape} focusedShape
 */
export const Details = ({
  focusedShape = {},
  handlePropertyChange
}) =>
  <div className="fill details">
    {focusedShape.type === shapeType.RECT ?
      <RectUI {...{ rect: focusedShape, handlePropertyChange }} />
    : null}
  </div>
