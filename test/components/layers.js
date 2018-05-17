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

  describe('rendering', () => {
    beforeEach(() => {
      component.setProps({
        bufferShapes: [sampleRect({ fill: '#f0f' })],
      });
    });

    it('sets the layer color strip', () => {
      assert.equal(
        component
          .find('li')
          .at(0)
          .props().style.borderLeftColor,
        '#f0f'
      );
    });
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

    describe('focusedShapeBufferIndices', () => {
      beforeEach(() => {
        component.setProps({
          bufferShapes: [sampleRect(), sampleRect(), sampleRect()],
          focusedShapeBufferIndices: [0, 1],
        });
      });

      it('renderers the focused class', () => {
        assert(
          component
            .find('li')
            .at(1)
            .hasClass('focused')
        );

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
