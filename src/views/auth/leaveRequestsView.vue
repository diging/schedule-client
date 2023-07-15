<template lang="pug">
div
    requestForm(@show-alert="showAlert")
    requestsTable
    v-alert(
        v-if="message"
        :type="msgType"
        v-model= "message"
        :value = "!!message"
    ) {{ message }}
</template>

<script lang="ts">
import Vue from 'vue'
import requestsTable from '@/components/global/requestsTable.vue'
import requestForm from '@/components/global/requestForm.vue'
import { Component, Prop, Watch } from 'vue-property-decorator'

export default Vue.extend({
    components: {
        requestsTable,
        requestForm
    },
    data() { 
        return {
            message: "",
            msgType: ""
        };
    },
    methods: {
        showAlert: function(alertParams: string[]) {
            this.message = alertParams[0]
            this.msgType = alertParams[1]
        }
    },
})


</script>

<style scoped>

</style>