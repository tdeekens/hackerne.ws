import React from 'react';
import { shallow } from 'enzyme';
import { Stories } from './stories';
import InfiniteScroll from '../infinite-scroll';
import Story from '../story';

const createStory = custom => ({
  id: 1,
  by: 'John Doe',
  title: 'Test story title',
  url: 'http://test-url.com',
  score: 12,
  time: 1541410855801,
  ...custom,
});

beforeAll(() => {
  global.fetch = jest.fn(() => Promise.resolve());
});

describe('rendering', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Stories />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('stories', () => {
    beforeEach(() => {
      wrapper.instance().setStory(createStory());
      wrapper.instance().setStory(createStory({ id: 2 }));
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render each <Story>', () => {
      expect(wrapper).toContainMatchingElements(2, Story);
    });
  });

  describe('fetching states', () => {
    describe('when loading', () => {
      beforeEach(() => {
        wrapper.instance().setIsLoading(true);
      });

      it('should give a loading state indication', () => {
        expect(wrapper.find('span')).toHaveText('Loading...');
      });
    });

    describe('when not having more', () => {
      beforeEach(() => {
        wrapper.instance().setHasMore(false);
      });

      it('should give a indication of not having more', () => {
        expect(wrapper.find('span')).toIncludeText('No more stories');
      });
    });

    describe('when error occured', () => {
      beforeEach(() => {
        wrapper.instance().setError(new Error('test error'));
      });

      it('should give a indication of not having more', () => {
        expect(wrapper.find('span')).toIncludeText(
          'Sorry, something went wrong'
        );
      });
    });
  });
});

describe('state handlers', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Stories />);
  });

  describe('setStory', () => {
    beforeEach(() => {
      wrapper.instance().setStory(createStory());
      wrapper.instance().setStory(createStory({ id: 2 }));
    });

    it('should add each added story', () => {
      expect(wrapper.state('stories')).toHaveLength(2);
    });
  });

  describe('setError', () => {
    const error = new Error('test error');
    beforeEach(() => {
      wrapper.instance().setError(error);
    });

    it('should set the error', () => {
      expect(wrapper).toHaveState('error', error);
    });
  });

  describe('setIsLoading', () => {
    beforeEach(() => {
      wrapper.instance().setIsLoading(true);
    });

    it('should set the loading state', () => {
      expect(wrapper).toHaveState('isLoading', true);
    });
  });

  describe('setHasMore', () => {
    beforeEach(() => {
      wrapper.instance().setHasMore(false);
    });

    it('should set the state', () => {
      expect(wrapper).toHaveState('hasMore', false);
    });
  });
});

describe('lifecycles', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Stories />);

    jest.spyOn(wrapper.instance().service, 'subscribe');

    wrapper.instance().componentDidMount();
  });

  it('should subscribe for changes on the service', () => {
    expect(wrapper.instance().service.subscribe).toHaveBeenCalled();

    expect(wrapper.instance().service.subscribe).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
  });
});
