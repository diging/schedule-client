<template lang="pug">
    div
        requestForm
        requestsTable
</template>

<script lang="ts">
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import requestForm from '@/components/global/requestForm.vue'
import requestsTable from '@/components/global/requestsTable.vue'

export default Vue.extend({
    name: 'userLeaveRequestsView',
    components: {
        requestForm,
        requestsTable,
    },
})
</script>

<style scoped>

</style>