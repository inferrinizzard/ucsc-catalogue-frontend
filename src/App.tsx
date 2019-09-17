import * as React from 'react';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ReduxState, ReduxAction } from './store';

import Main from './components/Main';
import Basket from './components/Pieces/Basket';
import SelectDrawer from './components/SelectDrawer';
import CourseDrawer from './components/CourseDrawer';
import TopLiner from './components/Pieces/TopLiner';
import BottomTabs from './components/Pieces/BottomTabs';

import q from './components/Data/quarters.json';

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
  backup: Course[];
  filters: FilterList<FilterDomain, CourseType>;
  sortKey: CourseType;
  activeCourse: Course | null;
  quarter: number;
  tracking: CourseEnrollment[];
  prevStart: Date;
  curStart: Date;
  loading: boolean;
  rmp: professorRating;
  bookmarks: Course[];
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
  loadBookmark: () => void;
}

type AppProps = PropsFromStore & PropsToDispatch;

export interface AppState {
  topLinerHeight: number;
  basketHeight: number;
  basketOpen: boolean;
  cardHeight: number;
  cardWidth: number;
  aboutOpen: boolean;
  scrollIndex: number;
  bottomTabHeight: number;
}

const quarter: number = q[q[0].code.toString().endsWith('4') ? 1 : 0].code;

class App extends React.Component<AppProps, AppState> {
  state = {
    topLinerHeight: 30,
    basketHeight: 30,
    basketOpen: true,
    cardHeight: 6,
    cardWidth: 12.5,
    aboutOpen: false,
    scrollIndex: 0,
    bottomTabHeight: 0,
  };

  componentDidMount = () => {
    this.props.load(quarter);
    // this.props.loadBookmark();
  };

  //#region prop functions
  setActive = (course: Course | null, row?: number) => {
    if (row) this.setState({ scrollIndex: row });
    this.props.setActive(course, this.props.quarter.toString());
  };

  scrollTo = (row: number) =>
    this.setState({
      scrollIndex:
        this.state.scrollIndex > 4 && !this.props.activeCourse
          ? Math.floor(row / 3) * 7 + 5
          : row,
    });

  condenseFilter = (filters: FilterList<FilterDomain, CourseType>): Filter[] =>
    Object.keys(filters).reduce(
      (list, type) => [
        ...list,
        ...filters[type].map(f => ({ type: type, name: f } as Filter)),
      ],
      [] as Filter[]
    );
  //#endregion
  render() {
    return (
      <div id="app">
        <TopLiner
          open={this.state.aboutOpen}
          setAbout={status => this.setState({ aboutOpen: status })}
          height={this.state.topLinerHeight}
        />
        <div id="main">
          <SelectDrawer
            courses={this.props.courses}
            backup={this.props.backup}
            sortKey={this.props.sortKey}
            open={!this.props.activeCourse}
            sort={(type: CourseType) => this.props.sort(type)}
            activeFilters={this.condenseFilter(this.props.filters)}
            addFilter={(type: Filter) => this.props.addFilter(type)}
            removeFilter={(type: Filter) => this.props.removeFilter(type)}
            clearFilters={() =>
              this.condenseFilter(this.props.filters).forEach(f =>
                this.props.removeFilter(f)
              )
            }
            changeQuarter={(q: number) => this.props.load(q)}
            search={this.props.search}
          />
          <Main
            courses={this.props.courses}
            open={Boolean(this.props.activeCourse)}
            topLinerHeight={this.state.topLinerHeight}
            basketHeight={this.state.basketHeight}
            openDetail={this.setActive}
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
            openDetail={this.setActive}
            tracking={this.props.tracking}
            scrollTo={this.scrollTo}
          />
          <CourseDrawer
            addBasket={this.props.addBookmark}
            removeBasket={this.props.removeBookmark}
            basketCourses={this.props.bookmarks}
            open={Boolean(this.props.activeCourse)}
            closeDetail={() => this.setActive(null, 0)}
            course={this.props.activeCourse}
            tracking={this.props.tracking}
            prevStart={this.props.prevStart}
            curStart={this.props.curStart}
            quarter={this.props.quarter}
            loading={this.props.loading}
            rmp={this.props.rmp}
          />
          {/* <BottomTabs /> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState): PropsFromStore => ({
  courses: state.course.courses,
  backup: state.course.backup,
  filters: state.course.filters,
  sortKey: state.course.sort,
  activeCourse: state.course.activeCourse,
  quarter: state.course.quarter,
  tracking: state.course.tracking,
  prevStart: state.course.prevStart,
  curStart: state.course.curStart,
  loading: state.course.fetchTracking,
  rmp: state.course.rmp,
  bookmarks: state.course.bookmarks,
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
  loadBookmark: () => dispatch(loadBookmarkAction()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
