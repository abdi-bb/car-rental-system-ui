<template>
  <div class="mt-24">
    <h2 class="text-2xl font-bold mb-4">Reviews for Car {{ carName }}</h2>

    

    <!-- Retreive the reviews from the API --> 
    <div v-if="isLoading" class="text-gray-500">Loading...</div>
    <ul v-else-if="formattedReviews.length > 0" class="space-y-4">
      <li v-for="review in formattedReviews" :key="review.id" class="bg-white rounded-md shadow-md p-4">
        <router-link :to="{ name: 'ReviewDetail', params: { carId: $route.params.carId, reviewId: review.id }}">
          <div class="flex flex-col">
            <div class="flex items-center">
              <span class="text-lg font-semibold">{{ review.username }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500 ml-2">Rating: {{ review.rating }}</span>
            </div>
            <div class="flex items-center">
              <p class="mt-2 text-gray-700">Comment: {{ review.description }}</p>
            </div>
            <div class="flex items-center">
              <span class="text-gray-500">{{ review.readableDate }}</span>
            </div>
          </div>
        </router-link>
      </li>
    </ul>
    <p v-else class="text-gray-500">No reviews yet.</p>
  </div>

  <!-- Form for adding a new car -->
  <form v-if="!isStaff" @submit.prevent="reviewCar" class="bg-gray-100 p-4">
    <div class="space-y-4">
      <div class="bg-white rounded-md shadow-md p-4">
        <div class="flex flex-col space-y-4">
          <div class="flex items-center">
            <label for="rating" class="text-lg font-semibold">Rating</label>
            <input v-model="newReview.rating" type="number" id="rating" required class="border p-2" />
          </div>

          <div class="flex flex-col">
            <div class="flex justify-between">
              <label for="description" class="text-lg font-semibold">Description</label>
            </div>
            <textarea v-model="newReview.description" id="description" required rows="4" class="resize-none border p-2"></textarea>
          </div>

          <button type="button" @click="reviewCar" class="bg-green-500 text-white px-4 py-2 rounded mt-4">
            Post Your Comment
          </button>
        </div>
      </div>
    </div>
  </form>

</template>

<script>
import axios from 'axios';
import DateService from '../../services/DateService';

export default {
  name: 'ReviewsList',
  components: {},
  data() {
    return {
      reviews: [],
      carName: '',
      isLoading: true,
      newReview: {
        rating: '',
        description: '',
      },
      isStaff: false,
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
      const carId = this.$route.params.carId;
      axios.get(`http://127.0.0.1:8000/api/v1/cars/${carId}/`)
        .then(response => {
          this.carName = response.data.name;
          this.isLoading = false; // Set loading to false once data is loaded
        })
        .catch(error => {
          console.error('Error fetching car name:', error);
        });
    },
    // Access the formatReadableDate function from the imported DateService
    formatReadableDate(dateString) {
      return DateService.formatReadableDate(dateString);
    },
    async reviewCar() {
      try {
        const accessToken = localStorage.getItem('accessToken');

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
        };

        const requestBody = {
          rating: this.newReview.rating,
          description: this.newReview.description,
        };

        const carId = this.$route.params.carId;
        await axios.post(`http://localhost:8000/api/v1/cars/${carId}/reviews/`, requestBody, { headers });
        this.fetchReviews();
        this.newReview = {
          rating: '',
          description: '',
        };
      } catch (error) {
        console.error(error);
      }
    },
  },
  computed: {
    formattedReviews() {
      // Compute formattedReviews based on the existing reviews data
      return this.reviews.map(newReview => ({
        ...newReview,
        readableDate: this.formatReadableDate(newReview.created_at),
      }));
    },
  },
  created() {
    this.fetchReviews();
    this.$store.dispatch('initializeApp').then(() => {
      this.isStaff = this.$store.state.isStaff;
    });
  },
};
</script>

<style>
</style>
