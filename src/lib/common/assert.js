define(function() {
  return function assert(condition, message) {
    if (!condition) {
      console.error(message);
    }
  };
});