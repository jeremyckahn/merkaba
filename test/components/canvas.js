import React from 'react';
import { Canvas } from '../../src/components/canvas';
import { selectedToolType } from '../../src/enums';
import { mount, shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('Canvas', () => {
  beforeEach(() => {
    component = shallow(<Canvas />);
  });

  it('renders content', () => {
    assert.equal(component.find('div').length, 1);
  });

  describe('tool shape rendering', () => {
    describe('no live shape (default)', () => {
      it('renders no shapes', () => {
        assert.equal(component.find('.live').length, 0);
      });
    });

    describe('any live shape', () => {
      beforeEach(() => {
        component = mount(
          <Canvas
            toolDragStartX={5}
            toolDragStartY={5}
            toolDragDeltaX={10}
            toolDragDeltaY={10}
            isDraggingTool={true}
            selectedTool={selectedToolType.RECTANGLE}
          />
        );
      });

      it('renders the shape', () => {
        assert.equal(component.find('rect.live').length, 1);
      });
    });
  });

  describe('buffer rendering', () => {});
});
