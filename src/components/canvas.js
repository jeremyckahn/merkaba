import React from 'react';
import { DraggableCore } from 'react-draggable';
import { selectedToolType, shapeType } from '../enums';
import { rotatorHitArea } from '../constants';
import { Rect } from './shapes';

/**
 * @param {Array.<merkaba.svgShape>} bufferShapes
 * @param {string|null} draggedHandleOrientation
 * @param {number|null} transformDragStartX
 * @param {number|null} transformDragStartY
 * @param {number|null} transformDragX
 * @param {number|null} transformDragY
 */
const Buffer = ({
  bufferShapes,
  draggedHandleOrientation,
  transformDragStartX,
  transformDragStartY,
  transformDragX,
  transformDragY,
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
          }}
        />
      ) : null
  );

// FIXME: Change orientation values to be enums
const FocusedShapeFrames = ({ focusedShapes }) =>
  focusedShapes.map(
    (
      {
        type,
        x = 0,
        y = 0,
        width = 0,
        height = 0,
        rotate = 0,
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
      },
      i
    ) =>
      type === shapeType.NONE ? null : (
        <g
          key={i}
          transform={`rotate(${rotate} ${x + width / 2} ${y + height / 2})`}
        >
          {focusedShapes.length === 1 &&
            handleConfig.map(({ orientation, x, y }, j) => (
              <ellipse
                {...{
                  className: 'selection-handle-rotator',
                  cx: x,
                  cy: y,
                  key: `handle-rotator-${j}`,
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
          {focusedShapes.length === 1 &&
            handleConfig.map(({ orientation, x, y }, j) => (
              <ellipse
                {...{
                  className: `selection-handle ${orientation}`,
                  cx: x,
                  cy: y,
                  key: `handle-${j}`,
                  orientation,
                  rx: 5,
                  ry: 5,
                }}
              />
            ))}
        </g>
      )
  );

/**
 * @param {boolean} isDraggingTool
 * @param {merkaba.module:enums.selectedToolType} selectedTool
 * @param {number|null} toolDragDeltaX
 * @param {number|null} toolDragDeltaY
 * @param {number|null} toolDragStartX
 * @param {number|null} toolDragStartY
 */
const Selector = ({
  isDraggingTool,
  selectedTool,
  toolDragDeltaX,
  toolDragDeltaY,
  toolDragStartX,
  toolDragStartY,
}) =>
  selectedTool === selectedToolType.SELECT && isDraggingTool ? (
    <Rect
      {...{
        x: toolDragStartX,
        y: toolDragStartY,
        dx: toolDragDeltaX,
        dy: toolDragDeltaY,
        stroke: 'rgba(0, 146, 255, 1)',
        strokeWidth: 1,
        fill: 'rgba(128, 128, 128, 0.1)',
      }}
    />
  ) : null;

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
 * @param {Array.<merkaba.svgShape>} focusedShapes
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDrag
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStart
 * @param {external:Draggable.DraggableEventHandler} handleCanvasDragStop
 * @param {Function(external:React.SyntheticEvent)} handleCanvasMouseDown
 * @param {boolean} isDraggingTool
 * @param {merkaba.module:enums.selectedToolType} selectedTool
 * @param {number|null} transformDragStartX
 * @param {number|null} transformDragStartY
 * @param {number|null} transformDragX
 * @param {number|null} transformDragY
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
  focusedShapes = [],
  handleCanvasDrag,
  handleCanvasDragStart,
  handleCanvasDragStop,
  handleCanvasMouseDown,
  isDraggingTool,
  selectedTool,
  transformDragStartX,
  transformDragStartY,
  transformDragX,
  transformDragY,
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
      className={`canvas ${
        selectedTool === selectedToolType.SELECT ? 'no-tool-selected' : ''
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
            transformDragStartX,
            transformDragStartY,
            transformDragX,
            transformDragY,
          }}
        />
        {selectedTool !== selectedToolType.SELECT ? (
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
        <FocusedShapeFrames
          {...{
            focusedShapes,
          }}
        />
        <Selector
          {...{
            isDraggingTool,
            selectedTool,
            toolDragDeltaX,
            toolDragDeltaY,
            toolDragStartX,
            toolDragStartY,
          }}
        />
      </svg>
    </div>
  </DraggableCore>
);
