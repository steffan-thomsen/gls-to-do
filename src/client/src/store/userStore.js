import { reactive } from 'vue';

export const userStore = reactive({
  currentUser: null,
  token: null,

  logout() {
    this.token = null;
    this.currentUser = null;
  },
});
