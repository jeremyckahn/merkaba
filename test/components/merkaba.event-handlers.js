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
      component.instance().handleCanvasDragStart(null, { x: 10, y: 15 });
    });

    it('sets the isDraggingTool state', () => {
      assert.equal(component.state('isDraggingTool'), true);
    });

    it('sets the toolDragStartX state', () => {
      assert.equal(component.state('toolDragStartX'), 10);
    });

    it('sets the toolDragStartY state', () => {
      assert.equal(component.state('toolDragStartY'), 15);
    });
  });

  xdescribe('Merkaba#handleCanvasDrag', () => {});

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
  });
});
