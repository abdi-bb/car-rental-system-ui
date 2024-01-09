<template>
    <div class="container-fluid pb-10" style="min-height: calc(100vh - 100px)">
      <CarRentalNavbar />
      <slot></slot>
    </div>
    <AppFooter />
  </template>
  
  <script>
  import CarRentalNavbar from "./Navbar.vue";
  import AppFooter from "./Footer.vue";
  
  export default {
    components: {
      CarRentalNavbar,
      AppFooter,
    },
  };
  </script>
  