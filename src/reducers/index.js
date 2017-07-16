import { combineReducers } from "redux";
import { dropbox } from "./dropbox";
import { localStorage } from "./localStorage";

export function makeRootReducer(locationReducer) {
  return combineReducers({
    location: locationReducer,
    dropbox,
    localStorage
  });
}
