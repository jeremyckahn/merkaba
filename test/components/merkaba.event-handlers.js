import React from 'react';
import assert from 'assert';
import { sampleRect } from '../test-utils.js';
import { Merkaba } from '../../src/components/merkaba';
import { selectedToolType, shapeFocusType, shapeType } from '../../src/enums';
import { shallow } from 'enzyme';

let component;

describe('eventHandlers', () => {
  beforeEach(() => {
    component = shallow(<Merkaba />);
  });

  describe('Merkaba#handleToolClick', () => {
    beforeEach(() => {
      component.instance().handleToolClick(selectedToolType.RECTANGLE);
    });

    it('sets the selectedTool state', () => {
      assert.equal(component.state('selectedTool'), selectedToolType.RECTANGLE);
    });
  });

  describe('Merkaba#handleCanvasMouseDown', () => {
    beforeEach(() => {
      component = shallow(<Merkaba />);
      component.setState({
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [1],
        },
      });

      component.instance().handleCanvasMouseDown({
        target: {
          getBoundingClientRect: () => ({ x: 1, y: 2 }),
          nodeName: 'svg',
        },
      });
    });

    it('resets the drag and focus state', () => {
      assert.deepEqual(component.state('focusedShapeCursor'), {
        shapeFocus: shapeFocusType.NONE,
        bufferIndices: [],
      });
    });

    it('updates the svgBoundingRect state', () => {
      const { x, y } = component.state('svgBoundingRect');
      assert.deepEqual({ x, y }, { x: 1, y: 2 });
    });
  });

  describe('Merkaba#handleCanvasDragStart', () => {
    const eventHandlerData = { target: { nodeName: 'svg' } };
    const dragData = {
      x: 10,
      y: 15,
      node: { offsetLeft: 5, offsetTop: 5 },
    };

    describe('drag state', () => {
      beforeEach(() => {
        component.setState({
          selectedTool: selectedToolType.NONE,
        });

        component.instance().handleCanvasDragStart(eventHandlerData, dragData);
      });

      it('sets the focusedShapeCursor state', () => {
        assert.deepEqual(component.state('focusedShapeCursor'), {
          shapeFocus: shapeFocusType.LIVE,
          bufferIndices: [],
        });
      });

      it('sets the isDraggingTool state', () => {
        assert.equal(component.state('isDraggingTool'), true);
      });

      it('sets the toolDragStartX state', () => {
        assert.equal(component.state('toolDragStartX'), 5);
      });

      it('sets the toolDragStartY state', () => {
        assert.equal(component.state('toolDragStartY'), 10);
      });

      it('sets the toolDragDeltaX state', () => {
        assert.equal(component.state('toolDragDeltaX'), 0);
      });

      it('sets the toolDragDeltaY state', () => {
        assert.equal(component.state('toolDragDeltaY'), 0);
      });
    });

    describe('selectedTool branching', () => {
      describe('focusedShapeCursor', () => {
        describe('selectedTool !== selectedToolType.SELECT', () => {
          beforeEach(() => {
            component.setState({
              selectedTool: selectedToolType.NONE,
            });

            component
              .instance()
              .handleCanvasDragStart(eventHandlerData, dragData);
          });

          it('sets correct shapeFocusType', () => {
            assert.equal(
              component.state('focusedShapeCursor').shapeFocus,
              shapeFocusType.LIVE
            );
          });
        });

        describe('selectedTool === selectedToolType.SELECT', () => {
          beforeEach(() => {
            component.setState({
              selectedTool: selectedToolType.SELECT,
            });

            component
              .instance()
              .handleCanvasDragStart(eventHandlerData, dragData);
          });

          it('sets correct shapeFocusType', () => {
            assert.equal(
              component.state('focusedShapeCursor').shapeFocus,
              shapeFocusType.NONE
            );
          });
        });
      });
    });
  });

  describe('Merkaba#handleCanvasDrag', () => {
    beforeEach(() => {
      component.setState({
        selectedTool: selectedToolType.NONE,
      });

      component.setState({
        toolDragDeltaX: 10,
        toolDragDeltaY: 15,
      });

      component.instance().handleCanvasDrag(null, { deltaX: -5, deltaY: 5 });
    });

    it('sets the toolDragDeltaX state', () => {
      assert.equal(component.state('toolDragDeltaX'), 5);
    });

    it('sets the toolDragDeltaY state', () => {
      assert.equal(component.state('toolDragDeltaY'), 20);
    });

    describe('focusedShapeCursor state', () => {
      describe('selectedTool !== selectedToolType.SELECT', () => {
        beforeEach(() => {
          component.setState({
            selectedTool: selectedToolType.NONE,
          });

          component.instance().handleCanvasDrag(null, { deltaX: 0, deltaY: 0 });
        });

        it('does not change focusedShapeCursor', () => {
          assert.deepEqual(component.state('focusedShapeCursor'), {
            shapeFocus: shapeFocusType.NONE,
            bufferIndices: [],
          });
        });
      });

      describe('selectedTool === selectedToolType.SELECT', () => {
        describe('some shapes selected', () => {
          beforeEach(() => {
            component.setState({
              bufferShapes: [
                sampleRect({ x: 0, y: 0, height: 10, width: 10 }),
                sampleRect({ x: 10, y: 10, height: 10, width: 10 }),
              ],
              selectedTool: selectedToolType.SELECT,
              toolDragStartX: 0,
              toolDragStartY: 0,
              toolDragDeltaX: 20,
              toolDragDeltaY: 20,
            });

            component
              .instance()
              .handleCanvasDrag(null, { deltaX: 0, deltaY: 0 });
          });

          it('sets correct focusedShapeCursor', () => {
            assert.deepEqual(component.state('focusedShapeCursor'), {
              shapeFocus: shapeFocusType.BUFFER,
              bufferIndices: [0, 1],
            });
          });
        });

        describe('no shapes selected', () => {
          beforeEach(() => {
            component.setState({
              selectedTool: selectedToolType.SELECT,
            });

            component
              .instance()
              .handleCanvasDrag(null, { deltaX: 0, deltaY: 0 });
          });

          it('sets correct focusedShapeCursor', () => {
            assert.deepEqual(component.state('focusedShapeCursor'), {
              shapeFocus: shapeFocusType.NONE,
              bufferIndices: [],
            });
          });
        });
      });
    });
  });

  describe('Merkaba#handleCanvasDragStop', () => {
    beforeEach(() => {
      component.setState({
        isDraggingTool: true,
        selectedTool: selectedToolType.NONE,
        toolDragStartX: 10,
        toolDragStartY: 15,
        toolRotate: 30,
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.LIVE,
          bufferIndices: [],
        },
      });
    });

    describe('state management', () => {
      beforeEach(() => {
        component.instance().handleCanvasDragStop();
      });

      it('sets the focusedShapeCursor state', () => {
        assert.deepEqual(component.state('focusedShapeCursor'), {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [0],
        });
      });

      it('sets the isDraggingTool state', () => {
        assert.equal(component.state('isDraggingTool'), false);
      });

      it('sets the toolDragStartX state', () => {
        assert.equal(String(component.state('toolDragStartX')), 'null');
      });

      it('sets the toolDragStartY state', () => {
        assert.equal(String(component.state('toolDragStartY')), 'null');
      });

      it('sets the toolDragDeltaX state', () => {
        assert.equal(String(component.state('toolDragDeltaX')), 'null');
      });

      it('sets the toolDragDeltaY state', () => {
        assert.equal(String(component.state('toolDragDeltaY')), 'null');
      });

      it('sets the toolRotate state', () => {
        assert.equal(String(component.state('toolRotate')), 0);
      });

      it('sets the selectedTool state', () => {
        assert.equal(
          String(component.state('selectedTool')),
          selectedToolType.SELECT
        );
      });
    });

    describe('committing to state.bufferShapes', () => {
      describe('shape with no deltas', () => {
        beforeEach(() => {
          component.setState({
            isDraggingTool: true,
            selectedTool: selectedToolType.RECTANGLE,
            toolDragStartX: 10,
            toolDragStartY: 15,
            toolDragDeltaX: 0,
            toolDragDeltaY: 0,
          });

          component.instance().handleCanvasDragStop();
        });

        it('is not committed to state.bufferShapes', () => {
          assert.equal(component.state().bufferShapes.length, 0);
        });
      });

      describe('merkaba.svgRect', () => {
        beforeEach(() => {
          component.setState({
            isDraggingTool: true,
            selectedTool: selectedToolType.RECTANGLE,
            toolDragStartX: 10,
            toolDragStartY: 15,
            toolDragDeltaX: 10,
            toolDragDeltaY: 10,
          });

          component.instance().handleCanvasDragStop();
        });

        it('is committed to state.bufferShapes', () => {
          assert.deepEqual(component.state().bufferShapes, [
            {
              type: shapeType.RECT,
              x: 10,
              y: 15,
              width: 10,
              height: 10,
              rotate: 30,
              fill: 'rgba(0, 0, 0, 1)',
              stroke: 'rgba(0, 0, 0, 1)',
              strokeWidth: 0,
            },
          ]);
        });
      });
    });

    describe('selectedTool branching', () => {
      describe('focusedShapeCursor', () => {
        describe('selectedTool !== selectedToolType.SELECT', () => {
          beforeEach(() => {
            component.setState({
              selectedTool: selectedToolType.NONE,
            });

            component.instance().handleCanvasDragStop();
          });

          it('sets correct focusedShapeCursor', () => {
            assert.deepEqual(component.state('focusedShapeCursor'), {
              shapeFocus: shapeFocusType.BUFFER,
              bufferIndices: [0],
            });
          });
        });
      });
    });
  });

  describe('Merkaba#handleBufferedShapeDragStart', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [sampleRect()],
      });

      component.instance().handleBufferedShapeDragStart({
        target: { getAttribute: () => 1 },
      });
    });

    it('updates isDraggingTool state', () => {
      assert(component.state('isDraggingShape'));
    });

    describe('focusedShapeCursor.shapeFocus === shapeFocusType.NONE', () => {
      it('focuses the clicked shape', () => {
        assert.deepEqual(component.state('focusedShapeCursor'), {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [1],
        });
      });
    });

    describe('dragged shape is already represented in focusedShapeCursor.bufferIndices', () => {
      beforeEach(() => {
        component.setState({
          focusedShapeCursor: {
            bufferIndices: [1, 2],
            shapeFocus: shapeFocusType.BUFFER,
          },
        });

        component.instance().handleBufferedShapeDragStart({
          target: { getAttribute: () => 2 },
        });
      });

      it('does not change the focusedShapeCursor state', () => {
        assert.deepEqual(component.state('focusedShapeCursor'), {
          bufferIndices: [1, 2],
          shapeFocus: shapeFocusType.BUFFER,
        });
      });
    });
  });

  describe('Merkaba#handleBufferedShapeDrag', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [
          sampleRect({ x: 10, y: 10 }),
          sampleRect({ x: 20, y: 20 }),
        ],
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [0, 1],
        },
      });

      component
        .instance()
        .handleBufferedShapeDrag({}, { deltaX: 10, deltaY: -10 });
    });

    it('modifies the bufferShapes data', () => {
      const [shape1, shape2] = component.state('bufferShapes');
      const { x, y } = sampleRect();
      assert.equal(shape1.x, 20);
      assert.equal(shape1.y, 0);
      assert.equal(shape2.x, 30);
      assert.equal(shape2.y, 10);
    });
  });

  describe('Merkaba#handleBufferedShapeDragStop', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [sampleRect()],
      });
      component.setState({ isDraggingShape: true });

      component.instance().handleBufferedShapeDragStop({
        target: { getAttribute: () => 1 },
      });
    });

    it('updates isDraggingTool state', () => {
      assert.equal(component.state('isDraggingShape'), false);
    });
  });

  describe('Merkaba#handleSelectionHandleDragStart', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [sampleRect()],
        svgBoundingRect: { x: 0, y: 0 },
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [0],
        },
      });

      component.instance().handleSelectionHandleDragStart(
        {
          target: {
            getAttribute: () => 'top-left',
            viewportElement: {
              getBoundingClientRect: () => ({ x: 0, y: 0 }),
            },
          },
        },
        {
          x: 5,
          y: 10,
        }
      );
    });

    it('updates shapeStateBeforeDragTransform state', () => {
      assert.deepEqual(
        component.state('shapeStateBeforeDragTransform'),
        sampleRect()
      );
    });

    it('updates isDraggingSelectionHandle state', () => {
      assert.equal(component.state('isDraggingSelectionHandle'), true);
    });

    it('updates draggedHandleOrientation state', () => {
      assert.equal(component.state('draggedHandleOrientation'), 'top-left');
    });

    it('updates transformDragStartX state', () => {
      assert.equal(component.state('transformDragStartX'), 5);
    });

    it('updates transformDragStartY state', () => {
      assert.equal(component.state('transformDragStartY'), 10);
    });
  });

  describe('Merkaba#handleSelectionHandleDrag', () => {
    const x = 0;
    const y = 5;
    beforeEach(() => {
      component.setState({
        bufferShapes: [sampleRect()],
        draggedHandleOrientation: 'top-left',
        svgBoundingRect: { x: 0, y: 0 },
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [0],
        },
      });
    });

    describe('state updates', () => {
      beforeEach(() => {
        component.instance().handleSelectionHandleDrag(null, { x, y });
      });

      it('updates the transformDragX state', () => {
        assert.equal(component.state('transformDragX'), x);
      });

      it('updates the transformDragY state', () => {
        assert.equal(component.state('transformDragY'), y);
      });

      it('updates the focused shape', () => {
        const [
          { height, width, x, y },
        ] = component.instance().getFocusedShapes();
        assert.deepEqual(
          { height, width, x, y },
          {
            height: 5,
            width: 10,
            x: 10,
            y: 20,
          }
        );
      });
    });
  });

  describe('Merkaba#handleSelectionHandleDragStop', () => {
    beforeEach(() => {
      component.setState({
        draggedHandleOrientation: 'top-left',
        isDraggingSelectionHandle: true,
        shapeStateBeforeDragTransform: sampleRect(),
        transformDragStartX: 5,
        transformDragStartY: 10,
        transformDragX: 0,
        transformDragY: 5,
      });
      component.instance().handleSelectionHandleDragStop();
    });

    it('updates isDraggingSelectionHandle state', () => {
      assert.equal(component.state('isDraggingSelectionHandle'), false);
    });

    it('updates draggedHandleOrientation state', () => {
      assert.equal(component.state('draggedHandleOrientation'), null);
    });

    it('updates shapeStateBeforeDragTransform state', () => {
      assert.deepEqual(component.state('shapeStateBeforeDragTransform'), {});
    });

    it('updates transformDragStartX state', () => {
      assert.equal(component.state('transformDragStartX'), null);
    });

    it('updates transformDragStartY state', () => {
      assert.equal(component.state('transformDragStartY'), null);
    });

    it('updates the transformDragX state', () => {
      assert.equal(component.state('transformDragX'), null);
    });

    it('updates the transformDragY state', () => {
      assert.equal(component.state('transformDragY'), null);
    });
  });

  describe('Merkaba#handleSelectionRotatorDragStart', () => {
    beforeEach(() => {
      component.instance().handleSelectionRotatorDragStart();
    });

    it('updates isDraggingSelectionRotator state', () => {
      assert.equal(component.state('isDraggingSelectionRotator'), true);
    });
  });

  describe('Merkaba#handleSelectionRotatorDrag', () => {
    beforeEach(() => {
      component.setState({
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [0],
        },
        bufferShapes: [
          {
            type: shapeType.RECT,
            x: -5,
            y: -5,
            width: 10,
            height: 10,
            rotate: 0,
            fill: null,
            stroke: null,
            strokeWidth: 1,
          },
        ],
        svgBoundingRect: { x: 0, y: 0 },
      });

      component.instance().handleSelectionRotatorDrag(null, {
        lastX: 0,
        lastY: 0,
        x: 90,
        y: 90,
      });
    });

    it('rotates the shape', () => {
      assert.equal(component.state('bufferShapes')[0].rotate, 45);
    });
  });

  describe('Merkaba#handleSelectionRotatorDragStop', () => {
    beforeEach(() => {
      component.instance().setState({ isDraggingSelectionRotator: true });
      component.instance().handleSelectionRotatorDragStop();
    });

    it('updates isDraggingSelectionRotator state', () => {
      assert.equal(component.state('isDraggingSelectionRotator'), false);
    });
  });

  describe('handlePropertyChange', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [sampleRect()],
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [0],
        },
      });

      component.instance().handlePropertyChange({
        target: {
          name: 'x',
          type: 'number',
          value: '5',
          valueAsNumber: 5,
        },
      });
    });

    it('modifies the specified property of the focused shape', () => {
      assert.equal(component.state().bufferShapes[0].x, 5);
    });
  });

  describe('handleColorPropertyChange', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [sampleRect()],
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [0],
        },
      });

      component
        .instance()
        .handleColorPropertyChange(
          { rgb: { r: 1, g: 2, b: 3, a: 0.5 } },
          'stroke'
        );
    });

    it('modifies the specified color property of the focused shape', () => {
      assert.equal(
        component.state().bufferShapes[0].stroke,
        'rgba(1, 2, 3, 0.5)'
      );
    });
  });

  describe('handleLayerSortStart', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [sampleRect(), sampleRect(), sampleRect()],
      });
      component.instance().handleLayerSortStart({ index: 2 });
    });

    it('focuses the clicked layer', () => {
      assert.deepEqual(component.state('focusedShapeCursor'), {
        shapeFocus: shapeFocusType.BUFFER,
        bufferIndices: [0],
      });
    });
  });

  describe('handleLayerSortEnd', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [
          sampleRect(),
          sampleRect({ id: 0 }),
          sampleRect({ id: 1 }),
        ],
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [1],
        },
      });

      component.instance().handleLayerSortEnd({ oldIndex: 1, newIndex: 0 });
    });

    it('sorts the bufferShapes', () => {
      const {
        bufferShapes: [, shape1, shape0],
      } = component.state();
      assert.equal(shape0.id, 0);
      assert.equal(shape1.id, 1);
    });

    it('updates focusedShapeCursor', () => {
      assert.deepEqual(component.state('focusedShapeCursor').bufferIndices, [
        2,
      ]);
    });
  });

  describe('handleLayerClick', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [sampleRect({ id: 0 })],
      });

      component.instance().handleLayerClick(0);
    });

    it('focuses the clicked layer', () => {
      assert.deepEqual(component.state('focusedShapeCursor'), {
        shapeFocus: shapeFocusType.BUFFER,
        bufferIndices: [0],
      });
    });
  });

  describe('handleDeleteShapeClick', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [sampleRect({ id: 0 }), sampleRect({ id: 1 })],
      });

      component.instance().handleDeleteShapeClick(0);
    });

    it('deletes the specified shape', () => {
      assert.deepEqual(component.state('bufferShapes'), [
        sampleRect({ id: 1 }),
      ]);
    });
  });

  describe('handleNudgeKeyPress', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [
          sampleRect({ x: 10, y: 10 }),
          sampleRect({ x: 20, y: 20 }),
        ],
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndices: [0, 1],
        }
      });
    });

    describe('up', () => {
      beforeEach(() => {
        component.instance().handleNudgeKeyPress({ key: 'ArrowUp' });
      });

      it('nudges all shapes up', () => {
        const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = component.state(
          'bufferShapes'
        );

        assert.equal(x1, 10);
        assert.equal(y1, 9);
        assert.equal(x2, 20);
        assert.equal(y2, 19);
      });
    });

    describe('right', () => {
      beforeEach(() => {
        component.instance().handleNudgeKeyPress({ key: 'ArrowRight' });
      });

      it('nudges all shapes right', () => {
        const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = component.state(
          'bufferShapes'
        );

        assert.equal(x1, 11);
        assert.equal(y1, 10);
        assert.equal(x2, 21);
        assert.equal(y2, 20);
      });
    });

    describe('down', () => {
      beforeEach(() => {
        component.instance().handleNudgeKeyPress({ key: 'ArrowDown' });
      });

      it('nudges all shapes down', () => {
        const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = component.state(
          'bufferShapes'
        );

        assert.equal(x1, 10);
        assert.equal(y1, 11);
        assert.equal(x2, 20);
        assert.equal(y2, 21);
      });
    });

    describe('left', () => {
      beforeEach(() => {
        component.instance().handleNudgeKeyPress({ key: 'ArrowLeft' });
      });

      it('nudges all shapes right', () => {
        const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = component.state(
          'bufferShapes'
        );

        assert.equal(x1, 9);
        assert.equal(y1, 10);
        assert.equal(x2, 19);
        assert.equal(y2, 20);
      });
    });
  });
});
