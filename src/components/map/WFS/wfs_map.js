import { Map, View, Overlay } from "ol";
import { transformExtent, fromLonLat } from "ol/proj";
import { Tile as TileLayer, Vector } from "ol/layer";
import { Vector as VectorSource, Cluster, XYZ } from "ol/source";
import { GeoJSON } from "ol/format";
import { bbox as bboxStrategy } from "ol/loadingstrategy";
import { Select } from "ol/interaction";

import { styleMap } from "./styles";

import { geoserverAxios } from "../../../store/axios";
// import { geonodeEndpoints } from "../../store/endpoints";

export const initMap = vm => {
  const view = new View({
    extent: transformExtent(vm.maxExtent, "EPSG:4326", "EPSG:3857"),
    center: fromLonLat(vm.center),
    zoom: vm.zoom,
    minZoom: vm.minZoom
  });
  vm.map = new Map({
    target: "map",
    layers: [
      new TileLayer({
        source: new XYZ({
          url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        })
      })
    ],
    view: view
  });
};

export const vectorLoader = async function(
  layer,
  extent,
  resolution,
  projection
) {
  var url =
    "http://yidp-geonode.geoweb.io/geoserver/geonode/ows?service=WFS&" +
    "version=1.1.0&request=GetFeature&typeName=" +
    layer +
    "&outputFormat=application/json&srsname=EPSG:3857&" +
    "bbox=" +
    extent.join(",") +
    ",EPSG:3857";
  var resp = await geoserverAxios.get(url);
  return resp.data;
};

export const fetchGeonodeLayers = async vm => {
  return vm.$store.dispatch("map/fetchGeonodeLayers", vm);
};

export const loadVectors = async vm => {
  const vectorSources = [];
  const layers = await fetchGeonodeLayers(vm);
  for (let layer in layers) {
    let layerName = layers[layer].typename;
    let featureType = layers[layer].gtype;
    let source = null;
    if (featureType !== "Point") {
      source = new VectorSource({
        format: new GeoJSON(),
        loader: async function(extent, resolution, projection) {
          const data = await vectorLoader(
            layerName,
            extent,
            resolution,
            projection
          );
          const features = this.getFormat().readFeatures(data);
          this.addFeatures(features);
        },
        projection: "EPSG:3857",
        strategy: bboxStrategy
      });
    } else {
      source = new Cluster({
        distance: 40,
        source: new VectorSource({
          format: new GeoJSON(),
          loader: async function(extent, resolution, projection) {
            const data = await vectorLoader(
              layerName,
              extent,
              resolution,
              projection
            );
            const features = this.getFormat().readFeatures(data);
            this.addFeatures(features);
          },
          projection: "EPSG:3857",
          strategy: bboxStrategy
        })
      });
    }
    vectorSources.push(source);
  }
  const setStyle = function(feature) {
    let type = feature.getGeometry().getType();
    if (type === "Point") {
      return styleMap["Point"](feature);
    }
    if (type === "MultiPolygon" || type === "Polygon") {
      return styleMap["Poly"](feature);
    }
  };

  const vectors = [];

  for (let source in vectorSources) {
    let vector = new Vector({
      source: vectorSources[source],
      style: setStyle
    });
    vectors.push(vector);
    vm.map.addLayer(vector);
  }

  const featureInfo = new Overlay({
    id: "featureInfoOverlay",
    element: document.getElementById("featureInfo")
  });
  vm.map.addOverlay(featureInfo);

  var select = new Select({ layers: vectors });

  vm.map.addInteraction(select);

  var selectedFeatures = select.getFeatures();
  selectedFeatures.on("add", function(event) {
    var feature = event.target.item(0);
    console.log(feature);
  });

  // vm.map.on("moveend", event => {
  //   const position = {
  //     zoom: event.map.getView().getZoom(),
  //     center: toLonLat(event.map.getView().getCenter())
  //   };
  //   vm.$store.dispatch("map/saveMapPosition", position);
  // });
};
