import React from 'react';
import { Details } from '../../src/components/details';
import {
  selectedToolType,
  shapeType
} from '../../src/enums';
import { mount, shallow } from 'enzyme';
import assert from 'assert';

const sampleRect = {
  type: shapeType.RECT,
  x: 10,
  y: 15,
  width: 10,
  height: 10,
  fill: null,
  stroke: null,
  strokeWidth: 1,
};

let component;

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
      [
        'x',
        'y',
        'width',
        'height',
        'strokeWidth',
        // TODO: Implement these
        /*'stroke', 'fill'*/
      ].forEach(property =>
        assert.equal(
          component.find(`input[name="${property}"]`).length,
          1
        )
      );
    });

    it('populates inputs', () => {
      [
        'x',
        'y',
        'width',
        'height',
        'strokeWidth',
        // TODO: Implement these
        /*'stroke', 'fill'*/
      ].forEach(property =>
        assert.equal(
          component.find(`input[name="${property}"]`).prop('value'),
          sampleRect[property]
        )
      );
    });
  });
});
