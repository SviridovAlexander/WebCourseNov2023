<template>
    <div ref="errorModal" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <span>Error</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    {{errorMessage}}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {Modal} from "bootstrap";

export default {
    name: "ErrorModal",

    data() {
        return {
            modal: null
        };
    },

    props:{
        errorMessage: String
    },

    mounted() {
        this.modal = new Modal(this.$refs.errorModal, {});
    },

    methods: {
        show() {
            this.modal.show();
        },

        hide() {
            this.modal.hide();
        },
    }
}
</script>