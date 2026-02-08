<template>
    <div class="f-menu" :style="{ width: $store.state.asideWidth }">
        <el-menu :collapse="isCollapse" :default-active="defaultActive" class="border-0" @select="handleSelect"
            :collapse-transition="false">
            <template v-for="(item, index) in asideMenus" :key="index">
                <el-sub-menu v-if="item.childList && item.childList.length > 0" :index="item.name">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item v-for="(item2, index2) in item.childList" :key="index2" :index="item2.frontPath">
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
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { onMounted } from 'vue'
import { queryMenu } from '@/api/manager'

const router = useRouter()
const route = useRoute()
const defaultActive = ref(route.path)
const store = useStore()

const asideMenus = ref([])
const handleSelect = (e) => {
    router.push(e)
}

//是否折叠
const isCollapse = computed(() => !(store.state.asideWidth == '250px'))

onMounted(async () => {
    // 如果数据未加载，则获取数据
    if (store.state.menus.length === 0) {
        const res = await queryMenu()
        asideMenus.value = res
        store.commit("setMenus", asideMenus.value)
    } else {
        asideMenus.value = store.state.menus
    }
})
</script>

<style>
.f-menu {
    transition: all 0.1s;
    top: 64px;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    @apply shadow fixed;
}

.f-menu::-webkit-scrollbar {
    width: 0px;
}
</style>
