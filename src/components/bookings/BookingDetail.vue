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
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        booking: null,
      };
    },
    methods: {
      fetchBookingData() {
        axios.get(`http://127.0.0.1:8000/api/v1/bookings/${this.$route.params.id}`)
          .then(response => {
            this.booking = response.data;
          })
          .catch(error => {
            console.error('Error fetching booking data:', error);
            this.booking = null;
          });
      },
    },
    created() {
      this.fetchBookingData();
    },
  };
  </script>
  