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

<script>
export default {
  data() {
    return {
      bookings: [],
      showEditModal: false,
      selectedBooking: null,
    };
  },
  methods: {
    async fetchUserBookings() {
      try {
        const userId = this.$store.state.userId;
        const response = await fetch(
          `http://localhost:8000/api/v1/bookings/?user=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          await Promise.all(
            data.map(async (booking) => {
              const carResponse = await fetch(
                `http://localhost:8000/api/v1/cars/${booking.car}/`
              );
              const carData = await carResponse.json();
              booking.car = carData;
            })
          );

          this.bookings = data;
        } else {
          console.error("Failed to fetch user bookings");
        }
      } catch (error) {
        console.error("Error during fetching user bookings", error);
      }
    },

    async cancelBooking(bookingId) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/bookings/${bookingId}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch booking data:", response.statusText);
          return;
        }

        const bookingData = await response.json();

        console.log("Booking Data:", bookingData);

        const carId = bookingData.car;

        await fetch(`http://localhost:8000/api/v1/cars/${carId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            status: 1,
          }),
        });

        const deleteResponse = await fetch(
          `http://localhost:8000/api/v1/bookings/${bookingId}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (deleteResponse.ok) {
          this.bookings = this.bookings.filter(
            (booking) => booking.id !== bookingId
          );
          console.log("Booking canceled successfully");
        } else {
          console.error("Failed to cancel booking:", deleteResponse.statusText);
        }
      } catch (error) {
        console.error("Error during canceling booking", error);
      }
    },

    editBooking(booking) {
      this.selectedBooking = { ...booking };
      this.showEditModal = true;
    },

    async updateBooking() {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/bookings/${this.selectedBooking.id}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
              start_date: this.selectedBooking.start_date,
              end_date: this.selectedBooking.end_date,
              car: this.selectedBooking.car.id,
              user: this.selectedBooking.user,
            }),
          }
        );

        if (response.ok) {
          const index = this.bookings.findIndex(
            (booking) => booking.id === this.selectedBooking.id
          );
          this.bookings[index] = { ...this.selectedBooking };

          this.showEditModal = false;
          console.log("Booking updated successfully");
        } else {
          console.error("Failed to update booking");
        }
      } catch (error) {
        console.error("Error during updating booking", error);
      }
    },

    closeEditModal() {
      this.showEditModal = false;
      this.selectedBooking = null;
    },
  },
  async created() {
    console.log(this.$store.state.userId);
    await this.fetchUserBookings();
  },
};
</script>