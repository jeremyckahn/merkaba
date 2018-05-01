import { selectedToolType, shapeFocusType, shapeType } from '../enums';

export default {
  /**
   * @method merkaba.Merkaba#handleToolClick
   * @param {merkaba.module:enums.selectedToolType} selectedTool
   */
  handleToolClick(selectedTool) {
    this.setState({ selectedTool });
  },

  /**
   * @method merkaba.Merkaba#handleShapeClick
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleShapeClick(e) {
    this.focusBufferShape(e.target);
  },

  /**
   * @method merkaba.Merkaba#handlePropertyChange
   * @param {external:React.SyntheticEvent} e
   */
  handlePropertyChange(e) {
    const {
      target: { name, type, value, valueAsNumber },
    } = e;

    this.updateFocusedBufferShapeProperty(
      name,
      type === 'number' && !isNaN(valueAsNumber) ? valueAsNumber : value
    );
  },

  /**
   * @method merkaba.Merkaba#handleColorPropertyChange
   * @param {external:ReactColor.Color} color
   * @param {string} name
   */
  handleColorPropertyChange(color, name) {
    const { r, g, b, a } = color.rgb;

    this.updateFocusedBufferShapeProperty(name, `rgba(${r}, ${g}, ${b}, ${a})`);
  },

  /**
   * @method merkaba.Merkaba#handleCanvasMouseDown
   * @param {external:React.SyntheticEvent} e
   */
  handleCanvasMouseDown({ target, currentTarget }) {
    if (target.nodeName !== 'svg') {
      return;
    }

    const {
      x,
      y,
      width,
      height,
      top,
      right,
      bottom,
      left,
    } = target.getBoundingClientRect();

    this.setState({
      svgBoundingRect: { x, y, width, height, top, right, bottom, left },
    });

    this.setState({
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.NONE,
        bufferIndex: null,
      },
    });
  },

  /**
   * @method merkaba.Merkaba#handleCanvasDragStart
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleCanvasDragStart(e, data) {
    const {
      target: { nodeName, classList },
    } = e;

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
      } else if (classList.contains('selection-handle-rotator')) {
        return this.handleSelectionRotatorDragStart(...arguments);
      }
    } else if (this.state.selectedTool === selectedToolType.NONE) {
      return;
    }

    const {
      x,
      y,
      node: { offsetLeft, offsetTop },
    } = data;

    this.setState({
      isDraggingTool: true,
      toolDragStartX: x - offsetLeft,
      toolDragStartY: y - offsetTop,
      toolDragDeltaX: 0,
      toolDragDeltaY: 0,
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.LIVE,
        bufferIndex: null,
      },
    });
  },

  /**
   * @method merkaba.Merkaba#handleCanvasDrag
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleCanvasDrag(e, { deltaX, deltaY }) {
    const {
      isDraggingSelectionHandle,
      isDraggingSelectionRotator,
      isDraggingShape,
      selectedTool,
      toolDragDeltaX,
      toolDragDeltaY,
    } = this.state;

    if (isDraggingShape) {
      return this.handleBufferedShapeDrag(...arguments);
    } else if (isDraggingSelectionHandle) {
      return this.handleSelectionHandleDrag(...arguments);
    } else if (isDraggingSelectionRotator) {
      return this.handleSelectionRotatorDrag(...arguments);
    } else if (selectedTool === selectedToolType.NONE) {
      return;
    }

    this.setState({
      toolDragDeltaX: toolDragDeltaX + deltaX,
      toolDragDeltaY: toolDragDeltaY + deltaY,
    });
  },

  /**
   * @method merkaba.Merkaba#handleCanvasDragStop
   */
  handleCanvasDragStop(e) {
    const {
      isDraggingSelectionHandle,
      isDraggingSelectionRotator,
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
    } else if (isDraggingSelectionRotator) {
      return this.handleSelectionRotatorDragStop(...arguments);
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
      toolRotate: 0,
      bufferShapes,
      selectedTool: selectedToolType.NONE,
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.BUFFER,
        bufferIndex: 0,
      },
    });
  },

  /**
   * @method merkaba.Merkaba#handleBufferedShapeDragStart
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleBufferedShapeDragStart(e) {
    this.focusBufferShape(e.target);
    this.setState({ isDraggingShape: true });
  },

  /**
   * @method merkaba.Merkaba#handleBufferedShapeDrag
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleBufferedShapeDrag(e, { deltaX, deltaY }) {
    const focusedShape = this.getFocusedShape();

    this.updateFocusedBufferShape({
      x: focusedShape.x + deltaX,
      y: focusedShape.y + deltaY,
    });
  },

  /**
   * @method merkaba.Merkaba#handleBufferedShapeDragStop
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleBufferedShapeDragStop() {
    this.setState({ isDraggingShape: false });
  },

  /**
   * @method merkaba.Merkaba#handleSelectionHandleDragStart
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleSelectionHandleDragStart(e, { x, y }) {
    const draggedHandleOrientation = e.target.getAttribute('orientation');
    const { svgBoundingRect } = this.state;

    this.setState({
      draggedHandleOrientation,
      isDraggingSelectionHandle: true,
      selectionDragStartX: x - svgBoundingRect.x,
      selectionDragStartY: y - svgBoundingRect.y,
      shapeStateBeforeDragTransform: this.getFocusedShape(),
    });
  },

  /**
   * @method merkaba.Merkaba#handleSelectionHandleDrag
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleSelectionHandleDrag(e, { x, y }) {
    const { svgBoundingRect, shapeStateBeforeDragTransform } = this.state;

    this.setState({
      selectionDragX: x - svgBoundingRect.x,
      selectionDragY: y - svgBoundingRect.y,
    });

    this.updateFocusedBufferShape(shapeStateBeforeDragTransform);

    this.applyMatrixToFocusedShape(this.getAggregateDragMatrix());
  },

  /**
   * @method merkaba.Merkaba#handleSelectionHandleDragStop
   * @param {external:React.SyntheticEvent} e
   */
  handleSelectionHandleDragStop(e) {
    this.setState({
      draggedHandleOrientation: null,
      isDraggingSelectionHandle: false,
      shapeStateBeforeDragTransform: {},
      selectionDragStartX: null,
      selectionDragStartY: null,
      selectionDragX: null,
      selectionDragY: null,
    });
  },

  /**
   * @method merkaba.Merkaba#handleSelectionRotatorDragStart
   * @param {external:React.SyntheticEvent} e
   */
  handleSelectionRotatorDragStart(e) {
    this.setState({ isDraggingSelectionRotator: true });
  },

  /**
   * @method merkaba.Merkaba#handleSelectionRotatorDrag
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleSelectionRotatorDrag(e, data) {
    const {
      height,
      width,
      x: shapeX,
      y: shapeY,
      rotate,
    } = this.getFocusedShape();
    const { lastX, lastY, x: newX, y: newY } = data;

    const originX = shapeX + width / 2;
    const originY = shapeY + height / 2;

    const oldAngle = Math.atan2(lastY - originY, lastX - originX);
    const newAngle = Math.atan2(newY - originY, newX - originX);
    const deltaDegrees = (newAngle - oldAngle) * 180 / Math.PI;

    this.updateFocusedBufferShapeProperty(
      'rotate',
      (360 + (rotate + deltaDegrees)) % 360
    );
  },

  /**
   * @method merkaba.Merkaba#handleSelectionRotatorDragStop
   * @param {external:React.SyntheticEvent} e
   */
  handleSelectionRotatorDragStop(e) {
    this.setState({ isDraggingSelectionRotator: false });
  },
};
