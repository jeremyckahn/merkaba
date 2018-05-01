import React from 'react';
import { DraggableCore } from 'react-draggable';
import { absolutizeCoordinates } from '../utils';

/**
 * @param {number} x
 * @param {number} y
 * @param {number} dx
 * @param {number} dy
 * @param {number} rotate
 * @param {string} stroke
 * @param {string} fill
 * @param {number} strokeWidth
 * @param {string} className
 * @param {number} bufferIndex
 * @param {Function(external:React.SyntheticEvent)} handleShapeClick
 */
export const Rect = ({
  x,
  y,
  dx,
  dy,
  rotate = 0,
  stroke,
  fill,
  strokeWidth,
  className,
  bufferIndex,
  handleShapeClick,
}) =>
  <rect
    onClick={handleShapeClick}
    {...Object.assign({
      className,
      'data-buffer-index': bufferIndex,
      fill,
      stroke,
      strokeWidth,
      transform: `rotate(${rotate} ${x + (dx / 2)} ${y + (dy / 2)})`,
    }, absolutizeCoordinates(
      x,
      y,
      dx,
      dy
    ))}
  />
