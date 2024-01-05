<template>
  <div>
    <h2>Reviews for Car {{ carName }}</h2>
    <ul v-if="reviews.length > 0">
      <li v-for="review in reviews" :key="review.id">
        <router-link :to="{ name: 'CarReviewDetail', params: { carId: $route.params.carId, reviewId: review.id }}">
          {{ review.username }} - Rating: {{ review.rating }}
        </router-link>
      </li>
    </ul>
    <p v-else>No reviews yet.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      reviews: [],
      carName: '',
    };
  },
  methods: {
    fetchReviews() {
      const carId = this.$route.params.carId;
      axios.get(`http://127.0.0.1:8000/api/v1/cars/${carId}/reviews`)
        .then(response => {
          this.reviews = response.data;
          this.fetchCarName();
        })
        .catch(error => {
          console.error('Error fetching reviews:', error);
        });
    },
    fetchCarName() {
      // Fetch the car name using the carId
      const carId = this.$route.params.carId;
      axios.get(`http://127.0.0.1:8000/api/v1/cars/${carId}/`)
        .then(response => {
          this.carName = response.data.name;
        })
        .catch(error => {
          console.error('Error fetching car name:', error);
        });
    },
  },
  created() {
    this.fetchReviews();
  },
};
</script>

<style>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  cursor: pointer;
}

li:hover {
  text-decoration: underline;
}
</style>
