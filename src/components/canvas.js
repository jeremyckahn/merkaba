import React from 'react';
import { DraggableCore } from 'react-draggable';
import { selectedToolType, shapeType } from '../enums';
import { Rect } from './shapes';


/**
 * @param {Function(external:React.SyntheticEvent)} handleShapeClick
 * @param {Array.<merkaba.svgShape>} bufferShapes
 */
const Buffer = ({
  handleShapeClick,
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
        bufferIndex={i}
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
        }}
      />
      : null
  )

const Handle = ({
  x,
  y,
  orientation,
}) =>
  <ellipse
    {...{
      className: `selection-handle ${orientation}`,
      orientation,
      cx: x,
      cy: y,
      rx: 5,
      ry: 5,
    }}
  />

const Selector = ({
  focusedShape: {
    type,
    x = 0,
    y = 0,
    width = 0,
    height = 0
  }
}) =>
  type === shapeType.NONE ? null :
    [
      <Rect
        {...{
          x,
          y,
          dx: width,
          dy: height,
          key: 0,
          fill: 'none',
          className: 'selection',
        }}
      />
    ].concat([
      {
        orientation: 'top-left',
        x,
        y
      }, {
        orientation: 'top-right',
        x: x + width,
        y
      }, {
        orientation: 'bottom-right',
        x: x + width,
        y: y + height
      }, {
        orientation: 'bottom-left',
        x,
        y: y + height
      }
    ].map(({ orientation, x, y }, i) =>
      <Handle
        {...{
          x,
          y,
          orientation,
          key: i + 1
        }}
      />
    ))

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
 * @param {Function(external:React.SyntheticEvent)} handleCanvasMouseDown
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStart
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDrag
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStop
 * @param {Function(external:React.SyntheticEvent)} handleShapeClick
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
  handleCanvasMouseDown,
  handleCanvasDragStart,
  handleCanvasDrag,
  handleCanvasDragStop,
  handleShapeClick,
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
  focusedShape = {},
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
      <svg
        className="fill"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        onMouseDown={handleCanvasMouseDown}
      >
        <Buffer {...{
          handleShapeClick,
          bufferShapes,
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
        <Selector {...{
          focusedShape,
        }} />
      </svg>
    </div>
  </DraggableCore>
