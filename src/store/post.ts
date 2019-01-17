import { Action } from 'redux';
import { Article } from '../models/article.model';
import { Epic, combineEpics } from 'redux-observable';
import { filter, map, switchMap, delay } from 'rxjs/operators';
import ContentService from '../services/content.service';

/** State */
export interface PostState {
  loading: boolean;
  selected: string | null;
  data: {
    [postId: string]: Article;
  };
}

const initialState: PostState = {
  loading: false,
  selected: null,
  data: {}
};

/** Action Type */

enum ActionTypes {
  FETCH_POST = '@@POST/FETCH',
  FETCH_POST_SUCCESS = '@@POST/FETCH_SUCCESS'
}

/** Reducer */
export type PostActions = FetchPostAction | FetchPostSuccessAction;
export default function reducer(
  state: PostState = initialState,
  action: PostActions
): PostState {
  switch (action.type) {
    case ActionTypes.FETCH_POST:
      return {
        ...state,
        ...{
          loading: true,
          selected: action.eventId
        }
      }
    case ActionTypes.FETCH_POST_SUCCESS:
      return {
        ...state,
        ...{
          loading: false,
          data: { ...state.data, [action.event.id]: action.event }
        }
      };
    default:
      return state;
  }
}

/** Action Creator */
interface FetchPostAction extends Action {
  type: ActionTypes.FETCH_POST;
  eventId: string;
}
export const fetchPostAction = (eventId: string): FetchPostAction => ({
  type: ActionTypes.FETCH_POST,
  eventId
});

interface FetchPostSuccessAction extends Action {
  type: ActionTypes.FETCH_POST_SUCCESS;
  event: Article;
}
export const fetchPostSuccessAction = (
  event: Article
): FetchPostSuccessAction => ({
  type: ActionTypes.FETCH_POST_SUCCESS,
  event
});

/** EPICS */
const fetchPostEpic: Epic<PostActions> = (action$, state$) =>
  action$.pipe(
    filter(action => action.type === ActionTypes.FETCH_POST),
    map(action => action as FetchPostAction),
    map(action => action.eventId),
    switchMap(eventId => ContentService.thePost(eventId)),
    // delay(5000),
    map(event => fetchPostSuccessAction(event))
  );
export const PostEpics = combineEpics(fetchPostEpic);
