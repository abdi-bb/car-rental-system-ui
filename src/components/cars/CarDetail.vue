<template>
  <div class="container mx-auto mt-24">
    <h1 class="text-4xl font-bold mb-4">Car Detail</h1>

    <div class="flex justify-end">
        <!-- Delete Car Button (for isStaff) -->
        <button v-if="isStaff" @click="deleteCar" class="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-4">
            Delete Car
        </button>

        <!-- Update Car Button (for isStaff) -->
        <button v-if="isStaff" @click="openUpdateModal" class="bg-blue-500 text-white px-4 py-2 rounded mt-4 ml-4">
            Update Car
        </button>
    </div>
      
      <!-- Car Image and Details -->

      <div v-if="!isStaff"
        class="md:w-2/3 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md mb-4 text-lg mt-8 ml-2 mr-2"
      >
        Free cancellation up to 48 hours before pick-up.
      </div>
      <div class="flex flex-col w-full md:w-2/3 align-middle h-full">
        <div v-if="car.id" class="overflow-hidden border-b pb-4 pt-3 w-full md:w-96 h-60 md:h-auto rounded-lg">
          <router-link :to="{ name: 'ImagesList', params: { carId: car.id }}">
            <img
              :src="car.images && car.images.length > 0 ? car.images[0].image : ''"
              :alt="car.name"
              class="w-full h-full object-center rounded-lg"
            />
          </router-link>
        </div>

        <div class="pt-4 pl-2 md:w-2/3">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-semibold mb-2">
              {{ car.name }}
              <span class="text-lg font-medium">({{ car.model }})</span>
            </h2>
            <div class="flex pr-4">
              <span class="text-yellow-600 mr-1" v-for="star in car.stars" :key="star">
                ★
              </span>
            </div>
          </div>
          <!-- Additional Car Details -->
          <div class="flex flex-col">
            <div class="flex items-center mr-4 mt-2">
              <img src="../../assets/img/gear.png" alt="gear" class="w-5 h-5 mr-2" />
              <p class="text-gray-600">{{ car.gearbox }}</p>
            </div>
            <div class="flex items-center mr-4 mt-2">
              <img src="../../assets/img/user.png" alt="user" class="w-5 h-5 mr-2" />
              <p class="text-gray-600">
                {{ car.seat }}
                <span class="text-gray-600 mr-1"> seats</span>
              </p>
            </div>
            <div class="flex items-center mr-4 mt-2">
              <img src="../../assets/img/door.png" alt="door" class="w-5 h-5 mr-2" />
              <p class="text-gray-600">
                {{ car.door }}
                <span class="text-gray-600 mr-1"> doors</span>
              </p>
            </div>
            <div class="flex items-center mt-2 mb-4">
              <img src="../../assets/img/dollar.svg" alt="dollar" class="w-5 h-5 mr-2" />
              <p class="text-green-500 font-semibold text-lg">
                ${{ car.price }} per day
              </p>
            </div>
            <div
                v-if="isUpdateModalOpen"
                class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
              >
                <div class="bg-white p-8 rounded shadow-md">
                  <h2 class="text-2xl font-semibold mb-4">Update Car Details</h2>

                  <div class="mb-4">
                    <label for="updateName" class="block text-gray-700 text-sm font-bold mb-2">
                      Name
                    </label>
                    <input
                      v-model="updateCar.name"
                      type="text"
                      id="updateName"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="mb-4">
                    <label for="updateModel" class="block text-gray-700 text-sm font-bold mb-2">
                      Model
                    </label>
                    <input
                      v-model="updateCar.model"
                      type="text"
                      id="updateModel"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="mb-4">
                    <label for="updateGearbox" class="block text-gray-700 text-sm font-bold mb-2">
                      Gearbox
                    </label>
                    <input
                      v-model="updateCar.gearbox"
                      type="text"
                      id="updateGearbox"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="mb-4">
                    <label for="updateSeat" class="block text-gray-700 text-sm font-bold mb-2">
                      Seat
                    </label>
                    <input
                      v-model="updateCar.seat"
                      type="number"
                      id="updateSeat"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="mb-4">
                    <label for="updateDoor" class="block text-gray-700 text-sm font-bold mb-2">
                      Door
                    </label>
                    <input
                      v-model="updateCar.door"
                      type="number"
                      id="updateDoor"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="mb-4">
                    <label for="updatePrice" class="block text-gray-700 text-sm font-bold mb-2">
                      Price
                    </label>
                    <input
                      v-model="updateCar.price"
                      type="number"
                      id="updatePrice"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="flex justify-end">
                    <button
                      @click="closeUpdateModal"
                      class="bg-gray-500 text-white px-4 py-2 rounded mr-4"
                    >
                      Cancel
                    </button>
                    <button
                      @click="updateCarDetails"
                      class="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
          </div>
        </div>

        <div v-if="!isStaff" class="md:w-full mb-4 ml-2 mr-2">
          <div
            class="bg-white rounded-lg overflow-hidden border border-gray-300 p-5"
          >
            <h2 class="text-xl mb-4 font-bold">
              Pick-up and Drop-off Information
            </h2>

            <div class="flex items-center mb-3">
              <p class="text-gray-700 text-lg">
                <span class="">Bole International Airport, Addis Ababa.</span>
              </p>
            </div>

            <div class="flex justify-center mb-3 flex-col">
              <svg
                class="w-6 h-6 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                ></path>
              </svg>
              <svg
                class="w-6 h-6 text-gray-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                ></path>
              </svg>
            </div>

            <div class="flex items-center">
              <p class="text-gray-700 text-lg">
                <span class="">Bole International Airport, Addis Ababa.</span>
              </p>
            </div>
          </div>
        </div>

        <div v-if="!isStaff"
          class="md:w-2/3 bg-green-100 border-l-4 border-green-500 text-green-700 p-2 rounded-md shadow-md mb-4 text-lg ml-2 mr-2"
        >
          Bring the receipt at the pick-up.
        </div>

        <!-- Booking Form -->
        <div v-if="!isStaff" class="w-full md:w-1/3 bg-gray-100 p-4 ml-2 mr-2">
          <h3 class="text-xl font-semibold mb-4">Book Now</h3>

          <form v-if="isAuthenticated" @submit.prevent="bookNow">
            <div class="mb-4">
              <label for="startDate" class="block text-gray-700"
                >Start Date</label
              >
              <input
                type="date"
                v-model="bookingData.startDate"
                id="startDate"
                class="w-full p-2 border rounded"
              />
            </div>

            <div class="mb-4">
              <label for="endDate" class="block text-gray-700">End Date</label>
              <input
                type="date"
                v-model="bookingData.endDate"
                id="endDate"
                class="w-full p-2 border rounded"
              />
            </div>

            <button
              @click.prevent="bookNow"
              class="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              Book Now
            </button>
          </form>

          <div v-else>
            <p class="text-red-500">Login or Sign Up to book this car.</p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showReceiptModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-4 rounded shadow-md w-72 absolute">
        <div ref="receiptContainer" class="bg-white w-full">
          <div class="flex justify-center w-full mb-8 items-center">
            <img src="../../assets/img/racing.png" alt="Company Logo" class="h-8 w-8 mr-2" />
            <span class="text-black text-xl font-semibold">WheelsOnRent</span>
          </div>

          <div class="mb-2 flex justify-between w-full">
            <div class="text-gray-700"><strong>Car Name:</strong></div>
            <div class="text-gray-700 ml-2">{{ receiptData.car_name }}</div>
          </div>

          <div class="mb-2 flex justify-between w-full">
            <div class="text-gray-700"><strong>Car Model:</strong></div>
            <div class="text-gray-700 ml-2">{{ receiptData.car_model }}</div>
          </div>

          <hr class="my-4" />

          <div class="mb-2 flex justify-between w-full">
            <div class="text-gray-700"><strong>Start Date:</strong></div>
            <div class="text-gray-700">{{ receiptData.start_date }}</div>
          </div>

          <div class="mb-2 flex justify-between w-full">
            <div class="text-gray-700"><strong>End Date:</strong></div>
            <div class="text-gray-700">{{ receiptData.end_date }}</div>
          </div>

          <div class="mb-2 flex justify-between w-full">
            <div class="text-gray-700"><strong>Price:</strong></div>
            <div class="text-gray-700">{{ receiptData.base_price }}</div>
          </div>

          <div class="mb-2 flex justify-between w-full">
            <div class="text-gray-700"><strong>Tax:</strong></div>
            <div class="text-gray-700">{{ receiptData.tax_amount }}</div>
          </div>

          <hr class="my-4" />

          <div class="mb-2 flex justify-between w-full">
            <div class="text-gray-700"><strong>Total Price:</strong></div>
            <div class="text-gray-700">
              <span class="text-gray-700 text-xl"><strong>$</strong></span>
              {{ receiptData.total_price }}
            </div>
          </div>
        </div>
        <!-- Download button -->
        <button
          @click="downloadReceipt"
          class="flex items-center justify-start pr-2 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <img src="../../assets/img/downloads.png" alt="logout icon" class="h-4 w-4 mr-2" />
          Download Receipt
        </button>
      </div>
  </div>
