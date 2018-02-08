import React from 'react';
import assert from 'assert';
import { Merkaba } from '../../src/components/merkaba';
import { selectedToolType } from '../../src/enums';
import { shallow } from 'enzyme';

let component;

describe('eventHandlers', () => {
  beforeEach(() => {
    component = shallow(<Merkaba />);
  });

  describe('Merkaba#handleToolClick', () => {
    beforeEach(() => {
      component.instance().handleToolClick(selectedToolType.RECTANGLE);
    });

    it('sets the selectedTool state', () => {
      assert.equal(component.state('selectedTool'), selectedToolType.RECTANGLE);
    });
  });

  describe('Merkaba#handleCanvasDragStart', () => {
    beforeEach(() => {
      component.instance().handleCanvasDragStart(null, {
        x: 10,
        y: 15,
        node: { offsetLeft: 5, offsetTop: 5 }
      });
    });

    it('sets the isDraggingTool state', () => {
      assert.equal(component.state('isDraggingTool'), true);
    });

    it('sets the toolDragStartX state', () => {
      assert.equal(component.state('toolDragStartX'), 5);
    });

    it('sets the toolDragStartY state', () => {
      assert.equal(component.state('toolDragStartY'), 10);
    });

    it('sets the toolDragDeltaX state', () => {
      assert.equal(component.state('toolDragDeltaX'), 0);
    });

    it('sets the toolDragDeltaY state', () => {
      assert.equal(component.state('toolDragDeltaY'), 0);
    });
  });

  describe('Merkaba#handleCanvasDrag', () => {
    beforeEach(() => {
      component.setState({
        toolDragDeltaX: 10,
        toolDragDeltaY: 15,
      });

      component.instance().handleCanvasDrag(null, { deltaX: -5, deltaY: 5, });
    });

    it('sets the toolDragDeltaX state', () => {
      assert.equal(component.state('toolDragDeltaX'), 5);
    });

    it('sets the toolDragDeltaY state', () => {
      assert.equal(component.state('toolDragDeltaY'), 20);
    });
  });

  describe('Merkaba#handleCanvasDragStop', () => {
    beforeEach(() => {
      component.setState({
        isDraggingTool: true,
        toolDragStartX: 10,
        toolDragStartY: 15
      });

      component.instance().handleCanvasDragStop();
    });

    it('sets the isDraggingTool state', () => {
      assert.equal(component.state('isDraggingTool'), false);
    });

    it('sets the toolDragStartX state', () => {
      assert.equal(String(component.state('toolDragStartX')), 'null');
    });

    it('sets the toolDragStartY state', () => {
      assert.equal(String(component.state('toolDragStartY')), 'null');
    });

    it('sets the toolDragDeltaX state', () => {
      assert.equal(String(component.state('toolDragDeltaX')), 'null');
    });

    it('sets the toolDragDeltaY state', () => {
      assert.equal(String(component.state('toolDragDeltaY')), 'null');
    });
  });
});
