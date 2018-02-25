import React, { Component } from 'react';
import { shapeType } from '../enums';

const RectUI = ({
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
      <input name="x" value={x} onChange={() => {}}/>
    </label>
    <label>
      <p>Y:</p>
      <input name="y" value={y} onChange={() => {}}/>
    </label>
    <label>
      <p>Width:</p>
      <input name="width" value={width} onChange={() => {}}/>
    </label>
    <label>
      <p>Height:</p>
      <input name="height" value={height} onChange={() => {}}/>
    </label>
    <label>
      <p>Stroke Width:</p>
      <input name="strokeWidth" value={strokeWidth} onChange={() => {}}/>
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
      <RectUI rect={focusedShape} />
    : null}
  </div>
