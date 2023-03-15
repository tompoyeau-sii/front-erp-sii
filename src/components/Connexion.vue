<template>
  <div class="container p-5">
    <v-card class="p-4 ma-auto m-5" elevation="0" max-width="800">
      <v-row justify="center">
        <div class="text-h3 mt-5">SII LE MANS | PIXOU </div>
      </v-row>
      <v-card-text>
        <v-form v-on:submit.prevent="formConnect">
          <v-row>
            <v-col cols="12">
              <label class="mb-2">Identifiant</label>
              <v-text-field
                variant="solo"
                v-model="form.username"
                type="email"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <label class="mb-2">Mot de passe</label>
              <v-text-field
                variant="solo"
                v-model="form.password"
                type="password"
              ></v-text-field>
              <v-alert
                v-if="error != ''"
                class="mb-5"
                icon="mdi-cancel"
                type="error"
                :text="error"
                m-5
              ></v-alert>
            </v-col>
          </v-row>
          <v-row justify="center">
              <v-btn rounded="lg" type="submit"> Connexion </v-btn>
              
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import router from "@/router";
import axios from "axios";
export default {
  name: "connexion",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      ErrorState: false,
      error: "",
      snackbar: false,
    };
  },
  methods: {
    formConnect: function () {
      if (this.form.username !== "" || this.form.password !== "") {
        axios
          .post("http://localhost:8080/api/login", {
            username: this.form.username,
            password: this.form.password,
          })
          .then((response) => {
            router.push("/dashboard");
            console.log("Connecté");
            //utiliser un interceptor pour le jwt
          });
      } else {
        (this.ErrorState = true), (this.error = "Erreur d'identifiant");
        console.log(this.error);
      }
    },
  },
};
</script>
<style scoped>
/* .v-navigation-drawer {
  display: none;
} */
.container {
  background: transparent;
}
.v-card {
  background: linear-gradient(2453deg, #e84654 0%, #75519b 100%) !important;
  color: white;
}

label {
  font-style: normal;
  font-weight: 700;
}

.text-h3 {
  font-weight: 700;
}

.v-btn__content {
  background: linear-gradient(
    90deg,
    rgba(117, 81, 155, 1) 0%,
    rgba(232, 70, 84, 1) 100%
  ) !important;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  font-weight: 700;
}

.v-main {
  background: linear-gradient(115deg, #e84654 0%, #75519b 100%) !important;
}
</style>