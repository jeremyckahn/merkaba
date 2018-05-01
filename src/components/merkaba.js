import React, { Component } from 'react';
import { Matrix } from 'transformation-matrix-js';
import {
  applyToPoint,
  inverse,
  rotateDEG,
  transform,
  translate,
  scale,
} from 'transformation-matrix';
import { Toolbar } from './toolbar';
import { Canvas } from './canvas';
import { Details } from './details';
import { selectedToolType, shapeFocusType, shapeType } from '../enums';
import { absolutizeCoordinates, computeMidDragMatrix } from '../utils';
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
 * @property {boolean} isDraggingSelectionHandle
 * @property {null|string} draggedHandleOrientation
 * @property {null|number} toolDragStartX
 * @property {null|number} toolDragStartY
 * @property {null|number} toolDragDeltaX
 * @property {null|number} toolDragDeltaY
 * @property {Object|merkaba.svgShape} shapeStateBeforeDragTransform
 * @property {null|number} selectionDragStartX
 * @property {null|number} selectionDragStartY
 * @property {null|number} selectionDragX
 * @property {null|number} selectionDragY
 * @property {Object} svgBoundingRect
 * @property {null|string} toolStrokeColor
 * @property {null|number} toolStrokeWidth
 * @property {null|string} toolFillColor
 * @property {Array.<merkaba.svgShape>} bufferShapes
 * @property {merkaba.focusedShapeCursor} focusedShapeCursor
 */

const { indexOf } = Array.prototype;
const emptyShape = { type: shapeType.NONE };

/**
 * @class merkaba.Merkaba
 * @extends {external:React.Component}
 */
export class Merkaba extends Component {
  constructor() {
    super(...arguments);

    /**
     * @member merkaba.Merkaba#state
     * @type {merkaba.state}
     */
    this.state = {
      selectedTool: selectedToolType.NONE,
      isDraggingTool: false,
      isDraggingShape: false,
      isDraggingSelectionHandle: false,
      isDraggingSelectionRotator: false,
      draggedHandleOrientation: null,
      toolDragStartX: null,
      toolDragStartY: null,
      toolDragDeltaX: null,
      toolDragDeltaY: null,
      shapeStateBeforeDragTransform: {},
      selectionDragStartX: null,
      selectionDragStartY: null,
      selectionDragX: null,
      selectionDragY: null,
      svgBoundingRect: {},
      toolRotate: 0,
      toolStrokeColor: 'rgba(0, 0, 0, 1)',
      toolStrokeWidth: 0,
      toolFillColor: 'rgba(0, 0, 0, 1)',

      bufferShapes: [],
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.NONE,
        bufferIndex: null,
      },
    };

