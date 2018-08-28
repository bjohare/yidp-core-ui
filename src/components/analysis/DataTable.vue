<template>
  <div id="dataTable" v-if="show" @click.native="handleEvents" @mousewheel.native="handleEvents" @dblclick.native="handleEvents">
    <b-row>
      <b-col md="4">
        <b-form-group horizontal label="Filter" class="mb-3">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-table small :items="items"></b-table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: ["show"],
  data() {
    return {
      filter: null
    };
  },
  computed: {
    ...mapGetters({
      filteredData: "analysis/getFilteredData"
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
    handleEvents($event, type) {
      if ($event.type === "click" || $event.type === "dblclick") {
        $event.preventDefault();
      }
      $event.stopPropagation();
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
