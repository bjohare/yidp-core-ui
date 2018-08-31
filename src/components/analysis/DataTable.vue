<template>
  <div id="dataTable" v-if="show" @click.native="handleEvents" @mousewheel.native="handleEvents" @dblclick.native="handleEvents">
    <b-row>
      <b-col md="4">
        <b-form-group horizontal label="Filter by:" class="h5">
          <b-form-select class="" v-model="filterAttribute">
            <option v-for="(attribute, index) in attributes" :key="index" :value="attribute.value">
              {{ attribute.text }}
            </option>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="4">
        <b-form-group class="">
          <b-form-select class="" v-model="filterValue">
            <option v-for="(value, index) in uniqueValues" :key="index" :value="value.value">
              {{ value.text }}
            </option>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col md="4">
        <b-button variant="danger" :disabled="filterAttribute === null && filterValue === null" @click="clearFilter">Clear Filters</b-button>
        <div id="filteredData" class="alert alert-info w-50 float-right fixed">
          Found {{ items.length }} features.
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-table small hover :items="items" :per-page="perPage" :current-page="currentPage">
      </b-table>
    </b-row>
    <b-row v-if="totalRows > perPage">
      <b-col md="6" class="mb-2">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="m-2" />
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import * as _ from "lodash";

export default {
  props: ["show", "map", "mapConfig"],
  data() {
    return {
      filter: null,
      perPage: 20,
      currentPage: 1,
      filterAttribute: null,
      filterValue: null,
      uniqueValues: null
    };
  },
  watch: {
    filterAttribute(attribute) {
      this.getUniqueValues();
    },
    filterValue() {
      if (this.filterAttribute !== null && this.filterValue !== null) {
        this.filterWMS();
      }
    }
  },
  computed: {
    ...mapGetters({
      filteredData: "analysis/getFilteredData",
      featureDescription: "analysis/getFeatureDescription",
      dataLayer: "analysis/getDataLayer",
      query: "analysis/getQuery",
      mapLayers: "maps/getLayers"
    }),
    items() {
      const featureInfo = this.getFeatureInfo();
      if (featureInfo) {
        let fields = featureInfo.fields;
        let propertyNames = featureInfo.propertyNames;
        let items = [];
        this.filteredData.features.forEach(feature => {
          let properties = this.getProperties(feature, fields, propertyNames);
          items.push(properties);
        });
        return items;
      }
      let items = [];
      this.filteredData.features.forEach(feature => {
        items.push(feature.properties);
      });
      return items;
    },
    attributes() {
      let attributes = [];
      if (this.filteredData) {
        const featureInfo = this.getFeatureInfo();
        if (featureInfo) {
          const propNames = featureInfo.propertyNames;
          for (let name in propNames) {
            let opt = { value: name, text: propNames[name] };
            attributes.push(opt);
          }
          return attributes;
        }
        const props = this.filteredData.features[0].properties;
        for (let name in props) {
          let opt = { value: name, text: name };
          attributes.push(opt);
        }
      }
      return attributes;
    },
    totalRows() {
      return this.items.length;
    }
  },
  methods: {
    getUniqueValues() {
      let values = [];
      this.filteredData.features.forEach(feature => {
        let props = feature.properties;
        let val = props[this.filterAttribute];
        values.push(val);
      });
      const uniqueValues = _.uniq(values);
      let opts = [];
      for (let value in uniqueValues) {
        let opt = { value: uniqueValues[value], text: uniqueValues[value] };
        opts.push(opt);
      }
      this.uniqueValues = opts;
    },
    getFeatureInfo() {
      const layer = this.getLayer(this.dataLayer);
      if (
        layer !== undefined &&
        layer.featureInfo !== undefined &&
        layer.featureInfo.hasOwnProperty("getFeatureInfo")
      ) {
        return layer.featureInfo.getFeatureInfo;
      }
      return null;
    },
    getProperties(feature, fields, propertyNames) {
      let props = {};
      for (var prop in fields) {
        let fieldName = fields[prop];
        let propName = propertyNames[fieldName];
        props[propName] = feature.properties[fieldName];
      }
      return props;
    },
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
    filterWMS() {
      const query = this.getFilterQuery();
      this.$store.dispatch("analysis/saveQuery", query);
      this.$root.$emit("filter-datatable");
    },
    getFilterQuery() {
      if (this.filterAttribute === null && this.filterValue === null) {
        return null;
      }
      const query = this.filterAttribute + " = " + "'" + this.filterValue + "'";
      return encodeURI(query);
    },
    clearFilter() {
      this.filterValue = null;
      this.filterAttribute = null;
      this.$store.dispatch("analysis/saveQuery", null);
      this.$root.$emit("clear-datatable-filter");
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
  padding: 1rem;
  color: black !important;
}
.table {
  height: 100%;
}
</style>
