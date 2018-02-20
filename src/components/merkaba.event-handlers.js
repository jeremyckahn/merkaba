import {
  selectedToolType,
  shapeFocusType,
  shapeType,
} from '../enums';

export default {
  /**
   * @method merkaba.Merkaba#handleToolClick
   * @param {merkaba.module:enums.selectedToolType} selectedTool
   */
  handleToolClick (selectedTool) {
    this.setState({ selectedTool });
  },

  /**
   * @method merkaba.Merkaba#handleCanvasDragStart
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleCanvasDragStart (e, { x, y, node: { offsetLeft, offsetTop } }) {
    if (this.state.selectedTool === selectedToolType.NONE) {
      return;
    }

    this.setState({
      isDraggingTool: true,
      toolDragStartX: x - offsetLeft,
      toolDragStartY: y - offsetTop,
      toolDragDeltaX: 0,
      toolDragDeltaY: 0,
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.LIVE,
        bufferIndex: null
      }
    });
  },

  handleCanvasDrag (e, { deltaX, deltaY }) {
    if (this.state.selectedTool === selectedToolType.NONE) {
      return;
    }

    const {
      toolDragDeltaX,
      toolDragDeltaY
    } = this.state;

    this.setState({
      toolDragDeltaX: toolDragDeltaX + deltaX,
      toolDragDeltaY: toolDragDeltaY + deltaY
    });
  },

  /**
   * @method merkaba.Merkaba#handleCanvasDragStop
   */
  handleCanvasDragStop () {
    if (this.state.selectedTool === selectedToolType.NONE) {
      return;
    }

    const {
      selectedTool,
      toolDragStartX,
      toolDragStartY,
      toolDragDeltaX,
      toolDragDeltaY,
      toolStrokeColor,
      toolFillColor,
      toolStrokeWidth,
    } = this.state;

    const bufferShapes = this.state.bufferShapes.slice();

    if (toolDragDeltaX && toolDragDeltaY) {
      switch (selectedTool) {
        case selectedToolType.RECTANGLE:
          bufferShapes.unshift({
            type: shapeType.RECT,
            x: toolDragStartX,
            y: toolDragStartY,
            width: toolDragDeltaX,
            height: toolDragDeltaY,
            rx: 0,
            ry: 0,
            stroke: toolStrokeColor,
            fill: toolFillColor,
            strokeWidth: toolStrokeWidth,
          });

          break;
      }
    }

    this.setState({
      isDraggingTool: false,
      toolDragStartX: null,
      toolDragStartY: null,
      toolDragDeltaX: null,
      toolDragDeltaY: null,
      bufferShapes,

      // TODO: This should probably be changed to reference a buffer shape for
      // a better UX
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.NONE,
        bufferIndex: null
      }
    });
  },
};
