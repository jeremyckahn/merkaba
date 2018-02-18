import React, { Component } from 'react';
import { Toolbar } from './toolbar';
import { Canvas } from './canvas';
import { Details } from './details';
import {
  selectedToolType,
  shapeFocusType,
} from '../enums';
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
      toolDragStartX: null,
      toolDragStartY: null,
      toolDragDeltaX: null,
      toolDragDeltaY: null,

      // FIXME: Stroke and fill values are temporarily hardcoded
      toolStrokeColor: 'red',
      toolStrokeWidth: 1,
      toolFillColor: 'red',

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
    } = this;

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
          }}
        />
        <Details
          {...{
            selectedTool
          }}
        />
      </div>
    );
  }
}
