<template>
<div>
  <app-spinner :loading="loading"></app-spinner>
  <div>
    Layer id: {{ layer.id }}
    Abstract: {{ layer.abstract }}
  </div>
</div>

</template>
<script>
import appSpinner from "@/components/shared/Spinner.vue";
export default {
  data() {
    return {
      loading: false,
      layer: null
    };
  },
  components: {
    appSpinner
  },
  methods: {
    async loadLayer() {
      this.loading = true;
      const id = this.$route.params.id;
      console.log(id);
      this.layer = await this.$store.dispatch("geonode/fetchGeonodeLayer", id);
      this.featureType = await this.$store.dispatch(
        "geonode/fetchGeoserverFeatureType",
        this.layer.typename
      );
      this.loading = false;
    }
  },
  created() {
    this.loadLayer();
  }
};
</script>
<style scoped></style>
