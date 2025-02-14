(function () {
    "use strict"

    const userStore = Vue.reactive({
        currentUser: undefined,
        token: undefined,
    });


    const Login = {
        template: '#login',
        data() {
            return {
                store: userStore,
                userName: "",
            }
        },
        methods: {
            login() {
                /// This endpoint doesn't take a password. It's intentional :)
                fetch('/api/Auth/Authenticate?userName=' + encodeURIComponent(this.userName), {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(resp => resp.text().then(token => {
                    this.store.token = token;
                    this.store.currentUser = this.userName;
                }));
            }
        },
        mounted() {
            this.$refs.userName.focus();
        }
    }


    const TaskList = {
        template: '#task-list',
        data() {
            return {
                items: [],
                newItemText: "",
                store: userStore
            }
        },
        methods: {
            addItem() {
                if (this.newItemText.length < 1) return;

                fetch('/api/Task/Add', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + this.store.token,
                    },
                    body: JSON.stringify({
                        text: this.newItemText,
                        owner: this.store.currentUser,
                        isCompleted: false,
                    }),
                }).then(resp => resp.json().then(task => {
                    this.updateList();
                    this.newItemText = "";
                }));

            },
            updateList() {
                fetch('/api/Task/List?userName=' + encodeURIComponent(this.store.currentUser), {
                    method: 'GET',
                    headers: {
                        "Authorization": "Bearer " + this.store.token,
                    }
                }).then(resp => resp.json().then(tasks => {
                    this.items = tasks;
                }));
            }
        },
        computed: {
            completeCount() {
                return this.items.filter(q => q.isCompleted).length;
            },
            incompleteCount() {
                return this.items.filter(q => !q.isCompleted).length;
            }
        },
        mounted() {
            console.log("TaskList mounted");
            this.updateList();
            this.$refs.taskInput.focus();
        }
    }

    const TaskItem = {
        template: '#task-item',
        props: {
            item: Object,
        },
        data() {
            return {
                store: userStore,
            }
        },
        computed: {
            itemClass() {
                return this.item.isCompleted ? "complete" : "incomplete";
            }
        },
        emits: [
            "itemUpdated"
        ],
        methods: {
            toggle(itemId) {
                console.log("Toggle", itemId);
                fetch('/api/Task/Toggle?taskId=' + itemId, {
                    method: 'PUT',
                    headers: {
                        "Authorization": "Bearer " + this.store.token,
                    }
                }).then(resp => {
                    this.$emit("itemUpdated");
                });
            },
            remove(itemId) {
                console.log("Remove", itemId);
                fetch('/api/Task/Remove?taskId=' + itemId, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": "Bearer " + this.store.token,
                    }
                }).then(resp => {
                });
            }
        },
        mounted() {
            console.log("TaskItem mounted");
        }
    }

    const TodoApp = {
        data() {
            return {
                store: userStore,
            }
        },
        methods: {
          logout() {
              this.store.token = undefined;
              this.store.currentUser = undefined;
          }  
        },
        created() {
            console.log("TodoApp created");
        }
    }

    const app = Vue.createApp(TodoApp);
    app.component('login', Login);
    app.component('task-list', TaskList);
    app.component('task-item', TaskItem);
    app.mount("#todo-app");
})();