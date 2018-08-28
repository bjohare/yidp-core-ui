<template>
  <div style="height: inherit;">
    <Split :gutterSize="gutterSize" @onDrag="onDrag" direction="vertical">
      <SplitArea :size="mapHeight">
      <div id="map" style="height: 100%;">
          <div ref="overlay">
            <app-overlay :features="selectedFeatures"
              :showPopover="showPopover" @dismissed="clearSelectedFeatures"></app-overlay>
          </div>
        </div>
      </SplitArea>
      <SplitArea :size="dataHeight" style="overflow: scroll;">
        <app-data-table :show="showDataPane"></app-data-table>
      </SplitArea>
    </Split>
  </div>
</template>
<script>
import "leaflet/dist/leaflet.css";
import { initMap, loadBaseLayers } from "./wms";
import appOverlay from "@/components/controls/FeatureInfoControl.vue";
import appDataTable from "@/components/analysis/DataTable.vue";

import * as L from "leaflet";

export default {
  props: ["id"],
  data() {
    return {
      map: null,
      mapConfig: this.$store.getters["maps/getMap"](this.id),
      info: null,
      selectedFeatures: [],
      selection: null,
      isAnalysisActive: false
    };
  },
  computed: {
    showPopover() {
      return this.selectedFeatures.length > 0 && !this.isAnalysisActive;
    },
    mapHeight() {
      if (this.showDataPane) {
        return 60;
      } else {
        return 100;
      }
    },
    dataHeight() {
      if (this.showDataPane) {
        return 40;
      } else {
        return 0;
      }
    },
    showDataPane() {
      return (
        this.isAnalysisActive &&
        this.$store.state.analysis.filteredData !== null
      );
    },
    gutterSize() {
      return this.showDataPane ? 8 : 0;
    }
  },
  components: {
    appOverlay,
    appDataTable
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
    },
    onDrag() {
      this.map.invalidateSize();
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
    this.$root.$on("changed::tab", $event => {
      if ($event.tabs[$event.currentTab].id === "analysis") {
        this.isAnalysisActive = true;
      } else {
        this.isAnalysisActive = false;
      }
      this.clearSelectedFeatures();
    });
  }
};
</script>
<style lang="scss" scoped>
</style>
