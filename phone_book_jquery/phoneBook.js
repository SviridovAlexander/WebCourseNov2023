$(function () {
    let contacts = [];
    let selectedRows = [];
    let contactsCount = 0;
    let contactsTable = $(".contacts-table-body");

    function validateForm() {
        let isValid = true;
        const fields = ["last-name", "first-name", "phone-number"];

        for (const field of fields) {
            let currentField = $("#" + field);
            const value = currentField.val().trim();

            if (value === "") {
                currentField.addClass("error");
                $(`#${field}`).after(`<p class="validation-message">Please fill out the field.</p>`);
                isValid = false;
            }
        }

        return isValid;
    }

    function resetForm() {
        $("#lastName, #firstName, #phoneNumber").val("");
        $("form input").removeClass("error");
        $(".validation-message").remove();
    }

    function updateRowIndexes() {
        const remainingRows = contactsTable.children();
        for (let i = 0; i < remainingRows.length; i++) {
            const currentRow = $(remainingRows[i]);
            const newIndex = i;

            currentRow.find(".contact-number").text(newIndex + 1);
            currentRow.attr("id", `row-index-${newIndex}`);
            currentRow.find("[data-index]").attr("data-index", newIndex);
        }
    }

    function deleteRows(indices) {
        for (let i = indices.length - 1; i >= 0; i--) {
            const selectedIndex = indices[i];
            const selectedRow = $(`#row-index-${selectedIndex}`);
            selectedRow.remove();
            delete contacts[selectedIndex];
            contactsCount--;
        }

        contacts = contacts.filter(Boolean);
    }

    $(".add-contact-form").submit(function (e) {
        e.preventDefault();
        resetForm();

        if (validateForm()) {
            const phoneNumberBlock = $("#phone-number");
            const lastName = $("#last-name").val().trim();
            const firstName = $("#first-name").val().trim();
            const phoneNumber = phoneNumberBlock.val().trim();

            if (contacts.find(contact => contact.phoneNumber === phoneNumber)) {
                phoneNumberBlock.addClass("error");
                phoneNumberBlock.after(`<p class="validation-message">Contact with this phone number already exists.</p>`);
                return;
            }

            contactsCount++;
            const row = `<tr id="row-index-${contactsCount - 1}">
                <td><input type="checkbox" class="selectRow" data-index="${contactsCount - 1}" /></td>
                <td class="contact-number">${contactsCount}</td>
                <td>${lastName}</td>
                <td>${firstName}</td>
                <td>${phoneNumber}</td>
                <td>
                    <button class="delete-contact" data-index="${contactsCount - 1}">Delete</button>
                    <button class="edit-contact" data-index="${contactsCount - 1}">Edit</button>
                </td>
            </tr>`;

            //$("#last-name, #first-name, #phone-number").val("");

            contactsTable.append(row);
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
            if (selectedRows.length > 0) {
                deleteRows(selectedRows);
                selectedRows = [];
                updateRowIndexes();
            }

            const deletedRow = $(`#row-index-${index}`);
            const changedRows = deletedRow.nextAll();
            deletedRow.remove();
            contactsCount--;
            contacts.splice(index, 1);
            updateRowIndexes(changedRows);
        });
    });

    $(document).on("click", ".edit-contact", function () {
        let editIndex = $(this).data("index");

        const contactToEdit = contacts[editIndex];
        const editedRow = `
            <tr id="row-index-${editIndex}">
                <td><input type="checkbox" class="selectRow" data-index="${editIndex}" /></td>
                <td class="contact-number">${editIndex + 1}</td>
                <td><input type="text" class="edit-field" id="edit-last-name" value="${contactToEdit.lastName}" /></td>
                <td><input type="text" class="edit-field" id="edit-first-name" value="${contactToEdit.firstName}" /></td>
                <td><input type="text" class="edit-field" id="edit-phone-number" value="${contactToEdit.phoneNumber}" /></td>
                <td>
                    <button class="cancel-edit" data-index="${editIndex}">Cancel</button>
                    <button class="save-contact" data-index="${editIndex}">Save</button>
                </td>
            </tr>`;

        $(`#row-index-${editIndex}`).replaceWith(editedRow);
    });

    $(document).on("click", ".cancel-edit", function () {
        const index = $(this).data("index");
        const originalRow = `
            <tr id="row-index-${index}">
                <td><input type="checkbox" class="selectRow" data-index="${index}" /></td>
                <td class="contact-number">${index + 1}</td>
                <td>${contacts[index].lastName}</td>
                <td>${contacts[index].firstName}</td>
                <td>${contacts[index].phoneNumber}</td>
                <td>
                    <button class="delete-contact" data-index="${index}">Delete</button>
                    <button class="edit-contact" data-index="${index}">Edit</button>
                </td>
            </tr>`;

        $(`#row-index-${index}`).replaceWith(originalRow);
    });

    $(document).on("click", ".save-contact", function () {
        const index = $(this).data("index");
        const lastName = $("#edit-last-name").val().trim();
        const firstName = $("#edit-first-name").val().trim();
        const phoneNumber = $("#edit-phone-number").val().trim();
        const editFieldBlock = $(".edit-field");

        $(".validation-message").remove();
        editFieldBlock.removeClass("error");

        if (!lastName || !firstName || !phoneNumber) {
            editFieldBlock.each(function () {
                const value = $(this).val().trim();
                if (!value) {
                    $(this).addClass("error");
                    $(this).after(`<p class="validation-message">Please fill out the field.</p>`);
                }
            });

            return;
        }

        const editedRow = `
            <tr id="row-index-${index}">
                <td><input type="checkbox" class="selectRow" data-index="${index}" /></td>
                <td class="contact-number">${index + 1}</td>
                <td>${lastName}</td>
                <td>${firstName}</td>
                <td>${phoneNumber}</td>
                <td>
                    <button class="delete-contact" data-index="${index}">Delete</button>
                    <button class="edit-contact" data-index="${index}">Edit</button>
                </td>
            </tr>`;

        $(`#row-index-${index}`).replaceWith(editedRow);
        contacts[index] = {lastName, firstName, phoneNumber};
    });

    $(document).on("change", ".selectRow", function () {
        const index = $(this).data("index");

        if ($(this).prop("checked")) {
            selectedRows.push(index);
        } else {
            selectedRows = selectedRows.filter(row => row !== index);
        }
    });

    $("#selectAllRows").on("change", function () {
        const isChecked = $(this).prop("checked");
        $(".selectRow").prop("checked", isChecked);
        selectedRows = isChecked ? Array.from({length: contacts.length}, (_, i) => i) : [];
    });

    $("#apply-filter").on("click", function applyFilter() {
        const filterText = $("#filter").val().toLowerCase();
        contactsTable.find('tr').show();
        if (filterText !== "") {
            contactsTable.find('tr').each(function () {
                const row = $(this);
                const rowText = row.text().toLowerCase();
                if (rowText.indexOf(filterText) === -1) {
                    row.hide();
                }
            });
        }
    });

    $("#reset-filter").on("click", function clearFilter() {
        $("#filter").val("");
        contactsTable.find('tr').show();
    });
});