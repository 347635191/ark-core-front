import { createStore } from 'vuex'

const store = createStore({
  state () {
    return {
        // 侧边宽度
        asideWidth: "250px",

        // 菜单
        menus:[],
        
        // 团员战绩
        userRecord: null,

        // 团队
        teamRecord: null
    }
  },
  mutations: {
    // 展开或缩起侧边栏
    handleAsideWidth(state){
        state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px"
    },
    setMenus(state, menus){
        state.menus = menus
    },
    setUserRecord(state, userRecord){
        state.userRecord = userRecord
    },
    setTeamRecord(state, teamRecord){
        state.teamRecord = teamRecord
    }
  }
})

export default store