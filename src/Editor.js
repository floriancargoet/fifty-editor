// @flow
import React, { PureComponent } from "react";

import "./Editor.css";

type Props = {
  initialValue: string | null,
  onSaveClick: string => void
};

export default class Editor extends PureComponent<void, Props, void> {
  state = {
    value: this.props.initialValue
  };

  componentWillReceiveProps(newProps) {
    this.setState({
      value: newProps.initialValue
    });
  }

  render() {
    const { value } = this.state;
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
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button onClick={this.handleSaveClick}>Save</button>
      </div>
    );
  }

  handleChange = ev => {
    this.setState({
      value: ev.target.value
    });
  };

  handleSaveClick = () => {
    this.props.onSaveClick(this.state.value);
  };
}
