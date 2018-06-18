import React, { Component } from 'react';
import { HotKeys } from 'react-hotkeys';
import { Matrix } from 'transformation-matrix-js';
import {
  applyToPoint,
  inverse,
  rotateDEG,
  scale,
  transform,
  translate,
} from 'transformation-matrix';
import { SortableLayers as Layers } from './layers';
import { Toolbar } from './toolbar';
import { Canvas } from './canvas';
import { Details } from './details';
import { selectedToolType, shapeFocusType, shapeType } from '../enums';
import {
  absolutizeCoordinates,
  computeMidDragMatrix,
  computeUnrotatedBoundingBox,
  doRectsIntersect,
} from '../utils';
import eventHandlers from './merkaba.event-handlers';

/**
 * @typedef merkaba.focusedShapeCursor
 * @type {Object}
 * @property {merkaba.module:enums.shapeFocusType} shapeFocus
 * @property {Array.<number>} bufferIndices If shapeFocus is
 * `shapeFocusType.BUFFER`, this is the index of the buffered shape to focus,
 * otherwise this is `null`.
 */

/**
 * @typedef merkaba.state
 * @type {Object}
 * @property {Array.<merkaba.svgShape>} bufferShapes
 * @property {null|string} draggedHandleOrientation
 * @property {merkaba.focusedShapeCursor} focusedShapeCursor
 * @property {boolean} isDraggingSelectionHandle
 * @property {boolean} isDraggingSelectionRotator
 * @property {boolean} isDraggingShape
 * @property {boolean} isDraggingTool
 * @property {merkaba.module:enums.selectedToolType} selectedTool
 * @property {null|number} transformDragStartX
 * @property {null|number} transformDragStartY
 * @property {null|number} transformDragX
 * @property {null|number} transformDragY
 * @property {Object|merkaba.svgShape} shapeStateBeforeDragTransform
 * @property {Object} svgBoundingRect
 * @property {null|number} toolDragDeltaX
 * @property {null|number} toolDragDeltaY
 * @property {null|number} toolDragStartX
 * @property {null|number} toolDragStartY
 * @property {null|string} toolFillColor
 * @property {null|string} toolStrokeColor
 * @property {null|number} toolStrokeWidth
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
      bufferShapes: [],
      draggedHandleOrientation: null,
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.NONE,
        bufferIndices: [],
      },
      isDraggingSelectionHandle: false,
      isDraggingSelectionRotator: false,
      isDraggingShape: false,
      isDraggingTool: false,
      selectedTool: selectedToolType.SELECT,
      transformDragStartX: null,
      transformDragStartY: null,
      transformDragX: null,
      transformDragY: null,
      shapeStateBeforeDragTransform: {},
      svgBoundingRect: {},
      toolDragDeltaX: null,
      toolDragDeltaY: null,
      toolDragStartX: null,
      toolDragStartY: null,
      toolFillColor: 'rgba(0, 0, 0, 1)',
      toolRotate: 0,
      toolStrokeColor: 'rgba(0, 0, 0, 1)',
      toolStrokeWidth: 0,
    };

    // Bind event handlers
    Object.keys(eventHandlers).forEach(
      method => (this[method] = eventHandlers[method].bind(this))
    );

    // TODO: Make this preventable via a prop
    this.initKeyHandlers();
  }

  initKeyHandlers() {
    const { handleToolClick } = this;
    const deleteFocusedShapes = this.deleteFocusedShapes.bind(this);

    this.keyMap = {
      deleteFocusedShape: ['del', 'backspace'],
      selectRectangleTool: 'r',
      selectSelectTool: 's',
    };
    this.keyHandlers = {
      deleteFocusedShape: () => deleteFocusedShapes(),
      selectRectangleTool: () => handleToolClick(selectedToolType.RECTANGLE),
      selectSelectTool: () => handleToolClick(selectedToolType.SELECT),
    };
  }

  /**
   * @method merkaba.Merkaba#getFocusedShapes
   * @return {Array.<merkaba.svgShape>}
   */
  getFocusedShapes() {
    const {
      bufferShapes,
      focusedShapeCursor: { shapeFocus, bufferIndices },
    } = this.state;

    const { NONE, LIVE } = shapeFocusType;

    return shapeFocus === NONE || shapeFocus === LIVE
      ? [this.getLiveShape()]
      : bufferIndices.map(bufferIndex =>
          Object.assign({}, bufferShapes[bufferIndex] || emptyShape)
        );
  }

  /**
   * @method merkaba.Merkaba#deleteFocusedShapes
   * @return {undefined}
   */
  deleteFocusedShapes() {
    const { bufferIndices } = this.state.focusedShapeCursor;

    // TODO: Make this O(n) instead of O(n^2)
    const bufferShapes = this.state.bufferShapes.filter(
      (_, i) => !~bufferIndices.indexOf(i)
    );

    this.setState({
      bufferShapes,
      focusedShapeCursor: {
        bufferIndices: [],
        shapeFocus: shapeFocusType.NONE,
      },
    });
  }

  /**
   * @method merkaba.Merkaba#getLiveShape
   * @return {merkaba.svgShape}
   */
  getLiveShape() {
    const {
      selectedTool,
      toolDragDeltaX,
      toolDragDeltaY,
      toolDragStartX,
      toolDragStartY,
      toolFillColor,
      toolRotate,
      toolStrokeColor,
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
    const [focusedShape] = this.getFocusedShapes();
    const { x, y, width, height } = focusedShape;
    const rotate = focusedShape.rotate + rotationOffset;
    const {
      draggedHandleOrientation,
      transformDragStartX: rawSelectionDragStartX,
      transformDragStartY: rawSelectionDragStartY,
      transformDragX: rawSelectionDragX,
      transformDragY: rawSelectionDragY,
    } = this.state;

    const { x: transformDragStartX, y: transformDragStartY } = applyToPoint(
      rotateDEG(rotationOffset),
      {
        x: rawSelectionDragStartX,
        y: rawSelectionDragStartY,
      }
    );

    const { x: transformDragX, y: transformDragY } = applyToPoint(
      rotateDEG(rotationOffset),
      {
        x: rawSelectionDragX || rawSelectionDragStartX,
        y: rawSelectionDragY || rawSelectionDragStartY,
      }
    );

    return computeMidDragMatrix(
      { x, y, width, height, rotate },
      draggedHandleOrientation,
      transformDragX - transformDragStartX,
      transformDragY - transformDragStartY
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
    const [{ x, y, width, height, rotate }] = this.getFocusedShapes();

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
    const [{ x, y, width, height }] = this.getFocusedShapes();

    // Adapted from
    // https://github.com/SVG-Edit/svgedit/blob/396cce40ebfde03f7245c682041f63f07f69e3d3/editor/coords.js#L139-L145
    const point = matrix.applyToPoint(x, y);
    const scaledWidth = matrix.a * width;
    const scaledHeight = matrix.d * height;
    const scaledX = point.x + Math.min(0, scaledWidth);
    const scaledY = point.y + Math.min(0, scaledHeight);
    const absoluteWidth = Math.abs(scaledWidth);
    const absoluteHeight = Math.abs(scaledHeight);

    this.updateFocusedBufferShapes({
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
        bufferIndices: [+shapeEl.getAttribute('data-buffer-index')],
      },
    });
  }

  /**
   * @method merkaba.Merkaba#focusBufferShapeByIndex
   * @param {number} index
   */
  focusBufferShapeByIndex(index) {
    this.setState({
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.BUFFER,
        bufferIndices: [index],
      },
    });
  }

  /**
   * @method merkaba.Merkaba#focusBufferByLayerIndex
   * @param {number} layerIndex
   */
  focusBufferByLayerIndex(layerIndex) {
    this.focusBufferShapeByIndex(
      this.state.bufferShapes.length - 1 - layerIndex
    );
  }

  /**
   * @method merkaba.Merkaba#updateBufferShape
   * @param {number} shapeIndex
   * @param {Object.<any>} newShapeData Any properties to update the buffered
   * shape with.
   */
  updateBufferShape(shapeIndex, newShapeData) {
    const { bufferShapes } = this.state;
    Object.assign(bufferShapes[shapeIndex], newShapeData);
    this.setState({ bufferShapes });
  }

  /**
   * @method merkaba.Merkaba#updateFocusedBufferShapes
   * @param {Object.<any>} newShapeData Any properties to update the buffered
   * shape with.
   */
  updateFocusedBufferShapes(newShapeData) {
    this.state.focusedShapeCursor.bufferIndices.forEach(bufferIndex =>
      this.updateBufferShape(bufferIndex, newShapeData)
    );
  }

  /**
   * @method merkaba.Merkaba#updateBufferShapeProperty
   * @param {Array.<number>} bufferIndices
   * @param {string} name
   * @param {*} value
   */
  updateBufferShapeProperty(bufferIndices, name, value) {
    const bufferShapes = this.state.bufferShapes.slice();

    bufferIndices.forEach(
      bufferIndex =>
        (bufferShapes[bufferIndex] = Object.assign(
          {},
          bufferShapes[bufferIndex],
          {
            [name]: value,
          }
        ))
    );

    this.setState({ bufferShapes });
  }

  /**
   * @method merkaba.Merkaba#updateFocusedBufferShapeProperty
   * @param {string} name
   * @param {*} value
   */
  updateFocusedBufferShapeProperty(name, value) {
    this.updateBufferShapeProperty(
      this.state.focusedShapeCursor.bufferIndices,
      name,
      value
    );
  }

  /**
   * @method merkaba.Merkaba#getSelectedShapeBufferIndices
   * @return {Array.<number>}
   */
  getSelectedShapeBufferIndices() {
    const {
      toolDragStartX,
      toolDragStartY,
      toolDragDeltaX,
      toolDragDeltaY,
    } = this.state;

    const { x, y, height, width } = absolutizeCoordinates(
      toolDragStartX,
      toolDragStartY,
      toolDragDeltaX,
      toolDragDeltaY
    );

    const selectorBox = { x, y, height, width };

    return this.state.bufferShapes
      .map((shape, i) => ({
        i,
        doesIntersect: doRectsIntersect(
          selectorBox,
          computeUnrotatedBoundingBox(shape)
        ),
      }))
      .filter(shape => shape.doesIntersect)
      .map(shape => shape.i);
  }

  render() {
    const {
      state: {
        bufferShapes,
        draggedHandleOrientation,
        focusedShapeCursor: { bufferIndices: focusedShapeBufferIndices },
        isDraggingTool,
        selectedTool,
        transformDragStartX,
        transformDragStartY,
        transformDragX,
        transformDragY,
        toolDragDeltaX,
        toolDragDeltaY,
        toolDragStartX,
        toolDragStartY,
        toolFillColor,
        toolRotate,
        toolStrokeColor,
        toolStrokeWidth,
      },
      handleCanvasDrag,
      handleCanvasDragStart,
      handleCanvasDragStop,
      handleCanvasMouseDown,
      handleColorPropertyChange,
      handleDeleteShapeClick,
      handleLayerClick,
      handleLayerSortEnd,
      handleLayerSortStart,
      handlePropertyChange,
      handleToolClick,
      keyHandlers,
      keyMap,
    } = this;

    const focusedShapes = this.getFocusedShapes();

    return (
      <HotKeys className="hotkeys" keyMap={keyMap} handlers={keyHandlers}>
        <div className="fill merkaba">
          <Layers
            {...{
              bufferShapes,
              distance: 1,
              focusedShapeBufferIndices,
              handleDeleteShapeClick,
              handleLayerClick,
              helperClass: 'focused',
              lockAxis: 'y',
              onSortEnd: handleLayerSortEnd,
              onSortStart: handleLayerSortStart,
            }}
          />
          <Toolbar
            {...{
              handleToolClick,
              selectedTool,
            }}
          />
          <Canvas
            {...{
              bufferShapes,
              draggedHandleOrientation,
              focusedShapes,
              handleCanvasDrag,
              handleCanvasDragStart,
              handleCanvasDragStop,
              handleCanvasMouseDown,
              isDraggingTool,
              selectedTool,
              transformDragStartX,
              transformDragStartY,
              transformDragX,
              transformDragY,
              toolDragDeltaX,
              toolDragDeltaY,
              toolDragStartX,
              toolDragStartY,
              toolFillColor,
              toolRotate,
              toolStrokeColor,
              toolStrokeWidth,
            }}
          />
          <Details
            {...{
              focusedShapes,
              handleColorPropertyChange,
              handlePropertyChange,
            }}
          />
        </div>
      </HotKeys>
    );
  }
}
