<template>
  <div class="map-view animated fadeIn">
    <app-map></app-map>
  </div>
</template>

<script>
import OLMap from "./map/OLMap.vue";

export default {
  components: {
    appMap: OLMap
  }
};
</script>
<style>
.map-view {
  margin-top: -1.5rem !important;
  height: 90% !important;
}
</style>
