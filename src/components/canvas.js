import React from 'react';
import { DraggableCore } from 'react-draggable';
import { selectedToolType, shapeType } from '../enums';
import { rotatorHitArea } from '../constants';
import { Rect } from './shapes';

/**
 * @param {Array.<merkaba.svgShape>} bufferShapes
 * @param {string|null} draggedHandleOrientation
 * @param {number|null} focusedShapeBufferIndex
 * @param {Function(external:React.SyntheticEvent)} handleShapeClick
 * @param {number|null} selectionDragStartX
 * @param {number|null} selectionDragStartY
 * @param {number|null} selectionDragX
 * @param {number|null} selectionDragY
 */
const Buffer = ({
  bufferShapes,
  draggedHandleOrientation,
  focusedShapeBufferIndex,
  handleShapeClick,
  selectionDragStartX,
  selectionDragStartY,
  selectionDragX,
  selectionDragY,
}) =>
  bufferShapes.map(
    ({ type, x, y, width, height, rotate, stroke, fill, strokeWidth }, i) =>
      type === shapeType.RECT ? (
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
      ) : null
  );

// FIXME: Change orientation values to be enums
const Selector = ({
  focusedShape: { type, x = 0, y = 0, width = 0, height = 0, rotate = 0 },
  handleConfig = [
    {
      orientation: 'top-left',
      x,
      y,
    },
    {
      orientation: 'top-right',
      x: x + width,
      y,
    },
    {
      orientation: 'bottom-right',
      x: x + width,
      y: y + height,
    },
    {
      orientation: 'bottom-left',
      x,
      y: y + height,
    },
  ],
}) =>
  type === shapeType.NONE ? null : (
    <g transform={`rotate(${rotate} ${x + width / 2} ${y + height / 2})`}>
      {handleConfig.map(({ orientation, x, y }, i) => (
        <ellipse
          {...{
            className: 'selection-handle-rotator',
            cx: x,
            cy: y,
            key: `handle-rotator-${i}`,
            rx: rotatorHitArea,
            ry: rotatorHitArea,
          }}
        />
      ))}
      <Rect
        {...{
          className: 'selection',
          dx: width,
          dy: height,
          fill: 'none',
          key: 0,
          x,
          y,
        }}
      />
      {handleConfig.map(({ orientation, x, y }, i) => (
        <ellipse
          {...{
            className: `selection-handle ${orientation}`,
            cx: x,
            cy: y,
            key: `handle-${i}`,
            orientation,
            rx: 5,
            ry: 5,
          }}
        />
      ))}
    </g>
  );

/**
 * @param {boolean} isDraggingTool
 * @param {merkaba.module:enums.selectedToolType} selectedTool
 * @param {number|null} toolDragDeltaX
 * @param {number|null} toolDragDeltaY
 * @param {number|null} toolDragStartX
 * @param {number|null} toolDragStartY
 * @param {null|string} toolFillColor
 * @param {null|string} toolStrokeColor
 * @param {null|number} toolStrokeWidth
 */
const LiveShape = ({
  isDraggingTool,
  selectedTool,
  toolDragDeltaX,
  toolDragDeltaY,
  toolDragStartX,
  toolDragStartY,
  toolFillColor,
  toolRotate,
  toolStrokeColor,
  toolStrokeWidth,
}) =>
  isDraggingTool ? (
    selectedTool === selectedToolType.RECTANGLE ? (
      <Rect
        className="live"
        dx={toolDragDeltaX}
        dy={toolDragDeltaY}
        fill={toolFillColor}
        rotate={toolRotate}
        stroke={toolStrokeColor}
        strokeWidth={toolStrokeWidth}
        x={toolDragStartX}
        y={toolDragStartY}
      />
    ) : null
  ) : null;

/**
 * @class merkaba.Canvas
 * @param {Array.<merkaba.svgShape>} bufferShapes
 * @param {string|null} draggedHandleOrientation
 * @param {merkaba.svgShape} focusedShape
 * @param {number|null} focusedShapeBufferIndex
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDrag
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStart
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStop
 * @param {Function(external:React.SyntheticEvent)} handleCanvasMouseDown
 * @param {Function(external:React.SyntheticEvent)} handleShapeClick
 * @param {boolean} isDraggingTool
 * @param {merkaba.module:enums.selectedToolType} selectedTool
 * @param {number|null} selectionDragStartX
 * @param {number|null} selectionDragStartY
 * @param {number|null} selectionDragX
 * @param {number|null} selectionDragY
 * @param {number|null} toolDragDeltaX
 * @param {number|null} toolDragDeltaY
 * @param {number|null} toolDragStartX
 * @param {number|null} toolDragStartY
 * @param {null|string} toolFillColor
 * @param {number} toolRotate
 * @param {null|string} toolStrokeColor
 * @param {null|number} toolStrokeWidth
 * @extends {external:React.Component}
 */
export const Canvas = ({
  bufferShapes = [],
  draggedHandleOrientation,
  focusedShape = {},
  focusedShapeBufferIndex,
  handleCanvasDrag,
  handleCanvasDragStart,
  handleCanvasDragStop,
  handleCanvasMouseDown,
  handleShapeClick,
  isDraggingTool,
  selectedTool,
  selectionDragStartX,
  selectionDragStartY,
  selectionDragX,
  selectionDragY,
  toolDragDeltaX,
  toolDragDeltaY,
  toolDragStartX,
  toolDragStartY,
  toolFillColor,
  toolRotate,
  toolStrokeColor,
  toolStrokeWidth,
}) => (
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
        <Buffer
          {...{
            bufferShapes,
            draggedHandleOrientation,
            focusedShapeBufferIndex,
            handleShapeClick,
            selectionDragStartX,
            selectionDragStartY,
            selectionDragX,
            selectionDragY,
          }}
        />
        {selectedTool !== selectedToolType.NONE ? (
          <LiveShape
            {...{
              isDraggingTool,
              selectedTool,
              toolDragDeltaX,
              toolDragDeltaY,
              toolDragStartX,
              toolDragStartY,
              toolFillColor,
              toolRotate,
              toolStrokeColor,
              toolStrokeWidth,
            }}
          />
        ) : null}
        <Selector
          {...{
            focusedShape,
          }}
        />
      </svg>
    </div>
  </DraggableCore>
);
