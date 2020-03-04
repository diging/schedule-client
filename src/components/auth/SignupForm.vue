<template lang="pug">
	v-row(align="center" justify="center")
		v-col(cols="6")
			v-card
				v-form(ref="signUpForm" v-model="valid" v-on:keyup.enter.native="signUp")
					v-card-title#title Sign Up
					v-card-text
						v-text-field(class="mt-4" label="First Name" required outlined v-model="firstName" :rules="[() => !!firstName || 'First Name Required.']")
						v-text-field(class="mt-4" label="Middle Name" outlined v-model="middleName")
						v-text-field(class="mt-4" label="Last Name" required outlined v-model="lastName" :rules="[() => !!lastName || 'Last Name Required.']")
						v-text-field(class="mt-4" label="Email" required outlined v-model="email" :rules="[() => !!email || 'Email Address Required.']")
						v-text-field(label="Password" required outlined password :type="show ? 'text' : 'password'" :append-icon="show ? 'visibility' : 'visibility_off'" @click:append="show = !show" v-model="password" :rules="[() => !!password || 'Password Required.']")
					v-card-actions()
						div(class="flex-grow-1")    
						v-btn(class="mr-4" color="teal" :disabled="!valid" large depressed @click="signUp") Sign Up
</template>

<script lang="ts">
import { VForm } from '@/interfaces/GlobalTypes';
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
@Component({
  name: 'SignUpForm',
})
export default class SignUpForm extends Vue {
  private password: string = '';
  private email: string = '';
  private firstName: string = '';
  private middleName: string = '';
  private lastName: string = '';
  private show: boolean = false;
  private error: boolean = false;
  private valid: boolean = false;
  public async signUp(): Promise<void> {
	if ((this.$refs.signUpForm as VForm).validate()) {
	axios.post('http://localhost:8000/api/v1/accounts/signup',
		{
			email: this.email,
			password: this.password,
			first_name: this.firstName,
			middle_name: this.middleName,
			last_name: this.lastName
		}
	)
	.then((result) => {
		this.$root.$data.loggedIn = true;
		console.log(result.data)
		localStorage.setItem('token', result.data.access);
		Vue.$axios.defaults.headers.common.Authorization = `Bearer ${result.data.access}`;
		this.$router.push('link');
	})
	.catch((error) => {
		// TODO: deal with errors
		this.error = true;
	});
	}
  }
}
</script>

<style scoped>
.project-item {
	padding: 0;
	margin: 10px 0;
}
#title {
	background: grey;
}
</style>