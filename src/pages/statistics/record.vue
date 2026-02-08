<template>
    <div class="battle-container">
        <!-- 团队战绩表格-->
        <transition name="table-height">
            <div class="team-battle-section">
                <h3 class="section-title">团队战绩</h3>
                <el-table :data="teamTableData" max-height="260" 
                    :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" style="width: 100%"
                    class="team-table center-table">
                    <!-- 第一列：团队信息类别 -->
                    <el-table-column prop="columnName" :label="teamStatHead[0]" width="180" fixed>
                        <template #default="{ row }">
                            <span class="team-column-name">{{ row.columnName }}</span>
                        </template>
                    </el-table-column>

                    <!-- 动态日期列 -->
                    <el-table-column v-for="(date, index) in teamStatHead.slice(1)" :key="'team-' + index" :label="date"
                        width="120">
                        <template #default="{ row, $index }">
                            <template v-if="teamBattleRows[index]">
                                <!-- 对方团名 -->
                                <template v-if="$index === 0">
                                    <span class="team-name">{{ teamBattleRows[index].enemyTeamName }}</span>
                                </template>

                                <!-- 本方战绩 -->
                                <template v-else-if="$index === 1">
                                    <el-tag :type="getBattleResultType(teamBattleRows[index].state)" size="large">
                                        {{ formatBattleResult(teamBattleRows[index].state) }}
                                    </el-tag>
                                </template>

                                <!-- 战后排名 -->
                                <template v-else-if="$index === 2">
                                    <span class="team-rank">#{{ teamBattleRows[index].teamRank }}</span>
                                </template>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </transition>

        <!-- 团员战绩表格-->
        <transition name="table-height">
            <div class="user-battle-section">
                <h3 class="section-title">团员战绩</h3>
                <el-table :data="userTableData" :max-height="userTabletableMaxHeight"
                    :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" style="width: 100%"
                    class="user-table center-table" :row-class-name="setUserRowClass">
                    <!-- 第一列：用户名 -->
                    <el-table-column prop="name" :label="userStatHead[0]" width="180" fixed>
                        <template #default="{ row }">
                            <span class="user-name">{{ row.userName }}</span>
                        </template>
                    </el-table-column>

                    <!-- 动态日期列 -->
                    <el-table-column v-for="(date, index) in userStatHead.slice(1)" :key="'user-' + index" :label="date"
                        width="120">
                        <template #default="{ row, $index }">
                            <template v-if="row.scores && row.scores[index]">
                                <el-tooltip :content="getCompleteAttackText(row.scores[index].completeAttack)"
                                    placement="top">
                                    <!-- 根据出刀情况展示分数 -->
                                    <span v-if="row.scores[index].completeAttack === 1" class="score-red-slash">/</span>
                                    <span v-else-if="row.scores[index].completeAttack === 2" class="score-yellow">
                                        {{ formatScore(row.scores[index].score) }}
                                    </span>
                                    <span v-else class="score-normal">
                                        {{ formatScore(row.scores[index].score) }}
                                    </span>
                                </el-tooltip>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { queryUserRecord, queryTeamRecord } from '@/api/manager'
import { useStore } from 'vuex'
import { useFullscreen } from '@vueuse/core'

const store = useStore()
const { isFullscreen } = useFullscreen()

// 团队战绩数据
const teamRecord = ref({})
const teamStatHead = computed(() => teamRecord.value.statHead || [])
const teamBattleRows = computed(() => teamRecord.value.teamBattleRows || [])
const teamColumns = computed(() => teamRecord.value.teamColumns || [])

// 团员战绩数据
const userRecord = ref({})
const userStatHead = computed(() => userRecord.value.statHead || [])
const userStatRows = computed(() => userRecord.value.userStatRows || [])

onMounted(async () => {
    // 查询团队战绩
    if (store.state.teamRecord) {
        teamRecord.value = store.state.teamRecord
    } else {
        const res = await queryTeamRecord()
        teamRecord.value = res
        store.commit("setTeamRecord", teamRecord.value)
    }

    // 查询团员战绩
    if (store.state.userRecord) {
        userRecord.value = store.state.userRecord
    } else {
        const res = await queryUserRecord()
        userRecord.value = res
        store.commit("setUserRecord", userRecord.value)
    }
})

// 格式化分数
const formatScore = (score) => {
    if (score == null) return '-'
    if (score >= 0) return `${score}`
    return score.toString()
}
const getCompleteAttackText = (completeAttack) => {
    switch (completeAttack) {
        case 1:
            return '未出刀'
        case 2:
            return '未出完刀'
        case 3:
            return '满刀'
        default:
            return ''
    }
}

const formatBattleResult = (state) => {
    return state === 0 ? '胜利' : '失败'
}

const getBattleResultType = (state) => {
    return state === 0 ? 'success' : 'danger'
}

const userTabletableMaxHeight = computed(() => {
    return isFullscreen.value ? 556 : 380;
})

// 团队表格数据
const teamTableData = computed(() => {
    return teamColumns.value.map(columnName => ({
        type: 'team',
        columnName: columnName
    }))
})

// 团员表格数据
const userTableData = computed(() => {
    return userStatRows.value.map(user => ({
        type: 'user',
        name: user.userName,
        userName: user.userName,
        scores: user.scores || [],
        userId: user.userId
    }))
})

// 设置行类名
const setUserRowClass = ({ row }) => {
    return 'user-row'
}
</script>

<style scoped>
.battle-container {
    @apply flex flex-col gap-6;
    padding: 20px;
}

.team-battle-section,
.user-battle-section {
    @apply flex flex-col;
}

.section-title {
    @apply text-lg font-semibold mb-3;
    color: #303133;
}

.team-battle-section {
    margin-bottom: 24px;
}

/*表格第一列背景蓝色*/
:deep(.team-table .el-table__row td:first-child),
:deep(.user-table .el-table__row td:first-child) {
    background-color: #f0f9ff;
    font-weight: 500;
}

/* 通用表格样式 */
:deep(.el-table) {
    font-size: 14px;
}

:deep(.el-table th) {
    font-weight: 600;
    color: #333;
}

:deep(.el-table .cell) {
    padding: 8px 12px;
}

/* 分数样式 */
.score-red-slash {
    color: #f56c6c;
    font-size: 18px;
}

.score-yellow {
    color: #e6a23c;
    font-weight: bold;
}

.score-normal {
    color: #333;
    font-weight: 500;
}

/* 用户名样式 */
.user-name {
    font-weight: 500;
}

/* 团队信息样式 */
.team-column-name {
    color: #303133;
    font-weight: 500;
}

.team-name {
    color: #409eff;
    font-weight: 500;
}

.team-rank {
    color: #909399;
    font-weight: 500;
}

/* 团队表格额外样式 */
/* :deep(.team-table) {
    border: 1px solid #ebeef5;
    border-radius: 4px;
} */

/*单元格文字居中*/
.center-table :deep(.cell) {
    text-align: center !important;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 表格高度过渡动画 */
.table-height-enter-active,
.table-height-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.table-height-enter-from,
.table-height-leave-to {
    opacity: 0.9;
    transform: translateY(-10px);
}

/* 响应式调整 */
@media (max-width: 768px) {
    .battle-container {
        padding: 10px;
    }

    .section-title {
        font-size: 16px;
    }

    :deep(.el-table) {
        font-size: 13px;
    }
}
</style>