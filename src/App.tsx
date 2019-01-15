import * as React from 'react';
import styled from 'styled-components';

import Main from './components/Main';
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

const sortWidth = 300; //open width
//add bool for when courseDrawer is open, toggle as such
//same for when sorting is closed/open
const linerWidth = 30;

//width: calc(100% - ${sortWidth+courseDrawerWidth}px);

export interface AppProps {}
export interface AppState {
  courses: Class[];
  drawerOpen: boolean;
}

export type Class = { course: string; name: string; grade: string };

class App extends React.Component<AppProps, AppState> {
  state = {
    courses: [
      { course: 'AMS 3', name: 'smth', grade: 'C' },
      { course: 'AMS 5', name: 'Statistics', grade: 'B' },
      { course: 'AMS 7', name: 'smth else', grade: 'A' },
    ],
    drawerOpen: false,
  };

  sortCourses = (type: number) => {
    let courseTemp: Class[] = [];
    switch (type) {
      case 0:
        courseTemp = ([] as Class[])
          .concat(this.state.courses)
          .sort((a: Class, b: Class) =>
            a.course > b.course ? 1 : a.course < b.course ? -1 : 0
          );
        break;
      case 2:
        courseTemp = ([] as Class[])
          .concat(this.state.courses)
          .sort((a: Class, b: Class) =>
            a.grade > b.grade ? 1 : a.grade < b.grade ? -1 : 0
          );
        break;
      default:
        courseTemp = this.state.courses;
        break;
    }
    this.setState({ ...this.state, courses: courseTemp });
  };

  openDetail = () => {
    this.setState({
      ...this.state,
      drawerOpen: true,
    });
  };

  closeDetail = () => {
    this.setState({
      ...this.state,
      drawerOpen: false,
    });
  };

  render() {
    return (
      <React.Fragment>
        <TopLiner>UCSC-Catalogue</TopLiner>
        <div>
          <SortDrawer sort={this.sortCourses} open={!this.state.drawerOpen} />
          <Main
            courses={this.state.courses}
            open={this.state.drawerOpen}
            linerWidth={30}
            sortWidth={200}
            openDetail={this.openDetail}
          />
          <CourseDrawer
            open={this.state.drawerOpen}
            closeDetail={this.closeDetail}
          />
        </div>
        <BottomLiner>About</BottomLiner>
      </React.Fragment>
    );
  }
}

export default App;
