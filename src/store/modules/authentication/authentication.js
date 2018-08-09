import { geonodeAxios, yidpAxios } from "../../axios";
import { apiEndpoints } from "./endpoints";
import * as moment from "moment";

const state = {
  accessToken: null,
  userData: null,
  userProfile: null
};

const mutations = {
  accessToken(state, accessToken) {
    state.accessToken = accessToken;
  },
  userData(state, userData) {
    state.userData = userData;
  },
  userProfile(state, userProfile) {
    state.userProfile = userProfile;
  }
};

const getters = {
  getAccessToken(state) {
    return state.accessToken;
  },
  getUserData(state) {
    return state.userData;
  },
  getUserProfile(state) {
    return state.userProfile;
  }
};

const actions = {
  async login({ commit, dispatch }, payload) {
    const result = await yidpAxios.post(apiEndpoints.yidpAuthUrl, {
      username: payload.username,
      password: payload.password
    });
    commit("accessToken", result.data.data.token);
    try {
      const response = await dispatch("fetchUserData");
      commit("userData", response.data);
      if (response.data.sub) {
        const response = await dispatch("fetchUserProfile");
        commit("userProfile", response.data);
      }
    } catch (error) {
      console.log("No user data: ", error);
    }
  },

  async fetchUserData() {
    const response = await geonodeAxios({
      url: apiEndpoints.userDataUrl,
      headers: {
        Authorization:
          "Bearer " + this.getters["authentication/getAccessToken"].access_token
      }
    });
    return response;
  },

  async fetchUserProfile() {
    const userId = this.getters["authentication/getUserData"].sub;
    const response = await geonodeAxios({
      url: apiEndpoints.userProfileUrl + userId,
      headers: {
        Authorization:
          "Bearer " + this.getters["authentication/getAccessToken"].access_token
      }
    });
    return response;
  },

  logout({ commit }) {
    commit("accessToken", null);
    commit("userData", null);
    commit("userProfile", null);
  },

  isAccessTokenExpired({ commit, state }) {
    let accessToken = state.accessToken;
    let now = moment();
    let expires = moment(accessToken.expires_at);
    if (now.isAfter(expires)) {
      commit("accessToken", null);
      commit("userData", null);
      commit("userProfile", null);
      return true;
    }
    return false;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
