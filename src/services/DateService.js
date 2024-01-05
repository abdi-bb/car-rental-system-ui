// src/services/DateService.js

export default {
    formatReadableDate(dateString) {
      const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
      return new Date(dateString).toLocaleString(undefined, options);
    },
  };
  