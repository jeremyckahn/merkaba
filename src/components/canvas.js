import React from 'react';
import { DraggableCore } from 'react-draggable';
import { selectedToolType } from '../enums';

/**
 * @param {number} x
 * @param {number} y
 * @param {number} dx
 * @param {number} dy
 * @param {string} stroke
 * @param {string} fill
 * @param {number} strokeWidth
 */
const Rect = ({
  x, y, dx, dy, stroke, fill, strokeWidth
}) =>
  <rect
    x={x + Math.min(dx, 0)}
    y={y + Math.min(dy, 0)}
    width={Math.abs(dx)}
    height={Math.abs(dy)}
    stroke={stroke}
    fill={fill}
    strokeWidth={strokeWidth}
  />

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
            <Rect
              x={toolDragStartX}
              y={toolDragStartY}
              dx={toolDragDeltaX}
              dy={toolDragDeltaY}
              stroke={'red'}
              fill={'red'}
              strokeWidth={1}
            />
            : null
        )() : null}
      </svg>
    </div>
  </DraggableCore>
