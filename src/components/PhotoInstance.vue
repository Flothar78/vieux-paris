<template>
  <div class="container">
    <img
      class="displayed-photo"
      v-if="selectedImage"
      :src="selectedImage"
      :alt="selectedTitle"
    />
    <img
      class="displayed-photo"
      v-else
      src="../assets/12-rue-saint-mathieu-cafe-1904.jpg"
    />
    <div class="search-section">
      <label for="location">
        Lieu (ville, quartier):
        <input
          id="location"
          class="formulaire"
          v-model="location"
          placeholder="Ex: Paris Montmartre"
        />
      </label>

      <label for="keywords">
        Type de lieu ou période:
        <input
          id="keywords"
          class="formulaire"
          v-model="keywords"
          placeholder="Ex: café, 1900, rue, commerce"
          @keyup.enter="searchEuropeana"
        />
      </label>

      <label for="dateRange">
        Période (optionnel):
        <select id="dateRange" v-model="dateRange" class="formulaire">
          <option value="">Toutes les périodes</option>
          <option value="1800-1850">1800-1850</option>
          <option value="1850-1900">1850-1900</option>
          <option value="1900-1920">1900-1920</option>
          <option value="1920-1950">1920-1950</option>
        </select>
      </label>

      <button @click="searchEuropeana">Rechercher des photos</button>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>

    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="searchResults.length > 0" class="results-container">
      <p class="results-count">{{ totalResults }} résultats trouvés</p>
      <div class="previews-container">
        <div
          v-for="item in searchResults"
          :key="item.id"
          class="card"
          @click="selectImage(item)"
        >
          <img
            v-if="item.edmPreview"
            :src="item.edmPreview"
            :alt="item.title?.[0] || 'Image'"
            class="card-img"
          />
          <div v-else class="no-image">Pas d'aperçu</div>
          <div class="card-body">
            <strong class="card-title">{{ item.title?.[0] || "Sans titre" }}</strong>
            <p class="card-info" v-if="item.dcCreator">{{ item.dcCreator[0] }}</p>
            <p class="card-date" v-if="item.year">{{ item.year }}</p>
          </div>
        </div>
      </div>

      <button v-if="canLoadMore" @click="loadMore" class="load-more">
        Charger plus de résultats
      </button>
    </div>

    <div v-else-if="!loading && searchAttempted" class="no-results">
      Aucun résultat trouvé. Essayez avec d'autres critères de recherche.
      <div class="suggestions">
        <p><strong>Suggestions :</strong></p>
        <ul>
          <li>
            Utilisez des termes généraux : "Paris Montmartre" plutôt qu'une adresse
            précise
          </li>
          <li>Ajoutez des mots-clés : "café", "restaurant", "rue", "commerce"</li>
          <li>Essayez différentes périodes</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAdresseStore } from "@/stores/adresseStore";
import { ref } from "vue";

const store = useAdresseStore();

// Votre clé API Europeana
const API_KEY = "ectallendf";

const location = ref("Paris");
const keywords = ref("");
const dateRange = ref("");
const searchResults = ref([]);
const totalResults = ref(0);
const currentRows = ref(20);
const loading = ref(false);
const error = ref(null);
const selectedImage = ref(null);
const selectedTitle = ref("");
const searchAttempted = ref(false);

const canLoadMore = ref(false);

const buildQuery = () => {
  let queryParts = [];

  // Ajouter le lieu
  if (location.value) {
    queryParts.push(location.value);
  }

  // Ajouter les mots-clés
  if (keywords.value) {
    queryParts.push(keywords.value);
  }

  // Si aucune recherche, utiliser un terme par défaut
  if (queryParts.length === 0) {
    return "Paris";
  }

  return queryParts.join(" AND ");
};

const buildFilters = () => {
  let filters = ["TYPE:IMAGE"];

  // Ajouter le filtre de date si sélectionné
  if (dateRange.value) {
    const [yearStart, yearEnd] = dateRange.value.split("-");
    filters.push(`YEAR:[${yearStart} TO ${yearEnd}]`);
  }

  return filters;
};

