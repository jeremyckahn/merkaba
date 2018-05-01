import { Matrix } from 'transformation-matrix-js';
import {
  applyToPoint,
  rotateDEG,
  transform,
  translate,
  scale,
} from 'transformation-matrix';

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
