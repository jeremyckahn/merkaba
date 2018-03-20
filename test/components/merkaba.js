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

    describe('isDraggingShape', () => {
      it('has a default value', () => {
        assert.equal(component.state('isDraggingShape'), false);
      });
    });

    describe('isDraggingSelectionHandle', () => {
      it('has a default value', () => {
        assert.equal(component.state('isDraggingSelectionHandle'), false);
      });
    });

    describe('isDraggingSelectionRotator', () => {
      it('has a default value', () => {
        assert.equal(component.state('isDraggingSelectionRotator'), false);
      });
    });

    describe('draggedHandleOrientation', () => {
      it('has a default value', () => {
        assert.equal(component.state('draggedHandleOrientation'), null);
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

    describe('toolRotate', () => {
      it('has a default value', () => {
        assert.equal(component.state('toolRotate'), 0);
      });
    });

    describe('toolStrokeColor', () => {
      it('has a default value', () => {
        assert.equal(component.state('toolStrokeColor'), 'rgba(0, 0, 0, 1)');
      });
    });

    describe('toolStrokeWidth', () => {
      it('has a default value', () => {
        assert.equal(component.state('toolStrokeWidth'), 0);
      });
    });

    describe('toolFillColor', () => {
      it('has a default value', () => {
        assert.equal(component.state('toolFillColor'), 'rgba(0, 0, 0, 1)');
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
          rotate: 0,
          fill: 'rgba(0, 0, 0, 1)',
          stroke: 'rgba(0, 0, 0, 1)',
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
