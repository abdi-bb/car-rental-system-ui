<template>
  <div>
    <h2>Booking Detail</h2>

    <!-- Success and error messages -->
    <div v-if="successMessage" class="md:w-2/3 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md mb-4 text-sm mt-4 ml-2 mr-2">
      <div class="flex items-center justify-between">
        <span>{{ successMessage }}</span>
        <button @click="clearMessages" class="text-green-700 hover:text-green-900 focus:outline-none">
          X
        </button>
      </div>
    </div>
    <div v-if="errorMessage" class="md:w-2/3 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-4 text-sm mt-4 ml-2 mr-2">
      <div class="flex items-center justify-between">
        <span>{{ errorMessage }}</span>
        <button @click="clearMessages" class="text-red-700 hover:text-red-900 focus:outline-none">
          X
        </button>
      </div>
    </div>


    <div v-if="booking">
      <p>Customer: {{ booking.customer.user.username }}</p>
      <p>Car: {{ booking.car.name }}</p>
      <p>Booking Date: {{ booking.start_date }}</p>
    </div>
    <div v-else>
      <p>Booking not found</p>
    </div>
  </div>
</template>

<script setup>
  import { computed, reactive, ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const booking = ref(null);
  const bookingId = ref(route.params.bookingId);

  const successMessage = ref(route.query.successMessage || '');
  const errorMessage = ref(route.query.errorMessage || '');

  const accessToken = computed(() => store.state.accessToken);

  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

  const fetchBookingData = async () => {
    try {
      clearMessages();
      
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `JWT ${accessToken.value}`,
      };

      const response = await axios.get(
        `${BASE_API_URL}/bookings/${bookingId.value}/`,
        { headers }
      );

      if (response.status === 200) {
        const data = response.data;
        booking.value = data;
      } else {
        errorMessage.value = 'Error fetching booking data';
        booking.value = null;
        router.push({ name: 'BookingsList', query: { errorMessage: errorMessage.value } });
      }
    } catch (error) {
      errorMessage.value = 'Error fetching booking data';
      booking.value = null;
      router.push({ name: 'BookingsList', query: { errorMessage: errorMessage.value } });
    }
  };

  const clearMessages = () => {
    successMessage.value = '';
    errorMessage.value = '';

    router.replace({ query: {} });
  };

  onMounted(async () => {
    await fetchBookingData();
  });
        
    
</script>
  