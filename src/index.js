import './styles/index.sass';

/**
 * @namespace merkaba
 */

/**
 * @typedef merkaba.svgShape
 * @type {Object}
 * @property {merkaba.module:enums.shapeType} type
 */

/**
 * @typedef merkaba.svgRect
 * @see https://www.w3.org/TR/SVG/shapes.html#InterfaceSVGRectElement
 * @type {merkaba.svgShape}
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {null|number} rx
 * @property {null|number} ry
 * @property {null|string} stroke
 * @property {null|number} strokeWidth
 * @property {null|string} fill
 */

export { Merkaba } from './components/merkaba';
