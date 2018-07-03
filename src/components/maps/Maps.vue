<template>
<div class="container animated fadeIn">
  <b-card-group deck class="mb-3">
    <div v-for="(map, index) in maps" :key="index">
      <app-map-card :map="map"></app-map-card>
    </div>
  </b-card-group>
</div>
</template>

<script>
import MapCard from "../maps/MapCard.vue";
export default {
  data() {
    return {
      maps: this.$store.getters["maps/getGeonodeMaps"]
    };
  },
  components: {
    appMapCard: MapCard
  },
  created() {
    this.$store.dispatch("maps/fetchGeonodeMaps");
  }
};
</script>

<style scoped>
</style>
