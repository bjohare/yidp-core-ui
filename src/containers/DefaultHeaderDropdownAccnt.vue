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
      console.log(process.env.NODE_ENV);
      const auth = oauth2.create({
        client: {
          id: process.env.CLIENT_ID,
          secret: process.env.CLIENT_SECRET
        },
        auth: {
          tokenHost: "http://localhost/geonode/",
          tokenPath: "/geonode//o/token",
          authorizePath: "/geonode/o/authorize"
        }
      });
      console.log(auth);
      const authorizationUri = auth.authorizationCode.authorizeURL({
        redirect_uri: "http://localhost/dashboard",
        scope: "write"
      });
      console.log(authorizationUri);
      window.location = authorizationUri;
      // this.axios.get(authorizationUri).then(response => {
      //   console.log(response);
      // });

      // Get the access token object (the authorization code is given from the previous step).
      const tokenConfig = {
        code: "<code>",
        redirect_uri: "http://localhost:3000/dashboard",
        scope: "<scope>" // also can be an array of multiple scopes, ex. ['<scope1>, '<scope2>', '...']
      };

      // Save the access token
      // try {
      //   const result = await oauth2.authorizationCode.getToken(tokenConfig)
      //   const accessToken = oauth2.accessToken.create(result);
      // } catch (error) {
      //   console.log('Access Token Error', error.message);
      // }
    }
  }
};
</script>
