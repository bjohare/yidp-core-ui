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
  getGeonodeCategories(state, dispatch) {
    return state.geonodeCategories;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
