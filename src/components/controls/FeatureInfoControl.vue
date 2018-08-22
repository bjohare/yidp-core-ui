<template>
  <b-alert ref="info" id="featureInfo" v-if="showPopover" dismissible show class="alert-light"
    @dismissed="dismissed" @click.native="handleEvents" @mousewheel.native="handleEvents" @dblclick.native="handleEvents">
    <!-- <div class="h4 mr-4"><strong>Selected Features</strong></div> -->
    <div class="mt-2 mb-2" v-if="features.length > 1">
      <button class="btn btn-link" @click="prev()" :disabled="pageNum === 0"><i class="fa fa-chevron-left fa-lg"></i></button>
        {{ pageNum + 1}} of {{ features.length }}
      <button class="btn btn-link" @click="next()" :disabled="pageNum >= features.length -1"><i class="fa fa-chevron-right fa-lg"></i></button>
    </div>
    <div v-else class="mb-3"></div>
    <div v-for="(feature, index) in paginatedData" :key="index" class="mb-2">
      <h5>{{ feature.title }}</h5>
      <b-table striped hover small fixed stacked bordered responsive :items="[getProperties(feature)]"></b-table>
    </div>
  </b-alert>
</template>

<script>
export default {
  props: ["features", "showPopover"],
  data() {
    return {
      pageNum: 0,
      size: 1
    };
  },
  watch: {
    showPopover() {
      this.pageNum = 0;
    }
  },
  computed: {
    paginatedData() {
      const start = this.pageNum * this.size;
      const end = start + this.size;
      return this.features.slice(start, end);
    }
  },
  methods: {
    handleEvents($event, type) {
      if ($event.type === "click" || $event.type === "dblclick") {
        $event.preventDefault();
      }
      $event.stopPropagation();
    },
    next() {
      this.pageNum++;
    },
    prev() {
      this.pageNum--;
    },
    getProperties(feature) {
      if (feature.featureInfo) {
        const propertyNames = feature.featureInfo.propertyNames;
        let props = {};
        for (var prop in propertyNames) {
          let propName = propertyNames[prop];
          props[propName] = feature.properties[prop];
        }
        return props;
      }
      return feature.properties;
    },
    dismissed() {
      this.pageNum = 0;
      this.$emit("dismissed");
    }
  }
};
</script>

<style scoped>
#featureInfo {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 900;
  font-size: 10pt;
  font-weight: 500;
  height: 100%;
  opacity: 0.95;
  padding: 1rem;
  overflow: auto;
  color: black !important;
  box-shadow: 0 0 0 6px rgba(0, 0, 0, 0.2);
  /* max-width: 300px; */
}
ul.list-group {
  list-style-type: none;
}
.alert {
  border-radius: 0px;
}
</style>
