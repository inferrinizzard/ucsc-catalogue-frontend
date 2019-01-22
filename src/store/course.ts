import { Action } from 'redux';
import * as APIModel from '../models/course.model';
import API from '../services/api';
import { Epic, combineEpics } from 'redux-observable';
import { filter, map, switchMap, delay } from 'rxjs/operators';
import { any } from 'prop-types';

export interface CourseState {
  loading: boolean;
  filters: APIModel.Filter[];
  sort: keyof APIModel.Course;
  courses: APIModel.Course[];
  activeCourse: APIModel.Course | null;
}
export type Filter = { type: keyof APIModel.Course; filter: string };

const initialState: CourseState = {
  loading: true,
  filters: [],
  sort: 'code',
  courses: [],
  activeCourse: null,
};

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
}
export const fetchAction = (): FetchAction => ({
  type: ActionTypes.FETCH_API,
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
export const sortAction = (sort: keyof APIModel.Course): SortAction => ({
  type: ActionTypes.SORT,
  sort,
});

interface AddFilterAction extends Action {
  type: ActionTypes.ADD_FILTER;
  filter: APIModel.Filter;
}
export const addFilterAction = (filter: APIModel.Filter): AddFilterAction => ({
  type: ActionTypes.ADD_FILTER,
  filter,
});

interface RemoveFilterAction extends Action {
  type: ActionTypes.REMOVE_FILTER;
  filter: APIModel.Filter;
}
export const removeFilterAction = (
  filter: APIModel.Filter
): RemoveFilterAction => ({
  type: ActionTypes.REMOVE_FILTER,
  filter,
});

interface SetActiveAction extends Action {
  type: ActionTypes.SET_ACTIVE;
  course: APIModel.Course | null;
}
export const setActiveAction = (
  course: APIModel.Course | null
): SetActiveAction => ({
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

export default function courseReducer(
  state: CourseState = initialState,
  action: CourseActions
): CourseState {
  switch (action.type) {
    case ActionTypes.FETCH_API:
      return { ...state, loading: true };
    case ActionTypes.FETCH_API_SUCCESS:
      return { ...state, loading: false, courses: action.data };
    case ActionTypes.SORT:
      return {
        ...state,
        sort: action.sort,
        courses: Sort(state, action.sort),
      };
    case ActionTypes.ADD_FILTER:
      return !checkFilter(state.filters, action.filter)
        ? {
            ...state,
            filters: [...state.filters, action.filter],
            courses: Filter(state.courses, [...state.filters, action.filter]),
          }
        : state;
    case ActionTypes.REMOVE_FILTER:
      return checkFilter(state.filters, action.filter)
        ? {
            ...state,
            filters: [...state.filters].splice(
              state.filters.indexOf(action.filter),
              1
            ),
            courses: Filter(
              API.courses('2190').then(value => {
                return value;
              }),
              [...state.filters, action.filter]
            ),
          }
        : state;
    case ActionTypes.SET_ACTIVE:
      return { ...state, activeCourse: action.course };
    default:
      return state;
  }
}

function checkFilter(list: Filter[], filter: Filter): boolean {
  let hasFilter = false;
  list.forEach(f => (hasFilter = f === filter ? true : hasFilter));
  return hasFilter;
}

function Sort(
  state: CourseState,
  sort: keyof APIModel.Course
): APIModel.Course[] {
  return ([] as APIModel.Course[])
    .concat(state.courses)
    .sort((a: APIModel.Course, b: APIModel.Course) => InnerSort(a, b, sort));
}

function InnerSort(
  a: APIModel.Course,
  b: APIModel.Course,
  sort: keyof APIModel.Course
): number {
  const left = a[sort];
  const right = b[sort];
  if (left && right) {
    if (left > right) return 1;
    if (left < right) return -1;
  }
  return 0;
}

//TODO: filter by union for same type, intersction for different
function Filter(
  courses: APIModel.Course[],
  filters: APIModel.Filter[]
): APIModel.Course[] {
  let courseTemp: APIModel.Course[] = ([] as APIModel.Course[]).concat(courses);
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
