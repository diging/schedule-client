<template lang="pug">
    v-card(class="pa-10 ma-auto" width="400")
        v-btn(icon medium to="/") 
            v-icon mdi-arrow-left
        div(class="text-center")
            h2(class="mb-8") Create an account.
            v-form(ref="form")
                v-text-field(v-model='firstname' label="First Name" required)
                v-text-field(v-model='lastname' label="Last Name" required)
                v-text-field(v-model='email' label="ASU Email" required)
                v-text-field(v-model='password' label="Password" required)
                v-text-field(class="mb-5" label="Retype password" required)
                v-btn(color="#F2594B" class="white--text" medium @click="post()") Create
</template>

<script lang="ts">
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import Component from 'vue-class-component';
import store from '@/store';

@Component({
	name: 'createAccount',
})

export default class createAccount extends Vue{
    private firstname: string = '';
    private email: string = '';
    private lastname: string = '';
    private password: string = '';

    post() {
        this.$axios.post('/accounts/signup', {
            email: this.email,
            first_name: this.firstname,
            last_name: this.lastname,
            password: this.password,
        })
        .then(function (response: any) {
            console.log(response);
        })
        .catch(function (error: any) {
            console.log(error);
        })
    }

}
</script>

<style scoped>

</style>