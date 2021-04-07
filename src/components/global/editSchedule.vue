<template lang="pug">
    v-dialog(v-model="dialog" max-width="500px")
        template(v-slot:activator="{ on, attrs }")
            v-btn(color="#F2594B" class="white--text" medium v-bind="attrs" v-on="on")
                v-icon mdi-pencil
                span Edit Schedule
        v-card(class="pa-5")
            h4(class="text-center") Edit your schedule.
            v-container
                p(class="body-2 mb-10") Lab hours are from 9:00 AM to 4:30 PM.
                div(v-for="day in days" :key="day")
                    v-row
                        v-col(cols='3')
                            p(class="font-weight-medium body-2") {{day}}
                        v-col(cols='4')
                            timePicker(:startTime1 = 'time' :day='day' :index = 'startTime1')
                        v-col(cols='4') 
                            timePicker(:endTime1 = 'time' :day='day')
                        v-col(cols='1')
                            v-btn(icon color="#F2594B"  v-on:click="isHidden=true") 
                                v-icon mdi-plus-circle-outline
                    v-row(class="mt-n6 mb-4" v-if="isHidden")
                        v-col(cols='3')
                        v-col(cols='4')
                            timePicker(:startTime2 = 'time' :day='day')
                        v-col(cols='4') 
                            timePicker(:endTime2 = 'time' :day='day')
                        v-col(cols='1')
                            
            v-card-actions
                v-spacer
                v-btn(color="grey" text @click="dialog = false") Cancel
                v-btn(color="#F2594B" medium class="white--text" @click="postSched()") Submit

</template>

<script lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Vuex from 'vuex';
import timePicker from '@/components/global/timePicker.vue'
import store from '@/store';

const axios = require('axios')

@Component({
    name: 'editSchedule',
    components: {
        timePicker,
    },
    data() {
        return {
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        }
    },
})

export default class editSchedule extends Vue{
    private isHidden: boolean=false;
    private dialog: boolean=false;

    @Prop() private day: string = '';
    @Prop() private startTime1!: any;
    @Prop() private endTime1!: any;
    @Prop() private startTime2!: any;
    @Prop() private endTime2!: any;

    postSched() {
        axios.post('./schedules/availability/create', {
            schedule: store.getters.timeValues,
        })
        .then(function (response: any) {
            console.log(response);
        })
        .catch(function (error: any) {
            console.log(error);
        })
    }

    getSched() {
        axios.get('/user', {
            params: {
            ID: 12345
            }
        })
        .then(function (response: any) {
            console.log(response);
        })
        .catch(function (error: any) {
            console.log(error);
        })
        .then(function () {
            // always executed
        });  
    }
    
    
}
</script>

<style scoped>

</style>