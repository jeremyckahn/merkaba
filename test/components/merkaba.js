import React from 'react';
import { sampleRect } from '../test-utils.js';
import { Merkaba } from '../../src/components/merkaba';
import { selectedToolType, shapeFocusType, shapeType } from '../../src/enums';
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

    describe('shapeStateBeforeDragTransform', () => {
      it('has a default value', () => {
        assert.deepEqual(component.state('shapeStateBeforeDragTransform'), {});
      });
    });

    describe('selectionDragStartX', () => {
      it('has a default value', () => {
        assert.equal(String(component.state('selectionDragStartX')), 'null');
      });
    });

    describe('selectionDragStartY', () => {
      it('has a default value', () => {
        assert.equal(String(component.state('selectionDragStartY')), 'null');
      });
    });

    describe('selectionDragX', () => {
      it('has a default value', () => {
        assert.equal(String(component.state('selectionDragX')), 'null');
      });
    });

    describe('selectionDragY', () => {
      it('has a default value', () => {
        assert.equal(String(component.state('selectionDragY')), 'null');
      });
    });

    describe('svgBoundingRect', () => {
      it('has a default value', () => {
        assert.deepEqual(component.state('svgBoundingRect'), {});
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
          bufferIndex: null,
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
          type: shapeType.NONE,
        });
      });
    });

    describe('state.focusedShapeCursor.shapeFocus === shapeFocusType.LIVE (rect)', () => {
      beforeEach(() => {
        component.setState({
          focusedShapeCursor: {
            shapeFocus: shapeFocusType.LIVE,
            bufferIndex: null,
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
              bufferIndex: 0,
            },
            bufferShapes: [bufferShape],
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
              bufferIndex: 1,
            },
            bufferShapes: [bufferShape],
          });

          focusedShape = component.instance().getFocusedShape();
        });

        it('returns empty shape data', () => {
          assert.deepEqual(focusedShape, { type: shapeType.NONE });
        });
      });
    });
  });

  describe('getMidDragMatrix', () => {
    let matrix;

    beforeEach(() => {
      component.setState({
        draggedHandleOrientation: 'top-left',
        selectionDragStartX: 10,
        selectionDragStartY: 10,
        selectionDragX: 50,
        selectionDragY: 50,
        bufferShapes: [sampleRect()],
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndex: 0,
        },
      });
    });

    describe('no arguments', () => {
      beforeEach(() => {
        matrix = component.instance().getMidDragMatrix();
      });

      it('computes the correct matrix', () => {
        const { a, b, c, d, e, f } = matrix;
        assert.deepEqual(
          { a, b, c, d, e, f },
          {
            a: -3,
            b: 0,
            c: 0,
            d: -3,
            e: 80,
            f: 100,
          }
        );
      });
    });

    describe('with rotationOffset', () => {
      beforeEach(() => {
        matrix = component.instance().getMidDragMatrix({ rotationOffset: 180 });
      });

      it('computes the correct matrix', () => {
        assert.deepEqual(
          {
            a: Math.round(matrix.a),
            d: Math.round(matrix.d),
            e: Math.round(matrix.e),
            f: Math.round(matrix.f),
          },
          {
            a: 3,
            d: 3,
            e: -50,
            f: -60,
          }
        );
      });
    });
  });

  describe('getAggregateDragMatrix', () => {
    let matrix;

    beforeEach(() => {
      component.setState({
        draggedHandleOrientation: 'top-left',
        selectionDragStartX: 10,
        selectionDragStartY: 10,
        selectionDragX: 50,
        selectionDragY: 50,
        bufferShapes: [sampleRect()],
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndex: 0,
        },
      });

      matrix = component.instance().getAggregateDragMatrix();
    });

    it('computes the correct matrix', () => {
      const { a, b, c, d, e, f } = matrix;
      assert.deepEqual(
        { a, b, c, d, e, f },
        {
          a: -3,
          b: 0,
          c: 0,
          d: -3,
          e: 80,
          f: 100,
        }
      );
    });
  });

  describe('applyMatrixToFocusedShape', () => {
    beforeEach(() => {
      component.setState({
        draggedHandleOrientation: 'top-left',
        selectionDragStartX: 10,
        selectionDragStartY: 10,
        selectionDragX: 50,
        selectionDragY: 50,
        bufferShapes: [sampleRect()],
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndex: 0,
        },
      });

      const instance = component.instance();
      instance.applyMatrixToFocusedShape(instance.getAggregateDragMatrix());
    });

    it('sets the matrix values to the focused shape', () => {
      const { height, width, x, y } = component.instance().getFocusedShape();
      assert.deepEqual(
        { height, width, x, y },
        {
          height: 30,
          width: 30,
          x: 20,
          y: 25,
        }
      );
    });
  });
});
