<template>
  <div  class="animated fadeIn map-container">
    <app-spinner :loading="loading"></app-spinner>
    <app-map></app-map>
  </div>
</template>

<script>
import appMap from "./MapView.vue";
import appSpinner from "@/components/shared/Spinner.vue";

export default {
  data() {
    return {
      userMap: null,
      loading: false
    };
  },
  components: {
    appMap,
    appSpinner
  },
  created() {
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
