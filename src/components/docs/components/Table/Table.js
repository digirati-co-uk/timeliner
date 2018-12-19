import React from 'react';
import BEM from '@fesk/bem-js';
import './Table.scss';

const $b = BEM.block('table');
const Table = ({ children }) => <table className={$b}>{children}</table>;
Table.Header = ({ children }) => (
  <thead className={$b.element('header')}>{children}</thead>
);
Table.Row = ({ children }) => <tr className={$b.element('row')}>{children}</tr>;
Table.Cell = ({ children, ...props }) => (
  <td className={$b.element('cell')} {...props}>
    {children}
  </td>
);

export default Table;
