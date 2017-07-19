// @flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import Link from "redux-first-router-link";

import { listFiles, checkDropboxAccess } from "./actions/dropbox";

import "./FileBrowser.css";

type Props = {
  dropboxFiles: Object,
  localFiles: Object,
  selectedFile: string | null,
  selectedTab: "local" | "dropbox",
  loggedIn: boolean | null,
  onLoginClick: () => void
};

class FileBrowser extends PureComponent<*, Props, *> {
  render() {
    const { loggedIn, selectedTab } = this.props;
    return (
      <div className="FileBrowser">
        <ul className="FileBrowser-nav">
          <li className={selectedTab === "local" ? "active" : ""}>
            <Link to={{ type: "URL/SELECT_TAB", payload: { tab: "local" } }}>
              Local
            </Link>
          </li>
          <li className={selectedTab === "dropbox" ? "active" : ""}>
            <Link to={{ type: "URL/SELECT_TAB", payload: { tab: "dropbox" } }}>
              Dropbox
            </Link>
          </li>
        </ul>
        {selectedTab === "dropbox"
          ? loggedIn ? this.renderFiles() : this.renderLogin()
          : this.renderFiles()}
      </div>
    );
  }

  renderLogin() {
    const { loggedIn } = this.props;
    if (loggedIn === false) {
      // false or null = unknown = checking...
      return (
        <div className="login">
          <button onClick={this.props.onLoginClick}>Login with Dropbox</button>
        </div>
      );
    }
  }

  renderFiles() {
    const { dropboxFiles, localFiles, selectedFile, selectedTab } = this.props;
    const files = selectedTab === "local" ? localFiles : dropboxFiles;
    if (files.loading) {
      return <div className="loader">Loading...</div>;
    }
    const description = selectedTab === "local"
      ? "These files are stored only in this browser"
      : "These files are stored in Dropbox/Applications/Fifty Editor/";

    return (
      <div className="file-list">
        <ul className="file-list-files">
          {files.IDs.map(id => {
            const file = files.byID[id];
            let modified = false;
            if (file.content != null) {
              modified = (file.content !== file.newContent);
            }
            return (
              <li key={id} className={id === selectedFile ? "active" : ""}>
                <Link
                  to={{
                    type: "URL/SELECT_FILE",
                    payload: { tab: selectedTab, fileID: id }
                  }}
                >
                  {file.name}{modified ? " *" : ""}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="file-list-description">{description}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dropboxFiles: state.dropbox.files,
  localFiles: state.localStorage.files,
  selectedFile: state.location.payload.fileID,
  selectedTab: state.location.payload.tab,
  loggedIn: state.dropbox.loggedIn
});

const mapDispatchToProps = dispatch => ({
  async onLoginClick() {
    await dispatch(listFiles()); // will login then listFiles
    dispatch(checkDropboxAccess()); // will update the loggedIn state
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(FileBrowser);
