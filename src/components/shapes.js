import React from 'react';
import { DraggableCore } from 'react-draggable';
import { absolutizeCoordinates } from '../utils';

/**
 * @param {number} bufferIndex
 * @param {string} className
 * @param {number} dx
 * @param {number} dy
 * @param {string} fill
 * @param {Function(external:React.SyntheticEvent)} handleShapeClick
 * @param {number} rotate
 * @param {string} stroke
 * @param {number} strokeWidth
 * @param {number} x
 * @param {number} y
 */
export const Rect = ({
  bufferIndex,
  className,
  dx,
  dy,
  fill,
  handleShapeClick,
  rotate = 0,
  stroke,
  strokeWidth,
  x,
  y,
}) => (
  <rect
    onClick={handleShapeClick}
    {...Object.assign(
      {
        className,
        'data-buffer-index': bufferIndex,
        fill,
        stroke,
        strokeWidth,
        transform: `rotate(${rotate} ${x + dx / 2} ${y + dy / 2})`,
      },
      absolutizeCoordinates(x, y, dx, dy)
    )}
  />
);
