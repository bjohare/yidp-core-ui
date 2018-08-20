<template>
  <b-tabs ref="tabs" fixed>
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
      <app-legend-control></app-legend-control>
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
      wmsLayers: []
    };
  },
  methods: {
    toggleLayer($event) {
      const { checked, selectedLayer } = $event;
      if (checked) {
        let layer = this.$store.getters[
          ("map/getLayer", selectedLayer.typename)
        ];
        if (!layer) {
          layer = Object.assign({}, this.$store.state.maps.layer);
          layer.name = selectedLayer.name;
          layer.title = selectedLayer.title;
          layer.typename = selectedLayer.typename;
          layer.featureInfo = selectedLayer.featureInfo;
        }
        let wmsLayer = loadWMSLayer(this, selectedLayer);
        this.wmsLayers.push(wmsLayer);
        this.$store.dispatch("maps/addLayer", layer);
      } else {
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
      }
    },
    loadLayers() {
      const _vm = this;
      const layers = this.$store.getters["maps/getLayers"];
      layers.forEach(layer => {
        const wmsLayer = loadWMSLayer(_vm, layer);
        this.wmsLayers.push(wmsLayer);
      });
    }
  },
  components: {
    appLayerControl,
    appLegendControl
  },
  created() {
    this.loadLayers();
    this.$root.$on("add-layer", layer => {
      console.log(layer);
    });
  }
};
</script>
<style lang="scss" scoped>
</style>
