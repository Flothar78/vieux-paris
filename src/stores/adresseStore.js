import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdresseStore = defineStore('adresse', () => {
  const adresse = ref('Paris')
  return { adresse }
})
