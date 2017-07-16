import { combineReducers } from "redux";
import * as types from "../actions/localStorage";

function index(list) {
  const byID = {};
  const IDs = list.map(item => {
    byID[item.id] = item;
    return item.id;
  });
  return { byID, IDs };
}

function indexMerge(oldByID, newItem) {
  const byID = {
    ...oldByID,
    [newItem.id]: newItem
  };
  const IDs = Object.keys(byID);
  return { byID, IDs };
}

const defaultState = index([]);

function files(state = defaultState, action) {
  switch (action.type) {
    case `${types.LIST_FILES_RESULT}`:
      return {
        ...state,
        ...index(action.payload.files)
      };
    case `${types.LOAD_FILE_RESULT}`: {
      let file = state.byID[action.payload.id];
      file = { ...file, content: action.payload.content };
      return {
        ...state,
        ...indexMerge(state.byID, file)
      };
    }
    default:
      return state;
  }
}

export const localStorage = combineReducers({
  files
});
