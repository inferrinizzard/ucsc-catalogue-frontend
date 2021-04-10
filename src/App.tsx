import React, { createContext } from 'react';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ReduxState, ReduxAction } from './store';

import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter, push, replace, RouterState } from 'connected-react-router';
import { history } from './store/index';

import { ThemeProvider } from 'styled-components';

import Grid from './components/Grid';
import Basket from './components/DrawerItems/Basket';
import SelectDrawer from './components/SelectDrawer';
import CourseDrawer from './components/CourseDrawer';
import TopLiner from './components/DrawerItems/TopLiner';
import BottomTabs from './components/DrawerItems/BottomTabs';

import { Course, CourseEnrollment, professorRating, Quarter } from './models/course.model';
import {
	AvailableTermData,
	Filter,
	FilterList,
	FilterDomain,
	CourseType,
	fetchAction,
	sortAction,
	searchAction,
	setActiveAction,
	closeActiveAction,
	addFilterAction,
	removeFilterAction,
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
	quarter: Quarter;
	availableTerms: AvailableTermData;
	tracking: { fetching: boolean; data: CourseEnrollment[] };
	rmp: professorRating;
	bookmarks: Course[];
	loading: boolean;
	location: RouterState['location'];
}

interface PropsToDispatch {
	loadQuarter: (q: number, path: string) => void;
	addFilter: (f: Filter) => void;
	removeFilter: (f: Filter) => void;
	sort: (n: CourseType) => void;
	search: (name: string) => void;
	setActive: (c: Course, path: string) => void;
	closeActive: (path: string) => void;
	addBookmark: (c: Course) => void;
	removeBookmark: (c: Course) => void;
	loadBookmark: () => void;
}

type AppProps = PropsFromStore & PropsToDispatch;

export interface AppState {
	scrollIndex: number;
}

export const CourseContext = createContext({ active: null, list: [] } as {
	active: Course | null;
	list: Course[];
});
export const QuarterContext = createContext({ active: null, terms: {} } as {
	active: Quarter | null;
	terms: AvailableTermData;
});
const theme = {
	topLinerHeight: '2.5rem',
	topLinerBlue: '#5d92dd',
	selectDrawerWidth: 12.5, // %
	cardHeightPlus1: 1201,
	cardBlue: '#92c2ff',
};

const quarterPath = (q: number, path: string) =>
	path.includes('q=') ? path.replace(/q=[0-9]{4}/g, `q=${q}`) : `q=${q}`;
const coursePath = (courseId: string | number, path: string) =>
	path.includes('c=')
		? path.replace(/c=[0-9]+(?=\/?)/g, `c=${courseId}`)
		: (path.endsWith('/') ? path.slice(0, -1) : path) + `/c=${courseId}`;
const removeCoursePath = (path: string) => path.substring(0, path.indexOf('c=') - 1);

class App extends React.Component<AppProps, AppState> {
	state = {
		scrollIndex: 0,
	};

	componentDidMount = () => {
		const quarter = +(this.props.location.pathname.match(/q=[0-9]{4}/g)?.shift()?.slice(2) ?? 0); // prettier-ignore
		this.props.loadQuarter(quarter, quarterPath(quarter, this.props.location.pathname));
		// this.props.loadBookmark();
	};

	//#region prop functions
	setActive = (course: Course, row?: number) => {
		if (row) this.setState({ scrollIndex: row });
		this.props.setActive(course, coursePath(course.number, this.props.location.pathname));
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
							<QuarterContext.Provider
								value={{ active: this.props.quarter, terms: this.props.availableTerms }}>
								<ConnectedRouter history={history}>
									<>
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
											changeQuarter={q =>
												this.props.loadQuarter(q, quarterPath(q, this.props.location.pathname))
											}
											search={this.props.search}
										/>
										<Grid
											loading={this.props.loading}
											open={!!this.props.activeCourse}
											openDetail={this.setActive}
											scrollTo={this.scrollTo}
											scrollIndex={this.state.scrollIndex}
										/>
										<Basket
											courses={this.props.bookmarks}
											openDetail={this.setActive}
											tracking={this.props.tracking.data}
											activeOpen={!!this.props.activeCourse}
										/>
										<CourseDrawer
											addBasket={this.props.addBookmark}
											removeBasket={this.props.removeBookmark}
											basketCourses={this.props.bookmarks}
											closeDetail={() =>
												this.props.closeActive(removeCoursePath(this.props.location.pathname))
											}
											tracking={this.props.tracking}
											rmp={this.props.rmp}
										/>
										{/* <BottomTabs /> */}
									</>
								</ConnectedRouter>
							</QuarterContext.Provider>
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
	availableTerms: state.course.availableTerms,
	tracking: state.course.tracking,
	rmp: state.course.rmp,
	bookmarks: state.course.bookmarks,
	loading: state.course.loading,
	location: state.router.location,
});
const mapDispatchToProps = (dispatch: Dispatch<ReduxAction>): PropsToDispatch => ({
	loadQuarter: (quarter, path) => (dispatch(fetchAction(quarter)), dispatch(push(path))),
	sort: key => dispatch(sortAction(key)),
	search: name => dispatch(searchAction(name)),
	setActive: (course, path) => (dispatch(setActiveAction(course)), dispatch(push(path))),
	closeActive: path => (dispatch(closeActiveAction()), dispatch(push(path))),
	addFilter: type => dispatch(addFilterAction(type)),
	removeFilter: type => dispatch(removeFilterAction(type)),
	addBookmark: course => dispatch(addBookmarkAction(course)),
	removeBookmark: course => dispatch(removeBookmarkAction(course)),
	loadBookmark: () => dispatch(loadBookmarkAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
