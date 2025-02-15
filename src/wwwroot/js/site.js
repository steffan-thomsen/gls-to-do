(function () {
  'use strict';

  // Reactive global store
  const userStore = Vue.ref({
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

  // Login Component
  const Login = {
    template: '#login',
    data() {
      return {
        store: userStore,
        userName: '',
      };
    },
    methods: {
      async login() {
        try {
          const resp = await fetch(
            `/api/Auth/Authenticate?userName=${encodeURIComponent(
              this.userName
            )}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            }
          );

          if (!resp.ok) throw new Error('Login failed');

          this.store.token = await resp.text();
          this.store.currentUser = this.userName;
        } catch (error) {
          console.error('Login error:', error);
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.userName?.focus();
      });
    },
  };

  // Task List Component
  const TaskList = {
    template: '#task-list',
    data() {
      return {
        items: [],
        newItemText: '',
        store: userStore,
      };
    },
    methods: {
      async addItem() {
        if (this.newItemText.length < 1) return;

        const task = await apiCall(
          '/api/Task/Add',
          'POST',
          {
            text: this.newItemText,
            owner: this.store.currentUser,
            isCompleted: false,
          },
          this.store.token
        );

        if (task) {
          this.newItemText = '';
          this.updateList();
        }
      },
      async updateList() {
        const tasks = await apiCall(
          `/api/Task/List?userName=${encodeURIComponent(
            this.store.currentUser
          )}`,
          'GET',
          null,
          this.store.token
        );
        if (tasks) this.items = tasks;
      },
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

  // Task Item Component
  const TaskItem = {
    template: '#task-item',
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
    emits: ['itemUpdated'],
    data() {
      return {
        store: userStore,
      };
    },
    computed: {
      itemClass() {
        return this.item.isCompleted ? 'complete' : 'incomplete';
      },
    },
    methods: {
      async toggle(itemId) {
        try {
          const resp = await fetch(`/api/Task/Toggle?taskId=${itemId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.store.token}`,
            },
          });

          if (!resp.ok) throw new Error('Toggle failed');
          this.$emit('itemUpdated');
        } catch (error) {
          console.error('Toggle error:', error);
        }
      },
      async remove(itemId) {
        console.log('Remove', itemId);
        const result = await apiCall(
          `/api/Task/Remove?taskId=${itemId}`,
          'DELETE',
          null,
          this.store.token
        );
        if (result) {
          console.log(result.message);
          this.$emit('itemUpdated');
        }
      },
    },
    mounted() {
      console.log('TaskItem mounted');
    },
  };

  // Main Todo App Component
  const TodoApp = {
    data() {
      return {
        store: userStore,
      };
    },
    methods: {
      logout() {
        this.store.token = undefined;
        this.store.currentUser = undefined;
      },
    },
    created() {
      console.log('TodoApp created');
    },
  };

  // Vue App Initialization
  const app = Vue.createApp(TodoApp);
  app.component('login', Login);
  app.component('task-list', TaskList);
  app.component('task-item', TaskItem);
  app.mount('#todo-app');
})();
