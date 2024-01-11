$(function () {
    let contacts = [];
    let selectedRows = [];
    let contactsCount = 0;
    let contactsTable = $(".contacts-table-body");

    function escapeHTML(html) {
        const div = document.createElement("div");
        div.innerText = html;
        return div.innerHTML;
    }

    function validateForm() {
        let isValid = true;
        const fields = ["last-name", "first-name", "phone-number"];

        for (const field of fields) {
            const currentField = $("#" + field);
            const value = currentField.val().trim();

            if (value === "") {
                currentField.addClass("error");
                currentField.after(`<p class="validation-message">Please fill out the field.</p>`);
                isValid = false;
            }
        }

        return isValid;
    }

    function resetForm() {
        $("#lastName, #firstName, #phoneNumber").val("");
        $("form input").removeClass("error");
        $(".add-contact-form .validation-message").remove();
    }

    function updateRowIndexes() {
        const remainingRows = contactsTable.children();

        remainingRows.each(function (i) {
            const currentRow = $(this);

            currentRow.find(".contact-number").text(i + 1);
            currentRow.prop("id", `row-index-${i}`);
            currentRow.find("[data-index]").attr("data-index", i);
        });
    }


    function deleteRows(indices) {
        for (let i = indices.length - 1; i >= 0; i--) {
            const selectedIndex = indices[i];
            const selectedRow = $(`#row-index-${selectedIndex}`);

            if (selectedRow.is(":visible")) {
                selectedRow.remove();
                delete contacts[selectedIndex];
                contactsCount--;
            }
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


            const row = `<tr id="row-index-${contactsCount}">
                <td><input type="checkbox" class="select-row" data-index="${contactsCount}" /></td>
                <td class="contact-number">${contactsCount + 1}</td>
                <td>${escapeHTML(lastName)}</td>
                <td>${escapeHTML(firstName)}</td>
                <td>${escapeHTML(phoneNumber)}</td>
                <td>
                    <button class="delete-contact" data-index="${contactsCount}">Delete</button>
                    <button class="edit-contact" data-index="${contactsCount}">Edit</button>
                </td>
            </tr>`;

            contactsCount++;
            $("#last-name, #first-name, #phone-number").val("");

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
            const deletedRow = $(`#row-index-${index}`);
            deletedRow.remove();
            contactsCount--;
            contacts.splice(index, 1);
            selectedRows = selectedRows
                .filter(item => item !== index)
                .map(function (value) {
                    return value - 1;
                });
            updateRowIndexes();
        });
    });

    $(document).on("click", ".delete-selected-contacts-button", function () {
        if (selectedRows.length > 0) {
            showConfirmationDialog(function () {
                deleteRows(selectedRows);
                selectedRows = [];
                updateRowIndexes();
            });
        }
    });

    $(document).on("click", ".edit-contact", function () {
        let editIndex = $(this).data("index");

        const contactToEdit = contacts[editIndex];
        const editedRow = `
            <tr id="row-index-${editIndex}">
                <td><input type="checkbox" class="select-row" data-index="${editIndex}" /></td>
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
                <td><input type="checkbox" class="select-row" data-index="${index}" /></td>
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

        $(".contacts-table-body .validation-message").remove();
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
                <td><input type="checkbox" class="select-row" data-index="${index}" /></td>
                <td class="contact-number">${index + 1}</td>
                <td>${escapeHTML(lastName)}</td>
                <td>${escapeHTML(firstName)}</td>
                <td>${escapeHTML(phoneNumber)}</td>
                <td>
                    <button class="delete-contact" data-index="${index}">Delete</button>
                    <button class="edit-contact" data-index="${index}">Edit</button>
                </td>
            </tr>`;

        $(`#row-index-${index}`).replaceWith(editedRow);
        contacts[index] = {lastName, firstName, phoneNumber};
    });

    $(document).on("change", ".select-row", function () {
        const index = $(this).data("index");

        if ($(this).prop("checked")) {
            selectedRows.push(index);
        } else {
            selectedRows = selectedRows.filter(row => row !== index);
        }
    });

    $("#select-all-rows").change(function () {
        const isChecked = $(this).prop("checked");
        $(".select-row").prop("checked", isChecked);
        selectedRows = isChecked ? Array.from({length: contacts.length}, (_, i) => i) : [];
    });

    $("#apply-filter").click(function () {
        const filterText = $("#filter").val().toLowerCase();
        const contactsTable = $(".contacts-table-body");

        contactsTable.find("tr").each(function () {
            const row = $(this);
            const rowText = row.text().toLowerCase();
            const isRowContainsFilteredText = rowText.includes(filterText);

            if (isRowContainsFilteredText) {
                row.show();
                return;
            }

            const isRowBeingEdited = row.find(".edit-field").length > 0;

            if (isRowBeingEdited) {
                const editedValuesMatchFilter = row.find(".edit-field").filter(function () {
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
});