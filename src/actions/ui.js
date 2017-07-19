import { saveFile as saveDropboxFile, updateFile as updateDropboxFile } from "./dropbox";
import { saveFile as saveLocalFile, updateFile as updateLocalFile } from "./localStorage";

export function saveFile(id) {
  return (dispatch, getState) => {
    if (getState().location.payload.tab === "dropbox") {
      const content = getState().dropbox.files.byID[id].newContent;
      dispatch(saveDropboxFile(id, content));
    }
    else {
      const content = getState().localStorage.files.byID[id].newContent;
      dispatch(saveLocalFile(id, content));
    }
  };
}

export function updateFile(id, content) {
  return (dispatch, getState) => {
    if (getState().location.payload.tab === "dropbox") {
      dispatch(updateDropboxFile(id, content));
    }
    else {
      dispatch(updateLocalFile(id, content));
    }
  };
}
