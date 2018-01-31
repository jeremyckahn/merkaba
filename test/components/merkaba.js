import React from 'react';
import { Merkaba } from '../../src/components/merkaba';
import { selectedTool } from '../../src/enums';
import { mount, shallow } from 'enzyme';
import assert from 'assert';

let component;

describe('Merkaba', () => {
  beforeEach(() => {
    component = shallow(<Merkaba />);
  });

  describe('dom', () => {
    it('renders content', () => {
      assert.equal(component.find('div').length, 1);
    });
  });

  describe('state', () => {
    describe('selectedTool', () => {
      it('has a default value', () => {
        assert.equal(component.state('selectedTool'), selectedTool.NONE);
      });
    });
  });
});
