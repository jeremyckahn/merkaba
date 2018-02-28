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
  <div>
    <label>
      <p>X:</p>
      <input
        name="x"
        value={x}
        type="number"
        onChange={handlePropertyChange}
      />
    </label>
    <label>
      <p>Y:</p>
      <input
        name="y"
        value={y}
        type="number"
        onChange={handlePropertyChange}
      />
    </label>
    <label>
      <p>Width:</p>
      <input
        name="width"
        value={width}
        type="number"
        onChange={handlePropertyChange}
      />
    </label>
    <label>
      <p>Height:</p>
      <input
        name="height"
        value={height}
        type="number"
        onChange={handlePropertyChange}
      />
    </label>
    <label>
      <p>Stroke Width:</p>
      <input
        name="strokeWidth"
        value={strokeWidth}
        type="number"
        onChange={handlePropertyChange}
      />
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
      <RectUI {...{
        rect: focusedShape,
        handlePropertyChange
      }} />
    : null}
  </div>
