import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const Layer = ({
  className,
  handleLayerClick,
  shape: { fill, type },
  shapeIndex,
}) => (
  <li
    {...{
      className,
      onClick: () => handleLayerClick(shapeIndex),
      style: { borderLeftColor: fill },
    }}
  >{`${shapeIndex + 1}: ${type}`}</li>
);
const SortableLayer = SortableElement(Layer);

/**
 * @class merkaba.SortableLayers
 * @param {Array.<merkaba.svgShape>} bufferShapes
 * @param {Array.<number>} focusedShapeBufferIndices
 * @param {Function} handleLayerClick
 */
const Layers = ({
  bufferShapes = [],
  bufferShapesLength = bufferShapes.length,
  focusedShapeBufferIndices = [],
  focusedShapeBufferIndex = focusedShapeBufferIndices[0],
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
              ~focusedShapeBufferIndices.indexOf(bufferShapesLength - 1 - i)
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
