/**
 * @module merkaba.enums
 */

/**
 * @param {Array.<string>} keys
 * @return {Object.<string>}
 */
const enumify = keys => keys.reduce((acc, key) =>
  Object.assign(acc, { [key]: key }),
  {}
);

/**
 * @property merkaba.module:enums.selectedToolType
 * @enum {string}
 */
export const selectedToolType = enumify([
  'NONE',
  'RECTANGLE',
]);

/**
 * Values in this enum correspond to standard SVG shape names:
 * https://www.w3.org/TR/SVG/shapes.html
 * @property merkaba.module:enums.shapeType
 * @enum {string}
 */
export const shapeType = {
  RECT: 'rect'
};

/**
 * @property merkaba.module:enums.shapeFocusType
 * @enum {string}
 */
export const shapeFocusType = enumify([
  'NONE',
  'LIVE',
  'BUFFER',
]);
