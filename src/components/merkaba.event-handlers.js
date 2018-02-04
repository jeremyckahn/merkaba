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
  handleCanvasDragStart (e, data) {
    this.setState({ isDraggingTool: true });
  },

  handleCanvasDrag () {
  },

  handleCanvasDragStop () {
    this.setState({ isDraggingTool: false });
  },
};
