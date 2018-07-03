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
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
