<template>
  <b-alert ref="info" id="featureInfo" v-if="showPopover" dismissible show class="alert-light"
    @dismissed="dismissed" @click.native="handleEvents" @mousewheel.native="handleEvents" @dblclick.native="handleEvents">
    <div class="h4 mr-4"><strong>Selected Features</strong></div>
    <div class="mt-2 mb-2" v-if="features.length > 1">
        <button class="btn btn-link" @click="prev()" :disabled="pageNum === 0"><i class="fa fa-chevron-left fa-lg"></i></button>
          {{ pageNum + 1}} of {{ features.length }}
        <button class="btn btn-link" @click="next()" :disabled="pageNum >= features.length -1"><i class="fa fa-chevron-right fa-lg"></i></button>
      </div>
    <div v-for="(feature, index) in paginatedData" :key="index" class="mb-2">
      <div class="med"><strong>Layer: </strong>{{ feature.name }}</div>
      <ul class="list-group">
        <li class="list-item" v-for="(item, key) in getProperties(feature)" :key="key">
          <span class="small"><strong>{{ key }}: </strong></span><span>{{ item }}</span>
        </li>
      </ul>
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
      console.log(feature, this.showPopover);
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
  overflow: scroll;
  color: black !important;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2);
}
ul.list-group {
  list-style-type: none;
}
</style>
