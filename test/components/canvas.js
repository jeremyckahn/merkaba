import React from 'react';
import { Canvas } from '../../src/components/canvas';
import { selectedToolType, shapeType } from '../../src/enums';
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

  describe('state classes', () => {
    describe('no-tool-selected', () => {
      describe('selectedTool === selectedToolType.NONE', () => {
        beforeEach(() => {
          component.setProps({
            selectedTool: selectedToolType.NONE
          });
        });

        it('has the class', () => {
          assert(
            ~component.find('.canvas').props().className.indexOf('no-tool-selected')
          );
        });
      });

      describe('selectedTool !== selectedToolType.NONE', () => {
        beforeEach(() => {
          component.setProps({
            selectedTool: selectedToolType.NOT_NONE
          });
        });

        it('does not have the class', () => {
          assert(
            !~component.find('.canvas').props().className.indexOf('no-tool-selected')
          );
        });
      });
    });
  });

  describe('buffer rendering', () => {
    describe('no buffered shape (default)', () => {
      it('renders no shapes', () => {
        assert.equal(component.find('.buffered').length, 0);
      });
    });

    describe('any buffered shapes', () => {
      beforeEach(() => {
        component = mount(
          <Canvas
            bufferShapes={[{
              type: shapeType.RECT,
              x: 5,
              y: 5,
              width: 10,
              height: 10,
              rx: 0,
              ry: 0,
              stroke: 'red',
              fill: 'red',
              strokeWidth: 1,
            }, {
              type: shapeType.RECT,
              x: 15,
              y: 15,
              width: 10,
              height: 10,
              rx: 0,
              ry: 0,
              stroke: 'blue',
              fill: 'blue',
              strokeWidth: 1,
            }]}
          />
        );
      });

      it('renders the shapes', () => {
        assert.equal(component.find('rect.buffered').length, 2);
      });
    });
  });
});
