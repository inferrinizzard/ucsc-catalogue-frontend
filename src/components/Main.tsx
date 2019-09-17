import * as React from 'react';
import styled from 'styled-components';
import toPX from 'to-px';

import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { List } from 'react-virtualized/dist/es/List';

import ClassCard from './Pieces/ClassCard';
import { Course } from '../models/course.model';

export interface MainProps {
  courses: Course[];
  openDetail: (course: Course, row: number) => void;
  cardWidth: number;
  cardHeight: number;
  active: Course | null;
  scrollIndex: number;
  scrollTo: (row: number) => void;
  basketHeight: number;
}

export interface MainDivProps {
  open: boolean;
  topLinerHeight: number;
  drawerWidth: number;
}

const MainDiv = styled.div<MainDivProps>`
  margin-top: ${(p: MainDivProps) => p.topLinerHeight}px;
  margin-left: ${(p: MainDivProps) => toPX(p.drawerWidth + 'em')}px;
  width: calc(
    ${(p: MainDivProps) => (p.open ? 52 : 100)}% -
      ${(p: MainDivProps) => toPX(p.drawerWidth + 'em') + 10}px
  );
  height: 100%;
`;

const Main: React.SFC<MainProps & MainDivProps> = props => (
  <MainDiv
    {...{
      topLinerHeight: props.topLinerHeight,
      drawerWidth: props.drawerWidth,
      open: props.open,
    }}
  >
    {/* <div
        style={{
          marginTop: props.topLinerHeight + 'px',
          marginLeft: props.drawerWidth + 'em',
          width:
            'calc(' +
            (props.open ? '52%' : '100%') +
            ' - ' +
            (props.drawerWidth + 'em') +
            ')',
          height: '100%',
        }}
      ></div> */}
    <AutoSizer>
      {({ height, width }: { height: number; width: number }) => {
        const columns = Math.floor(width / toPX(props.cardWidth + 'em'));
        const rows = Math.ceil(props.courses.length / columns);
        return (
          <div>
            <List
              width={width}
              height={height}
              rowCount={rows}
              rowHeight={toPX(props.cardHeight + 'em')}
              overscanRowCount={4}
              scrollToAlignment="start"
              scrollToIndex={props.scrollIndex}
              style={{
                outline: 'none',
              }}
              rowRenderer={({
                index,
                key,
                style,
              }: {
                index: number;
                key: string;
                style: any;
              }) => {
                const items = [];
                const fromIndex: number = index * columns;
                const toIndex: number = Math.min(
                  fromIndex + columns,
                  props.courses.length
                );

                // slice, maybe?
                for (let i = fromIndex; i < toIndex; i++)
                  items.push(
                    <ClassCard
                      key={i}
                      row={index}
                      courseData={props.courses[i]}
                      active={props.active}
                      openDetail={(course, row) => {
                        props.openDetail(course, row);
                        props.scrollTo(row);
                      }}
                    />
                  );
                return (
                  <div key={key} style={style}>
                    {items}
                  </div>
                );
              }}
            />
          </div>
        );
      }}
    </AutoSizer>
  </MainDiv>
);

export default Main;
