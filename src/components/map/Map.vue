<template>
  <div  class="animated fadeIn map-container">
    <app-spinner :loading="loading"></app-spinner>
    <app-map :userMap="userMap"></app-map>
  </div>
</template>

<script>
import appMap from "./MapView.vue";
import appSpinner from "@/components/shared/Spinner.vue";

export default {
  data() {
    return {
      loading: false,
      userMap: null
    };
  },
  components: {
    appMap,
    appSpinner
  },
  methods: {
    async loadUserMap() {
      const id = this.$route.params.id;
      this.userMap = this.$store.getters["usermaps/getUserMap"](id);
      // what to do here if we don't have a map? -- 404..
    }
  },
  created() {
    this.loadUserMap();
    document.body.classList.add("aside-menu-show");
  },
  destroyed() {
    document.body.classList.remove("aside-menu-show");
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
