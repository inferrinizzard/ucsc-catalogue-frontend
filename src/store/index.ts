import { createStore, combineReducers, Action, applyMiddleware } from 'redux';

import UIReducer, { UIState, UIActions } from './UI';
import CourseReducer, {
  CourseState,
  CourseActions,
  CourseEpics,
} from './course';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';

const rootReducer = combineReducers({
  UIReducer,
  CourseReducer,
});

const rootEpic = combineEpics(CourseEpics);
const epicMiddleware = createEpicMiddleware();

type AppState = {
  UI: UIState;
  courses: CourseState;
};

export type ReduxAction = UIActions | CourseActions | Action;

export const configureStore = () =>
  createStore(rootReducer, applyMiddleware(epicMiddleware, logger));
export default configureStore();

epicMiddleware.run(rootEpic);
