import React from 'react';
import assert from 'assert';
import { Merkaba } from '../../src/components/merkaba';
import {
  selectedToolType,
  shapeFocusType,
  shapeType,
} from '../../src/enums';
import { shallow } from 'enzyme';

const sampleRect = {
  type: shapeType.RECT,
  x: 10,
  y: 15,
  width: 10,
  height: 10,
  fill: null,
  stroke: null,
  strokeWidth: 1,
};

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

  describe('Merkaba#handleCanvasDragStart', () => {
    beforeEach(() => {
      component.setState({
        selectedTool: selectedToolType.NOT_NONE
      });

      component.instance().handleCanvasDragStart(null, {
        x: 10,
        y: 15,
        node: { offsetLeft: 5, offsetTop: 5 }
      });
    });

    it('sets the focusedShapeCursor state', () => {
      assert.deepEqual(component.state('focusedShapeCursor'), {
        shapeFocus: shapeFocusType.LIVE,
        bufferIndex: null
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

  describe('Merkaba#handleCanvasDrag', () => {
    beforeEach(() => {
      component.setState({
        selectedTool: selectedToolType.NOT_NONE
      });

      component.setState({
        toolDragDeltaX: 10,
        toolDragDeltaY: 15,
      });

      component.instance().handleCanvasDrag(null, { deltaX: -5, deltaY: 5, });
    });

    it('sets the toolDragDeltaX state', () => {
      assert.equal(component.state('toolDragDeltaX'), 5);
    });

    it('sets the toolDragDeltaY state', () => {
      assert.equal(component.state('toolDragDeltaY'), 20);
    });
  });

  describe('Merkaba#handleCanvasDragStop', () => {
    describe('state management', () => {
      beforeEach(() => {
        component.setState({
          selectedTool: selectedToolType.NOT_NONE
        });

        component.setState({
          isDraggingTool: true,
          toolDragStartX: 10,
          toolDragStartY: 15,
          focusedShapeCursor: {
            shapeFocus: shapeFocusType.LIVE,
            bufferIndex: null
          }
        });

        component.instance().handleCanvasDragStop();
      });

      it('sets the focusedShapeCursor state', () => {
        assert.deepEqual(component.state('focusedShapeCursor'), {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndex: 0
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

      it('sets the selectedTool state', () => {
        assert.equal(String(component.state('selectedTool')), selectedToolType.NONE);
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
          assert.deepEqual(component.state().bufferShapes, [{
            type: shapeType.RECT,
            x: 10,
            y: 15,
            width: 10,
            height: 10,
            fill: null,
            stroke: null,
            strokeWidth: 0,
          }]);
        });
      });
    });
  });

  xdescribe('Merkaba#handleShapeDragStart', () => {});

  xdescribe('Merkaba#handleShapeDrag', () => {});

  xdescribe('Merkaba#handleShapeDragStop', () => {});

  describe('handlePropertyChange', () => {
    beforeEach(() => {
      component.setState({
        bufferShapes: [Object.assign({}, sampleRect)],
        focusedShapeCursor: {
          shapeFocus: shapeFocusType.BUFFER,
          bufferIndex: 0
        }
      });

      component.instance().handlePropertyChange({
        target: {
          name: 'x',
          type: 'number',
          value: '5',
          valueAsNumber: 5,
        }
      });
    });

    it('modifies the specified property of the focused shape', () => {
      assert.equal(component.state().bufferShapes[0].x, 5);
    });
  });
});
