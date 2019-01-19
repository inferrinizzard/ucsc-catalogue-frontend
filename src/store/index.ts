import { createStore, combineReducers, Action, applyMiddleware } from 'redux';

import UIReducer, { UIState, UIActions } from './UI';
import CourseReducer, {
  CourseState,
  CourseActions,
  CourseEpics,
} from './course';
import { combineEpics, createEpicMiddleware, EpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';

const rootReducer = combineReducers({
  UI: UIReducer,
  course: CourseReducer,
});

const rootEpic = combineEpics(CourseEpics) as any;
const epicMiddleware = createEpicMiddleware();

export type ReduxAction = UIActions | CourseActions | Action;

export const configureStore = () =>
  createStore(rootReducer, applyMiddleware(epicMiddleware, logger));
export default configureStore();

epicMiddleware.run(rootEpic);
