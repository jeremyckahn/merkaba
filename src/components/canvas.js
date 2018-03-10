import React from 'react';
import { DraggableCore } from 'react-draggable';
import { selectedToolType, shapeType } from '../enums';
import { Rect } from './shapes';


/**
 * @param {Function(external:React.SyntheticEvent)} handleCanvasClick
 * @param {Function(external:React.SyntheticEvent)} handleShapeClick
 * @param {external:Draggable.DraggableEventHandler} handleShapeDragStart
 * @param {external:Draggable.DraggableEventHandler} handleShapeDrag
 * @param {external:Draggable.DraggableEventHandler} handleShapeDragStop
 * @param {Array.<merkaba.svgShape>} bufferShapes
 */
const Buffer = ({
  handleCanvasClick,
  handleShapeClick,
  handleShapeDragStart,
  handleShapeDrag,
  handleShapeDragStop,
  bufferShapes,
}) =>
  <svg
    className="fill"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    onClick={handleCanvasClick}
  >
    {bufferShapes.map(({
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
          dx={width}
          dy={height}
          {...{
            x,
            y,
            stroke,
            fill,
            strokeWidth,
            handleShapeClick,
            handleShapeDragStart,
            handleShapeDrag,
            handleShapeDragStop,
          }}
        />
        : null
    )}
  </svg>

const Selector = ({
  focusedShape = {}
}) =>
  <svg className="selection" version="1.1" xmlns="http://www.w3.org/2000/svg">
    {focusedShape.type === shapeType.NONE ? null :
      <Rect
        x={focusedShape.x}
        y={focusedShape.y}
        dx={focusedShape.width}
        dy={focusedShape.height}
      />
    }
  </svg>

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
  <svg className="fill" version="1.1" xmlns="http://www.w3.org/2000/svg">
    {isDraggingTool ?
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
    : null}
  </svg>

/**
 * @class merkaba.Canvas
 * @param {Function(external:React.SyntheticEvent)} handleCanvasClick
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStart
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDrag
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStop
 * @param {Function(external:React.SyntheticEvent)} handleShapeClick
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
  handleCanvasClick,
  handleCanvasDragStart,
  handleCanvasDrag,
  handleCanvasDragStop,
  handleShapeClick,
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
  bufferShapes = [],
  focusedShape,
}) =>
  <DraggableCore
    onStart={handleCanvasDragStart}
    onDrag={handleCanvasDrag}
    onStop={handleCanvasDragStop}
  >
    <div
      className={`fill canvas ${
        selectedTool === selectedToolType.NONE ? 'no-tool-selected' : ''
      }`}
    >
      <Buffer {...{
        handleCanvasClick,
        handleShapeClick,
        handleShapeDragStart,
        handleShapeDrag,
        handleShapeDragStop,
        bufferShapes,
      }} />
      <Selector {...{
        focusedShape
      }} />
      {selectedTool !== selectedToolType.NONE ?
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
      : null}
    </div>
  </DraggableCore>
