<template>
  <div>
    <div v-if="!hasLayers" class="alert alert-info">
        No layers selected.
    </div>
    <b-list-group v-else class="list-group-accent">
      <draggable v-model="layers" :options="{handle: '.handle'}">
        <transition-group>
          <b-list-group-item v-for="(layer, index) in layers" :key="index"
          class="legend list-group-item-accent-success list-group-item-divider text-left font-weight-bold text-uppercase small">
            <div class="row">
              <div class="col-sm-2 my-auto">
                <span class="handle"></span>
              </div>
              <div class="col-sm-8">
                <div class="row">
                <div class="col-sm-12 p-2">
                  <strong class="">{{ layer.title }}</strong>
                </div>
                </div>
                <div class="row">
                  <div class="col-sm-12 p-0">
                    <app-slider ref="opacity" v-model="layer.opacity" v-bind="slider" :disabled="!layer.checked"
                      @drag-end="setLayerOpacity(layer)">
                    </app-slider>
                  </div>
                </div>
              </div>
              <div class="col-sm-2 my-auto mb-2">
                <label class="switch switch-sm float-right switch-pill switch-primary">
                  <input type="checkbox" class="switch-input" v-model="layer.checked"
                  @change="toggleLayer(layer)">
                  <span class="switch-slider"></span>
                </label>
                <div class="mt-3" v-b-toggle="'legend-' + index">
                  <i style="cursor: pointer;" class="closed fa fa-chevron-down fa-lg float-left mr-3"></i>
                  <i style="cursor: pointer;" class="open fa fa-chevron-up fa-lg float-left mr-3"></i>
                </div>
              </div>
            </div>
            <b-collapse :id="'legend-' + index">
              <div class="row">
                <div class="col-sm-2">&nbsp;</div>
                <div class="col-sm-10 p-0 mt-1 mb-1">
                  <img :src="layer.legendUrl"/>
                </div>
              </div>
            </b-collapse>
          </b-list-group-item>
        </transition-group>
      </draggable>
    </b-list-group>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import appSlider from "vue-slider-component";
export default {
  props: ["wmsLayers", "map", "active"],
  data() {
    return {
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
    layers: {
      get() {
        const layers = this.$store.state.maps.layers;
        let lyrs = layers.slice();
        return lyrs.reverse();
      },
      set(values) {
        let zIndex = 400;
        // set zindex on wmslayers by layer order
        values.forEach(layer => {
          let wmsLayer = this.getWMSLayer(layer.typename);
          wmsLayer.setZIndex(zIndex--);
        });
        const reordered = values.slice().reverse();
        this.$store.commit("maps/updateLayers", reordered);
      }
    },
    hasLayers() {
      return this.layers.length > 0;
    }
  },
  watch: {
    active(active) {
      if (active) {
        this.updateSliders();
      }
    }
  },
  methods: {
    // changeLayerOrder($event) {
    //   const { element, oldIndex, newIndex } = $event.moved;
    //   const wmsLayer = this.getWMSLayer(element.typename);
    //   let d = 0;
    //   if (wmsLayer) {
    //     var idx = wmsLayer.options["zIndex"];
    //     if (newIndex > oldIndex) {
    //       d = newIndex - oldIndex;
    //       idx = idx - d * 10;
    //     } else {
    //       d = oldIndex - newIndex;
    //       idx = idx + d * 10;
    //     }
    //     wmsLayer.setZIndex(idx);
    //   }
    //   this.$store.dispatch("maps/updateLayer", element);
    // },
    setLayerOpacity(layer) {
      this.getWMSLayer(layer.typename).setOpacity(layer.opacity);
      this.$store.dispatch("maps/updateLayer", layer);
    },
    updateSliders() {
      this.$refs.opacity.forEach(slider => {
        slider.refresh();
      });
    },
    getWMSLayer(typename) {
      return this.wmsLayers.find(lyr => {
        return lyr.typename === typename;
      });
    },
    toggleLayer(layer) {
      const { checked, typename, opacity } = layer;
      const wmsLayer = this.getWMSLayer(typename);
      if (!checked) {
        wmsLayer.setOpacity(0);
      } else {
        wmsLayer.setOpacity(opacity);
      }
      this.$store.dispatch("maps/updateLayer", layer);
    }
  },
  components: {
    draggable,
    appSlider
  }
};
</script>
<style lang="scss" scoped>
.handle {
  content: "....";
  width: 10px;
  height: 20px;
  display: inline-block;
  line-height: 5px;
  cursor: move;
  vertical-align: middle;
  font-size: 12px;
  font-family: sans-serif;
  letter-spacing: 2px;
  color: #cccccc;
  text-shadow: 1px 0 1px black;
}
.handle::after {
  content: ".. .. .. ..";
}
.collapsed > .open,
:not(.collapsed) > .closed {
  display: none;
}
.alert {
  border-radius: 0px;
}
</style>
