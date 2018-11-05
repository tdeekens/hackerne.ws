import React from 'react';
import PropTypes from 'prop-types';
import styles from './story.module.css';

const Link = props => (
  <div className={styles.link}>
    <a href={props.url}>
      <div className={styles.title}>{props.title}</div>
    </a>
  </div>
);
Link.displayName = 'Link';
Link.propTypes = {
  title: PropTypes.string.isRequired,
};

const PublishedAt = props => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return (
    <div className={styles.publishedAt}>
      at{' '}
      {new Date(props.timestamp * 1000).toLocaleDateString(
        props.locale,
        options
      )}
    </div>
  );
};
PublishedAt.displayName = 'PublishedAt';
PublishedAt.propTypes = {
  locale: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
};
PublishedAt.defaultProps = {
  locale: 'en-US',
};

export const Story = props => (
  <div className={styles.story}>
    <div className={styles.score}>{props.score}</div>
    <div>
      <Link url={props.url} title={props.title} />
      <div className={styles.meta}>
        <div className={styles.author}>by {props.author}</div>
        <PublishedAt timestamp={props.publishedAt} />
      </div>
    </div>
  </div>
);
Story.displayName = 'Story';
Story.propTypes = {
  id: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string,
  score: PropTypes.number.isRequired,
  publishedAt: PropTypes.number.isRequired,
};

export default Story;
