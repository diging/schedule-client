<template lang="pug">
    v-row
        v-dialog(v-model="dialog" max-width="500px")
            <template v-slot:activator="{ on, attrs }">
                v-btn(color="#F2594B" class="white--text" medium v-bind="attrs" v-on="on")
                    v-icon mdi-plus
                    span New Request
            </template>
            v-card(class="pa-5")
                h4(class="text-center") Leave request form.
                v-card-text
                    v-container
                        v-row
                            v-col(cols="12")
                                v-select(:items="['Time off', 'Sick leave', 'Vacation', 'Additional work hours']" label="Request type*" required)
                            v-col(cols="6")
                                v-menu(ref="menuFrom" v-model="menu" :close-on-content-click="false" :return-value.sync="dateFrom"
                                        transition="scale-transition" offset-y min-width="auto")
                                        <template v-slot:activator="{ on, attrs }">
                                            v-text-field(v-model="dateFrom" label="From" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on")
                                        </template>
                                        v-date-picker(v-model="dateFrom" no-title scrollable)
                                            v-spacer
                                            v-btn(text color="grey" @click="menuFrom = false") Cancel
                                            v-btn(text color="#F2594B" @click="$refs.menuFrom.save(dateFrom)") OK
                            v-col(cols="6")
                                v-menu(ref="menuTo" v-model="menu" :close-on-content-click="false" :return-value.sync="dateTo"
                                        transition="scale-transition" offset-y min-width="auto")
                                        <template v-slot:activator="{ on, attrs }">
                                            v-text-field(v-model="dateTo" label="To" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on")
                                        </template>
                                        v-date-picker(v-model="dateTo" no-title scrollable)
                                            v-spacer
                                            v-btn(text color="grey" @click="menuTo = false") Cancel
                                            v-btn(text color="#F2594B" @click="$refs.menuTo.save(dateTo)") OK
                            v-col(cols="12")
                                v-textarea(outlined name="request description" label="Description")
                v-card-actions
                    v-spacer
                    v-btn(color="grey" text @click="dialog = false") Cancel
                    v-btn(color="#F2594B" medium class="white--text" @click="dialog = false") Submit
    
</template>

<script lang="ts">
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
export default Vue.extend({
    
})
</script>

<style scoped>

</style>