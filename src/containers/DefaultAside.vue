<template>
  <b-tabs>
    <b-tab>
      <template slot="title">
        <i class='icon-layers'></i>
      </template>
      <app-layer-switcher></app-layer-switcher>
    </b-tab>
    <b-tab>
      <template slot="title">
        <i class='fa fa-info fa-lg'></i>
      </template>
      <div class="p-3">
        <div class="message">
          <div class="py-3 pb-5 mr-3 float-left">
            <div class="avatar">
              <img src="assets/img/avatars/7.jpg" class="img-avatar" alt="admin@bootstrapmaster.com">
              <b-badge variant="success" class="avatar-status"></b-badge>
            </div>
          </div>
          <div>
            <small class="text-muted">Lukasz Holeczek</small>
            <small class="text-muted float-right mt-1">1:52 PM</small>
          </div>
          <div class="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
          <small class="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
        <hr>
        <div class="message">
          <div class="py-3 pb-5 mr-3 float-left">
            <div class="avatar">
              <img src="assets/img/avatars/7.jpg" class="img-avatar" alt="admin@bootstrapmaster.com">
              <b-badge variant="danger" class="avatar-status"></b-badge>
            </div>
          </div>
          <div>
            <small class="text-muted">Lukasz Holeczek</small>
            <small class="text-muted float-right mt-1">1:52 PM</small>
          </div>
          <div class="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
          <small class="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
        <hr>
        <div class="message">
          <div class="py-3 pb-5 mr-3 float-left">
            <div class="avatar">
              <img src="assets/img/avatars/7.jpg" class="img-avatar" alt="admin@bootstrapmaster.com">
              <b-badge variant="info" class="avatar-status"></b-badge>
            </div>
          </div>
          <div>
            <small class="text-muted">Lukasz Holeczek</small>
            <small class="text-muted float-right mt-1">1:52 PM</small>
          </div>
          <div class="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
          <small class="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
        <hr>
        <div class="message">
          <div class="py-3 pb-5 mr-3 float-left">
            <div class="avatar">
              <img src="assets/img/avatars/7.jpg" class="img-avatar" alt="admin@bootstrapmaster.com">
              <b-badge variant="warning" class="avatar-status"></b-badge>
            </div>
          </div>
          <div>
            <small class="text-muted">Lukasz Holeczek</small>
            <small class="text-muted float-right mt-1">1:52 PM</small>
          </div>
          <div class="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
          <small class="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
        <hr>
        <div class="message">
          <div class="py-3 pb-5 mr-3 float-left">
            <div class="avatar">
              <img src="assets/img/avatars/7.jpg" class="img-avatar" alt="admin@bootstrapmaster.com">
              <b-badge variant="dark" class="avatar-status"></b-badge>
            </div>
          </div>
          <div>
            <small class="text-muted">Lukasz Holeczek</small>
            <small class="text-muted float-right mt-1">1:52 PM</small>
          </div>
          <div class="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
          <small class="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</small>
        </div>
      </div>
    </b-tab>
    <b-tab>
      <template slot="title">
        <i class='icon-settings'></i>
      </template>
      <div class="p-3">
        <h6>Settings</h6>
        <div class="aside-options">
          <div class="clearfix mt-4">
            <small><b>Option 1</b></small>
            <c-switch color="success" label variant="pill" size="sm" class="float-right" checked />
          </div>
          <div>
            <small class="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</small>
          </div>
        </div>
        <div class="aside-options">
          <div class="clearfix mt-3">
            <small><b>Option 2</b></small>
            <c-switch color="success" label variant="pill" size="sm" class="float-right" />
          </div>
          <div>
            <small class="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</small>
          </div>
        </div>
        <div class="aside-options">
          <div class="clearfix mt-3">
            <small><b>Option 3</b></small>
            <c-switch color="success" label variant="pill" size="sm" class="float-right" disabled defaultChecked/>
          </div>
          <div>
            <small class="text-muted">Disabled option.</small>
          </div>
        </div>
        <div class="aside-options">
          <div class="clearfix mt-3">
            <small><b>Option 4</b></small>
            <c-switch color="success" label variant="pill" size="sm" class="float-right" checked />
          </div>
        </div>
        <hr>
        <h6>System Utilization</h6>
        <div class="text-uppercase mb-1 mt-4">
          <small><b>CPU Usage</b></small>
        </div>
        <b-progress height={} class="progress-xs" variant="info" :value="25"></b-progress>
        <small class="text-muted">348 Processes. 1/4 Cores.</small>
        <div class="text-uppercase mb-1 mt-2">
          <small><b>Memory Usage</b></small>
        </div>
        <b-progress height={} class="progress-xs" variant="warning" :value="70"></b-progress>
        <small class="text-muted">11444GB/16384MB</small>
        <div class="text-uppercase mb-1 mt-2">
          <small><b>SSD 1 Usage</b></small>
        </div>
        <b-progress height={} class="progress-xs" variant="danger" :value="95"></b-progress>
        <small class="text-muted">243GB/256GB</small>
        <div class="text-uppercase mb-1 mt-2">
          <small><b>SSD 2 Usage</b></small>
        </div>
        <b-progress height={} class="progress-xs" variant="success" :value="10"></b-progress>
        <small class="text-muted">25GB/256GB</small>
      </div>
    </b-tab>
  </b-tabs>
</template>

<script>
import { Switch as cSwitch } from "@coreui/vue";
import appLayerSwitcher from "@/components/layers/LayerSwitcher.vue";
export default {
  name: "DefaultAside",
  data() {
    return {
      showLayersTab: true
    };
  },
  components: {
    cSwitch,
    appLayerSwitcher
  }
};
</script>
