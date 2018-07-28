import * as actions from "./actions";
import { geoserverEndpoints } from "../../endpoints";
import * as _ from "lodash";
// import Vue from "vue";

const defaultConfig = {
  zoom: 7,
  minZoom: 5,
  center: [15.51, 48.47],
  maxExtent: [41, 12, 55, 19],
  extent: null,
  wmsBaseUrl: geoserverEndpoints.wmsBaseUrl,
  selectedCategories: [],
  layers: []
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
  saveSelectedCategories(state, payload) {
    const { mapId, selected } = payload;
    state.userMaps[mapId].selectedCategories = selected;
  },
  saveFeatureGroup(state, layer) {
    let { mapId, name } = layer;
    let layers = state.userMaps[mapId].layers;
    let l = layers.find(lyr => {
      return (lyr.name = name);
    });
    if (l) {
      _.remove(layers, lyr => {
        return (lyr.name = l.name);
      });
      layers.push(layer);
    } else {
      layers.push(layer);
    }
  }
};

const getters = {
  getUserMap: state => id => {
    return state.userMaps[id];
  },
  getSelectedCategories: state => id => {
    return state.userMaps[id].selectedCategories;
  },
  getFeatureGroup: state => (id, group) => {
    let layers = state.userMaps[id].layers;
    return layers.find(l => {
      return l.name === group;
    });
  },
  getLayers: state => id => {
    return state.userMaps[id].layers;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
