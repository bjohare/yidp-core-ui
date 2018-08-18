<template>
<transition name="fade" mode="out-in">
  <div>
    <b-list-group class="list-group-accent">
      <b-list-group-item class="list-group-item-accent-danger bg-light text-left font-weight-bold text-uppercase small">
        <div v-b-toggle.baseLayers>
          <i style="cursor: pointer;" class="closed fa fa-chevron-down fa-lg float-left mr-3"></i>
          <i style="cursor: pointer;" class="open fa fa-chevron-up fa-lg float-left mr-3"></i>
        </div>
        Base Layers
      </b-list-group-item>
      <b-collapse id="baseLayers" @shown="updateSliders">
        <b-list-group-item v-for="(item, index) in baseLayers" :key="item.name + index"
          class="list-group-item-accent-primary list-group-item-divider">
          <div class="layer-name">
            <strong>{{ item.name }}</strong>
            <div class="d-flex">
              <app-slider ref="opacity" v-model="item.opacity" v-bind="slider" :disabled="!item.checked"
                @drag-end="setLayerOpacity(item)">
              </app-slider>
              <label class="switch switch-sm switch-pill switch-primary ml-4">
                <input type="checkbox" class="switch-input" v-model="item.checked" @click="toggleBaseLayer(item)">
                <span class="switch-slider"></span>
              </label>
            </div>
          </div>
        </b-list-group-item>
      </b-collapse>
      <hr class="transparent mx-3 my-0">
      <b-list-group-item class="list-group-item-accent-info bg-light text-left font-weight-bold text-uppercase small">
        Sectors / Clusters
      </b-list-group-item>
      <div id="sectors">
        <b-list-group-item v-for="(category, index) in categories" :key="category.identifier + index"
          class="list-group-item-accent-success text-left font-weight-bold text-uppercase small">
          <div v-b-toggle="category.identifier">
            <i style="cursor: pointer;" class="closed fa fa-chevron-down fa-lg float-left mr-3"></i>
            <i style="cursor: pointer;" class="open fa fa-chevron-up fa-lg float-left mr-3"></i>
          </div>
          <div class="layer-name"><strong>{{ category.gn_description }}</strong></div>
          <b-collapse :id="category.identifier">
            <b-list-group-item class="d-flex text-sm-left" v-for="(layer, idx) in category.layers" :key="layer.typename + idx">
                <b-form-checkbox :id="'check-layer' + layer.id" @change="toggleLayer($event, layer)" :checked="isActive(layer.typename)"></b-form-checkbox>
                <router-link :to="'/geodata/' + layer.id">
                  <i style="cursor: pointer;" class="fa fa-info-circle ml-2 mr-2 mt-1 fa-lg text-primary"></i>
                </router-link>
                <span class="layer-title">{{ layer.title}}</span>
            </b-list-group-item>
          </b-collapse>
          <hr class="transparent mx-3 my-0">
        </b-list-group-item>
      </div>
    </b-list-group>
  </div>
</transition>
</template>
<script>
import appSlider from "vue-slider-component";

export default {
  props: ["mapConfig", "map"],
  data() {
    return {
      baseLayers: [],
      categories: [],
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
  components: {
    appSlider
  },
  methods: {
    getCategories() {
      this.categories = this.$store.getters["maps/getCategories"];
    },
    toggleBaseLayer(layer) {
      if (!layer.checked && !this.map.hasLayer(layer.layer)) {
        this.map.addLayer(layer.layer);
        layer.checked = true;
      } else {
        this.map.removeLayer(layer.layer);
        layer.checked = false;
      }
    },
    toggleLayer(checked, layer) {
      const payload = { checked: checked, selectedLayer: layer };
      this.$emit("toggle-layer", payload);
    },
    setLayerOpacity(item) {
      const layer = item.layer;
      layer.setOpacity(item.opacity);
    },
    updateSliders() {
      this.$refs.opacity.forEach(slider => {
        slider.refresh();
      });
    },
    isActive(typename) {
      const layers = this.mapConfig.layers;
      const found = layers.find(layer => {
        return layer.typename === typename;
      });
      return found !== undefined;
    }
  },
  created() {
    const _vm = this;
    this.getCategories();
    this.$root.$on("base-layers-added", (baseLayers, wmsLayers) => {
      _vm.baseLayers = baseLayers;
      _vm.wmsLayers = wmsLayers;
      _vm.show = true;
    });
  }
};
</script>
<style lang="scss" scoped>
.collapsed > .open,
:not(.collapsed) > .closed {
  display: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.custom-checkbox {
  margin-right: 0rem;
}
.layer-title {
  margin-top: 0;
}
</style>
