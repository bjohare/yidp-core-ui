import * as actions from "./actions";
import * as _ from "lodash";
import Vue from "vue";

const state = {
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
  addFeatureGroup(state, group) {
    let { mapId, name } = group;
    let l = state.userMaps[mapId].layers.find(lyr => {
      return lyr.name === name;
    });
    if (l === undefined) {
      state.userMaps[mapId].layers.push(group);
    }
  },
  removeFeatureGroup(state, group) {
    const { mapId, name } = group;
    _.remove(state.userMaps[mapId].layers, layer => {
      return layer.name === name;
    });
  },
  saveFeatureGroup(state, group) {
    let { mapId, name } = group;
    let layers = state.userMaps[mapId].layers;
    let l = layers.find(lyr => {
      return lyr.name === name;
    });
    if (l) {
      const index = layers.indexOf(l);
      Vue.set(state.userMaps[mapId].layers, index, group);
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
    return state.userMap[id].layers;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
