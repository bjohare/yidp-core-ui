<template>
  <div>
    <div v-if="!show">
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
    <div v-if="show">
      <b-list-group  class="list-group-accent">
        <b-list-group-item class="list-group-item-accent-danger bg-light text-left font-weight-bold text-muted text-uppercase small">
          <div v-b-toggle.baseLayers>
            <i style="cursor: pointer;" class="closed fa fa-chevron-down fa-lg float-left mr-3"></i>
            <i style="cursor: pointer;" class="open fa fa-chevron-up fa-lg float-left mr-3"></i>
          </div>
          Base Layers
        </b-list-group-item>
        <b-collapse id="baseLayers" @shown="updateSliders">
          <b-list-group-item v-for="(item, index) in baseLayers" :key="item.name + index"
            class="list-group-item-accent-primary list-group-item-divider">
            <div class="layer-name"><strong>{{ item.name }}</strong>
              <label class="switch switch-sm float-right switch-pill switch-primary mt-3">
                <input type="checkbox" class="switch-input" v-model="item.checked" @click="toggleLayer(item)">
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
        <b-collapse id="defaultOverlays" visible @shown="updateSliders">
          <b-list-group-item v-for="(item, index) in wmsOverlays" :key="item.name + index"
          class="list-group-item-accent-success list-group-item-divider">
            <div class="layer-name"><strong>{{ item.name }}</strong>
              <label class="switch switch-sm float-right switch-pill switch-primary mt-3">
                <input type="checkbox" class="switch-input" checked @click="toggleLayer(item)">
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
              <b-dropdown-item v-b-modal.layerPicker>Add / Remove Overlays</b-dropdown-item>
           </b-dropdown>
        </b-list-group-item>
        <b-collapse id="overlays" visible @shown="updateSliders">
          <div v-for="(group, index) in wfsOverlays" :key="group.name + index">
            <app-layer-group :group="group" :index="index" :toggleLayer="toggleLayer"></app-layer-group>
          </div>
        </b-collapse>
        <div class="loading" v-if="!overlaysLoaded">
            <appSpinner :background="'#4DBD74'"></appSpinner>
        </div>
      </b-list-group>
    </div>
    <app-layer-picker ref="layerPicker" @selected="loadSelectedOverlays"
        v-if="userMap" :userMap="userMap" :selected="selected">
    </app-layer-picker>
  </div>

</template>

<script>
import appSlider from "vue-slider-component";
import appLayerPicker from "./LayerPicker.vue";
import appLayerGroup from "./LayerGroup.vue";
import { loadVectors } from "../map/wfs";
import { Stretch } from "vue-loading-spinner";
export default {
  data() {
    return {
      overlaysLoaded: false,
      show: false,
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
      return this.$store.getters["geonode/getGeonodeMaps"];
    },
    selected() {
      const selected = [];
      const selectedCategories = this.userMap.selectedCategories;
      selectedCategories.forEach(category => {
        selected.push(category.identifier);
      });
      return selected;
    },
    map() {
      return this.$map.map;
    },
    userMap() {
      return this.$map.userMap;
    },
    baseLayers() {
      return this.$map.baseLayers;
    },
    wmsOverlays() {
      return this.$map.wmsOverlays;
    },
    wfsOverlays() {
      return this.$map.wfsOverlays;
    }
  },
  methods: {
    toggleLayer(item) {
      const layer = item.layer;
      if (!this.map.hasLayer(layer)) {
        layer.setZIndex(layer.options.zIndex);
        this.map.addLayer(layer);
        item.enabled = true;
        item.checked = true;
      } else {
        this.map.removeLayer(layer);
        item.enabled = false;
        item.checked = false;
      }
    },
    setLayerOpacity(item) {
      const layer = item.layer;
      layer.setOpacity(item.opacity);
    },
    loadSelectedOverlays(selected) {
      let layersToLoad = selected.slice(0);
      this.$map.wfsOverlays.forEach(layer => {
        let selection = selected.find(category => {
          if (category.gn_description_en === layer.name) {
            return category;
          }
        });
        if (selection === undefined) {
          // remove unselected layer
          this.$map.removeWFSOverlay(layer);
        } else {
          // load any layers not already loaded
          layersToLoad = layersToLoad.filter(lyr => {
            return lyr.gn_description_en !== layer.name;
          });
        }
      });
      const payload = {
        mapId: this.userMap.id,
        selected
      };
      this.$store.dispatch("usermaps/saveSelectedCategories", payload);
      if (layersToLoad) {
        this.overlaysLoaded = false;
        loadVectors(this, layersToLoad);
      }
    },
    updateSliders() {
      this.$refs.opacity.forEach(slider => {
        slider.refresh();
      });
    }
  },
  components: {
    appSlider,
    appLayerPicker,
    appLayerGroup,
    appSpinner: Stretch
  },
  created() {
    const _vm = this;
    this.$map.$on("map-init", $event => {
      loadVectors(_vm, _vm.userMap.selectedCategories);
    });
    // triggered when WMS base layers are added to the map
    this.$map.$on("layers-added", $event => {
      _vm.show = true;
    });
    // triggered when WFS selected layers are added to the map
    this.$map.$on("overlays-loaded", $event => {
      _vm.overlaysLoaded = true;
    });
    this.$map.$on("map-destroy", $event => {
      _vm.show = false;
      _vm.overlaysLoaded = false;
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
.loading {
  width: 100px;
  height: 100px;
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 1rem;
}
svg.spinner {
  width: 60px !important;
  height: 60px !important;
  color: blue;
}
</style>
