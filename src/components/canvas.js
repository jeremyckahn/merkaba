import React from 'react';
import { DraggableCore } from 'react-draggable';
import { selectedToolType, shapeType } from '../enums';
import { rotatorHitArea } from '../constants';
import { Rect } from './shapes';

/**
 * @param {Function(external:React.SyntheticEvent)} handleShapeClick
 * @param {Array.<merkaba.svgShape>} bufferShapes
 * @param {string|null} draggedHandleOrientation
 * @param {number|null} selectionDragStartX
 * @param {number|null} selectionDragStartY
 * @param {number|null} selectionDragX
 * @param {number|null} selectionDragY
 * @param {number|null} focusedShapeBufferIndex
 */
const Buffer = ({
  handleShapeClick,
  bufferShapes,
  draggedHandleOrientation,
  selectionDragStartX,
  selectionDragStartY,
  selectionDragX,
  selectionDragY,
  focusedShapeBufferIndex,
}) =>
  bufferShapes.map(({
    type,
    x,
    y,
    width,
    height,
    rotate,
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
          rotate,
          stroke,
          fill,
          strokeWidth,
          handleShapeClick,
        }}
      />
      : null
  )

const Selector = ({
  focusedShape: {
    type,
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    rotate = 0,
  },
  handleConfig = [
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
  ]
}) =>
  type === shapeType.NONE ? null :
    <g
      transform={`rotate(${rotate} ${x + (width / 2)} ${y + (height / 2)})`}
    >
      {handleConfig.map(({ orientation, x, y }, i) =>
        <ellipse
          {...{
            key: `handle-rotator-${i}`,
            className: 'selection-handle-rotator',
            cx: x,
            cy: y,
            rx: rotatorHitArea,
            ry: rotatorHitArea,
          }}
        />
      )
    }
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
      {handleConfig.map(({ orientation, x, y }, i) =>
        <ellipse
          {...{
            key: `handle-${i}`,
            className: `selection-handle ${orientation}`,
            orientation,
            cx: x,
            cy: y,
            rx: 5,
            ry: 5,
          }}
        />
      )
    }
  </g>

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
  toolRotate,
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
        rotate={toolRotate}
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
 * @param {number} toolRotate
 * @param {null|string} toolStrokeColor
 * @param {null|number} toolStrokeWidth
 * @param {null|string} toolFillColor
 * @param {boolean} isDraggingTool
 * @param {string|null} draggedHandleOrientation
 * @param {merkaba.module:enums.selectedToolType} selectedTool
 * @param {Array.<merkaba.svgShape>} bufferShapes
 * @param {merkaba.svgShape} focusedShape
 * @param {number|null} selectionDragStartX
 * @param {number|null} selectionDragStartY
 * @param {number|null} selectionDragX
 * @param {number|null} selectionDragY
 * @param {number|null} focusedShapeBufferIndex
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
  toolRotate,
  toolStrokeColor,
  toolStrokeWidth,
  toolFillColor,
  isDraggingTool,
  draggedHandleOrientation,
  selectedTool,
  bufferShapes = [],
  focusedShape = {},
  selectionDragStartX,
  selectionDragStartY,
  selectionDragX,
  selectionDragY,
  focusedShapeBufferIndex,
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
          draggedHandleOrientation,
          selectionDragStartX,
          selectionDragStartY,
          selectionDragX,
          selectionDragY,
          focusedShapeBufferIndex,
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
            toolRotate,
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
