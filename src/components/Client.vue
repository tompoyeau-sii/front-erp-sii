<template>
  <div class="container">
    <h1 class="pt-3 pb-3 title">Clients SII Le Mans</h1>
    <AddClientForm />
    <div class="row">
      <router-link
        class="col-2 client rounded-3 m-2 pt-3 shadow-sm"
        v-for="customer in customers"
        :key="customer.id"
        :to="{ name: 'FicheClientView', params: { label: customer.label } }"
      >
        <div>
          <p class="text-h5 name" v-text="customer.label"></p>
          <p>100 000€</p>
          <p :v-text="nbCollab"></p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AddClientForm from "@/components/forms/AddClientForm.vue";
import { mapGetters } from "vuex";
export default {
  name: "Client",
  components: {
    AddClientForm,
  },
  data() {
    return {
      customers: [],
      error: "",
      SuccessState: false,
      snackbar: false,
      test: this.$store.getters.getToken,
      nbCollab: 0,
    };
  },
  methods: {
    refresh() {
      this.customers = [];
      axios.get("http://localhost:8080/api/customers").then((res) => {
        this.customers = res.data?.customer;
      });
    },
  },
  created() {
    axios.get("http://localhost:8080/api/customers").then((res) => {
      this.customers = res.data?.customer;
      console.log(this.customers)
    });
  },
  computed: {
    ...mapGetters(["getToken"]),
  },
};
</script>

<style scoped>
td {
  margin-top: auto;
  margin-bottom: auto;
  vertical-align: middle;
}
.gradient {
  background: linear-gradient(135deg, #75519b 0%, #e84654 100%);
  color: white;
}

.client {
  background: linear-gradient(135deg, #7117ea 0%, #ea6060 100%);
  /* background: linear-gradient(135deg, #0FF0B3 0%, #036ED9 100%);
  background: linear-gradient(135deg, #65799B 0%, #5E2563 100%); */
  color: white;
  width: 20vh;
  min-width: 200px;
}

.name {
  font-weight: 600;
}
</style>
