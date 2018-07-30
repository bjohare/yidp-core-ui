import axios from "axios";
import { highlightStyle } from "@/components/map/styles";
import { DomEvent } from "leaflet";

export const showGetFeatureInfo = async url => {
  console.log(url);
  const response = await axios.get(url);
  this.info = response.data;
  throw new DOMException("debug this");
};

export const showOverlay = (vm, feature, layer) => {
  layer.on("click", function(e) {
    DomEvent.stopPropagation(e);
    let style = null;
    if (!layer.defaultOptions.style) {
      style = Object.assign({}, layer.options);
    } else {
      style = Object.assign({}, layer.defaultOptions.style);
    }
    layer.setStyle(highlightStyle);
    vm.$root.$emit("feature-selected", {
      feature: feature,
      layer: layer,
      style: style
    });
  });
};
