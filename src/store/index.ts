import Vue from 'vue'
import Vuex, { MutationTree } from 'vuex'
import { timePickerType, time } from '@/interfaces/timePickerTypes'
import { RootState } from '@/interfaces/GlobalTypes'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

const initialState: RootState = {
  schedule: {
    Monday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
    Tuesday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
    Wednesday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
    Thursday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
    Friday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'}
  },
  date: {},
  user: {}
}

const initialSchedule = {
  Monday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
  Tuesday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
  Wednesday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
  Thursday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'},
  Friday: { startTime1: '00:00', endTime1: '00:00', startTime2: '00:00', endTime2: '00:00'}
}

const mutations: MutationTree<RootState> = {
	setTime(state: RootState, timePickerValue: timePickerType) {
		state.schedule[timePickerValue['day']][timePickerValue['name'] as 'startTime1' | 'startTime2' | 'endTime1' | 'endTime2'] = timePickerValue['time']
	},
  setDate(state: RootState, date) {
    state.date = date
  },
	setUser(state: RootState, user) {
		state.user = user
	},
  resetSchedule(state) {
    state.schedule = {...initialSchedule}
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
    dateValue: state => {
      return state.date
    },
    getUser: state => {
      return state.user
    },
    getDaySched: (state) => (day: string) => {
      return state.schedule[day]
    }
  },
  actions: {
  },
  modules: {
  }
})
