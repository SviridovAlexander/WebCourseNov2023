$(function () {
    const todoList = $("#todo-list");
    const newTodoTextField = $("#new-todo-text-field");

    $("#add-todo-form").submit(function (e) {
        e.preventDefault();

        let newTodoText = newTodoTextField.val().trim();
        newTodoTextField.removeClass("invalid");

        if (newTodoText.length === 0) {
            newTodoTextField.addClass("invalid");
            return;
        }

        const newTodo = $("<li>").addClass("todo-item");

        function setViewMode() {
            newTodo.html(`<span class="todo-item-text"></span>
                    <button class="delete-button" type="button">Delete</button>
                    <button class="edit-button" type="button">Edit</button>`);

            newTodo.find(".todo-item-text").text(newTodoText);

            newTodo.find(".delete-button").click(function () {
                newTodo.remove();
            });

            newTodo.find(".edit-button").click(function () {
                newTodo.html(`<input type="text" class="edit-text-field">
                    <button class="cancel-button" type="button">Cancel</button>
                    <button class="save-button" type="button">Save</button>
                    <div class="edit-error-message-block"></div>
                    <div class="error-message">Need to insert text</div>`);

                const editTextField = newTodo.find(".edit-text-field");
                editTextField.val(newTodoText);

                newTodo.find(".cancel-button").click(function () {
                    setViewMode();
                });

                newTodo.find(".save-button").click(function () {
                    saveChanges();
                });

                $(editTextField).keyup(function (event) {
                    if (event.key === "Enter") {
                        saveChanges();
                    }
                });

                function saveChanges() {
                    const changedTodoText = editTextField.val().trim();

                    if (changedTodoText.length === 0) {
                        newTodo.find(".edit-error-message-block").addClass("invalid");
                        editTextField.addClass("invalid");
                        return;
                    }

                    newTodoText = changedTodoText;
                    setViewMode();
                }
            });
        }

        setViewMode();
        todoList.append(newTodo);
        newTodoTextField.val("");
    });
});