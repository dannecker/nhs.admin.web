import React from 'react';
import classnames from 'classnames';
import withStyles from 'withStyles';

import styles from './styles.scss';

export default withStyles(styles)(({ list = [], theme = 'default' }) => (
  <dl className={classnames(styles.list, styles[`list_theme_${theme}`])}>
    {
      list.reduce((arr, item, index) => (
        arr.concat([
          <dt key={`dt-${index}`}>{item.name}</dt>,
          <dd key={`dd-${index}`}>{item.value}</dd>,
        ])
      ), [])
    }
  </dl>
));
