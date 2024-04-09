<template>
  <v-dialog v-model="dialog" width="750px">
    <template v-slot:activator="{ props }">
      <v-btn
        class="mb-3"
        color="red-accent-2"
        icon="mdi-information-outline"
        variant="text"
        v-bind="props"
      ></v-btn>
    </template>
    <v-card class="gradient">
      <v-card-title>
        <v-row justify="center" class="mt-3">
          <h1 class="form-title">Le mode simulation</h1>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <p>
                Le mode simulation vous permet de modifier toutes les données
                comme vous le souhaitez. Ce mode n'impacte en rien les données
                de la version classique de PICSOU. Vous avez la possibilité
                d'enregistrer une simulation afin de pouvoir la recharger plus
                tard. Cette version de la simulation pourra être retrouvée en
                rechargeant celle-ci via la liste de versions. Si vous souhaitez
                réinitialiser les données de votre simulation avec celle de la
                production pour repartir sur une nouvelle base, cliquez sur
                "Réinitialiser les données de ma simulation".
                <strong>
                  Avant de réinitialiser les données, pensez à sauvegarder votre
                  simulation si vous souhaitez pouvoir revenir à cette version
                  plus tard.
                </strong>
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          prepend-icon="mdi-window-close"
          color="white"
          @click="(dialog = false), (error = '')"
        >
          Fermer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
</template>

<script>
export default {
  name: "AddClientForm",
  data() {
    return {
      dialog: false,
    };
  },
};
</script>

<style scoped>
.gradient {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}
.name {
  font-weight: 600;
}
</style>