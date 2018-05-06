import React from 'react';
import { SortableLayers as Layers } from '../../src/components/layers';
import { sampleRect } from '../test-utils.js';
import { mount, shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('Layers', () => {
  beforeEach(() => {
    component = mount(<Layers />);
  });

  describe('props', () => {
    describe('bufferShapes', () => {
      beforeEach(() => {
        component.setProps({
          bufferShapes: [sampleRect(), sampleRect()],
        });
      });

      it('renderers the bufferShapes', () => {
        assert.equal(component.find('li').length, 2);
      });
    });

    describe('focusedShapeBufferIndex', () => {
      beforeEach(() => {
        component.setProps({
          bufferShapes: [sampleRect(), sampleRect(), sampleRect()],
          focusedShapeBufferIndex: 0,
        });
      });

      it('renderers the focused class', () => {
        assert(
          component
            .find('li')
            .at(2)
            .hasClass('focused')
        );
      });
    });
  });
});
