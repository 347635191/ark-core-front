<template>
  <el-container>
    <el-header>
      <header-view />
    </el-header>
    <el-container>
      <el-aside :width="$store.state.asideWidth">
        <menu-view />
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import headerView from '@/components/headerView.vue';
import menuView from '@/components/menuView.vue';
</script>

<style>
.el-aside {
  transition: all 0.2s;
}
</style>