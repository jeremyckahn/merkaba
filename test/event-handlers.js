import React from 'react';
import assert from 'assert';
import { Merkaba } from '../src/components/merkaba';
import { selectedTool } from '../src/enums';
import { shallow } from 'enzyme';

let component;

describe('eventHandlers', () => {
  beforeEach(() => {
    component = shallow(<Merkaba />);
  });

  describe('Merkaba#handleToolClick', () => {
    beforeEach(() => {
      component.instance().handleToolClick(selectedTool.RECTANGLE);
    });

    it('sets the selectedTool state', () => {
      assert.equal(component.state('selectedTool'), selectedTool.RECTANGLE);
    });
  });
});
