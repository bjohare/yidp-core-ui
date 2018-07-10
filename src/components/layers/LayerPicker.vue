<template>
  <b-container>
      <b-modal id="layerPicker" v-bind="modal" @ok="addLayers">
        Select a category below..
          <b-row v-for="(sub, index) in categoryGrid" :key="index">
              <b-col v-for="(category, idx) in sub" :key="idx" class="m-1">
                  <b-list-group-item button @click="selectLayer(category, $event)">
                    <i class="fa fa-lg" :class="category.fa_class"></i><span class="ml-3">{{ category.gn_description }}</span>
                    <br/><h5><b-badge variant="success" pill>{{ category.layers_count}} Layers</b-badge></h5>
                    <!-- <b-form-checkbox type="checkbox" name="layer" :value="category.id" class="mr-2 mt-10"/> -->
                  </b-list-group-item>
              </b-col>
          </b-row>
      </b-modal>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      modal: {
        title: "Add Overlays",
        centered: true,
        size: "lg",
        headerBgVariant: "info",
        lazy: true
      },
      categories: [],
      selectedLayers: new Set([])
    };
  },
  computed: {
    categoryGrid() {
      const grid = [];
      let sub = null;
      this.categories.forEach((category, index) => {
        if (index % 5 === 0) {
          sub = [];
          grid.push(sub);
        }
        sub.push(category);
      });
      console.log(grid);
      return grid;
    }
  },
  methods: {
    async fetchGeonodeCategories() {
      const categories = await this.$store.dispatch(
        "map/fetchGeonodeCategories",
        this
      );
      this.categories = categories;
    },
    selectLayer(category, event) {
      if (!this.selectedLayers.has(category)) {
        this.selectedLayers.add(category);
      } else {
        this.selectedLayers.delete(category);
      }
      event.currentTarget.classList.toggle("active");
    },
    async addLayers() {
      let selected = [];
      this.selectedLayers.forEach(value => {
        selected.push(value);
      });
      this.$emit("selected", selected);
    }
  },
  created() {
    this.fetchGeonodeCategories();
  }
};
</script>

<style>
@media (min-width: 992px) {
  .modal-lg {
    max-width: 1024px !important;
  }
}
</style>
