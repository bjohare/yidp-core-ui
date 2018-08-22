<template>
  <div style="height: inherit;">
      <div id="map" class="d-flex">
        <div ref="overlay">
          <app-overlay :features="selectedFeatures"
            :showPopover="showPopover" @dismissed="clearSelectedFeatures"></app-overlay>
        </div>
      </div>
  </div>
</template>
<script>
import "leaflet/dist/leaflet.css";
import { initMap, loadBaseLayers } from "./wms";
import appOverlay from "@/components/controls/FeatureInfoControl.vue";
import * as L from "leaflet";

export default {
  props: ["id"],
  data() {
    return {
      map: null,
      mapConfig: this.$store.getters["maps/getMap"](this.id),
      info: null,
      selectedFeatures: [],
      selection: null
    };
  },
  computed: {
    showPopover() {
      return this.selectedFeatures.length > 0;
    }
  },
  components: {
    appOverlay
  },
  methods: {
    initializeMap() {
      initMap(this);
      this.map.on("click", e => {
        this.selectedFeatures = [];
        if (this.selection) {
          this.map.removeLayer(this.selection);
        }
      });
      this.$root.$emit("map-init", this.map);
    },
    async loadBaseLayers() {
      const baseLayers = await loadBaseLayers(this.map);
      this.$root.$emit("base-layers-added", baseLayers);
    },
    clearSelectedFeatures() {
      this.selectedFeatures = [];
      if (this.selection) {
        this.map.removeLayer(this.selection);
      }
    },
    addSelectedIndicator() {
      if (this.showPopover) {
        const latlng = this.selectedFeatures[0].latlng;
        if (this.selection) {
          this.map.removeLayer(this.selection);
        }
        this.selection = L.circleMarker(latlng, {
          color: "#4000ff",
          fillColor: "lightblue",
          fillOpacity: 0.8,
          radius: 25
        });
        this.selection.addTo(this.map);
        // this.map.panTo(latlng);
      }
    }
  },
  mounted() {
    this.initializeMap();
    this.loadBaseLayers();
  },
  created() {
    this.$root.$on("feature-selected", feature => {
      const lyr = this.$store.getters["maps/getLayer"](feature.typename);
      if (lyr && lyr.checked) {
        this.selectedFeatures.push(feature);
        this.selectedFeatures.reverse();
        this.addSelectedIndicator();
      }
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
