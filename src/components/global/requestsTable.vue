<template lang="pug">
    div()
        v-data-table.mt-10(:headers="headers" :items="requests" :items-per-page="5" show-select class="elevation-1" :single-select="singleSelect1")
            template(v-slot:item.submission_date="{ item }")
                td {{ formattedDate(item) }}
            template(v-slot:item.status="{ item }")
                v-chip(dark :color="getColor(item.status)") {{ item.status }}
            template(v-slot:item.action="{ item }")
                v-btn.mr-2(fab small dark color="green darken-2" @click="submit('Approved', item)")
                    v-icon mdi-check
                v-dialog(v-model="dialog" width="400")
                    template(v-slot:activator="{ on, attrs }") 
                        v-btn(fab small dark color="red lighten-1" v-bind="attrs" v-on="on")
                            v-icon mdi-close
                    v-card.pa-5
                        h3.mb-5 Reason for declining?
                        v-textarea(v-model="declineReason" outlined)
                        v-divider
                        v-card-actions
                            v-spacer
                            v-btn(text @click="dialog=false") Cancel
                            v-btn(color="#F2594B" dark @click="submit('Declined', item)") Decline 
                        
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import '@mdi/font/css/materialdesignicons.css';
import { timeoffRequest } from '@/interfaces/timePickerTypes';
import moment from 'moment';

@Component({
    name: 'requestsTable',
})

export default class requestsTable extends Vue{
    private user: string = '';
    private admin: string = '';    
    private requests: any = [];
    private singleSelect1: boolean = false;
    private selected: any = [];
    private headers: any = [];
    private dialog: boolean = false;
    private declineReason: string= '';
    private modifiedRequests: any = [];

    submit(status: string, item: any) {
        this.$axios.patch('/timeoff/'+item.id+'/review_user_timeoff_request/', {
            status: status,
            reason: this.declineReason,
        })
        .then(function (response: any) {
			console.log(response);
		})
		.catch(function (error: any) {
			console.log(error);
		})
    }

    created() {
        if(this.$route.path == '/userLeaveRequests') {
            this.$axios.get('/timeoff/user/', {
                params: {

                }
            }) 
            .then(response => {
                this.requests=response.data;
                this.requests.map((request: timeoffRequest) => this.formattedDateTime(request) );
            })
            .catch(function (error: any) {
                console.log(error);
            })
            .then(function () {
                // always executed
            }); 

            this.headers = [ 
                { text: 'Request type', value: 'timeoff_type' },
                { text: 'From', value: 'from_date' },
                { text: 'To', value: 'to_date' },
                { text: 'Reason', value: 'description' },
                { text: 'STATUS', value: 'status' },
            ]
        }

        else if(this.$route.path == '/adminLeaveRequests') {
            this.$axios.get('/timeoff/all/', {
                params: {

                }
            }) 
            .then(response => {
                this.requests=response.data;
                console.log(this.requests);
            })
            .catch(function (error: any) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });

            this.headers = [ 
                { text: 'Applicant', value: 'user' },
                { text: 'Submitted on', value: 'submission_date' },
                { text: 'Request type', value: 'timeoff_type' },
                { text: 'From', value: 'from_date' },
                { text: 'To', value: 'to_date' },
                { text: 'Reason', value: 'description' },
                { text: 'STATUS', value: 'status' },
                { text: 'Action', value: 'action' },
            ]
        }
    }

    formattedDate(item: any) {
        var date = moment(item.submission_date);
        var dateComponent = date.utc().format('MM/DD/YYYY');
        return dateComponent;
    }

    formattedDateTime(item: timeoffRequest) {
        if(item.start_time) {
            let start_datetime = moment(item.from_date + " " + item.start_time);
            let end_datetime = moment(item.to_date + " " + item.end_time);
            item.from_date = start_datetime.format('YYYY-MM-DD hh:mm a');
            item.to_date = end_datetime.format('YYYY-MM-DD hh:mm a');
        }
        return item
    }


    getColor (status: string) {
        if (status == 'pending') return 'grey'
        else if (status == 'Approved') return 'green darken-2'
        else return 'red lighten-1'
    }
}
</script>

<style scoped>

</style>