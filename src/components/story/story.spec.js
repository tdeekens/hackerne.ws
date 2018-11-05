import React from 'react';
import { shallow } from 'enzyme';
import { Story } from './story';

const createTestProps = customProps => ({
  id: 1,
  author: 'John Doe',
  title: 'Test story title',
  url: 'http://test-url.com',
  score: 12,
  publishedAt: 1541410855801,
  ...customProps,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<Story {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the author', () => {
    expect(wrapper).toIncludeText(props.author);
  });
});
