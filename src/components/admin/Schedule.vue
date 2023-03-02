<template lang="pug">
div
    h3.mb-5 Schedules
    v-data-table(:headers="headers"
        :items="schedules"
        :items-per-page="itemsPerRow"
        item-key='id'
        class="elevation-1"
        :single-select="singleSelect"
        :loading='loading'
        :loading-text="loadingText"
        :sort-by="['created']"
        :sort-desc="[true]"
    )

</template>

<script lang="ts">
import '@mdi/font/css/materialdesignicons.css'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import Vuex from 'vuex'
import timePicker from '@/components/global/timePicker.vue'
import {formattedSchedule, schedule} from '@/interfaces/GlobalTypes'
import {ScheduleBase}  from '@/components/Bases/ScheduleBase'

const axios = require('axios')

@Component({
    name: 'Schedule',
    components: {
        timePicker,
    },
    extends: ScheduleBase
})

export default class Schedule extends ScheduleBase {

    private schedules: formattedSchedule[] = []
    private singleSelect: boolean = false
    private loading: boolean = false
	private loadingText: string = 'The sched-o-matic is working hard on your request'
    private itemsPerRow: number = 10

    headers = [
        {text: 'Submitted', value: 'created'},
        {text: 'Name', value: 'name'},
        {text: 'Monday', value: 'mon'},
        {text: 'Tuesday', value: 'tue'},
        {text: 'Wednesday', value: 'wed'},
        {text: 'Thursday', value: 'thu'},
        {text: 'Friday', value: 'fri'},
        {text: 'Total Hours', value: 'total_hours'},
        //d-none must have leading space in string to work. Hide from table but id is still attached
        {text: 'Id', value: 'id', align: ' d-none'}
    ]

    constructor() {
        super()
    }

    created() {
		this.loading = true
		this.$axios.get('schedules/list/')
		.then(response => {
			response.data.forEach((sched: schedule) => {
				this.formatScheduleTime(sched, this.schedules)
			})
			this.loading = false
		})
		.catch(function (error: any) {
			console.log(error)
		})
		.then(function () {
			// always executed
		})
	}
}

</script>

<style scoped>

</style>