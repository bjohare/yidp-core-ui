<template>
  <div  class="animated fadeIn map-container">
    <app-spinner :loading="loading"></app-spinner>
    <keep-alive>
      <app-map></app-map>
    </keep-alive>
  </div>
</template>

<script>
import OLMap from "./MapView.vue";
import appSpinner from "@/components/shared/Spinner.vue";

export default {
  data() {
    return {
      loading: false
    };
  },
  components: {
    appMap: OLMap,
    appSpinner
  },
  methods: {
    async setGeonodeMap() {
      const id = this.$route.params.id;
      let maps = this.$store.getters["maps/getGeonodeMaps"];
      if (maps.length === 0) {
        this.loading = true;
        await this.$store.dispatch("maps/fetchGeonodeMaps");
        this.loading = false;
      }
      maps = this.$store.getters["maps/getGeonodeMaps"];
      const map = maps.filter(m => {
        return m.id === Number.parseInt(id);
      })[0];
      this.$store.dispatch("map/setGeonodeMap", map);
    }
  },
  created() {
    this.setGeonodeMap();
  },
  beforeRouteLeave(to, from, next) {
    this.$map.$emit("map-destroy");
    next();
  }
};
</script>
<style>
.map-container {
  height: 100%;
}
</style>
