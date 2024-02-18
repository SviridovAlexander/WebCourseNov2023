<template>
    <div class="container my-2" id="app">
        <h1 class="mb-3">PhoneBook</h1>
        <form @submit.prevent="createContact" class="mb-3">
            <h2 class="h5">Create contact</h2>

            <div class="row row-cols-2 row-cols-md-3 g-3 form-group has-error">
                <div>
                    <input v-model.trim="name"
                           type="text"
                           class="form-control"
                           placeholder="Name"
                           :class="{ 'is-invalid': hasNameError }">
                    <div v-if="hasNameError" class="text-danger">Name is required</div>
                </div>
                <div>
                    <input v-model.trim="phone"
                           type="text"
                           class="form-control"
                           placeholder="Phone"
                           :class="{ 'is-invalid': hasPhoneError }">
                    <div v-if="hasPhoneError" class="text-danger">Phone is required</div>
                </div>
                <div>
                    <button class="btn btn-primary">Create</button>
                </div>
            </div>
        </form>
        <form @submit.prevent="loadContacts" class="mb-3">
            <h2 class="h5">Search contacts</h2>

            <div class="row row-cols-md-3 g-3 align-items-center">
                <div>
                    <input v-model="term" type="text" class="form-control" placeholder="Search text">
                </div>
                <div>
                    <button class="btn btn-primary">Search</button>
                </div>
            </div>
        </form>
        <button
            v-if="hasSelectedContacts"
            @click="showDeleteContactsConfirmModal"
            class="btn btn-danger mt-3"
            type="button">
            Delete Selected Contacts
        </button>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Select</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th></th>
                </tr>
                </thead>
                <tbody v-cloak>
                <tr v-for="(contact, index) in contacts" :key="contact.id" class="text-break">
                    <td v-text="index + 1"></td>
                    <td>
                        <input type="checkbox" v-model="contact.selected">
                    </td>
                    <td v-text="contact.name"></td>
                    <td v-text="contact.phone"></td>
                    <td class="d-flex justify-content-end">
                        <button @click="showDeleteContactConfirmModal(contact)" class="btn btn-danger me-2"
                                type="button">
                            Delete
                        </button>
                        <button @click="showEditContactModal(contact)" class="btn btn-primary" type="button">
                            Edit
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <delete-contact-modal ref="deleteContactConfirmModal" @ok="deleteContact">
            <template #header>Delete confirmation</template>
            <template #body>Do you really want to delete this contact?</template>
        </delete-contact-modal>
        <delete-contact-modal ref="deleteContactsConfirmModal" @ok="deleteSelectedContacts">
            <template #header>Delete confirmation</template>
            <template #body>Do you really want to delete selected contacts?</template>
        </delete-contact-modal>
        <edit-contact-modal
            ref="editModal"
            @ok="updateContact"
            :id="contactIdToEdit"
            :initial-name="contactNameToEdit"
            :initial-phone="contactPhoneToEdit"
        >
        </edit-contact-modal>
        <ErrorModal
            ref="errorModal"
            :error-message="errorMessage"
        >
        </ErrorModal>
    </div>
</template>

<script>
import PhoneBookService from "./phoneBookService";
import DeleteContactModal from "./DeleteContactModal.vue";
import EditContactModal from "./EditContactModal.vue";
import ErrorModal from "./ErrorModal.vue";

export default {
    name: "App",

    components: {
        DeleteContactModal,
        EditContactModal,
        ErrorModal
    },

    data() {
        return {
            contacts: [],
            term: "",
            name: "",
            phone: "",
            service: new PhoneBookService(),
            contactToDelete: null,
            hasNameError: false,
            hasPhoneError: false,
            contactIdToEdit: null,
            contactNameToEdit: null,
            contactPhoneToEdit: null,
            errorMessage: ""
        };
    },

    created() {
        this.loadContacts();
    },

    methods: {
        createContact() {
            this.hasNameError = false;
            this.hasPhoneError = false;

            if (!this.name) {
                this.hasNameError = true;
            }

            if (!this.phone) {
                this.hasPhoneError = true;
            }

            if (!(this.name && this.phone)) {
                return;
            }

            const contact = {
                name: this.name,
                phone: this.phone
            };
            this.service.createContact(contact).then(response => {
                if (!response.success) {
                    this.errorMessage = response.message;
                    this.$refs.errorModal.show();
                    return;
                }

                this.name = "";
                this.phone = "";

                this.loadContacts();
            }).catch(() => alert("Couldn't create contact"));
        },

        deleteContact() {
            this.service.deleteContact(this.contactToDelete.id).then(response => {
                if (!response.success) {
                    this.errorMessage = response.message;
                    this.$refs.errorModal.show();
                    return;
                }

                this.$refs.deleteContactConfirmModal.hide();
                this.loadContacts();
            }).catch(() => alert("Couldn't delete contact"));
        },

        deleteSelectedContacts() {
            const selectedContacts = this.contacts.filter(contact => contact.selected);

            const deletePromises = selectedContacts.map(contact => {
                return this.service.deleteContact(contact.id);
            });

            Promise.all(deletePromises)
                .then(() => {
                    this.loadContacts();
                    this.$refs.deleteContactsConfirmModal.hide();
                })
                .catch(() => alert("Couldn't delete selected contacts"));
        },

        loadContacts() {
            this.service.getContacts(this.term.trim()).then(contacts => {
                this.contacts = contacts;
            }).catch(() => alert("Couldn't load contacts"));
        },

        updateContact(updatedContact) {
            this.service.updateContact(updatedContact).then(response => {
                if (!response.success) {
                    this.errorMessage = response.message;
                    this.$refs.errorModal.show();
                    return;
                }

                this.$refs.editModal.hide();
                this.loadContacts();
            }).catch(() => alert("Couldn't update contact"));
        },

        showDeleteContactConfirmModal(contact) {
            this.contactToDelete = contact;
            this.$refs.deleteContactConfirmModal.show();
        },

        showDeleteContactsConfirmModal() {
            this.$refs.deleteContactsConfirmModal.show();
        },


        showEditContactModal(contact) {
            this.contactIdToEdit = contact.id;
            this.contactNameToEdit = contact.name;
            this.contactPhoneToEdit = contact.phone;
            this.$refs.editModal.show();
        },
    },

    computed: {
        hasSelectedContacts() {
            return this.contacts.some(contact => contact.selected);
        },
    },
}
</script>