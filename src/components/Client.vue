<template>
  <div class="container">
    <h1 class="pt-3 pb-3 title">Clients SII Le Mans</h1>
    <v-row justify="end">
      <v-dialog v-model="dialog" persistent width="75%">
        <template v-slot:activator="{ props }">
          <v-btn
            prepend-icon="mdi-plus"
            color="success"
            v-bind="props"
          >
            Ajouter un client
          </v-btn>
        </template>
        <v-card style="background: linear-gradient(135deg, #75519B 0%, #E84654 100%); color: white">
          <v-card-title>
            <h1>Ajouter un nouveau client</h1>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    label="Libelle d'entreprise*"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*champs obligatoires</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn prepend-icon="mdi-window-close" color="white" variant="defaut" @click="dialog = false">
              Annuler
            </v-btn>
            <v-btn prepend-icon="mdi-check-bold" color="white" @click="dialog = false">
              Créer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-overlay v-model="overlay" contained class="align-center justify-center">
      <v-btn color="success" @click="overlay = false"> Hide Overlay </v-btn>
    </v-overlay>
    <div class="row">
      <div
        class="col client rounded-3 m-2 shadow-sm"
        v-for="message in messages"
        :key="message.id"
      >
        <p v-text="message.libelle"></p>
        <p v-text="message.ca"></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Client",
  data() {
    return {
      dialog: false,
      messages: [],
    };
  },
  methods: {
    getAge(age) {
      var diff = Date.now() - date.getTime();
      var age = new Date(diff);
      return Math.abs(age.getUTCFullYear() - 1970);
    },
  },
  created() {
    axios.get("http://localhost:8080/api/client").then((res) => {
      this.messages = res.data?.client;
      console.log(res.data?.client);
    });
  },
};
</script>

<style scoped>
td {
  margin-top: auto;
  margin-bottom: auto;
  vertical-align: middle;
}

.client {
  background: linear-gradient(135deg, #7117ea 0%, #ea6060 100%);
  color: white;
}
</style>
