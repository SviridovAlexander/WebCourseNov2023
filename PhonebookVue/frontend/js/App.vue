<template>
  <div class="container my-2" id="app">
    <h1 class="mb-3">PhoneBook</h1>
    <form @submit.prevent="createContact" class="mb-3">
      <h2 class="h5">Create contact</h2>

      <div class="row row-cols-4 g-3 form-group has-error">
        <div>
          <input v-model="name" type="text" class="form-control" placeholder="Name"
                 :class="{ 'is-invalid': nameError }">
          <div v-if="nameError" class="text-danger">Name is required</div>
        </div>
        <div>
          <input v-model="phone" type="text" class="form-control" placeholder="Phone"
                 :class="{ 'is-invalid': phoneError }">
          <div v-if="phoneError" class="text-danger">Phone is required</div>
        </div>
        <div>
          <button class="btn btn-primary">Create</button>
        </div>
      </div>
    </form>
    <form @submit.prevent="loadContacts" class="mb-3">
      <h2 class="h5">Search contacts</h2>

      <div class="row row-cols-lg-auto g-3 align-items-center">
        <div class="col-12">
          <input v-model="term" type="text" class="form-control" placeholder="Search text">
        </div>
        <div class="col-12">
          <button class="btn btn-primary">Search</button>
        </div>
      </div>
    </form>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Phone</th>
          <th></th>
        </tr>
        </thead>
        <tbody v-cloak>
        <tr class="text-break" v-for="(contact, index) in contacts" :key="contact.id">
          <td v-text="index + 1"></td>
          <td v-text="contact.name"></td>
          <td v-text="contact.phone"></td>
          <td class="d-flex justify-content-end">
            <button @click="showDeleteContactConfirmModal(contact)" class="btn btn-danger me-2" type="button">Delete
            </button>
            <button @click="showEditContactModal(contact)" class="btn btn-primary" type="button">Edit</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <delete-contact-modal ref="deleteConfirmModal" @ok="deleteContact">
      <template #header>Delete confirmation</template>
      <template #body>Do you really want to delete this contact?</template>
    </delete-contact-modal>
    <edit-contact-modal ref="editModal" @ok="updateContact"></edit-contact-modal>
  </div>
</template>


<script>
import PhoneBookService from "./phoneBookService";
import DeleteContactModal from "./DeleteContactModal.vue";
import EditContactModal from "./EditContactModal.vue";

export default {
  name: "App",

  components: {
    DeleteContactModal,
    EditContactModal
  },

  data() {
    return {
      contacts: [],
      term: "",
      name: "",
      phone: "",
      service: new PhoneBookService(),
      contactToDelete: null,
      editName: "",
      editPhone: "",
      nameError: false,
      phoneError: false
    };
  },

  created() {
    this.loadContacts();
  },

  methods: {
    createContact() {
      this.nameError = false;
      this.phoneError = false;

      if (!this.name) {
        this.nameError = true;
      }

      if (!this.phone) {
        this.phoneError = true;
      }

      if (this.name && this.phone) {
        const contact = {
          name: this.name,
          phone: this.phone
        };

        this.service.createContact(contact).then(response => {
          if (!response.success) {
            alert(response.message);
            return;
          }

          this.name = "";
          this.phone = "";

          this.loadContacts();
        }).catch(() => alert("Couldn't load contacts"));
      }
    },

    showDeleteContactConfirmModal(contact) {
      this.contactToDelete = contact;
      this.$refs.deleteConfirmModal.show();
    },

    deleteContact() {
      this.service.deleteContact(this.contactToDelete.id).then(response => {
        if (!response.success) {
          alert(response.message);
          return
        }

        this.$refs.deleteConfirmModal.hide();
        this.loadContacts();
      }).catch(() => alert("Couldn't load contacts"));
    },

    loadContacts() {
      this.service.getContacts(this.term.trim()).then(contacts => {
        this.contacts = contacts;
      }).catch(() => alert("Couldn't load contacts"));
    },

    showEditContactModal(contact) {
      this.$refs.editModal.id = contact.id;
      this.$refs.editModal.editName = contact.name;
      this.$refs.editModal.editPhone = contact.phone;
      this.$refs.editModal.show();
    },

    updateContact(updatedContact) {
      this.service.updateContact(updatedContact).then(response => {
        if (!response.success) {
          alert(response.message);
          return;
        }

        this.$refs.editModal.hide();
        this.loadContacts();
      }).catch(() => alert("Couldn't update contact"));
    },
  }
}
</script>