import { combineReducers } from "redux";
import { dropbox } from "./dropbox";
import { localStorage } from "./localStorage";
import { ui } from "./ui";

export function makeRootReducer(locationReducer) {
  return combineReducers({
    location: locationReducer,
    dropbox,
    localStorage,
    ui
  });
}
