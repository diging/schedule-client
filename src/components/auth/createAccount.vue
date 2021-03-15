<template lang="pug">
    v-card(class="pa-10 ma-auto" width="400")
        v-btn(icon medium to="/") 
            v-icon mdi-arrow-left
        div(class="text-center")
            h2(class="mb-8") Create an account.
            v-form(ref="form")
                v-text-field( label="Username" required)
                v-text-field( label="ASU Email" required)
                v-text-field( label="Password" required)
                v-text-field(class="mb-5" label="Retype password" required)
                v-btn(color="#F2594B" class="white--text" medium) Create
</template>

<script lang="ts">
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import Component from 'vue-class-component';

@Component({
	name: 'createAccount',
})

export default class createAccount extends Vue{

}
</script>

<style scoped>

</style>