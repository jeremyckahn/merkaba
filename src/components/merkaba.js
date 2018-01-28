import React, { Component } from 'react';
import { Toolbar } from './toolbar';
import { Workspace } from './workspace';
import { Details } from './details';

export class Merkaba extends Component {
  render () {
    return (
      <div>
        <Toolbar />
        <Workspace />
        <Details />
      </div>
    );
  }
}
