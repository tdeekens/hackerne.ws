import { fetchSequential } from '../../utils/fetch-sequential';
import { createStoriesService } from '../stories';

const defaultConfig = {
  uri: 'https://hacker-news.firebaseio.com/v0/topstories',
  format: 'json',
  limit: 20,
};

/**
 * Service to fetch top stories from the hackernews API. The default
 * configuration can be overwritten by passing in a custom config.
 *
 * This service follows a subscriber mechanism. Creating the service results
 * in receiving an instance. The instance has a `subscribe` method which has
 * `onNext` and `onError` as arguments. After setting up the subscription
 * calling `fetchMore` will yield more results by invoking `onNext`.
 *
 * The service fetches n-items according to the `limit` parameter at once until
 * `fetchMore` should be invoked again.
 *
 * Internally the service keeps track of loading state, the window and indicates
 * if invoking `fetchMore` would yield more results (by the `hasMore` property).
 */
export default function create(config = defaultConfig) {
  const storiesService = createStoriesService();
  const fetchIds = () =>
    fetch(`${config.uri}.${config.format}`).then(response => response.json());
  const start = () => ({
    state: {
      storyIds: [],
      limit: config.limit,
      offset: 0,
      isLoading: false,
    },
    fetchMore() {
      this.state.isLoading = true;
      return fetchSequential(
        this.state.storyIds
          .slice(this.state.offset, this.state.offset + this.state.limit)
          .map(storyId => storiesService.fetchOne(storyId)),
        {
          onStepFullfillment: payload => {
            this.listeners.onNext({
              payload,
              hasMore: this.state.storyIds.length > this.state.offset,
            });
          },
          onStepRejection: this.listeners.onError,
        }
      )
        .then(() => {
          this.state.offset = this.state.offset + this.state.limit;
          this.state.isLoading = false;
        })
        .catch(() => {
          this.state.isLoading = false;
        });
    },
    subscribe(onNext, onError) {
      this.listeners = {
        onNext,
        onError,
      };

      this.state.isLoading = true;

      return fetchIds()
        .then(storyIds => {
          this.state.isLoading = false;

          this.state.storyIds = storyIds;
        })
        .catch(() => {
          this.state.isLoading = false;
        });
    },
  });

  return start();
}
