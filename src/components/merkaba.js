import React, { Component } from 'react';
import { Toolbar } from './toolbar';
import { Workspace } from './workspace';
import { Details } from './details';
import eventHandlers from '../event-handlers';

export class Merkaba extends Component {
  constructor () {
    super(...arguments);

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
