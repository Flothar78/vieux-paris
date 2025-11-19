<script setup>
import MapInstance from "./components/MapInstance.vue";
import PhotoInstance from "./components/PhotoInstance.vue";
</script>

<template>
  <div class="full-page">
 
      <PhotoInstance />
      <MapInstance />

  </div>
</template>

<style scoped>
.full-page {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
