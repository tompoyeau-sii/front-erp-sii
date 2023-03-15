<template>
    <Client />
    <myToolbar />
  </template>
  
  <script>
  import Client from "@/components/Client.vue";
  import myToolbar from "@/components/MyToolbar";
  export default {
    name: "ClientView",
  
    components: {
      Client,
      myToolbar,
    },
  };
  </script>
  