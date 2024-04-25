<template>
  <v-container>
    <div class="row align-items-center">
      <div class="col">
        <h1 class="title d-inline-block">Mode Simulation</h1>
        <SimuInfo />
      </div>
    </div>

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
      <div class="row align-items-center">
        <div class="col">
          <h1 class="title d-inline-block">Mes versions</h1>
          <VersionInfo />
        </div>
      </div>
      <div class="table-responsive">
        <table class="table rounded-3 shadow bg-white table-striped">
          <thead>
            <tr style="border: white">
              <th>Sauvegarde</th>
              <th>Date de création</th>
              <th>Charger/Supprimer</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="file in files" :key="file">
              <td>
                <p class="mt-auto mb-auto ml-2" v-text="file.name"></p>
              </td>

              <td class="mt-auto mb-auto" v-text="file.created_at"></td>
              <td>
                <LoadSaveConfirmation
                  :filename="file.name"
                ></LoadSaveConfirmation>
                <DeleteSaveConfirmation
                  @saveDeleted="handleSave"
                  :filename="file.name"
                ></DeleteSaveConfirmation>
              </td>
            </tr>
          </tbody>
        </table>
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          @input="fetchFilesOfActualUser"
          prev-icon="mdi-chevron-left"
          next-icon="mdi-chevron-right"
          color="deep-purple-darken-1"
        ></v-pagination>
      </div>
      <SaveSimuForm @saveCreated="handleSave" />
    </div>
    <div v-if="isSimulationActive">
      <h1 class="title d-inline-block">Versions des autres utilisateurs</h1>
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
  </v-container>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import Axios from "@/_services/caller.service";
import SaveSimuForm from "./forms/simulation/SaveSimuForm.vue";
import ProdToSimuForm from "./forms/simulation/ProdToSimuForm.vue";
import SimuInfo from "./infos/SimuInfo.vue";
import VersionInfo from "./infos/VersionInfo.vue";
import LoadSaveConfirmation from "./forms/simulation/LoadSaveConfirmation.vue";
import DeleteSaveConfirmation from "./forms/simulation/DeleteSaveConfirmation.vue";

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
    currentPage: 1,
    totalPages: 1,
  }),
  components: {
    SaveSimuForm,
    ProdToSimuForm,
    SimuInfo,
    VersionInfo,
    LoadSaveConfirmation,
    DeleteSaveConfirmation,
  },

  created() {
    this.fetchFilesOfActualUser(1);
    Axios.get("http://localhost:8080/api/production/accounts").then((res) => {
      this.accounts = res.data.accounts;
      const updatedAccounts = this.accounts.filter(
        (account) => account.id !== this.userId
      );
      this.accounts = updatedAccounts;
    });
  },
  watch: {
    currentPage(newPage) {
      this.fetchFilesOfActualUser(newPage);
    },
    userSelected() {
      this.fetchFilesOfUsers();
    },
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
  methods: {
    ...mapMutations(["setSimulationMode"]),
    ...mapActions([
      "refreshCustomers",
      "refreshGraduations",
      "refreshJobs",
      "initApp",
    ]),
    fetchFilesOfActualUser(page) {
      Axios.get(
        `http://localhost:8080/api/production/simulation/GetFiles/${localStorage.getItem(
          "userId"
        )}?page=${page}`
      )
        .then((res) => {
          this.files = res.data.files;
          this.currentPage = res.data.currentPage;
          this.totalPages = res.data.totalPages;
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

    handleSave() {
      this.fetchFilesOfActualUser(1);
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
    LoadSave(fileName) {
      this.loadingLoadSave = true;

      Axios.post("http://localhost:8080/api/production/simulation/LoadSave", {
        userId: localStorage.getItem("userId"),
        fileName: fileName,
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