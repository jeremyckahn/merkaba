import React from 'react';
import { number, string } from 'prop-types';
import { absolutizeCoordinates } from '../utils';

/**
 * @function merkaba.Rect
 * @param {Object} props
 * @returns {Element}
 */
export const Rect = ({
  bufferIndex,
  className,
  dx,
  dy,
  fill,
  rotate = 0,
  stroke,
  strokeWidth,
  x,
  y,
}) => (
  <rect
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

Rect.propTypes = {
  bufferIndex: number,
  className: string,
  dx: number.isRequired,
  dy: number.isRequired,
  fill: string,
  rotate: number,
  stroke: string,
  strokeWidth: number,
  x: number.isRequired,
  y: number.isRequired,
};
