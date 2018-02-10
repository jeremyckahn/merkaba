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
 * @property {number} rx
 * @property {number} ry
 */

export { Merkaba } from './components/merkaba';
