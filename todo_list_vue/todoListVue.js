Vue.createApp({})
    .component("TodoList", {
        data() {
            return {
                items: [],
                newTodoItemText: "",
                newTodoItemId: 1,
                validationError: null
            };
        },

        methods: {
            addTodoItem() {
                if (this.newTodoItemText === "") {
                    this.validationError = "Input cannot be empty";
                    return;
                }

                this.validationError = null;

                const newTodoItem = {
                    id: this.newTodoItemId,
                    text: this.newTodoItemText
                };

                this.items.push(newTodoItem);
                this.newTodoItemText = "";
                this.newTodoItemId++;
            },

            deleteTodoItem(item) {
                this.items = this.items.filter(x => x !== item);
            }
        },

        template: `
          <form @submit.prevent="addTodoItem" class="row">
            <label class="col">
              <input v-model.trim="newTodoItemText"
                     class="form-control"
                     type="text"
                     :class="{ 'is-invalid': validationError }">
            </label>
            <div class="col-auto">
              <button class="btn btn-primary">Add</button>
            </div>
          </form>
          <div class="row">
          <div v-if="validationError" class="col invalid-feedback d-block">
            {{ validationError }}
          </div>
          </div>
          <ul class="list-unstyled mt-4">
            <todo-list-item v-for="item in items"
                            :key="item.id"
                            :item="item"
                            @save-item="item.text=$event"
                            @delete-item="deleteTodoItem(item)"></todo-list-item>
          </ul>`
    })
    .component("TodoListItem", {
        props: {
            item: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                isEditing: false,
                editingText: this.item.text,
                validationError: null
            };
        },

        methods: {
            save() {
                if (this.editingText === "") {
                    this.validationError = "Input cannot be empty";
                    return;
                }

                this.validationError = null;

                this.isEditing = false;
                this.$emit("save-item", this.editingText);
            },
            cancel() {
                this.isEditing = false;
                this.editingText = this.item.text;
                this.validationError = null;
            }
        },

        template: `
          <li class="mb-2">
            <div class="row" v-if="!isEditing">
              <div class="col text-justify">
                {{ item.text }}
              </div>
              <div class="col-auto">
                <button @click="$emit('delete-item')" class="btn btn-danger me-2" type="button">Delete</button>
                <button @click="isEditing = true" class="btn btn-primary" type="button">Edit</button>
              </div>
            </div>
            <div class="row" v-else>
              <div class="col">
                <input v-model.trim="editingText"
                       @keyup.enter="save"
                       class="form-control"
                       :class="{ 'is-invalid': validationError }">
              </div>
              <div class="col-auto">
                <button @click="cancel" class="btn btn-secondary me-2" type="button">Cancel</button>
                <button @click="save" class="btn btn-primary" type="button">Save</button>
              </div>
            </div>
            <div v-if="validationError" class="ms-1 invalid-feedback d-block">
              {{ validationError }}
            </div>
          </li>`
    })
    .mount("#app");
