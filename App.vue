<template>
  <div id="app" >
    <div class="banner"></div>
    <div id="body" class="max-w-4xl mx-auto p-4">
      <SearchBar @search="fetchResults" />
      <ResultsGrid :results="results" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SearchBar from './components/SearchBar.vue';
import ResultsGrid from './components/ResultsGrid.vue';

export default {
  name: 'App',
  components: {
    SearchBar,
    ResultsGrid
  },
  data() {
    return {
      results: []
    };
  },
  methods: {
    fetchResults(query) {
      if (query.length > 2) {
        axios.get(`http://localhost:3000/search?q=${query}`)
          .then(response => {
            this.results = response.data.results;
          })
          .catch(error => {
            console.error("There was an error fetching the results:", error);
          });
      } else {
        this.results = [];
      }
    }
  }
};
</script>

<style>
#app {
  width: 100vw;
}

#body {
  max-width: 800px;
  padding: 20px;
  margin: 0 auto;
}

.banner {
  background-image: url("./assets/banner.png");
  background-size: cover;
  width: 100%;
  height: 400px;
}
</style>
