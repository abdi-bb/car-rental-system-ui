<template>
    <div class="container mx-auto mt-20 flex justify-center">
      <div class="flex flex-col flex-wrap pt-2 md:items-start w-full md:w-2/3">
        <h1
          class="md:w-full text-2xl mr-2 ml-2 font-semibold mb-3 text-center border-b pb-4 lg:text-left"
        >
          Manage Your Account
        </h1>
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
  
              <div class="mb-4">
                <label for="updateEmail" class="block text-gray-700"
                  >Email</label
                >
                <input
                  v-model="updatedEmail"
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
                  v-model="updatedFirstName"
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
                  v-model="updatedLastName"
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
                  v-model="updatedPhoneNumber"
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
  
  <script>
  export default {
    data() {
      return {
        user: {},
        showUpdateModal: false,
        updatedEmail: "",
        updatedFirstName: "",
        updatedLastName: "",
        updatedPhoneNumber: "",
      };
    },
    methods: {
      async fetchUserAccount() {
        try {
          const accessToken = localStorage.getItem('accessToken');
  
          const headers = {
            'Authorization': `JWT ${accessToken}`,
          };
          const response = await fetch(`http://127.0.0.1:8000/api/v1/auth/users/me`, { headers });
  
          if (response.ok) {
            const data = await response.json();
            this.user = data;
          } else {
            console.error("Failed to fetch user account information");
          }
        } catch (error) {
          console.error("Error during fetching user account information", error);
        }
      },
  
      openUpdateModal() {
        this.updatedEmail = this.user.email;
        this.updatedFirstName = this.user.first_name;
        this.updatedLastName = this.user.last_name;
        this.updatedPhoneNumber = this.user.phone_number;
  
        this.showUpdateModal = true;
      },
  
      async updateAccount() {
        try {
          const requestBody = {
            email: this.updatedEmail,
            first_name: this.updatedFirstName,
            last_name: this.updatedLastName,
            phone_number: this.updatedPhoneNumber,
          };

          const accessToken = localStorage.getItem('accessToken');
          const headers = {
            'Content-Type': 'application/json',
            Authorization: `JWT ${accessToken}`,
          };

          const response = await fetch("http://localhost:8000/api/v1/auth/users/me/", {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(requestBody),
          });
  
          if (response.ok) {
            this.user.email = this.updatedEmail;
            this.user.first_name = this.updatedFirstName;
            this.user.last_name = this.updatedLastName;
            this.user.phone_number = this.updatedPhoneNumber;

            this.closeUpdateModal();
            console.log("Account updated successfully");
          } else {
            console.error("Failed to update account");
          }
        } catch (error) {
          console.error("Error during updating account", error);
        }
      },
  
      closeUpdateModal() {
        this.showUpdateModal = false;

        this.updatedEmail = "";
        this.updatedFirstName = "";
        this.updatedLastName = "";
        this.updatedPhoneNumber = "";
      },
    },
    async created() {
      await this.fetchUserAccount();
    },
  };
  </script>
  