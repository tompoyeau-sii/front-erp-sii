<template>
  <div class="container">
    <router-link class="retour" to="/collaborateurs">
      <v-icon start icon="mdi-arrow-left"></v-icon>
      Retour
    </router-link>
    <div class="row">
      <div class="col-9">
        <div class="row ma-5">
          <div class="col-1 display-flex">
            <v-avatar size="70">
              <v-img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                alt="John"
              ></v-img>
            </v-avatar>
          </div>
          <div class="col">
            <div class="row">
              <h1
                class="title"
                v-text="associate.first_name + ' ' + associate.name"
              ></h1>

              <p v-text="jobActuel()"></p>
            </div>
          </div>
        </div>

        <!--  Si la personne est en mission -->
        <div v-if="this.MissionsEnCours" class="row ma-5">
          <!--Client part-->
          <div class="col-6">
            <h5 class="pt-3 sub-title">Travail actuellement pour</h5>
            <div class="row">
              <router-link
                class="col-2 client rounded-3 m-2 pt-3 shadow-sm"
                v-for="mission in MissionsEnCours"
                :key="mission.id"
                refresh
                :to="{
                  name: 'FicheClientView',
                  params: { label: mission.Project.Customer.label },
                }"
              >
                <div>
                  <p
                    class="text-h5 name"
                    v-text="mission.Project.Customer.label"
                  ></p>
                  <p v-text="'Depuis le ' + formatDate(mission.start_date)"></p>
                  <p v-text="mission.Project.label"></p>
                  <p v-text="mission.TJMs.map((tjm) => tjm.value)"></p>
                </div>
                <p v-if="mission.end" v-text="formatDate(mission.end)"></p>
              </router-link>
            </div>
          </div>

          <!-- Manager part -->
          <div class="col-6">
            <h5 class="pt-3 sub-title">Manager</h5>
            <div class="row">
              <router-link
                class="col-2 manager rounded-3 m-2 pt-3 shadow-sm"
                v-for="mission in MissionsEnCours"
                :key="mission.id"
                :to="{
                  name: 'FicheCollabView',
                  params: { id: mission.Project.Associate.id },
                }"
              >
                <div class="row">
                  <div class="col-3">
                    <v-avatar>
                      <v-img
                        src="https://cdn.vuetifyjs.com/images/john.jpg"
                        style="width: 100%"
                        alt="John"
                      ></v-img>
                    </v-avatar>
                  </div>
                  <div class="col-2">
                    <p
                      class=""
                      v-text="
                        mission.Project.Associate.first_name +
                        ' ' +
                        mission.Project.Associate.name
                      "
                    ></p>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
          <AddMissionForm title="Poyeau" />

          <div class="col-6">
            <h5 class="pt-3 sub-title">Prochaines missions</h5>
            <div class="row">
              <router-link
                class="col-2 client rounded-3 m-2 pt-3 shadow-sm"
                v-for="mission in MissionsFutur"
                :key="mission.id"
                refresh
                :to="{
                  name: 'FicheClientView',
                  params: { label: mission.Project.Customer.label },
                }"
              >
                <div>
                  <p
                    class="text-h5 name"
                    v-text="mission.Project.Customer.label"
                  ></p>
                  <p v-text="'Depuis le ' + formatDate(mission.start_date)"></p>
                  <p v-text="mission.Project.label"></p>
                  <p v-text="mission.TJMs.map((tjm) => tjm.value)"></p>
                </div>
                <p v-if="mission.end" v-text="formatDate(mission.end)"></p>
              </router-link>
            </div>
          </div>

          <div class="col-6" v-if="missionFini">
            <h5 class="pt-3 sub-title">Mission terminées</h5>
            <div class="row">
              <router-link
                class="col-2 client rounded-3 m-2 pt-3 shadow-sm"
                v-for="mission in missionFini"
                :key="mission.id"
                refresh
                :to="{
                  name: 'FicheClientView',
                  params: { label: mission.Project.Customer.label },
                }"
              >
                <div>
                  <p
                    class="text-h5 name"
                    v-text="mission.Project.Customer.label"
                  ></p>
                  <p v-text="'Depuis le ' + formatDate(mission.start_date)"></p>
                  <p v-text="mission.Project.label"></p>
                  <p v-text="mission.TJMs.map((tjm) => tjm.value)"></p>
                </div>
                <p v-if="mission.end" v-text="formatDate(mission.end)"></p>
              </router-link>
            </div>
          </div>
          <v-expansion-panels v-model="panel" :readonly="readonly" multiple>
            <v-expansion-panel>
              <v-expansion-panel-title>Panel 1</v-expansion-panel-title>
              <v-expansion-panel-text> Some content </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>Panel 2</v-expansion-panel-title>
              <v-expansion-panel-text> Some content </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title>Panel 3</v-expansion-panel-title>
              <v-expansion-panel-text> Some content </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>

        <!--  Si la personne n'est pas en mission -->
        <div v-else class="row ma-5">
          <div class="col-6">
            <h5 class="pt-3 sub-title">
              Ce collaborateur est en intercontrat.
            </h5>
            <AddMissionForm />
          </div>
        </div>
      </div>

      <!-- Layout droit avec les infos récap chiffré du collab -->
      <div class="col-3">
        <div class="shadow rounded-5 mt-5 p-4">
          <p class="etiquette mb-2">IK</p>
          <v-row justify="end">
            <p class="data m-2">254251</p>
          </v-row>
        </div>

        <div class="shadow rounded-5 mt-5 p-4" v-if="pruActuel()">
          <p class="etiquette mb-2">PRU</p>
          <v-row justify="end">
            <p class="data m-2" v-text="pruActuel()"></p>
          </v-row>
        </div>

        <div class="shadow rounded-5 mt-5 p-4" v-if="associate.start_date">
          <p class="etiquette mb-2">Date d'embauche</p>
          <v-row justify="end">
            <p class="data m-2" v-text="formatDate(associate.start_date)"></p>
          </v-row>
        </div>

        <div class="shadow rounded-5 mt-5 p-4" v-if="associate.birthdate">
          <p class="etiquette mb-2">Age</p>
          <v-row justify="end">
            <p class="data m-2" v-text="calculateAge(associate.birthdate)"></p>
          </v-row>
        </div>

        <div class="shadow rounded-5 mt-5 p-4" v-if="associate.Graduation">
          <p class="etiquette mb-2">Diplôme</p>
          <v-row justify="end">
            <p class="data m-2" v-text="associate.Graduation.label"></p>
          </v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "@/_services/caller.service";
