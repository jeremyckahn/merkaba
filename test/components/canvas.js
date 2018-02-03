import React from 'react';
import { Canvas } from '../../src/components/canvas';
import { mount, shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('Canvas', () => {
  beforeEach(() => {
    component = shallow(<Canvas />);
  });

  describe('dom', () => {
    it('renders content', () => {
      assert.equal(component.find('div').length, 1);
    });
  });
});
