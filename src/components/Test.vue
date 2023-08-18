<template>
  <div>
    <p v-if="isLoadingCustomers">Loading customers...</p>
    <div v-else>
      <p v-if="customers.length > 0">Customers:</p>
      <ul>
        <li v-for="customer in customers" :key="customer.id">{{ customer.label }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "test",
  computed: {
    customers() {
      return this.$store.getters.getCustomers;
    },
    isLoadingCustomers() {
      return this.$store.getters.isLoadingCustomers;
    }
  },
};
</script>

<style>
</style>