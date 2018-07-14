import React from 'react';
import { array, func, number, object } from 'prop-types';
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

RectUI.propTypes = {
  handlePropertyChange: func.isRequired,
  handleColorPropertyChange: func.isRequired,
  rect: object.isRequired,
};

/**
 * @function merkaba.Details
 * @param {Object} props
 * @returns {Element}
 */
export const Details = ({
  focusedShapes = [],
  focusedShape = focusedShapes[0],
  focusedShapesLength = focusedShapes.length,
  handleColorPropertyChange,
  handleDetailsInputFocus,
  handlePropertyChange,
}) => (
  <div className="details" onFocus={handleDetailsInputFocus}>
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

Details.propTypes = {
  focusedShapes: array.isRequired,
  focusedShape: object,
  focusedShapesLength: number,
  handleColorPropertyChange: func.isRequired,
  handleDetailsInputFocus: func.isRequired,
  handlePropertyChange: func.isRequired,
};
