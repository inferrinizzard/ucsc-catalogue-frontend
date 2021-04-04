import { createStore, combineReducers, Action, applyMiddleware } from 'redux';
import CourseReducer, { CourseState, CourseActions, CourseEpics } from './course';
import { combineEpics, createEpicMiddleware, EpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';

const rootReducer = combineReducers({
	course: CourseReducer,
});

export type ReduxState = {
	course: CourseState;
};

const rootEpic = combineEpics(CourseEpics);
const epicMiddleware = createEpicMiddleware();

export type ReduxAction = CourseActions | Action;

export const configureStore = () =>
	createStore(rootReducer, applyMiddleware(epicMiddleware, logger));
export default configureStore();

epicMiddleware.run(rootEpic);
