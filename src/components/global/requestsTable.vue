<template lang="pug">
div
    v-card
        v-card-title {{ currentUser }}'s Timeoff Requests
        v-data-table(
            :headers="user" 
            :items="userTimeoff"
            item-key='id'
            :items-per-page="5" 
            show-select 
            class="elevation-1" 
            :single-select="singleSelect1"
            :loading='loading'
            :loading-text="loadingText"
            :sort-by="['created']"
            :sort-desc="[true]"
        )
            template(v-slot:top)
                v-switch(v-model="singleSelect1" label="Single select" class="pa-3")
        v-data-table(
            v-show="isAdmin"
            :headers="admin"
            :items="timeoffRequests"
            item-key='id'
            :items-per-page="5"
            show-select
            class="elevation-1"
            :single-select="singleSelect2"
            :loading='loading'
            :loading-text="loadingText"
            :sort-by="['created']"
            :sort-desc="[true]"
        )
            template(v-slot:top)
                v-switch(v-model="singleSelect2" label="Single select" class="pa-3")
            template(v-slot:item.actions="{ item }")
                v-icon(@click="triggerDialog(item.id, 1)" color="green") mdi-check
                v-icon(@click="denyTimeoff(item.id, 2)" color="red") mdi-cancel
                v-menu(offset-y)
        v-dialog(v-model="dialog" width="500")
            v-card
                v-card-title(class="text-h5 grey lighten-2") Reason
                v-card-text
                    v-textarea.mt-5(v-model="reason" outlined)
                v-divider
                v-card-actions
                    v-spacer
                    v-btn(color="primary" class="secondary--text" text @click="approveTimeoff()") Submit
        timeoffEmailForm(v-if="sendEmail" hidden :toName="requesterName" :fromName="currentUser" :email="requesterEmails[requesterName]" :message="message")
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import {ITimeoff, IFormattedTimeoff} from '@/interfaces/GlobalTypes'
import moment from 'moment'
import { ScheduleBase } from '../Bases/ScheduleBase'
import timeoffEmailForm from '@/components/global/timeoffEmailForm.vue'

@Component({
    name: 'requestsTable',
    components: {
        timeoffEmailForm
    },
    extends: ScheduleBase
})

export default class requestsTable extends ScheduleBase {
    private loading: boolean = false
	private loadingText: string = 'Loading...'
    private timeoffRequests: IFormattedTimeoff[] = []
    private userTimeoff: IFormattedTimeoff[] = []
    private singleSelect1: boolean = false
    private singleSelect2: boolean = false
    private selected: string[] = []
    private status: number = 0
	private id: number = 0
	private dialog: boolean = false
    private reason: string = ""
    private isAdmin: boolean = this.$store.getters.getUser.is_superuser
    private currentUser: string = this.$store.getters.getUser.first_name
    private requesterName: string = ""
    private sendEmail: boolean = false
    private requesterEmails: {[key: string]: string} = {}
    private message: string = ""
    private user: {[key: string]: string}[] = [
            { text: 'Request type', value: 'request_type' },
            { text: 'From', value: 'start_date' },
            { text: 'To', value: 'end_date' },
            { text: 'Start Time', value: 'start_time' },
            { text: 'End Time', value: 'end_time' },
            { text: 'All-Day', value: 'all_day' },
            { text: 'Reason', value: 'reason' },
            { text: 'STATUS', value: 'status' },
            { text: 'Submitted on', value: 'created' },
            { text: 'Id', value: 'id', align: ' d-none' }
        ]
    private admin: {[key: string]: string}[] = [
            { text: 'Applicant', value: 'user' },
            { text: 'Request type', value: 'request_type' },
            { text: 'From', value: 'start_date' },
            { text: 'To', value: 'end_date' },
            { text: 'Start Time', value: 'start_time' },
            { text: 'End Time', value: 'end_time' },
            { text: 'All-Day', value: 'all_day' },
            { text: 'Reason', value: 'reason' },
            { text: 'STATUS', value: 'status' },
            { text: 'Submitted on', value: 'created' },
            {text: 'Approve/Deny', value: 'actions'},
            { text: 'Id', value: 'id', align: ' d-none' }
        ]

