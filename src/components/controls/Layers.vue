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
      layers: [],
      layer: {
        name: null,
        typename: null,
        opacity: 1,
        featureInfo: null
      }
    };
  },
  methods: {
    toggleLayer($event) {
      const { checked, selectedLayer } = $event;
      let layer = this.$store.getters[
        ("map/getLayer", (this.mapConfig.id, selectedLayer.typename))
      ];
      if (!layer) {
        layer = Object.assign({}, this.layer);
        layer.name = selectedLayer.name;
        layer.typename = selectedLayer.typename;
        layer.featureInfo = selectedLayer.featureInfo;
      }
      if (checked) {
        let wmsLayer = loadWMSLayer(this, selectedLayer);
        this.layers.push(wmsLayer);
        const payload = {
          mapId: this.mapConfig.id,
          layer: layer
        };
        this.$store.dispatch("maps/addLayer", payload);
      } else {
        const layers = _.remove(this.layers, lyr => {
          return selectedLayer.typename === lyr.typename;
        });
        if (layers.length > 0) {
          this.map.removeLayer(layers[0]);
          const payload = {
            mapId: this.mapConfig.id,
            layer: layer
          };
          this.$store.dispatch("maps/removeLayer", payload);
        }
      }
    },
    loadLayers() {
      const _vm = this;
      this.layers = [];
      const layers = this.mapConfig.layers;
      layers.forEach(layer => {
        const wmsLayer = loadWMSLayer(_vm, layer);
        _vm.layers.push(wmsLayer);
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
