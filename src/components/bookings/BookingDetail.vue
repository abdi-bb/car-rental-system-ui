<template>
  <div>
    <h2>Booking Detail</h2>
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
      }
    } catch (error) {
      errorMessage.value = 'Error fetching booking data';
      booking.value = null;
    }
  };

  onMounted(async () => {
    await fetchBookingData();
  });
        
    
</script>
  