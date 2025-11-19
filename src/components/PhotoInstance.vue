<template>
  <div class="container">
    <img src="../assets/12-rue-saint-mathieu-cafe-1904.jpg" />
    <label for="text"
      >Adresse du lieu: <input class="formulaire" v-model="store.adresse" 
    /></label>
    
  </div>
</template>

<script setup>
import { useAdresseStore } from "@/stores/adresseStore";
// import { ref } from "vue";
const store = useAdresseStore()

</script>

<style scoped>
.container {
  box-sizing: border-box;
  border: 2px solid red;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 50vw;
  height: 100vh;
}
img {
  object-fit: cover;
}
</style>
