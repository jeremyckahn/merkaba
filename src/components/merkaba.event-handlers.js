export default {
  /**
   * @method merkaba.Merkaba#handleToolClick
   * @param {merkaba.module:enums.selectedToolType} selectedTool
   */
  handleToolClick (selectedTool) {
    this.setState({ selectedTool });
  },

  handleCanvasDragStart () {
    this.setState({ isDraggingTool: true });
  },

  handleCanvasDrag () {
  },

  handleCanvasDragStop () {
    this.setState({ isDraggingTool: false });
  },
};
