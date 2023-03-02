<template lang="pug">
div
    h1  {{ moment().format('DD MMMM YYYY') }}
    p {{ }} 6 people working today.
    dailyCalendar
</template>

<script lang="ts">
import Vue from 'vue';
import '@mdi/font/css/materialdesignicons.css'
import moment from 'moment'
import dailyCalendar from '@/components/global/dailyCalendar.vue'
import Schedule from '@/components/admin/Schedule.vue'
import {formattedSchedule, schedule} from '@/interfaces/GlobalTypes'

export default Vue.extend({
    name: 'adminHomeView',
    components: {
        dailyCalendar,
        Schedule
    },
    data() { 
        return {

        };
    },
    methods:{
        moment: function () {
            return moment()
        }

    },
})
</script>

<style scoped>

</style>