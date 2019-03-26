import * as React from 'react';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { ReduxState, ReduxAction } from './store';

import Main from './components/Main';
import Basket from './components/Pieces/Basket';
import SortDrawer from './components/SortDrawer';
import CourseDrawer from './components/CourseDrawer';
import TopLiner from './components/Pieces/TopLiner';

import { Course, CourseEnrollment } from './models/course.model';
import {
  fetchAction,
  sortAction,
  searchAction,
  setActiveAction,
  addFilterAction,
  removeFilterAction,
  Filter,
  FilterList,
  FilterDomain,
  CourseType,
} from './store/course';

interface PropsFromStore {
  courses: Course[];
  filters: FilterList<FilterDomain, CourseType>;
  sortKey: CourseType;
  activeCourse: Course | null;
  quarter: number;
  tracking: CourseEnrollment[];
  start: Date;
  loading: boolean;
}

interface PropsToDispatch {
  load: (q: number) => void;
  addFilter: (f: Filter) => void;
  removeFilter: (f: Filter) => void;
  sort: (n: CourseType) => void;
  search: (name: string) => void;
  setActive: (c: Course | null, q: string) => void;
}

type AppProps = PropsFromStore & PropsToDispatch;

export interface AppState {
  topLinerHeight: number;
  basketHeight: number;
  basketOpen: boolean;
  basketCourses: Course[];
  drawerWidth: number;
  cardHeight: number;
  cardWidth: number;
  aboutOpen: boolean;
}

class App extends React.Component<AppProps, AppState> {
  state = {
    topLinerHeight: 30,
    basketHeight: 30,
    basketOpen: true,
    basketCourses: [] as Course[],
    drawerWidth: 13.75,
    cardHeight: 6,
    cardWidth: 12.5,
    aboutOpen: false,
  };

  public componentDidMount() {
    this.props.load(2192);
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
    this.props.setActive(course, this.props.quarter.toString());
  };

  addBasket = (course: Course) => {
    this.setState({
      basketCourses: this.state.basketCourses
        .reduce(
          (numbers: number[], cur: Course) => [...numbers, cur.number],
          []
        )
        .includes(course.number)
        ? this.state.basketCourses
        : [...this.state.basketCourses, course],
    });
  };

  removeBasket = (course: Course) => {
    this.setState({
      basketCourses: this.state.basketCourses.filter(c => c != course),
    });
  };

  openDetail = (course: Course) => {
    this.setActive(course);
  };

  closeDetail = () => {
    this.setActive(null);
  };

  openAbout = () => {
    this.setState({
      aboutOpen: true,
    });
  };

  closeAbout = () => {
    this.setState({
      aboutOpen: false,
    });
  };

  setDrawerWidth = (val: number) => {
    this.setState({ drawerWidth: val });
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
        <TopLiner
          open={this.state.aboutOpen}
          openAbout={this.openAbout}
          closeAbout={this.closeAbout}
          height={this.state.topLinerHeight}
        />
        <div id={'main'}>
          <SortDrawer
            sort={this.sortCourses}
            sortKey={this.props.sortKey}
            open={!Boolean(this.props.activeCourse)}
            setDrawerWidth={this.setDrawerWidth}
            addFilter={this.addFilter}
            removeFilter={this.removeFilter}
            activeFilters={this.condenseFilter(this.props.filters)}
            changeQuarter={this.changeQuarter}
            search={this.props.search}
          />
          <Main
            courses={this.props.courses}
            open={Boolean(this.props.activeCourse)}
            topLinerHeight={this.state.topLinerHeight}
            basketHeight={this.state.basketHeight}
            drawerWidth={this.state.drawerWidth}
            openDetail={this.openDetail}
            cardHeight={this.state.cardHeight}
            cardWidth={this.state.cardWidth}
            active={this.props.activeCourse}
          />
          <Basket
            basketOpen={this.state.basketOpen}
            courses={this.state.basketCourses}
            cardHeight={this.state.cardHeight}
            active={this.props.activeCourse}
            activeOpen={Boolean(this.props.activeCourse)}
            openDetail={this.openDetail}
            tracking={this.props.tracking}
          />
          <CourseDrawer
            addBasket={this.addBasket}
            removeBasket={this.removeBasket}
            basketCourses={this.state.basketCourses}
            open={Boolean(this.props.activeCourse)}
            closeDetail={this.closeDetail}
            course={this.props.activeCourse}
            tracking={this.props.tracking}
            start={this.props.start}
            quarter={this.props.quarter}
            loading={this.props.loading}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState): PropsFromStore => ({
  courses: state.course.courses,
  filters: state.course.filters,
  sortKey: state.course.sort,
  activeCourse: state.course.activeCourse,
  quarter: state.course.quarter,
  tracking: state.course.tracking,
  start: state.course.start,
  loading: state.course.fetchTracking,
});
const mapDispatchToProps = (
  dispatch: Dispatch<ReduxAction>
): PropsToDispatch => ({
  load: quarter => dispatch(fetchAction(quarter)),
  sort: key => dispatch(sortAction(key)),
  search: name => dispatch(searchAction(name)),
  setActive: (course, quarter) => dispatch(setActiveAction(course, quarter)),
  addFilter: type => dispatch(addFilterAction(type)),
  removeFilter: type => dispatch(removeFilterAction(type)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
