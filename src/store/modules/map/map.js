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
  geonodeWMSLayers: [],
  geonodeWFSLayers: [],
  geonodeCategories: [],
  baseLayers: [],
  overlays: []
};

const mutations = {
  // the map title
  title(state, title) {
    state.title = title;
  },
  // map base layers
  baseLayers(state, layers) {
    state.baseLayers = layers;
  },
  // the current geonode map
  geonodeMap(state, map) {
    state.geonodeMap = map;
  },
  // default geonode wms layers
  geonodeWMSLayers(state, layers) {
    state.geonodeWMSLayers = layers;
  },
  // selcted geonode wfs layers
  geonodeWFSLayers(state, layers) {
    state.geonodeWFSLayers = layers;
  },
  // the list of available geonode categories
  geonodeCategories(state, categories) {
    state.geonodeCategories = categories;
  },
  zoom(state, zoom) {
    state.zoom = zoom;
  },
  center(state, center) {
    state.center = center;
  }
};

const getters = {
  getMapTitle(state) {
    return state.title;
  },
  getGeonodeMap(state) {
    return state.geonodeMap;
  },
  getGeonodeWMSLayers(state) {
    return state.geonodeWMSLayers;
  },
  getGeonodeCategories(state, dispatch) {
    return state.geonodeCategories;
  },
  getGeonodeWFSLayers(state) {
    return state.geonodeWFSLayers;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
