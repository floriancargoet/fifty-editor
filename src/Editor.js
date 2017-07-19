// @flow
import React, { PureComponent } from "react";

import "./Editor.css";

type Props = {
  saving: boolean,
  value: string | null,
  onSaveClick: string => void,
  onChange: string => void
};

export default class Editor extends PureComponent<void, Props, void> {


  render() {
    const { value } = this.props;
    if (value == null) {
      // loading
      return (
        <div className="editor-loader">
          Loading
        </div>
      );
    }
    return (
      <div className="Editor">
        <textarea
          style={{
            display: "block",
            width: "100%",
            height: 200,
            boxSizing: "border-box"
          }}
          value={value}
          onChange={this.handleChange}
        />
        <button onClick={this.props.onSaveClick}>{this.props.saving ? "Saving..." : "Save"}</button>
      </div>
    );
  }

  handleChange = ev => {
    this.props.onChange(ev.target.value);
  };
}
