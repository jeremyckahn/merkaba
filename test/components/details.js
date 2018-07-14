import React from 'react';
import { Details } from '../../src/components/details';
import { mount, shallow } from 'enzyme';
import assert from 'assert';
import { sampleRect } from '../test-utils.js';

let component;
let rect;

describe('Details', () => {
  const getDetails = (props = {}) => (
    <Details
      {...Object.assign(
        {
          focusedShapes: [],
          handleColorPropertyChange: () => {},
          handleDetailsInputFocus: () => {},
          handlePropertyChange: () => {},
        },
        props
      )}
    />
  );

  beforeEach(() => {
    rect = sampleRect({
      fill: 'rgba(0, 0, 0, 1)',
      stroke: 'rgba(0, 0, 0, 1)',
    });
    component = shallow(getDetails());
  });

  describe('nothing selected (default)', () => {
    it("doesn't render anything", () => {
      assert.equal(component.children().length, 0);
    });
  });

  describe('single shape selected', () => {
    beforeEach(() => {
      component = mount(getDetails({ focusedShapes: [rect] }));
    });

    it('renders controls', () => {
      assert(component.find('.details').children().length > 0);
    });
  });

  describe('multiple shapes selected', () => {
    beforeEach(() => {
      component = mount(getDetails({ focusedShapes: [rect, rect] }));
    });

    it('renders controls', () => {
      assert.equal(component.find('.details').children().length, 0);
    });
  });

  describe('focusedShape.type === shapeType.RECT', () => {
    beforeEach(() => {
      component = mount(getDetails({ focusedShapes: [rect] }));
    });

    it('renders inputs for a rect', () => {
      [
        'x',
        'y',
        'width',
        'height',
        'rotate',
        'strokeWidth',
        'stroke',
        'fill',
      ].forEach(property =>
        assert.equal(component.find(`input[name="${property}"]`).length, 1)
      );
    });

    it('populates inputs', () => {
      [
        'x',
        'y',
        'width',
        'height',
        'rotate',
        'strokeWidth',
        'stroke',
        'fill',
      ].forEach(property =>
        assert.equal(
          component.find(`input[name="${property}"]`).prop('value'),
          rect[property]
        )
      );
    });
  });
});
