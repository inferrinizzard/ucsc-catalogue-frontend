import * as React from 'react';
import { Dispatch } from 'redux';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { ReduxState, ReduxAction } from './store';

import Main from './components/Main';
import SortDrawer from './components/SortDrawer';
import CourseDrawer from './components/CourseDrawer';
import BottomLiner from './components/Pieces/BottomLiner';

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
  quarter: number;
  tracking: CourseEnrollment[];
  start: Date;
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
  linerWidth: number;
  drawerWidth: number;
  cardHeight: number;
  cardWidth: number;
  linerOpen: boolean;
}

class App extends React.Component<AppProps, AppState> {
  state = {
    linerWidth: 30,
    drawerWidth: 13.75,
    cardHeight: 6,
    cardWidth: 12.5,
    linerOpen: false,
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

  openDetail = (course: Course) => {
    this.setActive(course);
  };

  closeDetail = () => {
    this.setActive(null);
  };

  openLiner = () => {
    this.setState({
      linerOpen: true,
    });
  };

  closeLiner = () => {
    this.setState({
      linerOpen: false,
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
        <Liner
          style={{ height: '25px', textAlign: 'center', fontFamily: 'Roboto' }}
        >
          CruzAssist
        </Liner>
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
            linerWidth={this.state.linerWidth}
            drawerWidth={this.state.drawerWidth}
            openDetail={this.openDetail}
            cardHeight={this.state.cardHeight}
            cardWidth={this.state.cardWidth}
            active={this.props.activeCourse}
          />
          <CourseDrawer
            open={Boolean(this.props.activeCourse)}
            closeDetail={this.closeDetail}
            course={this.props.activeCourse}
            tracking={this.props.tracking}
            start={this.props.start}
            quarter={this.props.quarter}
            loading={this.props.loading}
            rmp={this.props.rmp}
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
  quarter: state.course.quarter,
  tracking: state.course.tracking,
  start: state.course.start,
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
