import React from 'react';
import Story from '../story';
import InfiniteScroll from '../infinite-scroll';
import { createTopStoriesService } from '../../services/top-stories';
import { isUserOnline } from '../../utils/is-user-online';
import styles from './stories.module.css';

export class Stories extends React.Component {
  static displayName = 'Stories';

  service = createTopStoriesService();

  state = {
    stories: [],
    isLoading: false,
    hasMore: true,
    error: null,
  };

  setStory = story => {
    this.setState(prevState => ({
      stories: [...prevState.stories, story],
    }));
  };

  setError = error => {
    this.setState({ error });
  };

  setIsLoading = isLoading => {
    this.setState({ isLoading });
  };

  setHasMore = hasMore => {
    this.setState({ hasMore });
  };

  loadingSentinalRef = React.createRef();

  handleFetchMore = () => {
    this.setIsLoading(true);

    this.service.fetchMore();
  };

  componentDidMount() {
    this.service
      .subscribe(
        ({ payload: story, hasMore }) => {
          this.setStory(story);
          this.setHasMore(hasMore);
          this.setIsLoading(false);
        },
        error => {
          this.setError(error);
        }
      )
      .then(() => {
        this.handleFetchMore();
      });
  }

  render() {
    return (
      <div className={styles.stories}>
        <InfiniteScroll
          isLoading={this.state.isLoading}
          onFetchMore={this.handleFetchMore}
          sentinelRef={this.loadingSentinalRef}
        >
          {this.state.stories.map(story => (
            <Story
              key={story.id}
              id={story.id}
              author={story.by}
              title={story.title}
              url={story.url}
              score={story.score}
              publishedAt={story.time}
            />
          ))}
          <div
            ref={this.loadingSentinalRef}
            className={styles.loadingStateIndicator}
          >
            {(() => {
              if (this.state.error && isUserOnline())
                return <span>Sorry, something went wrong...</span>;
              else if (this.state.error && !isUserOnline())
                return (
                  <span>You seem to be offline. Please check your network</span>
                );
              else if (this.state.isLoading) return <span>Loading...</span>;
              else if (!this.state.hasMore)
                return <span>No more stories...</span>;
            })()}
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

export default Stories;
