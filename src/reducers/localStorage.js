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
    case `${types.LIST_FILES}_REQUEST`:
      return {
        ...state,
        ...index([]),
        loading: true,
        error: null
      };
    case `${types.LIST_FILES}_SUCCESS`:
      return {
        ...state,
        loading: false,
        error: null,
        ...index(action.payload.response)
      };
    case `${types.LIST_FILES}_FAILURE`:
      return {
        ...state,
        loading: false,
        ...index([]),
        error: action.payload.error
      };
    case `${types.LOAD_FILE}_SUCCESS`: {
      const file = action.payload.response;
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
