import * as React from 'react';
import styled from 'styled-components';
import toPX from 'to-px';

import { AutoSizer } from 'react-virtualized/dist/es/AutoSizer';
import { List } from 'react-virtualized/dist/es/List';

import { Course } from '../models/course.model';
import ClassCard from './Pieces/ClassCard';

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
  margin-left: ${p => toPX(p.drawerWidth + 'em')}px;
  width: calc(
    ${p => (p.open ? 52 : 100)}% - ${p => toPX(p.drawerWidth + 'em')}px
  );
  height: calc(100% - ${p => p.linerWidth}px);
`;

class Main extends React.Component<MainProps & MainDivProps, MainState> {
  state = { activeNum: 0 };
  setActive = (c: Course, k: number) => {
    this.props.openDetail(c);
    // this.setState({ activeNum: c ? k : 0 });
    //need to set logic for mod the rowcount before and after
  };
  render() {
    return (
      <MainDiv {...this.props}>
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => {
            const columns = Math.floor(
              width / toPX(this.props.cardWidth + 'em')
            );
            const rows = Math.ceil(this.props.courses.length / columns);
            return (
              <div>
                <List
                  width={width}
                  height={height}
                  rowCount={rows}
                  rowHeight={toPX(this.props.cardHeight + 'em')}
                  overscanRowCount={4}
                  scrollToRow={this.state.activeNum}
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
                          k={index}
                          courseData={course}
                          active={this.props.active}
                          // setActive={this.setActive}
                          openDetail={this.setActive}
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
