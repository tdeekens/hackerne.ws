import React from 'react';
import { isUserOnline } from '../../utils/is-user-online';
import styles from './header.module.css';

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
