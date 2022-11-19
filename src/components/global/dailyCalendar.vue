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
                :categories="categories"
                :events="events"
                :event-color="getEventColor"
                @change="fetchEvents")

</template>

<script lang="ts">
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import Component from 'vue-class-component'
import {ScheduleBase}  from '@/components/Bases/ScheduleBase'

@Component({
    name: 'dailyCalendar',
    extends: ScheduleBase
})

export default class dailyCalendar extends ScheduleBase {

    private focus: string = ''
    private events: { [key: string]: string | Date | boolean }[] = []
    private colors: string[] = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1']
    private names: string[] = ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party']
    private categories: string[] = ['John Smith', 'Tori Walker']
    private hours: {[key: string]: any}[] = []

	created() {
		this.$axios.get('/schedules/test/')
		.then(response => {
            const schedule = JSON.parse(response.data)
            this.workerHours(schedule, this.hours)
            console.log(this.hours)
            // this.$axios.post('/schedules/create2/', {
            //     schedule: response.data
            // })
            // .then(response => {
            //     //console.log(response.data)
            // })
		})
		.catch(function (error: any) {
			console.log(error)
		})
		.then(function () {
			// always executed
		})
	}

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

    fetchEvents({ start, end }: any) {
        const events: any[] = []

        const min = new Date(`${start.date}T00:00:00`)
        const max = new Date(`${end.date}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000
        const eventCount = this.rnd(days, days + 20)

        for (let i = 0; i < eventCount; i++) {
          const allDay = this.rnd(0, 3) === 0
          const firstTimestamp = this.rnd(min.getTime(), max.getTime())
          const first = new Date(firstTimestamp - (firstTimestamp % 900000))
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
          const second = new Date(first.getTime() + secondTimestamp)

          events.push({
            name: this.names[this.rnd(0, this.names.length - 1)],
            start: first,
            end: second,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            timed: !allDay,
            category: this.categories[this.rnd(0, this.categories.length - 1)],
          })
        }

        this.events = events
        //console.log(this.events)
    }

    rnd(a: number, b: number) {
        return Math.floor((b - a + 1) * Math.random()) + a
    }
    
}
</script>

<style scoped>

</style>