<template lang="pug">
div
    requestsTable
</template>

<script lang="ts">
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import requestsTable from '@/components/global/requestsTable.vue'

export default Vue.extend({
    name: 'workerRequestsView',
    components: {
        requestsTable,
    },
})


</script>

<style scoped>

</style>