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

  xdescribe('Merkaba#handleCanvasDragStart', () => {});

  xdescribe('Merkaba#handleCanvasDrag', () => {});

  xdescribe('Merkaba#handleCanvasDragStop', () => {});
});
