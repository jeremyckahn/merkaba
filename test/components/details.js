import React from 'react';
import { Details } from '../../src/components/details';
import { selectedToolType } from '../../src/enums';
import { mount, shallow } from 'enzyme';
import assert from 'assert';

let component;

describe.only('Details', () => {
  beforeEach(() => {
    component = shallow(<Details />);
  });

  describe('nothing selected (default)', () => {
    it('doesn\'t render anything', () => {
      assert.equal(component.children().length, 0);
    });
  });

  describe('selectedTool === selectedToolType.RECTANGLE', () => {
    beforeEach(() => {
      component = shallow(<Details selectedTool={selectedToolType.RECTANGLE}/>);
    });

    it('renders inputs for a rect', () => {
      assert.equal(component.find('input[name="x"]').length, 1);
      assert.equal(component.find('input[name="y"]').length, 1);
      assert.equal(component.find('input[name="width"]').length, 1);
      assert.equal(component.find('input[name="height"]').length, 1);
      assert.equal(component.find('input[name="strokeWidth"]').length, 1);
      assert.equal(component.find('input[name="fill"]').length, 1);

      // TODO: Implement this
      //assert.equal(component.find('input[name="stroke"]').length, 1);
    });
  });
});
