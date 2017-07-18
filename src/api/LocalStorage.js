const files = {
  "editor-content_fifty-editor": {
    id: "editor-content_fifty-editor",
    name: "Fifty 1"
  },
  "editor-content_fifty-editor-2": {
    id: "editor-content_fifty-editor-2",
    name: "Fifty 2"
  },
  "editor-content_fifty-editor-3": {
    id: "editor-content_fifty-editor-3",
    name: "Fifty 3"
  }
};

class LocalStorage {
  /* Data methods */

  async listFiles() {
    return Object.values(files);
  }

  async loadFile(id) {
    const value = window.localStorage.getItem(id);
    const file = {
      ...files[id],
      content: value
    };
    return file;
  }

  async saveFile(id, contents) {
    window.localStorage.setItem(id, contents);
  }
}

const localStorage = new LocalStorage();
export { localStorage };
