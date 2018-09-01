import React, { Component } from 'react';
import { HotKeys } from 'react-hotkeys';
import { Matrix } from 'transformation-matrix-js';
import {
  applyToPoint,
  inverse,
  rotateDEG,
  transform,
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
  simpleClone,
} from '../utils';
import { historyLimit } from '../constants';
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
 * @property {Array.<snapshot>} historyPast
 * @property {Array.<snapshot>} historyFuture
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

const emptyShape = { type: shapeType.NONE };

/**
 * @class merkaba.Merkaba
 * @extends {external:React.Component}
 */
export class Merkaba extends Component {
  constructor() {
    super(...arguments);

    this.historyLimit = historyLimit;

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
      historyPast: [],
      historyFuture: [],
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

    this.setUpUndoableActions();

    // TODO: Make this preventable via a prop
    this.initKeyHandlers();
  }

  initKeyHandlers() {
    const {
      handleDeleteKeyPress,
      handleNudgeKeyPress,
      handleRedoKeypress,
      handleToolClick,
      handleUndoKeypress,
    } = this;

    this.keyMap = {
      deleteFocusedShape: ['del', 'backspace'],
      nudgeUp: 'up',
      nudgeRight: 'right',
      nudgeDown: 'down',
      nudgeLeft: 'left',
      redo: 'meta+shift+z',
      selectRectangleTool: 'r',
      selectSelectTool: 's',
      undo: 'meta+z',
    };

    this.keyHandlers = {
      deleteFocusedShape: handleDeleteKeyPress,
      nudgeUp: handleNudgeKeyPress,
      nudgeRight: handleNudgeKeyPress,
      nudgeDown: handleNudgeKeyPress,
      nudgeLeft: handleNudgeKeyPress,
      redo: handleRedoKeypress,
      selectRectangleTool: () => handleToolClick(selectedToolType.RECTANGLE),
      selectSelectTool: () => handleToolClick(selectedToolType.SELECT),
      undo: handleUndoKeypress,
    };

    this.keyHandlers = Object.keys(this.keyHandlers).reduce((acc, key) => {
      const original = this.keyHandlers[key];

      acc[key] = function() {
        const {
          isDraggingTool,
          isDraggingSelectionHandle,
          isDraggingSelectionRotator,
          isDraggingShape,
        } = this.state;

        if (
          // User is focused on an input element
          !document.activeElement.classList.contains('hotkeys') ||
          // User is dragging something
          isDraggingTool ||
          isDraggingSelectionHandle ||
          isDraggingSelectionRotator ||
          isDraggingShape
        ) {
          return;
        }

        original(...arguments);
      }.bind(this);

      return acc;
    }, {});
  }

  /**
   * @function merkaba.Merkaba#setUpUndoableActions
   */
  setUpUndoableActions() {
    [
      'handleToolClick',
      'handleCanvasDragStart',
      'handleDeleteShapeClick',
      'handleDetailsInputFocus',
      'handleLayerSortStart',
    ].forEach(handlerName => {
      const original = this[handlerName];

      this[handlerName] = function() {
        const args = [...arguments];
        this.recordSnapshot();
        original(...args);
      }.bind(this);
    });
  }

  /**
   * @function merkaba.Merkaba#getFocusedShapes
   * @returns {Array.<merkaba.svgShape>}
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
   * @function merkaba.Merkaba#deleteFocusedShapes
   * @returns {undefined}
   */
  deleteFocusedShapes() {
    const {
      focusedShapeCursor: { bufferIndices },
      bufferShapes,
    } = this.state;

    this.setState({
      bufferShapes: bufferIndices.reverse().reduce((acc, index) => {
        acc.splice(index, 1);
        return acc;
      }, bufferShapes),

      focusedShapeCursor: {
        bufferIndices: [],
        shapeFocus: shapeFocusType.NONE,
      },
    });
  }

  /**
   * @function merkaba.Merkaba#getLiveShape
   * @returns {merkaba.svgShape}
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
   * @function merkaba.Merkaba#getMidDragMatrix
   * @param {Object} config
   * @param {number} [config.rotationOffset=0]
   * @returns {Matrix}
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
   * @function merkaba.Merkaba#getAggregateDragMatrix
   * @returns {Matrix}
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
   * @function merkaba.Merkaba#applyMatrixToFocusedShape
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
   * @function merkaba.Merkaba#focusBufferShape
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
   * @function merkaba.Merkaba#focusBufferShapeByIndex
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
   * @function merkaba.Merkaba#focusBufferByLayerIndex
   * @param {number} layerIndex
   */
  focusBufferByLayerIndex(layerIndex) {
    this.focusBufferShapeByIndex(
      this.state.bufferShapes.length - 1 - layerIndex
    );
  }

