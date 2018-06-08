import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Icon } from './icon';

const Layer = ({
  bufferIndex,
  className,
  handleDeleteShapeClick,
  handleLayerClick,
  shape: { fill, type },
  layerIndex,
}) => (
  <li
    {...{
      className,
      onClick: () => handleLayerClick(layerIndex),
      style: { borderLeftColor: fill },
    }}
  >
    <label>{`${layerIndex + 1}: ${type}`}</label>
    <button
      className="delete"
      onClick={() => handleDeleteShapeClick(bufferIndex)}
    >
      <Icon type="remove" />
    </button>
  </li>
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
  handleDeleteShapeClick,
  handleLayerClick,
}) => (
  <div className="layers">
    <ol>
      {bufferShapes
        .slice()
        .reverse()
        .map((bufferShape, i) => (
          <SortableLayer
            bufferIndex={bufferShapesLength - 1 - i}
            className={`merkaba-layer${
              ~focusedShapeBufferIndices.indexOf(bufferShapesLength - 1 - i)
                ? ' focused'
                : ''
            }`}
            key={`shape-${i}`}
            index={i}
            layerIndex={i}
            shape={bufferShape}
            handleDeleteShapeClick={handleDeleteShapeClick}
            handleLayerClick={handleLayerClick}
          />
        ))}
    </ol>
  </div>
);
export const SortableLayers = SortableContainer(Layers);
