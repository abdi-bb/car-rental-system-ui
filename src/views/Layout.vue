<template>
  <div class="container-fluid pb-10" style="min-height: calc(100vh - 100px)">
    <Navbar />
    <slot></slot>
  </div>
  <AppFooter />
</template>

<script setup>
  import Navbar from "./Navbar.vue";
  import AppFooter from "./AppFooter.vue";
</script>
