<template>
  <h1 class="title">Mode Simulation</h1>
  <p>
    Le mode simulation vous permet de modifier toutes les données comme vous le
    souhaitez. Ce mode n'impacte en rien les données de la version classique de
    PICSOU. Vous avez la possibilité d'enregistrer une simulation afin de
    pouvoir la recharger plus tard. Cette version de la simulation pourra être
    retrouvée en rechargeant celle-ci via la liste de versions. Si vous
    souhaitez réinitialiser les données de votre simulation avec celle de la
    production pour repartir sur une nouvelle base, cliquez sur "Réinitialiser
    les données de ma simulation".
    <strong>
      Avant de réinitialiser les données, pensez à sauvegarder votre simulation
      si vous souhaitez pouvoir revenir à cette version plus tard.
    </strong>
  </p>

  <v-btn
    class="text-none mb-4 mr-3"
    color="deep-purple-darken-1"
    variant="flat"
    @click="toggleSimulationMode"
    prepend-icon="mdi-chart-box-outline"
  >
    {{ simulationButtonLabel }}
  </v-btn>

  <ProdToSimuForm v-if="isSimulationActive" />

  <div v-if="isSimulationActive">
    <h1 class="title">Mes versions</h1>
    <p>
      Voici la liste des différentes versions de votre simulation que vous avez
      sauvegardé. Vous pouvez choisir la sauvegarde que vous souhaitez et
      cliquer sur "Charger la version" pour revenir à l'état de celle-ci.
      <strong>
        Attention revenir à une version n'effectue pas de sauvegarde sur l'état
        actuel de votre simulation, veuillez effectuer une sauvegarde avant si
        vous souhaitez pouvoir revenir dessus plus tard.
      </strong>
    </p>
    <v-autocomplete
      :items="files"
      item-title="name"
      item-value="name"
      label="Version"
      variant="solo"
      v-model="version"
    ></v-autocomplete>
    <v-alert
      v-if="error != ''"
      closable
      class="mb-5 vibrate"
      icon="mdi-close"
      type="error"
      v-model="alert"
      border
      :text="error"
      m-5
    ></v-alert>
    <v-btn
      class="text-none mb-4 mr-3"
      color="deep-purple-darken-1"
      variant="flat"
      prepend-icon="mdi-reload"
      :disabled="version == null"
      :loading="loadingLoadSave"
      @click="LoadSave"
    >
      Charger la version
    </v-btn>
    <SaveSimuForm />
  </div>
  <div v-if="isSimulationActive">
    <h1 class="title">Versions des autres utilisateurs</h1>
    <v-row>
      <v-col cols="12" lg="6">
        <v-autocomplete
          :items="accounts"
          item-title="fullname"
          item-value="id"
          label="Utilisateur"
          variant="solo"
          v-model="userSelected"
        ></v-autocomplete>
      </v-col>
      <v-col cols="12" lg="6">
        <v-autocomplete
          :items="otherUserFiles"
          item-title="name"
          item-value="name"
          label="Version"
          variant="solo"
          :disabled="userSelected == null"
          v-model="otherUserVersion"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-btn
      class="text-none mb-4 mr-3"
      color="deep-purple-darken-1"
      variant="flat"
      prepend-icon="mdi-reload"
      :disabled="otherUserVersion == null"
      :loading="loadingLoadSaveOtherVersion"
      @click="LoadSaveOtherUser"
    >
      Charger la version
    </v-btn>
  </div>

  <v-snackbar
    v-if="SuccessState == true"
    v-model="snackbar"
    w-auto
    color="green"
    timeout="3000"
  >
    <v-icon start icon="mdi-checkbox-marked-circle"></v-icon>
    {{ success }}
  </v-snackbar>
  <v-snackbar
    v-if="ErrorState == true"
    v-model="snackbarError"
    w-auto
    color="red"
    timeout="3000"
  >
    <v-icon start icon="mdi-close"></v-icon>
    {{ error }}
  </v-snackbar>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import Axios from "@/_services/caller.service";
