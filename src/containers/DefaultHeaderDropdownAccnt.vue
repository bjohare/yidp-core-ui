<template>
<div>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
       <span v-show="isAuthenticated">{{ fullName }}</span>
       <i class="cui-user icons font-2xm d-inline mt-2"></i>
       <!-- <i class="icon-user"></i> -->
    </template>\
    <template slot="dropdown">
      <div v-show="isAuthenticated">
        <b-dropdown-header tag="div" class="text-center"><strong>Account</strong></b-dropdown-header>
        <b-dropdown-item><i class="fa fa-user" /> Profile</b-dropdown-item>
        <b-dropdown-item><i class="fa fa-bell-o" /> Maps
          <b-badge variant="info">{{ numMaps }}</b-badge>
        </b-dropdown-item>
        <b-dropdown-item><i class="fa fa-envelope-o" /> Layers
          <b-badge variant="success">{{ numLayers }}</b-badge>
        </b-dropdown-item>
        <!-- <b-dropdown-header
          tag="div"
          class="text-center">
          <strong>Settings</strong>
        </b-dropdown-header>
        <b-dropdown-item><i class="fa fa-wrench" /> Settings</b-dropdown-item>
        <b-dropdown-item><i class="fa fa-usd" /> Payments
          <b-badge variant="secondary">{{ itemsCount }}</b-badge>
        </b-dropdown-item>
        <b-dropdown-item><i class="fa fa-file" /> Projects
          <b-badge variant="primary">{{ itemsCount }}</b-badge>
        </b-dropdown-item> -->
        <b-dropdown-item to="/pages/logout"><i class="fa fa-lock" /> Logout</b-dropdown-item>
      </div>
      <div v-show="!isAuthenticated">
        <b-dropdown-item to="/pages/login"><i class="fa fa-shield"/> Login</b-dropdown-item>
      </div>

    </template>
  </AppHeaderDropdown>

</div>

</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from "@coreui/vue";
export default {
  name: "DefaultHeaderDropdownAccnt",
  data() {
    return {
      itemsCount: 42,
      authentication: this.$store.state.authentication
    };
  },
  computed: {
    isAuthenticated() {
      return this.authentication.userData != null;
    },
    numMaps() {
      return this.isAuthenticated
        ? this.authentication.userProfile.maps_count
        : 0;
    },
    numLayers() {
      return this.isAuthenticated
        ? this.authentication.userProfile.layers_count
        : 0;
    },
    fullName() {
      if (this.isAuthenticated) {
        const firstName = this.$store.state.authentication.userProfile
          .first_name;
        const lastName = this.$store.state.authentication.userProfile.last_name;
        return firstName + " " + lastName + " ";
      }
    }
  },
  components: {
    AppHeaderDropdown
  }
};
</script>
