export const LIST_FILES_RESULT = "LS/LIST_FILES_RESULT";
export function listFiles() {
  const files = [
    {
      id: "editor-content_fifty-editor",
      name: "Fifty 1"
    },
    {
      id: "editor-content_fifty-editor-2",
      name: "Fifty 2"
    },
    {
      id: "editor-content_fifty-editor-3",
      name: "Fifty 3"
    }
  ];

  return {
    type: LIST_FILES_RESULT,
    payload: { files }
  };
}

export const LOAD_FILE_RESULT = "LS/LOAD_FILE_RESULT";
export function loadFile(id) {
  return {
    type: LOAD_FILE_RESULT,
    payload: {
      id,
      content: localStorage.getItem(id) || ""
    }
  };
}

export function saveFile(id, content) {
  return dispatch => {
    localStorage.setItem(id, content);
  };
}
