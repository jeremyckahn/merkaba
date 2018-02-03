import React from 'react';
import { DraggableCore } from 'react-draggable';

/**
 * @class merkaba.Workspace
 * @extends {external:React.Component}
 */
export const Workspace = ({
  handleWorkspaceDragStart,
  handleWorkspaceDrag,
  handleWorkspaceDragStop,
}) =>
  <DraggableCore
    onStart={handleWorkspaceDragStart}
    onDrag={handleWorkspaceDrag}
    onStop={handleWorkspaceDragStop}
  >
    <div className="fill workspace">
    </div>
  </DraggableCore>
