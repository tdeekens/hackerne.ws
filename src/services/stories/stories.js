const defaultConfig = {
  uri: 'https://hacker-news.firebaseio.com/v0/item',
  format: 'json',
};

/**
 * Service to fetch one or multiple stories from the hackernews API.
 *
 * It currently supports fetching one `fetchOne` story by id. The default
 * configuration can be overwritten by passing in a custom config.
 */
export default function create(config = defaultConfig) {
  const fetchOne = id =>
    fetch(`${config.uri}/${id}.${config.format}`).then(response =>
      response.json()
    );

  return {
    fetchOne,
  };
}
