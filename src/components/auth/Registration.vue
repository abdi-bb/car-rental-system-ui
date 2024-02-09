<template>
  <!-- Registration form -->
  <div class="bg-gray-100 p-8 rounded-md shadow-md w-1/3 md:w-2/3 mt-24 h-full md:h-2/3 mx-auto max-w-md">
    <form>
      <h2
        class="text-2xl font-semibold mb-4 col-span-full flex items-center justify-between"
      >
        Register
      </h2>

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
        <label for="registerFirstName" class="block text-gray-700">First Name</label>
        <input
          type="text"
          id="registerFirstName"
          v-model="registerData.first_name"
          class="w-full p-2 border rounded"
          :required="formSubmitted && !registerData.first_name"
        />
        <!-- Error message for first name -->
        <p v-if="formSubmitted && !registerData.first_name" class="text-red-500">
          First name is required
        </p>
      </div>

      <div class="mb-4">
        <label for="registerLastName" class="block text-gray-700">Last Name</label>
        <input
          type="text"
          id="registerLastName"
          v-model="registerData.last_name"
          class="w-full p-2 border rounded"
          :required="formSubmitted && !registerData.last_name"
        />
        <!-- Error message for last name -->
        <p v-if="formSubmitted && !registerData.last_name" class="text-red-500">
          Last name is required
        </p>
      </div>

      <div class="mb-4">
        <label for="registerUsername" class="block text-gray-700">Username</label>
        <input
          type="text"
          id="registerUsername"
          v-model="registerData.username"
          class="w-full p-2 border rounded"
          :required="formSubmitted && !registerData.username"
        />
        <!-- Error message for username -->
        <p v-if="formSubmitted && !registerData.username" class="text-red-500">
          Username is required
        </p>
      </div>

      <div class="mb-4">
        <label for="registerEmail" class="block text-gray-700">Email</label>
        <input
          type="email"
          id="registerEmail"
          v-model="registerData.email"
          class="w-full p-2 border rounded"
          :required="formSubmitted && !registerData.email"
        />
        <!-- Error message for email -->
        <p v-if="formSubmitted && !registerData.email" class="text-red-500">
          Email is required
        </p>
      </div>

      <div class="mb-4">
        <label for="registerPhone" class="block text-gray-700">Phone</label>
        <input
          type="text"
          id="registerPhone"
          v-model="registerData.phone_number"
          class="w-full p-2 border rounded"
          :required="formSubmitted && !registerData.phone_number"
        />
        <!-- Error message for phone number -->
        <p v-if="formSubmitted && !registerData.phone_number" class="text-red-500">
          Phone number is required
        </p>
      </div>

      <div class="mb-4">
        <label for="registerPassword" class="block text-gray-700">Password</label>
        <input
          type="password"
          id="registerPassword"
          v-model="registerData.password"
          class="w-full p-2 border rounded"
          :required="formSubmitted && !registerData.password"
        />
        <!-- Error message for password -->
        <p v-if="formSubmitted && !registerData.password" class="text-red-500">
          Password is required
        </p>
      </div>

      <button
        @click.prevent="register"
        class="bg-green-500 text-white px-4 py-2 rounded col-span-full"
      >
        Register
      </button>
      <!-- Toggle to Login -->
      <p class="mt-4 text-sm">
        Already have an account?
        <router-link to="/login" class="text-blue-500"
          >
          Login
        </router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const store = useStore();
const route = useRoute();
const router = useRouter();

const registerData = reactive({
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  phone_number: '',
  password: '',
});

const formSubmitted = ref(false);

const successMessage = ref(route.query.successMessage || '');
const errorMessage = ref(route.query.errorMessage || '');

const BASE_API_URL = process.env.VUE_APP_BASE_API_URL;

const register = async () => {
  try {
    formSubmitted.value = true;
    
    if (
      !registerData.first_name ||
      !registerData.last_name ||
      !registerData.username ||
      !registerData.email ||
      !registerData.phone_number ||
      !registerData.password
    ) {
      console.log('All fields are required');
      errorMessage.value = 'All fields are required';
      return;
    }

    const response = await axios.post(
      `${BASE_API_URL}/auth/users/`,
      registerData
    );

    if (response.status === 201) {
      successMessage.value = 'Registration successful. Please login.';
      router.push({ name: 'Login', query: { successMessage: successMessage.value } });
    } else {
      errorMessage.value = 'Registration failed. Please try again.';
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
      const responseData = error.response.data;

      if (responseData.password) {
        errorMessage.value = responseData.password[0];
      } else if (responseData.username) {
        errorMessage.value = responseData.username[0];
      }
    } else {
      errorMessage.value = 'Unexpected error. Please try again.';
    }
  }
};

const clearMessages = () => {
  successMessage.value = '';
  errorMessage.value = '';

  router.replace({ query: {} });
};

</script>

<style>

</style>