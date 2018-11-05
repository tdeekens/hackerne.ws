import React from 'react';
import { shallow } from 'enzyme';
import { InfiniteScroll } from './infinite-scroll';

const createTestProps = customProps => ({
  isLoading: false,
  onFetchMore: jest.fn(),
  sentinelRef: React.createRef(),
  children: <div />,
  ...customProps,
});

beforeAll(() => {
  global.IntersectionObserver = function() {
    return {
      observe: jest.fn(),
    };
  };
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<InfiniteScroll {...props} />);
  });

  it('should render the passed children', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('lifecycles', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<InfiniteScroll {...props} />);
  });

  describe('componentDidMount', () => {
    beforeEach(() => {
      wrapper.instance().componentDidMount();
      jest.spyOn(wrapper.instance().observer, 'observe');
      wrapper.instance().componentDidMount();
    });

    it('should observe the passed sentinel ref', () => {
      expect(wrapper.instance().observer.observe).toHaveBeenCalledWith(
        props.sentinelRef.current
      );
    });
  });
});

describe('interacting', () => {
  describe('handleObserver', () => {
    const createEntries = () => [
      {
        boundingClientRect: {
          y: 100,
        },
      },
    ];
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<InfiniteScroll {...props} />);
    });

    describe('given previous y is bigger then next y', () => {
      describe('when not loading', () => {
        beforeEach(() => {
          wrapper.setState({ prevY: 150 });
          wrapper.instance().handleObserver(createEntries());
        });
        it('should invoke `onFetchMore`', () => {
          expect(props.onFetchMore).toHaveBeenCalled();
        });
      });

      describe('when loading', () => {
        beforeEach(() => {
          props = createTestProps({
            isLoading: true,
          });
          wrapper = shallow(<InfiniteScroll {...props} />);
          wrapper.setState({ prevY: 150 });
          wrapper.instance().handleObserver(createEntries());
        });
        it('should not invoke `onFetchMore`', () => {
          expect(props.onFetchMore).not.toHaveBeenCalled();
        });
      });
    });

    describe('given previous y is smaller then next y', () => {
      describe('when not loading', () => {
        beforeEach(() => {
          wrapper.setState({ prevY: 50 });
          wrapper.instance().handleObserver(createEntries());
        });
        it('should not invoke `onFetchMore`', () => {
          expect(props.onFetchMore).not.toHaveBeenCalled();
        });
      });
    });
  });
});
