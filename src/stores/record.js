import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useRecordStore = defineStore('main', () => {
  // 团员战绩
  const userRecord = ref(null)
  // 团队战绩
  const teamRecord = ref(null)

  const setUserRecord = (record) => {
    userRecord.value = record
  }

  const setTeamRecord = (record) => {
    teamRecord.value = record
  }

  return {
    userRecord,
    teamRecord,
    setUserRecord,
    setTeamRecord
  }
})