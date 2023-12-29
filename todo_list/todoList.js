document.addEventListener("DOMContentLoaded", function () {
    const addTodoForm = document.getElementById("add-todo-form");
    const todoList = document.getElementById("todo-list");
    const newTodoTextField = document.getElementById("new-todo-text-field");

    addTodoForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let newTodoText = newTodoTextField.value.trim();
        newTodoTextField.classList.remove("invalid");

        if (newTodoText.length === 0) {
            newTodoTextField.classList.add("invalid");
            return;
        }

        const newTodo = document.createElement("li");
        newTodo.classList.add("todo-item");

        function setViewMode() {
            newTodo.innerHTML = `<span class="todo-item-text"></span>
                    <button class="delete-button" type="button">Delete</button>
                    <button class="edit-button" type="button">Edit</button>`;

            newTodo.querySelector(".todo-item-text").textContent = newTodoText;

            newTodo.querySelector(".delete-button").addEventListener("click", function () {
                newTodo.remove();
            });

            newTodo.querySelector(".edit-button").addEventListener("click", function () {
                newTodo.innerHTML = `<input type="text" class="edit-text-field">
                    <button class="cancel-button" type="button">Cancel</button>
                    <button class="save-button" type="button">Save</button>
                    <div class="edit-error-message-block"></div>
                    <div class="error-message">Need to insert text</div>`;

                const editTextField = newTodo.querySelector(".edit-text-field");
                editTextField.value = newTodoText;

                newTodo.querySelector(".cancel-button").addEventListener("click", function () {
                    setViewMode();
                });

                newTodo.querySelector(".save-button").addEventListener("click", function () {
                    saveChanges();
                });

                editTextField.addEventListener("keyup", function (event) {
                    if (event.key === "Enter") {
                        saveChanges();
                    }
                });

                function saveChanges() {
                    const changedTodoText = editTextField.value.trim();

                    if (changedTodoText.length === 0) {
                        newTodo.querySelector(".edit-error-message-block").classList.add("invalid");
                        newTodo.querySelector(".edit-text-field").classList.add("invalid");
                        return;
                    }

                    newTodoText = changedTodoText;
                    setViewMode();
                }
            });
        }

        setViewMode();
        todoList.append(newTodo);
        newTodoTextField.value = "";
    });
});