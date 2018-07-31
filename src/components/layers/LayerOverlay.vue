<template>
  <div id="featureInfo" v-if="showPopover">
    <div class="h4"><strong>Selected Feature</strong></div>
    <ul class="list-group">
      <li class="list-item" v-for="(item, key) in info.feature.properties" :key="key">
        <span><strong>{{ key }}: </strong></span><span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["info", "showPopover"]
};
</script>

<style scoped>
#featureInfo {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 900;
  background-color: white;
  color: #2f353a;
  opacity: 0.8;
  padding: 1rem;
  font-size: 11pt;
  height: 100%;
}
#featureInfo > ul {
  list-style-type: none;
}
</style>
