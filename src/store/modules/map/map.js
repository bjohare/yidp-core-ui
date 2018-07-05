import { geoserverEndpoints } from "../../endpoints";
import * as actions from "./actions";

const state = {
  title: "",
  zoom: 7,
  minZoom: 5,
  center: [15.51, 48.47],
  maxExtent: [41, 12, 55, 19],
  wmsBaseUrl: geoserverEndpoints.wmsBaseUrl,
  geonodeMap: null,
  geonodeLayers: [],
  baseLayers: [],
  overlays: []
};

const mutations = {
  title(state, title) {
    state.title = title;
  },
  geonodeMap(state, map) {
    state.geonodeMap = map;
  },
  geonodeLayers(state, layers) {
    state.geonodeLayers = layers;
  },
  zoom(state, zoom) {
    state.zoom = zoom;
  },
  center(state, center) {
    state.center = center;
  },
  baseLayers(state, layers) {
    state.baseLayers = layers;
  },
  overlays(state, layers) {
    state.overlays = layers;
  }
};

const getters = {
  getMapTitle(state) {
    return state.title;
  },
  getGeonodeMap(state) {
    return state.geonodeMap;
  },
  getGeonodeLayers(state) {
    return state.geonodeLayers;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
