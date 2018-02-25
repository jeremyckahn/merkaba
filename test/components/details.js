import React from 'react';
import { Details } from '../../src/components/details';
import {
  selectedToolType,
  shapeType
} from '../../src/enums';
import { mount, shallow } from 'enzyme';
import assert from 'assert';

let component;
const sampleRect = {
  type: shapeType.RECT,
  x: 10,
  y: 15,
  width: 10,
  height: 10,
  fill: null,
  stroke: null,
  strokeWidth: null,
}

describe('Details', () => {
  beforeEach(() => {
    component = shallow(<Details />);
  });

  describe('nothing selected (default)', () => {
    it('doesn\'t render anything', () => {
      assert.equal(component.children().length, 0);
    });
  });

  describe('focusedShape.type === shapeType.RECT', () => {
    beforeEach(() => {
      component = mount(<Details focusedShape={sampleRect}/>);
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
