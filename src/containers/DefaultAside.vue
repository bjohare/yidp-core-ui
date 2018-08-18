<template>
<div>
  <div v-if="showMapAside">
    <app-map-panels :map="map"></app-map-panels>
  </div>
  <div v-if="showDashboardAside">
    Dashboard Aside
  </div>
  <div v-if="showProjectAside">
    Project Aside
  </div>
  <div v-if="showGeodataAside">
    Geodata Aside
  </div>
</div>

</template>

<script>
import appMapPanels from "@/components/maps/MapPanels.vue";

export default {
  name: "DefaultAside",
  data() {
    return {
      map: null,
      showMapAside: false,
      showProjectAside: false,
      showDashboardAside: false,
      showGeodataAside: false,
      showDocumentsAside: false
    };
  },
  watch: {
    $route() {
      this.$route.name === "Map"
        ? (this.showMapAside = true)
        : (this.showMapAside = false);
      this.$route.name === "Dashboard"
        ? (this.showDashboardAside = true)
        : (this.showDashboardAside = false);
      this.$route.name === "GeoData"
        ? (this.showGeodataAside = true)
        : (this.showGeodataAside = false);
      this.$route.name === "Projects"
        ? (this.showProjectAside = true)
        : (this.showProjectAside = false);
      this.$route.name === "Documents"
        ? (this.showDocumentsAside = true)
        : (this.showDocumentsAside = false);
    }
  },
  components: {
    appMapPanels
  },
  created() {
    const _vm = this;
    this.$root.$on("map-init", map => {
      _vm.map = map;
      _vm.showMapAside = true;
    });
  }
};
</script>
