<template>
    <el-card shadow="never">
        <template #header>
            <div class="flex justify-between">
                <span class="text-sm">佣兵团排名</span>
                <div>
                    <el-check-tag v-for="(item, index) in options" :key="index" :checked="current == item.value"
                        style="margin-right: 8px" @click="handleChoose(item.value)">
                        {{ item.text }}
                    </el-check-tag>
                </div>
            </div>
        </template>
        <div ref="el" id="chart" style="width: 100%; height: 300px;"></div>
    </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
import { queryTeamRank } from '@/api/manager';
import { useResizeObserver } from '@vueuse/core';

const current = ref("");
const generateMonthOptions = (count = 3, startOffset = 0) => {
    const options = [];
    const now = new Date();

    for (let i = startOffset + count - 1; i >= startOffset; i--) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1;
        const monthStr = month < 10 ? `0${month}` : month.toString();

        options.push({
            text: `${year}.${month}`,
            value: `${year}-${monthStr}`
        });
    }

    return options;
};

const options = generateMonthOptions(3, 0);
current.value = options[options.length - 1].value;

const handleChoose = (type) => {
    current.value = type
    loadData()
}

var myChart = null
onMounted(() => {
    var chartDom = document.getElementById('chart');
    myChart = echarts.init(chartDom);
    loadData()
})

function loadData() {
    let option = {
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
            }
        ]
    };
    myChart.showLoading()
    queryTeamRank(current.value).then(res => {
        option.xAxis.data = res.dateX
        option.series[0].data = res.rankY
        myChart.setOption(option)
    }).finally(() => {
        myChart.hideLoading()
    })
}

onBeforeUnmount(() => {
    if (myChart) echarts.dispose(myChart)
})

//响应式缩放
const el = ref(null)
useResizeObserver(el, (entries) => myChart.resize())
</script>