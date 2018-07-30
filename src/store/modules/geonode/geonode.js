import * as actions from "./actions";

const state = {
  geonodeMaps: [],
  geonodeCategories: []
};

const mutations = {
  geonodeMaps(state, maps) {
    state.geonodeMaps = maps;
  },
  geonodeCategories(state, categories) {
    state.geonodeCategories = categories;
  }
};

const getters = {
  getGeonodeMaps(state) {
    return state.geonodeMaps;
  },
  getGeonodeMap: state => mapId => {
    return state.geonodeMaps.find(map => {
      return map.id === mapId;
    });
  },
  getGeonodeCategories(state) {
    return state.geonodeCategories;
  },
  getGeonodeMapLayers: state => mapId => {
    const map = state.geonodeMaps.find(m => {
      return m.id === mapId;
    });
    if (map) {
      return map.layers;
    } else {
      return [];
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
