export const LIST_FILES = "LS_API/LIST_FILES";
export function listFiles() {
  return {
    type: LIST_FILES,
    payload: {
      method: "listFiles",
      args: []
    }
  };
}

export const LOAD_FILE = "LS_API/LOAD_FILE";
export function loadFile(path) {
  return {
    type: LOAD_FILE,
    payload: {
      method: "loadFile",
      args: [path]
    }
  };
}

export const SAVE_FILE = "LS_API/SAVE_FILE";
export function saveFile(id, content) {
  return {
    type: SAVE_FILE,
    payload: {
      method: "saveFile",
      args: [id, content]
    }
  };
}

export const UPDATE_FILE = "LS/UPDATE_FILE";
export function updateFile(id, content) {
  return {
    type: UPDATE_FILE,
    payload: {id, content}
  };
}
