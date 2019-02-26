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
  active: Course | null;
}

export interface MainDivProps {
  open: boolean;
  linerWidth: number;
  drawerWidth: number;
}

export interface MainState {
  activeNum: number;
}

const MainDiv = styled.div`
  margin-top: ${(p: MainDivProps) => p.linerWidth}px;
  margin-left: ${p => p.drawerWidth}px;
  width: calc(${p => (p.open ? 52 : 100)}% - ${p => p.drawerWidth}px);
  height: calc(100% - ${p => p.linerWidth * 2}px);
`;

class Main extends React.Component<MainProps & MainDivProps, MainState> {
  state = { activeNum: 0 };
  setActive(c: Course, k: number) {
    this.props.openDetail(c);
    this.setState({ activeNum: c ? k : 0 });
  }
  render() {
    return (
      <MainDiv {...this.props}>
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => {
            const columns = Math.floor(width / this.props.cardWidth);
            const rows = Math.ceil(this.props.courses.length / columns);
            return (
              <div>
                <List
                  width={width}
                  height={height}
                  rowCount={rows}
                  rowHeight={this.props.cardHeight}
                  overscanRowCount={4}
                  scrollToIndex={this.state.activeNum}
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
                      this.props.courses.length
                    );
                    for (let i = fromIndex; i < toIndex; i++) {
                      let course = this.props.courses[i];
                      items.push(
                        <ClassCard
                          key={i}
                          k={i}
                          courseData={course}
                          active={this.props.active}
                          // setActive={this.setActive}
                          openDetail={this.props.openDetail}
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
  }
}

export default Main;
