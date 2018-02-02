export default {
  /**
   * @method merkaba.Merkaba#handleToolClick
   * @param {merkaba.module:enums.selectedTool} selectedTool
   */
  handleToolClick (selectedTool) {
    this.setState({ selectedTool });
  }
};
