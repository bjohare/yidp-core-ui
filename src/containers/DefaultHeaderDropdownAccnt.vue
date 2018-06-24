<template>
<div>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <i class="icon-user"></i>
    </template>\
    <template slot="dropdown">
      <b-dropdown-header tag="div" class="text-center"><strong>Account</strong></b-dropdown-header>
      <!-- <b-dropdown-item><i class="fa fa-bell-o" /> Updates
        <b-badge variant="info">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-item><i class="fa fa-envelope-o" /> Messages
        <b-badge variant="success">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-item><i class="fa fa-tasks" /> Tasks
        <b-badge variant="danger">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-item><i class="fa fa-comments" /> Comments
        <b-badge variant="warning">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-header
        tag="div"
        class="text-center">
        <strong>Settings</strong>
      </b-dropdown-header>
      <b-dropdown-item><i class="fa fa-user" /> Profile</b-dropdown-item>
      <b-dropdown-item><i class="fa fa-wrench" /> Settings</b-dropdown-item>
      <b-dropdown-item><i class="fa fa-usd" /> Payments
        <b-badge variant="secondary">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-item><i class="fa fa-file" /> Projects
        <b-badge variant="primary">{{ itemsCount }}</b-badge>
      </b-dropdown-item>
      <b-dropdown-divider /> -->
      <b-dropdown-item @click="login"><i class="fa fa-shield" />Login</b-dropdown-item>
      <b-dropdown-item><i class="fa fa-lock" /> Logout</b-dropdown-item>
    </template>
  </AppHeaderDropdown>

</div>

</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from "@coreui/vue";
import oauth2 from "simple-oauth2";

export default {
  name: "DefaultHeaderDropdownAccnt",
  data() {
    return {
      clientid: "",
      clientSecret: "",
      itemsCount: 42
    };
  },
  components: {
    AppHeaderDropdown
  },
  methods: {
    login() {
      console.log(process.env.CLIENT_ID);
      console.log(process.env.CLIENT_SECRET);
      const auth = oauth2.create({
        client: {
          id: process.env.CLIENT_ID,
          secret: process.env.CLIENT_SECRET
        },
        auth: {
          tokenHost: "http://localhost/geonode/",
          tokenPath: "/o/token/"
          // authorizePath: "/o/authorize/"
        }
      });
      const tokenConfig = {
        username: "bjohare",
        password: "x3791x3791",
        scope: "write" // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
      };

      const result = auth.ownerPassword.getToken(tokenConfig);
      result.then(resp => {
        console.log(resp);
        const accessToken = auth.accessToken.create(resp);
        localStorage.token = accessToken.token.access_token;
        localStorage.authorization = btoa("bjohare:x3791x3791");
        console.log(localStorage.token);
        console.log(localStorage.authorization);
        this.$router.replace(this.$route.query.redirect || "/map");
        console.log(accessToken);
      });
      result.catch(err => {
        console.log(err);
        this.$router.replace(this.$route.query.redirect || "/pages/login");
      });
    }
  }
};
</script>
