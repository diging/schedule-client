<template lang="pug">
    div
        requestsTable
</template>

<script lang="ts">
import Vue from 'vue'
import requestForm from '@/components/global/requestForm.vue'
import requestsTable from '@/components/global/requestsTable.vue'

export default Vue.extend({
    components: {
        requestForm,
        requestsTable,
    }
})
</script>

<style scoped>

</style>