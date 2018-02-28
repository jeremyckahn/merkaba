import React from 'react';
import { DraggableCore } from 'react-draggable';
import { selectedToolType, shapeType } from '../enums';
import { Rect } from './shapes';


/**
 * @param {external:Draggable.DraggableEventHandler} handleShapeDragStart
 * @param {external:Draggable.DraggableEventHandler} handleShapeDrag
 * @param {external:Draggable.DraggableEventHandler} handleShapeDragStop
 * @param {Array.<merkaba.svgShape>} bufferShapes
 */
const Buffer = ({
  handleShapeDragStart,
  handleShapeDrag,
  handleShapeDragStop,
  bufferShapes,
}) =>
  bufferShapes.map(({
    type,
    x,
    y,
    width,
    height,
    stroke,
    fill,
    strokeWidth,
  }, i) =>
    type === shapeType.RECT ?
      <Rect
        key={i}
        className="buffered"
        x={x}
        y={y}
        dx={width}
        dy={height}
        stroke={stroke}
        fill={fill}
        strokeWidth={strokeWidth}
        {...{
          handleShapeDragStart,
          handleShapeDrag,
          handleShapeDragStop,
        }}
      />
      : null
  )

/**
 * @param {number|null} toolDragStartX
 * @param {number|null} toolDragStartY
 * @param {number|null} toolDragDeltaX
 * @param {number|null} toolDragDeltaY
 * @param {null|string} toolStrokeColor
 * @param {null|number} toolStrokeWidth
 * @param {null|string} toolFillColor
 * @param {boolean} isDraggingTool
 * @param {merkaba.module:enums.selectedToolType} selectedTool
 */
const LiveShape = ({
  isDraggingTool,
  selectedTool,
  toolDragStartX,
  toolDragStartY,
  toolDragDeltaX,
  toolDragDeltaY,
  toolStrokeColor,
  toolFillColor,
  toolStrokeWidth,
}) =>
  isDraggingTool ?
    selectedTool === selectedToolType.RECTANGLE ?
      <Rect
        className="live"
        x={toolDragStartX}
        y={toolDragStartY}
        dx={toolDragDeltaX}
        dy={toolDragDeltaY}
        stroke={toolStrokeColor}
        fill={toolFillColor}
        strokeWidth={toolStrokeWidth}
      />
      : null
    : null

/**
 * @class merkaba.Canvas
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStart
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDrag
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStop
 * @param {external:Draggable.DraggableEventHandler} handleShapeDragStart
 * @param {external:Draggable.DraggableEventHandler} handleShapeDrag
 * @param {external:Draggable.DraggableEventHandler} handleShapeDragStop
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
  handleShapeDragStart,
  handleShapeDrag,
  handleShapeDragStop,
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
        <Buffer {...{
          handleShapeDragStart,
          handleShapeDrag,
          handleShapeDragStop,
          bufferShapes,
        }} />
        <LiveShape {...
        {
          isDraggingTool,
          selectedTool,
          toolDragStartX,
          toolDragStartY,
          toolDragDeltaX,
          toolDragDeltaY,
          toolStrokeColor,
          toolFillColor,
          toolStrokeWidth,
        }} />
      </svg>
    </div>
  </DraggableCore>
