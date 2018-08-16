<template>
<div class="filter">
  <b-card>
    <b-row>
      <b-col md="4">
        <b-form-group horizontal label="Filter by Title:" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" @change="updateFilter"/>
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''; updateFilter()">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group horizontal label="Filter by Sector/Cluster:" class="mb-0">
          <b-input-group>
            <b-form-select v-model="selected" :options="options" class="mb-3" @input="filterCategory"/>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col>
            <b-btn  variant="primary" @click="resetFilters">Reset filters</b-btn>
      </b-col>
      <!-- <b-col md="3">
        <b-form-group horizontal label="Sort by:" class="mb-0">
          <b-input-group>
            <b-form-select v-model="selected" :options="options" class="mb-3" />
          </b-input-group>
        </b-form-group>
      </b-col> -->
    </b-row>
  </b-card>
</div>
</template>
<script>
export default {
  data() {
    return {
      selected: null,
      options: [],
      filter: null
    };
  },
  methods: {
    updateFilter() {
      this.$emit("change", this.filter);
    },
    filterCategory() {
      this.$emit("selected", this.selected);
    },
    resetFilters() {
      this.selected = null;
      this.filter = "";
      this.$emit("reset");
    },
    async loadCategories() {
      const _vm = this;
      this.options.push({
        value: null,
        text: "Please select a Sector/Cluster"
      });
      const categories = await this.$store.dispatch(
        "geonode/fetchGeonodeCategories",
        _vm
      );
      for (let idx in categories) {
        let category = categories[idx];
        let opt = {
          value: category.identifier,
          text: category.gn_description_en
        };
        this.options.push(opt);
      }
    }
  },
  created() {
    this.loadCategories();
  }
};
</script>
<style lang="scss" scoped>
.filter {
  max-width: 95%;
  min-width: 95%;
  margin: 0 auto;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
legend {
  font-weight: 700 !important;
}
</style>
