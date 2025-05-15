import { create } from 'zustand';
import bcrypt from 'bcryptjs';

const useUserStore = create((set, get) => ({
  userPassword: {},

  // Add user with hashed password
  addUser: async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    set((state) => ({
      userPassword: {
        ...state.userPassword,
        [userData.username]: hashedPassword
      }
    }));
  },

  // Check credentials using bcrypt.compare
  checkCredentials: async (username, password) => {
    const state = get();
    const hashedPassword = state.userPassword[username];
    if (!hashedPassword) return false;
    return await bcrypt.compare(password, hashedPassword);
  },

  // Save to localStorage
  saveToLocalStorage: () => {
    const state = get();
    localStorage.setItem('usersStore', JSON.stringify({
      userPassword: state.userPassword
    }));
  },

  // Load from localStorage
  loadFromLocalStorage: () => {
    const saved = localStorage.getItem('usersStore');
    if (saved) {
      const { userPassword } = JSON.parse(saved);
      set({ userPassword: userPassword || {} });
    }
  },
}));

export default useUserStore;