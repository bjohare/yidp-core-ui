<template>
  <div  class="animated fadeIn m-4">
    <app-spinner :loading="loading"></app-spinner>
    <div v-for="(layer, index) in layers" :key="index">
      <app-geodata-card :layer="layer"></app-geodata-card>
    </div>
  </div>
</template>
<script>
import appSpinner from "@/components/shared/Spinner.vue";
import appGeodataCard from "./GeoDataCard.vue";
export default {
  data() {
    return {
      layers: null,
      loading: false
    };
  },
  components: {
    appSpinner,
    appGeodataCard
  },
  methods: {
    async fetchGeonodeLayers() {
      this.loading = true;
      this.layers = await this.$store.dispatch("geonode/fetchGeonodeLayers");
      this.loading = false;
    }
  },
  created() {
    this.fetchGeonodeLayers();
  }
};
</script>
<style>
</style>
