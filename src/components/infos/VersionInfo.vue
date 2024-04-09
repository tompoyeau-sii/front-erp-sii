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
          <h1 class="form-title">Les versions</h1>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <p>
                Voici la liste des différentes versions de votre simulation que
                vous avez sauvegardé. Vous pouvez choisir la sauvegarde que vous
                souhaitez et cliquer sur "Charger la version" pour revenir à
                l'état de celle-ci.
                <strong>
                  Attention revenir à une version n'effectue pas de sauvegarde
                  sur l'état actuel de votre simulation, veuillez effectuer une
                  sauvegarde avant si vous souhaitez pouvoir revenir dessus plus
                  tard.
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