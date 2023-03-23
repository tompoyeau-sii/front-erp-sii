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
              <p v-text="'Poste | ' + associate.telephone"></p>
            </div>
          </div>
        </div>

        <div class="row ma-5">
          <!-- Client part -->
          <div class="col-6">
            <h5 class="pt-3 sub-title">Travail actuellement pour</h5>
            <div class="row">
                <router-link
                  class="col-2 client rounded-3 m-2 pt-3 shadow-sm"
                  v-for="mission in filteredMissions"
                  :key="mission.id"
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
                    <p
                      v-text="'Depuis le ' + formatDate(mission.start_date)"
                    ></p>
                    <p v-text="mission.Project.label"></p>
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
                v-for="mission in filteredMissions"
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
        </div>
      </div>

      <!-- Layout droit avec les infos récap chiffré du collab -->
      <div class="col-3">
        <div class="shadow rounded-5 mt-5 p-4" v-if="associate.telephone">
          <p class="etiquette mb-2">TJM</p>
          <v-row justify="end">
            <p class="data m-2" v-text="associate.telephone"></p>
          </v-row>
        </div>

        <div class="shadow rounded-5 mt-5 p-4" v-if="associate.telephone">
          <p class="etiquette mb-2">PRU</p>
          <v-row justify="end">
            <p class="data m-2" v-text="associate.telephone"></p>
          </v-row>
        </div>

        <div class="shadow rounded-5 mt-5 p-4" v-if="associate.telephone">
          <p class="etiquette mb-2">IK</p>
          <v-row justify="end">
            <p class="data m-2" v-text="associate.telephone"></p>
          </v-row>
        </div>

        <div class="shadow rounded-5 mt-5 p-4" v-if="associate.telephone">
          <p class="etiquette mb-2">Coef</p>
          <v-row justify="end">
            <p class="data m-2" v-text="associate.telephone"></p>
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
import {
  format,
  isBefore,
  parseISO,
  isAfter,
  differenceInYears,
} from "date-fns";
export default {
  name: "FicheCollab",
  data() {
    return {
      associate: [],
      todayDate: "",
    };
  },
  methods: {
    calculateAge(dateOfBirth) {
      const today = new Date();
      return differenceInYears(today, new Date(dateOfBirth));
    },
    formatDate(date) {
      return (date = format(new Date(date), "dd/MM/yyyy"));
    },
    missionEnCours(mission_start, mission_end) {
      const now = new Date();
      const start = parseISO(mission_start);
      const end = mission_end ? parseISO(mission_end) : null;

      if (isBefore(start, now)) {
        if (end == null || isAfter(end, now)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
  created() {
    this.associate = this.$route.params.collab;
    function formatDate(date) {
      return (date = format(new Date(date), "dd/MM/yyyy"));
    }
    this.todayDate = formatDate(new Date());
    console.log(this.todayDate);
  },
  computed: {
    filteredMissions() {
      return this.associate.Missions.filter((mission) => {
        return this.missionEnCours(mission.start_date, mission.end_date);
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

.gradient {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
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