import { saveFile as saveDropboxFile } from "./dropbox";
import { saveFile as saveLocalFile } from "./localStorage";

export function saveFile(id, content) {
  return (dispatch, getState) => {
    if (getState().location.payload.tab === "dropbox") {
      dispatch(saveDropboxFile(id, content));
    }
    else {
      dispatch(saveLocalFile(id, content));
    }
  };
}
