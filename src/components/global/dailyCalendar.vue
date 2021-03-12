<template lang="pug">
    v-row(class="fill-height")
        v-col
            v-sheet(height="64")
                v-toolbar(flat)
                    v-btn(outlined class="mr-4" color="grey darken-2" @click="setToday") Today
                    v-btn(fab text small color="grey darken-2" @click="prev")
                        v-icon(small) mdi-chevron-left
                    v-btn(fab text small color="grey darken-2" @click="next")
                        v-icon(small) mdi-chevron-right
                    v-toolbar-title(v-if="$refs.calendar") {{ $refs.calendar.title }}
            v-spacer
            v-sheet(height="600")
                v-calendar(ref="calendar" v-model="focus" color="primary" type="category" category-show-all 
                    :categories="categories" :events="events" :event-color="getEventColor" @change="fetchEvents")
</template>

<script lang="ts">
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'

export default Vue.extend({
    name: 'dailyCalendar',
    data: () => ({
      focus: '',
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      categories: ['John Smith', 'Tori Walker'],
    }),
});
</script>

<style scoped>

</style>