import React from 'react';
import styles from './header.module.css';

const isUserOnline = () =>
  typeof window !== 'undefined' && window.navigator && window.navigator.onLine;

export const Header = props => (
  <div className={styles.header}>
    <span>
      Your latest hackerne.ws top stories{' '}
      {!isUserOnline() ? " (you're offline)" : null}
    </span>
  </div>
);
Header.displayName = 'Header';

export default Header;
