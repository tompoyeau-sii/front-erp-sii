<template>
  <v-container>
    <v-tabs v-model="tab" color="deep-purple-darken-3" align-tabs="center">
      <v-tab value="1">Managers</v-tab>
      <v-tab value="2">Agence</v-tab>
      <v-tab value="3">Clients</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="1">
        <v-container>
          <v-row>
            <v-col cols="12" lg="6">
              <v-select
                v-model="manager"
                label="Manager"
                :items="managers"
                item-title="full_name"
                item-value="id"
                variant="solo"
              ></v-select>
            </v-col>
            <v-col cols="12" lg="6">
              <v-select
                v-model="yearSelected"
                label="Année"
                :items="years"
                item-title="full_name"
                item-value="id"
                variant="solo"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="12">
              <GChart
                v-if="dataLoadedManager"
                type="LineChart"
                class="shadow"
                :options="chart.managerOptions"
                :data="chart.managerData"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="12">
              <GChart
                v-if="dataLoadedManager"
                type="ColumnChart"
                class="shadow"
                :options="chart.managerMargeOptions"
                :data="chart.managerMargeData"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
      <v-window-item value="2">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="yearSelected"
                label="Année"
                :items="years"
                item-title="full_name"
                item-value="id"
                variant="solo"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <GChart
                type="LineChart"
                class="shadow"
                :options="chart.caOptions"
                :data="chart.caData"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
      <v-window-item value="3">
        <v-col cols="12">
          <GChart
            type="ColumnChart"
            class="shadow"
            :data="chart.customerData"
            :options="chart.customerOptions"
          />
        </v-col>
        <!-- <GChart
          type="PieChart"
          :options="chart.pariteOptions"
          :data="chart.pariteData"
        /> -->
        <v-col cols="12">
          <v-select
            v-model="customerSelected"
            label="Client"
            :items="customers"
            item-title="label"
            item-value="id"
            variant="solo"
          ></v-select>

          <GChart
            v-if="dataLoadedCustomer"
            type="LineChart"
            class="shadow"
            :data="chart.customerCaData"
            :options="chart.customerCaOptions"
          />
        </v-col>
        
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script>
import Axios from "@/_services/caller.service";
import { GChart } from "vue-google-charts";
import {
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  format,
  getYear,
  getMonth,
  eachDayOfInterval,
  isWeekend 
} from "date-fns";
import { fr } from "date-fns/locale";
export default {
  name: "Statistiques",
  components: { GChart },
  data() {
    return {
      // Select
      yearSelected: 2023,
      customerSelected: null,
      //Liste initialisé par les listes de données reçu par l'API
      managers: [],
      projects: [],
      customers: [],
      caForMonths: [],
      caOfCustomer: [],
      filteredCustomers: [],
      nbHommes: 0,
      nbFemmes: 0,
      intercontrats: [],
      manager: null,
      tab: null,
      associates: [],
      missions: [],
      years: [2020, 2021, 2022, 2023, 2024, 2025],
      projectsOfManager: [],

      //Data loarder
      dataLoadedManager: false, // propriété pour savoir si les données sont chargées ou non
      dataLoadedCustomer: false,
      
      chart: {
        //Parité homme /femme
        pariteData: [],
        pariteOptions: [],
        //graphique ca des managers
        managerData: [],
        managerOptions: [],
        //graphique marge des managers
        managerMargeData: [],
        managerMargeOptions: [],
        //graphique nb collab chez les clients
        customerData: [],
        customerOptions: [],
        //graphique ca par client
        customerCaData: [],
        customerCaOptions: [],
        //ca global de l'agence
        caData: [],
        caOptions: [],
      },
    };
  },
  created() {
    Axios.get("/missions").then((res) => {
      this.missions = res.data?.mission;
    });
    Axios.get("/customers").then((res) => {
      this.customers = res.data?.customer;
      this.filteredCustomers = this.filterAssociate(this.customers);
      this.chart.customerData = [
        ["Client", "Collaborateurs"],
        ...this.filteredCustomers.map(({ label, nbCollab }) => [
          label,
          nbCollab,
        ]),
      ];
      this.chart.customerOptions = {
        title: "Nombre de collaborateurs par clients",
        colors: ['#4527A0']
      };
    });
    Axios.get("/associates/managers").then((res) => {
      //this.managers = res.data?.associate;
      res.data?.associate.forEach((job) => {
        job.Associates.forEach((manager) => {
          if (
            manager.Associate_Job.start_date < this.todayDate() &&
            manager.Associate_Job.end_date > this.todayDate()
          ) {
            manager.full_name = manager.first_name + " " + manager.name;
            this.managers.push(manager);
          }
        });
      });
    });
    Axios.get("/associates/pdc").then((res) => {
      this.associates = res.data?.associate;
      this.associates.forEach((associate) => {
        if (associate.gender_id == 1) {
          this.nbHommes++;
        } else if (associate.gender_id == 2) {
          this.nbFemmes++;
        }
        if (associate.Missions.length == 0) {
          this.intercontrats.push(associate);
        } else {
          var enMission = false;
          associate.Missions.forEach((mission) => {
            if (
              mission.start_date <= this.todayDate() &&
              mission.end_date >= this.todayDate()
            ) {
              enMission = true;
              return;
            }
          });
          if (enMission == false) {
            this.intercontrats.push(associate);
          }
        }
      });
      this.chart.pariteData = [
        ["Genre", "Population"],
        ["Hommes", this.nbHommes][("Femmes", this.nbFemmes)],
      ];
      this.chart.pariteOptions = {
        title: "Parité Hommes/Femmes",
      };
      this.intercontrats.nbCollab = this.intercontrats.length;
    });
    Axios.get("/projects").then((res) => {
      this.projects = res.data?.project;
      this.getCaGlobal(this.generateMonthList(2023));
      (this.chart.caData = [
        ["Mois", "CA"],
        ...this.caForMonths.map(({ month, value }) => [month, value]),
      ]),
        (this.chart.caOptions = {
          title: "Chiffre d'affaire de l'agence",
          colors: ['#4527A0']
        });
    });
  },

  watch: {
    manager(newManager) {
      this.ca = this.getCaOfManager(
        this.generateMonthList(this.yearSelected),
        newManager
      );
      this.marge = this.getMargeOfManager(
        this.generateMonthList(this.yearSelected),
        newManager
      );

      (this.chart.managerData = [
        ["Mois", "CA"],
        ...this.ca.map(({ month, value }) => [month, value]),
      ]),
        (this.chart.managerOptions = {
          title: "Chiffre d'affaire du manager",
          colors: ['#4527A0'],
        });

      (this.chart.managerMargeData = [
        ["Mois", "Marge"],
        ...this.marge.map(({ month, value }) => [month, value]),
      ]),
        (this.chart.managerMargeOptions = {
          title: "Marge du manager",
          colors: ['#4527A0'],
        });
      this.dataLoadedManager = true;
    },
    yearSelected(newYear) {
      if (this.manager) {
        this.ca = this.getCaOfManager(
          this.generateMonthList(newYear),
          this.manager
        );

        (this.chart.managerData = [
          ["Mois", "CA"],
          ...this.ca.map(({ month, value }) => [month, value]),
        ]),
          (this.chart.managerOptions = {
            title: "Chiffre d'affaire du manager",
            colors: ['#4527A0'],
          });
        this.dataLoaded = true;
      }
      this.getCaGlobal(this.generateMonthList(newYear));
      this.chart.caData = [
        ["Mois", "CA"],
        ...this.caForMonths.map(({ month, value }) => [month, value]),
      ];
    },
    customerSelected(newCustomer) {
      this.caOfCustomer = this.getCaOfCustomer(
        this.generateMonthList(this.yearSelected),
        newCustomer
      );
      (this.chart.customerCaData = [
        ["Mois", "CA"],
        ...this.caOfCustomer.map(({ month, value }) => [month, value]),
      ]),
        (this.chart.customerCaOptions = {
          title: "Chiffre d'affaire du client",
          colors: ['#4527A0'],
        });
      this.dataLoadedCustomer = true;
    },
  },

  methods: {
    //Méthode afin de récupérer la date du jour
    todayDate() {
      return format(new Date(), "yyyy/MM/dd");
    },
    //Permet de retourner le nombre de nb collaborateurs que possède un client sans doublon
    filterAssociate(customers) {
      const result = [];

      customers.forEach((customer) => {
        const associateIds = new Set();

        customer.Projects.forEach((project) => {
          project.Missions.forEach((mission) => {
            associateIds.add(mission.associate_id);
          });
        });

        const nbCollab = associateIds.size;

        const customerResult = {
          label: customer.label,
          nbCollab: nbCollab,
        };
        result.push(customerResult);
      });

      return result;
    },
    getWorkingDaysInMonth(year, month) {
      // Attendre que getOffDays ait fini son traitement avant de continuer

      let startDate = new Date(year, month, 1);
      let endDate = new Date(year, month + 1, 0);

      const allDays = eachDayOfInterval({ start: startDate, end: endDate });
      const workingDays = allDays.filter((day) => !isWeekend(day));

      let nbJours = workingDays.length;

      return nbJours;
    },
    //Génére la liste des mois de l'année passée en paramètre allant de S14 à S13
    generateMonthList(year) {
      const list_start = startOfMonth(new Date(year, 3, 1));
      const list_end = startOfMonth(new Date(year + 1, 2, 1));
      const monthsList = eachMonthOfInterval({
        start: list_start,
        end: list_end,
        monthStartsOn: 1,
      });

      const allMonths = monthsList.map((date) => {
        const month = format(date, "MMMM", { locale: fr });
        const startDateOfMonth = startOfMonth(date, { weekStartsOn: 1 });
        const endDateOfMonth = endOfMonth(date, { weekEndsOn: 1 });

        let nbDay = this.getWorkingDaysInMonth(
          getYear(startDateOfMonth),
          getMonth(startDateOfMonth)
        );

        // console.log(format(startDateOfMonth, "yyyy-MM-dd") + ' : ' + nbDay)

        return {
          monthNumber: month,
          start_date: format(startDateOfMonth, "yyyy-MM-dd"),
          end_date: format(endDateOfMonth, "yyyy-MM-dd"),
          nb_day: nbDay,
        };
      });
      // console.log(allMonths)
      return allMonths;
    },
    //Retourne pour chaque mois, le chiffre d'affaire d'un client passé en paramètre
    getCaOfCustomer(months, customerSelected) {
      let ca = 0;
      this.caOfCustomer = [];
      this.customers.forEach((customer) => {
        if (customer.id == customerSelected) {
          months.forEach((month) => {
            customer.Projects.forEach((project) => {
              project.Missions.forEach((mission) => {
                if (
                  mission.start_date <= month.start_date &&
                  mission.end_date >= month.end_date
                ) {
                  mission.TJMs.forEach((tjm) => {
                    if (
                      tjm.start_date <= month.start_date &&
                      tjm.end_date >= month.end_date
                    ) {
                      ca += tjm.value * month.nb_day
                    }
                  });
                  mission.Associate.PRUs.forEach((pru) => {
                    if (
                      pru.start_date <= month.start_date &&
                      pru.end_date >= month.end_date
                    ) {
                      ca -= pru.value * month.nb_day;
                    }
                  });
                } else if (
                  mission.start_date >= month.start_date &&
                  mission.start_date < month.end_date
                ) {
                  mission.TJMs.forEach((TJM) => {
                    if (
                      TJM.start_date <= month.start_date &&
                      TJM.end_date >= month.end_date
                    ) {
                      ca += TJM.value * month.nb_day;
                    } else if (
                      TJM.start_date >= month.start_date &&
                      TJM.start_date < month.end_date
                    ) {
                      ca += TJM.value * month.nb_day;
                    }
                  });
                  mission.Associate.PRUs.forEach((PRU) => {
                    if (
                      PRU.start_date <= month.start_date &&
                      PRU.end_date >= month.end_date
                    ) {
                      ca -= PRU.value * month.nb_day;
                    } else if (
                      PRU.start_date >= month.start_date &&
                      PRU.start_date < month.end_date
                    ) {
                      ca -= PRU.value * month.nb_day;
                    }
                  });
                  //Si la mission termine pendant le mois en cours
                } else if (
                  mission.end_date >= month.start_date &&
                  mission.end_date <= month.end_date
                ) {
                  mission.TJMs.forEach((TJM) => {
                    if (
                      TJM.start_date <= month.start_date &&
                      TJM.end_date >= month.end_date
                    ) {
                      ca += TJM.value * month.nb_day;
                    } else if (
                      TJM.end_date >= month.start_date &&
                      TJM.end_date < month.end_date
                    ) {
                      ca += TJM.value * month.nb_day;
                    }
                  });
                  mission.Associate.PRUs.forEach((PRU) => {
                    if (
                      PRU.start_date <= month.start_date &&
                      PRU.end_date >= month.end_date
                    ) {
                      ca -= PRU.value * month.nb_day;
                    } else if (
                      PRU.end_date >= month.start_date &&
                      PRU.end_date < month.end_date
                    ) {
                      ca -= PRU.value * month.nb_day;
                    }
                  });
                }
              });
            });
            this.caOfCustomer.push({ month: month.monthNumber, value: ca });
          });
        }
      });
      return this.caOfCustomer;
    },
    //Retourne pour chaque mois, le chiffre d'affaire d'un manager passé en paramètre
    getCaOfManager(months, managerSelected) {
      this.ca = [];
      let value = 0;
      this.managers.forEach((manager) => {
        if (manager.id == managerSelected) {
          months.forEach((month) => {
            manager.PRUs.forEach((PRU) => {
              if (
                PRU.start_date <= month.end_date && // Vérifie si la date de début du PRU est antérieure ou égale à la date de fin du mois
                PRU.end_date >= month.start_date // Vérifie si la date de fin du PRU est postérieure ou égale à la date de début du mois
              ) {
                value -= PRU.value * month.nb_day;
              }
            });
            manager.Projects.forEach((project) => {
              project.Missions.forEach((mission) => {
                // Si la mission commence avant et fini après le mois en cours
                if (
                  mission.start_date <= month.start_date &&
                  mission.end_date >= month.end_date
                ) {
                  mission.TJMs.forEach((TJM) => {
                    if (
                      TJM.start_date <= month.start_date &&
                      TJM.end_date >= month.end_date
                    ) {
                      value += TJM.value * month.nb_day;
                    }
                  });
                  mission.Associate.PRUs.forEach((PRU) => {
                    if (
                      PRU.start_date <= month.start_date &&
                      PRU.end_date >= month.end_date
                    ) {
                      value -= PRU.value * month.nb_day;
                    }
                  });
                  //Si la mission commence pendant le mois en cours
                } else if (
                  mission.start_date >= month.start_date &&
                  mission.start_date < month.end_date
                ) {
                  mission.TJMs.forEach((TJM) => {
                    if (
                      TJM.start_date <= month.start_date &&
                      TJM.end_date >= month.end_date
                    ) {
                      value += TJM.value * month.nb_day;
                    } else if ( 
                      TJM.start_date >= month.start_date &&
                      TJM.start_date < month.end_date
                    ) {
                      value += TJM.value * month.nb_day;
                    }
                  });
                  mission.Associate.PRUs.forEach((PRU) => {
                    if (
                      PRU.start_date <= month.start_date &&
                      PRU.end_date >= month.end_date
                    ) {
                      value -= PRU.value * month.nb_day;
                    } else if (
                      PRU.start_date >= month.start_date &&
                      PRU.start_date < month.end_date
                    ) {
                      value -= PRU.value * month.nb_day;
                    }
                  });
                  //Si la mission termine pendant le mois en cours
                } else if (
                  mission.end_date >= month.start_date &&
                  mission.end_date <= month.end_date
                ) {
                  mission.TJMs.forEach((TJM) => {
                    if (
                      TJM.start_date <= month.start_date &&
                      TJM.end_date >= month.end_date
                    ) {
                      value += TJM.value * month.nb_day;
                    } else if (
                      TJM.end_date >= month.start_date &&
                      TJM.end_date < month.end_date
                    ) {
                      value += TJM.value * month.nb_day;
                    }
                  });
                  mission.Associate.PRUs.forEach((PRU) => {
                    if (
                      PRU.start_date <= month.start_date &&
                      PRU.end_date >= month.end_date
                    ) {
                      value -= PRU.value * month.nb_day;
                    } else if (
                      PRU.end_date >= month.start_date &&
                      PRU.end_date < month.end_date
                    ) {
                      value -= PRU.value * month.nb_day;
                    }
                  });
                }
              });
            });
            this.ca.push({ month: month.monthNumber, value: value });
          });
        }
      });
      return this.ca;
    },
    getMargeOfManager(months, managerSelected) {
      this.marge = [];
      this.managers.forEach((manager) => {
        if (manager.id == managerSelected) {
          months.forEach((month) => {
            let value = 0;
            manager.PRUs.forEach((PRU) => {
              if (
                PRU.start_date <= month.end_date && // Vérifie si la date de début du PRU est antérieure ou égale à la date de fin du mois
                PRU.end_date >= month.start_date // Vérifie si la date de fin du PRU est postérieure ou égale à la date de début du mois
              ) {
                value -= PRU.value * month.nb_day;
              }
            });
            manager.Projects.forEach((project) => {
              project.Missions.forEach((mission) => {
                // Si la mission commence avant et fini après le mois en cours
                if (
                  mission.start_date <= month.start_date &&
                  mission.end_date >= month.end_date
                ) {
                  mission.TJMs.forEach((TJM) => {
                    if (
                      TJM.start_date <= month.start_date &&
                      TJM.end_date >= month.end_date
                    ) {
                      value += TJM.value * month.nb_day;
                    }
                  });
                  mission.Associate.PRUs.forEach((PRU) => {
                    if (
                      PRU.start_date <= month.start_date &&
                      PRU.end_date >= month.end_date
                    ) {
                      value -= PRU.value * month.nb_day;
                    }
                  });
                  //Si la mission commence pendant le mois en cours
                } else if (
                  mission.start_date >= month.start_date &&
                  mission.start_date < month.end_date
                ) {
                  mission.TJMs.forEach((TJM) => {
                    if (
                      TJM.start_date <= month.start_date &&
                      TJM.end_date >= month.end_date
                    ) {
                      value += TJM.value * month.nb_day;
                    } else if ( 
                      TJM.start_date >= month.start_date &&
                      TJM.start_date < month.end_date
                    ) {
                      value += TJM.value * month.nb_day;
                    }
                  });
                  mission.Associate.PRUs.forEach((PRU) => {
                    if (
                      PRU.start_date <= month.start_date &&
                      PRU.end_date >= month.end_date
                    ) {
                      value -= PRU.value * month.nb_day;
                    } else if (
                      PRU.start_date >= month.start_date &&
                      PRU.start_date < month.end_date
                    ) {
                      value -= PRU.value * month.nb_day;
                    }
                  });
                  //Si la mission termine pendant le mois en cours
                } else if (
                  mission.end_date >= month.start_date &&
                  mission.end_date <= month.end_date
                ) {
                  mission.TJMs.forEach((TJM) => {
                    if (
                      TJM.start_date <= month.start_date &&
                      TJM.end_date >= month.end_date
                    ) {
                      value += TJM.value * month.nb_day;
                    } else if (
                      TJM.end_date >= month.start_date &&
                      TJM.end_date < month.end_date
                    ) {
                      value += TJM.value * month.nb_day;
                    }
                  });
                  mission.Associate.PRUs.forEach((PRU) => {
                    if (
                      PRU.start_date <= month.start_date &&
                      PRU.end_date >= month.end_date
                    ) {
                      value -= PRU.value * month.nb_day;
                    } else if (
                      PRU.end_date >= month.start_date &&
                      PRU.end_date < month.end_date
                    ) {
                      value -= PRU.value * month.nb_day;
                    }
                  });
                }
              });
            });
            this.marge.push({ month: month.monthNumber, value: value });
          });
        }
      });
      return this.marge;
    },
    //Retourne pour chaque mois, le chiffre d'affaire de l'agence
    getCaGlobal(months) {
      let ca = 0;
      this.caForMonths = [];
      months.forEach((month) => {
        this.associates.forEach((associate) => {
          associate.PRUs.forEach((PRU) => {
            if (
              PRU.start_date <= month.start_date &&
              PRU.end_date >= month.end_date
            ) {
              ca -= PRU.value * month.nb_day;
            } else if (
              PRU.start_date >= month.start_date &&
              PRU.start_date <= month.end_date
            ) {
              ca -= PRU.value * month.nb_day;
            } else if (
              PRU.end_date >= month.start_date &&
              PRU.end_date <= month.end_date
            ) {
              ca -= PRU.value * month.nb_day;
            }
          });
        });
        this.missions.forEach((mission) => {
          mission.TJMs.forEach((tjm) => {
            if (
              tjm.start_date <= month.start_date &&
              tjm.end_date >= month.end_date
            ) {
              ca += tjm.value * month.nb_day;
            } else if (
              tjm.start_date >= month.start_date &&
              tjm.start_date <= month.end_date
            ) {
              ca += tjm.value * month.nb_day;
            } else if (
              tjm.end_date >= month.start_date &&
              tjm.end_date <= month.end_date
            ) {
              ca += tjm.value * month.nb_day;
            }
          });
        });
        this.caForMonths.push({ month: month.monthNumber, value: ca });
      });
    },
  },
};
</script>
