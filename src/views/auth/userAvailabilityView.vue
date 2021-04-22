<template lang="pug">
    div
        editSchedule
</template>

<script lang="ts">
import Vue from 'vue'
import editSchedule from '@/components/global/editSchedule.vue'

export default Vue.extend({
    name: 'userAvailabilityView',
    components: {
        editSchedule,
    }
})
</script>


<style scoped>

</style>