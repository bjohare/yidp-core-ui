<template>
  <div class="app">
    <AppHeader fixed>
      <b-link class="navbar-brand ml-3" to="/">
        <img src="/assets/yemen-logo.svg"/>
      </b-link>
      <SidebarToggler class="d-lg-none" display="md" mobile />
      <SidebarToggler class="d-md-down-none" display="lg" v-if="!dashboard"/>
      <b-navbar-nav class="d-md-down-none">
        <b-nav-item class="p-3"><router-link to="/geodata" class="nav-link">GeoData</router-link></b-nav-item>
        <b-nav-item class="p-3">
          <router-link to="/map/default" class="nav-link">Map</router-link>
           <b-badge variant="info" class="ml-3">{{ layerCount }}</b-badge>
        </b-nav-item>
        <b-nav-item class="p-3"><router-link to="/documents" class="nav-link">Documents</router-link></b-nav-item>
        <b-nav-item class="p-3"><router-link to="/projects" class="nav-link">Projects</router-link></b-nav-item>
      </b-navbar-nav>
      <b-link class="navbar-brand ml-5" href="http://ye.one.un.org/" target="_blank">
        <img src="/assets/un-yemen.png" height="36px" class="float-right"/>
      </b-link>
      <b-link class="navbar-brand ml-5" href="http://www.worldbank.org/en/country/yemen" target="_blank">
        <img src="/assets/wb.jpg" height="36px" class="float-right"/>
      </b-link>
      <b-navbar-nav class="ml-auto">
        <DefaultHeaderDropdownAccnt/>
      </b-navbar-nav>
      <AsideToggler class="d-none d-lg-block" @click="resizeMap" v-if="!dashboard"/>
      <!--<AsideToggler class="d-lg-none" mobile />-->
    </AppHeader>
    <div class="app-body">
      <AppSidebar fixed v-if="!dashboard">
        <SidebarHeader/>
        <SidebarForm/>
        <SidebarNav :navItems="nav"></SidebarNav>
        <SidebarFooter/>
        <SidebarMinimizer/>
      </AppSidebar>
      <main class="main">
        <!-- <breadcrumb :list="list"/> -->
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <AppAside fixed v-if="!dashboard">
        <DefaultAside/>
      </AppAside>
    </div>
    <TheFooter>
      <div v-if="dashboard" class="ethnic-background"></div>
      <div v-else class="default-footer">
        &copy;&nbsp; 2018 &nbsp; <a href="https://www.yemenpeaceproject.org/" target="blank"> Yemen Peace Project</a>
      </div>
    </TheFooter>
  </div>
</template>

<script>
import nav from "../_nav";
import {
  AsideToggler,
  Header as AppHeader,
  SidebarToggler,
  Sidebar as AppSidebar,
  SidebarFooter,
  SidebarForm,
  SidebarHeader,
  SidebarMinimizer,
  SidebarNav,
  Aside as AppAside,
  Footer as TheFooter,
  Breadcrumb
} from "@coreui/vue";
import DefaultAside from "./DefaultAside";
import DefaultHeaderDropdownAccnt from "./DefaultHeaderDropdownAccnt";

export default {
  name: "full",
  components: {
    AsideToggler,
    AppHeader,
    AppSidebar,
    AppAside,
    TheFooter,
    Breadcrumb,
    DefaultAside,
    DefaultHeaderDropdownAccnt,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer
  },
  data() {
    return {
      nav: nav.items
    };
  },
  methods: {
    resizeMap() {
      console.log("resize map now..");
    }
  },
  computed: {
    dashboard() {
      return this.name === "Dashboard";
    },
    name() {
      return this.$route.name;
    },
    list() {
      return this.$route.matched;
    },
    layerCount() {
      return this.$store.state.maps.layers.length;
    }
  }
};
</script>
<style scoped>
.ethnic-background {
  background-image: url("/assets/dashboard/bottompattern-tile-temp.png");
  background-repeat: repeat-x;
  background-color: #b19269;
  height: 100%;
  width: 100%;
  padding: 0 !important;
  margin: 0 !important;
}
.app-footer {
  border-top: 0px !important;
  margin: 0;
  padding: 0;
}
.default-footer {
  padding: 0 1rem !important;
  margin: 0;
}
.nav-link {
  color: #73818f;
}
.nav-link:hover {
  color: #2f353a;
}
/* li.nav-item:hover {
  background-color: #2f353a;
} */
</style>
