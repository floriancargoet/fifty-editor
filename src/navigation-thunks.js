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
    return dispatch(initDropbox());
  }
  if (tab === "local" && state.localStorage.files.IDs.length === 0) {
    return dispatch(listLocalFiles());
  }
};

export const loadFileContent = async (dispatch, getState) => {
  // ensure current tab is loaded
  await loadTabData(dispatch, getState);
  // load current file if needed
  const { tab, fileID } = getState().location.payload;
  let fileType, loadFile;
  if (tab === "dropbox") {
    fileType = "dropbox";
    loadFile = loadDropboxFile;
  }
  else {
    fileType = "localStorage";
    loadFile = loadLocalFile;
  }

  const file = getState()[fileType].files.byID[fileID];
  if (!file) {
    // back to tab
    return dispatch({ type: "URL/SELECT_TAB", payload: { tab } });
  }
  if (file.content == null) {
    return dispatch(loadFile(fileID));
  }
};
