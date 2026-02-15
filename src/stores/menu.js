import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  // 侧边宽度
  const asideWidth = ref("250px")
  // 菜单 
  const asideMenus = ref([])

  const setAsideMenus = (menus) => {
    asideMenus.value = menus
  }

  // 展开或缩起侧边栏
  const handleAsideWidth = () => {
    asideWidth.value = asideWidth.value == "250px" ? "64px" : "250px"
  }

  const isAsideCollapsed = computed(() => asideWidth.value == "64px")

  return {
    asideWidth,
    asideMenus,
    setAsideMenus,
    handleAsideWidth,
    isAsideCollapsed
  }
})