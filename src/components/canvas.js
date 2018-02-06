import React from 'react';
import { DraggableCore } from 'react-draggable';
import { selectedToolType } from '../enums';

/**
 * @class merkaba.Canvas
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStart
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDrag
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStop
 * @param {number|null} toolDragStartX
 * @param {number|null} toolDragStartY
 * @param {number|null} toolDragDeltaX
 * @param {number|null} toolDragDeltaY
 * @property {boolean} isDraggingTool
 * @property {merkaba.module:enums.selectedToolType} selectedTool
 * @extends {external:React.Component}
 */
export const Canvas = ({
  handleCanvasDragStart,
  handleCanvasDrag,
  handleCanvasDragStop,
  toolDragStartX,
  toolDragStartY,
  toolDragDeltaX,
  toolDragDeltaY,
  isDraggingTool,
  selectedTool,
}) =>
  <DraggableCore
    onStart={handleCanvasDragStart}
    onDrag={handleCanvasDrag}
    onStop={handleCanvasDragStop}
  >
    <div className="fill canvas">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
        {isDraggingTool ? (() =>
          selectedTool === selectedToolType.RECTANGLE ?
            <rect
              x={toolDragStartX}
              y={toolDragStartY}
              width={toolDragDeltaX}
              height={toolDragDeltaY}
              stroke="red"
              fill="red"
              strokeWidth="1"
            />
            : null
        )() : null}
      </svg>
    </div>
  </DraggableCore>
