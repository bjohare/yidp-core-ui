import Vue from "vue";
import Router from "vue-router";

// Containers
import DefaultContainer from "@/containers/DefaultContainer";

// Views
import Dashboard from "@/components/Dashboard.vue";
import MapView from "@/components/maps/MapView.vue";
import Projects from "@/components/projects/Projects.vue";
import Project from "@/components/projects/Project.vue";
import Documents from "@/components/documents/Documents.vue";
import GeoData from "@/components/geodata/GeoData.vue";
import GeoDataDetail from "@/components/geodata/GeoDataDetail.vue";
import Login from "@/views/pages/Login";
import Logout from "@/views/pages/Logout";

Vue.use(Router);

export default new Router({
  mode: "history",
  linkActiveClass: "open active",
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      name: "Home",
      component: DefaultContainer,
      children: [
        {
          path: "/dashboard",
          name: "Dashboard",
          component: Dashboard
        },
        {
          path: "/map/:id",
          name: "Map",
          component: MapView,
          props: true
        },
        {
          path: "/projects",
          name: "Projects",
          component: Projects
        },
        {
          path: "/project/:id",
          name: "Project",
          component: Project
        },
        {
          path: "/documents",
          name: "Documents",
          component: Documents
        },
        {
          path: "/geodata",
          name: "GeoData",
          component: GeoData
        },
        {
          path: "/geodata/:id",
          name: "Layer",
          component: GeoDataDetail
        }
      ]
    },
    {
      path: "/account",
      redirect: "/pages/404",
      name: "Account",
      component: {
        render(c) {
          return c("router-view");
        }
      },
      children: [
        // {
        //   path: "404",
        //   name: "Page404",
        //   component: Page404
        // },
        // {
        //   path: "500",
        //   name: "Page500",
        //   component: Page500
        // },
        {
          path: "login",
          name: "Login",
          component: Login
        },
        {
          path: "logout",
          name: "Logout",
          component: Logout
        }
        // {
        //   path: "register",
        //   name: "Register",
        //   component: Register
        // }
      ]
    }
  ]
});
