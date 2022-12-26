export function saveToStorage(value) {
  window.localStorage.setItem('the-key', value);
}
export const fakeLocalStorage = (function storage() {
  let store = {
    token: '',
  };
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
}());
