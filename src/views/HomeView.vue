<template>
    <Dashboard />
    <myToolbar />
</template>

<script>
// Components
import Dashboard from "@/components/Dashboard";
import myToolbar from "@/components/MyToolbar";
export default ({
  name: "HomeView",

  components: {
    Dashboard,
     myToolbar,
  },
});
</script>

<style scoped>
</style>