<template>
  <div class="container mx-auto mt-20 flex justify-center">
    <div class="flex flex-col flex-wrap pt-2 md:items-start w-full md:w-2/3">
      <h1
        class="text-2xl mr-2 ml-2 font-semibold mb-3 border-b pb-4 lg:text-left md:w-full"
      >
        Manage Your Booking
      </h1>
      <router-link to="/cars">
        <span
          class="py-8 px-1 text-lg md:text-sm text-blue-700 transition duration-300 mb-26 mr-2 ml-2"
          >Back to available cars</span
        >
      </router-link>
      <div class="ml-2 w-full mt-4" v-if="bookings.length === 0">
        <p class="text-center">No bookings found.</p>
      </div>

      <div class="container md:flex md:flex-wrap">
        <div
          v-for="booking in bookings"
          :key="booking.id"
          class="mb-8 mt-4 ml-2 mr-2"
        >
          <div class="border p-4 rounded-md">
            <div class="h-40 overflow-hidden border-b pb-4 pt-2">
              <img
                :src="booking.car.images.length > 0 ? booking.car.images[0].image : ''"
                :alt="booking.car.name"
                class="w-full h-full object-contain"
              />
            </div>
            <p class="mt-2 flex justify-between">
              <strong>Car:</strong> {{ booking.car.name }}
            </p>
            <p class="mt-2 flex justify-between">
              <strong>Start Date:</strong> {{ booking.start_date }}
            </p>
            <p class="mt-2 mb-2 flex justify-between">
              <strong>End Date:</strong> {{ booking.end_date }}
            </p>

            <hr class="my-4" />
            <button
              @click="cancelBooking(booking.id)"
              class="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel Booking
            </button>
            <button
              @click="editBooking(booking)"
              class="bg-blue-500 text-white px-4 py-2 rounded ml-4"
            >
              Edit Booking
            </button>
          </div>
        </div>
      </div>
      <!-- Edit Booking Modal -->
      <div
        v-if="showEditModal"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <div class="bg-white p-8 rounded shadow-md">
          <h2 class="text-2xl font-semibold mb-4">Edit Booking</h2>

          <div class="mb-4">
            <label for="editStartDate" class="block text-gray-700"
              >Start Date</label
            >
            <input
              type="date"
              v-model="selectedBooking.start_date"
              id="editStartDate"
              class="w-full p-2 border rounded"
            />
          </div>

          <div class="mb-4">
            <label for="editEndDate" class="block text-gray-700"
              >End Date</label
            >
            <input
              type="date"
              v-model="selectedBooking.end_date"
              id="editEndDate"
              class="w-full p-2 border rounded"
            />
          </div>

          <button
            @click="updateBooking"
            class="bg-green-500 text-white px-4 py-2 rounded mt-4"
          >
            Update Booking
          </button>
          <button
            @click="closeEditModal"
            class="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, computed, reactive, ref, onMounted } from "vue";
  import { useStore } from "vuex";
  import { useRoute, useRouter } from "vue-router";
  import axios from "axios";

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const bookings = ref([]);

  const showEditModal = ref(false);
  const selectedBooking = ref(null);

  const successMessage = ref(route.query.successMessage || '');
  const errorMessage = ref(route.query.errorMessage || '');

  const accessToken = localStorage.getItem("accessToken");

  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

  const fetchUserBookings = async () => {
    try {
      const userId = store.state.userId;
      
      const headers = {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      };

      const response = await axios.get(
        `${BASE_API_URL}/bookings/?user=${userId}`,
        { headers }
      );

      if (response.status === 200) {
        const data = response.data;

        await Promise.all(
          data.map(async (booking) => {
            const carResponse = await axios.get(
              `${BASE_API_URL}/cars/${booking.car}/`
            );
            const carData = carResponse.data;
            booking.car = carData;
          })
        );

        bookings.value = data;
      } else {
        console.error("Failed to fetch user bookings");
      }
    } catch (error) {
      errorMessage.value = "Error during fetching user bookings";
      console.error("Error during fetching user bookings", error);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      };


      const response = await axios.get(
        `${BASE_API_URL}/bookings/${bookingId}/`,
        { headers }
      );

      if (response.status !== 200) {
        errorMessage.value = "Failed to fetch booking data";
        console.error("Failed to fetch booking data:", response.statusText);
        return;
      }

      const bookingData = response.data;

      // console.log("Booking Data:", bookingData);

      // const carId = bookingData.car;

      // await axios.patch(
      //   `${BASE_API_URL}/cars/${carId}/`,
      //   { status: 1 },
      //   { headers }
      // );

      const deleteResponse = await axios.delete(
        `${BASE_API_URL}/bookings/${bookingId}/`,
        { headers }
      );

      if (deleteResponse.status === 204) {
        bookings.value = bookings.value.filter(
          (booking) => booking.id !== bookingId
        );
        successMessage.value = "Booking canceled successfully";
        console.log("Booking canceled successfully");
      } else {
        errorMessage.value = "Failed to cancel booking";
        console.error("Failed to cancel booking:", deleteResponse.statusText);
      }
    } catch (error) {
      errorMessage.value = "Error during canceling booking";
      console.error("Error during canceling booking", error);
    }
  };

  const editBooking = (booking) => {
    selectedBooking.value = { ...booking };
    showEditModal.value = true;
  };

  const updateBooking = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      };

      const response = await axios.put(
        `${BASE_API_URL}/bookings/${selectedBooking.value.id}/`,
        {
          start_date: selectedBooking.value.start_date,
          end_date: selectedBooking.value.end_date,
          car: selectedBooking.value.car.id,
          user: selectedBooking.value.user,
        },
        { headers }
      );

      if (response.status === 200) {
        const index = bookings.value.findIndex(
          (booking) => booking.id === selectedBooking.value.id
        );
        bookings.value[index] = { ...selectedBooking.value };

        showEditModal.value = false;
        successMessage.value = "Booking updated successfully";
        console.log("Booking updated successfully");
      } else {
        errorMessage.value = "Failed to update booking";
        console.error("Failed to update booking");
      }
    } catch (error) {
      errorMessage.value = "Error during updating booking";
      console.error("Error during updating booking", error);
    }
  };

  const closeEditModal = () => {
    showEditModal.value = false;
    selectedBooking.value = null;
  };

  onMounted(async () => {
    await fetchUserBookings();
  }); 

</script>