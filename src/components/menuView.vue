<template>
    <div class="f-menu" :style="{ width: menuStore.asideWidth }">
        <el-menu 
            :collapse="menuStore.isAsideCollapsed" 
            :default-active="defaultActive" 
            class="border-0" 
            @select="handleSelect"
            :collapse-transition="false"
        >
            <template v-for="(item, index) in menuStore.asideMenus" :key="index">
                <el-sub-menu v-if="item.childList && item.childList.length > 0" :index="item.name">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item 
                        v-for="(item2, index2) in item.childList" 
                        :key="index2" 
                        :index="item2.frontPath"
                    >
                        <el-icon>
                            <component :is="item2.icon"></component>
                        </el-icon>
                        <span>{{ item2.name }}</span>
                    </el-menu-item>
                </el-sub-menu>

                <el-menu-item v-else :index="item.frontPath">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { queryMenu } from '@/api/manager'
import { useMenuStore } from '@/stores/menu'

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const defaultActive = ref(route.path)

const handleSelect = (e) => {
    router.push(e)
}

onMounted(async () => {
    // 如果数据未加载，则获取数据
    if (menuStore.asideMenus.length === 0) {
        const res = await queryMenu()
        menuStore.setAsideMenus(res)
    }
})
</script>