import Dropbox from "dropbox";
import qs from "querystring";
import { popupCenter, readBlobAsText } from "../utils";

class Box {
  constructor() {
    this.API = new Dropbox();
    this.safeAPI = this.wrapAPI(this.API);
    this.API.setClientId("ubx9on95nautf7t");
    this.restoreAccessData();
  }

  /* Access related methods */

  restoreAccessData() {
    let accessData = localStorage.getItem("access");
    try {
      accessData = JSON.parse(accessData);
    }
    catch (e) {} // eslint-disable-line no-empty
    this.setAccessData(accessData);
  }

  setAccessData(data) {
    this.accessData = data || {};
    this.API.setAccessToken(this.accessData.access_token);
    localStorage.setItem("access", JSON.stringify(this.accessData));
  }

  async ensureAuthenticated() {
    let allowed = await this.checkAccess();
    if (!allowed) {
      return this.authenticate();
    }
  }

  async checkAccess() {
    // check token presence
    if (!this.accessData.access_token) {
      return false;
    }
    // check token validity
    try {
      await this.API.usersGetAccount({
        account_id: this.accessData.account_id
      });
      return true;
    }
    catch (e) {
      return false;
    }
  }

  async authenticate() {
    let redirectURL = "http://localhost:3000/dropbox-callback.html";
    const { hostname, protocol } = window.location;
    if (window.location.hostname === "floriancargoet.github.io") {
      redirectURL = `${protocol}//${hostname}/fifty-editor/dropbox-callback.html`;
    }
    const authURL = this.API.getAuthenticationUrl(redirectURL);
    const popup = popupCenter({ url: authURL, title: "DropboxAuthPopup" });

    return new Promise((resolve, reject) => {
      window.addEventListener(
        "message",
        ev => {
          if (window.location.origin !== ev.origin || ev.source !== popup) {
            // not for us
            return;
          }
          const response = qs.parse(ev.data);
          if (response.error) {
            reject(response);
            return;
          }
          this.setAccessData(response);
          resolve();
        },
        false
      );
    });
  }

  logout() {
    this.setAccessData({});
  }

  wrapAPI(API) {
    const safeAPI = {};
    for (let methodName in API) {
      if (typeof API[methodName] === "function") {
        safeAPI[methodName] = (...args) => this.safeAPICall(methodName, args);
      }
    }
    return safeAPI;
  }

  // try calling the API, authenticate & retry in case of failure
  async safeAPICall(method, args) {
    let unsafeCall = () => this.API[method](...args);
    let result;
    try {
      result = await unsafeCall();
    }
    catch (e) {
      console.log("API call failed. Attempting authentication.");
      try {
        await this.ensureAuthenticated();
        console.log("Authentication successful. Retrying API call.");
        result = await unsafeCall();
      }
      catch (e2) {
        console.log("Authencation failed. Aborting API call.");
        throw e2;
      }
    }
    return result;
  }

  /* Data methods */

  async listFiles() {
    let response = await this.safeAPI.filesListFolder({ path: "" });
    return response.entries;
  }

  async loadFile(path) {
    const file = await this.safeAPI.filesDownload({ path });
    file.content = await readBlobAsText(file.fileBlob);
    return file;
  }

  async saveFile(path, contents) {
    const mode = {
      ".tag": "overwrite" // TODO: use "update" and handle conflicts
    };
    await this.safeAPI.filesUpload({ path, contents, mode });
  }

  async demo() {
    const files = await this.listFiles();
    let file = files[0];
    file = await this.loadFile(file.path_lower);
    console.log(file.content);
    return file.content;
  }
}

const box = new Box();
window.box = box;
export { box };
