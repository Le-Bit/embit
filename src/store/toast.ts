import { defineStore } from "pinia";

export interface State {
  lastNotification: any;
  showNotification: boolean;
  lastError: any;
  showError: boolean;
  showUpTime: number;
}

export const useToastStore = defineStore({
  id: "toast",
  state(): State {
    return {
      lastNotification: "",
      lastError: "",
      showError: false,
      showNotification: false,
      showUpTime: 6000,
    };
  },
  getters: {
    getLastError(state: State) {
      return state.lastError;
    },
  },
  actions: {
    setError(error: any) {
      this.lastError = error;
      this.showError = true;
      setTimeout(() => (this.showError = false), this.showUpTime);
    },
    hideError() {
      this.showError = false;
    },
    setNotification(error: any) {
      this.lastNotification = error;
      this.showNotification = true;
      setTimeout(() => (this.showNotification = false), this.showUpTime);
    },
  },
});
