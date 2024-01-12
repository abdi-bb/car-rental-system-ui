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
            <strong>Username:</strong> {{ targetUser.username }}
          </p>
          <hr class="my-4" />
          <p class="mt-2 flex justify-between">
            <strong>Email:</strong> {{ targetUser.email }}
          </p>
          <hr class="my-4" />
          <p class="mt-2 flex justify-between">
            <strong>First Name:</strong> {{ targetUser.first_name }}
          </p>
          <hr class="my-4" />
          <p class="mt-2 flex justify-between">
            <strong>Last Name:</strong> {{ targetUser.last_name }}
          </p>
          <hr class="my-4" />
          <p class="mt-2 flex justify-between">
            <strong>Phone Number:</strong> {{ targetUser.phone_number }}
          </p>
          <hr class="my-4" />
        </div>

        <button
          @click="deleteUser"
          class="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Delete Account
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      targetUser: {},
    };
  },
  methods: {
    async fetchUserAccount() {
      try {
        const accessToken = localStorage.getItem('accessToken');

        const headers = {
          'Authorization': `JWT ${accessToken}`,
        };
        const response = await fetch(`http://127.0.0.1:8000/api/v1/auth/users/${this.$route.params.userId}`, { headers });

        if (response.ok) {
          const data = await response.json();
          this.targetUser = data;
        } else {
          console.error("Failed to fetch targetUser account information");
        }
      } catch (error) {
        console.error("Error during fetching targetUser account information", error);
      }
    },


    async deleteUser() {
      try {
    
        const accessToken = localStorage.getItem('accessToken');
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
        };
         // Prompt the user for their current password
        const current_password = prompt("Please enter your password to confirm account deletion");
        const requestBody = {
          current_password: current_password,
        };

        const response = await fetch(`http://localhost:8000/api/v1/auth/users/${this.targetUser.id}`, {
          method: "DELETE",
          headers: headers,
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          console.log("Account deleted successfully");
          this.$router.push({ name: "UsersList" });
        } else {
          console.error("Failed to delete account");
        }
      } catch (error) {
        console.error("Error during deleting account", error);
      }
    },
  },
  async created() {
    await this.fetchUserAccount();
  },
};
</script>
