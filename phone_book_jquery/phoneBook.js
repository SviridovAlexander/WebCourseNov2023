$(function () {
    let contacts = [];
    let selectedRowsIndices = [];
    const contactsTable = $(".contacts-table-body");
    const phoneNumberField = $("#phone-number");
    const lastNameField = $("#last-name");
    const firstNameField = $("#first-name");

    function validateForm() {
        let isValid = true;
        const fieldIds = ["last-name", "first-name", "phone-number"];
        const phoneNumber = phoneNumberField.val().trim();

        for (const fieldId of fieldIds) {
            const currentField = $("#" + fieldId);
            const value = currentField.val().trim();

            if (value === "") {
                currentField.addClass("error");
                currentField.after(`<p class="error-text validation-message-form">Please fill out the field.</p>`);
                isValid = false;
            }
        }

        if (contacts.some(contact => contact.phoneNumber === phoneNumber)) {
            phoneNumberField.addClass("error");
            phoneNumberField.after(`<p class="error-text validation-message-form-phone">Contact with this phone number already exists.</p>`);
            isValid = false;
        }

        return isValid;
    }

    function updateRowIndices() {
        const remainingRows = contactsTable.children();

        remainingRows.each(function (i) {
            const currentRow = $(this);

            currentRow.find(".contact-number").text(i + 1);
            currentRow.prop("id", `row-index-${i}`);
            currentRow.find("[data-index]").attr("data-index", i);
        });
    }

    function deleteRows(rowsIndicesToDelete) {
        const newContacts = [];

        for (let i = 0; i < contacts.length; i++) {
            if (!rowsIndicesToDelete.includes(i)) {
                newContacts.push(contacts[i]);
            } else {
                const selectedRow = $(`#row-index-${i}`);
                selectedRow.remove();
            }
        }

        contacts = newContacts;
    }

    $(".add-contact-form").submit(function (e) {
        e.preventDefault();

        $("form input").removeClass("error");
        $(".add-contact-form .validation-message-form, .validation-message-form-phone").remove();

        if (validateForm()) {
            const lastName = lastNameField.val().trim();
            const firstName = firstNameField.val().trim();
            const phoneNumber = phoneNumberField.val().trim();

            $("#last-name, #first-name, #phone-number").val("");

            contactsTable.append(createContactRow(contacts, lastName, firstName, phoneNumber, contacts.length));
            contacts.push({lastName, firstName, phoneNumber});
        }
    });

    function showConfirmationDialog(deleteCallback) {
        $("#confirmation-dialog").dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Delete": function () {
                    $(this).dialog("close");
                    deleteCallback();
                },
                "Cancel": function () {
                    $(this).dialog("close");
                }
            }
        });
    }

    $(document).on("click", ".delete-contact", function () {
        const index = $(this).data("index");

        showConfirmationDialog(function () {
            const deletedRow = $(`#row-index-${index}`);
            deletedRow.remove();
            contacts.splice(index, 1);
            selectedRowsIndices = selectedRowsIndices
                .filter(rowIndex => rowIndex !== index)
                .map(rowIndex => rowIndex - 1);
            updateRowIndices();
        });
    });

    $(document).on("click", ".delete-selected-contacts-button", function () {
        if (selectedRowsIndices.length > 0) {
            showConfirmationDialog(function () {
                deleteRows(selectedRowsIndices);
                selectedRowsIndices = [];
                updateRowIndices();
            });
        }
    });

    $(document).on("click", ".edit-contact", function () {
        const editIndex = $(this).data("index");

        const contactToEdit = contacts[editIndex];
        const editedRow = `
            <tr id="row-index-${editIndex}">
                <td><input type="checkbox" class="select-row" data-index="${editIndex}" /></td>
                <td class="contact-number">${editIndex + 1}</td>
                <td><input type="text" class="edit-field" id="edit-last-name-${editIndex}" value="${contactToEdit.lastName}" /></td>
                <td><input type="text" class="edit-field" id="edit-first-name-${editIndex}" value="${contactToEdit.firstName}" /></td>
                <td><input type="text" class="edit-field" id="edit-phone-number-${editIndex}" value="${contactToEdit.phoneNumber}" /></td>
                <td>
                    <button class="cancel-edit danger-button" data-index="${editIndex}">Cancel</button>
                    <button class="save-contact" data-index="${editIndex}">Save</button>
                </td>
            </tr>`;

        $(`#row-index-${editIndex}`).replaceWith(editedRow);
    });

    $(document).on("click", ".cancel-edit", function () {
        const index = $(this).data("index");
        const originalRow = `
            <tr id="row-index-${index}">
                <td><input type="checkbox" class="select-row" data-index="${index}" /></td>
                <td class="contact-number">${index + 1}</td>
                <td>${contacts[index].lastName}</td>
                <td>${contacts[index].firstName}</td>
                <td>${contacts[index].phoneNumber}</td>
                <td>
                    <button class="delete-contact danger-button" data-index="${index}">Delete</button>
                    <button class="edit-contact" data-index="${index}">Edit</button>
                </td>
            </tr>`;

        $(`#row-index-${index}`).replaceWith(originalRow);
    });

    $(document).on("click", ".save-contact", function () {
        let isValid = true;
        const index = $(this).data("index");
        const lastName = $(`#edit-last-name-${index}`).val().trim();
        const firstName = $(`#edit-first-name-${index}`).val().trim();
        const phoneNumberField = $(`#edit-phone-number-${index}`);
        const phoneNumber = phoneNumberField.val().trim();
        const editField = $(`#row-index-${index} .edit-field`);

        $(`#row-index-${index} .error-text`).remove();
        editField.removeClass("error");

        if (!lastName || !firstName || !phoneNumber) {
            editField.each(function () {
                const value = $(this).val().trim();
                if (!value) {
                    $(this).addClass("error");
                    $(this).after(`<p class="error-text">Please fill out the field.</p>`);
                    isValid = false;
                }
            });
        }

        if (contacts.some(contact => contact.phoneNumber === phoneNumber && contacts.indexOf(contact) !== index)) {
            phoneNumberField.addClass("error");
            phoneNumberField.after(`<p class="error-text">Contact with this phone number already exists.</p>`);
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        $(`#row-index-${index}`).replaceWith(createContactRow(contacts, lastName, firstName, phoneNumber, index));
        contacts[index] = {lastName, firstName, phoneNumber};
    });

    $(document).on("change", ".select-row", function () {
        const index = $(this).data("index");

        if ($(this).prop("checked")) {
            selectedRowsIndices.push(index);
        } else {
            selectedRowsIndices = selectedRowsIndices.filter(row => row !== index);
        }
    });

    $("#select-all-rows").change(function () {
        const isChecked = $(this).prop("checked");
        $(".select-row").prop("checked", isChecked);
        selectedRowsIndices = isChecked ? Array.from({length: contacts.length}, (_, i) => i) : [];
    });

    $("#apply-filter").click(function () {
        const filterText = $("#filter").val().toLowerCase();
        const contactsTable = $(".contacts-table-body");

        contactsTable.find("tr").each(function () {
            const row = $(this);
            const rowText = row.find("td:gt(1):lt(3)").text().toLowerCase();
            const isRowContainsFilteredText = rowText.includes(filterText);

            if (isRowContainsFilteredText) {
                row.show();
                return;
            }

            const editFields = row.find(".edit-field");
            const isRowBeingEdited = editFields.length > 0;

            if (isRowBeingEdited) {
                const editedValuesMatchFilter = editFields.filter(function () {
                    return $(this).val().toLowerCase().includes(filterText);
                }).length > 0;

                if (editedValuesMatchFilter) {
                    row.show();
                    return;
                }
            }

            row.hide();
        });
    });

    $("#reset-filter").click(function () {
        $("#filter").val("");
        contactsTable.find("tr").show();
    });

    function createContactRow(contacts, lastName, firstName, phoneNumber, index) {
        const row = $("<tr>").attr("id", `row-index-${index}`);

        $("<td>").append(
            $("<input>").attr({
                type: "checkbox",
                class: "select-row",
                "data-index": index
            })
        ).appendTo(row);

        $("<td>").addClass("contact-number").text(index + 1).appendTo(row);

        $("<td>").text(lastName).appendTo(row);
        $("<td>").text(firstName).appendTo(row);
        $("<td>").text(phoneNumber).appendTo(row);

        $("<td>").append(
            $("<button>").addClass("delete-contact danger-button").attr("data-index", index).text("Delete"),
            $("<button>").addClass("edit-contact").attr("data-index", index).text("Edit")
        ).appendTo(row);

        $("#your-table-id").append(row);

        return row;
    }
});