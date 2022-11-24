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
            v-calendar(ref="calendar"
                v-model="focus"
                color="primary"
                type="category"
                category-show-all
                :categories="student_workers"
                :events="events"
                :event-color="getEventColor"
                @change="fetchEvents")

</template>

<script lang="ts">
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import Component from 'vue-class-component'
import {schedule} from '@/interfaces/GlobalTypes'
import {ScheduleBase}  from '@/components/Bases/ScheduleBase'

@Component({
    name: 'dailyCalendar',
    extends: ScheduleBase
})

export default class dailyCalendar extends ScheduleBase {

    private focus: string = ''
    private events: { [key: string]: string | Date | boolean }[] = []
    private colors: string[] = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1']
    //private names: string[] = ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party']
    private student_workers: string[] = ['Tushar', 'Charishma', 'Prachi', 'Baishali', 'Swetalina', 'Vishnu', 'Pratik']
   //private student_workers: string[] = []
    private hours: { [key: string]: any } = {}
    private schedules: schedule[] = []
    private days = ['mon', 'tue', 'wed', 'thu', 'fri']

	// created() {
	// 	this.$axios.get('/schedules/test/')
	// 	.then(response => {
    //         //console.log(response.data)
    //         const schedule = JSON.parse(response.data)
    //         this.schedules.push(schedule)
    //         for (var sched of this.schedules) {
    //             //console.log(sched)
    //             this.workerHours(sched, this.hours)
    //         }
    //         console.log(this.hours.mon_start_1)
    //         console.log(Object.keys(this.hours))
    //         var date = new Date(this.hours.mon_start_1)
    //         //console.log(date)
    //         //console.log(typeof date)
    //         // this.$axios.post('/schedules/create2/', {
    //         //     schedule: response.data
    //         // })
    //         // .then(response => {
    //         //     //console.log(response.data)
    //         // })
	// 	})
	// 	.catch(function (error: any) {
	// 		console.log(error)
	// 	})
	// 	.then(function () {
	// 		// always executed
	// 	})
	// }

    mounted() {
        (this.$refs.calendar as Vue & {checkChange: () => void}).checkChange()
    }

    getEventColor(event: any) {
        return event.color
    }

    setToday() {
        this.focus = ''
    }

    prev() {
        (this.$refs.calendar as Vue & {prev: () => void}).prev()
    }
    
    next() {
        (this.$refs.calendar as Vue & {next: () => void}).next()
    }

    //Working on rendering events correctly
    //Detecting which weekday and selecting indexing appropriate day abbrev
    fetchEvents({ start, end }: any) {
        const events: any[] = []
        this.$axios.get('/schedules/test/')
		.then(response => {
            const schedule: schedule = response.data
            //const schedule: schedule = JSON.parse(response.data)
            this.schedules.push(schedule)
            for (var sched of this.schedules) {
                this.workerHours(sched, this.hours)
                for(var day in this.days) {
                    console.log(start.weekday)
                    console.log(end)
                    events.push({
                        start: new Date(start.date.toString().concat('T', this.hours[`${day}_start_1`])),                                                                                            
                        end: new Date(end.date.toString().concat('T', this.hours[`${day}_end_1`])),
                        color: this.colors[this.rnd(0, this.colors.length - 1)],
                        timed: true,
                        category: this.student_workers[0],
                    })
                }
            }

            this.events = events
            //console.log(this.events)
        })
		.catch(function (error: any) {
			console.log(error)
		})
		.then(function () {
			// always executed
            
        })

        
    }

    rnd(a: number, b: number) {
        return Math.floor((b - a + 1) * Math.random()) + a
    }
    
}
</script>

<style scoped>

</style>