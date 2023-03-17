<template lang="pug">
div
    requestForm
    requestsTable
</template>

<script lang="ts">
import Vue from 'vue'
import requestsTable from '@/components/global/requestsTable.vue'
import requestForm from '@/components/global/requestForm.vue'

export default Vue.extend({
    components: {
        requestsTable,
        requestForm
    }
})
</script>

<style scoped>

</style>