const searchEuropeana = async (loadMoreMode = false) => {
  const searchQuery = buildQuery();
  const filters = buildFilters();

  if (!loadMoreMode) {
    currentRows.value = 20;
  }

  loading.value = true;
  error.value = null;
  searchAttempted.value = true;

  try {
    const params = {
      wskey: API_KEY,
      query: searchQuery,
      qf: filters,
      thumbnail: "true",
      rows: currentRows.value,
      profile: "standard",
      media: "true",
    };

    const url = new URL("https://api.europeana.eu/record/v2/search.json");
    url.search = new URLSearchParams(params).toString();

    console.log("Recherche:", searchQuery);
    console.log("Filtres:", filters);
    console.log("URL:", url.toString());

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const json = await response.json();

    if (json.success === false) {
      throw new Error(json.error || "Erreur lors de la recherche");
    }

    searchResults.value = json.items || [];
    totalResults.value = json.totalResults || 0;
    canLoadMore.value = searchResults.value.length < totalResults.value;

    console.log(`${totalResults.value} résultats trouvés`);
  } catch (err) {
    console.error("Erreur lors de la recherche:", err);
    error.value = "Erreur lors de la recherche. Vérifiez votre clé API.";
    searchResults.value = [];
    totalResults.value = 0;
    canLoadMore.value = false;
  } finally {
    loading.value = false;
  }
};

const loadMore = () => {
  currentRows.value += 20;
  searchEuropeana(true);
};

const selectImage = (item) => {
  selectedImage.value = item.edmPreview;
  selectedTitle.value = item.title?.[0] || "Image Europeana";

  // Optionnel: sauvegarder l'info dans le store
  if (item.dcDescription && item.dcDescription.length > 0) {
    console.log("Description:", item.dcDescription[0]);
  }
};
</script>

<style scoped>
.container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
}

.displayed-photo {
  position: fixed;
  object-fit: cover;
  width: 50vw;
  height: 50vh;
  margin-bottom: 20px;
  border-radius: 8px;
  z-index: 100;
}

.search-section {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-weight: 500;
}

.formulaire {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
}

.formulaire:focus {
  outline: none;
  border-color: #4caf50;
}

button {
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #45a049;
}

button:active {
  transform: scale(0.98);
}

.load-more {
  margin-top: 20px;
  background-color: #2196f3;
}

.load-more:hover {
  background-color: #0b7dda;
}

.loading {
  padding: 20px;
  text-align: center;
  color: #666;
  font-style: italic;
}

.error {
  position: absolute;
  bottom: 0;
  padding: 15px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  margin: 10px 0;
  width: 100%;
}

.no-results {
  /* border: blue 2px solid; */
  position: absolute;
  bottom:10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
  color: #777;
  width: 50%;
}

.suggestions {
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  background-color: #e3f2fd;
  border-radius: 4px;
  text-align: left;
}

.suggestions ul {
  margin-top: 10px;
  padding-left: 20px;
}

.suggestions li {
  margin: 5px 0;
}

.results-container {
  position: fixed;
  top: 50vh;
  width: 50%;
  height: calc(50vh - 20px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
  background-color: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  z-index: 15;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.results-count {
  margin-bottom: 15px;
  font-weight: 500;
  color: #333;
}

.previews-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  width: 100%;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.no-image {
  width: 100%;
  height: 180px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 12px;
}

.card-body {
  padding: 12px;
  background-color: #fafafa;
}

.card-title {
  font-size: 13px;
  display: block;
  overflow: hidden;
  line-height: 1.4;
  margin-bottom: 5px;
}

.card-info {
  font-size: 11px;
  color: #888;
  margin: 3px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-date {
  font-size: 11px;
  color: #666;
  margin: 0;
  font-weight: 600;
}
</style>
