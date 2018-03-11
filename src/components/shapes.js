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
 * @param {number} bufferIndex
 * @param {Function(external:React.SyntheticEvent)} handleShapeClick
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
  bufferIndex,
  handleShapeClick,
}) =>
  <rect
    onClick={handleShapeClick}
    {...Object.assign({
      stroke,
      fill,
      strokeWidth,
      className,
      'data-buffer-index': bufferIndex,
    }, absolutizeCoordinates(
      x,
      y,
      dx,
      dy
    ))}
  />
