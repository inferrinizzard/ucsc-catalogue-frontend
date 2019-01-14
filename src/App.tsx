import * as React from 'react';
import styled from 'styled-components';
import Drawer from '@material-ui/core/Drawer';

import ClassCard from './components/ClassCard';
import SortDrawer from './components/SortDrawer';
import CourseDrawer from './components/CourseDrawer';

const Liner = styled.div`
  width: 100%;
  background: #5d92dd;
  z-index: 1201;
  position: fixed;
`;

const TopLiner = styled(Liner)`
  top: 0;
`;
const BottomLiner = styled(Liner)`
  bottom: 0;
`;

const sortWidth = 400; //open width
//add bool for when courseDrawer is open, toggle as such
//same for when sorting is closed/open
const linerWidth = 30;

const Main = styled.div`
  margin-top: ${linerWidth}px;
  margin-left: ${sortWidth}px;
  width: calc(100% - ${sortWidth}px);
`;

//width: calc(100% - ${sortWidth+courseDrawerWidth}px);

export interface AppProps {}
export interface AppState {
  courses: object;
}

class App extends React.Component<AppProps, AppState> {
  state = {
    courses: {
      a: { course: 'AMS 3', name: 'smth', grade: 'A' },
      b: { course: 'AMS 5', name: 'Statistics', grade: 'B' },
      c: { course: 'AMS 7', name: 'smth else', grade: 'C' },
    },
  };
  render() {
    return (
      <React.Fragment>
        <TopLiner>UCSC-Catalogue</TopLiner>
        <div>
          <SortDrawer />
          <Main>
            {Object.keys(this.state.courses).map((key: string) => (
              <ClassCard key={key} courseData={this.state.courses[key]} />
            ))}
            <ClassCard courseData={this.state.courses.a} />
            <ClassCard courseData={this.state.courses.b} />
            <ClassCard courseData={this.state.courses.c} />
          </Main>
          <CourseDrawer />
        </div>
        <BottomLiner>About</BottomLiner>
      </React.Fragment>
    );
  }
}

export default App;
