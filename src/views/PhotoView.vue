<template>
  <div class="photo-map-container">
    <PhotoInstance />
    <!-- <MapInstance /> -->
  </div>
</template>

<script setup>
import PhotoInstance from "@/components/PhotoInstance.vue";
import MapInstance from "@/components/MapInstance.vue";
</script>

<style>
.photo-map-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
