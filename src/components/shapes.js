import React from 'react';

/**
 * @param {number} x
 * @param {number} y
 * @param {number} dx
 * @param {number} dy
 * @param {string} stroke
 * @param {string} fill
 * @param {number} strokeWidth
 * @param {string} className
 */
export const Rect = ({
  x, y, dx, dy, stroke, fill, strokeWidth, className
}) =>
  <rect
    x={x + Math.min(dx, 0)}
    y={y + Math.min(dy, 0)}
    width={Math.abs(dx)}
    height={Math.abs(dy)}
    stroke={stroke}
    fill={fill}
    strokeWidth={strokeWidth}
    className={className}
  />
