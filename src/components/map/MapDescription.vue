<template>
  <div class="p-3">
    <span class="h3">Map Details</span>
    <div class="message" v-if="show">
      <div class="py-3 pb-5 mr-3 float-left">
        <h4>{{ map.title }}</h4>
        <img style="border: 1px solid grey" class="mb-2" :src="map.thumbnail_url"/>
        <span>{{ map.abstract }}</span>
        <hr>
        <span><strong>Category:</strong> {{ map.category.gn_description }}</span>&nbsp;<i :class="'fa ' + map.category.fa_class + ' fa-lg'"></i><br>
        <span><strong>Category Description: </strong>{{ map.category.description }}</span><br>
        <hr>
        <span><strong>{{ map.date_type | capitalize }}: </strong>{{ map.date | format-date }}</span><br>
        <span><strong>Last Modified: </strong> {{ map.last_modified | format-date }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["map", "show"]
};
</script>
<style>
</style>
