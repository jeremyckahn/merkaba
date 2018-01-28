import React from 'react';
import { Toolbar } from '../../src/components/toolbar';
import { mount, shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('Toolbar', () => {
  beforeEach(() => {
    component = shallow(<Toolbar />);
  });

  describe('dom', () => {
    it('renders content', () => {
      assert.equal(component.find('div').length, 1);
    });
  });
});
