import React from 'react';
import { shallow } from 'enzyme';
import { Header } from './header';

beforeAll(() => {
  global.window = {};
});
describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Header />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