import SaveSimuForm from "./forms/simulation/SaveSimuForm.vue";
import ProdToSimuForm from "./forms/simulation/ProdToSimuForm.vue";
export default {
  data: () => ({
    accounts: [],
    loadingLoadSave: false,
    loadingLoadSaveOtherVersion: false,
    refresh: false,
    userId: localStorage.getItem("userId"),
    error: "",
    SuccessState: false,
    snackbar: false,
    ErrorState: false,
    snackbarError: false,
    files: [],
    otherUserFiles: [],
    version: null,
    otherUserVersion: null,
    alert: false,
    userSelected: null,
  }),
  components: {
    SaveSimuForm,
    ProdToSimuForm,
  },

  created() {
    this.fetchFilesOfActualUser();
    Axios.get("http://localhost:8080/api/production/accounts").then((res) => {
      this.accounts = res.data.accounts;
    });
  },

  computed: {
    ...mapGetters(["getSimulationMode"]),
    simulationMode() {
      return this.getSimulationMode;
    },
    isSimulationActive() {
      return (
        this.simulationMode === "true" ||
        localStorage.getItem("isSimulation") === "true"
      );
    },
    simulationButtonLabel() {
      if (this.isSimulationActive) {
        return "Revenir sur la production";
      }
      return "Passer en mode simulation";
    },
  },

  watch: {
    userSelected() {
      this.fetchFilesOfUsers();
    },
  },

  methods: {
    ...mapMutations(["setSimulationMode"]),
    ...mapActions([
      "refreshCustomers",
      "refreshGraduations",
      "refreshJobs",
      "initApp",
    ]),
    fetchFilesOfActualUser() {
      Axios.get(
        `http://localhost:8080/api/production/simulation/GetFiles/${localStorage.getItem(
          "userId"
        )}`
      )
        .then((res) => {
          this.files = res.data.files;
        })
        .catch((err) => {
          console.log(err);
          this.snackbarError = true;
          this.ErrorState = true;
          this.error = err.response.data.error;
        });
    },
    fetchFilesOfUsers() {
      Axios.get(
        `http://localhost:8080/api/production/simulation/GetFiles/${this.userSelected}`
      )
        .then((res) => {
          this.otherUserFiles = res.data.files;
        })
        .catch((err) => {
          console.log(err);
          this.snackbarError = true;
          this.ErrorState = true;
          this.error = err.response.data.error;
        });
    },

    toggleSimulationMode() {
      let nom = null;

      if (localStorage.getItem("userName")) {
        const username = localStorage.getItem("userName");
        const mots = username.split(" ");
        nom = mots[1].toLowerCase();
      }

      const newMode =
        localStorage.getItem("isSimulation") === "true" ? "false" : "true";
      localStorage.setItem("isSimulation", newMode);
      this.setSimulationMode(newMode);

      // Mettre à jour l'URL dans le service Axios
      const baseUrl =
        newMode === "true"
          ? "http://localhost:8080/api/" + nom
          : "http://localhost:8080/api/production";

      Axios.defaults.baseURL = baseUrl; // Assurez-vous que $axios est correctement injecté dans votre composant

      this.initApp();
    },
    LoadSave() {
      this.loadingLoadSave = true;
      if (this.version == null) {
        this.snackbarError = true;
        this.ErrorState = true;
        this.loadingLoadSave = false;
        this.error = "Choisissez une version";
      } else {
        Axios.post("http://localhost:8080/api/production/simulation/LoadSave", {
          userId: localStorage.getItem("userId"),
          fileName: this.version,
        })
          .then((response) => {
            this.snackbar = true;
            this.loadingLoadSave = false;
            this.SuccessState = true;
            this.success = response.data.message;
            this.error = "";
          })
          .catch((err) => {
            console.log(err);
            this.loadingLoadSave = false;
            this.snackbarError = true;
            this.ErrorState = true;
            this.error = err.response.data.error;
          });
      }
    },
    LoadSaveOtherUser() {
      this.loadingLoadSaveOtherVersion = true;
      if (this.otherUserVersion == null) {
        this.snackbarError = true;
        this.ErrorState = true;
        this.loadingLoadSaveOtherVersion = false;
        this.error = "Choisissez une version";
      } else {
        Axios.post(
          "http://localhost:8080/api/production/simulation/LoadSaveFromOtherUser",
          {
            userId: localStorage.getItem("userId"),
            otherUserId: this.userSelected,
            fileName: this.otherUserVersion,
          }
        )
          .then((response) => {
            this.snackbar = true;
            this.loadingLoadSaveOtherVersion = false;
            this.SuccessState = true;
            this.success = response.data.message;
            this.error = "";
          })
          .catch((err) => {
            console.log(err);
            this.loadingLoadSaveOtherVersion = false;
            this.snackbarError = true;
            this.ErrorState = true;
            this.error = err.response.data.error;
          });
      }
    },
  },
};
</script>

<style>
p {
  text-align: justify;
}
</style>