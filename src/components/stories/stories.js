import React from 'react';
import Story from '../story';
import InfiniteScroll from '../infinite-scroll';
import { createTopStoriesService } from '../../services/top-stories';
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
            {this.state.isLoading && <span>Loading...</span>}
            {!this.state.hasMore && <span>No more stories...</span>}
            {this.state.error && <span>Sorry, something went wrong...</span>}
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

export default Stories;
