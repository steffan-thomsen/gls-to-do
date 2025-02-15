(function () {
  'use strict';

  const userStore = Vue.reactive({
    currentUser: null,
    token: null,
  });

  // Helper function for API calls
  async function apiCall(url, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    } catch (error) {
      console.error('API error:', error);
      return null;
    }
  }

  const Login = {
    template: '#login',
    setup() {
      const userName = Vue.ref('');
      const store = userStore;

      async function login() {
        try {
          const resp = await fetch(
            `/api/Auth/Authenticate?userName=${encodeURIComponent(
              userName.value
            )}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            }
          );

          if (!resp.ok) throw new Error('Login failed');

          store.token = await resp.text();
          store.currentUser = userName.value;
        } catch (error) {
          console.error('Login error:', error);
        }
      }

      return {
        store,
        userName,
        login,
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.userName?.focus();
      });
    },
  };

  // Task List
  const TaskList = {
    template: '#task-list',
    setup() {
      const items = Vue.ref([]);
      const newItemText = Vue.ref('');
      const store = userStore;

      async function addItem() {
        if (newItemText.value.length < 1) return;

        const task = await apiCall(
          '/api/Task/Add',
          'POST',
          {
            text: newItemText.value,
            owner: store.currentUser,
            isCompleted: false,
          },
          store.token
        );

        if (task) {
          newItemText.value = '';
          updateList();
        }
      }

      async function updateList() {
        const tasks = await apiCall(
          `/api/Task/List?userName=${encodeURIComponent(store.currentUser)}`,
          'GET',
          null,
          store.token
        );
        if (tasks) items.value = tasks;
      }

      return {
        items,
        newItemText,
        store,
        addItem,
        updateList,
      };
    },
    computed: {
      completeCount() {
        return this.items.filter((q) => q.isCompleted).length;
      },
      incompleteCount() {
        return this.items.filter((q) => !q.isCompleted).length;
      },
    },
    mounted() {
      console.log('TaskList mounted');
      this.updateList();
      this.$nextTick(() => this.$refs.taskInput.focus());
    },
  };

  // Task Item
  const TaskItem = {
    template: '#task-item',
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    emits: ['itemUpdated'],
    setup(props, { emit }) {
      const store = userStore;

      async function toggle(itemId) {
        try {
          const resp = await fetch(`/api/Task/Toggle?taskId=${itemId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${store.token}`,
            },
          });

          if (!resp.ok) throw new Error('Toggle failed');
          emit('itemUpdated');
        } catch (error) {
          console.error('Toggle error:', error);
        }
      }

      async function remove(itemId) {
        console.log('Remove', itemId);
        const result = await apiCall(
          `/api/Task/Remove?taskId=${itemId}`,
          'DELETE',
          null,
          store.token
        );
        if (result) {
          console.log(result.message);
          emit('itemUpdated');
        }
      }

      return {
        store,
        toggle,
        remove,
      };
    },
    computed: {
      itemClass() {
        return this.item.isCompleted ? 'complete' : 'incomplete';
      },
    },
    mounted() {
      console.log('TaskItem mounted');
    },
  };

  // Main Todo App
  const TodoApp = {
    setup() {
      const store = userStore;

      function logout() {
        store.token = undefined;
        store.currentUser = undefined;
      }

      return {
        store,
        logout,
      };
    },
    created() {
      console.log('TodoApp created');
    },
  };

  // Vue App
  const app = Vue.createApp(TodoApp);
  app.component('login', Login);
  app.component('task-list', TaskList);
  app.component('task-item', TaskItem);
  app.mount('#todo-app');
})();
