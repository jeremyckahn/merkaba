import React, { Component } from 'react';
import { ColorInput } from './color-input';
import { shapeType } from '../enums';

const RectUI = ({
  handlePropertyChange = () => {},
  handleColorPropertyChange = () => {},
  rect: { x, y, width, height, rotate, strokeWidth, stroke, fill },
}) => (
  <div>
    <label>
      <p>X:</p>
      <input name="x" value={x} type="number" onChange={handlePropertyChange} />
    </label>
    <label>
      <p>Y:</p>
      <input name="y" value={y} type="number" onChange={handlePropertyChange} />
    </label>
    <label>
      <p>Width:</p>
      <input
        name="width"
        onChange={handlePropertyChange}
        type="number"
        value={width}
      />
    </label>
    <label>
      <p>Height:</p>
      <input
        name="height"
        onChange={handlePropertyChange}
        type="number"
        value={height}
      />
    </label>
    <label>
      <p>Rotate:</p>
      <input
        name="rotate"
        onChange={handlePropertyChange}
        type="number"
        value={rotate}
      />
    </label>
    <label>
      <p>Fill Color:</p>
      <ColorInput
        handleColorPropertyChange={handleColorPropertyChange}
        handlePropertyChange={handlePropertyChange}
        name="fill"
        value={fill}
      />
    </label>
    <label>
      <p>Stroke Width:</p>
      <input
        name="strokeWidth"
        onChange={handlePropertyChange}
        type="number"
        value={strokeWidth}
      />
    </label>
    <label>
      <p>Stroke Color:</p>
      <ColorInput
        handleColorPropertyChange={handleColorPropertyChange}
        handlePropertyChange={handlePropertyChange}
        name="stroke"
        value={stroke}
      />
    </label>
  </div>
);

/**
 * @class merkaba.Details
 * @param {Array.<merkaba.svgShape>} focusedShapes
 */
export const Details = ({
  focusedShapes = [],
  focusedShape = focusedShapes[0],
  focusedShapesLength = focusedShapes.length,
  handleColorPropertyChange,
  handlePropertyChange,
}) => (
  <div className="details">
    {focusedShapesLength === 1 ? (
      focusedShape.type === shapeType.RECT ? (
        <RectUI
          {...{
            handleColorPropertyChange,
            handlePropertyChange,
            rect: focusedShape,
          }}
        />
      ) : null
    ) : null}
  </div>
);
