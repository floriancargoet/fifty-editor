// @flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";

import { saveFile, updateFile } from "./actions/ui"; // meh

import "./App.css";

import Editor from "./Editor";
import FileBrowser from "./FileBrowser";

type Props = {
  file: Object,
  saving: boolean,
  onFileSave: (string | null) => void,
  onFileChange: (string | null, string) => void
};

class App extends PureComponent<void, Props, void> {
  render() {
    const { file } = this.props;
    const fileContent = file ? file.newContent : "";

    return (
      <div className="App">
        <FileBrowser />
        <Editor
          value={fileContent}
          onChange={this.handleChange}
          onSaveClick={this.handleSaveClick}
          saving={this.props.saving}
        />
      </div>
    );
  }

  handleSaveClick = () => {
    const { file } = this.props;
    this.props.onFileSave(file && file.id);
  };

  handleChange = value => {
    const { file } = this.props;
    this.props.onFileChange(file && file.id, value);
  }
}

const mapStateToProps = state => {
  const selectedFile = state.location.payload.fileID;
  let file = state.dropbox.files.byID[selectedFile];
  if (!file) {
    file = state.localStorage.files.byID[selectedFile];
  }
  const { saving } = state.ui;
  return {
    file,
    saving
  };
};

const mapDispatchToProps = dispatch => ({
  onFileSave(id = prompt("filename")) {
    dispatch(saveFile(id));
  },
  onFileChange(id, content) {
    dispatch(updateFile(id, content));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
