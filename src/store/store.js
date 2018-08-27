import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import authentication from "./modules/authentication/authentication";
import geonode from "./modules/geonode/geonode";
import projects from "./modules/projects/projects";
import maps from "./modules/maps/maps";
import analysis from "./modules/analysis/analysis";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  getters: {},
  actions: {},
  modules: {
    authentication,
    geonode,
    projects,
    maps,
    analysis
  },
  plugins: [createPersistedState()]
});
