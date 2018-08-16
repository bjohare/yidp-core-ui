<template>
  <div  class="animated fadeIn m-4">
    <app-spinner :loading="loading"></app-spinner>
    <app-filter @change="filterData($event, 'text')"
                @selected="filterData($event, 'category')"
                @reset="fetchGeonodeLayers"></app-filter>
    <div v-if="!loading">
      <div v-for="(layer, index) in paginatedData" :key="index">
        <app-geodata-card :layer="layer"></app-geodata-card>
      </div>
      <b-alert variant="warning" show class="nodata" v-if="layers.length === 0 && !loading">No geodata found.</b-alert>
      <div v-if="pageCount > 1">
        <b-pagination-nav align="center" base-url="#" :number-of-pages="pageCount" v-model="pageNum" />
      </div>
    </div>
  </div>
</template>
<script>
import appSpinner from "@/components/shared/Spinner.vue";
import appGeodataCard from "./GeoDataCard.vue";
import appFilter from "@/components/shared/Filter.vue";

export default {
  data() {
    return {
      layers: [],
      loading: false,
      pageNum: 0,
      size: 10
    };
  },
  components: {
    appSpinner,
    appGeodataCard,
    appFilter
  },
  computed: {
    paginatedData() {
      const start = this.pageNum * this.size;
      const end = start + this.size;
      return this.layers.slice(start, end);
    },
    pageCount() {
      let l = this.layers.length;
      let s = this.size;
      return Math.floor(l / s);
    }
  },
  methods: {
    async filterData(value, type) {
      this.loading = true;
      this.pageNum = 0;
      this.layers = await this.$store.dispatch("geonode/filterGeonodeLayers", {
        value: value,
        type: type
      });
      this.loading = false;
    },
    async fetchGeonodeLayers() {
      this.loading = true;
      this.layers = await this.$store.dispatch("geonode/fetchGeonodeLayers");
      this.loading = false;
    },
    next() {
      this.pageNum++;
    },
    prev() {
      this.pageNum--;
    }
  },
  created() {
    this.fetchGeonodeLayers();
  }
};
</script>
<style scoped>
.nodata {
  max-width: 95%;
  min-width: 95%;
  margin: 0 auto;
}
</style>
