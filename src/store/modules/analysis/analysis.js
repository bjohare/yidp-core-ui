import * as actions from "./actions";

const initialState = function() {
  return {
    selectedFeature: null,
    dataLayer: null,
    spatialQuery: null,
    query: null,
    filteredData: null,
    featureDescription: null
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
  saveSpatialQuery(state, query) {
    state.spatialQuery = query;
  },
  saveQuery(state, query) {
    state.query = query;
  },
  resetQuery(state) {
    state.query = null;
    state.spatialQuery = null;
  },
  saveFilteredData(state, filteredData) {
    state.filteredData = filteredData;
  },
  resetState(state) {
    this.state = initialState();
  },
  saveFeatureDescription(state, featureDescription) {
    state.featureDescription = featureDescription;
  }
};

const getters = {
  getSelectedFeature: state => {
    return state.selectedFeature;
  },
  getDataLayer: state => {
    return state.dataLayer;
  },
  getSpatialQuery: state => {
    return state.spatialQuery;
  },
  getQuery: state => {
    const q = state.query !== null ? " AND " + state.query : "";
    return state.spatialQuery + q;
  },
  getFilteredData: state => {
    return state.filteredData;
  },
  getFeatureDescription: state => {
    return state.featureDescription;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
