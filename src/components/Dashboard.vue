<template>
  <div class="dashboard animated fadeIn">
    <div class="row align-items-center pl-4">
      <div class="col-3">
        <img class="img-fluid mb-3" src="/assets/dashboard/yemen-page-title.png"/>
      </div>
      <div class="col-6 flex-row">
        <div class="row">
          <div class="col-3">
            <router-link to="/geodata">
            <img class="link img-fluid" src="/assets/dashboard/nav-geofiles.png"/>
          </router-link>
          </div>
          <div class="col-3">
            <router-link to="/map/default">
            <img class="link img-fluid" src="/assets/dashboard/nav-maps.png"/>
            </router-link>
          </div>
          <div class="col-3">
            <router-link to="/documents">
            <img class="link img-fluid" src="/assets/dashboard/nav-docsharing.png"/>
            </router-link>
          </div>
          <div class="col-3">
            <router-link to="/projects">
              <img class="link img-fluid" src="/assets/dashboard/nav-projects.png"/>
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-3">
        <img class="img-fluid" src="/assets/dashboard/market-photo-right-top.png"/>
      </div>
    </div>
    <div class="row middle align-items-start">
      <div class="col-3">
        <img class="img-fluid" src="/assets/dashboard/slideshow-left-image.png"/>
      </div>
      <div class="col-3">
        <b-carousel id="slideshow"
        controls indicators
        style="text-shadow: 1px 1px 2px #333;" :interval="4000">
          <b-carousel-slide
            text="Nulla vitae elit libero, a pharetra augue mollis interdum.">
            <img slot="img" class="d-block img-fluid w-100"
             src="/assets/dashboard/slideshow-box.png" alt="image slot">
          </b-carousel-slide>
        </b-carousel>
      </div>
      <div class="col-3">
        <div class="description text-light p-3">
          PROJECT DESCRIPTION OR LATEST NEWS HERE
          Text here describing the project.
        </div>
      </div>
      <div class="col-3">
      <img class="img-fluid" src="/assets/dashboard/market-photo-right-bottom.png"/>
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
      // document.body.classList.remove("aside-menu-show");
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
img.link {
  -webkit-box-shadow: 5px 5px 5px 0px rgb(117, 90, 49);
  -moz-box-shadow: 5px 5px 5px 0px rgb(117, 90, 49);
  box-shadow: 5px 5px 5px 0px rgb(117, 90, 49);
}
img.link:hover {
  box-shadow: 8px 8px 8px 0px rgb(117, 90, 49);
}
</style>
