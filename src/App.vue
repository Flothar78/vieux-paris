<script setup>
import MapInstance from "./components/MapInstance.vue";
import PhotoInstance from "./components/PhotoInstance.vue";
</script>

<template>
  <div class="full-page">
    <MapInstance />
    <PhotoInstance />
  </div>
</template>

<style scoped>
.full-page {
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  height: 100vh;
}
</style>
