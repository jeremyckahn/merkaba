import React from 'react';
import { Merkaba } from '../../src/components/merkaba';
import { selectedToolType } from '../../src/enums';
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
        assert.equal(component.state('toolStrokeColor'), 'red');
      });
    });

    describe('toolStrokeWidth', () => {
      it('has a default value', () => {
        assert.equal(component.state('toolStrokeWidth'), 1);
      });
    });

    describe('toolFillColor', () => {
      it('has a default value', () => {
        assert.equal(component.state('toolFillColor'), 'red');
      });
    });

    describe('bufferShapes', () => {
      it('has a default value', () => {
        assert.deepEqual(component.state('bufferShapes'), []);
      });
    });
  });
});
