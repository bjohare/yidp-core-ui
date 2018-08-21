<template>
  <div>
    <b-list-group class="list-group-accent">
      <draggable v-model="layers" :options="{handle: '.handle'}" @end="dragEnd">
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
              <div class="col-sm-2 my-auto">
                <label class="switch switch-sm float-right switch-pill switch-primary">
                  <input type="checkbox" class="switch-input" v-model="layer.checked" @change="updateSliders">
                  <span class="switch-slider"></span>
                </label>
              </div>
              <!-- <span class="icon-question font-lg" v-b-popover.click="layer.abstract"></span> -->
            </div>
            <img :src="layer.legendUrl"/>
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
        return this.$store.state.maps.layers;
      },
      set(value) {
        this.$store.commit("maps/updateLayers", value);
      }
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
    dragEnd($event) {
      this.updateSliders();
    },
    setLayerOpacity(layer) {
      this.getWMSLayer(layer.typename).setOpacity(layer.opacity);
      this.$store.dispatch("maps/setLayerOpacity", layer);
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
</style>
