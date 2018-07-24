<template>
  <div>
    <b-list-group-item class="list-group-item-accent-success list-group-item-divider">
    <div v-b-toggle="'group-' + index">
      <i style="cursor: pointer;" class="closed fa fa-chevron-down fa-sm float-left mr-3"></i>
      <i style="cursor: pointer;" class="open fa fa-chevron-up fa-sm float-left mr-3"></i>
    </div>
    <div class="mb-2"><strong>{{ group.name | truncate(32) }}</strong>
      <label class="switch switch-sm float-right switch-pill switch-primary">
        <input type="checkbox" class="switch-input" v-model="group.checked" @click="toggleGroup(group)">
        <span class="switch-slider"></span>
      </label>
    </div>
    <b-collapse :id="'group-' + index" @shown="updateSliders">
      <b-list-group-item class="sub" v-for="(layer, idx) in group.layers" :key="layer.name + idx"
      :disabled="!group.enabled">
        <div class="text-left small"><strong>{{ layer.name }}</strong></div>
        <div class="flex">
          <label class="switch switch-sm switch-success ml-3">
            <input ref="switch" type="checkbox" class="switch-input" v-model="layer.checked" @click="toggleLayer(layer)"
            :disabled="!group.enabled">
            <span class="switch-slider"></span>
          </label>
          <app-slider ref="opacity" v-model="layer.opacity" v-bind="slider" :disabled="!layer.enabled || !group.enabled"
            @drag-end="setLayerOpacity(layer)" class="float-left">
          </app-slider>
          <i class="fa fa-cog fa-lg"></i>
        </div>
      </b-list-group-item>
    </b-collapse>
    </b-list-group-item>
  </div>
</template>

<script>
import appSlider from "vue-slider-component";
export default {
  props: ["group", "index", "toggleLayer"],
  data() {
    return {
      loaded: false,
      slider: {
        value: 1,
        min: 0,
        max: 1,
        interval: 0.1,
        height: 5,
        width: 150,
        dotSize: 13,
        clickable: true,
        tooltip: false,
        debug: true
        // bgStyle: {
        //   backgroundColor: "red;"
        // }
      }
    };
  },
  computed: {
    map() {
      return this.$map.map;
    }
  },
  components: {
    appSlider
  },
  methods: {
    setLayerOpacity(lyr) {
      const layer = lyr.layer;
      layer.setStyle({ opacity: lyr.opacity, fillOpacity: lyr.opacity });
    },
    toggleGroup(item) {
      const layer = item.layer;
      if (!this.map.hasLayer(layer)) {
        layer.setZIndex(layer.options.zIndex);
        this.map.addLayer(layer);
        item.layers.forEach(lyr => {
          if (lyr.enabled) {
            this.map.addLayer(lyr.layer);
          } else {
            this.map.removeLayer(lyr.layer);
          }
        });
        item.enabled = true;
        item.checked = true;
      } else {
        this.map.removeLayer(layer);
        item.enabled = false;
        item.checked = false;
      }
    },
    updateSliders() {
      this.$refs.opacity.forEach(slider => {
        slider.refresh();
      });
    }
  }
};
</script>

<style scoped>
.collapsed > .open,
:not(.collapsed) > .closed {
  display: none;
}
.list-group-item.sub {
  padding: 0.2rem 0.2rem 0rem 0.1rem;
  border: none;
}
</style>
