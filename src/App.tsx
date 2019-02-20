import * as React from 'react';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { ReduxState, ReduxAction } from './store';

import Main from './components/Main';
import SortDrawer from './components/SortDrawer';
import CourseDrawer from './components/CourseDrawer';
import BottomLiner from './components/BottomLiner';

import { Course } from './models/course.model';
import {
  fetchAction,
  sortAction,
  setActiveAction,
  addFilterAction,
  removeFilterAction,
  Filter,
  FilterList,
  FilterDomain,
  CourseType,
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
  filters: FilterList<FilterDomain, CourseType>;
  sortKey: CourseType;
  activeCourse: Course | null;
}

interface PropsToDispatch {
  load: (q: number) => void;
  addFilter: (f: Filter) => void;
  removeFilter: (f: Filter) => void;
  sort: (n: CourseType) => void;
  setActive: (c: Course | null) => void;
}

type AppProps = PropsFromStore & PropsToDispatch;

export interface AppState {
  drawerOpen: boolean;
  linerWidth: number;
  drawerWidth: number;
  cardHeight: number;
  cardWidth: number;
  linerOpen: boolean;
}

class App extends React.Component<AppProps, AppState> {
  state = {
    drawerOpen: false,
    linerWidth: 30,
    drawerWidth: 250,
    cardHeight: 100,
    cardWidth: 210,
    linerOpen: false,
  };

  public componentDidMount() {
    this.props.load(2190);
  }
  //#region prop functions
  sortCourses = (type: CourseType) => {
    this.props.sort(type);
  };

  addFilter = (type: Filter) => {
    this.props.addFilter(type);
  };

  removeFilter = (type: Filter) => {
    this.props.removeFilter(type);
  };

  changeQuarter = (q: number) => {
    this.props.load(q);
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

  condenseFilter = (
    filters: FilterList<FilterDomain, CourseType>
  ): Filter[] => {
    let list: Filter[] = [];
    for (let type in filters)
      filters[type].forEach(f =>
        list.push({ type: type as CourseType, name: f })
      );
    return list;
  };
  //#endregion
  render() {
    return (
      <div id={'app'}>
        <Liner>UCSC-Catalogue</Liner>
        <div id={'main'}>
          <SortDrawer
            sort={this.sortCourses}
            sortKey={this.props.sortKey}
            open={!this.state.drawerOpen}
            setDrawerWidth={this.setDrawerWidth}
            addFilter={this.addFilter}
            removeFilter={this.removeFilter}
            activeFilters={this.condenseFilter(this.props.filters)}
            changeQuarter={this.changeQuarter}
          />
          <Main
            courses={this.props.courses}
            open={this.state.drawerOpen}
            linerWidth={this.state.linerWidth}
            drawerWidth={this.state.drawerWidth}
            openDetail={this.openDetail}
            cardHeight={this.state.cardHeight}
            cardWidth={this.state.cardWidth}
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
      </div>
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
  load: quarter => dispatch(fetchAction(quarter)),
  sort: key => dispatch(sortAction(key)),
  setActive: course => dispatch(setActiveAction(course)),
  addFilter: type => dispatch(addFilterAction(type)),
  removeFilter: type => dispatch(removeFilterAction(type)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
