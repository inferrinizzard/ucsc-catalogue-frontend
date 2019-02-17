import { Action } from 'redux';
import { Course } from '../models/course.model';
import API from '../services/api';
import { Epic, combineEpics } from 'redux-observable';
import { filter, map, switchMap, delay, mergeMap } from 'rxjs/operators';

export interface CourseState {
  loading: boolean;
  filters: FilterList<FilterDomain, CourseType>;
  sort: CourseType;
  courses: Course[];
  backup: Course[];
  activeCourse: Course | null;
  quarter: number;
}

export type CourseType = keyof Course;
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
  backup: [],
  activeCourse: null,
  quarter: 2190,
};
//#region actions
enum ActionTypes {
  ADD_FILTER = 'add-filter',
  REMOVE_FILTER = 'remove-filter',
  SORT = 'sort',
  FETCH_API = 'fetch',
  FETCH_API_SUCCESS = 'fetch-success',
  UPDATE = 'update',
  SET_ACTIVE = 'set-active',
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
}
export const fetchSuccessAction = (data: Course[]): FetchSuccessAction => ({
  type: ActionTypes.FETCH_API_SUCCESS,
  data,
});

interface SortAction extends Action {
  type: ActionTypes.SORT;
  sort: CourseType;
}
export const sortAction = (sort: CourseType): SortAction => ({
  type: ActionTypes.SORT,
  sort,
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
}
export const setActiveAction = (course: Course | null): SetActiveAction => ({
  type: ActionTypes.SET_ACTIVE,
  course,
});

export type CourseActions =
  | FetchAction
  | FetchSuccessAction
  | SortAction
  | AddFilterAction
  | RemoveFilterAction
  | SetActiveAction;

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
        courses: Sort(Filter(action.data, state.filters), state.sort),
        backup: action.data,
      };
    case ActionTypes.SORT:
      return {
        ...state,
        sort: action.sort,
        courses: Sort(state.courses, action.sort),
      };
    case ActionTypes.ADD_FILTER:
      return state.filters[action.filter.type].every(
        f => f != action.filter.name
      )
        ? {
            ...state,
            courses: Sort(
              Filter(
                state.backup,
                setFilters(state.filters, action.filter, 'add')
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
              Filter(
                state.backup,
                setFilters(state.filters, action.filter, 'remove')
              ),
              state.sort
            ),
          }
        : state;
    case ActionTypes.SET_ACTIVE:
      return { ...state, activeCourse: action.course };
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

function setFilters(
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
    switchMap(action => API.courses(action.quarter)),
    map(courses => fetchSuccessAction(courses))
  );

export const CourseEpics = combineEpics(fetchCoursesEpic);
