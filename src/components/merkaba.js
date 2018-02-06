import React, { Component } from 'react';
import { Toolbar } from './toolbar';
import { Canvas } from './canvas';
import { Details } from './details';
import { selectedToolType } from '../enums';
import eventHandlers from './merkaba.event-handlers';

/**
 * @typedef merkaba.state
 * @type {Object}
 * @property {merkaba.module:enums.selectedToolType} selectedTool
 * @property {boolean} isDraggingTool
 * @property {null|number} toolDragStartX
 * @property {null|number} toolDragStartY
 * @property {null|number} toolDragDeltaX
 * @property {null|number} toolDragDeltaY
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
      }
    } = this;

    return (
      <div className="fill merkaba">
        <Toolbar
          handleToolClick={this.handleToolClick}
          selectedTool={selectedTool}
        />
        <Canvas
          handleCanvasDragStart={this.handleCanvasDragStart}
          handleCanvasDrag={this.handleCanvasDrag}
          handleCanvasDragStop={this.handleCanvasDragStop}
          isDraggingTool={isDraggingTool}
          selectedTool={selectedTool}
          toolDragStartX={toolDragStartX}
          toolDragStartY={toolDragStartY}
          toolDragDeltaX={toolDragDeltaX}
          toolDragDeltaY={toolDragDeltaY}
        />
        <Details />
      </div>
    );
  }
}
