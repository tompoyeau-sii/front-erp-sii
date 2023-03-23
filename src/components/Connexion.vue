<template>
  <div class="fond">
    <v-card class="p-4" elevation="0" max-width="800">
      <v-row class="m-2" justify="center">
        <div class="text-h3 form-title">SII LE MANS | PICSOU</div>
      </v-row>
      <v-card-text>
        <v-form v-on:submit.prevent="formConnect">
          <v-row>
            <v-col cols="12">
              <label class="mb-2">Identifiant</label>
              <v-text-field
                variant="solo"
                v-model="login.username"
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
                v-model="login.password"
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
import { accountService } from "@/_services";
export default {
  name: "connexion",
  data() {
    return {
      login: {
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
      if (this.login.username !== "" || this.login.password !== "") {
        accountService
          .login(this.login)
          .then((res) => {
            console.log(res.data);
            accountService.saveToken(res.data.token);
            console.log(this.$store.state.connected);
            router.push("/dashboard");
          })
          .catch((err) => {
            console.log(err), (this.error = err.response.data.error);
          });

        // axios
        //   .post("http://localhost:8080/api/login", {
        //     username: this.login.username,
        //     password: this.login.password,
        //   })
        //   .then((response) => {
        //     router.push("/dashboard");
        //     console.log("Connecté");
        //     //utiliser un interceptor pour le jwt
        //   });
      } else {
        (this.ErrorState = true),
          (this.error = "Veuillez remplir tous les champs");
        console.log(this.error);
      }
    },
  }
};
</script>
<style scoped>
/* .v-navigation-drawer {
  display: none;
} */
.fond {
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
    background: linear-gradient(115deg, #e84654 0%, #75519b 100%) !important;
    margin: 0;
    padding: 0;
  
}
.v-card {
  background: linear-gradient(2453deg, #e84654 0%, #75519b 100%) !important;
  color: white;
  margin: auto;
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
.v-application {
  background: linear-gradient(115deg, #e84654 0%, #75519b 100%) !important;
}
.v-main {
  background: linear-gradient(115deg, #e84654 0%, #75519b 100%) !important;
}
</style>