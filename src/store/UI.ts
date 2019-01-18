import { Action } from 'redux';

export interface UIState {
  drawerOpen: boolean;
  linerOpen: boolean;
  drawerWidth: number;
  linerWidth: number;
}

const initialState: UIState = {
  drawerOpen: false,
  linerOpen: false,
  drawerWidth: 300,
  linerWidth: 35,
};

enum ActionTypes {
  OPEN_DRAWER = 'open-drawer',
  OPEN_LINER = 'open-liner',
  UPDATE_DRAWER = 'update-drawer',
  UPDATE_LINER = 'update-liner',
}

interface OpenDrawerAction extends Action {
  type: ActionTypes.OPEN_DRAWER;
  open: boolean;
}

export const openDrawerAction = (open: boolean): OpenDrawerAction => ({
  type: ActionTypes.OPEN_DRAWER,
  open,
});

interface OpenLinerAction extends Action {
  type: ActionTypes.OPEN_LINER;
  open: boolean;
}

export const openLinerAction = (open: boolean): OpenLinerAction => ({
  type: ActionTypes.OPEN_LINER,
  open,
});

interface UpdateDrawerAction extends Action {
  type: ActionTypes.UPDATE_DRAWER;
  width: number;
}

export const updateDrawerAction = (width: number): UpdateDrawerAction => ({
  type: ActionTypes.UPDATE_DRAWER,
  width,
});

interface UpdateLinerAction extends Action {
  type: ActionTypes.UPDATE_LINER;
  width: number;
}

export const updateLinerAction = (width: number): UpdateLinerAction => ({
  type: ActionTypes.UPDATE_LINER,
  width,
});

export type UIActions =
  | OpenDrawerAction
  | OpenLinerAction
  | UpdateDrawerAction
  | UpdateLinerAction;
export default function UIReducer(
  state: UIState = initialState,
  action: UIActions
): UIState {
  switch (action.type) {
    case ActionTypes.OPEN_DRAWER:
      return { ...state, drawerOpen: true };
    case ActionTypes.OPEN_LINER:
      return { ...state, linerOpen: true };
    case ActionTypes.UPDATE_DRAWER:
      return { ...state, drawerWidth: action.width };
    case ActionTypes.UPDATE_LINER:
      return { ...state, linerWidth: action.width };
    default:
      return state;
  }
}
