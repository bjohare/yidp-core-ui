<template>
  <div class="loading" v-show="loading">
    <app-spinner></app-spinner>
  </div>
</template>
<script>
import { Circle } from "vue-loading-spinner";
export default {
  props: {
    loading: false
  },
  components: {
    appSpinner: Circle
  }
};
</script>
<style scoped>
.loading {
  width: 100px;
  height: 100px;
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
svg.spinner {
  width: 60px !important;
  height: 60px !important;
}
</style>
