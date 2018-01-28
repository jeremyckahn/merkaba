import React, { Component } from 'react';
import { Toolbar } from './toolbar';
import { Workspace } from './workspace';
import { Details } from './details';

export class Merkaba extends Component {
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
