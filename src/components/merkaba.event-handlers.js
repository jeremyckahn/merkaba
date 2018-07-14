import { selectedToolType, shapeFocusType } from '../enums';

export default {
  /**
   * @function merkaba.Merkaba#handleToolClick
   * @param {merkaba.module:enums.selectedToolType} selectedTool
   */
  handleToolClick(selectedTool) {
    this.setState({ selectedTool });
  },

  /**
   * @function merkaba.Merkaba#handlePropertyChange
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
   * @function merkaba.Merkaba#handleColorPropertyChange
   * @param {external:ReactColor.Color} color
   * @param {string} name
   */
  handleColorPropertyChange(color, name) {
    const { r, g, b, a } = color.rgb;

    this.updateFocusedBufferShapeProperty(name, `rgba(${r}, ${g}, ${b}, ${a})`);
  },

  /**
   * @function merkaba.Merkaba#handleCanvasMouseDown
   * @param {external:React.SyntheticEvent} e
   */
  handleCanvasMouseDown({ target }) {
    const svg =
      target.nodeName === 'svg' ? target : target.nearestViewportElement;

    const {
      bottom,
      height,
      left,
      right,
      top,
      width,
      x,
      y,
    } = svg.getBoundingClientRect();

    this.setState({
      svgBoundingRect: {
        bottom,
        height,
        left,
        right,
        top,
        width,
        x,
        y,
      },
    });

    if (target.nodeName !== 'svg') {
      return;
    }

    this.setState({
      focusedShapeCursor: {
        shapeFocus: shapeFocusType.NONE,
        bufferIndices: [],
      },
    });
  },

  /**
   * @function merkaba.Merkaba#handleCanvasDragStart
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleCanvasDragStart(e, data) {
    const {
      target: { classList, nodeName },
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
    }

    const {
      x,
      y,
      node: { offsetLeft, offsetTop },
    } = data;

    const focusedShapeCursor = {
      shapeFocus:
        this.state.selectedTool === selectedToolType.SELECT
          ? shapeFocusType.NONE
          : shapeFocusType.LIVE,
      bufferIndices: [],
    };

    this.setState({
      focusedShapeCursor,
      isDraggingTool: true,
      toolDragDeltaX: 0,
      toolDragDeltaY: 0,
      toolDragStartX: x - offsetLeft,
      toolDragStartY: y - offsetTop,
    });
  },

  /**
   * @function merkaba.Merkaba#handleCanvasDrag
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
    }

    const isUsingSelectTool = selectedTool === selectedToolType.SELECT;
    const selectedShapeIndices =
      isUsingSelectTool && this.getSelectedShapeBufferIndices();

    const focusedShapeCursor = isUsingSelectTool
      ? {
          shapeFocus: selectedShapeIndices.length
            ? shapeFocusType.BUFFER
            : shapeFocusType.NONE,
          bufferIndices: selectedShapeIndices,
        }
      : this.state.focusedShapeCursor;

    this.setState({
      focusedShapeCursor,
      toolDragDeltaX: toolDragDeltaX + deltaX,
      toolDragDeltaY: toolDragDeltaY + deltaY,
    });
  },

  /**
   * @function merkaba.Merkaba#handleCanvasDragStop
   */
  handleCanvasDragStop() {
    const {
      isDraggingSelectionHandle,
      isDraggingSelectionRotator,
      isDraggingShape,
      selectedTool,
      toolDragDeltaX,
      toolDragDeltaY,
    } = this.state;

    if (isDraggingShape) {
      return this.handleBufferedShapeDragStop(...arguments);
    } else if (isDraggingSelectionHandle) {
      return this.handleSelectionHandleDragStop(...arguments);
    } else if (isDraggingSelectionRotator) {
      return this.handleSelectionRotatorDragStop(...arguments);
    }

    const bufferShapes = this.state.bufferShapes.slice();
    const isUsingSelectTool = selectedTool === selectedToolType.SELECT;

    if (!isUsingSelectTool && toolDragDeltaX && toolDragDeltaY) {
      bufferShapes.unshift(this.getLiveShape());
    }

    const focusedShapeCursor = isUsingSelectTool
      ? this.state.focusedShapeCursor
      : {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [0],
        };

    this.setState({
      bufferShapes,
      focusedShapeCursor,
      isDraggingTool: false,
      selectedTool: selectedToolType.SELECT,
      toolDragDeltaX: null,
      toolDragDeltaY: null,
      toolDragStartX: null,
      toolDragStartY: null,
      toolRotate: 0,
    });
  },

  /**
   * @function merkaba.Merkaba#handleBufferedShapeDragStart
   * @param {external:React.SyntheticEvent} e
   */
  handleBufferedShapeDragStart(e) {
    if (
      !~this.state.focusedShapeCursor.bufferIndices.indexOf(
        Number(e.target.getAttribute('data-buffer-index'))
      )
    ) {
      this.focusBufferShape(e.target);
    }

    this.setState({ isDraggingShape: true });
  },

  /**
   * @function merkaba.Merkaba#handleBufferedShapeDrag
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleBufferedShapeDrag(e, { deltaX, deltaY }) {
    const {
      focusedShapeCursor: { bufferIndices },
      bufferShapes,
    } = this.state;

    bufferIndices.forEach(bufferIndex => {
      const { x, y } = bufferShapes[bufferIndex];

      this.updateBufferShape(bufferIndex, {
        x: x + deltaX,
        y: y + deltaY,
      });
    });
  },

  /**
   * @function merkaba.Merkaba#handleBufferedShapeDragStop
   */
  handleBufferedShapeDragStop() {
    this.setState({ isDraggingShape: false });
  },

  /**
   * @function merkaba.Merkaba#handleSelectionHandleDragStart
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleSelectionHandleDragStart(e, { x, y }) {
    const draggedHandleOrientation = e.target.getAttribute('orientation');
    const { svgBoundingRect } = this.state;

    this.setState({
      draggedHandleOrientation,
      isDraggingSelectionHandle: true,
      transformDragStartX: x - svgBoundingRect.x,
      transformDragStartY: y - svgBoundingRect.y,
      shapeStateBeforeDragTransform: this.getFocusedShapes()[0],
    });
  },

  /**
   * @function merkaba.Merkaba#handleSelectionHandleDrag
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleSelectionHandleDrag(e, { x, y }) {
    const { svgBoundingRect, shapeStateBeforeDragTransform } = this.state;

    this.setState({
      transformDragX: x - svgBoundingRect.x,
      transformDragY: y - svgBoundingRect.y,
    });

    this.updateFocusedBufferShapes(shapeStateBeforeDragTransform);

    this.applyMatrixToFocusedShape(this.getAggregateDragMatrix());
  },

  /**
   * @function merkaba.Merkaba#handleSelectionHandleDragStop
   */
  handleSelectionHandleDragStop() {
    this.setState({
      draggedHandleOrientation: null,
      isDraggingSelectionHandle: false,
      transformDragStartX: null,
      transformDragStartY: null,
      transformDragX: null,
      transformDragY: null,
      shapeStateBeforeDragTransform: {},
    });
  },

  /**
   * @function merkaba.Merkaba#handleSelectionRotatorDragStart
   */
  handleSelectionRotatorDragStart() {
    this.setState({ isDraggingSelectionRotator: true });
  },

  /**
   * @function merkaba.Merkaba#handleSelectionRotatorDrag
   * @param {external:React.SyntheticEvent} e
   * @param {external:Draggable.DraggableData} data
   */
  handleSelectionRotatorDrag(e, data) {
    const [
      { height, rotate, width, x: shapeX, y: shapeY },
    ] = this.getFocusedShapes();
    const { lastX, lastY, x: newX, y: newY } = data;
    const { x: svgX, y: svgY } = this.state.svgBoundingRect;

    const originX = shapeX + width / 2;
    const originY = shapeY + height / 2;

    const oldAngle = Math.atan2(lastY - svgY - originY, lastX - svgX - originX);
    const newAngle = Math.atan2(newY - svgY - originY, newX - svgX - originX);
    const deltaDegrees = (newAngle - oldAngle) * 180 / Math.PI;

    this.updateFocusedBufferShapeProperty(
      'rotate',
      (360 + (rotate + deltaDegrees)) % 360
    );
  },

  /**
   * @function merkaba.Merkaba#handleSelectionRotatorDragStop
   */
  handleSelectionRotatorDragStop() {
    this.setState({ isDraggingSelectionRotator: false });
  },

  /**
   * @function merkaba.Merkaba#handleLayerSortStart
   * @param {Object} config
   * @param {number} config.index
   */
  handleLayerSortStart({ index: layerIndex }) {
    this.focusBufferByLayerIndex(layerIndex);
  },

  /**
   * @function merkaba.Merkaba#handleLayerSortEnd
   * @param {Object} config
   * @param {number} config.oldIndex
   * @param {number} config.newIndex
   */
  handleLayerSortEnd({ oldIndex, newIndex }) {
    const {
      focusedShapeCursor,
      bufferShapes: { length: bufferShapesLength },
    } = this.state;
    const reversedNewIndex = bufferShapesLength - 1 - newIndex;
    const bufferShapes = this.state.bufferShapes.slice();
    const [shape] = bufferShapes.splice(bufferShapesLength - 1 - oldIndex, 1);
    bufferShapes.splice(reversedNewIndex, 0, shape);

    const newFocusedShapeCursor = Object.assign({}, focusedShapeCursor, {
      bufferIndices: [reversedNewIndex],
    });

    this.setState({ bufferShapes, focusedShapeCursor: newFocusedShapeCursor });
  },

  /**
   * @function merkaba.Merkaba#handleLayerClick
   * @param {number} layerIndex
   */
  handleLayerClick(layerIndex) {
    this.focusBufferByLayerIndex(layerIndex);
  },

  /**
   * @function merkaba.Merkaba#handleDeleteShapeClick
   * @param {number} bufferShapeIndex
   */
  handleDeleteShapeClick(bufferShapeIndex) {
    const bufferShapes = [...this.state.bufferShapes];
    bufferShapes.splice(bufferShapeIndex, 1);

    this.setState({ bufferShapes });
  },

  /**
   * @function merkaba.Merkaba#handleDeleteKeyPress
   */
  handleDeleteKeyPress() {
    this.deleteFocusedShapes();
  },

  /**
   * @function merkaba.Merkaba#handleNudgeKeyPress
   * @param {external:React.SyntheticEvent} e
   */
  handleNudgeKeyPress({ key }) {
    const {
      bufferShapes,
      focusedShapeCursor: { bufferIndices },
    } = this.state;

    let deltaX = 0;
    let deltaY = 0;

    switch (key) {
      case 'ArrowUp':
        deltaY = -1;
        break;
      case 'ArrowRight':
        deltaX = 1;
        break;
      case 'ArrowDown':
        deltaY = 1;
        break;
      case 'ArrowLeft':
        deltaX = -1;
        break;
    }

    bufferIndices.forEach(index => {
      const { x, y } = bufferShapes[index];
      this.updateBufferShape(index, {
        x: x + deltaX,
        y: y + deltaY,
      });
    });
  },

  /**
   * @function merkaba.Merkaba#handleUndoKeypress
   */
  handleUndoKeypress() {
    this.revertToSnapshot();
  },

  /**
   * @function merkaba.Merkaba#handleRedoKeypress
   */
  handleRedoKeypress() {
    this.proceedToSnapshot();
  },

  /**
   * @function merkaba.Merkaba#handleDetailsInputFocus
   */
  handleDetailsInputFocus() {
    // Intentionally defined as an empty function; this needs to be stubbed so
    // that it can be wrapped by merkaba.Merkaba#setUpUndoableActions
  },
};
