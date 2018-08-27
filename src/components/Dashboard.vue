<template>
  <div class="dashboard animated fadeIn">
   <div class="row">
     <div class="col-9">
       <div class="row align-items-end pl-4">
         <div class="col-4">
           <img class="img-fluid" src="/assets/dashboard/yemen-page-title.png"/>
         </div>
         <div class="col-2">
           <img class="img-fluid pb-3" src="/assets/dashboard/nav-geofiles.png"/>
         </div>
         <div class="col-2">
           <img class="img-fluid pb-3" src="/assets/dashboard/nav-maps.png"/>
         </div>
         <div class="col-2">
           <img class="img-fluid pb-3" src="/assets/dashboard/nav-docsharing.png"/>
         </div>
         <div class="col-2">
           <img class="img-fluid pb-3" src="/assets/dashboard/nav-projects.png"/>
         </div>
       </div>
       <hr class="ml-3"/>
       <div class="row middle m-0">
         <div class="col-4">
           Market image here..
         </div>
         <div class="col-4">
           <img class="img-fluid" src="/assets/dashboard/slideshow-box.png"/>
         </div>
         <div class="col-4">
           <div class="description text-light p-4">
             PROJECT DESCRIPTION OR LATEST NEWS HERE
             Text here describing the project.
           </div>
         </div>
       </div>
     </div>
     <div class="col-3">
       <img class="img-fluid" src="/assets/dashboard/market-photo-right-endcap.png"/>
     </div>
   </div>
   <div class="row">
     <div class="col-6 mission text-white p-4">
       THE YEMEN INTEGRATED DATA PLATFORM is a World Bank Group - United Nations joint initiative
       to share data and documents relevant to the operations in the country, visualize datasets and
       operations using maps and other visual aids and support the coordinataion, planning, monitoring
       of operations in Yemen. The web-based geospatial platform will offer in the future social
       media analytics to support development operations.
     </div>
     <div class="col-3 text-white p-4">
       Sign up for notifications.
       Would you like to be notified whenever new materials are added to the platform? Sign up
       above to recieve email notifications, and always be up to date.
     </div>
     <div class="col-3">

     </div>
   </div>
  </div>
</template>

<script>
import {
  sidebarCssClasses,
  validBreakpoints,
  checkBreakpoint
} from "../shared/classes";
import toggleClasses from "../shared/toggle-classes";
export default {
  data() {
    return {
      display: false,
      mobile: false
    };
  },
  methods: {
    hideSideBar() {
      document.body.classList.remove("sidebar-lg-show", "sidebar-md-show");
      document.body.classList.add("sidebar-hidden");
    },
    showSideBar() {
      document.body.classList.add("sidebar-md-show");
      document.body.classList.remove("sidebar-hidden");
    }
  },
  created() {
    this.hideSideBar();
  },
  destroyed() {
    this.showSideBar();
  }
};
</script>
<style scoped>
.dashboard {
  background-color: #b19269 !important;
  margin: 0;
  height: 100% !important;
  overflow: auto;
}
.row {
  margin: 0;
  padding: 0;
}
.middle {
  background-color: black;
}
hr {
  height: 1px;
  background-color: black;
}
.mission {
  font-family: Arial, sans-serif;
  font-size: 14px;
}
.description {
  font-family: Arial, sans-serif;
  font-size: 12px;
}
.text-white {
  color: white;
}
.ethnic-background {
  background: #b19269 url("/assets/dashboard/bottompattern-tile.png");
  background-repeat: repeat-x;
  height: 30px;
}
.col-1,
.col-2,
.col-3,
.col-4,
.col-5,
.col-6,
.col-7,
.col-8,
.col-9,
.col-10,
.col-11,
.col-12 {
  padding: 0;
  margin: 0;
}
</style>
