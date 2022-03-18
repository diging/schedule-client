<template lang="pug">
div
  h3.mb-5 Users
  v-card
    v-card-title
        v-text-field(v-model="search" append-icon="mdi-magnify" label="Search (Case Sensitive)" single-line hide-details @input="updateSearchData")
    v-data-table.elevation-1(
      :headers="headers",
      :items="filteredUsers",
      :items-per-page="usersPerRow",
      item-key="id",
      :loading="loading",
      :loading-text="loadingText",
      :sort-by="['first_name']",
      :sort-desc="[false]",
    )
      template(v-slot:item.actions="{ item }")
          v-btn(v-if="item.is_superuser" @click="updateUser(item, false)") De-Activate
          v-btn(v-if="item.is_superuser===false" @click="updateUser(item, true)") Activate
</template>
<script lang="ts">
import "@mdi/font/css/materialdesignicons.css";
import { Component, Vue } from "vue-property-decorator";
import { User } from "@/interfaces/GlobalTypes";

const axios = require("axios");

@Component({
  name: "UserView",
})
export default class UserView extends Vue {
  private singleSelect: boolean = false;
  private selected: User[] = [];
  private loading: boolean = false;
  private loadingText: string = "loading...";
  private usersPerRow: number = 10;
  private id: number = 0;
  private search: string = "";

  private users: User[] = [];

  private filteredUsers: User[] = [];

  headers = [
    { text: "First Name", value: "first_name" },
    { text: "Last Name", value: "last_name" },
    { text: "Full Name", value: "full_name" },
    { text: "Email", value: "email" },
    { text: "Super User", value: "is_superuser" },
    { text: "Activate/De-activate", value: "actions" },
    //d-none must have leading space in string to work. Hide from table but id is still attached
    { text: "Id", value: "id", align: " d-none" },
  ];



  created() {
    this.loading = true;
    this.$axios
      .get("/accounts/users/list/")
      .then((response) => {
        response.data.forEach((user: { [x: string]: string }) => {
          this.userFormat(user);
        });
        this.filteredUsers = this.users;
        this.loading = false;
        console.log(this.loading);
      })
      .catch(function (error: any) {
        console.log(error);
      })
  }

  userFormat(user: any) {
    let formatUser: User = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      full_name: user.full_name,
      last_name: user.last_name,
      is_superuser: user.is_superuser,
    };
    this.users.push(formatUser);
  }

  updateUser(item: any, is_super: boolean) {
    this.$axios.patch('/accounts/users/' + item.id, {
			'is_superuser': is_super,
		})
		.then((response: any) => {
			var updateUser = this.users.findIndex(x => x.id ===item.id);
			this.users[updateUser]['is_superuser'] = is_super;
		})
		.catch(function (error: any) {
			console.log(error);
		})
	}

  updateSearchData() {
    this.filteredUsers = this.users.filter((itm) => {
      return (itm.first_name.includes(this.search) || itm.last_name.includes(this.search) || itm.full_name.includes(this.search) || itm.email.includes(this.search));
    });
  }
}
</script>

<style scoped>
</style>