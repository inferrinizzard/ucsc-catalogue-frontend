import { Action } from 'redux';
import {
  Course,
  CourseEnrollment,
  professorRating,
} from '../models/course.model';
import API from '../services/api';
import { Epic, combineEpics } from 'redux-observable';
import { map } from 'rxjs/internal/operators/map';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { filter, tap, ignoreElements } from 'rxjs/operators';

export interface CourseState {
  loading: boolean;
  fetchTracking: boolean;
  filters: FilterList<FilterDomain, CourseType>;
  sort: CourseType;
  courses: Course[];
  backup: Course[];
  activeCourse: Course | null;
  quarter: number;
  tracking: CourseEnrollment[];
  prevStart: Date;
  search: string;
  rmp: professorRating;
  bookmarks: Course[];
}
//#region define types
export type CourseType = keyof Course;
export type Course = Course;
export type Filter = { type: CourseType; name: string };
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
> = DefineFilterKey<CourseType> &
  { readonly [value in FilterDomain]: string[] };
//#endregion
const initialState: CourseState = {
  loading: true,
  fetchTracking: false,
  filters: {
    subject: [],
    level: [],
    ge: [],
    type: [],
  },
  sort: 'subjectCode',
  courses: [],
  backup: [],
  activeCourse: null,
  quarter: 2198,
  tracking: [],
  prevStart: new Date(0),
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
}
export const fetchSuccessAction = (
  data: Course[],
  prevStart: Date
): FetchSuccessAction => ({
  type: ActionTypes.FETCH_API_SUCCESS,
  data,
  prevStart,
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
  course: Course | null;
  quarter: string;
}
export const setActiveAction = (
  course: Course | null,
  quarter: string
): SetActiveAction => ({
  type: ActionTypes.SET_ACTIVE,
  course,
  quarter,
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
export const loadBookmarkCompleteAction = (
  data: Course[]
): LoadBookmarkCompleteAction => ({
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
      return {
        ...state,
        loading: false,
        prevStart: action.prevStart,
        courses: Sort(
          Search(Filter(action.data, state.filters), state.search),
          state.sort
        ),
        backup: action.data,
        activeCourse: null,
      };
    case ActionTypes.SORT:
      return {
        ...state,
        sort: action.sort,
        courses: Sort(state.courses, action.sort),
      };
    case ActionTypes.SEARCH:
      return {
        ...state,
        search: action.name,
        courses: Sort(
          Filter(Search(state.backup, action.name), state.filters),
          state.sort
        ),
      };
    case ActionTypes.ADD_FILTER:
      return state.filters[action.filter.type].every(
        f => f != action.filter.name
      )
        ? {
            ...state,
            courses: Sort(
              Search(
                Filter(
                  state.backup,
                  SetFilters(state.filters, action.filter, 'add')
                ),
                state.search
              ),
              state.sort
            ),
          }
        : state;
    case ActionTypes.REMOVE_FILTER:
      return state.filters[action.filter.type].includes(action.filter.name)
        ? {
            ...state,
            courses: Sort(
              Search(
                Filter(
                  state.backup,
                  SetFilters(state.filters, action.filter, 'remove')
                ),
                state.search
              ),
              state.sort
            ),
          }
        : state;
    case ActionTypes.SET_ACTIVE:
      return { ...state, fetchTracking: true };
    case ActionTypes.ACTIVE_SUCCESS:
      return {
        ...state,
        fetchTracking: false,
        tracking: action.data,
        activeCourse: action.course,
        rmp: action.rmp,
      };
    case ActionTypes.ADD_BOOKMARK:
      return { ...state, bookmarks: [...state.bookmarks, action.data] };
    case ActionTypes.REMOVE_BOOKMARK:
      return {
        ...state,
        bookmarks: state.bookmarks.reduce(
          (accm, cur) => {
            if (cur.code != action.data.code) {
              return [...accm, cur];
            }
            return accm;
          },
          [] as Course[]
        ),
      };
    case ActionTypes.LOAD_BOOKMARK_COMPLETE:
      return { ...state, bookmarks: action.data };
    default:
      return state;
  }
}
//#region sort and filter functions
function Sort(courses: Course[], sort: CourseType): Course[] {
  return ([] as Course[])
    .concat(courses)
    .sort((a: Course, b: Course) => InnerSort(a, b, sort));
}

function InnerSort(a: Course, b: Course, sort: CourseType): number {
  const left = a[sort];
  const right = b[sort];
  if (left && right) {
    if (left > right) return 1;
    if (left < right) return -1;
  }
  return 0;
}

function Search(courses: Course[], search: string): Course[] {
  return search.length > 0
    ? courses.filter(
        f =>
          f.name &&
          (f.subjectCode.includes(search) ||
            f.name.toUpperCase().includes(search) ||
            (f.subject + ' ' + f.code).includes(search))
      )
    : courses;
}

function SetFilters(
  filters: FilterList<FilterDomain, CourseType>,
  val: Filter,
  action: string
): FilterList<FilterDomain, CourseType> {
  let temp: FilterList<FilterDomain, CourseType> = { ...filters };
  if (action === 'add') {
    temp[val.type].push(val.name);
  } else if (action === 'remove') {
    temp[val.type].splice(temp[val.type].indexOf(val.name), 1);
  }
  return temp;
}

function Filter(
  courses: Course[],
  filterListObj: FilterList<FilterDomain, CourseType>
): Course[] {
  // see if a course passes a single filter
  const SingleFilter = (course: Course, filter: Filter): boolean => {
    if (Array.isArray(course[filter.type])) {
      return (course[filter.type] as Array<any>).includes(filter.name);
    }
    return course[filter.type] === filter.name;
  };

  // see if the course satisfies 1 or more filters (OR conditioning)
  const CourseFilterOR = (course: Course, filters: Filter[]): boolean => {
    return filters.some(filter => SingleFilter(course, filter));
  };

  let processing = [...courses]; // copy into processing

  Object.keys(filterListObj).forEach(_key => {
    const key = _key as CourseType;
    const filters: Filter[] = filterListObj[key].map(x => ({
      type: key,
      name: x,
    }));
    if (filters.length == 0) return;

    // for each iteration, update processing
    processing = processing.filter(course => CourseFilterOR(course, filters));
  });
  // those who survive will be returned
  return processing;
}
//#endregion
const fetchCoursesEpic: Epic<CourseActions> = (action$, state$) =>
  action$.ofType(ActionTypes.FETCH_API).pipe(
    map(action => action as FetchAction),
    switchMap(async action => {
      return {
        courses: await API.courses(action.quarter),
        prevStart: await API.fetchDate(
          action.quarter.toString().endsWith('8')
            ? action.quarter - 6
            : action.quarter - 2
        ),
      };
    }),
    map(courses => fetchSuccessAction(courses['courses'], courses['prevStart']))
  );

const trackCourseEpic: Epic<CourseActions> = (action$, state$) =>
  action$.ofType(ActionTypes.SET_ACTIVE).pipe(
    map(action => action as SetActiveAction),
    switchMap(async action => {
      const course: Course = { ...action.course } as Course;
      course['fullName'] = action.course
        ? await API.fetchName(action.course!.number, action.quarter)
        : '';
      const tracking: CourseEnrollment[] = action.course
        ? await API.tracking(action.course!.number, action.quarter)
        : ([] as CourseEnrollment[]);
      const rmp: professorRating = action.course
        ? await API.rmp(
            await API.getProfId(
              action.course.instructor
                ? action.course.instructor['first'] +
                    action.course.instructor['last']
                : ''
            )
          )
        : ({} as professorRating);
      return { tracking: tracking, course: course, rmp: rmp };
    }),
    map(data =>
      activeSuccessAction(data['tracking'], data['course'], data['rmp'])
    )
  );
const bookmarkEpic: Epic<CourseActions> = (action$, state$) =>
  action$.ofType(ActionTypes.ADD_BOOKMARK, ActionTypes.REMOVE_BOOKMARK).pipe(
    tap(() => {
      window.localStorage.setItem(
        'BOOKMARKS',
        JSON.stringify(state$.value.course.bookmarks)
      );
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
