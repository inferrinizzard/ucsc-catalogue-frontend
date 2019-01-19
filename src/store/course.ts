import { Action } from 'redux';
import * as APIModel from '../models/course.model';
import API from '../services/api';
import { Epic, combineEpics } from 'redux-observable';
import { filter, map, switchMap, delay } from 'rxjs/operators';

export interface CourseState {
  loading: boolean;
  filters: Filter[];
  sort: keyof APIModel.Course;
  courses: APIModel.Course[];
}
export type Filter = { type: keyof APIModel.Course; filter: string };

const initialState: CourseState = {
  loading: true,
  filters: [],
  sort: 'code',
  courses: [],
};

enum ActionTypes {
  FILTER = 'filter',
  SORT = 'sort',
  FETCH_API = 'fetch',
  FETCH_API_SUCCESS = 'fetch-success',
  UPDATE = 'update',
}

interface FetchAction extends Action {
  type: ActionTypes.FETCH_API;
  eventId: string;
}
export const fetchAction = (eventId: string): FetchAction => ({
  type: ActionTypes.FETCH_API,
  eventId,
});

interface FetchSuccessAction extends Action {
  type: ActionTypes.FETCH_API_SUCCESS;
  data: APIModel.Course[];
}
export const fetchSuccessAction = (
  data: APIModel.Course[]
): FetchSuccessAction => ({
  type: ActionTypes.FETCH_API_SUCCESS,
  data,
});

interface SortAction extends Action {
  type: ActionTypes.SORT;
  sort: keyof APIModel.Course;
}
export const SortAction = (sort: keyof APIModel.Course): SortAction => ({
  type: ActionTypes.SORT,
  sort,
});

interface FilterAction extends Action {
  type: ActionTypes.FILTER;
  filter: Filter;
}
export const FilterAction = (filter: Filter): FilterAction => ({
  type: ActionTypes.FILTER,
  filter,
});

export type CourseActions =
  | FetchAction
  | FetchSuccessAction
  | SortAction
  | FilterAction;

export default function courseReducer(
  state: CourseState = initialState,
  action: CourseActions
): CourseState {
  switch (action.type) {
    case ActionTypes.FETCH_API:
      return { ...state, loading: true };
    case ActionTypes.FETCH_API_SUCCESS:
      return { ...state, loading: false };
    case ActionTypes.SORT:
      return {
        ...state,
        sort: action.sort,
        courses: Sort(state, action.sort),
      };
    case ActionTypes.FILTER:
      let hasFilter: boolean = false;
      state.filters.forEach(f => (hasFilter = f === action.filter ? true : hasFilter));
      return {
        ...state,
        filters: hasFilter ? [...state.filters].splice(state.filters.indexOf(action.filter),1) : [...state.filters, action.filter],
        courses: Filter(state, [...state['filters'], action.filter]),
      };
    default:
      return state;
  }
}

function Sort(state: CourseState, sort: keyof APIModel.Course) {
  return ([] as APIModel.Course[])
    .concat(state.courses)
    .sort((a: APIModel.Course, b: APIModel.Course) => InnerSort(a, b, sort));
}

function InnerSort(
  a: APIModel.Course,
  b: APIModel.Course,
  sort: keyof APIModel.Course
) {
  const left = a[sort];
  const right = b[sort];
  if (left && right) {
    if (left > right) return 1;
    if (left < right) return -1;
  }
  return 0;
}

function Filter(state: CourseState, filters: Filter[]) {
  let courseTemp: APIModel.Course[] = ([] as APIModel.Course[]).concat(
    state.courses
  );
  filters.forEach(f =>
    courseTemp.filter(course => course[f.type] === f.filter)
  );
  return courseTemp;
}

const fetchCoursesEpic: Epic<CourseActions> = (action$, state$) =>
  action$.pipe(
    filter(action => action.type === ActionTypes.FETCH_API),
    map(action => action as FetchAction),
    // map(action => action.eventId),
    switchMap(() => API.courses('2190')),
    map(courses => fetchSuccessAction(courses))
  );

export const CourseEpics = combineEpics(fetchCoursesEpic);
