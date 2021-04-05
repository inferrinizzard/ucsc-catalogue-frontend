import { Action } from 'redux';
import { Epic, combineEpics } from 'redux-observable';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { tap, ignoreElements } from 'rxjs/operators';

import { Course, CourseEnrollment, professorRating } from '../models/course.model';
import API from '../services/api';
import q from '../components/Data/quarters.json';

export interface CourseState {
	loading: boolean;
	filters: FilterList<FilterDomain, CourseType>;
	sort: CourseType;
	courses: Course[];
	filtered: Course[];
	backup: Course[];
	activeCourse: Course | null;
	quarter: number;
	tracking: { fetching: boolean; data: CourseEnrollment[] };
	prevStart: Date;
	curStart: Date;
	search: string;
	rmp: professorRating;
	bookmarks: Course[];
}
//#region define types
export type CourseType = keyof Course;
export { Course } from '../models/course.model';
export type Filter = { type: FilterDomain; name: string };
export enum FilterDomain {
	subject = 'subject',
	level = 'level',
	ge = 'ge',
	type = 'type',
}
export declare type DefineFilterKey<CourseType> = {
	[key: string]: string[];
};
export declare type FilterList<
	FilterDomain extends string,
	CourseType
> = DefineFilterKey<CourseType> & { readonly [value in FilterDomain]: string[] };
//#endregion
const initialState: CourseState = {
	loading: true,
	filters: {
		subject: [],
		level: [],
		ge: [],
		type: [],
	},
	sort: 'subjectCode',
	courses: [],
	filtered: [],
	backup: [],
	activeCourse: null,
	quarter: q[q[0].code.toString().endsWith('4') ? 1 : 0].code,
	tracking: { fetching: false, data: [] },
	prevStart: new Date(0),
	curStart: new Date(0),
	search: '',
	rmp: {} as professorRating,
	bookmarks: [],
};
//#region actions

enum ActionTypes {
	FETCH_API = 'fetch',
	FETCH_API_SUCCESS = 'fetch-success',
	SORT = 'sort',
	SEARCH = 'search',
	ADD_FILTER = 'add-filter',
	REMOVE_FILTER = 'remove-filter',
	SET_ACTIVE = 'set-active',
	CLOSE_ACTIVE = 'close-active',
	ACTIVE_SUCCESS = 'active-success',
	ADD_BOOKMARK = 'add-bookmark',
	REMOVE_BOOKMARK = 'remove-bookmark',
	LOAD_BOOKMARK = 'load-bookmark',
	LOAD_BOOKMARK_COMPLETE = 'load-bookmark-complete',
}

interface FetchAction extends Action {
	type: ActionTypes.FETCH_API;
	quarter: number;
}
export const fetchAction = (quarter: number): FetchAction => ({
	type: ActionTypes.FETCH_API,
	quarter,
});

interface FetchSuccessAction extends Action {
	type: ActionTypes.FETCH_API_SUCCESS;
	data: Course[];
	prevStart: Date;
	curStart: Date;
}
export const fetchSuccessAction = (
	data: Course[],
	prevStart: Date,
	curStart: Date
): FetchSuccessAction => ({
	type: ActionTypes.FETCH_API_SUCCESS,
	data,
	prevStart,
	curStart,
});

interface SortAction extends Action {
	type: ActionTypes.SORT;
	sort: CourseType;
}
export const sortAction = (sort: CourseType): SortAction => ({
	type: ActionTypes.SORT,
	sort,
});

interface SearchAction extends Action {
	type: ActionTypes.SEARCH;
	name: string;
}
export const searchAction = (name: string): SearchAction => ({
	type: ActionTypes.SEARCH,
	name,
});

interface AddFilterAction extends Action {
	type: ActionTypes.ADD_FILTER;
	filter: Filter;
}
export const addFilterAction = (filter: Filter): AddFilterAction => ({
	type: ActionTypes.ADD_FILTER,
	filter,
});

interface RemoveFilterAction extends Action {
	type: ActionTypes.REMOVE_FILTER;
	filter: Filter;
}
export const removeFilterAction = (filter: Filter): RemoveFilterAction => ({
	type: ActionTypes.REMOVE_FILTER,
	filter,
});

interface SetActiveAction extends Action {
	type: ActionTypes.SET_ACTIVE;
	course: Course;
	quarter: string;
}
export const setActiveAction = (course: Course, quarter: string): SetActiveAction => ({
	type: ActionTypes.SET_ACTIVE,
	course,
	quarter,
});

interface CloseActiveAction extends Action {
	type: ActionTypes.CLOSE_ACTIVE;
}
export const closeActiveAction = (): CloseActiveAction => ({
	type: ActionTypes.CLOSE_ACTIVE,
});

