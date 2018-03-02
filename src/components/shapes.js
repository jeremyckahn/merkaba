import React from 'react';
import { DraggableCore } from 'react-draggable';
import { absolutizeCoordinates } from '../utils';

/**
 * @param {number} x
 * @param {number} y
 * @param {number} dx
 * @param {number} dy
 * @param {string} stroke
 * @param {string} fill
 * @param {number} strokeWidth
 * @param {string} className
 * @param {external:React.SyntheticEvent} handleShapeClick
 * @param {external:Draggable.DraggableEventHandler} handleShapeDragStart
 * @param {external:Draggable.DraggableEventHandler} handleShapeDrag
 * @param {external:Draggable.DraggableEventHandler} handleShapeDragStop
 */
export const Rect = ({
  x,
  y,
  dx,
  dy,
  stroke,
  fill,
  strokeWidth,
  className,
  handleShapeClick,
  handleShapeDragStart,
  handleShapeDrag,
  handleShapeDragStop,
}) =>
  <DraggableCore
    onStart={handleShapeDragStart}
    onDrag={handleShapeDrag}
    onStop={handleShapeDragStop}
  >
    <rect
      onClick={handleShapeClick}
      {...Object.assign({
        stroke,
        fill,
        strokeWidth,
        className,
      }, absolutizeCoordinates(
        x,
        y,
        dx,
        dy
      ))}
    />
  </DraggableCore>
