<template>
  <div  class="animated fadeIn map-container">
    <app-map :id="id"></app-map>
  </div>
</template>

<script>
import appMap from "./Map.vue";

export default {
  props: ["id"],
  components: {
    appMap
  },
  created() {
    document.body.classList.add("aside-menu-show");
  },
  destroyed() {
    document.body.classList.remove("aside-menu-show");
  }
};
</script>
<style>
.map-container {
  height: 100%;
}
</style>
