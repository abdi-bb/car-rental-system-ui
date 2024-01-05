<template>
  <div class="car-details">
    <h1>Car Details Page</h1>
    <div v-if="car">
      <h2>{{ car.name }}</h2>
      <div class="car-info">
        <p><strong>Model:</strong> {{ car.model }}</p>
        <p><strong>Description:</strong> {{ car.desc }}</p>
        <p><strong>Available:</strong> {{ car.available ? 'Yes' : 'No' }}</p>
        <p><strong>Seats:</strong> {{ car.seat }}</p>
        <p><strong>Doors:</strong> {{ car.door }}</p>
        <p><strong>Transmission:</strong> {{ car.gearbox }}</p>
        <p><strong>Price:</strong> ${{ car.price.toFixed(2) }}</p>
      </div>
    </div>
    <div v-else>
      <p>Car not found</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      car: null,
    };
  },
  watch: {
    id(newId) {
      this.fetchCarDetails(newId);
    },
  },
  created() {
    this.fetchCarDetails(this.id);
  },
  methods: {
    async fetchCarDetails(id) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/cars/${id}`);
        if (!response.ok) {
          throw new Error('Car not found');
        }
        this.car = await response.json();
      } catch (error) {
        console.error(error.message);
        this.car = null;
      }
    },
  },
};
</script>

<style>
.car-details {
  max-width: 600px;
  margin: 0 auto;
}

h1, h2 {
  text-align: center;
}

.car-info {
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}

.car-info p {
  margin: 5px 0;
}

.car-info strong {
  margin-right: 5px;
  font-weight: bold;
}
</style>
