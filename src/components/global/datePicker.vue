<template lang="pug">
v-row
    v-col(cols="12" sm="6")
        v-date-picker(v-model="dates" multiple)
    v-col(cols="12" sm="6")
        v-menu(
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="dates"
            transition="scale-transition"
            offset-y
            min-width="auto"
        )
            template(v-slot:activator="{ on, attrs }")
                v-combobox(
                    v-model="dates"
                    multiple
                    chips
                    small-chips
                    label="Multiple picker in menu"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                )
            v-date-picker(v-model="dates" multiple no-title scrollable)
                v-spacer
                v-btn(text color="primary" @click="menu = false") Cancel
                v-btn(text color="primary" @click="$refs.menu.save(dates)") OK
</template>

<script lang="ts">
import 'reflect-metadata'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
	name: 'datePicker',
})

export default class datePicker extends Vue {
	private menu2: string = ''

	private dates: string[] = []
	@Prop() index!: string
	@Prop() start!: Boolean

	@Watch('dates')
	watchTime(value: string[], oldValue: string[]) {
		let data = {
			'name': this.index,
			'dates': this.dates,
			'start': this.start
		}
		this.$store.commit('setDate', data)
	}
}

</script>

<style scoped>

</style>