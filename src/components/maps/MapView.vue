<template>
  <div  class="animated fadeIn map-container">
    <app-spinner :loading="loading"></app-spinner>
    <app-map :mapId="mapId"></app-map>
  </div>
</template>

<script>
import appMap from "./Map.vue";
import appSpinner from "@/components/shared/Spinner.vue";

export default {
  data() {
    return {
      mapId: null,
      loading: false
    };
  },
  components: {
    appMap,
    appSpinner
  },
  methods: {
    async fetchGeonodeMaps() {
      this.loading = true;
      const geonodeMaps = await this.$store.dispatch(
        "geonode/fetchGeonodeMaps"
      );
      await this.$store.dispatch("maps/syncMaps", geonodeMaps);
      this.loading = false;
    }
  },
  created() {
    this.mapId = this.$route.params.id;
    this.fetchGeonodeMaps();
    document.body.classList.add("aside-menu-show");
  },
  destroyed() {
    document.body.classList.remove("aside-menu-show");
  },
  beforeRouteLeave(to, from, next) {
    this.$root.$emit("map-destroy");
    next();
  }
};
</script>
<style>
.map-container {
  height: 100%;
}
</style>
