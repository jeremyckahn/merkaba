import React from 'react';
import { Merkaba } from '../../src/components/merkaba';
import {
  selectedToolType,
  shapeFocusType,
  shapeType,
} from '../../src/enums';
import { mount, shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('Merkaba', () => {
  beforeEach(() => {
    component = shallow(<Merkaba />);
  });

  describe('state', () => {
    describe('selectedTool', () => {
      it('has a default value', () => {
        assert.equal(component.state('selectedTool'), selectedToolType.NONE);
      });
    });

    describe('isDraggingTool', () => {
      it('has a default value', () => {
        assert.equal(component.state('isDraggingTool'), false);
      });
    });

    describe('toolDragStartX', () => {
      it('has a default value', () => {
        assert.equal(String(component.state('toolDragStartX')), 'null');
      });
    });

    describe('toolDragStartY', () => {
      it('has a default value', () => {
        assert.equal(String(component.state('toolDragStartY')), 'null');
      });
    });

    describe('toolDragDeltaX', () => {
      it('has a default value', () => {
        assert.equal(String(component.state('toolDragDeltaX')), 'null');
      });
    });

    describe('toolDragDeltaY', () => {
      it('has a default value', () => {
        assert.equal(String(component.state('toolDragDeltaY')), 'null');
      });
    });

    describe('toolStrokeColor', () => {
      it('has a default value', () => {
        assert.equal(component.state('toolStrokeColor'), null);
      });
    });

    describe('toolStrokeWidth', () => {
      it('has a default value', () => {
        assert.equal(component.state('toolStrokeWidth'), 0);
      });
    });

    describe('toolFillColor', () => {
      it('has a default value', () => {
        assert.equal(component.state('toolFillColor'), null);
      });
    });

    describe('bufferShapes', () => {
      it('has a default value', () => {
        assert.deepEqual(component.state('bufferShapes'), []);
      });
    });

    describe('focusedShapeCursor', () => {
      it('has a default value', () => {
        assert.deepEqual(component.state('focusedShapeCursor'), {
          shapeFocus: shapeFocusType.NONE,
          bufferIndex: null
        });
      });
    });
  });

  describe('getFocusedShape', () => {
    let focusedShape;

    describe('state.focusedShapeCursor.shapeFocus === shapeFocusType.NONE', () => {
      beforeEach(() => {
        focusedShape = component.instance().getFocusedShape();
      });

      it('returns empty shape data', () => {
        assert.deepEqual(focusedShape, {
          type: shapeType.NONE
        });
      });
    });

    describe('state.focusedShapeCursor.shapeFocus === shapeFocusType.LIVE (rect)', () => {
      beforeEach(() => {
        component.setState({
          focusedShapeCursor: {
            shapeFocus: shapeFocusType.LIVE,
            bufferIndex: null
          },
          selectedTool: selectedToolType.RECTANGLE,
          toolDragStartX: 10,
          toolDragStartY: 15,
          toolDragDeltaX: 10,
          toolDragDeltaY: 10,
        });

        focusedShape = component.instance().getFocusedShape();
      });

      it('returns live shape data', () => {
        assert.deepEqual(focusedShape, {
          type: shapeType.RECT,
          x: 10,
          y: 15,
          width: 10,
          height: 10,
          fill: null,
          stroke: null,
          strokeWidth: 0,
        });
      });
    });

    describe('state.focusedShapeCursor.shapeFocus === shapeFocusType.BUFFER', () => {
      const bufferShape = {
        type: shapeType.RECT,
        x: 10,
        y: 15,
        width: 10,
        height: 10,
        fill: null,
        stroke: null,
        strokeWidth: 0,
      };

      describe('valid bufferIndex', () => {
        beforeEach(() => {
          component.setState({
            focusedShapeCursor: {
              shapeFocus: shapeFocusType.BUFFER,
              bufferIndex: 0
            },
            bufferShapes: [bufferShape]
          });

          focusedShape = component.instance().getFocusedShape();
        });

        it('returns empty shape data', () => {
          assert.deepEqual(focusedShape, bufferShape);
        });
      });

      describe('invalid bufferIndex', () => {
        beforeEach(() => {
          component.setState({
            focusedShapeCursor: {
              shapeFocus: shapeFocusType.BUFFER,
              bufferIndex: 1
            },
            bufferShapes: [bufferShape]
          });

          focusedShape = component.instance().getFocusedShape();
        });

        it('returns empty shape data', () => {
          assert.deepEqual(focusedShape, { type: shapeType.NONE });
        });
      });
    });
  });
});
