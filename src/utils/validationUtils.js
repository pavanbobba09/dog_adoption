export function isValidEmail(email) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email); // just checking valid email format
  }
  
  export function isValidName(name, minLength = 2) {
    if (!name || typeof name !== 'string') return false;
    return name.trim().length >= minLength; // name should be not too short
  }
  
  export function sanitizeInput(input) {
    if (!input || typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, ''); // remove unsafe chars like < >
  }
  
  export function debounce(func, wait = 300) {
    let timeout;
  
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
  
      clearTimeout(timeout);
      timeout = setTimeout(later, wait); // delay function call
    };
  }
  