import { applyMiddleware, createStore, combineReducers, Action } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';

import category, {
  CategoryActions,
  CategoryState,
  CategoryEpics
} from './modules/category';
import categoryPage, {
  CategoryPageActions,
  CategoryPageState,
  CategoryPageEpics
} from './modules/category.page';
import event, { EventState, EventEpics, EventActions } from './modules/event';
import homePage, {
  HomePageEpics,
  HomePageState,
  HomePageActions
} from './modules/home.page';
import post, { PostState, PostEpics, PostActions } from './modules/post';

const rootEpic = combineEpics(
  CategoryEpics,
  CategoryPageEpics,
  EventEpics,
  HomePageEpics,
  PostEpics
);
const epicMiddleware = createEpicMiddleware();

export type AppState = {
  category: CategoryState;
  categoryPage: CategoryPageState;
  event: EventState;
  homePage: HomePageState;
  post: PostState;
};

export const configureStore = () =>
  createStore(
    combineReducers<AppState>({
      category,
      categoryPage,
      event,
      homePage,
      post
    }),
    applyMiddleware(epicMiddleware, logger)
  );
export default configureStore();

epicMiddleware.run(rootEpic);

export type ReduxAction =
  | CategoryActions
  | CategoryPageActions
  | EventActions
  | HomePageActions
  | PostActions
  | Action;
