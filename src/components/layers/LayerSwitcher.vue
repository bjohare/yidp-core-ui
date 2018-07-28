<template>
  <div id="layer-switcher">
    <!-- <transition name="fade" mode="out-in">
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
    </transition> -->
    <transition name="fade" mode="out-in">
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
                <div class="d-flex">
                  <app-slider ref="opacity" v-model="item.opacity" v-bind="slider" :disabled="!item.enabled"
                    @drag-end="setLayerOpacity(item)">
                  </app-slider>
                  <label class="switch switch-sm switch-pill switch-primary ml-4">
                    <input type="checkbox" class="switch-input" v-model="item.checked" @click="toggleLayer(item)">
                    <span class="switch-slider"></span>
                  </label>
                </div>
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
          <b-collapse id="defaultOverlays" @shown="updateSliders">
            <b-list-group-item v-for="(item, index) in wmsLayers" :key="item.name + index"
            class="list-group-item-accent-success list-group-item-divider">
              <div class="layer-name"><strong>{{ item.name }}</strong>
                <div class="d-flex">
                  <app-slider ref="opacity" v-model="item.opacity" v-bind="slider" :disabled="!item.enabled"
                  @drag-end="setLayerOpacity(item)">
                  </app-slider>
                  <label class="switch switch-sm switch-pill switch-primary ml-4">
                    <input type="checkbox" class="switch-input" checked @click="toggleLayer(item)">
                    <span class="switch-slider"></span>
                  </label>
                </div>
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
              <app-layer-group :map="map" :group="group"
                :index="index" :toggleLayer="toggleLayer" :toggleGroup="toggleGroup"></app-layer-group>
            </div>
          </b-collapse>
          <div class="loading" v-if="!overlaysLoaded">
              <appSpinner :background="'#4DBD74'"></appSpinner>
          </div>
        </b-list-group>
      </div>
    </transition>
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
      map: null,
      userMap: null,
      baseLayers: [],
      wmsLayers: [],
      featureGroups: [],
      // wfsOverlays: [],
      overlaysLoaded: true,
      show: false,
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
    selected() {
      const selected = [];
      const selectedCategories = this.userMap.selectedCategories;
      selectedCategories.forEach(category => {
        selected.push(category.identifier);
      });
      return selected;
    },
    wfsOverlays() {
      return this.userMap.layers;
    }
  },
  methods: {
    toggleLayer(layer, group) {
      const featureGroup = this.featureGroups.find(f => {
        return f.name === layer.groupName;
      });
      let featureLayer = null;
      featureGroup.eachLayer(lyr => {
        if (lyr.name === layer.name) {
          featureLayer = lyr;
        }
      });
      if (featureLayer && !this.map.hasLayer(featureLayer)) {
        featureLayer.setZIndex(featureLayer.options.zIndex);
        this.map.addLayer(featureLayer);
        layer.checked = true;
      } else {
        this.map.removeLayer(featureLayer);
        layer.checked = false;
      }
      this.$store.dispatch("usermaps/saveFeatureGroup", group);
    },
    toggleGroup(group) {
      const featureGroup = this.featureGroups.find(lyr => {
        return lyr.name === group.name;
      });
      if (!this.map.hasLayer(featureGroup)) {
        featureGroup.setZIndex(featureGroup.options.zIndex);
        this.map.addLayer(featureGroup);
        group.layers.forEach(lyr => {
          let layer = null;
          featureGroup.eachLayer(l => {
            if (l.name === lyr.name) {
              layer = l;
            }
          });
          if (lyr.checked) {
            this.map.addLayer(layer);
          } else {
            this.map.removeLayer(layer);
          }
        });
        group.checked = true;
      } else {
        this.map.removeLayer(featureGroup);
        group.checked = false;
      }
      this.$store.dispatch("usermaps/saveFeatureGroup", group);
    },
    setLayerOpacity(item) {
      const layer = item.layer;
      layer.setOpacity(item.opacity);
    },
    loadSelectedOverlays(selected) {
      let layersToLoad = selected.slice(0);
      this.wfsOverlays.forEach(layer => {
        let selection = selected.find(category => {
          if (category.gn_description_en === layer.name) {
            return category;
          }
        });
        if (selection === undefined) {
          // remove unselected layer
          this.removeWFSOverlay(layer);
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
    },
    addWFSOverlay(group, featureGroup) {
      this.featureGroups.push(featureGroup);
      if (group.checked && !this.map.hasLayer(featureGroup)) {
        this.map.addLayer(featureGroup);
      }
      group.layers.forEach(layer => {
        let l = featureGroup.getLayers().find(ly => {
          return ly.name === layer.name;
        });
        if (layer.checked && group.checked) {
          this.map.addLayer(l);
        } else {
          this.map.removeLayer(l);
        }
      });
      this.$store.dispatch("usermaps/addFeatureGroup", group);
    },
    removeWFSOverlay(overlay) {
      // this.map.removeLayer(overlay.layer);
      // this.wfsOverlays = this.wfsOverlays.filter(
      //   item => item.name !== overlay.name
      // );
      console.log("remove overlay", overlay);
    },
    resetMap() {
      this.map = null;
      this.userMap = null;
      this.baseLayers = [];
      this.wmsLayers = [];
      this.featureGroups = [];
    },
    loadUserMap() {
      const id = this.$route.params.id;
      this.userMap = this.$store.getters["usermaps/getUserMap"](id);
      loadVectors(this, this.userMap.selectedCategories);
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
    this.$root.$on("map-init", map => {
      _vm.map = map;
      _vm.loadUserMap();
    });
    this.$on("overlays-loaded", () => {
      _vm.overlaysLoaded = true;
    });
    // triggered when WMS base layers are added to the map
    this.$root.$on("base-layers-added", (baseLayers, wmsLayers) => {
      _vm.baseLayers = baseLayers;
      _vm.wmsLayers = wmsLayers;
      _vm.show = true;
    });
    this.$root.$on("map-destroy", $event => {
      _vm.show = false;
      _vm.overlaysLoaded = false;
      _vm.resetMap();
    });
    this.$on("overlays-added", () => {
      _vm.overlaysLoaded = true;
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
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
