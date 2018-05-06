import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const Layer = ({ className, handleLayerClick, shape, shapeIndex }) => (
  <li
    {...{
      className,
      onClick: () => handleLayerClick(shapeIndex),
    }}
  >{`${shapeIndex + 1}: ${shape.type}`}</li>
);
const SortableLayer = SortableElement(Layer);

/**
 * @class merkaba.SortableLayers
 * @param {Array.<merkaba.svgShape>} bufferShapes
 * @param {number} focusedShapeBufferIndex
 * @param {Function} handleLayerClick
 */
const Layers = ({
  bufferShapes = [],
  bufferShapesLength = bufferShapes.length,
  focusedShapeBufferIndex,
  handleLayerClick,
}) => (
  <div className="layers">
    <ol>
      {bufferShapes
        .slice()
        .reverse()
        .map((bufferShape, i) => (
          <SortableLayer
            className={`merkaba-layer${
              focusedShapeBufferIndex !== null &&
              i === bufferShapesLength - 1 - focusedShapeBufferIndex
                ? ' focused'
                : ''
            }`}
            key={`shape-${i}`}
            index={i}
            shapeIndex={i}
            shape={bufferShape}
            handleLayerClick={handleLayerClick}
          />
        ))}
    </ol>
  </div>
);
export const SortableLayers = SortableContainer(Layers);
