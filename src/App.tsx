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
  basketCourses: { c: Course; r: number }[];
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
    basketCourses: [] as { c: Course; r: number }[],
    drawerWidth: 13.75,
    cardHeight: 6,
    cardWidth: 12.5,
    aboutOpen: false,
    scrollIndex: 0,
  };

  public componentDidMount() {
    this.props.load(quarter);
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

  setActive = (course: Course | null, row: number) => {
    this.setState({ scrollIndex: row });
    this.props.setActive(course, this.props.quarter.toString());
  };

  addBasket = (course: Course) => {
    this.setState({
      basketCourses: this.state.basketCourses
        .reduce(
          (courses, cur) => {
            return courses.concat([cur.c.number]);
          },
          [] as number[]
        )
        .includes(course.number)
        ? this.state.basketCourses
        : [
            ...this.state.basketCourses,
            { c: course, r: this.state.scrollIndex },
          ],
    });
  };

  removeBasket = (course: Course) => {
    this.setState({
      basketCourses: this.state.basketCourses.reduce(
        (courses, cur, index) => {
          return cur.c != course
            ? courses.concat(this.state.basketCourses[index])
            : courses;
        },
        [] as { c: Course; r: number }[]
      ),
    });
  };

  openDetail = (course: Course, row: number) => {
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
            courses={this.state.basketCourses}
            cardHeight={this.state.cardHeight}
            active={this.props.activeCourse}
            activeOpen={Boolean(this.props.activeCourse)}
            openDetail={this.openDetail}
            tracking={this.props.tracking}
            scrollTo={this.scrollTo}
          />
          <CourseDrawer
            addBasket={this.addBasket}
            removeBasket={this.removeBasket}
            basketCourses={this.state.basketCourses.reduce(
              (courses, cur) => {
                return courses.concat([cur.c]);
              },
              [] as Course[]
            )}
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
