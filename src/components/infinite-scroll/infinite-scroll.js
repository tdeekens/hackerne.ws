import React from 'react';
import PropTypes from 'prop-types';

export class InfiniteScroll extends React.Component {
  static displayName = 'InfiniteScroll';
  static propTypes = {
    isLoading: PropTypes.bool,
    onFetchMore: PropTypes.func.isRequired,
    sentinelRef: PropTypes.shape({ current: PropTypes.object }).isRequired,
    children: PropTypes.node.isRequired,
  };
  static defaultProps = { isLoading: false };

  state = {};

  handleObserver = (entities, observer) => {
    const y = entities[0].boundingClientRect.y;

    if (this.state.prevY > y) {
      if (!this.props.isLoading) {
        this.props.onFetchMore();
      }
    }
    this.setState({ prevY: y });
  };

  componentDidMount() {
    this.observer = new IntersectionObserver(this.handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });
    this.observer.observe(this.props.sentinelRef.current);
  }

  render() {
    return this.props.children;
  }
}

export default InfiniteScroll;