    // Bind event handlers
    Object.keys(eventHandlers).forEach(
      method => (this[method] = eventHandlers[method].bind(this))
    );
  }

  /**
   * @method merkaba.Merkaba#getFocusedShape
   * @return {merkaba.svgShape}
   */
  getFocusedShape() {
    const {
      bufferShapes,
      focusedShapeCursor: { shapeFocus, bufferIndex },
    } = this.state;
    const { NONE, LIVE } = shapeFocusType;

    return shapeFocus === NONE || shapeFocus === LIVE
      ? this.getLiveShape()
      : Object.assign({}, bufferShapes[bufferIndex] || emptyShape);
  }

  // FIXME: Test this function
  /**
   * @method merkaba.Merkaba#getLiveShape
   * @return {merkaba.svgShape}
   */
  getLiveShape() {
    const {
      selectedTool,
      toolDragStartX,
      toolDragStartY,
      toolDragDeltaX,
      toolDragDeltaY,
      toolRotate,
      toolStrokeColor,
      toolFillColor,
      toolStrokeWidth,
    } = this.state;

    if (toolDragStartX !== null) {
      if (selectedTool === selectedToolType.RECTANGLE) {
        return Object.assign(
          {
            type: shapeType.RECT,
            stroke: toolStrokeColor,
            fill: toolFillColor,
            rotate: toolRotate,
            strokeWidth: toolStrokeWidth,
          },
          absolutizeCoordinates(
            toolDragStartX,
            toolDragStartY,
            toolDragDeltaX,
            toolDragDeltaY
          )
        );
      }
    }

    return Object.assign({}, emptyShape);
  }

  /**
   * @method merkaba.Merkaba#getMidDragMatrix
   * @param {Object} config
   * @param {number} [config.rotationOffset=0]
   * @return {Matrix}
   */
  getMidDragMatrix({ rotationOffset = 0 } = {}) {
    const focusedShape = this.getFocusedShape();
    const { x, y, width, height } = focusedShape;
    const rotate = focusedShape.rotate + rotationOffset;
    const {
      draggedHandleOrientation,
      selectionDragX: rawSelectionDragX,
      selectionDragY: rawSelectionDragY,
      selectionDragStartX: rawSelectionDragStartX,
      selectionDragStartY: rawSelectionDragStartY,
    } = this.state;

    const { x: selectionDragStartX, y: selectionDragStartY } = applyToPoint(
      rotateDEG(rotationOffset),
      {
        x: rawSelectionDragStartX,
        y: rawSelectionDragStartY,
      }
    );

    const { x: selectionDragX, y: selectionDragY } = applyToPoint(
      rotateDEG(rotationOffset),
      {
        x: rawSelectionDragX || rawSelectionDragStartX,
        y: rawSelectionDragY || rawSelectionDragStartY,
      }
    );

    return computeMidDragMatrix(
      { x, y, width, height, rotate },
      draggedHandleOrientation,
      selectionDragX - selectionDragStartX,
      selectionDragY - selectionDragStartY
    );
  }

  /**
   * @method merkaba.Merkaba#getAggregateDragMatrix
   * @return {Matrix}
   */
  getAggregateDragMatrix() {
    // It would be ideal if this method only needed to call getMidDragMatrix
    // once (and if that method didn't need the rotationOffset option), but it
    // appears that it's all necessary to properly compute the new center
    // point.
    //
    // Perhaps somebody who is better at math can come along and simplify this!
    const { x, y, width, height, rotate } = this.getFocusedShape();

    const oldCenter = {
      x: x + width / 2,
      y: y + height / 2,
    };

    const newCenter = this.getMidDragMatrix().applyToPoint(
      oldCenter.x,
      oldCenter.y
    );

    // Logic taken from
    // https://github.com/SVG-Edit/svgedit/blob/396cce40ebfde03f7245c682041f63f07f69e3d3/editor/recalculate.js#L790-L800
    return Matrix.from(
      transform(
        inverse(rotateDEG(rotate, newCenter.x, newCenter.y)),
        rotateDEG(rotate, oldCenter.x, oldCenter.y),
        this.getMidDragMatrix({
          rotationOffset: -rotate,
        })
      )
    );
  }

  /**
   * @method merkaba.Merkaba#applyMatrixToFocusedShape
   * @param {Matrix} matrix
   */
  applyMatrixToFocusedShape(matrix) {
    const { x, y, width, height } = this.getFocusedShape();

    // Adapted from
    // https://github.com/SVG-Edit/svgedit/blob/396cce40ebfde03f7245c682041f63f07f69e3d3/editor/coords.js#L139-L145
    const point = matrix.applyToPoint(x, y);
    const scaledWidth = matrix.a * width;
    const scaledHeight = matrix.d * height;
    const scaledX = point.x + Math.min(0, scaledWidth);
    const scaledY = point.y + Math.min(0, scaledHeight);
    const absoluteWidth = Math.abs(scaledWidth);
    const absoluteHeight = Math.abs(scaledHeight);

    this.updateFocusedBufferShape({
      x: scaledX,
      y: scaledY,
      width: absoluteWidth,
      height: absoluteHeight,
    });
  }

  /**
   * @method merkaba.Merkaba#focusBufferShape
   * @param {SVGElement} shapeEl
   */
  focusBufferShape(shapeEl) {
    this.setState({
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.BUFFER,
        bufferIndex: +shapeEl.getAttribute('data-buffer-index'),
      },
    });
  }

  /**
   * @method merkaba.Merkaba#updateBufferShape
   * @param {number} shapeIndex
   * @param {Object.<any>} newShapeData Any properties to update the buffered
   * shape with.
   */
  updateBufferShape(shapeIndex, newShapeData) {
    const { bufferShapes } = this.state;
    const modifiedBuffer = bufferShapes.slice();
    modifiedBuffer[shapeIndex] = Object.assign(
      {},
      this.getFocusedShape(),
      newShapeData
    );

    this.setState({ bufferShapes: modifiedBuffer });
  }

  /**
   * @method merkaba.Merkaba#updateFocusedBufferShape
   * @param {Object.<any>} newShapeData Any properties to update the buffered
   * shape with.
   */
  updateFocusedBufferShape(newShapeData) {
    this.updateBufferShape(
      this.state.focusedShapeCursor.bufferIndex,
      newShapeData
    );
  }

  /**
   * @method merkaba.Merkaba#updateBufferShapeProperty
   * @param {number} bufferIndex
   * @param {string} name
   * @param {*} value
   */
  updateBufferShapeProperty(bufferIndex, name, value) {
    const { bufferShapes } = this.state;

    const shape = Object.assign({}, bufferShapes[bufferIndex]);
    shape[name] = value;

    const newBuffer = bufferShapes.slice();
    newBuffer[bufferIndex] = shape;

    this.setState({ bufferShapes: newBuffer });
  }

  /**
   * @method merkaba.Merkaba#updateFocusedBufferShapeProperty
   * @param {string} name
   * @param {*} value
   */
  updateFocusedBufferShapeProperty(name, value) {
    this.updateBufferShapeProperty(
      this.state.focusedShapeCursor.bufferIndex,
      name,
      value
    );
  }

  render() {
    const {
      state: {
        isDraggingTool,
        draggedHandleOrientation,
        selectedTool,
        toolDragStartX,
        toolDragStartY,
        toolDragDeltaX,
        toolDragDeltaY,
        toolRotate,
        toolStrokeColor,
        toolStrokeWidth,
        toolFillColor,
        bufferShapes,
        selectionDragStartX,
        selectionDragStartY,
        selectionDragX,
        selectionDragY,
        focusedShapeCursor: { bufferIndex: focusedShapeBufferIndex },
      },
      handleToolClick,
      handleCanvasMouseDown,
      handleCanvasDragStart,
      handleCanvasDrag,
      handleCanvasDragStop,
      handlePropertyChange,
      handleColorPropertyChange,
      handleShapeClick,
    } = this;

    const focusedShape = this.getFocusedShape();

    return (
      <div className="fill merkaba">
        <Toolbar
          {...{
            handleToolClick,
            selectedTool,
          }}
        />
        <Canvas
          {...{
            handleCanvasMouseDown,
            handleCanvasDragStart,
            handleCanvasDrag,
            handleCanvasDragStop,
            handleShapeClick,
            isDraggingTool,
            draggedHandleOrientation,
            selectedTool,
            toolDragStartX,
            toolDragStartY,
            toolDragDeltaX,
            toolDragDeltaY,
            toolRotate,
            toolStrokeColor,
            toolStrokeWidth,
            toolFillColor,
            bufferShapes,
            focusedShape,
            selectionDragStartX,
            selectionDragStartY,
            selectionDragX,
            selectionDragY,
            focusedShapeBufferIndex,
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
