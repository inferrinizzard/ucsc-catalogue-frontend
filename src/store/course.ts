import { createStore, Action } from 'redux';
import * as APIModel from '../models/course.model';
import * as CourseAPI from '../services/api';

export interface CourseState {
  loading: boolean;
  drawerOpen: boolean;
  linerOpen: boolean;
  drawerWidth: number;
  linerWidth: number;
  filters: Filter[];
  sort: string;
  courses: APIModel.Course[];
}
export type Filter = { type: string; filter: string };

const initialState: CourseState = {
  loading: true,
  drawerOpen: false,
  linerOpen: false,
  drawerWidth: 300,
  linerWidth: 35,
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
  sort: string;
}
export const SortAction = (sort: string): SortAction => ({
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

// interface UpdateAction extends Action {
//   type: ActionTypes.UPDATE;
//   update: any;
// }
// export const UpdateAction = (update): UpdateAction => ({
//   type: ActionTypes.UPDATE,
//   update,
// });

export type CourseActions =
  | FetchAction
  | FetchSuccessAction
  | SortAction
  | FilterAction;
export default function reducer(
  state: CourseState = initialState,
  action: CourseActions
): CourseState {
  switch (action.type) {
    case ActionTypes.SORT:
      return { ...state, courses: Sort(state, state['sort']) };
    case ActionTypes.FILTER:
      return { ...state, courses: Filter(state, state['filters']) };
    //alters course state, how to restore after filter removed?
    default:
      return state;
  }
}

function Sort(state: CourseState, sort: string) {
  return ([] as APIModel.Course[])
    .concat(state.courses)
    .sort((a: APIModel.Course, b: APIModel.Course) =>
      a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0
    );
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
