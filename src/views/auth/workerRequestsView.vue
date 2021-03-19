<template lang="pug">
      requestForm
</template>

<script lang="ts">
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import requestForm from '@/components/global/requestForm.vue'

export default Vue.extend({
    name: 'workerRequestsView',
    components: {
        requestForm,
    },
})
</script>

<style scoped>

</style>