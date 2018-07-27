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
        <strong>{{ layer.name }}</strong>
      </template>
      <div>
        <b-form-group label="Outline Color" label-for="stroke"
                      horizontal class="mb-1"
                      description="Pick outline colour">
          <color-picker ref="stroke" id="outline-color-picker" v-model="colors.strokeColors" class="w-100" @input="updateStroke"></color-picker>
        </b-form-group>
        <b-form-group label="Fill Color" label-for="fill"
                      horizontal class="mb-1"
                      description="Pick fill color">
          <color-picker ref="fill" id="fill-color-picker" v-model="colors.fillColors" class="w-100" @input="updateFill"></color-picker>
        </b-form-group>
        <div class="d-inline-block float-right mb-3 mr-2">
          <b-btn @click="reset" size="sm" variant="danger" class="">Reset</b-btn>
          <b-btn @click="onOk" size="sm" variant="primary" class="">Ok</b-btn>
        </div>
      </div>
    </b-popover>
  </div>
</template>
<script>
import { Compact as colorPicker } from "vue-color";

let styleDefaults = function() {
  return {
    strokeColors: { hex: "#009CE0" },
    fillColors: { hex: "#009CE0" }
  };
};

export default {
  props: ["element", "layer", "featureGroup"],
  data() {
    return {
      colors: styleDefaults(),
      popoverShow: false
    };
  },
  methods: {
    updateStroke($event) {
      this.layer.style.color = $event.hex;
      this.layer.style.fillColor = this.colors.fillColors.hex;
      this.layer.layer.setStyle(this.layer.style);
      this.$store.dispatch("usermaps/saveLayerState", this.layer);
    },
    updateFill($event) {
      this.layer.style.color = this.colors.strokeColors.hex;
      this.layer.style.fillColor = $event.hex;
      this.layer.layer.setStyle(this.layer.style);
      this.$store.dispatch("usermaps/saveLayerState", this.layer);
    },
    resetStyle() {
      Object.assign(this.$data.colors, styleDefaults());
      this.layer.style.color = this.colors.strokeColors.hex;
      this.layer.style.fillColor = this.colors.fillColors.hex;
      this.layer.layer.setStyle(this.layer.style);
      this.$store.dispatch("usermaps/saveLayerState", this.layer);
    },
    reset() {
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
