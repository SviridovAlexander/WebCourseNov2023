<template>
  <div ref="editModal" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit menu</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="editName" class="form-label">Name</label>
            <input v-model="editName" type="text" class="form-control" id="editName" placeholder="Name">
          </div>
          <div class="mb-3">
            <label for="editPhone" class="form-label">Phone</label>
            <input v-model="editPhone" type="text" class="form-control" id="editPhone" placeholder="Phone">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button @click="onOk" type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { Modal } from "bootstrap";

export default {
  name: "EditContactModal",
  data() {
    return {
      modal: null,
      id: null,
      editName: "",
      editPhone: "",
    };
  },

  mounted() {
    this.modal = new Modal(this.$refs.editModal, {});
  },

  methods: {
    show() {
      this.modal.show();
    },

    hide() {
      this.modal.hide();
    },

    onOk() {
      const updatedContact = {
        id: this.id,
        name: this.editName,
        phone: this.editPhone,
      };
      this.$emit("ok", updatedContact);
    },
  },
};
</script>