import AddMissionForm from "@/components/forms/AddMissionForm.vue";
import {
  format,
  isBefore,
  parseISO,
  isAfter,
  differenceInYears,
} from "date-fns";
export default {
  name: "FicheCollab",
  components: {
    AddMissionForm,
  },
  data() {
    return {
      dialog: false,
      error: "",
      first_name_and_name: "",
      projects: [],
      SuccessState: false,
      snackbar: false,
      associate: [],
      associates: [],
      customers: [],
      todayDate: "",
      json: [],
      step: 1,
    };
  },
  methods: {
    nameCollab(associates) {
      for (let associate of associates) {
        const name = associate.first_name + " " + associate.name;
        const id = associate.id;
        const associateInfo = { id: id, name: name };
        this.json.push(associateInfo);
      }
      return this.json;
    },

    calculateAge(dateOfBirth) {
      const today = new Date();
      return differenceInYears(today, new Date(dateOfBirth));
    },
    formatDate(date) {
      return (date = format(new Date(date), "dd/MM/yyyy"));
    },
    formatDateBDD(date) {
      return (date = format(new Date(date), "yyyy/MM/dd"));
    },

    missionFini(mission_start, mission_end) {
      const now = new Date();
      const start = parseISO(mission_start);
      const end = mission_end ? parseISO(mission_end) : null;

      if (isBefore(start, now)) {
        if (end == null || isAfter(end, now)) {
          // La date de fin n'est pas encore passé donc la mission est en cours
          return false;
        } else {
          // La date de fin est passé, alors la mission est terminé
          return true;
        }
      } else {
        // La mission n'a pas encore commencé
        return false;
      }
    },
    missionEnCours(mission_start, mission_end) {
      const now = new Date();
      const start = parseISO(mission_start);
      const end = mission_end ? parseISO(mission_end) : null;

      if (isBefore(start, now)) {
        if (end == null || isAfter(end, now)) {
          // La date de fin n'est pas encore passé donc la mission est en cours
          return true;
        } else {
          // La date de fin est passé, alors la mission est terminé
          return false;
        }
      } else {
        // La mission n'a pas encore commencé
        return false;
      }
    },
    missionFutur(mission_start, mission_end) {
      const now = new Date();
      const start = parseISO(mission_start);
      const end = mission_end ? parseISO(mission_end) : null;

      if (isBefore(start, now)) {
        if (end == null || isAfter(end, now)) {
          // La date de fin n'est pas encore passé donc la mission est en cours
          return false;
        } else {
          // La date de fin est passé, alors la mission est terminé
          return false;
        }
      } else {
        // La mission n'a pas encore commencé
        return true;
      }
    },
    pruActuel() {
      let today = new Date();
      today = this.formatDateBDD(today);
      for (let pru of this.associate.PRUs) {
        if (pru.start_date < today && pru.end_date > today) {
          return pru.value;
        }
      }
    },
    projectsOfCustomer(customer) {
      if (!customer) {
        return "Aucun projet avec ce client";
      }
      let today = new Date();
      today = this.formatDateBDD(today);
      for (let project of this.projects) {
        if (
          project.customer_id == customer &&
          project.start_date < today &&
          project.end_date > today
        ) {
          return project.label;
        }
      }
    },
    jobActuel() {
      let today = new Date();
      today = this.formatDate(today);
      for (let job of this.associate.Jobs) {
        if (
          job.Associate_Job.start_date < today &&
          job.Associate_Job.end_date > today
        ) {
          return job.label;
        }
      }
    },
    formatDate(date) {
      return (date = format(new Date(date), "dd/MM/yyyy"));
    },
  },
  created() {
    Axios.get("/associates").then((res) => {
      this.associates = res.data?.associate;
    });
    Axios.get("/projects").then((res) => {
      this.projects = res.data?.project;
    });

    this.associate = this.$route.params.collab;
    this.todayDate = this.formatDate(new Date());
    this.projects = this.projectsOfCustomer(this.customer);
    this.first_name_and_name = this.nameCollab(this.associates);
  },
  computed: {
    MissionsFinis() {
      if (this.associate.Missions == "") {
        return false;
      }
      return this.associate.Missions.filter((mission) => {
        return this.missionFini(mission.start_date, mission.end_date);
      });
    },
    MissionsEnCours() {
      if (this.associate.Missions == "") {
        return false;
      }
      return this.associate.Missions.filter((mission) => {
        return this.missionEnCours(mission.start_date, mission.end_date);
      });
    },
    MissionsFutur() {
      if (this.associate.Missions == "") {
        return false;
      }
      return this.associate.Missions.filter((mission) => {
        return this.missionFutur(mission.start_date, mission.end_date);
      });
    },
  },
};
</script>

<style scoped>
.display-flex {
  display: flex;
  align-items: top;
  justify-content: center;
}

.etiquette {
  color: #a9a9a9;
}

.data {
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 130%;
}

.client {
  background: linear-gradient(135deg, #65799b 0%, #5e2563 100%);
  color: white;
  width: 20vh;
  min-width: 200px;
}
.manager {
  background: linear-gradient(135deg, #0ff0b3 0%, #036ed9 100%);
  color: white;
  width: 20vh;
  min-width: 200px;
}

.name {
  font-weight: 600;
}

.sub-title {
  background: linear-gradient(
    90deg,
    rgba(117, 81, 155, 1) 0%,
    rgba(232, 70, 84, 1) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 130%;
}
</style>