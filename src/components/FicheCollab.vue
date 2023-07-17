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

    <v-row>
      <v-avatar size="70" class="mt-3">
        <v-img src="../assets/img/collab/generic.png" alt="John"></v-img>
      </v-avatar>
      <v-col>
        <h1
          class="title"
          v-text="associate.first_name + ' ' + associate.name"
        ></h1>
        <p v-text="job"></p>
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
          />
        </v-col>
      </v-row>
    </v-row>

    <!--  Si la personne est en mission -->
    <div>
      <!--Client part-->
      <v-row v-if="this.MissionsEnCours">
        <v-col cols="12" lg="6" md="6 " sm="12">
          <h5 class="pt-3 sub-title">Travail actuellement pour</h5>
          <v-row>
            <router-link
              class="col-2 client-en-cours rounded-3 m-2 p-2"
              v-for="mission in MissionsEnCours"
              :key="mission.id"
              :to="{
                name: 'FicheClientView',
                params: { id: mission.Project.Customer.id },
              }"
            >
              <p
                class="text-h5 name"
                v-text="mission.Project.Customer.label"
              ></p>
              <p v-text="'Depuis le ' + formatDate(mission.start_date)"></p>
              <p v-text="'Se termine le ' + formatDate(mission.end_date)"></p>
              <p
                v-text="mission.Project.label + ' / ' + mission.Project.adv"
              ></p>
              <p v-text="'TJM : ' + mission.TJMs.map((tjm) => tjm.value)"></p>
              <p v-if="mission.end" v-text="formatDate(mission.end)"></p>
            </router-link>
            <v-col lg="2" sm="12" class="client-add">
              <AddMissionForm
                :associate_id="associate.id"
                :associate="associate.name"
              />
            </v-col>
          </v-row>
        </v-col>

        <!-- Manager part -->
        <v-col cols="12" lg="6" md="6" sm="12">
          <h5 class="pt-3 sub-title">Manager</h5>
          <v-row>
            <router-link
              class="col-2 manager rounded-3 m-2 pt-2 shadow-sm"
              v-for="mission in MissionsEnCours"
              :key="mission.id"
              :to="{
                name: 'FicheCollabView',
                params: { id: mission.Project.Associate.id },
              }"
            >
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
                  <p
                    class=""
                    v-text="
                      mission.Project.Associate.first_name +
                      ' ' +
                      mission.Project.Associate.name
                    "
                  ></p>
                </v-col>
              </v-row>
            </router-link>
          </v-row>
        </v-col>
      </v-row>

      <!-- Si en intercontrat -->
      <v-row v-else>
        <v-col cols="6">
          <h5 class="pt-3 sub-title">Ce collaborateur est en intercontrat.</h5>
          <AddMissionForm :associate_id="associate.id" />
        </v-col>
      </v-row>


      <v-row>
        <v-col lg="6" v-if="MissionsFutur.length > 0">
          <h5 class="pt-3 sub-title">Prochaines missions</h5>
          <v-row>
            <router-link
              class="col-2 client-futur rounded-3 m-2 p-2 shadow-sm"
              v-for="mission in MissionsFutur"
              :key="mission.id"
              refresh
              :to="{
                name: 'FicheClientView',
                params: { label: mission.Project.Customer.id },
              }"
            >
              <p
                class="text-h5 name"
                v-text="mission.Project.Customer.label"
              ></p>
              <p v-text="'Commence le ' + formatDate(mission.start_date)"></p>
              <p
                v-text="mission.Project.label + ' / ' + mission.Project.adv"
              ></p>
              <p v-text="'TJM : ' + mission.TJMs.map((tjm) => tjm.value)"></p>
              <p v-if="mission.end" v-text="formatDate(mission.end)"></p>
            </router-link>
          </v-row>
        </v-col>

        <v-col lg="6" v-if="MissionsFinis.length > 0">
          <h5 class="pt-3 sub-title">Missions terminées</h5>
          <v-row>
            <router-link
              class="col-2 client-fini rounded-3 m-2 p-2 shadow-sm"
              v-for="mission in MissionsFinis"
              :key="mission.id"
              refresh
              :to="{
                name: 'FicheClientView',
                params: { label: mission.Project.Customer.label },
              }"
            >
              <p
                class="text-h5 name"
                v-text="mission.Project.Customer.label"
              ></p>
              <p v-text="'Terminé le ' + formatDate(mission.end_date)"></p>
              <p
                v-text="mission.Project.label + ' / ' + mission.Project.adv"
              ></p>
              <p v-text="'TJM : ' + mission.TJMs.map((tjm) => tjm.value)"></p>
              <p v-if="mission.end" v-text="formatDate(mission.end)"></p>
            </router-link>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <!-- Partie basse avec les infos récap chiffré du collab -->
    <v-row>
      <v-col cols="6" lg="3" md="4" sm="6">
        <div class="shadow rounded-5 mt-5 p-4">
          <p class="etiquette mb-2">IK</p>
          <v-row justify="end">
            <p class="data m-2">254251</p>
          </v-row>
        </div>
      </v-col>
      <v-col cols="6" lg="3" md="4" sm="6">
        <div class="shadow rounded-5 mt-5 p-4">
          <p class="etiquette mb-2">PRU</p>
          <v-row justify="end">
            <p class="data m-2" v-text="pru"></p>
          </v-row>
        </div>
      </v-col>
      <v-col cols="6" lg="3" md="4" sm="6">
        <div class="shadow rounded-5 mt-5 p-4" v-if="associate.start_date">
          <p class="etiquette mb-2">Date d'embauche</p>
          <v-row justify="end">
            <p class="data m-2" v-text="formatDate(associate.start_date)"></p>
          </v-row>
        </div>
      </v-col>
      <v-col cols="6" lg="3" md="4" sm="6">
        <div class="shadow rounded-5 mt-5 p-4" v-if="associate.birthdate">
          <p class="etiquette mb-2">Age</p>
          <v-row justify="end">
            <p class="data m-2" v-text="calculateAge(associate.birthdate)"></p>
          </v-row>
        </div>
      </v-col>
      <v-col cols="6" lg="3" md="4" sm="6">
        <div class="shadow rounded-5 mt-5 p-4" v-if="associate.Graduation">
          <p class="etiquette mb-2">Diplôme</p>
          <v-row justify="end">
            <p class="data m-2" v-text="associate.Graduation.label"></p>
          </v-row>
        </div>
      </v-col>
    </v-row>

    <div v-if="associate.Missions.length != 0">
      <v-row>
        <h5 class="pt-3 sub-title">Suivi des missions</h5>
      </v-row>

      <v-row>
        <v-timeline
          side="end"
          align="start"
          v-for="mission in associate.Missions"
          :key="mission.id"
        >
          <v-timeline-item dot-color="deep-purple-lighten-3" size="small">
            <template v-slot:opposite>
              {{ formatDate(mission.end_date) }}
            </template>
            <div>
              <strong>{{
                mission.Project.label + " | " + mission.Project.adv
              }}</strong>
              <div class="text-caption">Fin de la mission</div>
            </div>
          </v-timeline-item>
          <v-timeline-item dot-color="deep-purple-darken-4" size="small">
            <template v-slot:opposite>
              {{ formatDate(mission.start_date) }}
            </template>
            <div>
              <strong>{{
                mission.Project.label + " | " + mission.Project.adv
              }}</strong>
              <div class="text-caption">Début de la mission</div>
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import AddMissionForm from "@/components/forms/AddMissionForm.vue";
import UpdateCollabForm from "@/components/forms/UpdateCollabForm.vue";
import UpdateMissionForm from "@/components/forms/UpdateMissionForm.vue";
import {
  format,
  isBefore,
  parseISO,
  isAfter,
  differenceInYears,
} from "date-fns";
import { fr } from "date-fns/locale";
export default {
  name: "FicheCollab",
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
      })
    },
    jobActuel() {
      let today = new Date();
      today = this.formatDateBDD(today);
      for (let job of this.associate.Jobs) {
        if (
          job.Associate_Job.end_date > today
        ) {
          this.job_id = job.id;
          this.job = job.label;
        }
      }
    },
    formatDate(date) {
      return (date = format(new Date(date), "PP", { locale: fr }));
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