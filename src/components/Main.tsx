import * as React from 'react';
import { PureComponent } from 'react';
import styled from 'styled-components';
import { AutoSizer, List } from 'react-virtualized';

import { Course } from '../models/course.model';
import ClassCard from './Pieces/ClassCard';
import { CombineLatestSubscriber } from 'rxjs/internal/observable/combineLatest';

export interface MainProps {
  courses: Course[];
  openDetail: (course: Course) => void;
  cardWidth: number;
  cardHeight: number;
}

export interface MainDivProps {
  open: boolean;
  linerWidth: number;
  drawerWidth: number;
}

const MainDiv = styled.div`
  margin-top: ${(p: MainDivProps) => p.linerWidth}px;
  margin-left: ${p => p.drawerWidth}px;
  width: calc(${p => (p.open ? 50 : 100)}% - ${p => p.drawerWidth}px);
  height: calc(100% - ${p => p.linerWidth * 2}px);
`;

const Main: React.SFC<MainProps & MainDivProps> = props => {
  return (
    <MainDiv {...props}>
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => {
          const columns = Math.floor(width / props.cardWidth);
          const rows = Math.ceil(props.courses.length / columns);
          return (
            <div>
              <List
                width={width}
                height={height}
                rowCount={rows}
                rowHeight={props.cardHeight}
                overscanRowCount={4}
                // scrollToRow={}
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
                  for (let i = fromIndex; i < toIndex; i++) {
                    let course = props.courses[i];
                    items.push(
                      <ClassCard
                        key={i}
                        courseData={course}
                        openDetail={props.openDetail}
                      />
                    );
                  }
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
};

export default Main;
