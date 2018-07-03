import { geoserverEndpoints } from "../../endpoints";
import * as actions from "./actions";

const state = {
  title: "",
  zoom: 6,
  minZoom: 5,
  center: [50, 18],
  maxExtent: [35, 10, 66, 28],
  baseLayers: ["https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"],
  wmsBaseUrl: geoserverEndpoints.wmsBaseUrl,
  geonodeMap: null,
  layers: []
};

const mutations = {
  title(state, title) {
    state.title = title;
  },
  geonodeMap(state, map) {
    state.geonodeMap = map;
  },
  zoom(state, zoom) {
    state.zoom = zoom;
  },
  center(state, center) {
    state.center = center;
  },
  capabilities(state, capabilities) {
    state.wmsCapabilities = capabilities;
  },
  layers(state, layers) {
    state.layers = layers;
  }
};

const getters = {
  getMapTitle(state) {
    return state.title;
  },
  getGeonodeMap(state) {
    return state.geonodeMap;
  },
  getLayers(state) {
    return state.layers;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
