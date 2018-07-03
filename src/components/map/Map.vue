<template>
  <div class="map-view animated fadeIn">
    <keep-alive>
      <app-map></app-map>
    </keep-alive>
  </div>
</template>

<script>
import OLMap from "./WMS/OLMapWMS.vue";
// import OLMap from "./WFS/OLMapWFS.vue";

export default {
  components: {
    appMap: OLMap
  },
  methods: {},
  created() {
    const id = this.$route.params.id;
    const maps = this.$store.getters["maps/getGeonodeMaps"];
    const map = maps.filter(map => String(map.id) === id)[0];
    this.$store.dispatch("map/setMap", map);
  }
};
</script>
<style>
.map-view {
  margin-top: -1.5rem !important;
  height: 90% !important;
}
</style>
