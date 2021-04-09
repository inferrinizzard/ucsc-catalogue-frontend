import { createStore, combineReducers, Action, applyMiddleware } from 'redux';
import CourseReducer, { CourseState, CourseActions, CourseEpics } from './course';
import { combineEpics, createEpicMiddleware, EpicMiddleware } from 'redux-observable';

import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware, RouterState } from 'connected-react-router';
import logger from 'redux-logger';

export const history = createBrowserHistory();

const rootReducer = (history: ReturnType<typeof createBrowserHistory>) =>
	combineReducers({
		course: CourseReducer,
		router: connectRouter(history),
	});

export type ReduxState = {
	course: CourseState;
	router: RouterState;
};

const rootEpic = combineEpics(CourseEpics);
const epicMiddleware = createEpicMiddleware();

export type ReduxAction = CourseActions | Action;

export const configureStore = () =>
	createStore(
		rootReducer(history),
		applyMiddleware(epicMiddleware, logger, routerMiddleware(history))
	);
export default configureStore();

epicMiddleware.run(rootEpic);
