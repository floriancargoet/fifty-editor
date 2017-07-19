export const LIST_FILES = "DROPBOX_API/LIST_FILES";
export function listFiles() {
  return {
    type: LIST_FILES,
    payload: {
      method: "listFiles",
      args: []
    }
  };
}

export const LOAD_FILE = "DROPBOX_API/LOAD_FILE";
export function loadFile(path) {
  return {
    type: LOAD_FILE,
    payload: {
      method: "loadFile",
      args: [path]
    }
  };
}

export const SAVE_FILE = "DROPBOX_API/SAVE_FILE";
export function saveFile(id, content) {
  return {
    type: SAVE_FILE,
    payload: {
      method: "saveFile",
      args: [id, content]
    }
  };
}

export const CHECK_DROPBOX_ACCESS = "DROPBOX_API/CHECK_DROPBOX_ACCESS";
export function checkDropboxAccess() {
  return {
    type: CHECK_DROPBOX_ACCESS,
    payload: {
      method: "checkAccess",
      args: []
    }
  };
}

export const UPDATE_FILE = "DROPBOX/UPDATE_FILE";
export function updateFile(id, content) {
  return {
    type: UPDATE_FILE,
    payload: {id, content}
  };
}

export function initDropbox() {
  return async (dispatch, getState) => {
    await dispatch(checkDropboxAccess());
    if (getState().dropbox.loggedIn) {
      return dispatch(listFiles());
    }
  };
}
