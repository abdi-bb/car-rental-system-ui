<template>
    <div class="container mx-auto mt-8">
      <div class="flex flex-wrap pt-8 items-center justify-center">
        <!-- Car Image and Details -->
  
        <div
          class="md:w-2/3 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-md mb-4 text-lg mt-8 ml-2 mr-2"
        >
          Free cancellation up to 48 hours before pick-up.
        </div>
        <div class="flex flex-col w-full md:w-2/3 align-middle h-full">
          <div
            class="overflow-hidden border-b pb-4 pt-3 w-full md:w-96 h-60 md:h-auto rounded-lg"
          >
            <img
              :src="car.image"
              :alt="car.name"
              class="w-full h-full object-center rounded-lg"
            />
          </div>
  
          <div class="pt-4 pl-2 md:w-2/3">
            <div class="flex justify-between items-center">
              <h2 class="text-2xl font-semibold mb-2">
                {{ car.name }}
                <span class="text-lg font-medium">({{ car.model }})</span>
              </h2>
              <div class="flex pr-4">
                <span class="text-gray-600 mr-1" v-for="star in 5" :key="star">
                  <img
                    src="../../assets/img/star.png"
                    alt="star"
                    class="w-3 h-3 cursor-pointer"
                  />
                </span>
              </div>
            </div>
            <!-- Additional Car Details -->
            <div class="flex flex-col">
              <div class="flex items-center mr-4 mt-2">
                <img src="../../assets/img/gear.png" alt="gear" class="w-5 h-5 mr-2" />
                <p class="text-gray-600">{{ car.gear }}</p>
              </div>
              <div class="flex items-center mr-4 mt-2">
                <img src="../../assets/img/user.png" alt="user" class="w-5 h-5 mr-2" />
                <p class="text-gray-600">
                  {{ car.seats }}
                  <span class="text-gray-600 mr-1"> seats</span>
                </p>
              </div>
              <div class="flex items-center mr-4 mt-2">
                <img src="../../assets/img/door.png" alt="door" class="w-5 h-5 mr-2" />
                <p class="text-gray-600">
                  {{ car.doors }}
                  <span class="text-gray-600 mr-1"> doors</span>
                </p>
              </div>
              <div class="flex items-center mt-2 mb-4">
                <img src="../../assets/img/dollar.svg" alt="dollar" class="w-5 h-5 mr-2" />
                <p class="text-green-500 font-semibold text-lg">
                  ${{ car.price_per_day }} per day
                </p>
              </div>
            </div>
          </div>
  
          <div class="md:w-full mb-4 ml-2 mr-2">
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
  
          <div
            class="md:w-2/3 bg-green-100 border-l-4 border-green-500 text-green-700 p-2 rounded-md shadow-md mb-4 text-lg ml-2 mr-2"
          >
            Bring the receipt at the pick-up.
          </div>
  
          <!-- Booking Form -->
          <div class="w-full md:w-1/3 bg-gray-100 p-4 ml-2 mr-2">
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
    </div>
  </template>
  
  <script>
  import html2pdf from "html2pdf.js";
  
  export default {
    name: "CarDetails",
    data() {
      return {
        car: {},
        bookingData: {
          startDate: "",
          endDate: "",
        },
        showReceiptModal: false,
        receiptData: null,
      };
    },
  
    computed: {
      isAuthenticated() {
        return this.$store.state.isAuthenticated;
      },
      userId() {
        return this.$store.state.userId;
      },
    },
  
    methods: {
      async fetchCarDetails(carId) {
        const response = await fetch(`http://localhost:8000/api/v1/cars/${carId}/`);
        const data = await response.json();
        return data;
      },
  
      closeModal() {
        this.showReceiptModal = false;
      },
      async getUserInfo() {
        try {
          const response = await fetch("http://localhost:8000/api/v1/auth/users/me/", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          });
  
          if (response.ok) {
            const userData = await response.json();
            this.$store.commit("setUserId", userData.id);
          } else {
            console.error("Failed to fetch user information");
          }
        } catch (error) {
          console.error("Error during fetching user information", error);
        }
      },
  
      async bookNow() {
        try {
          const carId = this.car.id;
          const userId = this.userId;
  
          if (!userId) {
            console.error("User ID not available");
            return;
          }
  
          const response = await fetch(`http://localhost:8000/api/v1/bookings/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
              car: carId,
              start_date: this.bookingData.startDate,
              end_date: this.bookingData.endDate,
              user: userId,
            }),
          });
  
          if (response.ok) {
            console.log("Booking successful");
  
            const startDate = new Date(this.bookingData.startDate);
            const endDate = new Date(this.bookingData.endDate);
            const dateDiffInDays = Math.ceil(
              (endDate - startDate) / (1000 * 60 * 60 * 24)
            );
            const basePrice = dateDiffInDays * this.car.price_per_day;
  
            const taxRate = 0.15;
            const taxAmount = basePrice * taxRate;
            const totalPrice = basePrice + taxAmount;
  
            this.receiptData = {
              car_model: this.car.model,
              car_name: this.car.name,
              start_date: this.bookingData.startDate,
              end_date: this.bookingData.endDate,
              base_price: basePrice,
              tax_amount: taxAmount,
              total_price: totalPrice,
            };
  
            //console.log(this.receiptData);
            this.showReceiptModal = true;
          } else {
            console.error("Booking failed");
          }
        } catch (error) {
          console.error("Error during booking", error);
        }
      },
      downloadReceipt() {
        html2pdf(this.$refs.receiptContainer, {
          margin: 0.2,
          filename: "receipt.pdf",
          pagebreak: { after: ".sautDePage" },
          image: {
            type: "jpeg",
            quality: 2,
          },
          html2canvas: {
            scale: 2,
            letterRendering: true,
          },
          jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait",
          },
        });
        this.$router.push({ name: "Home" });
      },
    },
  
    async created() {
      const carId = this.$route.params.id;
      this.car = await this.fetchCarDetails(carId);
      if (this.isAuthenticated) {
        await this.getUserInfo();
      }
    },
  };
  </script>
  