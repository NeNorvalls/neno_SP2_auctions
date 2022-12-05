const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const load = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
};

const remove = (key) => localStorage.removeItem(key);
