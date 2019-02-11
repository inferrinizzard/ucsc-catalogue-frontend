import * as React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';

import { Course } from '../models/course.model';
import ClassCard from './ClassCard';

export interface VirTableProps {
  rows: number;
  rowHeight: number;
  columns: Column[];
}
export interface VirTableState {}

class VirTable extends React.PureComponent<VirTableProps, VirTableState> {
  state = {};

  cellRenderer = (cellData: Course[], colIndex: number) => {
    return (
      <TableCell
        component="div"
        variant="body"
        style={{ height: this.props.rowHeight }}
      >
        {cellData}
      </TableCell>
    );
  };
  return() {
    return (
      <AutoSizer>
        {(height: number, width: number) => (
          <Table disableHeader height={height} width={width} {...this.props}>
            {this.props.columns.map((col: Column, index: number) => {})}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

export default VirTable;
