import * as actions from "./actions";
import { geoserverEndpoints } from "../../endpoints";

const defaultConfig = {
  zoom: 7,
  minZoom: 5,
  center: [15.51, 48.47],
  maxExtent: [41, 12, 55, 19],
  extent: null,
  wmsBaseUrl: geoserverEndpoints.wmsBaseUrl,
  baseLayers: [],
  wmsLayers: [],
  wfsLayers: [],
  selectedCategories: [],
  styles: []
};

const state = {
  defaults: defaultConfig,
  userMaps: {}
};

const mutations = {
  saveUserMap(state, map) {
    const id = map.id;
    state.userMaps[id] = map;
  },
  saveMapPosition(state, payload) {
    const { mapId, zoom, center } = payload;
    state.userMaps[mapId].zoom = zoom;
    state.userMaps[mapId].center = center;
  },
  setWMSLayers(state, payload) {
    const { mapId, layers } = payload;
    state.userMaps[mapId].wmsLayers = layers;
  },
  setWFSLayers(state, payload) {
    const { mapId, layerGroups } = payload;
    state.userMaps[mapId].wfsLayers = layerGroups;
  },
  saveSelectedCategories(state, payload) {
    const { mapId, selected } = payload;
    state.userMaps[mapId].selectedCategories = selected;
  }
};

const getters = {
  getUserMap: state => id => {
    return state.userMaps[id];
  },
  getUserMaps: state => {
    return state.userMaps;
  },
  getSelectedCategories: state => id => {
    return state.userMaps[id].selectedCategories;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
