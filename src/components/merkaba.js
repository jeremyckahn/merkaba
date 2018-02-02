import React, { Component } from 'react';
import { Toolbar } from './toolbar';
import { Workspace } from './workspace';
import { Details } from './details';
import { selectedTool } from '../enums';
import eventHandlers from './merkaba.event-handlers';

/**
 * @typedef merkaba.state
 * @type {Object}
 * @property {merkaba.module:enums.selectedTool} selectedTool
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
      selectedTool: selectedTool.NONE
    };

    // Bind event handlers
    Object.keys(eventHandlers).forEach(
      method => this[method] = eventHandlers[method].bind(this)
    );
  }

  render () {
    return (
      <div className="fill merkaba">
        <Toolbar />
        <Workspace />
        <Details />
      </div>
    );
  }
}
