import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  userPassword: {},
  
  addUser: (userData) => set((state) => ({
    userPassword: {
        ...state.userPassword,
        [userData.username]: userData.password
    }
  })), 
  
  // Save to localStorage
  saveToLocalStorage: () => {
    const state = get();
    localStorage.setItem('usersStore', JSON.stringify({
        userPassword: state.userPasswordd
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