interface ActiveSuccessAction extends Action {
	type: ActionTypes.ACTIVE_SUCCESS;
	data: CourseEnrollment[];
	course: Course;
	rmp: professorRating;
}
export const activeSuccessAction = (
	data: CourseEnrollment[],
	course: Course,
	rmp: professorRating
): ActiveSuccessAction => ({
	type: ActionTypes.ACTIVE_SUCCESS,
	data,
	course,
	rmp,
});

interface AddBookmarkAction extends Action {
	type: ActionTypes.ADD_BOOKMARK;
	data: Course;
}
export const addBookmarkAction = (data: Course): AddBookmarkAction => ({
	type: ActionTypes.ADD_BOOKMARK,
	data,
});

interface RemoveBookmarkAction extends Action {
	type: ActionTypes.REMOVE_BOOKMARK;
	data: Course;
}
export const removeBookmarkAction = (data: Course): RemoveBookmarkAction => ({
	type: ActionTypes.REMOVE_BOOKMARK,
	data,
});

interface LoadBookmarkAction extends Action {
	type: ActionTypes.LOAD_BOOKMARK;
}
export const loadBookmarkAction = (): LoadBookmarkAction => ({
	type: ActionTypes.LOAD_BOOKMARK,
});

interface LoadBookmarkCompleteAction extends Action {
	type: ActionTypes.LOAD_BOOKMARK_COMPLETE;
	data: Course[];
}
export const loadBookmarkCompleteAction = (data: Course[]): LoadBookmarkCompleteAction => ({
	type: ActionTypes.LOAD_BOOKMARK_COMPLETE,
	data,
});

export type CourseActions =
	| FetchAction
	| FetchSuccessAction
	| SortAction
	| SearchAction
	| AddFilterAction
	| RemoveFilterAction
	| SetActiveAction
	| CloseActiveAction
	| ActiveSuccessAction
	| AddBookmarkAction
	| RemoveBookmarkAction
	| LoadBookmarkAction
	| LoadBookmarkCompleteAction;

//#endregion
export default function courseReducer(
	state: CourseState = initialState,
	action: CourseActions
): CourseState {
	switch (action.type) {
		case ActionTypes.FETCH_API:
			return { ...state, loading: true, quarter: action.quarter };
		case ActionTypes.FETCH_API_SUCCESS:
			let sortedCourses: Course[] = Sort(action.data, state.sort);
			return {
				...state,
				loading: false,
				prevStart: action.prevStart,
				curStart: action.curStart,
				filtered: sortedCourses,
				courses: sortedCourses,
				backup: sortedCourses,
				activeCourse: null,
			};
		case ActionTypes.SORT:
			let newFiltered: Course[] = Sort(state.filtered, action.sort);
			return {
				...state,
				sort: action.sort,
				filtered: newFiltered,
				courses: Search(newFiltered, state.search),
			};
		case ActionTypes.SEARCH:
			return {
				...state,
				search: action.name,
				courses: Search(state.filtered, action.name),
			};
		case ActionTypes.ADD_FILTER:
			if (state.filters[action.filter.type].every(f => f != action.filter.name)) {
				let filteredCourses: Course[] = Filter(
					state.backup,
					SetFilters(state.filters, action.filter, 'add'),
					state.sort
				);
				return {
					...state,
					filtered: filteredCourses,
					courses: Search(filteredCourses, state.search),
				};
			}
			return state;
		case ActionTypes.REMOVE_FILTER:
			if (state.filters[action.filter.type].includes(action.filter.name)) {
				let filteredCourses: Course[] = Filter(
					state.backup,
					SetFilters(state.filters, action.filter, 'remove'),
					state.sort
				);
				return {
					...state,
					filtered: filteredCourses,
					courses: Search(filteredCourses, state.search),
				};
			}
			return state;
		case ActionTypes.SET_ACTIVE:
			return {
				...state,
				activeCourse: { ...action.course, fullName: 'DUMMY' },
				tracking: { fetching: true, data: [] },
			};
		case ActionTypes.CLOSE_ACTIVE:
			return {
				...state,
				activeCourse: null,
				tracking: { fetching: false, data: [] },
			};
		case ActionTypes.ACTIVE_SUCCESS:
			return {
				...state,
				tracking: { fetching: false, data: action.data },
				activeCourse: action.course,
				rmp: action.rmp,
			};
		case ActionTypes.ADD_BOOKMARK:
			return { ...state, bookmarks: [...state.bookmarks, action.data] };
		case ActionTypes.REMOVE_BOOKMARK:
			return {
				...state,
				bookmarks: state.bookmarks.filter(f => f.code != action.data.code),
			};
		case ActionTypes.LOAD_BOOKMARK_COMPLETE:
			return { ...state, bookmarks: action.data };
		default:
			return state;
	}
}
//#region sort and filter functions
const Sort = (courses: Course[], sort: CourseType): Course[] =>
	[...courses].sort((a: Course, b: Course) => InnerSort(a, b, sort));

