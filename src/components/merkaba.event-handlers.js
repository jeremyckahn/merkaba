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

  /**
   * @method merkaba.Merkaba#handleCanvasDrag
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
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
      bufferShapes.unshift(this.getLiveShape());
    }

    this.setState({
      isDraggingTool: false,
      toolDragStartX: null,
      toolDragStartY: null,
      toolDragDeltaX: null,
      toolDragDeltaY: null,
      bufferShapes,
      selectedTool: selectedToolType.NONE,
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.BUFFER,
        bufferIndex: 0
      }
    });
  },

  /**
   * @method merkaba.Merkaba#handlePropertyChange
   * @param {external:React.SyntheticEvent} e
   */
  handlePropertyChange (e) {
    const { target: { name, type, value, valueAsNumber } } = e;
    const {
      bufferShapes,
      focusedShapeCursor: { bufferIndex }
    } = this.state;

    const shape = Object.assign({}, bufferShapes[bufferIndex]);
    shape[name] = type === 'number' && !isNaN(valueAsNumber) ?
      valueAsNumber
      : value;

    const newBuffer = bufferShapes.slice();
    newBuffer[bufferIndex] = shape;

    this.setState({ bufferShapes: newBuffer });
  },
};
