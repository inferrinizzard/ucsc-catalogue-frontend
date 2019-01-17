import { createStore, Action } from 'redux';
import * as APIModel from '../models/course.model';
import * as CourseAPI from '../services/api';

export interface CourseState {
  drawerOpen: boolean;
  linerOpen: boolean;
  drawerWidth: number;
  linerWidth: number;
  filter: string | null;
  sort: string;
  courses: APIModel.Course[];
}

const initialState: CourseState = {
  drawerOpen: false,
  linerOpen: false,
  drawerWidth: 300,
  linerWidth: 35,
  filter: null,
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
  sort: sort,
});

interface FilterAction extends Action {
  type: ActionTypes.FILTER;
  filter: string;
}
export const FilterAction = (filter: string): FilterAction => ({
  type: ActionTypes.FILTER,
  filter: filter,
});

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

function Filter(state: CourseState, filter: string){
	
}
