import { shapeType } from '../src/enums';

export const sampleRect = (props = {}) =>
  Object.assign(props, {
    type: shapeType.RECT,
    x: 10,
    y: 15,
    width: 10,
    height: 10,
    rotate: 0,
    fill: null,
    stroke: null,
    strokeWidth: 1,
  });
