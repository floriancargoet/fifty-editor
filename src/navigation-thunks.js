import { initDropbox } from "./actions/dropbox";
import { loadFile as loadDropboxFile } from "./actions/dropbox";
import {
  loadFile as loadLocalFile,
  listFiles as listLocalFiles
} from "./actions/localStorage";

export const loadTabData = async (dispatch, getState) => {
  const state = getState();
  const { tab } = state.location.payload;
  if (tab === "dropbox" && state.dropbox.files.IDs.length === 0) {
    console.log("init dropbox data");
    return dispatch(initDropbox());
  }
  if (tab === "local" && state.localStorage.files.IDs.length === 0) {
    console.log("load local data");
    return dispatch(listLocalFiles());
  }
};

export const loadFileContent = async (dispatch, getState) => {
  // ensure current tab is loaded
  await loadTabData(dispatch, getState);
  // load current file
  console.log("loadFileContent");
  const { tab, fileID } = getState().location.payload;
  if (tab === "dropbox") {
    const file = getState().dropbox.files.byID[fileID];
    if (!file) {
      // back to tab
      return dispatch({ type: "URL/SELECT_TAB", payload: { tab } });
    }
    if (!file.content) {
      return dispatch(loadDropboxFile(fileID));
    }
  }
  else {
    const file = getState().localStorage.files.byID[fileID];
    if (!file) {
      // back to tab
      return dispatch({ type: "URL/SELECT_TAB", payload: { tab } });
    }
    return dispatch(loadLocalFile(fileID));
  }
};
