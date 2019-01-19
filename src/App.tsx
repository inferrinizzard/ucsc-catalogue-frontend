import * as React from 'react';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { ReduxState, ReduxAction } from './store';

import Main from './components/Main';
import SortDrawer from './components/SortDrawer';
import CourseDrawer from './components/CourseDrawer';
import BottomLiner from './components/BottomLiner';

import { Course, Filter } from './models/course.model';
import { fetchAction } from './store/course';

const Liner = styled.div`
  width: 100%;
  background: #5d92dd;
  z-index: 1201;
  position: fixed;
  top: 0;
`;

const drawerWidth = 300;
const linerWidth = 30;

interface PropsFromStore {
  courses: Course[];
  filters: Filter[];
}

interface PropsToDispatch {
  load: () => void
}

type AppProps = PropsFromStore & PropsToDispatch;

export interface AppState {
  drawerOpen: boolean;
  linerWidth: number;
  drawerWidth: number;
  linerOpen: boolean;
}

class App extends React.Component<AppProps, AppState> {
  state = {
    drawerOpen: false,
    linerWidth: 30,
    drawerWidth: 300,
    linerOpen: false,
  };

  public componentDidMount() {
    this.props.load();
  }

  sortCourses = (type: number) => {
    /*
    let courseTemp: Class[] = ([] as Class[]);
    switch (type) {
      case 0:
        courseTemp.concat(this.state.courses)
          .sort((a: Class, b: Class) =>
            a.course > b.course ? 1 : a.course < b.course ? -1 : 0
          );
        break;
      case 2:
        courseTemp.concat(this.state.courses)
          .sort((a: Class, b: Class) =>
            a.grade > b.grade ? 1 : a.grade < b.grade ? -1 : 0
          );
        break;
      default:
        courseTemp = this.state.courses;
        break;
    }
    this.setState({ ...this.state, courses: courseTemp });
    */
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

  openLiner = () => {
    this.setState({
      ...this.state,
      linerOpen: true,
    });
  };

  closeLiner = () => {
    this.setState({
      ...this.state,
      linerOpen: false,
    });
  };

  setDrawerWidth = (val: number) => {
    this.setState({ ...this.state, drawerWidth: val });
  };

  render() {
    return (
      <React.Fragment>
        <Liner>UCSC-Catalogue</Liner>
        <div>
          <SortDrawer
            sort={this.sortCourses}
            open={!this.state.drawerOpen}
            setDrawerWidth={this.setDrawerWidth}
          />
          <Main
            courses={this.props.courses}
            open={this.state.drawerOpen}
            linerWidth={this.state.linerWidth}
            drawerWidth={this.state.drawerWidth}
            openDetail={this.openDetail}
          />
          <CourseDrawer
            open={this.state.drawerOpen}
            closeDetail={this.closeDetail}
          />
        </div>
        <BottomLiner
          open={this.state.linerOpen}
          openLiner={this.openLiner}
          closeLiner={this.closeLiner}
        >
          About
        </BottomLiner>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: ReduxState): PropsFromStore => ({
  courses: state.course.courses,
  filters: state.course.filters,
});
const mapDispatchToProps = (
  dispatch: Dispatch<ReduxAction>
): PropsToDispatch => ({
  load: () => dispatch(fetchAction())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
