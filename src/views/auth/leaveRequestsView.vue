<template lang="pug">
div
    requestsTable
</template>

<script lang="ts">
import Vue from 'vue'
import requestsTable from '@/components/global/requestsTable.vue'

export default Vue.extend({
    components: {
        requestsTable,
    }
})
</script>

<style scoped>

</style>