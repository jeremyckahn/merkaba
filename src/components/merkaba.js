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
      isDraggingTool: false
    };

    // Bind event handlers
    Object.keys(eventHandlers).forEach(
      method => this[method] = eventHandlers[method].bind(this)
    );
  }

  render () {
    const {
      state: {
        selectedTool
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
        />
        <Details />
      </div>
    );
  }
}
