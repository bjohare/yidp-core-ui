<template>
  <div style="height: inherit;">
      <div id="map" class="d-flex">
        <app-overlay :info="selectedFeature" :showPopover="showPopover"></app-overlay>
      </div>
  </div>
</template>
<script>
import "leaflet/dist/leaflet.css";
import { initMap, loadWMSLayers } from "./wms";
import appOverlay from "../layers/LayerOverlay.vue";

export default {
  data() {
    return {
      map: null,
      userMap: null,
      info: null,
      selectedFeature: null
    };
  },
  computed: {
    showPopover() {
      return this.selectedFeature !== null;
    }
  },
  components: {
    appOverlay
  },
  methods: {
    async showGetFeatureInfo(url, coordinate) {
      this.showPopover = false;
      const featureInfo = this.map.getOverlayById("featureInfoOverlay");
      featureInfo.setPosition(coordinate);
      // const response = await axios.get(url);
      // const data = response.data;
    },
    initializeMap() {
      initMap(this);
    },
    async loadInitalLayers() {
      await loadWMSLayers(this);
    },
    triggerLayersAdded(baseLayers, wmsLayers) {
      this.$root.$emit("base-layers-added", baseLayers, wmsLayers);
    },
    loadUserMap() {
      const id = this.$route.params.id;
      this.userMap = this.$store.getters["usermaps/getUserMap"](id);
    },
    resetSelectedFeature() {
      this.selectedFeature.layer.setStyle(this.selectedFeature.style);
    }
  },
  mounted() {
    this.initializeMap();
    this.loadInitalLayers();
  },
  created() {
    const _vm = this;
    this.loadUserMap();
    this.$root.$on("map-init", map => {
      map.on("click", e => {
        if (_vm.selectedFeature !== null) {
          this.resetSelectedFeature();
          _vm.selectedFeature = null;
        }
      });
    });
    this.$root.$on("map-destroy", () => {
      _vm.map = null;
      _vm.userMap = null;
    });
    this.$root.$on("feature-selected", info => {
      if (_vm.selectedFeature) {
        _vm.resetSelectedFeature();
      }
      this.selectedFeature = info;
    });
  }
};
</script>
<style lang="scss" scoped>
#map {
  width: auto;
  height: 100%;
}
</style>
