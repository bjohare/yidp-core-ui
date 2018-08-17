<template>
<div class="animated fadeIn m-4">
  <app-spinner :loading="loading"></app-spinner>
  <b-card-group deck class="mb-3" v-show="!loading">
    <div v-for="(map, index) in maps" :key="index">
      <app-map-card :map="map"></app-map-card>
    </div>
  </b-card-group>
</div>
</template>

<script>
import MapCard from "./ProjectCard.vue";
import appSpinner from "@/components/shared/Spinner.vue";

export default {
  data() {
    return {
      loading: false
    };
  },
  computed: {
    maps() {
      return this.$store.getters["geonode/getGeonodeMaps"];
    }
  },
  components: {
    appMapCard: MapCard,
    appSpinner
  },
  methods: {
    async fetchGeonodeMaps() {
      this.loading = true;
      const geonodeMaps = await this.$store.dispatch(
        "geonode/fetchGeonodeMaps"
      );
      this.$store.dispatch("maps/syncMaps", geonodeMaps);
      this.loading = false;
    }
  },
  created() {
    this.fetchGeonodeMaps();
  }
};
</script>

<style scoped>
</style>
