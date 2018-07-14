import React from 'react';
import { Toolbar } from '../../src/components/toolbar';
import { selectedToolType } from '../../src/enums';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('Toolbar', () => {
  const getToolbar = (props = {}) => (
    <Toolbar
      {...Object.assign(
        {
          handleToolClick: () => {},
          selectedTool: selectedToolType.NONE,
        },
        props
      )}
    />
  );
  beforeEach(() => {
    component = shallow(getToolbar());
  });

  describe('responding to parameters', () => {
    describe('selectedTool', () => {
      describe('selectedToolType.SELECT (default)', () => {
        it('activates nothing', () => {
          assert.equal(component.find('active').length, 0);
        });
      });

      describe('selectedToolType.RECTANGLE', () => {
        beforeEach(() => {
          component = shallow(
            getToolbar({ selectedTool: selectedToolType.RECTANGLE })
          );
        });

        it('activates rectangle button', () => {
          assert.equal(component.find('.active').length, 1);
        });
      });
    });
  });
});