  /**
   * @function merkaba.Merkaba#updateBufferShape
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
   * @function merkaba.Merkaba#updateFocusedBufferShapes
   * @param {Object.<any>} newShapeData Any properties to update the buffered
   * shape with.
   */
  updateFocusedBufferShapes(newShapeData) {
    this.state.focusedShapeCursor.bufferIndices.forEach(bufferIndex =>
      this.updateBufferShape(bufferIndex, newShapeData)
    );
  }

  /**
   * @function merkaba.Merkaba#updateBufferShapeProperty
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
   * @function merkaba.Merkaba#updateFocusedBufferShapeProperty
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
   * @function merkaba.Merkaba#getSelectedShapeBufferIndices
   * @returns {Array.<number>}
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

  /**
   * @function merkaba.Merkaba#getSnapshot
   * @returns {external:merkaba.snapshot}
   */
  getSnapshot() {
    const { bufferShapes, focusedShapeCursor, selectedTool } = this.state;

    // Explore using https://github.com/fastify/fast-json-stringify
    return JSON.stringify({
      bufferShapes,
      focusedShapeCursor,
      selectedTool,
    });
  }

  /**
   * @function merkaba.Merkaba#recordSnapshot
   */
  recordSnapshot() {
    const {
      historyLimit,
      state: { historyPast },
    } = this;

    const snapshot = this.getSnapshot();

    if (snapshot === historyPast[historyPast.length - 1]) {
      return;
    }

    if (historyPast.length >= historyLimit) {
      historyPast.shift();
    }

    historyPast.push(snapshot);
    this.setState({ historyFuture: [], historyPast });
  }

  /**
   * @function merkaba.Merkaba#revertToSnapshot
   */
  revertToSnapshot() {
    const { historyFuture, historyPast } = this.state;

    if (!historyPast.length) {
      return;
    }

    historyFuture.unshift(this.getSnapshot());

    this.setState(
      Object.assign({}, JSON.parse(historyPast.pop()), {
        historyFuture,
        historyPast,
      })
    );
  }

  /**
   * @function merkaba.Merkaba#proceedToSnapshot
   */
  proceedToSnapshot() {
    const { historyFuture, historyPast } = this.state;

    if (!historyFuture.length) {
      return;
    }

    historyPast.push(this.getSnapshot());

    this.setState(
      Object.assign({}, JSON.parse(historyFuture.shift()), {
        historyFuture,
        historyPast,
      })
    );
  }

  /**
   * @function merkaba.Merkaba#toJSON
   * @returns {merkaba.json}
   */
  toJSON() {
    const { bufferShapes } = this.state;

    return {
      shapes: simpleClone(bufferShapes),
    };
  }

  /**
   * @function merkaba.Merkaba#fromJSON
   * @param {merkaba.json} data
   */
  fromJSON(data) {
    const { shapes } = data;

    this.setState({
      bufferShapes: simpleClone(shapes),
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.NONE,
        bufferIndices: [],
      },
    });
  }

  render() {
    const {
      state,
      state: {
        focusedShapeCursor: { bufferIndices: focusedShapeBufferIndices },
      },
      handleCanvasDrag,
      handleCanvasDragStart,
      handleCanvasDragStop,
      handleCanvasMouseDown,
      handleColorPropertyChange,
      handleDeleteShapeClick,
      handleDetailsInputFocus,
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
      <HotKeys
        className="merkaba-wrapper hotkeys"
        keyMap={keyMap}
        handlers={keyHandlers}
      >
        <div className="fill merkaba">
          <Layers
            {...{
              distance: 1,
              focusedShapeBufferIndices,
              handleDeleteShapeClick,
              handleLayerClick,
              helperClass: 'focused',
              lockAxis: 'y',
              onSortEnd: handleLayerSortEnd,
              onSortStart: handleLayerSortStart,
              ...state,
            }}
          />
          <Toolbar
            {...{
              handleToolClick,
              ...state,
            }}
          />
          <Canvas
            {...{
              focusedShapes,
              handleCanvasDrag,
              handleCanvasDragStart,
              handleCanvasDragStop,
              handleCanvasMouseDown,
              ...state,
            }}
          />
          <Details
            {...{
              focusedShapes,
              handleColorPropertyChange,
              handleDetailsInputFocus,
              handlePropertyChange,
              ...state,
            }}
          />
        </div>
      </HotKeys>
    );
  }
}
