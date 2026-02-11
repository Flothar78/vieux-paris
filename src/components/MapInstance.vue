<template>
  <div class="container">
    <p>{{ store.adresse }}</p>
    <div id="map"></div>
  </div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { onMounted } from "vue";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useAdresseStore } from "@/stores/adresseStore";
const store = useAdresseStore();
const searchControl = new GeoSearchControl({
  provider: new OpenStreetMapProvider(),
  style: "bar",
});
console.log(searchControl);
const lat = 48.89;
const long = 2.36;
onMounted(() => {
  let map = L.map("map").setView([lat, long], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  map.addControl(searchControl);
  console.log(map.addControl(searchControl));
});
</script>

<style scoped>
.container {
  box-sizing: border-box;
  border: 2px solid red;
  width: 50vw;
  height: 50vh;
}
#map {
  border: black 4px solid;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  /* box-shadow: 2px 2px 4px blue; */
}
p {
  width: 30vw;
  text-align: center;
  margin: 10px 0;
}
</style>
