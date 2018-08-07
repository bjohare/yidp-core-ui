import * as actions from "./actions";

const state = {
  geonodeMaps: [],
  geonodeCategories: [],
  geonodeDocuments: []
};

const mutations = {
  geonodeMaps(state, maps) {
    state.geonodeMaps = maps;
  },
  geonodeCategories(state, categories) {
    state.geonodeCategories = categories;
  },
  geonodeDocuments(state, documents) {
    state.geonodeDocuments = documents;
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
  getGeonodeDocuments(state) {
    return state.geonodeDocuments;
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
