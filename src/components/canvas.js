import React from 'react';
import { array, bool, func, number, string } from 'prop-types';
import { DraggableCore } from 'react-draggable';
import { selectedToolType, shapeType } from '../enums';
import { rotatorHitArea } from '../constants';
import { Rect } from './shapes';

const Buffer = ({ bufferShapes }) =>
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

Buffer.propTypes = {
  bufferShapes: array.isRequired,
};

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
            handleConfig.map(({ x, y }, j) => (
              <ellipse
                key={`handle-rotator-${j}`}
                {...{
                  className: 'selection-handle-rotator',
                  cx: x,
                  cy: y,
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
                key={`handle-${j}`}
                {...{
                  className: `selection-handle ${orientation}`,
                  cx: x,
                  cy: y,
                  orientation,
                  rx: 5,
                  ry: 5,
                }}
              />
            ))}
        </g>
      )
  );

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

Selector.propTypes = {
  isDraggingTool: bool.isRequired,
  selectedTool: string.isRequired,
  toolDragDeltaX: number,
  toolDragDeltaY: number,
  toolDragStartX: number,
  toolDragStartY: number,
};

/**
 * @param {boolean} isDraggingTool
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
 * @function merkaba.Canvas
 * @param {Object} props
 * @returns {Element}
 */
export const Canvas = ({
  bufferShapes = [],
  focusedShapes = [],
  handleCanvasDrag,
  handleCanvasDragStart,
  handleCanvasDragStop,
  handleCanvasMouseDown,
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

Canvas.propTypes = {
  bufferShapes: array.isRequired,
  focusedShapes: array.isRequired,
  handleCanvasDrag: func.isRequired,
  handleCanvasDragStart: func.isRequired,
  handleCanvasDragStop: func.isRequired,
  handleCanvasMouseDown: func.isRequired,
  isDraggingTool: bool.isRequired,
  selectedTool: string.isRequired,
  toolDragDeltaX: number,
  toolDragDeltaY: number,
  toolDragStartX: number,
  toolDragStartY: number,
  toolFillColor: string,
  toolRotate: number,
  toolStrokeColor: string,
  toolStrokeWidth: number,
};
