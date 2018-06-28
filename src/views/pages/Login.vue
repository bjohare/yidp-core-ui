<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <h2>Login</h2>
                <div class="alert alert-danger" v-if="errors.length">
                  <ul>
                    <li v-for="error in errors" :key="error">{{ error }}</li>
                  </ul>
                </div>
                <p class="text-muted">Sign In to your account</p>
                <b-input-group class="mb-3">
                  <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                  <input type="text" class="form-control" placeholder="Username" v-model="username" @focus="clearErrors">
                </b-input-group>
                <b-input-group class="mb-4">
                  <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                  <input type="password" class="form-control"
                        placeholder="Password" v-model="password"
                        @focus="clearErrors" @enter="login">
                </b-input-group>
                <b-row>
                  <b-col cols="6">
                    <b-button variant="primary" class="px-4" @click="login">Login</b-button>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <b-button variant="link" class="px-0" href="http://yidp-geonode.geoweb.io/account/password/reset/">Forgot password?</b-button>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
            <!-- <b-card no-body class="text-white bg-primary py-5 d-md-down-none" style="width:44%">
              <b-card-body class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <b-button variant="primary" class="active mt-3">Register Now!</b-button>
                </div>
              </b-card-body>
            </b-card> -->
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      errors: []
    };
  },
  methods: {
    async login() {
      if (this.username && this.password) {
        try {
          await this.$store.dispatch("authentication/login", {
            username: this.username,
            password: this.password
          });
          this.$router.replace(this.$route.query.redirect || "/map");
        } catch (error) {
          console.log(error);
          this.errors.push("Invalid username or password.");
        }
      } else {
        this.errors = [];
        if (!this.username) {
          this.errors.push("Username required");
        }
        if (!this.password) {
          this.errors.push("Password required");
        }
      }
    },
    clearErrors() {
      this.errors = [];
    }
  }
};
</script>
