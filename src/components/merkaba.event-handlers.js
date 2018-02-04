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
  handleCanvasDragStart (e, { x: toolDragStartX, y: toolDragStartY }) {
    this.setState({
      isDraggingTool: true,
      toolDragStartX,
      toolDragStartY
    });
  },

  handleCanvasDrag () {
  },

  /**
   * @method merkaba.Merkaba#handleCanvasDragStop
   */
  handleCanvasDragStop () {
    this.setState({
      isDraggingTool: false,
      toolDragStartX: null,
      toolDragStartY: null
    });
  },
};
