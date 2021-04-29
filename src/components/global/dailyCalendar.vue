<template lang="pug">
    v-row(class="fill-height")
        v-col
            v-sheet(height="64")
                v-toolbar(flat)
                    v-btn(outlined class="mr-4" color="grey darken-2" @click="setToday()") Today
                    v-btn(fab text small color="grey darken-2" @click="prev()")
                        v-icon(small) mdi-chevron-left
                    v-btn(fab text small color="grey darken-2" @click="next()")
                        v-icon(small) mdi-chevron-right
                    v-toolbar-title(v-if="$refs.calendar") {{ $refs.calendar.title }}
            v-spacer
            v-sheet(height="600")
                v-calendar(ref="calendar" v-model="focus" color="#F2594B" type="category" category-show-all 
                    :events="events" event-color="#F2594B" @change="" :categories="categories")
</template>

<script lang="ts">
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import Component from 'vue-class-component';

@Component({
    name: 'dailyCalendar',
})

export default class dailyCalendar extends Vue{
 
    private focus: string = '';
    private events: any = [];
    names = ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'];
    categories = ['John Smith', 'Tori Walker'];
    private schedules: any = [];

    created() {
        this.$axios.get('/schedules/list/', {
            params: {

            }
        })
        .then(response => {
            this.schedules=response.data;
            console.log(this.schedules);
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