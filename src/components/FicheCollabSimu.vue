<template>
  <v-container>
    <v-row>
      <v-col class="mt-2">
        <v-btn
          size="small"
          variant="text"
          @click="retourPagePrecedente"
          prepend-icon="mdi-arrow-left"
          >Retour</v-btn
        >
      </v-col>
    </v-row>
    Simu
    <v-row>
      <v-avatar size="70" class="mt-3">
        <v-img src="../assets/img/collab/generic.png" alt="John"></v-img>
      </v-avatar>
      <v-col>
        <h1
          class="title d-inline-block"
          v-text="associate.first_name + ' ' + associate.name"
        ></h1>
        <p>{{ job }} | {{ associate.mail }}</p>
        <router-link
          :to="{
            name: 'CollabGestionView',
            params: { id: associate.id },
          }"
        >
          Évolution du collaborateur
          <v-icon start icon="mdi-open-in-new"></v-icon>
        </router-link>
      </v-col>
      <v-row justify="end">
        <v-col lg="6">
          <UpdateCollabForm
            :associate_id="associate.id"
            :associate_name="associate.name"
            :associate_first_name="associate.first_name"
            :associate_birthdate="associate.birthdate"
            :associate_mail="associate.mail"
            :associate_start_date="associate.start_date"
            :associate_pru="pru"
            :associate_graduation="associate.Graduation.id"
            :associate_job_id="job_id"
            :associate_job="job"
            :associate_gender="associate.gender_id"
            :associate_manager_id="manager_id"
            :associate_manager="manager"
            @associateUpdated="handleAssociateUpdate"
          />
        </v-col>
      </v-row>
    </v-row>

    <!--  Si la personne est en mission -->
    <div>
      <!--Client part-->
      <v-row v-if="this.MissionsEnCours">
        <v-col cols="12" lg="6" md="6 " sm="12">
          <h5 class="pt-3 d-inline-block sub-title">
            Travail actuellement pour
          </h5>
          <v-row>
            <div
              class="client-en-cours rounded-3 m-2 p-2"
              v-for="mission in MissionsEnCours"
              :key="mission.reference"
            >
              <v-row>
                <v-col>
                  <p
                    class="text-h5 mt-2 name"
                    v-text="mission.Project.Customer.label"
                  ></p>
                </v-col>
                <v-col class="text-right">
                  <UpdateMissionForm
                    justify="end"
                    :mission_id="mission.id"
                    :mission_tjm="mission.TJMs.map((tjm) => tjm.value)"
                    :mission_start_date="mission.date_range_mission[0].value"
                    :mission_end_date="mission.date_range_mission[1].value"
                  />
                </v-col>
              </v-row>
              <router-link
                class="client-en-cours"
                :to="{
                  name: 'FicheClientView',
                  params: { id: mission.Project.Customer.id },
                }"
              >
                <p
                  v-text="
                    'Depuis le ' +
                    formatDate(mission.date_range_mission[0].value)
                  "
                ></p>
                <p
                  v-text="
                    'Se termine le ' +
                    formatDate(mission.date_range_mission[1].value)
                  "
                ></p>
                <p
                  v-text="mission.Project.label + ' / ' + mission.Project.adv"
                ></p>
                <p v-text="'TJM : ' + mission.TJMs.map((tjm) => tjm.value)"></p>
                <!-- <p v-if="mission.end" v-text="formatDate(mission.end)"></p> -->
              </router-link>
            </div>
            <v-col lg="2" sm="12" class="client-add">
              <AddMissionForm
                :associate_id="associate.id"
                :associate="associate.name"
                :associate_start_date="associate.start_date"
                :associate_end_date="associate.end_date"
                @associateUpdated="handleAssociateUpdate"
              />
            </v-col>
          </v-row>
        </v-col>

        <!-- Manager part -->
        <v-col cols="12" lg="6" md="6" sm="12">
          <h5 class="pt-3 sub-title d-inline-block">Manager</h5>
          <v-row>
            <div class="col-2 manager rounded-3 m-2 pt-2 shadow-sm">
              <v-row>
                <v-col cols="3" class="mt-1 ml-2">
                  <v-avatar>
                    <v-img
                      src="../assets/img/collab/generic.png"
                      style="width: 100%"
                      alt="John"
                    ></v-img>
                  </v-avatar>
                </v-col>
                <v-col cols="2">
                  <p class="" v-text="this.manager"></p>
                </v-col>
              </v-row>
            </div>
          </v-row>
        </v-col>
      </v-row>

      <!-- Si en intercontrat -->
      <v-row v-else>
        <v-col cols="6">
          <h5 class="pt-3 sub-title d-inline-block">
            Ce collaborateur est en intercontrat.
          </h5>
          <AddMissionForm
            :associate_id="associate.id"
            :associate="associate.name"
            :associate_start_date="associate.start_date"
            :associate_end_date="associate.end_date"
            @associateUpdated="handleAssociateUpdate"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col lg="6" v-if="MissionsFutur.length > 0">
          <h5 class="pt-3 sub-title d-inline-block">Prochaines missions</h5>
          <v-row>
            <div
              class="col-2 client-futur rounded-3 m-2 p-2 shadow-sm"
              v-for="mission in MissionsFutur"
              :key="mission.reference"
            >
              <v-row>
                <v-col>
                  <p
                    class="text-h5 mt-2 name"
                    v-text="mission.Project.Customer.label"
                  ></p>
                </v-col>
                <v-col class="text-right">
                  <UpdateMissionForm
                    justify="end"
                    :mission_id="mission.id"
                    :mission_tjm="mission.TJMs.map((tjm) => tjm.value)"
                    :mission_start_date="mission.date_range_mission[0].value"
                    :mission_end_date="mission.date_range_mission[1].value"
                    @associateUpdated="handleAssociateUpdate"
                  />
                </v-col>
              </v-row>
              <router-link
                class="client-futur"
                :to="{
                  name: 'FicheClientView',
                  params: { label: mission.Project.Customer.id },
                }"
              >
                <p
                  v-text="
                    'Commence le ' +
                    formatDate(mission.date_range_mission[0].value)
                  "
                ></p>
                <p
                  v-text="mission.Project.label + ' / ' + mission.Project.adv"
                ></p>
                <p v-text="'TJM : ' + mission.TJMs.map((tjm) => tjm.value)"></p>
                <p v-if="mission.end" v-text="formatDate(mission.end)"></p>
              </router-link>
            </div>
          </v-row>
        </v-col>

        <v-col v-if="MissionsFinis.length > 0" lg="6">
          <h5 class="pt-3 sub-title d-inline-block">Mission terminées</h5>
          <v-row>
            <div
              class="client-fini rounded-3 m-2 p-2"
              v-for="mission in MissionsFinis"
              :key="mission.reference"
            >
              <v-row>
                <v-col>
                  <p
                    class="text-h5 name"
                    v-text="mission.Project.Customer.label"
                  ></p>
                </v-col>
              </v-row>
              <router-link
                class="client-en-cours"
                :to="{
                  name: 'FicheClientView',
                  params: { id: mission.Project.Customer.id },
                }"
              >
                <p
                  v-text="
                    'Terminée le ' +
                    formatDate(mission.date_range_mission[1].value)
                  "
                ></p>
                <p
                  v-text="mission.Project.label + ' / ' + mission.Project.adv"
                ></p>
                <p v-text="'TJM : ' + mission.TJMs.map((tjm) => tjm.value)"></p>
                <p v-if="mission.end" v-text="formatDate(mission.end)"></p>
              </router-link>
            </div>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <!-- Partie basse avec les infos récap chiffré du collab -->
    <v-row>
      <v-col cols="6" lg="3" md="4" sm="6">
        <div class="shadow rounded-5 mt-5 p-4 bg-white">
          <p class="etiquette mb-2">PRU</p>
          <v-row justify="end">
            <p class="data m-2" v-text="pru"></p>
          </v-row>
        </div>
      </v-col>
      <v-col cols="6" lg="3" md="4" sm="6">
        <div
          class="shadow rounded-5 mt-5 p-4 bg-white"
          v-if="associate.start_date"
        >
          <p class="etiquette mb-2">Date d'embauche</p>
          <v-row justify="end">
            <p class="data m-2" v-text="formatDate(associate.start_date)"></p>
          </v-row>
        </div>
      </v-col>
      <v-col cols="6" lg="3" md="4" sm="6">
        <div
          class="shadow rounded-5 mt-5 p-4 bg-white"
          v-if="associate.birthdate"
        >
          <p class="etiquette mb-2">Age</p>
          <v-row justify="end">
            <p class="data m-2" v-text="calculateAge(associate.birthdate)"></p>
          </v-row>
        </div>
      </v-col>
      <v-col cols="6" lg="3" md="4" sm="6">
        <div
          class="shadow rounded-5 mt-5 p-4 bg-white"
          v-if="associate.Graduation"
        >
          <p class="etiquette mb-2">Diplôme</p>
          <v-row justify="end">
            <p class="data m-2" v-text="associate.Graduation.label"></p>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import AddMissionForm from "@/components/forms/add/AddMissionForm.vue";
