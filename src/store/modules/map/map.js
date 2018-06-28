import { geoserverEndpoints } from "./endpoints";
import * as actions from "./actions";

const state = {
  title: "YemenMap",
  zoom: 6,
  minZoom: 5,
  center: [50, 18],
  maxExtent: [35, 10, 66, 28],
  baseLayers: ["https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"],
  wmsBaseUrl: geoserverEndpoints.wmsBaseUrl,
  map: null,
  wmsCapabilities: null
};

const mutations = {
  title(state, title) {
    state.title = title;
  },
  map(state, map) {
    state.map = map;
  },
  zoom(state, zoom) {
    state.zoom = zoom;
  },
  center(state, center) {
    state.center = center;
  },
  capabilities(state, capabilities) {
    state.wmsCapabilities = capabilities;
  }
};

const getters = {
  getMapTitle(state) {
    return state.title;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
