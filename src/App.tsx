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
import {
  fetchAction,
  sortAction,
  setActiveAction,
  addFilterAction,
  removeFilterAction,
} from './store/course';
import { dispatch } from 'rxjs/internal/observable/pairs';

const Liner = styled.div`
  width: 100%;
  background: #5d92dd;
  z-index: 1201;
  position: fixed;
  top: 0;
`;

interface PropsFromStore {
  courses: Course[];
  filters: Filter[];
  sortKey: keyof Course;
  activeCourse: Course | null;
}

interface PropsToDispatch {
  load: () => void;
  addFilter: (f: Filter) => void;
  removeFilter: (f: Filter) => void;
  sort: (n: keyof Course) => void;
  setActive: (c: Course | null) => void;
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

  sortCourses = (type: keyof Course) => {
    this.props.sort(type);
  };

  addFilter = (type: Filter) => {
    this.props.addFilter(type);
  };

  removeFilter = (type: Filter) => {
    this.props.removeFilter(type);
  };

  setActive = (course: Course | null) => {
    this.props.setActive(course);
  };

  openDetail = (course: Course) => {
    this.setActive(course);
    this.setState({
      ...this.state,
      drawerOpen: true,
    });
  };

  closeDetail = () => {
    this.setActive(null);
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
            sortKey={this.props.sortKey}
            open={!this.state.drawerOpen}
            setDrawerWidth={this.setDrawerWidth}
            addFilter={this.addFilter}
            removeFilter={this.removeFilter}
            activeFilters={this.props.filters}
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
            course={this.props.activeCourse}
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
  sortKey: state.course.sort,
  activeCourse: state.course.activeCourse,
});
const mapDispatchToProps = (
  dispatch: Dispatch<ReduxAction>
): PropsToDispatch => ({
  load: () => dispatch(fetchAction()),
  sort: key => dispatch(sortAction(key)),
  setActive: course => dispatch(setActiveAction(course)),
  addFilter: type => dispatch(addFilterAction(type)),
  removeFilter: type => dispatch(removeFilterAction(type)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
