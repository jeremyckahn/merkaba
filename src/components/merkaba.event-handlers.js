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
   * @method merkaba.Merkaba#handleCanvasClick
   * @param {external:React.SyntheticEvent} e
   */
  handleCanvasClick ({ target, currentTarget }) {
    if (target !== currentTarget) {
      return;
    }

    this.setState({
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.NONE,
        bufferIndex: null
      }
    });
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
   * @method merkaba.Merkaba#handleShapeClick
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleShapeClick (e) {
    this.focusBufferShape(e.target);
  },

  /**
   * @method merkaba.Merkaba#handleShapeDragStart
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleShapeDragStart (e) {
    this.focusBufferShape(e.target);
    this.setState({ isDraggingShape: true });
  },

  /**
   * @method merkaba.Merkaba#handleShapeDrag
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleShapeDrag (e, { deltaX, deltaY }) {
    const {
      bufferShapes,
      focusedShapeCursor: { bufferIndex }
    } = this.state;
    const focusedShape = this.getFocusedShape();

    const modifiedShape = Object.assign({}, focusedShape);
    modifiedShape.x += deltaX;
    modifiedShape.y += deltaY;

    const modifiedBuffer = bufferShapes.slice();
    modifiedBuffer[bufferIndex] = modifiedShape;

    this.setState({ bufferShapes: modifiedBuffer });
  },

  /**
   * @method merkaba.Merkaba#handleShapeDragStop
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleShapeDragStop () {
    this.setState({ isDraggingShape: false });
  },

  /**
   * @method merkaba.Merkaba#handlePropertyChange
   * @param {external:React.SyntheticEvent} e
   */
  handlePropertyChange (e) {
    const { target: { name, type, value, valueAsNumber } } = e;

    this.updateBufferShapeProperty(
      this.state.focusedShapeCursor.bufferIndex,
      name,
      type === 'number' && !isNaN(valueAsNumber) ?
        valueAsNumber
        : value
    );
  },

  /**
   * @method merkaba.Merkaba#handleColorPropertyChange
   * @param {external:ReactColor.Color} color
   * @param {string} name
   */
  handleColorPropertyChange (color, name) {
    const { r, g, b, a } = color.rgb;

    this.updateBufferShapeProperty(
      this.state.focusedShapeCursor.bufferIndex,
      name,
      `rgba(${r}, ${g}, ${b}, ${a})`
    );
  }
};
