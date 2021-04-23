<template lang="pug">
    div()
        v-data-table.mt-10(:headers="headers" :items="requests" :items-per-page="5" show-select class="elevation-1" :single-select="singleSelect1")
            template(slot="items" slot-scope="props" v-if="")
                td 
                    v-btn(fab small color="")
                        v-icon mdi-checkbox
                td
                    div(class="text-center")
                        v-dialog(v-model="dialog" width="400")
                            template(v-slot:activator="{ on, attrs }")
                                v-btn(icon small)
                                    v-icon mdi-times   
                            v-card
                                v-card-title Reason for declining?
                                v-textarea(outlined label="reason" value="Type here....")
                                v-divider
                                v-card-actions 
                                    v-spacer
                                    v-btn(text) Cancel
                                    v-btn(color="") Decline

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

@Component({
    name: 'requestsTable',
})

export default class requestsTable extends Vue{
    private user: string='';
    private admin: string='';    
    private requests: any = [];

    data() {
        return {
            singleSelect1: false,
            selected: [],
            headers: [       
                { text: 'Applicant', value: 'name' },    
                { text: 'Submitted on', value: 'submitted' },
                { text: 'Request type', value: 'type' },
                { text: 'From', value: 'from_date' },
                { text: 'To', value: 'to_date' },
                { text: 'Reason', value: 'description' },
                { text: 'STATUS', value: 'status' },
                { text: 'Action', value: '' },
            ],
        }
    }


    created() {
        this.$axios.get('', {
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
    }
}
</script>

<style scoped>

</style>