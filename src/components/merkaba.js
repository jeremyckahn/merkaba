import React, { Component } from 'react';
import { Toolbar } from './toolbar';
import { Canvas } from './canvas';
import { Details } from './details';
import {
  selectedToolType,
  shapeFocusType,
  shapeType,
} from '../enums';
import { absolutizeCoordinates } from '../utils';
import eventHandlers from './merkaba.event-handlers';

/**
 * @typedef merkaba.focusedShapeCursor
 * @type {Object}
 * @property {merkaba.module:enums.shapeFocusType} shapeFocus
 * @property {number|null} bufferIndex If shapeFocus is
 * `shapeFocusType.BUFFER`, this is the index of the buffered shape to focus,
  * otherwise this is `null`.
 */

/**
 * @typedef merkaba.state
 * @type {Object}
 * @property {merkaba.module:enums.selectedToolType} selectedTool
 * @property {boolean} isDraggingTool
 * @property {boolean} isDraggingShape
 * @property {null|number} toolDragStartX
 * @property {null|number} toolDragStartY
 * @property {null|number} toolDragDeltaX
 * @property {null|number} toolDragDeltaY
 * @property {null|string} toolStrokeColor
 * @property {null|number} toolStrokeWidth
 * @property {null|string} toolFillColor
 * @property {Array.<merkaba.svgShape>} bufferShapes
 * @property {merkaba.focusedShapeCursor} focusedShapeCursor
 */

const { indexOf } = Array.prototype;
const emptyShape = { type: shapeType.NONE };

/**
 * @param {HTMLElement} el
 * @return {number}
 */
const getElementIndex = el => indexOf.call(el.parentElement.children, el);

/**
 * @class merkaba.Merkaba
 * @extends {external:React.Component}
 */
export class Merkaba extends Component {
  constructor () {
    super(...arguments);

    /**
     * @member merkaba.Merkaba#state
     * @type {merkaba.state}
     */
    this.state = {
      selectedTool: selectedToolType.NONE,
      isDraggingTool: false,
      isDraggingShape: false,
      toolDragStartX: null,
      toolDragStartY: null,
      toolDragDeltaX: null,
      toolDragDeltaY: null,
      toolStrokeColor: 'rgba(0, 0, 0, 1)',
      toolStrokeWidth: 0,
      toolFillColor: 'rgba(0, 0, 0, 1)',

      bufferShapes: [],
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.NONE,
        bufferIndex: null
      },
    };

    // Bind event handlers
    Object.keys(eventHandlers).forEach(
      method => this[method] = eventHandlers[method].bind(this)
    );
  }

  /**
   * @method merkaba.Merkaba#getFocusedShape
   * @return {merkaba.svgShape}
   */
  getFocusedShape () {
    const {
      bufferShapes,
      focusedShapeCursor: {
        shapeFocus,
        bufferIndex
      }
    } = this.state;
    const { NONE, LIVE } = shapeFocusType;

    return shapeFocus === NONE || shapeFocus === LIVE ?
      this.getLiveShape()
      : Object.assign({}, bufferShapes[bufferIndex] || emptyShape);
  }

  /**
   * @method merkaba.Merkaba#getLiveShape
   * @return {merkaba.svgShape}
   */
  getLiveShape () {
    const {
      selectedTool,
      toolDragStartX,
      toolDragStartY,
      toolDragDeltaX,
      toolDragDeltaY,
      toolStrokeColor,
      toolFillColor,
      toolStrokeWidth,
    } = this.state;

    if (toolDragStartX !== null) {
      if (selectedTool === selectedToolType.RECTANGLE) {
        return Object.assign({
          type: shapeType.RECT,
          stroke: toolStrokeColor,
          fill: toolFillColor,
          strokeWidth: toolStrokeWidth,
        }, absolutizeCoordinates(
          toolDragStartX,
          toolDragStartY,
          toolDragDeltaX,
          toolDragDeltaY
        ));
      }
    }

    return Object.assign({}, emptyShape);
  }

  /**
   * @method merkaba.Merkaba#focusBufferShape
   * @param {SVGElement} shapeEl
   */
  focusBufferShape (shapeEl) {
    this.setState({
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.BUFFER,
        bufferIndex: getElementIndex(shapeEl)
      }
    });
  }

  /**
   * @method merkaba.Merkaba#updateBufferShapeProperty
   * @param {number} bufferIndex
   * @param {string} name
   * @param {*} value
   */
  updateBufferShapeProperty (bufferIndex, name, value) {
    const { bufferShapes, } = this.state;

    const shape = Object.assign({}, bufferShapes[bufferIndex]);
    shape[name] = value;

    const newBuffer = bufferShapes.slice();
    newBuffer[bufferIndex] = shape;

    this.setState({ bufferShapes: newBuffer });
  }

  render () {
    const {
      state: {
        isDraggingTool,
        selectedTool,
        toolDragStartX,
        toolDragStartY,
        toolDragDeltaX,
        toolDragDeltaY,
        toolStrokeColor,
        toolStrokeWidth,
        toolFillColor,
        bufferShapes,
      },
      handleToolClick,
      handleCanvasDragStart,
      handleCanvasDrag,
      handleCanvasDragStop,
      handlePropertyChange,
      handleColorPropertyChange,
      handleShapeClick,
      handleShapeDragStart,
      handleShapeDrag,
      handleShapeDragStop,
    } = this;

    const focusedShape = this.getFocusedShape();

    return (
      <div className="fill merkaba">
        <Toolbar
          {...{
            handleToolClick,
            selectedTool
          }}
        />
        <Canvas
          {...{
            handleCanvasDragStart,
            handleCanvasDrag,
            handleCanvasDragStop,
            handleShapeClick,
            handleShapeDragStart,
            handleShapeDrag,
            handleShapeDragStop,
            isDraggingTool,
            selectedTool,
            toolDragStartX,
            toolDragStartY,
            toolDragDeltaX,
            toolDragDeltaY,
            toolStrokeColor,
            toolStrokeWidth,
            toolFillColor,
            bufferShapes,
            focusedShape,
          }}
        />
        <Details
          {...{
            handlePropertyChange,
            handleColorPropertyChange,
            focusedShape,
          }}
        />
      </div>
    );
  }
}
