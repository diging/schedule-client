<template lang="pug">
v-card(class="pa-10 ma-auto" width="400")
    v-alert(
        v-if="message"
        :type="msgType"
        v-model= "message"
        :value = "!!message"
    ) {{ message }}
    v-btn(icon medium to="/")
        v-icon mdi-arrow-left
    div(class="text-center")
        h2(class="mb-8") Create an account.
        v-form(ref="form" @keydown.enter="post()")
            v-text-field(v-model='firstname' label="First Name" required)
            v-text-field(v-model='lastname' label="Last Name" required)
            v-text-field(v-model='email' label="ASU Email" required)
            v-text-field(
                v-model='password'
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                label="Password"
                :rules="[rules.required, rules.min]"
			    counter
			    :alertMessage="show1 ? 'text' : 'password'"
			    :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                required
            )
            v-text-field(
                v-model='retype'
                class="mb-5"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                label="Retype password"
                :rules="[rules.required, rules.min]"
			    counter
			    :alertMessage="show2 ? 'text' : 'password'"
			    :type="show2 ? 'text' : 'password'"
                @click:append="show2 = !show2"
                required
            )
            v-btn(color="#F2594B" class="white--text" medium @click="post()") Create
</template>

<script lang="ts">
import { AxiosError, AxiosResponse } from 'axios';
import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import Component from 'vue-class-component'

@Component({
	name: 'createAccount',
})

export default class createAccount extends Vue {
    private firstname: string = ''
    private email: string = ''
    private lastname: string = ''
    private password: string = ''
    private retype: string = ''
    private show1: boolean = false
    private show2: boolean = false
    private message: string = ''
    private msgType: string = 'primary'

    rules = {
		required: (value: any) => !!value || 'Required.',
		min: (v: string|any[]) => v.length >= 8 || 'Min 8 characters',
		emailMatch: () => 'The email and password you entered don\'t match',
	}

    post() {
        if(this.retype==this.password) {
            this.$axios.post('/accounts/signup', {
                email: this.email,
                first_name: this.firstname,
                last_name: this.lastname,
                password: this.password,
            })
            .then( (context: any) => {
                localStorage.setItem('access_token', context.data['access'])
                localStorage.setItem('refresh_token', context.data['refresh'])
                this.msgType = 'success';
                this.message = context.data['message']
                setTimeout(() => {this.$router.push({name: 'Signin'})}, 4000)
            })
            .catch((error: AxiosError) => {
                console.log("AXIOS ERROR: ", error)
                console.log("ERROR RESPONSE: ", error.response)
                if (error.response && error.response.data && error.response.data.message) {
					this.message = error.response.data.message;
				} else if (error.response && error.response.data.password) {
					this.message = error.response.data.password[0];
				} else {
					this.message = `Error while performing request - ${error.message}`;
				}
				this.msgType = 'error';
            })
        }
    }

}
</script>

<style scoped>

</style>