const InnerSort = (a: Course, b: Course, sort: CourseType): number => {
	const [left, right] = [a[sort], b[sort]];
	if (left && right) {
		if (left > right) return 1;
		if (left < right) return -1;
	}
	return 0;
};

const Search = (courses: Course[], search: string): Course[] =>
	search
		? courses.filter(f =>
				[f.subjectCode, f.name?.toUpperCase(), f.subject + ' ' + f.code].some(crit =>
					crit.includes(search)
				)
		  )
		: courses;

const SetFilters = (
	filters: FilterList<FilterDomain, CourseType>,
	val: Filter,
	action: string
): FilterList<FilterDomain, CourseType> => {
	let temp: FilterList<FilterDomain, CourseType> = { ...filters };
	if (action === 'add') {
		temp[val.type].push(val.name);
	} else if (action === 'remove') {
		temp[val.type].splice(temp[val.type].indexOf(val.name), 1);
	}
	return temp;
};

const Filter = (
	courses: Course[],
	filterListObj: FilterList<FilterDomain, CourseType>,
	sort?: CourseType
): Course[] => {
	// see if a course passes a single filter
	const SingleFilter = (course: Course, filter: Filter): boolean =>
		course[filter.type] instanceof Array
			? (course[filter.type] as Course['ge' | 'combinedSections'])!.includes(filter.name)
			: // | 'sections'
			  // | 'settings'
			  course[filter.type] === filter.name;

	// see if the course satisfies 1 or more filters (OR conditioning)
	const CourseFilterOR = (course: Course, filters: Filter[]): boolean =>
		filters.some(filter => SingleFilter(course, filter));

	let processing = [...courses]; // copy into processing

	Object.entries(filterListObj).forEach(([type, _filters]) => {
		if (!_filters.length) return;
		const filters: Filter[] = _filters.map(f => ({ type: type as FilterDomain, name: f }));

		// for each iteration, update processing
		processing = processing.filter(course => CourseFilterOR(course, filters));
	});
	// those who survive will be returned
	return sort ? Sort(processing, sort) : processing;
};
//#endregion
const fetchCoursesEpic: Epic<CourseActions> = (action$, state$) =>
	action$.ofType(ActionTypes.FETCH_API).pipe(
		map(action => action as FetchAction),
		switchMap(async action => ({
			courses: await API.courses(action.quarter),
			prevStart: await API.fetchDate(
				action.quarter.toString().endsWith('8') ? action.quarter - 6 : action.quarter - 2
			),
			curStart: await API.fetchDate(action.quarter),
		})),
		map(courses => fetchSuccessAction(courses.courses, courses.prevStart, courses.curStart))
	);

const trackCourseEpic: Epic<CourseActions> = (action$, state$) =>
	action$.ofType(ActionTypes.SET_ACTIVE).pipe(
		map(action => action as SetActiveAction),
		switchMap(async ({ course: course$, quarter: quarter$ }) => ({
			course: await API.fetchName(course$.number, quarter$).then(fullName => ({
				...course$,
				fullName,
			})),
			tracking: await API.tracking(course$.number, quarter$),
			rmp: course$.instructor
				? await API.getProfId(course$.instructor.first + course$.instructor.last).then(res =>
						API.rmp(res)
				  )
				: ({} as professorRating),
		})),
		map(data => activeSuccessAction(data.tracking, data.course, data.rmp))
	);
const bookmarkEpic: Epic<CourseActions> = (action$, state$) =>
	action$.ofType(ActionTypes.ADD_BOOKMARK, ActionTypes.REMOVE_BOOKMARK).pipe(
		tap(() => {
			window.localStorage.setItem('BOOKMARKS', JSON.stringify(state$.value.course.bookmarks));
		}),
		ignoreElements() // stop stream. do not return an action
	);
const loadBookmarkEpic: Epic<CourseActions> = (action$, state$) =>
	action$.ofType(ActionTypes.LOAD_BOOKMARK).pipe(
		map(() => window.localStorage.getItem('BOOKMARKS')),
		map(json => {
			if (json) {
				return JSON.parse(json);
			}
			return [];
		}),
		map(courses => loadBookmarkCompleteAction(courses))
	);

export const CourseEpics = combineEpics(
	fetchCoursesEpic,
	trackCourseEpic,
	bookmarkEpic,
	loadBookmarkEpic
);
