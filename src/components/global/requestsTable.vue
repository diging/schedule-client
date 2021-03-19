<template lang="pug">
    v-data-table(:headers="headers" :items-per-page="5" class="elevation-1")
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

@Component({
    name: 'requestsTable',
})

export default class requestsTable extends Vue{
    private headers: string='';

    data() {
        return {
            headers: [
                {
                    text: 'Request type',
                    align: 'start',
                    value: 'type',
                },
                { text: 'From', value: 'From' },
                { text: 'To', value: 'to' },
                { text: 'Reason', value: 'reason' },
                { text: 'STATUS', value: 'status' },
            ],
        }
    }
}
</script>

<style scoped>

</style>