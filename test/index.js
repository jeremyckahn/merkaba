import React from 'react';
import { Merkaba } from '../src/merkaba';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import assert from 'assert';

Enzyme.configure({ adapter: new Adapter() });

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
});