    created() {
        let formattedTimeoff: IFormattedTimeoff
        this.$axios.get('/timeoff/user/')
        .then(response => {
            response.data.forEach((timeoff: ITimeoff) => {
                formattedTimeoff = {
                    'id': timeoff.id,
                    'user': timeoff.user.first_name,
                    'start_date': timeoff.start_date,
                    'end_date': timeoff.end_date,
                    'start_time': moment(timeoff.start_time, "hh:mm:ss").format("hh:mm A"),
                    'end_time': moment(timeoff.end_time, "hh:mm:ss").format("hh:mm A"),
                    'all_day': timeoff.all_day,
                    'request_type': timeoff.request_type,
                    'reason': timeoff.reason,
                    'status': this.parseStatus(timeoff.status),
                    'created': moment(timeoff.created).format('MM-DD-YYYY')
                }
                this.userTimeoff.push(formattedTimeoff)
            })
            if(this.isAdmin) {
                this.$axios.get('/timeoff/all/')
                .then(response => {
                    response.data.forEach((timeoff: ITimeoff) => {
                        formattedTimeoff = {
                            'id': timeoff.id,
                            'user': timeoff.user.first_name,
                            'start_date': timeoff.start_date,
                            'end_date': timeoff.end_date,
                            'start_time': moment(timeoff.start_time, "hh:mm:ss").format("hh:mm A"),
                            'end_time': moment(timeoff.end_time, "hh:mm:ss").format("hh:mm A"),
                            'all_day': timeoff.all_day,
                            'request_type': timeoff.request_type,
                            'reason': timeoff.reason,
                            'status': this.parseStatus(timeoff.status),
                            'created': moment(timeoff.created).format('MM-DD-YYYY')
                        }
                        this.requesterEmails[timeoff.user.first_name] = timeoff.user.email
                        this.timeoffRequests.push(formattedTimeoff)
                    })
                    this.loading = false
                })
                .catch(function (error: any) {
                    console.log(error)
                })
            }
        })
        .catch(function (error: any) {
			console.log(error)
		})
	}

    approveTimeoff() {
        this.dialog = false
        this.$axios.patch('/timeoff/'+ this.id + '/review_user_timeoff_request/', {
            'status': this.status,
			'reason': this.reason
        })
		.then((response: any) => {
			var removeIndex = this.timeoffRequests.map(item => item.id).indexOf(this.id)
			this.timeoffRequests[removeIndex]['status'] = this.parseStatus(this.status)
            this.requesterName = this.timeoffRequests[removeIndex]['user']
            this.message = this.writeEmailMessage(this.timeoffRequests[removeIndex])
            this.sendEmail = true
			this.status = 0
			this.reason = ''
			this.id = 0
		})
		.catch((error) => {
			console.log(error)
		})
    }

    writeEmailMessage(timeoffObj: IFormattedTimeoff) {
        let endDate = ""
        if(timeoffObj.end_date != null) {
            endDate = ` to ${timeoffObj.end_date}`
        }
        let newMessage = `Your ${timeoffObj.request_type} request for ${timeoffObj.start_date}${endDate} has been ${timeoffObj.status}`
        return newMessage
    }

    triggerDialog(id: number, status: number) {
		this.dialog = true
		this.id = id
		this.status = status
	}

    denyTimeoff(id: number, status: number) {
        var removeIndex = this.timeoffRequests.map(item => item.id).indexOf(id)
        this.timeoffRequests[removeIndex]['status'] = this.parseStatus(status)
        this.requesterName = this.timeoffRequests[removeIndex]['user']
        this.message = this.writeEmailMessage(this.timeoffRequests[removeIndex])
        this.sendEmail = true
	}
}
</script>

<style scoped>

</style>