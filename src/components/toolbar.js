import React, { Component } from 'react';

export class Toolbar extends Component {
  render () {
    return (
      <div className="fill toolbar">
        <ul>
          <li>
            <button className="glyphicon glyphicon-stop" />
          </li>
        </ul>
      </div>
    );
  }
}
