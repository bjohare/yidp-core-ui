import * as actions from "./actions";
// import * as _ from "lodash";
// import Vue from "vue";

const state = {
  projects: {}
};

const mutations = {
  saveProject(state, project) {
    const id = project.id;
    state.projects[id] = project;
  },
  resetState(state) {
    state.projects = {};
  }
};

const getters = {
  getProject: state => id => {
    return state.projects[id];
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
