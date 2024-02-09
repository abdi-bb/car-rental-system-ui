<template>
  <div class="mt-24">
    <h2 class="text-2xl font-bold mb-4">Reviews for Car {{ carName }}</h2>

    <!-- Success and error messages -->
    <div v-if="successMessage" class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md mb-4 w-1/2">
      <div class="flex items-center justify-between">
        <span>{{ successMessage }}</span>
        <button @click="clearMessages" class="text-green-700 hover:text-green-900 focus:outline-none">
          X
        </button>
      </div>
    </div>
    <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-4 w-1/2">
      <div class="flex items-center justify-between">
        <span>{{ errorMessage }}</span>
        <button @click="clearMessages" class="text-red-700 hover:text-red-900 focus:outline-none">
          X
        </button>
      </div>
    </div>

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

  <!-- Form for adding a new review -->
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

<script setup>
  import { computed, reactive, ref, watch, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  import DateService from '../../services/DateService';

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const reviews = ref([]);
  const carName = ref('');
  const isLoading = ref(true);
  const newReview = reactive({
    rating: '',
    description: '',
  });
  const isStaff = computed(() => store.state.isStaff);

  const carId = ref(route.params.carId);

  const successMessage = ref(route.query.successMessage || '');
  const errorMessage = ref(route.query.errorMessage || '');

  const accessToken = ref(localStorage.getItem('accessToken'));

  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

  // Functions
  const fetchReviews = async () => {
    try {

      const response = await axios.get(`${BASE_API_URL}/cars/${carId.value}/reviews`);
      reviews.value = response.data;
      console.log(reviews.value);
      fetchCarName();
    } catch (error) {
      errorMessage.value = error.response.data.detail;
      router.push({ name: 'CarsList', params: { errorMessage: errorMessage.value } });
    }
  };

  const fetchCarName = async () => {
    try {

      const response = await axios.get(`${BASE_API_URL}/cars/${carId.value}/`);
      carName.value = response.data.name;
      isLoading.value = false; // Set loading to false once data is loaded
    } catch (error) {
      errorMessage.value = error.response.data.detail;
      router.push({ name: 'CarsList', params: { errorMessage: errorMessage.value } });
    }
  };

  const formatReadableDate = (dateString) => {
    return DateService.formatReadableDate(dateString);
  };

  const reviewCar = async () => {
    try {

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `JWT ${accessToken.value}`,
      };

      const requestBody = {
        rating: newReview.rating,
        description: newReview.description,
      };

      const response = await axios.post(`${BASE_API_URL}/cars/${carId.value}/reviews/`, requestBody, { headers });

      if (response.status === 201) {
        const data = response.data;

        successMessage.value = 'Review posted successfully!';
        router.push({ name: 'ReviewDetail', params: { carId: carId.value, reviewId: data.id }, query: { successMessage: successMessage.value } });
      }
    } catch (error) {
      errorMessage.value = error.response.data[0];
      router.push({ name: 'ReviewsList', params: { carId: carId.value }, query: { errorMessage: errorMessage.value} });
    }
  };

  const formattedReviews = computed(() => {
    // Compute formattedReviews based on the existing reviews data
    return reviews.value.map(newReview => ({
      ...newReview,
      readableDate: formatReadableDate(newReview.updated_at),
    }));
  });

  const clearMessages = () => {
    successMessage.value = '';
    errorMessage.value = '';

    router.replace({ query: {} });
  };

  onMounted(() => {
    fetchReviews();
  });

</script>
