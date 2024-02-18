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
                        <label for="editNameModel" class="form-label">Name</label>
                        <input v-model.trim="editNameModel"
                               type="text" class="form-control"
                               id="editNameModel"
                               placeholder="Name"
                               :class="{ 'is-invalid': hasNameError }"
                        >
                        <div v-if="hasNameError" class="text-danger">Name is required</div>
                    </div>
                    <div class="mb-3">
                        <label for="editPhoneModel" class="form-label">Phone</label>
                        <input v-model.trim="editPhoneModel"
                               type="text"
                               class="form-control"
                               id="editPhoneModel"
                               placeholder="Phone"
                               :class="{ 'is-invalid': hasPhoneError }"
                        >
                        <div v-if="hasPhoneError" class="text-danger">Phone is required</div>
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
import {Modal} from "bootstrap";

export default {
    emits: ['updateContact'],

    name: "EditContactModal",

    data() {
        return {
            modal: null,
            editNameModel: "",
            editPhoneModel: "",
            hasNameError: false,
            hasPhoneError: false,
        };
    },

    props: {
        id: {
            type: Number,
        },
        initialName: {
            type: String,
        },
        initialPhone: {
            type: String,
        }
    },

    mounted() {
        this.modal = new Modal(this.$refs.editModal, {});
    },

    methods: {
        show() {
            this.hasNameError = false;
            this.hasPhoneError = false;
            this.modal.show();
        },

        hide() {
            this.modal.hide();
        },

        onOk() {
            if (!this.editNameModel) {
                this.hasNameError = true;
            }

            if (!this.editPhoneModel) {
                this.hasPhoneError = true;
            }

            if (!(this.editNameModel && this.editPhoneModel)) {
                return;
            }

            const updatedContact = {
                id: this.id,
                name: this.editNameModel,
                phone: this.editPhoneModel,
            };

            this.$emit("ok", updatedContact);
        }
    },

    watch: {
        initialName(val) {
            return  this.editNameModel = val;
        },
        initialPhone(val) {
            return  this.editPhoneModel = val;
        },
    },
};
</script>