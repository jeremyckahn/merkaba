import React from 'react';
import { DraggableCore } from 'react-draggable';
import { selectedToolType, shapeType } from '../enums';

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
 * @param {null|string} toolStrokeColor
 * @param {null|number} toolStrokeWidth
 * @param {null|string} toolFillColor
 * @param {boolean} isDraggingTool
 * @param {merkaba.module:enums.selectedToolType} selectedTool
 * @param {Array.<merkaba.svgShape>} bufferShapes
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
  toolStrokeColor,
  toolStrokeWidth,
  toolFillColor,
  isDraggingTool,
  selectedTool,
  bufferShapes = []
}) =>
  <DraggableCore
    onStart={handleCanvasDragStart}
    onDrag={handleCanvasDrag}
    onStop={handleCanvasDragStop}
  >
    <div className="fill canvas">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
        {bufferShapes.map(({
          type,
          x,
          y,
          width,
          height,
          stroke,
          fill,
          strokeWidth
        }, i) =>
          type === shapeType.RECT ?
            <Rect
              key={i}
              x={x}
              y={y}
              dx={width}
              dy={height}
              stroke={stroke}
              fill={fill}
              strokeWidth={strokeWidth}
            />
            : null
        )}
        {isDraggingTool ? (() =>
          selectedTool === selectedToolType.RECTANGLE ?
            <Rect
              key="live"
              x={toolDragStartX}
              y={toolDragStartY}
              dx={toolDragDeltaX}
              dy={toolDragDeltaY}
              stroke={toolStrokeColor}
              fill={toolFillColor}
              strokeWidth={toolStrokeWidth}
            />
            : null
        )() : null}
      </svg>
    </div>
  </DraggableCore>
