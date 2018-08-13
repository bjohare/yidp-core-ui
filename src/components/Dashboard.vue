<template>
  <div class="animated fadeIn m-4">
    <div class="display-1">Yemen</div>
    <p>Integrated Data Platform Dashboard</p>
    <p>A World Bank-United Nations geospatial data and document sharing platform for users across humanitarian and developmental organizations. Learn More.</p>
  </div>
</template>

<script>
export default {
  beforeRouteEnter(to, from, next) {
    console.log("dashboard..");
    next();
  }
};
</script>
<style>
</style>
