<template>
<div class="container animated fadeIn">
  <app-spinner :loading="loading"></app-spinner>
  <b-card-group deck class="mb-3" v-show="!loading">
    <div v-for="(map, index) in maps" :key="index">
      <app-map-card :map="map"></app-map-card>
    </div>
  </b-card-group>
</div>
</template>

<script>
import MapCard from "../maps/MapCard.vue";
import appSpinner from "@/components/shared/Spinner.vue";

export default {
  data() {
    return {
      loading: false
    };
  },
  computed: {
    maps() {
      return this.$store.getters["maps/getGeonodeMaps"];
    }
  },
  components: {
    appMapCard: MapCard,
    appSpinner
  },
  methods: {
    async fetchGeonodeMaps() {
      this.loading = true;
      await this.$store.dispatch("maps/fetchGeonodeMaps");
      this.loading = false;
    }
  },
  created() {
    console.log("in maps..");
    this.fetchGeonodeMaps();
  }
};
</script>

<style scoped>
</style>
