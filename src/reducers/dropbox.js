import { combineReducers } from "redux";
import * as types from "../actions/dropbox";

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

function initFile(file) {
  file.newContent = file.content;
  return file;
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
        ...index(action.payload.response.map(initFile))
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
        ...indexMerge(state.byID, initFile(file))
      };
    }
    case `${types.SAVE_FILE}_SUCCESS`: {
      const [id, content] = action.payload.args;
      let file = state.byID[id];
      file = {
        ...file,
        content: content,
        newContent: content
      };
      return {
        ...state,
        ...indexMerge(state.byID, file)
      };
    }
    case types.UPDATE_FILE: {
      const {id, content} = action.payload;
      let file = state.byID[id];
      file = {
        ...file,
        newContent: content
      };
      return {
        ...state,
        ...indexMerge(state.byID, file)
      };
    }

    default:
      return state;
  }
}

function loggedIn(state = null, action) {
  switch (action.type) {
    case `${types.CHECK_DROPBOX_ACCESS}_SUCCESS`:
      return action.payload.response;
    default:
      return state;
  }
}

export const dropbox = combineReducers({
  files,
  loggedIn
});
