import * as React from 'react';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { ReduxState, ReduxAction } from './store';

import Main from './components/Main';
import Basket from './components/Pieces/Basket';
import SortDrawer from './components/SelectDrawer';
import CourseDrawer from './components/CourseDrawer';
import q from './components/Data/quarters.json';
import TopLiner from './components/Pieces/TopLiner';

import {
  Course,
  CourseEnrollment,
  professorRating,
} from './models/course.model';
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
  addBookmarkAction,
  removeBookmarkAction,
  loadBookmarkAction,
} from './store/course';

interface PropsFromStore {
  courses: Course[];
  filters: FilterList<FilterDomain, CourseType>;
  sortKey: CourseType;
  activeCourse: Course | null;
  quarter: number;
  tracking: CourseEnrollment[];
  prevStart: Date;
  loading: boolean;
  rmp: professorRating;
  bookmarks:Course[];
}

interface PropsToDispatch {
  load: (q: number) => void;
  addFilter: (f: Filter) => void;
  removeFilter: (f: Filter) => void;
  sort: (n: CourseType) => void;
  search: (name: string) => void;
  setActive: (c: Course | null, q: string) => void;
  addBookmark: (c: Course) => void;
  removeBookmark: (c: Course) => void;
  loadBookmark: () => void
}

type AppProps = PropsFromStore & PropsToDispatch;

export interface AppState {
  topLinerHeight: number;
  basketHeight: number;
  basketOpen: boolean;
  drawerWidth: number;
  cardHeight: number;
  cardWidth: number;
  aboutOpen: boolean;
  scrollIndex: number;
}

const quarter: number = q[1].code;

class App extends React.Component<AppProps, AppState> {
  state = {
    topLinerHeight: 30,
    basketHeight: 30,
    basketOpen: true,
    drawerWidth: 13.75,
    cardHeight: 6,
    cardWidth: 12.5,
    aboutOpen: false,
    scrollIndex: 0,
  };

  public componentDidMount() {
    this.props.load(quarter);
    // this.props.loadBookmark();
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

  setActive = (course: Course | null, row?: number) => {
    if(row){
      this.setState({ scrollIndex: row });
    }
    this.props.setActive(course, this.props.quarter.toString());
  };

  openDetail = (course: Course, row?: number) => {
    this.setActive(course, row);
  };

  closeDetail = () => {
    this.setActive(null, 0);
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

  scrollTo = (row: number) => {
    this.setState({
      scrollIndex:
        this.state.scrollIndex > 4 && this.props.activeCourse == null
          ? Math.floor(row / 3) * 7 + 5
          : row,
    });
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
            scrollTo={this.scrollTo}
            scrollIndex={this.state.scrollIndex}
          />
          <Basket
            basketOpen={this.state.basketOpen}
            courses={this.props.bookmarks}
            cardHeight={this.state.cardHeight}
            active={this.props.activeCourse}
            activeOpen={Boolean(this.props.activeCourse)}
            openDetail={this.openDetail}
            tracking={this.props.tracking}
            scrollTo={this.scrollTo}
          />
          <CourseDrawer
            addBasket={this.props.addBookmark}
            removeBasket={this.props.removeBookmark}
            basketCourses={this.props.bookmarks}
            open={Boolean(this.props.activeCourse)}
            closeDetail={this.closeDetail}
            course={this.props.activeCourse}
            tracking={this.props.tracking}
            prevStart={this.props.prevStart}
            quarter={this.props.quarter}
            loading={this.props.loading}
            rmp={this.props.rmp}
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
  prevStart: state.course.prevStart,
  loading: state.course.fetchTracking,
  rmp: state.course.rmp,
  bookmarks: state.course.bookmarks
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
  addBookmark: course => dispatch(addBookmarkAction(course)),
  removeBookmark: course => dispatch(removeBookmarkAction(course)),
  loadBookmark: () => dispatch(loadBookmarkAction())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
