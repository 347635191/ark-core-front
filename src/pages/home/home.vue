<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8" :offset="0">
                <IndexCharts />
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import IndexCharts from '@/components/indexCharts.vue';
</script>
