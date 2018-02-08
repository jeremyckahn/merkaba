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
    this.setState({
      isDraggingTool: true,
      toolDragStartX: x - offsetLeft,
      toolDragStartY: y - offsetTop,
      toolDragDeltaX: 0,
      toolDragDeltaY: 0
    });
  },

  handleCanvasDrag (e, { deltaX, deltaY }) {
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
    this.setState({
      isDraggingTool: false,
      toolDragStartX: null,
      toolDragStartY: null,
      toolDragDeltaX: null,
      toolDragDeltaY: null
    });
  },
};
