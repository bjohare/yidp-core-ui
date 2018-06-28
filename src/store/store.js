import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import * as actions from "./actions";
import authentication from "./modules/authentication/authentication";
import map from "./modules/map/map";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},

  getters: {},
  actions, // modularized
  modules: {
    authentication,
    map
  },
  plugins: [createPersistedState()]
});
