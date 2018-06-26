import { geonodeAxios, yidpAxios } from "./axios-auth";
import { apiEndpoints } from "../endpoints";

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
  getUserProfile(state) {
    return state.userProfile;
  }
};

const actions = {
  async login({ commit, state, dispatch }, payload) {
    const result = await yidpAxios.post(apiEndpoints.yidpAuthUrl, {
      username: payload.username,
      password: payload.password
    });
    console.log(result);
    commit("accessToken", result.data.data.token);
    try {
      await dispatch("getUserData");
      if (state.userData.sub) {
        // check for oAuth user info
        await dispatch("getUserProfile");
      }
    } catch (error) {
      console.log("No user data: ", error);
    }
  },

  async getUserData({ commit }) {
    const response = await geonodeAxios({
      url: apiEndpoints.userDataUrl,
      headers: {
        Authorization: "Bearer " + this.getters.getAccessToken.access_token
      }
    });
    commit("userData", response.data);
  },

  async getUserProfile({ commit, state }) {
    const userId = state.userData.sub;
    const response = await geonodeAxios({
      url: apiEndpoints.userProfileUrl + userId,
      headers: {
        Authorization: "Bearer " + this.getters.getAccessToken.access_token
      }
    });
    commit("userProfile", response.data);
  },

  logout({ commit }) {
    commit("accessToken", null);
    commit("userData", null);
    commit("userProfile", null);
  }
};

export default {
  state,
  mutations,
  getters,
  actions
};
