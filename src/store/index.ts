import Vue from 'vue'
import Vuex, { MutationTree } from 'vuex';
import { timePickerType, time } from '@/interfaces/timePickerTypes'
import { RootState } from '@/interfaces/GlobalTypes'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const initialState: RootState = {
  schedule: {
    Monday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
    Tuesday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
    Wednesday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
    Thursday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
    Friday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'}
  },
  user: {}
}

const mutations: MutationTree<RootState> = {
	setTime(state: RootState, timePickerValue: timePickerType ) {
		state.schedule[timePickerValue['day']][timePickerValue['name'] as 'startTime1' | 'startTime2'| 'endTime1' | 'endTime2'] = timePickerValue['time'];
	},
	setUser(state: RootState, user) {
		state.user = user
	}
}

export default new Vuex.Store({
  plugins: [createPersistedState({
	storage: window.sessionStorage,
})],
  state: initialState, 
  mutations,
  getters: {
    timeValues: state => {
      return state.schedule
    },
	getUser: state => {
		return state.user
	}
  },
  actions: {
  },
  modules: {
  }
})
