import React from 'react';
import { shallow } from 'enzyme';
import { isUserOnline } from '../../utils/is-user-online';
import { Header } from './header';

jest.mock('../../utils/is-user-online');

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