</template>

<script setup>
  import {reactive, ref, computed, onMounted} from 'vue';
  import {useStore} from 'vuex';
  import {useRoute, useRouter} from 'vue-router';
  import axios from 'axios';
  import html2pdf from 'html2pdf.js';

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const car = ref({});
  const updateCar = reactive({
    name: '',
    model: '',
    gearbox: '',
    seat: '',
    door: '',
    price: '',
  });
  const bookingData = reactive({
    startDate: '',
    endDate: '',
  });
  const carId = ref(route.params.carId);

  const showReceiptModal = ref(false);
  const receiptData = ref(null);
  const isUpdateModalOpen = ref(false);

  const successMessage = ref(route.query.successMessage || '');
  const errorMessage = ref(route.query.errorMessage || '');

  const isAuthenticated = computed(() => store.state.isAuthenticated);
  const isStaff = computed(() => store.state.isStaff);
  const userId = computed(() => store.state.userId);

  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

  const fetchCarDetails = async () => {
    const response = await axios.get(`${BASE_API_URL}/cars/${carId.value}/`);
    const data = response.data;
    return data;
  }

  const getUserInfo = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `JWT ${accessToken}`,
      };
      const response = await axios.get(`${BASE_API_URL}/auth/users/me/`, {
        headers: headers,
      });

      if (response.status === 200) {
        const userData = response.data;
        store.commit('setUserId', userData.id);
      } else {
        errorMessage.value = 'Failed to fetch user information';
      }
    } catch (error) {
      errorMessage.value = 'Error during fetching user information';
    }
  }

  const bookNow = async () => {
    try {
      const carId = car.value.id;
      const userId = userId.value;

      if (!userId) {
        errorMessage.value = 'User ID not available';
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `JWT ${accessToken}`,
      };
      const requestBody = {
        car: carId,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        user: userId,
      };

      const response = await axios.post(`${BASE_API_URL}/bookings/`, requestBody, {
        headers: headers,
      });

      if (response.status === 201) {
        successMessage.value = 'Booking successful';

        const startDate = new Date(bookingData.startDate);
        const endDate = new Date(bookingData.endDate);
        const dateDiffInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const basePrice = dateDiffInDays * car.value.price;

        const taxRate = 0.15;
        const taxAmount = basePrice * taxRate;
        const totalPrice = basePrice + taxAmount;

        receiptData.value = {
          car_model: car.value.model,
          car_name: car.value.name,
          start_date: bookingData.startDate,
          end_date: bookingData.endDate,
          base_price: basePrice,
          tax_amount: taxAmount,
          total_price: totalPrice,
        };

        showReceiptModal = true;
      } else {
        errorMessage.value = 'Booking failed';
      }
     } catch (error) {
        errorMessage.value = 'Error during booking';
      }
    }

    const downloadReceipt = () => {
      html2pdf(receiptContainer.value, {
        margin: 0.2,
        filename: 'receipt.pdf',
        pagebreak: { after: '.sautDePage' },
        image: {
          type: 'jpeg',
          quality: 2,
        },
        html2canvas: {
          scale: 2,
          letterRendering: true,
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait',
        },
      });
      router.push({ name: 'BookingsList' });
    }

    const deleteCar = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
        };
        const response = await axios.delete(`${BASE_API_URL}/cars/${car.value.id}/`, {
          headers: headers,
        });

        if (response.status === 204) {
          successMessage.value = 'Car deleted successfully';
          router.push({ name: 'CarsList' });
        } else {
          errorMessage.value = 'Error deleting car';
        }
      } catch (error) {
        errorMessage.value = 'Error deleting car';
      }
    }

    const updateCarDetails = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
        };
        const response = await axios.put(`${BASE_API_URL}/cars/${car.value.id}/`, updateCar, {
          headers: headers,
        });

        if (response.status === 200) {
          successMessage.value = 'Car updated successfully';
          closeUpdateModal();
          car.value = await fetchCarDetails();
        } else {
          errorMessage.value = 'Error updating car';
        }
      } catch (error) {
        errorMessage.value = 'Error updating car';
      }
    }

    const openUpdateModal = () => {
      updateCar.name = car.value.name;
      updateCar.model = car.value.model;
      updateCar.gearbox = car.value.gearbox;
      updateCar.seat = car.value.seat;
      updateCar.door = car.value.door;
      updateCar.price = car.value.price;
      isUpdateModalOpen.value = true;
    }

    const closeUpdateModal = () => {
      isUpdateModalOpen.value = false;
    }

  onMounted(async () => {
    // carId.value = route.params.carId;
    car.value = await fetchCarDetails();
    if (isAuthenticated.value) {
      await getUserInfo();
    }
  });

</script>
