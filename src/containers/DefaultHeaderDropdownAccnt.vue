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
        <b-dropdown-item>
          <i class="cui-map icons font-1xl d-inline mt-4"/> Maps
          <b-badge variant="info">{{ numMaps }}</b-badge>
        </b-dropdown-item>
        <b-dropdown-item>
          <i class="cui-layers icons font-1xl d-inline mt-4"/> Layers
          <b-badge variant="info">{{ numLayers }}</b-badge>
        </b-dropdown-item>
        <b-dropdown-item>
          <i class="cui-note icons font-1xl d-inline mt-4"/> Documents
          <b-badge variant="info">{{ numDocuments }}</b-badge>
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
        <b-dropdown-item to="/account/logout"><i class="fa fa-lock" /> Logout</b-dropdown-item>
      </div>
      <div v-show="!isAuthenticated">
        <b-dropdown-item to="/account/login"><i class="fa fa-shield"/> Login</b-dropdown-item>
      </div>

    </template>
  </AppHeaderDropdown>

</div>

</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from "@coreui/vue";
import { mapState } from "vuex";
export default {
  name: "DefaultHeaderDropdownAccnt",
  data() {
    return {
      itemsCount: 42
    };
  },
  computed: {
    ...mapState("authentication", {
      userProfile: state => state.userProfile
    }),
    isAuthenticated() {
      return this.userProfile != null;
    },
    numMaps() {
      return this.isAuthenticated ? this.userProfile.maps_count : 0;
    },
    numLayers() {
      return this.isAuthenticated ? this.userProfile.layers_count : 0;
    },
    numDocuments() {
      return this.isAuthenticated ? this.userProfile.documents_count : 0;
    },
    fullName() {
      if (this.isAuthenticated) {
        const firstName = this.userProfile.first_name;
        const lastName = this.userProfile.last_name;
        return firstName + " " + lastName + " ";
      }
    }
  },
  components: {
    AppHeaderDropdown
  }
};
</script>
