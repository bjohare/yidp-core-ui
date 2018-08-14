import * as actions from "./actions";

const state = {
  geonodeMaps: []
};

const mutations = {
  geonodeMaps(state, maps) {
    state.geonodeMaps = maps;
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
