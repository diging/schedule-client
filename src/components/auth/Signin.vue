<template lang="pug">
    v-card(class="pa-10 ma-auto text-center" width="300")
        h2(class="mb-8") Welcome.
        <div v-if="errorMessage">
            <v-alert color="error">
                type="Oops error logging in"
            </v-alert>
        </div>
        v-form(ref="form")
            v-text-field(v-model="email" label="ASU Email" required)
            v-text-field(class="mb-5" v-model="password" label="Password" required
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show1 = !show1"
                :rules="[rules.required, rules.min]" counter
                :type="show1 ? 'text' : 'password'")
            v-btn(color="#F2594B" class="white--text mb-5" medium @click="login()") Sign In
            v-btn(plain medium to="createAccount") Create Account

</template>

<script lang="ts">
import Vue from 'vue';
import '@mdi/font/css/materialdesignicons.css'
import Component from 'vue-class-component';
import jwt_decode from "jwt-decode";

@Component({
	name: 'Signin',
})

export default class Signin extends Vue {

	private email: string='';
	private password: string='';
	private show1: boolean = false;
	private errorMessage: boolean=false;
	

	rules = {
		required: (value: any) => !!value || 'Required.',
		min: (v: string|any[]) => v.length >= 8 || 'Min 8 characters',
		emailMatch: () => (`The email and password you entered don't match`),
	}

	async setUserInfo() {
		 this.$axios.get('/accounts/user/info/')
		.then( (result) => {
			this.$store.commit('setUser', result.data)
		})
		.then(() => {
			if(this.$store.getters.getUser.is_superuser) {
				this.$router.push({name: 'adminHome'});
			} else {
				this.$router.push({name: 'userHome'});
			}
		})
		.catch(function (error: any) {
			console.log(error);
		})
	}

	login() {
		let catchCallback = function() {
			this.errorMessage = true;
		};
		catchCallback = catchCallback.bind(this);
		if(this.email != "" && this.password != "") {
			this.$axios.post('/token/', {
				email: this.email,
				password: this.password,
			})
			.then((result) => {
				localStorage.setItem('token', result.data.access);
				Vue.$axios.defaults.headers.common.Authorization = `Bearer ${result.data.access}`;
				this.setUserInfo()
			})
			.catch(catchCallback);
		} else {
			console.log("A username and password must be present");
		}
	}
}
</script>

<style scoped>

</style>
