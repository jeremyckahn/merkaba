import React from 'react';
import { Details } from '../../src/components/details';
import { mount, shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('Details', () => {
  beforeEach(() => {
    component = shallow(<Details />);
  });

  describe('dom', () => {
    it('renders content', () => {
      assert.equal(component.find('div').length, 1);
    });
  });
});
