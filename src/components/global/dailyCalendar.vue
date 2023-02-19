<template lang="pug">
div
    v-sheet(tile height="64" class="d-flex")
        v-toolbar(flat)
            v-select(
                v-model="type"
                :items="types"
                dense
                outlined
                hide-details
                class="ma-2"
                label="type"
            )
            v-btn(outlined class="mr-4" color="grey darken-2" @click="setToday()") Today
            v-btn(fab text small color="grey darken-2" @click="prev()")
                v-icon(small) mdi-chevron-left
            v-btn(fab text small color="grey darken-2" @click="next()")
                v-icon(small) mdi-chevron-right
            v-toolbar-title(v-if="$refs.calendar") {{ $refs.calendar.title }}
    v-sheet(height="1100")
        v-calendar(ref="calendar"
            v-model="focus"
            color="primary"
            type="category"
            :type="type"
            category-show-all
            :categories="student_workers"
            :events="events"
            :event-color="getEventColor"
            @change="fetchSchedules")

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
    private student_workers: string[] = []
    private hours: { [key: string]: any } = {}
    private days = ['mon', 'tue', 'wed', 'thu', 'fri']
    private types = ["month", "day"]
    private type = "month"

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

    fetchSchedules({ start, end }: any) {
        const events: any[] = []
        this.student_workers = []
        this.$axios.get('/schedules/list/')
		.then(response => {
            response.data.forEach((schedule: schedule) => {
                if (!this.student_workers.includes(schedule.user.full_name)) {
                    this.student_workers.push(schedule.user.full_name)
                }
                this.workerHours(schedule, this.hours)
                events.push({
                    start: new Date(start.date.toString().concat('T', this.hours[`${this.days[start.weekday-1]}_start_1`])),
                    end: new Date(start.date.toString().concat('T', this.hours[`${this.days[start.weekday-1]}_end_1`])),
                    color: this.colors[this.rnd(0, this.colors.length - 1)],
                    timed: true,
                    category: schedule.user.full_name,
                })
            })
            this.events = events
        })
        this.$axios.get('/schedules/list/')
		.then(response => {
            response.data.forEach((schedule: schedule) => {
                if (!this.student_workers.includes(schedule.user.full_name)) {
                    this.student_workers.push(schedule.user.full_name)
                }
                this.workerHours(schedule, this.hours)
                events.push({
                    start: new Date(start.date.toString().concat('T', this.hours[`${this.days[start.weekday-1]}_start_1`])),
                    end: new Date(start.date.toString().concat('T', this.hours[`${this.days[start.weekday-1]}_end_1`])),
                    color: this.colors[this.rnd(0, this.colors.length - 1)],
                    timed: true,
                    category: schedule.user.full_name,
                })
            })
            this.events = events
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