import UpdateCollabForm from "@/components/forms/update/UpdateCollabForm.vue";
import UpdateMissionForm from "@/components/forms/update/UpdateMissionForm.vue";
import {
  format,
  isBefore,
  parseISO,
  isAfter,
  differenceInYears,
} from "date-fns";
import { fr } from "date-fns/locale";
export default {
  name: "FicheCollabSimu",
  components: {
    AddMissionForm,
    UpdateCollabForm,
    UpdateMissionForm,
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
      pru: null,
      job: null,
      job_id: null,
      manager: null,
      manager_id: null,
    };
  },
  methods: {
    retourPagePrecedente() {
      this.$router.go(-1);
    },
    calculateAge(dateOfBirth) {
      const today = new Date();
      return differenceInYears(today, new Date(dateOfBirth));
    },
    handleAssociateUpdate() {
      // Actualiser la liste des collaborateurs en récupérant les données depuis le serveur
      this.fetchData();
    },
    fetchData() {
      console.log("fetch");
      Axios.get(`/associate/${this.$route.params.collab.id}`)
        .then((response) => {
          // Pass the client data as a prop to the component
          this.associate = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    formatDate(date) {
      return (date = format(new Date(date), "PP", { locale: fr }));
    },
    formatDateBDD(date) {
      return (date = format(new Date(date), "yyyy-MM-dd"));
    },
    missionFini(mission_start, mission_end) {
      const now = new Date();
      const start = parseISO(mission_start);
      const end = mission_end ? parseISO(mission_end) : null;

      if (isBefore(start, now)) {
        if (isAfter(end, now)) {
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
          return true;
          // La date de fin n'est pas encore passé donc la mission est en cours
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
      this.associate.PRUs.forEach((pru) => {
        if (pru.end_date > today) {
          this.pru = pru.value;
        }
      });
    },
    jobActuel() {
      let today = new Date();
      today = this.formatDateBDD(today);
      for (let job of this.associate.Jobs) {
        if (job.Associate_Job.end_date > today) {
          this.job_id = job.id;
          this.job = job.label;
        }
      }
    },
    managerActuel() {
      let today = new Date();
      let formattedDate = format(today, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      for (let manager of this.associate.managers) {
        if (
          manager.Associate_Manager.end_date > formattedDate &&
          manager.Associate_Manager.start_date <= formattedDate
        ) {
          this.manager_id = manager.id;
          this.manager = manager.first_name + " " + manager.name;
        }
      }
    },
  },
  created() {
    Axios.get("/projects").then((res) => {
      this.projects = res.data?.project;
    });

    this.associate = this.$route.params.collab;
    this.todayDate = this.formatDate(new Date());
    this.pruActuel();
    this.jobActuel();
    this.managerActuel();
  },
  computed: {
    MissionsFinis() {
      if (this.associate.Missions == "") {
        return false;
      }
      return this.associate.Missions.filter((mission) => {
        return this.missionFini(
          mission.date_range_mission[0].value,
          mission.date_range_mission[1].value
        );
      });
    },
    MissionsEnCours() {
      if (this.associate.Missions == "") {
        return false;
      }
      return this.associate.Missions.filter((mission) => {
        return this.missionEnCours(
          mission.date_range_mission[0].value,
          mission.date_range_mission[1].value
        );
      });
    },
    MissionsFutur() {
      if (this.associate.Missions == "") {
        return false;
      }
      return this.associate.Missions.filter((mission) => {
        return this.missionFutur(
          mission.date_range_mission[0].value,
          mission.date_range_mission[1].value
        );
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

.client-add {
  width: 20vh;
  min-width: 200px;
}
.client-fini {
  background: linear-gradient(135deg, #65799b 0%, #5e2563 100%);
  color: white;
  width: 20vh;
  min-width: 200px;
}
.client-en-cours {
  background: linear-gradient(135deg, #7117ea 0%, #ea6060 100%);
  color: white;
  width: 20vh;
  min-width: 200px;
}

.client-futur {
  background: linear-gradient(135deg, #f2d50f 0%, #da0641 100%);
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