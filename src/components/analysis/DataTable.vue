<template>
  <div id="dataTable" v-if="show" @click.native="handleEvents" @mousewheel.native="handleEvents" @dblclick.native="handleEvents">
    <b-row>
      <b-col md="4">
        <b-form-group horizontal label="Filter" class="mb-3">
          <b-input-group>
            <b-form-input placeholder="Type to Search" :value="filter" @change="filterWMS"/>
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="clearFilter">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="8">
        <div id="filteredData" class="alert alert-info w-50 float-right">
          Found {{ items.length }} features.
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-table small :items="items" @row-hovered="hover" :filter="filter"
            :per-page="perPage" :current-page="currentPage">
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

export default {
  props: ["show", "map", "mapConfig"],
  data() {
    return {
      filter: null,
      perPage: 20,
      currentPage: 1
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
    },
    totalRows() {
      return this.items.length;
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
      this.filter = filter;
      const query = this.getFilterQuery();
      this.$store.dispatch("analysis/saveQuery", query);
      this.$root.$emit("filter-datatable");
    },
    getFilterQuery() {
      let props = [];
      this.featureDescription.properties.forEach(prop => {
        props.push(prop.name);
      });
      // const query = props.join(" ILIKE '%" + this.filter + "%' OR ");
      // return encodeURI(query);
      return encodeURI(" Main_Needs ILIKE '%" + this.filter + "%'");
    },
    clearFilter() {
      this.filter = "";
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
