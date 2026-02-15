<template>
    <div class="f-header">
        <span class="logo ml-50">
            <el-icon class="mr-6 w-8 h-8">
                <img src="@/assets/icons/logo.png" alt="" />
            </el-icon>
            菊爆之家
        </span>
        <el-icon class="icon-btn" @click="menuStore.handleAsideWidth">
            <Expand v-if="menuStore.isAsideCollapsed" />
            <fold v-else />
        </el-icon>
        <div class="ml-auto flex items-center mr-60">
            <el-icon class="icon-btn" @click="toggle">
                <full-screen v-if="!isFullscreen" />
                <aim v-else />
            </el-icon>
            <el-icon class="icon-btn" @click="toggleDark()">
                <sunny v-if="!isDark" />
                <moon v-else />
            </el-icon>
        </div>
    </div>
</template>

<style>
.f-header {
    @apply flex items-center fixed top-0 left-0 right-0;
    @apply bg-[#fcfcfc] border-b border-gray-200;
    color: rgb(31, 41, 55);
    height: 64px;
    /*内容不会溢出*/
    z-index: 1000;
}

.logo {
    width: 250px;
    @apply flex justify-center items-center text-xl lg:text-2xl font-semibold;
    min-width: 180px;
}

.icon-btn {
    @apply flex justify-center items-center;
    width: 42px;
    height: 64px;
    cursor: pointer;
}
</style>

<script setup>
import { useFullscreen, useDark, useToggle } from '@vueuse/core'
import {useMenuStore} from '@/stores/menu'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const { isFullscreen, toggle } = useFullscreen()
const menuStore = useMenuStore()
</script>
