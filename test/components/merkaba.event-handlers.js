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
      component.instance().handleCanvasDragStart();
    });

    it('sets the isDraggingTool state', () => {
      assert.equal(component.state('isDraggingTool'), true);
    });
  });

  xdescribe('Merkaba#handleCanvasDrag', () => {});

  describe('Merkaba#handleCanvasDragStop', () => {
    beforeEach(() => {
      component.setState({ isDraggingTool: true });
      component.instance().handleCanvasDragStop();
    });

    it('sets the isDraggingTool state', () => {
      assert.equal(component.state('isDraggingTool'), false);
    });
  });
});
