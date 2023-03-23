<template lang="pug">
v-dialog(v-model="dialog" max-width="500px")
    template(v-slot:activator="{ on, attrs }")
        v-btn(color="#F2594B" class="white--text" medium v-bind="attrs" v-on="on")
            v-icon mdi-plus
            span Add Employee
    v-card(class="pa-5")
        h4(class="text-center") Add new employee.
        v-container
            v-col(cols="12")
                v-text-field(v-model="Name" label="Name")
            v-col(cols="12")
                v-menu(ref="joinDate" v-model="menu" :close-on-content-click="false" :return-value.sync="dateFrom"
                        transition="scale-transition" offset-y min-width="auto")
                    template(v-slot:activator="{ on, attrs }")
                        v-text-field(v-model="joinDate" label="Date joined" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on")
                    v-date-picker(v-model="joinDate" no-title scrollable)
                        v-spacer
                        v-btn(text color="grey" @click="joinDate = false") Cancel
                        v-btn(text color="#F2594B" @click="$refs.joinDate.save(joinDate)") OK
            v-col(cols="12")
                v-text-field(v-model="Role" label="Role")
                        
        v-card-actions
            v-spacer
            v-btn(color="grey" text @click="dialog = false") Cancel
            v-btn(color="#F2594B" medium class="white--text" @click="dialog = false") Add

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

@Component({
    name: 'addEmployee',
})

export default class addEmployee extends Vue{
    private menu: string = '';
    private dialog: boolean = false;
    private joinDate: string = '';
    
}
</script>

<style scoped>

</style>