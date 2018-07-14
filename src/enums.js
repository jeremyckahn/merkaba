/**
 * @module merkaba.enums
 */

/**
 * @param {Array.<string>} keys
 * @returns {Object.<string>}
 */
const enumify = keys =>
  keys.reduce((acc, key) => Object.assign(acc, { [key]: key }), {});

/**
 * @property merkaba.module:enums.selectedToolType
 * @enum {string}
 */
export const selectedToolType = enumify([
  'SELECT',
  'NONE', // strictly for testing
  'RECTANGLE',
]);

/**
 * Values in this enum correspond to standard SVG shape names:
 * https://www.w3.org/TR/SVG/shapes.html
 * @property merkaba.module:enums.shapeType
 * @enum {string}
 */
export const shapeType = {
  NONE: 'none',
  RECT: 'rect',
};

/**
 * @property merkaba.module:enums.shapeFocusType
 * @enum {string}
 */
export const shapeFocusType = enumify(['NONE', 'LIVE', 'BUFFER']);
