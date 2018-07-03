import { Style, Stroke, Circle, Fill } from "ol/style";

const styleCache = {};
function pointStyle(feature) {
  // const size = feature.get("features").length;
  let style = styleCache["Point"];
  if (!style) {
    style = new Style({
      image: new Circle({
        radius: 15,
        stroke: new Stroke({
          color: "white",
          width: 2
        }),
        fill: new Fill({
          color: "red"
        })
      })
      // text: new Text({
      //   text: "point",
      //   fill: new Fill({
      //     color: "#fff"
      //   })
      // })
    });
    styleCache["Point"] = style;
  }
  return [style];
}

function polyStyle(feature) {
  let style = styleCache["Poly"];
  if (!style) {
    style = new Style({
      stroke: new Stroke({
        color: "blue",
        width: 2
      })
      // fill: new Fill({
      //   color: "blue",
      //   opacity: 0.8
      // }),
      // text: new Text({
      //   text: "A feature",
      //   fill: new Fill({
      //     color: "#fff"
      //   })
      // })
    });
    styleCache["Poly"] = style;
  }
  return [style];
}

export const styleMap = {
  Point: pointStyle,
  Poly: polyStyle
};
