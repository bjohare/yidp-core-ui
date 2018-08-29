<template>
  <b-tabs ref="tabs" fixed @input="setActive">
    <b-tab id="layers" ref="layers">
      <template slot="title">
        Catalog
      </template>
      <app-layer-control :mapConfig="mapConfig" :map="map" @toggle-layer="toggleLayer"></app-layer-control>
    </b-tab>
    <b-tab id="legend" ref="legend">
      <template slot="title">
        Legend
      </template>
      <app-legend-control :wmsLayers="wmsLayers" :map="map" :active="legendActive"></app-legend-control>
    </b-tab>
  </b-tabs>
</template>
<script>
import appLayerControl from "./LayerControl.vue";
import appLegendControl from "./LegendControl.vue";
import { loadWMSLayer } from "@/components/maps/wms";
import * as _ from "lodash";

export default {
  props: ["mapConfig", "map"],
  data() {
    return {
      wmsLayers: [],
      legendActive: false
    };
  },
  methods: {
    toggleLayer($event) {
      const { checked, selectedLayer } = $event;
      if (checked) {
        let layer = this.$store.getters["maps/getLayer"](
          selectedLayer.typename
        );
        if (!layer) {
          this.addLayer(selectedLayer);
        }
      } else {
        this.removeLayer(selectedLayer);
      }
    },
    addLayer(selectedLayer) {
      let wmsLayer = loadWMSLayer(this, selectedLayer);
      this.wmsLayers.push(wmsLayer);
      this.$store.dispatch("maps/addLayer", selectedLayer);
    },
    removeLayer(selectedLayer) {
      let wmsLyr = this.wmsLayers.find(layer => {
        return layer.typename === selectedLayer.typename;
      });
      if (wmsLyr && this.map.hasLayer(wmsLyr)) {
        _.remove(this.wmsLayers, lyr => {
          return lyr.typename === wmsLyr.typename;
        });
        wmsLyr.removeFrom(this.map);
      }
      this.$store.dispatch("maps/removeLayer", selectedLayer.typename);
    },
    async loadLayers() {
      const _vm = this;
      const defaultLayers = await this.$store.dispatch(
        "geonode/fetchGeonodeWMSLayers",
        this.mapConfig
      );
      defaultLayers.forEach(layer => {
        this.$store.dispatch("maps/addLayer", layer);
      });
      const layers = this.$store.getters["maps/getLayers"];
      layers.forEach(layer => {
        const wmsLayer = loadWMSLayer(_vm, layer);
        if (!layer.checked) {
          wmsLayer.setOpacity(0);
        }
        this.wmsLayers.push(wmsLayer);
      });
    },
    setActive(index) {
      // detect when legend becomes active
      if (index === 1) {
        this.legendActive = true;
      } else {
        this.legendActive = false;
      }
    },
    getLayer(typename) {
      return this.wmsLayers.find(layer => {
        return layer.typename === typename;
      });
    }
  },
  components: {
    appLayerControl,
    appLegendControl
  },
  created() {
    this.loadLayers();
    const _vm = this;
    this.$root.$on("filter-wms", typename => {
      let layer = _vm.getLayer(typename);
      layer.removeFrom(_vm.map);
    });
    this.$root.$on("clear-filter", typename => {
      if (typename) {
        let wmsLayer = _vm.getLayer(typename);
        wmsLayer.addTo(_vm.map);
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.aside-menu .nav-tabs .nav-link.active {
  color: red;
  border-right-color: #c8ced3;
  border-left-color: #c8ced3;
}
</style>
