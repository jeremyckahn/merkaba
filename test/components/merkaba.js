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
        assert.equal(component.state('selectedTool'), selectedToolType.SELECT);
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

    describe('transformDragStartX', () => {
      it('has a default value', () => {
        assert.equal(String(component.state('transformDragStartX')), 'null');
      });
    });

    describe('transformDragStartY', () => {
      it('has a default value', () => {
        assert.equal(String(component.state('transformDragStartY')), 'null');
      });
    });

    describe('transformDragX', () => {
      it('has a default value', () => {
        assert.equal(String(component.state('transformDragX')), 'null');
      });
    });

    describe('transformDragY', () => {
      it('has a default value', () => {
        assert.equal(String(component.state('transformDragY')), 'null');
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
          bufferIndices: [],
        });
      });
    });
  });

  describe('getFocusedShapes', () => {
    let focusedShapes;

    describe('state.focusedShapeCursor.shapeFocus === shapeFocusType.NONE', () => {
      beforeEach(() => {
        focusedShapes = component.instance().getFocusedShapes();
      });

      it('returns empty shape data', () => {
        assert.deepEqual(focusedShapes, [
          {
            type: shapeType.NONE,
          },
        ]);
      });
    });

    describe('state.focusedShapeCursor.shapeFocus === shapeFocusType.LIVE (rect)', () => {
      beforeEach(() => {
        component.setState({
          focusedShapeCursor: {
            shapeFocus: shapeFocusType.LIVE,
            bufferIndices: [],
          },
          selectedTool: selectedToolType.RECTANGLE,
          toolDragStartX: 10,
          toolDragStartY: 15,
          toolDragDeltaX: 10,
          toolDragDeltaY: 10,
        });

        focusedShapes = component.instance().getFocusedShapes();
      });

      it('returns live shape data', () => {
        assert.deepEqual(focusedShapes, [
          {
            type: shapeType.RECT,
            x: 10,
            y: 15,
            width: 10,
            height: 10,
            rotate: 0,
            fill: 'rgba(0, 0, 0, 1)',
            stroke: 'rgba(0, 0, 0, 1)',
            strokeWidth: 0,
          },
        ]);
      });
    });

    describe('state.focusedShapeCursor.shapeFocus === shapeFocusType.BUFFER', () => {
      const bufferShape1 = sampleRect({ id: 1 });
      const bufferShape2 = sampleRect({ id: 2 });

      describe('valid bufferIndices', () => {
        beforeEach(() => {
          component.setState({
            focusedShapeCursor: {
              shapeFocus: shapeFocusType.BUFFER,
              bufferIndices: [0, 1],
            },
            bufferShapes: [bufferShape1, bufferShape2],
          });

          focusedShapes = component.instance().getFocusedShapes();
        });

        it('returns empty shape data', () => {
          assert.deepEqual(focusedShapes, [bufferShape1, bufferShape2]);
        });
      });

      describe('invalid bufferIndices', () => {
        beforeEach(() => {
          component.setState({
            focusedShapeCursor: {
              shapeFocus: shapeFocusType.BUFFER,
              bufferIndices: [1],
            },
            bufferShapes: [bufferShape1],
          });

          focusedShapes = component.instance().getFocusedShapes();
        });

        it('returns empty shape data', () => {
          assert.deepEqual(focusedShapes, [{ type: shapeType.NONE }]);
        });
      });
    });
  });

  describe('deleteFocusedShapes', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [
          sampleRect({ id: 0 }),
          sampleRect({ id: 1 }),
          sampleRect({ id: 2 }),
        ],
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [0, 2],
        },
      });

      component.instance().deleteFocusedShapes();
    });

    it('updates the bufferShapes state', () => {
      assert.deepEqual(component.state('bufferShapes'), [
        sampleRect({ id: 1 }),
      ]);
    });

    it('updates the focusedShapeCursor state', () => {
      assert.equal(
        component.state('focusedShapeCursor').shapeFocus,
        shapeFocusType.NONE
      );
    });
  });

  describe('getLiveShape', () => {
    let shapeObject;

    beforeEach(() => {
      component.setState({
        toolDragStartX: 0,
        toolDragStartY: 0,
        toolDragDeltaX: 0,
        toolDragDeltaY: 0,
        toolRotate: 0,
        toolStrokeColor: '#000',
        toolFillColor: '#000',
        toolStrokeWidth: 0,
      });
    });

    describe('selectedTool === selectedToolType.SELECT', () => {
      beforeEach(() => {
        component.setState({
          selectedTool: selectedToolType.SELECT,
        });

        shapeObject = component.instance().getLiveShape();
      });

      it('has the correct properties', () => {
        assert.deepEqual(shapeObject, {
          type: 'none',
        });
      });
    });

    describe('selectedTool === selectedToolType.RECTANGLE', () => {
      beforeEach(() => {
        component.setState({
          selectedTool: selectedToolType.RECTANGLE,
        });

        shapeObject = component.instance().getLiveShape();
      });

      it('has the correct properties', () => {
        assert.deepEqual(shapeObject, {
          fill: '#000',
          height: 0,
          rotate: 0,
          stroke: '#000',
          strokeWidth: 0,
          type: 'rect',
          width: 0,
          x: 0,
          y: 0,
        });
      });
    });
  });

  describe('getMidDragMatrix', () => {
    let matrix;

    beforeEach(() => {
      component.setState({
        draggedHandleOrientation: 'top-left',
        transformDragStartX: 10,
        transformDragStartY: 10,
        transformDragX: 50,
        transformDragY: 50,
        bufferShapes: [sampleRect()],
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [0],
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
        transformDragStartX: 10,
        transformDragStartY: 10,
        transformDragX: 50,
        transformDragY: 50,
        bufferShapes: [sampleRect()],
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [0],
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
        transformDragStartX: 10,
        transformDragStartY: 10,
        transformDragX: 50,
        transformDragY: 50,
        bufferShapes: [sampleRect()],
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [0],
        },
      });

      const instance = component.instance();
      instance.applyMatrixToFocusedShape(instance.getAggregateDragMatrix());
    });

    it('sets the matrix values to the focused shape', () => {
      const [{ height, width, x, y }] = component.instance().getFocusedShapes();
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

  describe('updateBufferShape', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [sampleRect()],
      });
    });

    describe('single focused shape', () => {
      beforeEach(() => {
        component.instance().updateBufferShape(0, { foo: 'bar' });
      });

      it('updates the focused shape', () => {
        assert.equal(component.state().bufferShapes[0].foo, 'bar');
      });
    });

    describe('multiple focused shapes', () => {
      beforeEach(() => {
        component.setState({
          bufferShapes: [sampleRect(), sampleRect()],
        });
      });

      describe('index === 0', () => {
        beforeEach(() => {
          component.instance().updateBufferShape(0, { foo: 'bar' });
        });

        it('updates the specific focused shape', () => {
          assert.equal(component.state().bufferShapes[0].foo, 'bar');
        });
      });

      describe('index > 0', () => {
        beforeEach(() => {
          component.instance().updateBufferShape(1, { foo: 'bar' });
        });

        it('updates the specific focused shape', () => {
          assert.equal(component.state().bufferShapes[1].foo, 'bar');
        });
      });
    });
  });
});
