<template lang="pug">
div(class="pa-10")
    h1  {{ moment().format('DD MMMM YYYY') }}
    dailyCalendar
</template>

<script lang="ts">
    import Vue from 'vue';
    import '@mdi/font/css/materialdesignicons.css'
    import moment from 'moment'
    import dailyCalendar from '@/components/global/dailyCalendar.vue'

    export default Vue.extend({
        name: 'userHomeView',
        components: {
            dailyCalendar,
        },
        data() { 
            return {

            };
        },
        methods:{
            moment: function () {
                return moment();
            }
        },
    });
</script>

<style scoped>

</style>