<template>
  <div>
    <b-list-group-item v-for="(group, index) in wfsOverlays" :key="group.name + index"
        class="list-group-item-accent-success list-group-item-divider">
      <div v-b-toggle.wmsOverlays>
        <i style="cursor: pointer;" class="closed fa fa-chevron-down fa-sm float-left mr-3"></i>
        <i style="cursor: pointer;" class="open fa fa-chevron-up fa-sm float-left mr-3"></i>
      </div>
      <div class="mb-2"><strong>{{ group.name | truncate(32) }}</strong>
        <label class="switch switch-sm float-right switch-pill switch-primary">
          <input type="checkbox" class="switch-input" checked @click="toggleLayer(group, index)">
          <span class="switch-slider"></span>
        </label>
      </div>
      <b-collapse id="wmsOverlays">
        <b-list-group-item class="sub" v-for="(layer, idx) in group.layers" :key="layer.name + idx">
          <div class="text-left small"><strong>{{ layer.name }}</strong>
            <label class="switch switch-sm float-right switch-pill switch-success mt-3">
              <input type="checkbox" class="switch-input" checked @click="toggleLayer(layer, idx)">
              <span class="switch-slider"></span>
            </label>
            <app-slider ref="opacity" v-model="layer.opacity" v-bind="slider" :disabled="!layer.enabled"
              @drag-end="setLayerOpacity(layer)">
            </app-slider>
          </div>
        </b-list-group-item>
      </b-collapse>
     </b-list-group-item>
  </div>
</template>

<script>
import appSlider from "vue-slider-component";
export default {
  props: ["wfsOverlays", "toggleLayer"],
  data() {
    return {
      slider: {
        value: 1,
        min: 0,
        max: 1,
        interval: 0.1,
        height: 5,
        width: 150,
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
    setLayerOpacity(lyr) {
      console.log(lyr);
      const layer = lyr.layer;
      layer.setStyle({ opacity: lyr.opacity, fillOpacity: lyr.opacity });
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
  padding: 0.5rem 0.75rem;
}
</style>
