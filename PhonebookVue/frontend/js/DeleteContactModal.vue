<template>
  <div ref="deleteModal" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">
            <slot name="header"></slot>
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button @click="onOk" type="button" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import {Modal} from "bootstrap";

export default {
  name: "DeleteContactModal",
  data() {
    return {
      modal: null
    };
  },

  mounted() {
    this.modal = new Modal(this.$refs.deleteModal, {});
  },

  methods: {
    show() {
      this.modal.show();
    },

    hide() {
      this.modal.hide();
    },

    onOk() {
      this.$emit("ok");
    }
  }
};
</script>

