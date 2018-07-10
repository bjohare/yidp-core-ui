<template>
  <div>
    <div v-show="!show">
       <b-list-group class="list-group-accent">
        <b-list-group-item class="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">
          Select a Map
        </b-list-group-item>
        <b-list-group-item v-for="(map, index) in maps" :key="map.title + index"
          class="list-group-item-accent-primary list-group-item-divider">
          <div><strong><router-link :to="{ name: 'map', params: {id: map.id}}">{{ map.title }}</router-link></strong>
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
    <div v-show="show">
      <b-list-group  class="list-group-accent">
        <b-list-group-item class="list-group-item-accent-danger bg-light text-left font-weight-bold text-muted text-uppercase small">
          <div v-b-toggle.baseLayers>
            <i style="cursor: pointer;" class="closed fa fa-chevron-down fa-lg float-left mr-3"></i>
            <i style="cursor: pointer;" class="open fa fa-chevron-up fa-lg float-left mr-3"></i>
          </div>
          Base Layers
        </b-list-group-item>
        <b-collapse id="baseLayers" visible>
          <b-list-group-item v-for="(item, index) in baseLayers" :key="item.name + index"
            class="list-group-item-accent-primary list-group-item-divider">
            <div class="layer-name"><strong>{{ item.name }}</strong>
              <label class="switch switch-sm float-right switch-pill switch-primary mt-3">
                <input type="checkbox" class="switch-input" v-model="item.checked" @click="toggleLayer(item, index)">
                <span class="switch-slider"></span>
              </label>
              <app-slider ref="opacity" v-model="item.opacity" v-bind="slider" :disabled="!item.enabled"
                @drag-end="setLayerOpacity(item)">
              </app-slider>
            </div>
            <!-- <div class="mt-1">

            </div> -->
          </b-list-group-item>
        </b-collapse>
        <hr class="transparent mx-3 my-0">
        <b-list-group-item class="list-group-item-accent-danger bg-light text-left font-weight-bold text-muted text-uppercase small">
          <div v-b-toggle.defaultOverlays>
            <i style="cursor: pointer;" class="closed fa fa-chevron-down fa-lg float-left mr-3"></i>
            <i style="cursor: pointer;" class="open fa fa-chevron-up fa-lg float-left mr-3"></i>
          </div>
          Default Overlays
        </b-list-group-item>
        <b-collapse id="defaultOverlays" visible>
          <b-list-group-item v-for="(item, index) in wmsOverlays" :key="item.name + index"
          class="list-group-item-accent-success list-group-item-divider">
            <div class="layer-name"><strong>{{ item.name }}</strong>
              <label class="switch switch-sm float-right switch-pill switch-success mt-3">
                <input type="checkbox" class="switch-input" checked @click="toggleLayer(item, index)">
                <span class="switch-slider"></span>
              </label>
              <app-slider ref="opacity" v-model="item.opacity" v-bind="slider" :disabled="!item.enabled"
                @drag-end="setLayerOpacity(item)">
              </app-slider>
            </div>
            <!-- <div>

            </div> -->
          </b-list-group-item>
        </b-collapse>
        <hr class="transparent mx-3 my-0">
        <b-list-group-item class="list-group-item-accent-danger bg-light text-left font-weight-bold text-muted text-uppercase small">
          <div v-b-toggle.overlays>
            <i style="cursor: pointer;" class="closed fa fa-chevron-down fa-lg float-left mr-3"></i>
            <i style="cursor: pointer;" class="open fa fa-chevron-up fa-lg float-left mr-3"></i>
          </div>
          Other Overlays
          <b-dropdown class="float-right" variant="secondar p-1" right>
              <template slot="button-content">
                <i class="fa fa-cog fa-lg"></i>
              </template>
              <b-dropdown-item v-b-modal.layerPicker >Add Overlays</b-dropdown-item>
           </b-dropdown>
        </b-list-group-item>
        <b-collapse id="overlays" visible>
         <app-layer-group :wfsOverlays="wfsOverlays" :toggleLayer="toggleLayer">
         </app-layer-group>
        </b-collapse>
      </b-list-group>
    </div>
    <app-layer-picker @selected="loadWFSOverlays"></app-layer-picker>
  </div>

</template>

<script>
import appSlider from "vue-slider-component";
import appLayerPicker from "./LayerPicker.vue";
import appLayerGroup from "./LayerGroup.vue";
import { loadVectors } from "../map/wfs";
export default {
  data() {
    return {
      show: false,
      map: null,
      baseLayers: null,
      wmsOverlays: null,
      wfsOverlays: null,
      geonodeMaps: [],
      slider: {
        value: 1,
        min: 0,
        max: 1,
        interval: 0.1,
        height: 5,
        width: 200,
        dotSize: 13,
        clickable: false,
        tooltip: false
      }
    };
  },
  computed: {
    maps() {
      return this.$store.getters["maps/getGeonodeMaps"];
    }
  },
  methods: {
    toggleLayer(item, index) {
      const layer = item.layer;
      if (!this.map.hasLayer(layer)) {
        layer.setZIndex(layer.options.zIndex);
        this.map.addLayer(layer);
        item.enabled = true;
      } else {
        this.map.removeLayer(layer);
        item.enabled = false;
      }
    },
    setLayerOpacity(item) {
      const layer = item.layer;
      layer.setOpacity(item.opacity);
    },
    loadWFSOverlays(selected) {
      loadVectors(this, selected);
    }
  },
  components: {
    appSlider,
    appLayerPicker,
    appLayerGroup
  },
  mounted() {
    const _vm = this;
    // triggered when WMS base layers are added to the map
    this.$map.$on("layers-added", $event => {
      _vm.baseLayers = this.$map.baseLayers;
      _vm.wmsOverlays = this.$map.wmsOverlays;
      _vm.map = this.$map.map;
      _vm.show = true;
    });
    // triggered when WFS selected layers are added to the map
    this.$map.$on("overlays-added", $event => {
      _vm.wfsOverlays = this.$map.wfsOverlays;
    });
    this.$map.$on("map-destroy", $event => {
      _vm.map = null;
      _vm.baseLayers = null;
      _vm.wmsOverlays = null;
      _vm.overlays = null;
      _vm.show = false;
      this.map = null;
      this.baseLayers = null;
      this.overlays = null;
    });
  }
};
</script>
<style scoped>
.collapsed > .open,
:not(.collapsed) > .closed {
  display: none;
}
.layer-name {
  font-size: 0.9em;
}
</style>
