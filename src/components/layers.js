import React from 'react';
import { array, func, number, object, shape, string } from 'prop-types';
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

Layer.propTypes = {
  bufferIndex: number.isRequired,
  className: string,
  handleDeleteShapeClick: func.isRequired,
  handleLayerClick: func.isRequired,
  shape: object.isRequired,
  layerIndex: number.isRequired,
};

/**
 * @function merkaba.SortableLayers
 * @param {Object} props
 * @returns {Element}
 */
const Layers = ({
  bufferShapes = [],
  bufferShapesLength = bufferShapes.length,
  focusedShapeCursor: { bufferIndices = [] },
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
              ~bufferIndices.indexOf(bufferShapesLength - 1 - i)
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

Layers.propTypes = {
  bufferShapes: array.isRequired,
  bufferShapesLength: number,
  focusedShapeCursor: shape({
    bufferIndices: array.isRequired,
  }).isRequired,
  handleDeleteShapeClick: func.isRequired,
  handleLayerClick: func.isRequired,
};

export const SortableLayers = SortableContainer(Layers);
