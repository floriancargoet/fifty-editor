import * as dropboxTypes from "../actions/dropbox";
import * as lsTypes from "../actions/localStorage";

const defaultState = {
  saving: false,
  message: "" // unused for now
};

export function ui(state = defaultState, action) {
  switch (action.type) {
    case `${dropboxTypes.SAVE_FILE}_REQUEST`:
    case `${lsTypes.SAVE_FILE}_REQUEST`:
      return {
        ...state,
        saving: true,
        message: ""
      };
    case `${dropboxTypes.SAVE_FILE}_SUCCESS`:
    case `${lsTypes.SAVE_FILE}_SUCCESS`:
      return {
        ...state,
        saving: false,
        message: ""
      };
    case `${dropboxTypes.SAVE_FILE}_FAILURE`:
    case `${lsTypes.SAVE_FILE}_FAILURE`:
      return {
        ...state,
        saving: false,
        message: "Error while saving"
      };
    default:
      return state;
  }
}
