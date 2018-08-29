<template>
  <div id="dataTable" v-if="show" @click.native="handleEvents" @mousewheel.native="handleEvents" @dblclick.native="handleEvents">
    <b-row>
      <b-col md="4">
        <b-form-group horizontal label="Filter" class="mb-3">
          <b-input-group>
            <b-form-input placeholder="Type to Search" :value="filter" @change="filterWMS"/>
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-table small :items="items" @row-hovered="hover" :filter="filter">
    </b-table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { filterWMSLayer } from "@/components/maps/wms";
import * as L from "leaflet";

export default {
  props: ["show", "map", "mapConfig"],
  data() {
    return {
      filter: null
    };
  },
  computed: {
    ...mapGetters({
      filteredData: "analysis/getFilteredData",
      featureDescription: "analysis/getFeatureDescription",
      query: "analysis/getQuery",
      mapLayers: "maps/getLayers"
    }),
    items() {
      let items = [];
      this.filteredData.features.forEach(feature => {
        items.push(feature.properties);
      });
      return items;
    }
  },
  methods: {
    getLayer(typename) {
      return this.mapLayers.find(layer => {
        return layer.typename === typename;
      });
    },
    handleEvents($event, type) {
      if ($event.type === "click" || $event.type === "dblclick") {
        $event.preventDefault();
      }
      $event.stopPropagation();
    },
    hover(item, index, $event) {
      // console.log(item, index, $event);
    },
    filterWMS(filter) {
      const typename = this.featureDescription.typeName;
      const layer = this.getLayer("geonode:" + typename);
      this.filter = filter;
      const query = this.getFilterQuery();
      this.$store.dispatch("analysis/saveQuery", query);
    },
    getFilterQuery() {
      let props = [];
      this.featureDescription.properties.forEach(prop => {
        props.push(prop.name);
      });
      const query = props.join(" ILIKE '%" + this.filter + "%' OR ");
      return (
        this.query + encodeURI(" AND EVENT_TYPE LIKE '%" + this.filter + "%'")
      );
    }
  }
};
</script>
<style lang="scss" scoped>
#dataTable {
  background-color: white;
  z-index: 900;
  font-size: 10pt;
  font-weight: 500;
  width: 100%;
  height: 100%;
  opacity: 0.95;
  padding: 1rem;
  color: black !important;
}
.table {
  height: 100%;
}
</style>
