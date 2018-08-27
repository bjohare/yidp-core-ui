import * as actions from "./actions";

const initialState = function() {
  return {
    selectedFeature: null,
    dataLayer: null,
    query: null,
    filteredData: null
  };
};

const state = initialState;

const mutations = {
  saveSelectedFeature(state, feature) {
    state.selectedFeature = feature;
  },
  saveDataLayer(state, dataLayer) {
    state.dataLayer = dataLayer;
  },
  saveQuery(state, query) {
    state.query = query;
  },
  saveFilteredData(state, filteredData) {
    state.filteredData = filteredData;
  },
  resetState(state) {
    this.state = initialState();
  }
};

const getters = {
  getSelectedFeature: state => {
    return state.selectedFeature;
  },
  getDataLayer: state => {
    return state.dataLayer;
  },
  getQuery: state => {
    return state.query;
  },
  getFilteredData: state => {
    return state.filteredData;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
