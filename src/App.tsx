import React, { createContext } from 'react';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ReduxState, ReduxAction } from './store';

import { ThemeProvider } from 'styled-components';

import Grid from './components/Grid';
import Basket from './components/DrawerItems/Basket';
import SelectDrawer from './components/SelectDrawer';
import CourseDrawer from './components/CourseDrawer';
import TopLiner from './components/DrawerItems/TopLiner';
import BottomTabs from './components/DrawerItems/BottomTabs';

import q from './components/Data/quarters.json';

import { Course, CourseEnrollment, professorRating } from './models/course.model';
import {
	fetchAction,
	sortAction,
	searchAction,
	setActiveAction,
	closeActiveAction,
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
	loadQuarter: (q: number) => void;
	addFilter: (f: Filter) => void;
	removeFilter: (f: Filter) => void;
	sort: (n: CourseType) => void;
	search: (name: string) => void;
	setActive: (c: Course | null, q: string) => void;
	closeActive: () => void;
	addBookmark: (c: Course) => void;
	removeBookmark: (c: Course) => void;
	loadBookmark: () => void;
}

type AppProps = PropsFromStore & PropsToDispatch;

export interface AppState {
	scrollIndex: number;
}

const quarter: number = q[q[0].code.toString().endsWith('4') ? 1 : 0].code;

export const CourseContext = createContext({ active: null, list: [] } as {
	active: Course | null;
	list: Course[];
});
const theme = {
	topLinerHeight: '2.5rem',
	topLinerBlue: '#5d92dd',
	selectDrawerWidth: 12.5, // %
	cardHeightPlus1: 1201,
	cardBlue: '#92c2ff',
};

class App extends React.Component<AppProps, AppState> {
	state = {
		scrollIndex: 0,
	};

	componentDidMount = () => {
		this.props.loadQuarter(quarter);
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
				this.state.scrollIndex > 4 && !this.props.activeCourse ? Math.floor(row / 3) * 7 + 5 : row,
		});

	condenseFilter = (filters: FilterList<FilterDomain, CourseType>) =>
		Object.entries(filters).reduce<Filter[]>(
			(list, [type, filter]) => [...list, ...filter.map(f => ({ type, name: f } as Filter))],
			[]
		);
	//#endregion
	render() {
		return (
			<div id="app">
				<ThemeProvider theme={theme}>
					<TopLiner />
					<div
						id="main"
						style={{
							paddingTop: theme.topLinerHeight,
							height: `calc(100% - ${theme.topLinerHeight})`,
						}}>
						<CourseContext.Provider
							value={{ active: this.props.activeCourse, list: this.props.courses }}>
							<SelectDrawer
								backup={this.props.backup}
								sortKey={this.props.sortKey}
								open={!this.props.activeCourse}
								sort={this.props.sort}
								activeFilters={this.condenseFilter(this.props.filters)}
								addFilter={this.props.addFilter}
								removeFilter={this.props.removeFilter}
								clearFilters={() =>
									this.condenseFilter(this.props.filters).forEach(this.props.removeFilter)
								}
								changeQuarter={this.props.loadQuarter}
								search={this.props.search}
							/>
							<Grid
								open={!!this.props.activeCourse}
								openDetail={this.setActive}
								scrollTo={this.scrollTo}
								scrollIndex={this.state.scrollIndex}
							/>
							<Basket
								courses={this.props.bookmarks}
								openDetail={this.setActive}
								tracking={this.props.tracking}
								activeOpen={!!this.props.activeCourse}
							/>
							<CourseDrawer
								addBasket={this.props.addBookmark}
								removeBasket={this.props.removeBookmark}
								basketCourses={this.props.bookmarks}
								closeDetail={this.props.closeActive}
								tracking={this.props.tracking}
								prevStart={this.props.prevStart}
								curStart={this.props.curStart}
								quarter={this.props.quarter}
								loading={this.props.loading}
								rmp={this.props.rmp}
							/>
							{/* <BottomTabs /> */}
						</CourseContext.Provider>
					</div>
				</ThemeProvider>
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
const mapDispatchToProps = (dispatch: Dispatch<ReduxAction>): PropsToDispatch => ({
	loadQuarter: quarter => dispatch(fetchAction(quarter)),
	sort: key => dispatch(sortAction(key)),
	search: name => dispatch(searchAction(name)),
	setActive: (course, quarter) => dispatch(setActiveAction(course, quarter)),
	closeActive: () => dispatch(closeActiveAction()),
	addFilter: type => dispatch(addFilterAction(type)),
	removeFilter: type => dispatch(removeFilterAction(type)),
	addBookmark: course => dispatch(addBookmarkAction(course)),
	removeBookmark: course => dispatch(removeBookmarkAction(course)),
	loadBookmark: () => dispatch(loadBookmarkAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
