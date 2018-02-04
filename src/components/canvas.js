import React from 'react';
import { DraggableCore } from 'react-draggable';

/**
 * @class merkaba.Canvas
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStart
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDrag
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStop
 * @extends {external:React.Component}
 */
export const Canvas = ({
  handleCanvasDragStart,
  handleCanvasDrag,
  handleCanvasDragStop,
}) =>
  <DraggableCore
    onStart={handleCanvasDragStart}
    onDrag={handleCanvasDrag}
    onStop={handleCanvasDragStop}
  >
    <div className="fill canvas">
    </div>
  </DraggableCore>
