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
      <b-list-group class="list-group-accent">
        <b-list-group-item class="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">
          Base Layers
        </b-list-group-item>
        <b-list-group-item v-for="(item, index) in baseLayers" :key="item.name + index"
          class="list-group-item-accent-primary list-group-item-divider">
          <div><strong>{{ item.name }}</strong>
            <label class="switch switch-sm float-right switch-pill switch-success">
              <input type="checkbox" class="switch-input" v-model="item.checked" @click="toggleLayer(item, index)">
              <span class="switch-slider"></span>
            </label>
          </div>
          <div class="mt-1">
            <app-slider ref="opacity" v-model="item.opacity" v-bind="slider" :disabled="!item.enabled"
              @drag-end="setLayerOpacity(item)">
            </app-slider>
          </div>
          <!-- <b-col sm="9"><b-form-input type="range"></b-form-input></b-col> -->
        </b-list-group-item>
        <hr class="transparent mx-3 my-0">
        <b-list-group-item class="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">
          Default Overlays
        </b-list-group-item>
        <b-list-group-item v-for="(item, index) in overlays" :key="item.name + index"
          class="list-group-item-accent-success list-group-item-divider">
          <div><strong>{{ item.name }}</strong>
            <label class="switch switch-sm float-right switch-pill switch-success">
              <input type="checkbox" class="switch-input" checked @click="toggleLayer(item, index)">
              <span class="switch-slider"></span>
            </label>
          </div>
          <div>
            <app-slider v-model="item.opacity" v-bind="slider" :disabled="!item.enabled"
              @drag-end="setLayerOpacity(item)">
            </app-slider>
          </div>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>

</template>

<script>
import appSlider from "vue-slider-component";
export default {
  data() {
    return {
      show: false,
      map: null,
      baseLayers: null,
      overlays: null,
      geonodeMaps: [],
      slider: {
        value: 1,
        min: 0,
        max: 1,
        interval: 0.1,
        dotSize: 15,
        clickable: false,
        tooltip: false,
        disabled: true
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
    }
  },
  components: {
    appSlider
  },
  created() {
    const _vm = this;
    this.$map.$on("layers-added", $event => {
      _vm.baseLayers = this.$map.baseLayers;
      _vm.overlays = this.$map.overlays;
      _vm.map = this.$map.map;
      _vm.show = true;
    });
    this.$map.$on("map-destroy", $event => {
      console.log("destroy map");
      _vm.map = null;
      _vm.baseLayers = null;
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
</style>
