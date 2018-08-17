<template>
  <b-tabs ref="tabs">
    <b-tab id="layers" ref="layers">
      <template slot="title">
        Catalog
      </template>
      <app-categories :mapConfig="mapConfig"></app-categories>
    </b-tab>
    <b-tab id="legend" ref="legend">
      <template slot="title">
        Legend
      </template>
      <app-legend></app-legend>
    </b-tab>
  </b-tabs>
</template>
<script>
import appCategories from "./LayerCategories.vue";
import appLegend from "./LayersLegend.vue";
export default {
  props: ["mapConfig", "map"],
  components: {
    appCategories,
    appLegend
  }
};
</script>
<style lang="scss" scoped>
</style>
