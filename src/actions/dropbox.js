export const LIST_FILES = "API/LIST_FILES";
export function listFiles() {
  return {
    type: LIST_FILES,
    payload: {
      method: "listFiles",
      args: []
    }
  };
}

export const LOAD_FILE = "API/LOAD_FILE";
export function loadFile(path) {
  return {
    type: LOAD_FILE,
    payload: {
      method: "loadFile",
      args: [path]
    }
  };
}

export const SAVE_FILE = "API/SAVE_FILE";
export function saveFile(id, content) {
  return {
    type: SAVE_FILE,
    payload: {
      method: "saveFile",
      args: [id, content]
    }
  };
}

export const CHECK_DROPBOX_ACCESS = "API/CHECK_DROPBOX_ACCESS";
export function checkDropboxAccess() {
  return {
    type: CHECK_DROPBOX_ACCESS,
    payload: {
      method: "checkAccess",
      args: []
    }
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
