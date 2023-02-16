<template lang="pug">
div
    Schedule
</template>

<script lang="ts">
import Vue from 'vue'
import Schedule from '@/components/admin/Schedule.vue'

export default Vue.extend({
    name: 'ScheduleAdminView',
    components: {
        Schedule,
    }
})
</script>


<style scoped>

</style>