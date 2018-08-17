import * as actions from "./actions";
import * as _ from "lodash";
import { geoserverEndpoints } from "../../endpoints";
import Vue from "vue";

export const mapDefaults = function() {
  return {
    id: null,
    zoom: 7,
    minZoom: 5,
    center: [15.51, 48.47],
    maxExtent: [41, 12, 55, 19],
    wmsBaseUrl: geoserverEndpoints.wmsBaseUrl,
    selectedCategories: [],
    layers: []
  };
};

const initialState = function() {
  return {
    maps: {
      default: {
        ...{ id: "default" },
        ...mapDefaults()
      }
    },
    mapDefaults: mapDefaults()
  };
};

const state = initialState();

const mutations = {
  saveMap(state, map) {
    const id = map.id;
    state.maps[id] = map;
  },
  saveMapPosition(state, payload) {
    const { mapId, zoom, center } = payload;
    state.maps[mapId].zoom = zoom;
    state.maps[mapId].center = center;
  },
  saveSelectedCategories(state, payload) {
    const { mapId, selected } = payload;
    state.maps[mapId].selectedCategories = selected;
  },
  addFeatureGroup(state, group) {
    let { mapId, name } = group;
    let l = state.maps[mapId].layers.find(lyr => {
      return lyr.name === name;
    });
    if (l === undefined) {
      state.maps[mapId].layers.push(group);
    }
  },
  removeFeatureGroup(state, group) {
    const { mapId, name } = group;
    _.remove(state.maps[mapId].layers, layer => {
      return layer.name === name;
    });
  },
  saveFeatureGroup(state, group) {
    let { mapId, name } = group;
    let layers = state.maps[mapId].layers;
    let l = layers.find(lyr => {
      return lyr.name === name;
    });
    if (l) {
      const index = layers.indexOf(l);
      Vue.set(state.maps[mapId].layers, index, group);
    }
  },
  resetState(state) {
    const initialState = initialState();
    state.maps = initialState.maps; // Object.assign?
  }
};

const getters = {
  getMap: state => id => {
    return state.maps[id];
  },
  getSelectedCategories: state => id => {
    return state.maps[id].selectedCategories;
  },
  getFeatureGroup: state => (id, group) => {
    let layers = state.maps[id].layers;
    return layers.find(l => {
      return l.name === group;
    });
  },
  getLayers: state => id => {
    return state.maps[id].layers;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
