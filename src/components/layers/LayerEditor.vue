<template>
  <div>
    <b-popover :target="element"
               triggers="click"
               :show.sync="popoverShow"
               placement="right"
               ref="popover"
               @show="onShow"
               @shown="onShown"
               @hidden="onHidden">
      <template slot="title">
        <b-btn @click="onClose" class="close" aria-label="Close">
          <span class="d-inline-block" aria-hidden="true">&times;</span>
        </b-btn>
        <strong>{{ layer.name }}</strong>
      </template>
      <div>
        <b-form-group label="Outline Color" label-for="stroke"
                      horizontal class="mb-1"
                      description="Pick outline colour">
          <color-picker ref="stroke" id="outline-color-picker" v-model="strokeColors" class="w-100" @input="updateStroke"></color-picker>
        </b-form-group>
        <b-form-group label="Fill Color" label-for="fill"
                      horizontal class="mb-1"
                      description="Pick fill color">
          <color-picker ref="fill" id="fill-color-picker" v-model="fillColors" class="w-100" @input="updateFill"></color-picker>
        </b-form-group>
        <b-btn @click="onClose" size="sm" variant="danger">Reset</b-btn>
        <b-btn @click="onOk" size="sm" variant="primary">Ok</b-btn>
      </div>
    </b-popover>
  </div>
</template>
<script>
import { Compact as colorPicker } from "vue-color";

export default {
  props: ["element", "layer", "featureGroup"],
  data() {
    return {
      defaultColors: { stroke: "#3388FF", fill: "#A2C8C7" },
      strokeColors: { hex: "#009CE0" },
      fillColors: { hex: "#009CE0" },
      stroke: "#3388FF",
      fill: "#A2C8C7",
      popoverShow: false
    };
  },
  methods: {
    updateStroke($event) {
      const lyr = this.layer.layer;
      lyr.setStyle({
        stroke: true,
        color: $event.hex,
        fill: true,
        fillColor: this.fillColors.hex
      });
    },
    updateFill($event) {
      const lyr = this.layer.layer;
      lyr.setStyle({ fill: true, fillColor: $event.hex });
    },
    resetStyle() {
      const lyr = this.layer.layer;
      lyr.eachLayer(l => {
        lyr.resetStyle(l);
      });
    },
    onClose() {
      this.popoverShow = false;
      this.resetStyle();
    },
    onOk() {
      this.popoverShow = false;
    },
    onShow() {
      this.$root.$emit("bv::hide::popover");
    },
    onShown() {
      /* Called just after the popover has been shown */
      /* Transfer focus to the first input */
      this.focusRef(this.$refs.stroke);
    },
    onHidden() {
      /* Called just after the popover has finished hiding */
      /* Bring focus back to the button */
      // this.focusRef(this.$refs.button);
    },
    focusRef(ref) {
      /* Some references may be a component, functional component, or plain element */
      /* This handles that check before focusing, assuming a focus() method exists */
      /* We do this in a double nextTick to ensure components have updated & popover positioned first */
      if (ref === undefined) {
        return;
      }
      this.$nextTick(() => {
        this.$nextTick(() => {
          (ref.$el || ref).focus();
        });
      });
    }
  },
  components: {
    colorPicker
  },
  computed: {
    bgc() {
      return this.colors.hex;
    }
  }
};
</script>
<style>
.popover {
  left: -280px !important;
  top: -10px !important;
}
</style>
