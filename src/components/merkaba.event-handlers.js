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
   * @method merkaba.Merkaba#handleShapeClick
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleShapeClick (e) {
    this.focusBufferShape(e.target);
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
  },

  /**
   * @method merkaba.Merkaba#handleCanvasMouseDown
   * @param {external:React.SyntheticEvent} e
   */
  handleCanvasMouseDown ({ target, currentTarget }) {
    if (target.nodeName !== 'svg') {
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
  handleCanvasDragStart (e, data) {
    const { target: { nodeName, classList } } = e;

    // Because of limitations of how DraggableCore handles events and the fact
    // that all SVG shapes (buffered, live, selector components, etc.) are all
    // in a single <svg> element, all DraggableCore event interaction is
    // handled through a top-level set of event handlers (handleCanvasDragX).
    // Based on what the user actually intends to interact with (which is
    // worked out by examining the state of the app or details around the event
    // target), the event handling is then potentially "delegated" to more
    // specific event handlers like handleShapeDragX.
    if (nodeName !== 'svg') {
      if (classList.contains('buffered')) {
        return this.handleBufferedShapeDragStart(...arguments);
      } else if (classList.contains('selection-handle')) {
        return this.handleSelectionHandleDragStart(...arguments);
      }
    } else if (this.state.selectedTool === selectedToolType.NONE) {
      return;
    }

    const { x, y, node: { offsetLeft, offsetTop } } = data;

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
    const {
      isDraggingSelectionHandle,
      isDraggingShape,
      selectedTool,
      toolDragDeltaX,
      toolDragDeltaY,
    } = this.state;

    if (isDraggingShape) {
      return this.handleBufferedShapeDrag(...arguments);
    } else if (isDraggingSelectionHandle) {
      return this.handleSelectionHandleDrag(...arguments);
    } else if (selectedTool === selectedToolType.NONE) {
      return;
    }

    this.setState({
      toolDragDeltaX: toolDragDeltaX + deltaX,
      toolDragDeltaY: toolDragDeltaY + deltaY
    });
  },

  /**
   * @method merkaba.Merkaba#handleCanvasDragStop
   */
  handleCanvasDragStop (e) {
    const {
      isDraggingSelectionHandle,
      isDraggingShape,
      selectedTool,
      toolDragDeltaX,
      toolDragDeltaY,
      toolDragStartX,
      toolDragStartY,
      toolFillColor,
      toolStrokeColor,
      toolStrokeWidth,
    } = this.state;

    if (isDraggingShape) {
      return this.handleBufferedShapeDragStop(...arguments);
    } else if (isDraggingSelectionHandle) {
      return this.handleSelectionHandleDragStop(...arguments);
    } else if (selectedTool === selectedToolType.NONE) {
      return;
    }

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
   * @method merkaba.Merkaba#handleBufferedShapeDragStart
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleBufferedShapeDragStart (e) {
    this.focusBufferShape(e.target);
    this.setState({ isDraggingShape: true });
  },

  /**
   * @method merkaba.Merkaba#handleBufferedShapeDrag
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleBufferedShapeDrag (e, { deltaX, deltaY }) {
    const focusedShape = this.getFocusedShape();

    this.updateBufferShape(this.state.focusedShapeCursor.bufferIndex, {
      x: focusedShape.x + deltaX,
      y: focusedShape.y + deltaY
    });
  },

  /**
   * @method merkaba.Merkaba#handleBufferedShapeDragStop
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleBufferedShapeDragStop () {
    this.setState({ isDraggingShape: false });
  },

  /**
   * @method merkaba.Merkaba#handleSelectionHandleDragStart
   * @param {external:React.SyntheticEvent} e
   */
  handleSelectionHandleDragStart (e) {
    const draggedHandleOrientation = e.target.getAttribute('orientation');
    this.setState({
      draggedHandleOrientation,
      isDraggingSelectionHandle: true
    });
  },

  /**
   * @method merkaba.Merkaba#handleSelectionHandleDrag
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleSelectionHandleDrag (e, { deltaX, deltaY }) {
    const {
      draggedHandleOrientation,
      focusedShapeCursor: { bufferIndex }
    } = this.state;
    const modifiedShape = Object.assign({}, this.getFocusedShape());

    switch (draggedHandleOrientation) {
      case 'top-left':
        modifiedShape.x += deltaX;
        modifiedShape.y += deltaY;
        modifiedShape.width -= deltaX;
        modifiedShape.height -= deltaY;
      break;

      case 'top-right':
        modifiedShape.y += deltaY;
        modifiedShape.width += deltaX;
        modifiedShape.height -= deltaY;
      break;

      case 'bottom-right':
        modifiedShape.width += deltaX;
        modifiedShape.height += deltaY;
      break;

      case 'bottom-left':
        modifiedShape.x += deltaX;
        modifiedShape.width -= deltaX;
        modifiedShape.height += deltaY;
      break;
    }

    this.updateBufferShape(bufferIndex, modifiedShape);
  },

  /**
   * @method merkaba.Merkaba#handleSelectionHandleDragStop
   * @param {external:React.SyntheticEvent} e
   */
  handleSelectionHandleDragStop (e) {
    this.setState({
      draggedHandleOrientation: null,
      isDraggingSelectionHandle: false
    });
  },
};
