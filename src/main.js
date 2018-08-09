// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "core-js/es6/promise";
import "core-js/es6/string";
import "core-js/es7/array";
// import cssVars from 'css-vars-ponyfill'
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import App from "./App";
import router from "./router";
import VueAxios from "vue-axios";
import VueTruncate from "vue-truncate-filter";
import axios from "axios";
import moment from "moment";

import store from "@/store/store";

// todo
// cssVars()

Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);
Vue.use(VueTruncate);

Vue.filter("format-date", function(value) {
  if (!value) return "";
  return moment(value).format("MMMM Do YYYY, h:mm a");
});

Vue.filter("capitalize", function(value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

router.beforeEach((to, from, next) => {
  if (to.path === "/account/login" || to.path === "/account/logout") {
    next();
  }
  if (!store.getters["authentication/getAccessToken"]) {
    next("/account/login");
  }
  if (store.getters["authentication/isAccessTokenExpired"]) {
    next("/account/login");
  } else {
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: {
    App
  }
});
