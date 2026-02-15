<template>
  <el-container>
    <el-header>
      <header-view />
    </el-header>
    <el-container>
      <el-aside :width="menuStore.asideWidth">
        <menu-view />
      </el-aside>
      <el-main>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"></component>
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import headerView from '@/components/headerView.vue';
import menuView from '@/components/menuView.vue';
import {useMenuStore} from '@/stores/menu'

const menuStore = useMenuStore()
</script>

<style>
.el-aside {
  transition: all 0.2s;
}
</style>