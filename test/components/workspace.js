import React from 'react';
import { Workspace } from '../../src/components/workspace';
import { mount, shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('Workspace', () => {
  beforeEach(() => {
    component = shallow(<Workspace />);
  });

  describe('dom', () => {
    it('renders content', () => {
      assert.equal(component.find('div').length, 1);
    });
  });
});
