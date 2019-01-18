import { combineReducers, Action } from 'redux';

import UIReducer, { UIState, UIActions } from './UI';
import CourseReducer, { CourseState, CourseActions } from './course';

export default combineReducers({
  UIReducer,
  CourseReducer,
});

export type AppState = {
  UI: UIState;
  course: CourseState;
};

export type ReduxAction = UIActions | CourseActions | Action;
