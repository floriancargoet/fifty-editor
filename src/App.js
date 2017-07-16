// @flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";

import { saveFile } from "./actions/ui"; // meh

import "./App.css";

import Editor from "./Editor";
import FileBrowser from "./FileBrowser";

type Props = {
  file: Object,
  onFileSave: (string | null, string) => void
};

class App extends PureComponent<void, Props, void> {
  render() {
    const { file } = this.props;
    const fileContent = file ? file.content : "";

    return (
      <div className="App">
        <FileBrowser />
        <Editor initialValue={fileContent} onSaveClick={this.handleSaveClick} />
      </div>
    );
  }

  handleSaveClick = value => {
    const { file } = this.props;
    this.props.onFileSave(file && file.id, value);
  };
}

const mapStateToProps = state => {
  const selectedFile = state.location.payload.fileID;
  let file = state.dropbox.files.byID[selectedFile];
  if (!file) {
    file = state.localStorage.files.byID[selectedFile];
  }
  return { file };
};

const mapDispatchToProps = dispatch => ({
  onFileSave(id, content) {
    if (!id) {
      id = prompt("filename");
    }
    dispatch(saveFile(id, content));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
