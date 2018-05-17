import React from 'react';
import { Toolbar } from '../../src/components/toolbar';
import { selectedToolType } from '../../src/enums';
import { shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('Toolbar', () => {
  beforeEach(() => {
    component = shallow(<Toolbar />);
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
            <Toolbar selectedTool={selectedToolType.RECTANGLE} />
          );
        });

        it('activates rectangle button', () => {
          assert.equal(component.find('.active').length, 1);
        });
      });
    });
  });
});
