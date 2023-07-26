const Memcached = require('memcached');

// Replace '127.0.0.1:11211' with your Memcached server's address and port.
const memcached = new Memcached('127.0.0.1:11211');

function calculateFactorial(number, callback) {
  // Check if the result is already cached
  memcached.get(number.toString(), (err, cachedResult) => {
    if (err || cachedResult === undefined) {
      // If the result is not cached, perform the calculation
      let result = 1;
      for (let i = 2; i <= number; i++) {
        result *= i;
      }

      // Cache the result for future use (expiration time in seconds, e.g., 60 seconds)
      memcached.set(number.toString(), result, 60, (err) => {
        if (err) {
          console.error('Error caching the result:', err);
        }
      });

      // Return the result via callback
      callback(result);
    } else {
      // If the result is cached, return it directly
      callback(cachedResult);
    }
  });
}

// Example usage:
calculateFactorial(5, (result) => {
  console.log('Factorial of 5:', result);

  // Call the function again to get the cached result
  calculateFactorial(5, (cachedResult) => {
    console.log('Cached factorial of 5:', cachedResult);
  });
});

