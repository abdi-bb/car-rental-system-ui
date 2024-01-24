<template>
    <div class="container mx-auto mt-20 flex justify-center">
      <div class="flex flex-col flex-wrap pt-2 md:items-start w-full md:w-2/3">
        <h1
          class="md:w-full text-2xl mr-2 ml-2 font-semibold mb-3 text-center border-b pb-4 lg:text-left"
        >
          Manage Your Account
        </h1>

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

        <router-link to="/cars">
          <span
            class="py-8 px-1 text-lg md:text-sm text-blue-700 transition duration-300 mb-26 mr-2 ml-2"
            >Back to available cars</span
          >
        </router-link>
  
        <div class="border p-4 rounded-md mt-4 ml-2 mr-2 md:w-1/2">
          <div class="mb-4">
            <p class="mt-2 flex justify-between">
              <strong>Username:</strong> {{ user.username }}
            </p>
            <hr class="my-4" />
            <p class="mt-2 flex justify-between">
              <strong>Email:</strong> {{ user.email }}
            </p>
            <hr class="my-4" />
            <p class="mt-2 flex justify-between">
              <strong>First Name:</strong> {{ user.first_name }}
            </p>
            <hr class="my-4" />
            <p class="mt-2 flex justify-between">
              <strong>Last Name:</strong> {{ user.last_name }}
            </p>
            <hr class="my-4" />
            <p class="mt-2 flex justify-between">
              <strong>Phone Number:</strong> {{ user.phone_number }}
            </p>
            <hr class="my-4" />
          </div>
  
          <button
            @click="openUpdateModal"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Change Account Information
          </button>
  
          <div
            v-if="showUpdateModal"
            class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
          >
            <div class="bg-white p-8 rounded shadow-md">
              <h2 class="text-2xl font-semibold mb-4">Update Account</h2>

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

              <div class="mb-4">
                <label for="updateEmail" class="block text-gray-700"
                  >Email</label
                >
                <input
                  v-model="updatedUser.email"
                  type="email"
                  id="updateEmail"
                  class="w-full p-2 border rounded"
                />
              </div>
              <div class="mb-4">
                <label for="updateFirstName" class="block text-gray-700"
                  >First Name</label
                >
                <input
                  v-model="updatedUser.first_name"
                  type="text"
                  id="updateFirstName"
                  class="w-full p-2 border rounded"
                />
              </div>
              <div class="mb-4">
                <label for="updateLastName" class="block text-gray-700"
                  >Last Name</label
                >
                <input
                  v-model="updatedUser.last_name"
                  type="text"
                  id="updateLastName"
                  class="w-full p-2 border rounded"
                />
              </div>
              <div class="mb-4">
                <label for="updatePhoneNumber" class="block text-gray-700"
                  >Phone Number</label
                >
                <input
                  v-model="updatedUser.phone_number"
                  type="text"
                  id="updatePhoneNumber"
                  class="w-full p-2 border rounded"
                />
              </div>
              <button
                @click="updateAccount"
                class="bg-green-500 text-white px-4 py-2 rounded mt-4"
              >
                Update Account
              </button>
              <button
                @click="closeUpdateModal"
                class="bg-gray-500 text-white px-4 py-2 rounded mt-4 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
  import { computed, reactive, ref, onMounted } from "vue";
  import { useStore } from "vuex";
  import { useRoute, useRouter } from "vue-router";
  import axios from "axios";

  const store = useStore();
  const route = useRoute();
  const router = useRouter();

  const user = ref({});
  const updatedUser = reactive({
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  const showUpdateModal = ref(false);

  const successMessage = ref(route.query.successMessage);
  const errorMessage = ref(route.query.errorMessage);

  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

  const fetchUserAccount = async () => {
    try {
      const headers = {
        Authorization: `JWT ${accessToken}`,
      };
      const response = await axios.get(`${BASE_API_URL}/auth/users/me`, {
        headers,
      });

      if (response.status === 200) {
        user.value = response.data;
      } else {
        errorMessage.value = "Failed to fetch user account information";
      }
    } catch (error) {
      errorMessage.value = "Error during fetching user account information";
    }
  };

  const openUpdateModal = () => {
    updatedUser.email = user.value.email;
    updatedUser.first_name = user.value.first_name;
    updatedUser.last_name = user.value.last_name;
    updatedUser.phone_number = user.value.phone_number;

    showUpdateModal.value = true;
  };

  const updateAccount = async () => {
    try {
      const requestBody = {
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        phone_number: updatedUser.phone_number,
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      };

      const response = await axios.put(
        `${BASE_API_URL}/auth/users/me/`,
        requestBody,
        {
          headers,
        }
      );

      if (response.status === 200) {
        user.value.email = updatedUser.email;
        user.value.first_name = updatedUser.first_name;
        user.value.last_name = updatedUser.last_name;
        user.value.phone_number = updatedUser.phone_number;

        closeUpdateModal();
        successMessage.value = "Account updated successfully";
        router.push({ name: "Me", query: { successMessage: successMessage.value } });
      } else {
        errorMessage.value = "Failed to update account";
        router.push({ name: "Me", query: { errorMessage: errorMessage.value } });
      }
    } catch (error) {
      errorMessage.value = "Error during updating account";
      router.push({ name: "Me", query: { errorMessage: errorMessage.value } });
    }
  };

  const closeUpdateModal = () => {
    showUpdateModal.value = false;

    updatedUser.email = "";
    updatedUser.first_name = "";
    updatedUser.last_name = "";
    updatedUser.phone_number = "";
  };

  const clearMessages = () => {
    successMessage.value = "";
    errorMessage.value = "";

    router.replace({ query: {} });
  };

  onMounted(async () => {
    await fetchUserAccount();
  });

</script>
  