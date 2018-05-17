import { Matrix } from 'transformation-matrix-js';
import {
  applyToPoint,
  rotateDEG,
  transform,
  translate,
  scale,
} from 'transformation-matrix';

// TODO: Update file to use these aliases
const { cos, sin, min, max, sqrt, atan2, round, PI } = Math;

const degToRadian = deg => deg * PI / 180;

/**
 * @method merkaba.utils#absolutizeCoordinates
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @return { x: number, y: number, width: number, height: number }
 */
export const absolutizeCoordinates = (x1, y1, x2, y2) => ({
  x: x1 + Math.min(x2, 0),
  y: y1 + Math.min(y2, 0),
  width: Math.abs(x2),
  height: Math.abs(y2),
});

/**
 * @method merkaba.utils#computeMidDragTransform
 * @param {merkaba.svgShape} shapeData
 * @param {string} draggedHandleOrientation
 * @param {number} dragDeltaX
 * @param {number} dragDeltaY
 * @return { rotate: number, originX: number, originY: number, scaleX: number, scaleY: number, transformX: number, transformY: number}
 */
const computeMidDragTransform = (
  {
    // Shape data
    x,
    y,
    width,
    height,
    rotate,
  },
  draggedHandleOrientation,
  dragDeltaX,
  dragDeltaY
) => {
  // This logic is adapted from SVG-Edit:
  // https://github.com/SVG-Edit/svgedit/blob/396cce40ebfde03f7245c682041f63f07f69e3d3/editor/svgcanvas.js#L1648-L1737

  if (rotate) {
    const radians = Math.sqrt(
      dragDeltaX * dragDeltaX + dragDeltaY * dragDeltaY
    );
    const theta = Math.atan2(dragDeltaY, dragDeltaX) - rotate * Math.PI / 180;
    dragDeltaX = radians * Math.cos(theta);
    dragDeltaY = radians * Math.sin(theta);
  }

  let transformX = 0;
  let transformY = 0;
  let scaleX = width ? (width + dragDeltaX) / width : 1;
  let scaleY = height ? (height + dragDeltaY) / height : 1;

  if (draggedHandleOrientation.match(/top/)) {
    scaleY = height ? (height - dragDeltaY) / height : 1;
    transformY = height;
  }

  if (draggedHandleOrientation.match(/left/)) {
    scaleX = width ? (width - dragDeltaX) / width : 1;
    transformX = width;
  }

  return {
    rotate,
    originX: x + width / 2,
    originY: y + height / 2,
    scaleX,
    scaleY,
    transformX: transformX + x,
    transformY: transformY + y,
  };
};

/**
 * @param {merkaba.svgShape} shapeData
 * @param {string} draggedHandleOrientation
 * @param {number} dragDeltaX
 * @param {number} dragDeltaY
 * @return {Matrix}
 */
export const computeMidDragMatrix = function(
  shapeData,
  draggedHandleOrientation,
  dragDeltaX,
  dragDeltaY
) {
  const {
    rotate,
    originX,
    originY,
    scaleX,
    scaleY,
    transformX,
    transformY,
  } = computeMidDragTransform(...arguments);

  return Matrix.from(
    transform([
      rotateDEG(rotate, originX, originY),
      translate(transformX, transformY),
      scale(scaleX, scaleY),
      translate(-transformX, -transformY),
    ])
  );
};

/**
 * @param {Object} config
 * @param {number} config.rotate
 * @param {number} config.x
 * @param {number} config.y
 * @param {number} config.height
 * @param {number} config.width
 * @return {Object}
 */
export const computeUnrotatedBoundingBox = ({
  rotate,
  height,
  width,
  x,
  y,
}) => {
  // Port of https://github.com/SVG-Edit/svgedit/blob/b84f776816bbb0eaa711862300e245de01fe8e58/editor/svgcanvas.js#L643-L671

  if (rotate % 90 === 0) {
    return { x, y, height, width };
  }

  const angle = degToRadian(rotate);
  const { MAX_VALUE, MIN_VALUE } = Number;
  let rMinX = MAX_VALUE;
  let rMinY = MAX_VALUE;
  let rMaxX = MIN_VALUE;
  let rMaxY = MIN_VALUE;

  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const pts = [
    [x - centerX, y - centerY],
    [x + width - centerX, y - centerY],
    [x + width - centerX, y + height - centerY],
    [x - centerX, y + height - centerY],
  ];

  let i = 4;
  while (i--) {
    let x = pts[i][0];
    let y = pts[i][1];
    const r = sqrt(x * x + y * y);
    const theta = atan2(y, x) + angle;
    x = r * cos(theta) + centerX;
    y = r * sin(theta) + centerY;

    rMinX = min(x, rMinX);
    rMinY = min(y, rMinY);
    rMaxX = max(x, rMaxX);
    rMaxY = max(y, rMaxY);
  }

  return {
    x: round(rMinX),
    y: round(rMinY),
    width: round(rMaxX - rMinX),
    height: round(rMaxY - rMinY),
  };
};

// Port of https://github.com/SVG-Edit/svgedit/blob/b84f776816bbb0eaa711862300e245de01fe8e58/editor/math.js#L212-L223
export const doRectsIntersect = (rect1, rect2) =>
  rect2.x < rect1.x + rect1.width &&
  rect2.x + rect2.width > rect1.x &&
  rect2.y < rect1.y + rect1.height &&
  rect2.y + rect2.height > rect1.y;
